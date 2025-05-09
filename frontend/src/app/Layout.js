import logo from '../images/logo.svg';
import userIcon from '../images/user.svg'; // Your user icon
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { useState } from 'react';
import "../style/navbar.css";
import "../style/mobile.css";

import { useTranslation } from "react-i18next";
import LanguageSelector from './LanguageSelector';

export default function Layout() {
    const { logout } = useAuth();
    const user = JSON.parse(localStorage.getItem('user'));
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showNav, setShowNav] = useState(false);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <nav className="navbar">
                <img onClick={() => setShowNav(!showNav)} src='menu.svg' alt='' className='menubar' />
                {showNav &&
                    <div className='dropdown mobnav'>
                        <Link to="/">
                            <img src={logo} alt="Logo" className="logo" />
                        </Link>
                        <Link to="/history">{t("History")}</Link>
                        {user?.is_staff && <Link to="/user-managment">{t("User Managment")}</Link>}
                        <Link to="/profile">{t("Profile")}</Link>
                    </div>}
                <div className="nav-left">
                    <Link to="/">
                        <img src={logo} alt="Logo" className="logo" />
                    </Link>
                    <Link to="/history">{t("History")}</Link>
                    {user?.is_staff && <Link to="/user-managment">{t("User Managment")}</Link>}
                    <Link to="/profile">{t("Profile")}</Link>
                </div>
                <div className="nav-right">
                    <div className="flex">
                        <div onClick={() => setDropdownOpen(!dropdownOpen)} className='user-detail'>
                            <p>{user?.first_name}</p>
                            <img
                                src={userIcon}
                                alt="User"
                                className="user-icon"
                            />
                        </div>
                        <LanguageSelector />
                    </div>
                    {dropdownOpen && (
                        <div className="dropdown">
                            <Link to="/profile" onClick={() => setDropdownOpen(false)}>{t("Profile")}</Link>
                            <button onClick={handleLogout}>{t("Logout")}</button>
                        </div>
                    )}
                </div>
            </nav>
            <Outlet />
        </>
    );
}

