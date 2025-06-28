import { Movie,Showtime } from "@/types";

export const generateShowtimes = (): Showtime[] => {
  const showtimes: Showtime[] = [];
  const theaters = ["1", "2", "3", "4"];
  const movies = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
  const times = ["09:30 AM", "12:30 PM", "03:30 PM", "06:30 PM"];
  //const { getMovieById, selectedMovie, isLoading } = useMovieStore();

  // Generate dates for the next 7 days
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  
  
  let id = 1;
  
  // Generate showtimes for each movie in each theater for each date and time
  movies.forEach(movieId => {
   // const { getMovieById, selectedMovie, isLoading } = useMovieStore();
    theaters.forEach(theaterId => {
      dates.forEach(date => {
        times.forEach(time => {
          // Randomly skip some showtimes to make it more realistic
          if (Math.random() > 0.3) {
            showtimes.push({
              id: id.toString(),
              movieId,
              theaterId,
              date,
              time,
              price:  200 
            });
            id++;
          }
        });
      });
    });
  });
  
  return showtimes;
};

export const showtimes = generateShowtimes();