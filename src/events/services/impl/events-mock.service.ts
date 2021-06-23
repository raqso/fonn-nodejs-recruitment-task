import { EventsService } from '../events.service';
import { Event } from '../../models/event';
import { v4 as generateId } from 'uuid';
import { InvalidDateError } from '../../errors/InvalidDate';

function validateDateString(date: string) {
  const isDateValid = !!Date.parse(date);
  if (isDateValid) {
    return;
  }

  throw new InvalidDateError();
}

/* eslint-disable */
export class EventsMockService implements EventsService {
  constructor(private _events: Event[]) {}

  createEvent(dateFrom: string, dateTo: string, title: string): Promise<Event> {
    try {
    validateDateString(dateFrom);
    validateDateString(dateTo);

    if (!this.isDatesAvailable(dateFrom, dateTo)) {
      throw new InvalidDateError('Dates not available');
    }

    const newEvent: Event = { startDate: dateFrom, endDate: dateTo, title, id: generateId() };
    this._events.push(newEvent);

    return Promise.resolve(newEvent);
  } catch (error) {
    return Promise.reject(error)
  }
  }

  getEvent(id: string): Promise<Event> {
    // @ts-ignore
    return Promise.resolve({}); // todo: implement method
  }

  getEvents(
    dateFrom: string,
    dateTo: string,
    offset: number,
    limit: number
  ): Promise<{ totalCount: number; events: Event[] }> {
    // @ts-ignore
    return Promise.resolve({}); // todo: implement method
  }

  removeEvent(id: string): Promise<void> {
    // @ts-ignore
    return Promise.resolve({}); // todo: implement method
  }
}
