export function generateDateRange(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const dates = [];

  let current = startDate;

  while (current <= endDate) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
