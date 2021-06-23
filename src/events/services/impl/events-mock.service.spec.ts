import { InvalidDateError } from './../../errors/InvalidDate';
import { EventsService } from '../events.service';
import { EventsMockService } from './events-mock.service';
import { EventsMockData } from '../../mock-data/event';

describe('EventsMockService', () => {
  let eventsService: EventsService;

  beforeEach(() => {
    eventsService = new EventsMockService([...EventsMockData]);
  });

  describe('createEvent()', () => {
    it('is defined of type function', () => {
      expect(eventsService.createEvent).toBeDefined();
      expect(typeof eventsService.createEvent).toBe('function');
    });

    describe('user should be able to create events at any time', () => {
      it('creates past event', async () => {
        const eventPast = await eventsService.createEvent(
          '2017-01-02T14:00:00.000Z',
          '2017-01-03T14:00:00.000Z',
          'Super past event',
        );

        expect(eventPast.id).toBeDefined();
      });

      it('creates current event', async () => {
        const today = new Date();
        const eventCurrent = await eventsService.createEvent(
          today.toISOString(),
          addDays(today, 2).toISOString(),
          'Super current event',
        );

        expect(eventCurrent.id).toBeDefined();
      });

      it('creates future event', async () => {
        const today = new Date();
        const eventDate = addDays(today, 300);
        const eventFuture = await eventsService.createEvent(
          eventDate.toISOString(),
          addDays(eventDate, 2).toISOString(),
          'Super current event',
        );

        expect(eventFuture.id).toBeDefined();
      });
    });

    it("user should be able to create a new event with the same start time as the previous one's end time", async () => {
      const firstEvent = await eventsService.createEvent(
        '2017-01-02T14:00:00.000Z',
        '2017-01-03T14:00:00.000Z',
        'Super past event',
      );
      const secondEvent = await eventsService.createEvent(
        firstEvent.endDate,
        '2017-01-05T14:00:00.000Z',
        'Super past event',
      );

      expect(secondEvent.id).toBeDefined();
    });

    it("user shouldn't be able to create events with conflicted time", async () => {
      const firstEvent = await eventsService.createEvent(
        '2017-01-02T14:00:00.000Z',
        '2017-01-03T14:00:00.000Z',
        'Super past event',
      );
      const secondEventCreating = eventsService.createEvent(
        firstEvent.startDate,
        '2017-01-05T14:00:00.000Z',
        'Super past event',
      );

      await expect(secondEventCreating).rejects.toThrow(InvalidDateError);
    });

    it("user shouldn't be able to create event with invalid date format", async () => {
      await expect(eventsService.createEvent('date', '', 'Super event')).rejects.toThrow(InvalidDateError);
      await expect(
        eventsService.createEvent('2017-01-02T14:00:00.000Z', '2017-01-03T14:00:00.000ZAA', 'Super event'),
      ).rejects.toThrow(InvalidDateError);
      await expect(
        eventsService.createEvent('Toss a coin to a Witcher', '2017-01-03T14:00:00.000Z', 'Super event'),
      ).rejects.toThrow(InvalidDateError);
    });
  });

  describe('getEvent()', () => {
    it('is defined of type function', () => {
      expect(eventsService.getEvent).toBeDefined();
      expect(typeof eventsService.getEvent).toBe('function');
    });
  });

  describe('getEvents()', () => {
    it('is defined of type function', () => {
      expect(eventsService.getEvents).toBeDefined();
      expect(typeof eventsService.getEvents).toBe('function');
    });
  });

  describe('removeEvent()', () => {
    it('is defined of type function', () => {
      expect(eventsService.removeEvent).toBeDefined();
      expect(typeof eventsService.removeEvent).toBe('function');
    });
  });
});

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
}
