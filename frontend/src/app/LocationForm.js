import { useEffect, useState } from 'react';
import '../style/LocationForm.css'; // Make sure to import the CSS file
import api from './auth/api';

export default function LocationForm({ initialData = null, onClose }) {
    const [formData, setFormData] = useState({
        pricing: {
            spot_type: 'regular',
            price_per_hour: '',
        },
        spot_number: '',
        is_available: true,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                pricing: {
                    ...initialData.pricing
                },
            });
            console.log(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        console.log(formData);
    }, [formData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['spot_type', 'price_per_hour'].includes(name)) {
            setFormData({
                ...formData,
                pricing: {
                    ...formData.pricing,
                    [name]: value,
                },
            });
        } else if (name === 'is_available') {
            setFormData({
                ...formData,
                [name]: e.target.checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (initialData) {
                await api.put(`/api/parking_spots/${initialData.id}/`, formData);
            }
            else {
                await api.post('/api/parking_spots/', formData);
            }
            setFormData({
                spot_number: '',
                is_available: true,
                pricing: {
                    spot_type: 'regular',
                    price_per_hour: 0,
                },
            });
            onClose();
        } catch (err) {
            alert(err);
            console.error(err);
        }
    };

    return (
        <div className='app'>
            <form className="location-form" onSubmit={handleSubmit}>

                <h3>Parking Spots</h3>
                <div className="spot-row" >
                    <input
                        name='spot_number'
                        placeholder="Spot Number"
                        value={formData.spot_number}
                        onChange={handleChange}
                    />
                    <div>
                        <label>Is Available</label>
                        <input
                            name='is_available'
                            type='checkbox'
                            value={formData.is_available}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <h3>Pricing</h3>
                <select name='spot_type' value={formData.spot_type} onChange={handleChange}>
                    <option value="regular">Regular</option>
                    <option value="vip">VIP</option>
                </select>
                <input name='price_per_hour' value={formData.price_per_hour} placeholder="Price per hour" onChange={handleChange} />

                <button type="submit" className="submit-btn">Submit</button>
                <button type="button" className="add-spot" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
}

