export const getTimeBasedMood = () => {
  const hours = new Date().getHours();

  if (hours >= 6 && hours < 12) {
    return "feelgood";
  } else if (hours >= 12 && hours < 18) {
    return "adventure";
  } else if (hours >= 18 && hours < 22) {
    return "mystery";
  } else {
    return "cozy";
  }
};
