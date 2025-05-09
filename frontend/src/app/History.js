import React, { useEffect, useState } from 'react';
import api from './auth/api';
import { useTranslation } from "react-i18next";

export default function History() {
    const [bookings, setBookings] = useState([]);
    const { t, i18n } = useTranslation();

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
            <table >
                <thead>
                    <tr >
                        <th>{t("Spot Number")}</th>
                        <th>{t("Start Time")}</th>
                        <th>{t("End Time")}</th>
                        <th>{t("Status")}</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.id} style={{}}>
                            <td>{booking.spot_detail.spot_number}</td>
                            <td>{new Date(booking.start_time).toLocaleString()}</td>
                            <td>{new Date(booking.end_time).toLocaleString()}</td>
                            <td style={{ color: booking.status === 'confirmed' ? 'green' : 'red' }}>
                                {t(booking.status)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
