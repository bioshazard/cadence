import React, { useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid'
import { useParams, Link } from 'react-router-dom';



function Manage() {

  return (
    <div className="p-2">
      {/* <h2 className="text-2xl"><Link to='/'>Since</Link> / Manage / {activityId}</h2>
      <div>Last: {lastState && lastState.timestamp}</div>
      <h3 className="text-xl">Events</h3>
      <ul>
      {[...eventsMapState.keys()].reverse().map((key, index) => {
        const eventDetails = eventsMapState.get(key)
        return (
          <li key={index}>
            {eventDetails.timestamp} - {eventDetails.note} - <button onClick={() => { eventDelete(key) }}>
              delete
            </button>
          </li>
        )
      })}
      </ul> */}
    </div>
  )
}

export default Manage;
