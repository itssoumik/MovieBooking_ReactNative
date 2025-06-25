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
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: "standard" | "premium" |"vanish";
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  theaterId: string;
  showtimeId: string;
  seats: string[]; // Array of seat IDs
  totalAmount: number;
  bookingDate: string;
  status: "confirmed" | "cancelled";
}
