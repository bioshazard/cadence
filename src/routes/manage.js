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

  const activityNameSubmit = (event) => {
    event.preventDefault()
    db.activities.update(activityId, {
      name: event.target.name.value
    })
    event.target.name.blur()
  }
  
  const lastEvent = getEvent(activity.lastEvent)

  return (
    <div className="">
      <h2 className="text-2xl">
        {/* <Link to={`/manage/${activityId}`}>{activity.name}</Link> */}
        <form onSubmit={activityNameSubmit}>
          <input className="border p-2" name="name" defaultValue={activity.name} />
        </form>
      </h2>
      <div>
        Last: {lastEvent && lastEvent.timestamp ||  "Not set"}
      </div>
      <h3 className="text-xl">Events</h3>
      <ul>
      {events.length > 0
        ? events.map(event => (
            <li key={event.id}>
              <button onClick={() => deleteEvent(event.id)}>Delete</button> :: {event.timestamp}
            </li>
          ))
        : "No events"
      }
      </ul>
      <h3 className="text-xl">Danger Zone</h3>
      <button className="p-2 bg-red-700 text-white font-medium rounded" onClick={deleteActivity}>Delete Activity</button>
    </div>
  )
}

export default Manage;
