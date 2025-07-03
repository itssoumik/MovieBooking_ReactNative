import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Booking, Seat, Showtime } from "@/types";
import firestore from "@react-native-firebase/firestore";
import { showtimes } from "@/mocks/showtimes";
import { useMovieStore } from "./movie-store";
import { theaters } from "@/mocks/theaters";

interface BookingState {
  bookings: Booking[];
  selectedShowtime: Showtime | null;
  selectedSeats: Seat[];
  availableSeats: Seat[];
  isLoading: boolean;
  error: string | null;

  fetchUserBookings: (userId: string) => Promise<void>;
  selectShowtime: (showtimeId: string) => Promise<void>;
  fetchAvailableSeats: (showtimeId: string) => Promise<void>;
  toggleSeatSelection: (seat: Seat) => void;
  clearSeatSelection: () => void;
  createBooking: (userId: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
}

const generateSeats = (showtimeId: string): Seat[] => {
  const seats: Seat[] = [];
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  rows.forEach(row => {
    for (let i = 1; i <= 10; i++) {
      const type = row > "F" ? "premium" : "standard";
      if (row !== "A" && row !== "B") {
        seats.push({
          id: `${showtimeId}-${row}${i}`,
          row,
          number: i,
          type,
          isAvailable: Math.random() > 0.3
        });
      } else if (row === "A") {
        seats.push({
          id: `${showtimeId}-${row}${i}`,
          row,
          number: i - 2,
          type: [1, 2, 9, 10].includes(i) ? "vanish" : type,
          isAvailable: [1, 2, 9, 10].includes(i) ? false : Math.random() > 0.1
        });
      } else if (row === "B") {
        seats.push({
          id: `${showtimeId}-${row}${i}`,
          row,
          number: i - 1,
          type: [1, 10].includes(i) ? "vanish" : type,
          isAvailable: [1, 10].includes(i) ? false : Math.random() > 0.1
        });
      }
    }
  });
  return seats;
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],
      selectedShowtime: null,
      selectedSeats: [],
      availableSeats: [],
      isLoading: false,
      error: null,

      fetchUserBookings: async (userId: string) => {
        set({ isLoading: true });
        try {
          const snapshot = await firestore()
            .collection("Users")
            .doc(userId)
            .collection("Bookings")
            .get();

          const bookings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Booking[];

          set({ bookings, isLoading: false });
        } catch (err) {
          set({
            error: "Failed to fetch bookings",
            isLoading: false
          });
        }
      },

      selectShowtime: async (showtimeId: string) => {
        set({ isLoading: true, error: null });
        try {
          const showtime = showtimes.find(s => s.id === showtimeId) || null;
          set({ selectedShowtime: showtime, selectedSeats: [], isLoading: false });
          if (showtime) {
            get().fetchAvailableSeats(showtimeId);
          }
        } catch (error) {
          set({ error: "Failed to select showtime", isLoading: false });
        }
      },

      fetchAvailableSeats: async (showtimeId: string) => {
        set({ isLoading: true });
        try {
          await new Promise(res => setTimeout(res, 500));
          set({ availableSeats: generateSeats(showtimeId), isLoading: false });
        } catch {
          set({ error: "Failed to fetch seats", isLoading: false });
        }
      },

      toggleSeatSelection: (seat: Seat) => {
        if (!seat.isAvailable) return;
        const { selectedSeats } = get();
        const exists = selectedSeats.some(s => s.id === seat.id);
        if (exists) {
          set({ selectedSeats: selectedSeats.filter(s => s.id !== seat.id) });
        } else {
          set({ selectedSeats: [...selectedSeats, seat] });
        }
      },

      clearSeatSelection: () => {
        set({ selectedSeats: [], selectedShowtime: null });
      },
createBooking: async (userId: string) => {
  const { selectedShowtime, selectedSeats } = get();
  const { getMovieById } = useMovieStore.getState();

  console.log(">>> createBooking called");
  console.log("User ID:", userId);
  console.log("Selected Showtime:", selectedShowtime);
  console.log("Selected Seats:", selectedSeats);

  if (!userId || !selectedShowtime || selectedSeats.length === 0) {
    console.warn("Missing user ID, showtime, or no seats selected");
    return;
  }

  set({ isLoading: true });

  try {
    // Fetch movie from Firestore
    const movie = await getMovieById(selectedShowtime.movieId);
    if (!movie) throw new Error("Movie not found");

    // Find theater from local file
    const theater = theaters.find(t => t.id === selectedShowtime.theaterId);
    if (!theater) throw new Error("Theater not found");

    const bookingRef = firestore()
      .collection("Users")
      .doc(userId)
      .collection("Bookings")
      .doc();

    // Format date
    const dateObj = new Date(selectedShowtime.date);
    const formattedDay = dateObj.toLocaleDateString("en-US", { weekday: "long" });
    const formattedDate = dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });

    const seatLabels = selectedSeats.map(seat => `${seat.row}${seat.number}`);
    const totalAmount = movie.price * selectedSeats.length+20;

    const bookingData: Booking = {
      id: bookingRef.id,
      userId,
      seats: seatLabels,
      totalAmount,
      bookingDate: new Date().toISOString(),
      status: "confirmed",

      // Firestore flat fields
      poster: movie.poster || "",
      movieName: movie.title,
      backdrop: movie.backdrop || "",
      location: theater.location,
      theater: theater.name,
      day: formattedDay,
      date: formattedDate,
      time: selectedShowtime.time
    };

    console.log(">>> Final bookingData:", bookingData);

    await bookingRef.set(bookingData);

    console.log(">>> Booking successfully written");

    set(state => ({
      bookings: [...state.bookings, bookingData as Booking],
      selectedSeats: [],
      selectedShowtime: null,
      isLoading: false
    }));
  } catch (err) {
    console.error(">>> Firestore write failed:", err);
    set({
      error: err instanceof Error ? err.message : "Booking failed",
      isLoading: false
    });
  }
},





      cancelBooking: async (bookingId: string) => {
        set({ isLoading: true });
        try {
          const { bookings } = get();
          const booking = bookings.find(b => b.id === bookingId);
          if (!booking) return;

          await firestore()
            .collection("Users")
            .doc(booking.userId)
            .collection("Bookings")
            .doc(bookingId)
            .update({ status: "cancelled" });

          set({
            bookings: bookings.map(b =>
              b.id === bookingId ? { ...b, status: "cancelled" } : b
            ),
            isLoading: false
          });
        } catch {
          set({ error: "Failed to cancel booking", isLoading: false });
        }
      }
    }),
    {
      name: "booking-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        bookings: state.bookings
      })
    }
  )
);