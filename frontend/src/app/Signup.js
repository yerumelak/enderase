import "../style/auth.css"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "./auth/api";
import { useTranslation } from "react-i18next";

export default function Signup() {
    const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', password2: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const success = await api.post('api/register/', form);
            if (success) navigate('/login'); // redirect after success
            else alert("Falied to login: ", success);
        } catch (err) {
            const message = err.response?.data?.password?.[0] || 'Signup failed';
            alert("Falied to login: ", err);
            setError(message);
        }
    };
    return (
        <div className="container">
            <div className="form-box">
                <h2 id="form-title">{t("Signup")}</h2>
                <form id="auth-form" onSubmit={handleSubmit}>
                    {error && <p className="error">{error}</p>}
                    <label>{t("First Name")}</label>
                    <input onChange={handleChange} name="first_name" type="Name" placeholder={t("First Name")} required />
                    <label>{t("Last Name")}</label>
                    <input onChange={handleChange} name="last_name" type="Name" placeholder={t("Last Name")} required />
                    <label>{t("Email")}</label>
                    <input onChange={handleChange} name="email" type="email" placeholder={t("Email")} required />
                    <label>{t("Password")}</label>
                    <input onChange={handleChange} name="password" type="password" placeholder={t("Password")} required />
                    <label>{t("Confirm Password")}</label>
                    <input onChange={handleChange} name="password2" type="password" placeholder={t("Confirm Password")} />
                    <button type="submit" className="btn">{t("Sign Up")}</button>
                    <p id="toggle-text">{t("already have an account")}?<Link id="toggle-link" to="/login">{t("Login")}</Link></p>
                </form>
            </div>
        </div>
    );
}
