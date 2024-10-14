export const sortedTimes = (times: string[]) =>
  Array.from(new Set(times)).sort((a, b) => {
    // Split times into hours and minutes
    const [aHours, aMinutes] = a.split(':').map(Number);
    const [bHours, bMinutes] = b.split(':').map(Number);

    // Compare hours first, then minutes if hours are the same
    if (aHours !== bHours) {
      return aHours - bHours;
    }
    return aMinutes - bMinutes;
  });
