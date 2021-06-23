import { NonExistingRecord } from './../../errors/NonExistingRecord';
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
      return Promise.reject(error);
    }
  }

  getEvent(id: string): Promise<Event> {
    try {
      const eventRecord = this._events.find((event) => event.id === id);
      if (!eventRecord) {
        throw new NonExistingRecord(id, 'event');
      }

      return Promise.resolve(eventRecord);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getEvents(
    dateFrom: string,
    dateTo: string,
    offset: number,
    limit: number,
  ): Promise<{ totalCount: number; events: Event[] }> {
    try {
      validateDateString(dateFrom);
      validateDateString(dateTo);

      const foundRecords = this._events.filter(
        (event) => new Date(event.startDate) >= new Date(dateFrom) && new Date(event.endDate) <= new Date(dateTo),
      );
      const recordsWithOffset = foundRecords.slice(offset);
      const records = recordsWithOffset.slice(0, limit);

      return Promise.resolve({
        totalCount: records.length,
        events: records,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  removeEvent(id: string): Promise<void> {
    try {
      const isEventExisting = this._events.findIndex((event) => event.id === id) > -1;
      if (!isEventExisting) {
        throw new NonExistingRecord(id, 'event');
      }

      this._events = this._events.filter((event) => event.id !== id);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private isDatesAvailable(dateFromText: string, dateToText: string) {
    return this._events.every((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const dateFrom = new Date(dateFromText);
      const dateTo = new Date(dateToText);

      const isStartInRange = this.isInRange(dateFrom, startDate, endDate);
      const isEndInRange = this.isInRange(dateTo, startDate, endDate);

      return !isStartInRange && !isEndInRange;
    });
  }

  private isInRange(el: any, start: any, end: any) {
    return el >= start && el < end;
  }
}
