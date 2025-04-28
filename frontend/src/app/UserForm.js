import React, { useState, useEffect } from 'react';
import api from './auth/api';


const UserForm = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                password: '', // Password is never pre-filled for security reasons
                role: user.role
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = user ? 'put' : 'post';
        const url = user ? `/api/users/${user.id}/` : '/api/users/';

        try {
            await api[method](url, formData);
            onSave();
        } catch (err) {
            console.error('Error saving user:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="user-form">
            <h3>{user ? 'Edit User' : 'Create User'}</h3>

            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn">
                    Save
                </button>
                <button type="button" className="btn" onClick={onClose}>
                    Close
                </button>
            </div>
        </form>
    );
};

export default UserForm;

