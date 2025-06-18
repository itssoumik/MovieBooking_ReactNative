import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Booking, Seat, Showtime } from "@/types";
import { showtimes } from "@/mocks/showtimes";

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
  createBooking: (userId: string) => Promise<Booking | null>;
  cancelBooking: (bookingId: string) => Promise<void>;
}

// Generate mock seats for a showtime
const generateSeats = (showtimeId: string): Seat[] => {
  const seats: Seat[] = [];
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  
  rows.forEach(row => {
    for (let i = 1; i <= 12; i++) {
      const seatType = 
        
        row > "F" ? "premium" : "standard";
      
      seats.push({
        id: `${showtimeId}-${row}${i}`,
        row,
        number: i,
        type: seatType,
        isAvailable: Math.random() > 0.3 // 70% of seats are available
      });
    }
  });
  
  return seats;
};

// Mock bookings
const mockBookings: Booking[] = [
  {
    id: "1",
    userId: "1",
    movieId: "1",
    theaterId: "1",
    showtimeId: "1",
    seats: ["1-A1", "1-A2"],
    totalAmount: 300,
    bookingDate: "2023-05-15",
    status: "confirmed"
  }
];

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: mockBookings,
      selectedShowtime: null,
      selectedSeats: [],
      availableSeats: [],
      isLoading: false,
      error: null,
      
      fetchUserBookings: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Filter bookings for the user
          const userBookings = mockBookings.filter(booking => booking.userId === userId);
          
          set({
            bookings: userBookings,
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch bookings",
            isLoading: false
          });
        }
      },
      
      selectShowtime: async (showtimeId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const showtime = showtimes.find(s => s.id === showtimeId) || null;
          
          set({
            selectedShowtime: showtime,
            selectedSeats: [],
            isLoading: false
          });
          
          if (showtime) {
            get().fetchAvailableSeats(showtimeId);
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to select showtime",
            isLoading: false
          });
        }
      },
      
      fetchAvailableSeats: async (showtimeId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Generate mock seats
          const seats = generateSeats(showtimeId);
          
          set({
            availableSeats: seats,
            isLoading: false
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch seats",
            isLoading: false
          });
        }
      },
      
      toggleSeatSelection: (seat: Seat) => {
        if (!seat.isAvailable) return;
        
        const { selectedSeats } = get();
        const isSeatSelected = selectedSeats.some(s => s.id === seat.id);
        
        if (isSeatSelected) {
          set({
            selectedSeats: selectedSeats.filter(s => s.id !== seat.id)
          });
        } else {
          set({
            selectedSeats: [...selectedSeats, seat]
          });
        }
      },
      
      clearSeatSelection: () => {
        set({
          selectedSeats: [],
          selectedShowtime: null
        });
      },
      
      createBooking: async (userId: string) => {
        const { selectedShowtime, selectedSeats } = get();
        
        if (!selectedShowtime || selectedSeats.length === 0) {
          set({
            error: "No showtime or seats selected"
          });
          return null;
        }
        
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const newBooking: Booking = {
            id: (Math.random() * 1000).toString(),
            userId,
            movieId: selectedShowtime.movieId,
            theaterId: selectedShowtime.theaterId,
            showtimeId: selectedShowtime.id,
            seats: selectedSeats.map(seat => seat.id),
            totalAmount: selectedSeats.length * selectedShowtime.price,
            bookingDate: new Date().toISOString().split("T")[0],
            status: "confirmed"
          };
          
          set(state => ({
            bookings: [...state.bookings, newBooking],
            selectedSeats: [],
            selectedShowtime: null,
            isLoading: false
          }));
          
          return newBooking;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to create booking",
            isLoading: false
          });
          return null;
        }
      },
      
      cancelBooking: async (bookingId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set(state => ({
            bookings: state.bookings.map(booking => 
              booking.id === bookingId 
                ? { ...booking, status: "cancelled" } 
                : booking
            ),
            isLoading: false
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to cancel booking",
            isLoading: false
          });
        }
      }
    }),
    {
      name: "booking-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        bookings: state.bookings
      })
    }
  )
);