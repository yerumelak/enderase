import React, { useEffect, useState } from 'react';
import api from './auth/api';

export default function History() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        api.get('/api/booking/')
            .then((response) => {
                setBookings(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div className='table-container'>
            <h1 >My Bookings</h1>
            <table >
                <thead>
                    <tr >
                        <th>Spot Number</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                        <th>Duration (hrs)</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.id} style={{}}>
                            <td>{booking.spot_detail.spot_number}</td>
                            <td>{new Date(booking.start_time).toLocaleString()}</td>
                            <td>{new Date(booking.end_time).toLocaleString()}</td>
                            <td style={{ color: booking.status === 'confirmed' ? 'green' : 'red' }}>
                                {booking.status}
                            </td>
                            <td >{(booking.duration || 0).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

