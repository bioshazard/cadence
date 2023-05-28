import { useState } from "react";
import { db } from "../lib/db";
import { useNavigate } from "react-router-dom";

export default function Add() {

  const navigate = useNavigate()

  const activityNewSubmit = (event) => {
    event.preventDefault();
    const name = event.target.name.value
    const cadence = event.target.cadence.value
    db.activities.add({ name, cadence }).then( (id) => {
      navigate(`/`)
    })
  }

  return (
    <div className="p-2">
      <h2 className="text-2xl">Add New Activity</h2>
      <form onSubmit={activityNewSubmit}>
        <ul>
          <li><input className="border p-2 my-1" name="name" type="text" placeholder="Name" /></li>
          <li><input className="border p-2 my-1" name="cadence" type="text" placeholder="Cadence (days)" /></li>
        </ul>
        <button className="bg-green-500 my-1 p-2 text-white font-medium rounded">Add</button>
      </form>
      <button className="bg-red-500 my-1 p-2 text-white font-medium rounded">Cancel</button>
    </div>
  )  
}
