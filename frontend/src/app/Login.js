import "../style/auth.css"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./auth/AuthContext";
import { useTranslation } from "react-i18next";

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const { t, i18n } = useTranslation();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(formData.email, formData.password);
        if (success) navigate('/');
        else alert("Falied to login: ", success);
    };

    return (
        <div className="container">
            <div className="form-box">
                <h2 id="form-title">{t("Login")}</h2>
                {error && <p className="error">{error}</p>}
                <form id="auth-form" onSubmit={handleSubmit}>
                    <label>{t("Email")}</label>
                    <input value={formData.email} onChange={handleChange} name="email" type="email" placeholder={t("Email")} required />
                    <label>{t("Password")}</label>
                    <input value={formData.password} onChange={handleChange} name="password" type="password" placeholder={t("Password")} required />
                    <button type="submit" className="btn">{t("Login")}</button>
                    <p id="toggle-text">{t("Don't have an account")}? <Link id="toggle-link" to="/signup">{t("Sign Up")}</Link></p>
                </form>
            </div>
        </div>
    );
}
