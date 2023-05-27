import Dexie from 'dexie';

export const db = new Dexie('cadence');
db.version(1).stores({
  activities: '++id, name, cadence, lastEvent',
  events: '++id, activityId, timestamp, note'
});
