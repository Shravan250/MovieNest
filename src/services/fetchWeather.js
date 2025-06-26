export const getWeatherCondition = async (lat, lon) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const weatherMain = data.weather[0].main.toLowerCase();
    return weatherMain;
  } catch (err) {
    console.error("Failed to fetch weather:", err);
    return null;
  }
};
