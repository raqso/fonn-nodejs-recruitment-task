export class InvalidDateError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidDate';
  }
}
