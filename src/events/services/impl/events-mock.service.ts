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
  constructor(private _events: Event[]) {
  }

  createEvent(dateFrom: string, dateTo: string, title: string): Promise<Event> {
      validateDateString(dateFrom);
      validateDateString(dateTo);

      const newEvent: Event = { startDate: dateFrom, endDate: dateTo, title, id: generateId() };
      this._events.push(newEvent);

      return Promise.resolve(newEvent);
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
