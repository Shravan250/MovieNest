const API_BASE_URL = "https://api.themoviedb.org/3";
const PROXY_URL = "https://68514d480001fa687666.fra.appwrite.run";

export const fetchMovies = async (query, pageNum = 1) => {
  const targetEndpoint = query
    ? `${API_BASE_URL}/search/movie`
    : `${API_BASE_URL}/discover/movie`;

  const queryParams = new URLSearchParams({
    url: targetEndpoint,
    ...(query ? { query } : { sort_by: "popularity.desc" }),
    page: pageNum,
  });

  const response = await fetch(`${PROXY_URL}?${queryParams.toString()}`);
  return await response.json();
};

export const fetchMoviesByGenre = async (genreIds, pageNum = 1) => {
  const queryParams = new URLSearchParams({
    url: `${API_BASE_URL}/discover/movie`,
    with_genres: genreIds.join(","),
    sort_by: "popularity.desc",
    page: pageNum,
  });

  const response = await fetch(`${PROXY_URL}?${queryParams.toString()}`);
  return await response.json();
};
