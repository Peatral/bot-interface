export const Durations = {
  MINUTES: 1000 * 60,
  HOURS: 1000 * 60 * 60,
  DAYS: 1000 * 60 * 60 * 24,
};

export function getAsTime(millis) {
  if (millis % Durations.DAYS === 0) {
    return {
      unit: "d",
      amount: millis / Durations.DAYS,
    };
  } else if (millis % Durations.HOURS === 0) {
    return {
      unit: "h",
      amount: millis / Durations.HOURS,
    };
  } else {
    return {
      unit: "m",
      amount: Math.floor(millis / Durations.MINUTES),
    };
  }
}
