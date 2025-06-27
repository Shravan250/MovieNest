import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "../appwrite";
import VirtualizedMovieGrid from "./components/VirtualizedMovieGrid";
import {
  moodGenreMapping,
  timeEmojiMap,
  weatherEmojiMap,
} from "./helper/moodGenreMapping";
import {
  fetchMovies as fetchMoviesAPI,
  fetchMoviesByGenre as fetchMoviesByGenreAPI,
} from "./services/movieService";
import { getWeatherCondition } from "./services/fetchWeather";
import {
  getMoodFromContext,
  getTimeLabel,
} from "./helper/getMoodFromWeatherTime";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [location, setLocation] = useState(null);
  const [moodInfo, setMoodInfo] = useState("");

  // Use debounce to limit the rate of API calls and prevent API overload
  // waits for 500 ms before updating the searchTerm state thus limiting the api requests
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm);
    },
    500,
    [searchTerm]
  );

  const fetchMovies = async (query = "", pageNum = 1) => {
    setLoading(true);
    try {
      const data = await fetchMoviesAPI(query, pageNum);
      if (data.Response === "False") throw new Error(data.Error);

      setMovieList((prev) =>
        pageNum === 1 ? data.results : [...prev, ...data.results]
      );
      setHasMore(data.page < data.total_pages);

      if (query && data.results.length > 0) {
        updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      setErrorMessage("Error fetching movies. Please try again later...");
    } finally {
      setLoading(false);
    }
  };

  const fetchMoviesByGenre = async (genres, pageNum = 1) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchMoviesByGenreAPI(genres, pageNum);
      if (data.Response === "False") throw new Error(data.Error);

      setMovieList((prev) =>
        pageNum === 1 ? data.results : [...prev, ...data.results]
      );
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      setErrorMessage("Error fetching movies. Please try again later...");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (e) {
      console.log(e);
    }
  };

  const loadFallbackMoodBasedMovies = async () => {
    try {
      const time = getTimeLabel();
      const fallbackMood = time;
      const genres = moodGenreMapping[fallbackMood];

      if (genres && genres.length > 0) {
        setPage(1);
        await fetchMoviesByGenre(genres, 1);
      } else {
        throw new Error("No genres found for current mood");
      }
    } catch (error) {
      console.error("Error loading mood-based movies:", error);
      setErrorMessage(
        "Error loading recommended movies. Please try searching manually."
      );
    }
  };

  useEffect(() => {
    setPage(1);
    if (debouncedSearchTerm.trim() !== "") {
      fetchMovies(debouncedSearchTerm, 1);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (page === 1) return;
    fetchMovies(debouncedSearchTerm, page);
  }, [page]);

  useEffect(() => {
    fetchTrendingMovies();

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });

        const weather = await getWeatherCondition(latitude, longitude);
        const time = getTimeLabel();
        const mood = getMoodFromContext(weather, time);
        const genres = moodGenreMapping[mood];

        if (searchTerm.trim() === "") {
          setPage(1);
          fetchMoviesByGenre(genres, 1);
        }

        const weatherIcon = weatherEmojiMap[weather] || "🎬";
        const timeIcon = timeEmojiMap[time] || "🕒";

        setMoodInfo(
          `Showing ${mood} movies based on your time ${time} ${timeIcon} and weather ${weather} ${weatherIcon} mood`
        );
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        const time = getTimeLabel();
        const fallbackMood = getMoodFromContext("clear", time);
        const genres = moodGenreMapping[fallbackMood];
        fetchMoviesByGenre(genres, 1);
        setMoodInfo(
          `Showing ${fallbackMood} movies based on time of day only ⏰`
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  //   if (!hasMore || loading) return;

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       // entries[0] represents our sentinel element
  //       if (entries[0].isIntersecting) {
  //         setPage((prev) => prev + 1);
  //       }
  //     },
  //     { threshold: 1.0 } //fire when sentioent element is 100% visible
  //   );

  //   const target = document.querySelector("#scroll-sentinel");

  //   if (target) {
  //     observer.observe(target);
  //   }

  //   //cleanup
  //   return () => {
  //     if (target) {
  //       observer.unobserve(target);
  //     }
  //   };
  // }, [hasMore, loading]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="/movienest/hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> you are Looking
            For
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="text-white text-2xl font-bold mt-[40px]">
            All Movies
          </h2>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          {/* {!errorMessage && (
            <section className="movie-genre">
              <ul className="flex flex-row py-6 ">
                {moodMap.map((mood, index) => (
                  <li className="text-white text-center" key={index}>
                    <p>{mood}</p>
                  </li>
                ))}
              </ul>
            </section>
          )} */}
          {!errorMessage && moodInfo && (
            <p className="text-white text-center text-sm py-4">{moodInfo}</p>
          )}

          {!errorMessage && (
            <VirtualizedMovieGrid
              movies={movieList}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={() => setPage((prev) => prev + 1)}
            />
          )}

          {loading && (
            <div className="flex justify-center mt-4">
              <Spinner />
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
