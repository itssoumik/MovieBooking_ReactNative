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
}

