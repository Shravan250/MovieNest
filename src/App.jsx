import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "../appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
    setErrorMessage(null);

    try {
      const PROXY_URL = "https://68514d480001fa687666.fra.appwrite.run";

      const targetEndpoint = query
        ? `${API_BASE_URL}/search/movie`
        : `${API_BASE_URL}/discover/movie`;

      const queryParams = new URLSearchParams({
        url: targetEndpoint,
        ...(query ? { query } : { sort_by: "popularity.desc" }),
        page: pageNum,
      });

      // No headers needed for GET
      const response = await fetch(`${PROXY_URL}?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch movies through proxy");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(
          data.Error || "Error fetching movies. Please try again later..."
        );
        setMovieList([]);
        return;
      }

      setMovieList((prev) =>
        pageNum === 1 ? data.results : [...prev, ...data.results]
      );

      setHasMore(data.page < data.total_pages);

      if (query && data.results.length > 0) {
        updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log(error);
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

  useEffect(() => {
    setPage(1);
    fetchMovies(debouncedSearchTerm, 1);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (page === 1) return;
    fetchMovies(debouncedSearchTerm, page);
  }, [page]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // entries[0] represents our sentinel element
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 } //fire when sentioent element is 100% visible
    );

    const target = document.querySelector("#scroll-sentinel");

    if (target) {
      observer.observe(target);
    }

    //cleanup
    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, loading]);

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

          <ul>
            {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>

          {loading && <Spinner />}
          {!loading && hasMore && (
            <div id="scroll-sentinel" style={{ height: "1px" }} />
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
