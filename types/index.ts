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

