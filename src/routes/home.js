import React, { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid'
import { Link } from "react-router-dom";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../lib/db";

// activities: '++id, name, cadence, lastEvent',
// events: '++id, activityId, timestamp, note'

function App() {

  function calculatePastDueMs(last, cadence) {
    const now = new Date();
    const lastDate = new Date(last);
    const cadenceInMs = cadence * 24 * 60 * 60 * 1000;
    const timeDifference = now - lastDate;
    const pastDue = -1*(cadenceInMs - timeDifference);
    return pastDue
  }

  function formatXdXh(ms) {
    if (ms < 0) {
      const remainingDays = Math.floor(Math.abs(ms) / (1000 * 60 * 60 * 24));
      const remainingHours = Math.floor((Math.abs(ms) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return `-${remainingDays}d${remainingHours}h`;
    }
  
    const remainingDays = Math.floor(ms / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
    return `${remainingDays}d${remainingHours}h`;
  }

  function calculateRemainingTime(last, cadence) {
    const now = new Date();
    const lastDate = new Date(last);
    const cadenceInMs = cadence * 24 * 60 * 60 * 1000;
    const timeDifference = now - lastDate;
    const pastDue = -1*(cadenceInMs - timeDifference);

    console.log(now.toISOString(), lastDate.toISOString(), cadenceInMs, timeDifference, pastDue)
  
    if (pastDue < 0) {
      const remainingDays = Math.floor(Math.abs(pastDue) / (1000 * 60 * 60 * 24));
      const remainingHours = Math.floor((Math.abs(pastDue) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return `-${remainingDays}d${remainingHours}h`;
    }
  
    const remainingDays = Math.floor(pastDue / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor((pastDue % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
    return `${remainingDays}d${remainingHours}h`;
  }
  

  const activities = useLiveQuery(
    () => db.activities
      .toArray()
      .then( rows => {
        console.log(rows)
        const lastEventIds = rows.map(row => row.lastEvent).filter(lastEvent => lastEvent !== null)
        // console.log(lastEventIds)
        return db.events.where('id').anyOf(lastEventIds).toArray() .then( eventResults => {
          console.log("eventResults", eventResults)
          return rows.map( row => {
            const resolvedLastEvent = eventResults.filter( event => event.id == row.lastEvent )
            if(resolvedLastEvent.length > 0) { 
              // row.lastEvent = resolvedLastEvent[0].timestamp 
              // row.pastDue = resolvedLastEvent[0].timestamp
              
              // cadence - (now - lastEvent)
              // const cadenceSeconds = cadence * 3600 * 24

              // row.pastDue = calculateRemainingTime(resolvedLastEvent[0].timestamp, row.cadence)
              row.pastDue = calculatePastDueMs(resolvedLastEvent[0].timestamp, row.cadence)
            }
            return row
          }).sort( (a, b) => b.pastDue - a.pastDue )
        })
      })
  );

  const activityAdd = () => {
    db.activities.add({
      name: `TEST ${new Date().toISOString()}`,
      cadence: 1,
      lastEvent: null
    })
  }

  const activityDone = (activityId) => {
    db.transaction("rw", db.events, db.activities, () => {
      db.events.add({ activityId, timestamp: new Date().toISOString(), note: "Done" }).then( updateLast )
      function updateLast( eventId ) {
        db.activities.update(activityId, { lastEvent: eventId }) //.then( )
      }
    })
  }

  const timeElapsed = (isoString) => {
    const timestamp = new Date(isoString);
    const now = new Date();
    const diff = now - timestamp;
    const hoursElapsed = Math.round(diff / (1000 * 60 * 60));
    const daysElapsed = Math.floor(hoursElapsed / 24);
    const roundedHours = hoursElapsed % 24;
    const formattedTime = `${daysElapsed}d${roundedHours}h`;
    return formattedTime;
  };
  
  if (!activities) return null; // Still loading.

  return (
    <div className="">
      <div className="my-2">
      </div>
      <ul>
      {activities?.map(activity => activity).map( (activity, index) => (
        <li key={index} className="border rounded my-4 p-4">
          <button className="float-right bg-blue-400 text-white px-2 rounded" onClick={() => activityDone(activity.id)}>Done</button>
          <div>
            <Link className="text-blue-500 font-bold" to={`/manage/${activity.id}`}>
             {activity.name}
            </Link>
          </div>
          <div className="text-sm text-gray-500">
            <span className="float-right">Due: {activity.pastDue ? formatXdXh(activity.pastDue) : "Eventually"}</span>
            <span>Cadence: {activity.cadence}d</span>
          </div>
        </li>
      ))}
      </ul>
      {/* <pre> { JSON.stringify(activities, null, 2) } </pre> */}
    </div>
  );
}

export default App;
