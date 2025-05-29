import { create } from "zustand";
import { Movie } from "@/types";
import { movies as mockMovies } from "@/mocks/movies";

interface MovieState {
  movies: Movie[];
  filteredMovies: Movie[];
  selectedMovie: Movie | null;
  isLoading: boolean;
  error: string | null;
  fetchMovies: () => Promise<void>;
  getMovieById: (id: string) => Promise<Movie | null>;
  filterMovies: (query: string, genres?: string[], languages?: string[]) => void;
}

export const useMovieStore = create<MovieState>((set, get) => ({
  movies: [],
  filteredMovies: [],
  selectedMovie: null,
  isLoading: false,
  error: null,
  
  fetchMovies: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({
        movies: mockMovies,
        filteredMovies: mockMovies,
        isLoading: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch movies",
        isLoading: false
      });
    }
  },
  
  getMovieById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const movie = mockMovies.find(m => m.id === id) || null;
      set({ selectedMovie: movie, isLoading: false });
      return movie;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch movie",
        isLoading: false
      });
      return null;
    }
  },
  
  filterMovies: (query, genres = [], languages = []) => {
    const { movies } = get();
    
    let filtered = [...movies];
    
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(lowerQuery)
      );
    }
    
    if (genres && genres.length > 0) {
      filtered = filtered.filter(movie => 
        genres.some(genre => movie.genres.includes(genre))
      );
    }
    
    if (languages && languages.length > 0) {
      filtered = filtered.filter(movie => 
        languages.some(language => movie.languages.includes(language))
      );
    }
    
    set({ filteredMovies: filtered });
  }
}));