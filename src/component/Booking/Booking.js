import React, { useState } from 'react';
import '../../Styles/Booking.css';

const Booking = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [slot, setSlot] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [carType, setCarType] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation check
    if (!name || !email || !slot || !date || !time || !plateNumber || !carType) {
      setErrorMessage('Please fill all fields');
      setConfirmationMessage('');
      return;
    }

    // Simulate booking process (You can replace it with an API call)
    setTimeout(() => {
      setConfirmationMessage(
        `Booking confirmed for ${name} with car type ${carType} (Plate Number: ${plateNumber}) on ${date} at ${time} in slot ${slot}`
      );
      setErrorMessage('');
      // Clear the form after submission
      setName('');
      setEmail('');
      setSlot('');
      setDate('');
      setTime('');
      setPlateNumber('');
      setCarType('');
    }, 1000);
  };

  return (
    <section className="booking">
      <h2>Reserve a Parking Slot</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="booking-name">Name:</label>
          <input
            type="text"
            id="booking-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
          />
        </div>
        <div>
          <label htmlFor="booking-email">Email:</label>
          <input
            type="email"
            id="booking-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            required
          />
        </div>
        <div>
          <label htmlFor="booking-plate-number">Plate Number:</label>
          <input
            type="text"
            id="booking-plate-number"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value)}
            placeholder="Car Plate Number"
            required
          />
        </div>
        <div>
          <label htmlFor="booking-car-type">Car Type:</label>
          <select
            id="booking-car-type"
            value={carType}
            onChange={(e) => setCarType(e.target.value)}
            required
          >
            <option value="">Select Car Type</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
          </select>
        </div>
        <div>
          <label htmlFor="booking-slot">Parking Slot:</label>
          <select
            id="booking-slot"
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            required
          >
            <option value="">Select Slot</option>
            <option value="A1">Slot A1</option>
            <option value="A2">Slot A2</option>
            <option value="B1">Slot B1</option>
            <option value="B2">Slot B2</option>
          </select>
        </div>
        <div>
          <label htmlFor="booking-date">Date:</label>
          <input
            type="date"
            id="booking-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="booking-time">Time:</label>
          <input
            type="time"
            id="booking-time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reserve Slot</button>
      </form>

      {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </section>
  );
};

export default Booking;
