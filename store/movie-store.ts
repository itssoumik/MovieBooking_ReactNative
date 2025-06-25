import { create } from "zustand";
import firestore from "@react-native-firebase/firestore";
import { Movie } from "@/types";

interface MovieState {
  movies: Movie[];
  filteredMovies: Movie[];
  selectedMovie: Movie | null;
  isLoading: boolean;
  error: string | null;
  fetchMovies: () => Promise<void>;
  getMovieById: (id: string) => Promise<Movie | null>;
  filterMovies: (query: string, genres?: string[], languages?: string[]) => void;
  addMovie: (movie: Movie) => Promise<void>;
  updateMovie: (id: string, movie: Partial<Movie>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
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
      const snapshot = await firestore().collection("Movies").get();
      const movies: Movie[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Movie[];

      set({
        movies,
        filteredMovies: movies,
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
      const doc = await firestore().collection("Movies").doc(`movie_${id}`).get();

      if (!doc.exists) {
        throw new Error("Movie not found");
      }

      const movie = {
        id: doc.id,
        ...doc.data()
      } as Movie;

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

    if (genres.length > 0) {
      filtered = filtered.filter(movie =>
        genres.some(genre => movie.genres.includes(genre))
      );
    }

    if (languages.length > 0) {
      filtered = filtered.filter(movie =>
        languages.some(language => movie.languages.includes(language))
      );
    }

    set({ filteredMovies: filtered });
  },

  addMovie: async (movie) => {
  set({ isLoading: true, error: null });

  try {
    const docId = `movie_${movie.id}`;

    await firestore().collection("Movies").doc(docId).set(movie);

    const newMovie = { ...movie, id: movie.id };

    set((state) => ({
      movies: [...state.movies, newMovie],
      filteredMovies: [...state.movies, newMovie],
      isLoading: false,
    }));
  } catch (error) {
    set({
      error: error instanceof Error ? error.message : "Failed to add movie",
      isLoading: false,
    });
  }
},


  
  updateMovie: async (id, movieData) => {
  set({ isLoading: true, error: null });

  try {
    await firestore().collection("Movies").doc(`movie_${id}`).update(movieData);

    set((state) => {
      const updatedMovies = state.movies.map((movie) =>
        movie.id === id ? { ...movie, ...movieData } : movie
      );

      return {
        movies: updatedMovies,
        filteredMovies: updatedMovies,
        isLoading: false,
      };
    });
  } catch (error) {
    set({
      error: error instanceof Error ? error.message : "Failed to update movie",
      isLoading: false,
    });
  }
},


  
  deleteMovie: async (id) => {
  set({ isLoading: true, error: null });

  try {
    await firestore().collection("Movies").doc(`movie_${id}`).delete();

    set(state => {
      const updatedMovies = state.movies.filter(movie => movie.id !== id);
      return {
        movies: updatedMovies,
        filteredMovies: updatedMovies,
        isLoading: false,
      };
    });
  } catch (error) {
    set({
      error: error instanceof Error ? error.message : "Failed to delete movie",
      isLoading: false,
    });
  }
},

}));
