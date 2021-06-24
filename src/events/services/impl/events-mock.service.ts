import { v4 as generateId } from 'uuid';
import { isDateInRange, validateDateString } from '../../helpers/date';
import { NonExistingRecord } from './../../errors/NonExistingRecord';
import { EventsService } from '../events.service';
import { Event } from '../../models/event';
import { InvalidDateError } from '../../errors/InvalidDate';
export class EventsMockService implements EventsService {
  constructor(private _events: Event[]) {}

  createEvent(dateFrom: string, dateTo: string, title: string): Promise<Event> {
    try {
      validateDateString(dateFrom);
      validateDateString(dateTo);

      if (!this.areDatesAvailable(dateFrom, dateTo)) {
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
      const isEventExist = this._events.findIndex((event) => event.id === id) > -1;
      if (!isEventExist) {
        throw new NonExistingRecord(id, 'event');
      }

      this._events = this._events.filter((event) => event.id !== id);

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private areDatesAvailable(dateFromText: string, dateToText: string) {
    return this._events.every(getIsNotConflicted);

    function getIsNotConflicted(event: Event) {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const dateFrom = new Date(dateFromText);
      const dateTo = new Date(dateToText);

      const isStartInRange = isDateInRange(dateFrom, startDate, endDate);
      const isEndInRange = isDateInRange(dateTo, startDate, endDate);

      return !isStartInRange && !isEndInRange;
    }
  }
}
