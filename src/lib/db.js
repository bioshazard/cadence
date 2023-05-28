import Dexie from 'dexie';

export const db = new Dexie('cadence');
db.version(2).stores({
  activities: '++id, name, cadence, lastEvent',
  events: '++id, activityId, timestamp, [activityId+timestamp]'
});

// v2?
