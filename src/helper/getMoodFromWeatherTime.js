export const getMoodFromContext = (weather, timeMood) => {
  const moodMap = {
    clear: {
      morning: "feelgood",
      afternoon: "adventure",
      evening: "mystery",
      night: "cozy",
    },
    clouds: {
      morning: "drama",
      afternoon: "mystery",
      evening: "thriller",
      night: "cozy",
    },
    rain: {
      morning: "romance",
      afternoon: "drama",
      evening: "cozy",
      night: "romance",
    },
    snow: {
      morning: "family",
      evening: "fantasy",
      night: "drama",
    },
    thunderstorm: {
      evening: "thriller",
      night: "horror",
    },
  };

  return moodMap[weather]?.[timeMood] || timeMood || "feelgood";
};

export const getTimeLabel = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
};
