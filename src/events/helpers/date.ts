import { InvalidDateError } from '../errors/InvalidDate';

function validateDateString(date: string) {
  const isDateValid = !!Date.parse(date);
  if (isDateValid) {
    return;
  }

  throw new InvalidDateError();
}

function isDateInRange(date: Date, start: Date, end: Date) {
  return date >= start && date < end;
}

export { validateDateString, isDateInRange };
