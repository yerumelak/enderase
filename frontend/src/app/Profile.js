import React, { useState, useEffect } from 'react';
import '../style/EditProfile.css';  // optional, use the same #ED760E theme
import api from './auth/api';
import { useTranslation } from "react-i18next";

export default function EditProfile() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const { t, i18n } = useTranslation();

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
            <h2>{t("Edit Profile")}</h2>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>{t("First Name")}</label>
                <input name="first_name" value={formData.first_name} onChange={handleChange} />

                <label>{t("Last Name")}</label>
                <input name="last_name" value={formData.last_name} onChange={handleChange} />

                <label>{t("Email")}</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} />

                <label>{t("New Password")}</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} />

                <button type="submit">{t("Update")}</button>
            </form>
        </div>
    );
};
