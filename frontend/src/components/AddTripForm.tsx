import { useState, useEffect } from 'react'
import {useCollection} from "@squidcloud/react"
import { Trip } from '../types.ts'
import './AddTripForm.css'


export const AddTrip = () => {
  const [country, setCountry] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [countries, setCountries] = useState([]);
  const tripsCollection = useCollection<Trip>("trips")

  // fetch the list of countries when the component mounts.
  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => {
        if (response.ok) return response.json();
      })  
      .then((data) => {
        const countryNamess = data.map((country: any) => country.name.common);
        setCountries(countryNamess);
      })
      .catch((error) => console.error(error));
  }, []);

  // inserts a new trip in object format into the tripsCollection. The trip object contains the generated ID, the selected country, the start and end dates, and an empty notes array.
  const addTrip = () => {
    const tripId = crypto.randomUUID()
    tripsCollection.doc(tripId).insert({
        id: tripId,
        country,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        notes: []
    })
  }

  //  renders the input form for adding a new trip
  return (
    <div className="trip-container">
      <h3>Add Trip</h3>
      <div className="trip-form">
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="" disabled>
            Select Country
          </option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
        <button onClick={addTrip}>Add Trip</button>
      </div>
    </div>
  );
}
