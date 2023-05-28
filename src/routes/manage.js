import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../lib/db";

function Manage() {
  const navigate = useNavigate()
  const params = useParams();
  const activityId = parseInt(params.activityId, 10)
  const activity = useLiveQuery( () => { return db.activities.get({id: activityId}) } )
  const events = useLiveQuery( () => { return db.events.where({activityId}).reverse().toArray() } )

  if(!events || !activity) return null

  const getEvent = (eventId) => {
    return events.filter( event => event.id == eventId)[0]
  }

  const deleteEvent = (eventId) => {
    const nextEventId = events.length > 1
      ? events[1].id
      : null;
    console.log(events, nextEventId)
    db.events.delete(eventId).then( () => {
      if(eventId == activity.lastEvent) {
        
        db.activities.update(activityId, {
          lastEvent: nextEventId
        })
      }
    })
  }

  const deleteActivity = () => {
    db.events.where({activityId}).delete()
    .then( () => {
      db.activities.where({id:activityId}).delete()
      .then( () => {
        navigate(`/`)
      })
    })
  }
  
  const lastEvent = getEvent(activity.lastEvent)

  return (
    <div className="p-2">
      <h2 className="text-2xl">
        <Link to="/">Cadence</Link> &gt; <Link to={`/manage/${activityId}`}>{activity.name}</Link>
      </h2>
      <div>
        Last: {lastEvent && lastEvent.timestamp ||  "Not set"}
      </div>
      <h3 className="text-xl">Events</h3>
      <ul>
      {events.map(event => (
        <li key={event.id}>
          <button onClick={() => deleteEvent(event.id)}>Delete</button> :: {event.timestamp}
        </li>
      ))}
      </ul>
      <button onClick={deleteActivity}>Delete Activity</button>
    </div>
  )
}

export default Manage;
