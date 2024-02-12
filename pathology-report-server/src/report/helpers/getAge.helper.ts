export function getAge(date: string) {
  // Parse the birthdate string to a Date object
  const birthDate = new Date(
    parseInt(date.substring(0, 4)),
    parseInt(date.substring(4, 6)) - 1,
    parseInt(date.substring(6, 8)),
  );

  const ageDelta = new Date().getTime() - birthDate.getTime();

  // Convert milliseconds to years
  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;
  return Math.floor(ageDelta / millisecondsInYear);
}
