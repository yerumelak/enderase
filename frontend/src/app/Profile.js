import React, { useState, useEffect } from 'react';
import '../style/EditProfile.css';  // optional, use the same #ED760E theme
import api from './auth/api';

export default function EditProfile() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        // Get current profile
        api.get('/api/profile/').then(res => {
            setFormData({
                first_name: res.data.first_name || '',
                last_name: res.data.last_name || '',
                email: res.data.email || '',
                password: '',
            });
        });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/api/profile/', formData, {
            });
            setMessage('Profile updated successfully!');
        } catch (err) {
            setMessage('Update failed.');
        }
    };

    return (
        <div className="edit-profile">
            <h2>Edit Profile</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>First Name</label>
                <input name="first_name" value={formData.first_name} onChange={handleChange} />

                <label>Last Name</label>
                <input name="last_name" value={formData.last_name} onChange={handleChange} />

                <label>Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} />

                <label>New Password</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} />

                <button type="submit">Update</button>
            </form>
        </div>
    );
};
