import logo from '../images/logo.svg';
import userIcon from '../images/user.svg'; // Your user icon
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { useState } from 'react';
import "../style/navbar.css";
import "../style/mobile.css";

export default function Layout() {
    const { logout } = useAuth();
    const user = JSON.parse(localStorage.getItem('user'));
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showNav, setShowNav] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <nav className="navbar">
                <img onClick={() => setShowNav(!showNav)} src='menu.svg' alt='' className='menubar' />
                <img src={logo} alt="Logo" className="logo" />
                {showNav &&
                    <div className='dropdown mobnav'>
                        <Link to="/">Home</Link>
                        <Link to="/history">History</Link>
                        {user?.is_staff && <Link to="/user-managment">User Managment</Link>}
                        <Link to="/profile">Profile</Link>
                    </div>}
                <div className="nav-left">
                    <Link to="/">Home</Link>
                    <Link to="/history">History</Link>
                    {user?.is_staff && <Link to="/user-managment">User Managment</Link>}
                    <Link to="/profile">Profile</Link>
                </div>
                <div className="nav-right">
                    <div onClick={() => setDropdownOpen(!dropdownOpen)} className='user-detail'>
                        <p>{user?.first_name}</p>
                        <img
                            src={userIcon}
                            alt="User"
                            className="user-icon"
                        />
                    </div>
                    {dropdownOpen && (
                        <div className="dropdown">
                            <Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </nav>
            <Outlet />
        </>
    );
}

