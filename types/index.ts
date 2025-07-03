export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop?: string;
  description: string;
  duration: number; // in minutes
  genres: string[];
  languages: string[];
  rating: number;
  votes: number;
  price: number; 
  ytCode?: string; // YouTube video code
}

export interface User {
  id: string; // same as email
  name: string; // from 'username' field in Firestore
  email: string; // also used as document ID
  avatar?: string; // URL of avatar image
}

export interface Theater {
  id: string;
  name: string;
  location: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  date: string;
  time: string;
  price: number;

  // Add these optional fields
  movie?: Movie;
  theater?: Theater;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: "standard" | "premium" |"vanish";
  isAvailable: boolean;
}

export interface BookingForFirestore {
  id: string;
  seats: string[];
  totalAmount: number;
  status: "confirmed" | "cancelled";
  movieName: string;
  backdrop: string;
  poster: string;
  location: string;
  theater: string;
  day: string;
  date: string;
  time: string;
}

export interface Booking extends BookingForFirestore {
  userId: string;
  bookingDate: string;
}

