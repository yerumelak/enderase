import "../style/auth.css"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "./auth/api";

export default function Signup() {
    const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', password2: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('api/register/', form);
            navigate('/login'); // redirect after success
        } catch (err) {
            const message = err.response?.data?.password?.[0] || 'Signup failed';
            setError(message);
        }
    };
    return (
        <div className="container">
            <div className="form-box">
                <h2 id="form-title">Signup</h2>
                <form id="auth-form" onSubmit={handleSubmit}>
                    <label>First Name</label>
                    <input onChange={handleChange} name="first_name" type="Name" placeholder="First Name" required />
                    <label>Last Name</label>
                    <input onChange={handleChange} name="last_name" type="Name" placeholder="Last Name" required />
                    <label>Email</label>
                    <input onChange={handleChange} name="email" type="email" placeholder="Email" required />
                    <label>Password</label>
                    <input onChange={handleChange} name="password" type="password" placeholder="Password" required />
                    <label>Confirm Password</label>
                    <input onChange={handleChange} name="password2" type="password" placeholder="Confirm Password" />
                    <button type="submit" className="btn">Sign Up</button>
                    <p id="toggle-text">already have an account? <Link id="toggle-link" to="/login">Login</Link></p>
                </form>
            </div>
        </div>
    );
}
