import React from 'react';
import '../../Styles/Sidebar.css';  // Add styles for the sidebar

const Sidebar = ({ showSection }) => {
  return (
    <nav className="sidebar">
      <header>
        {/* <h1>
          እነደራሴ
          <span className="smaller-text">Enderase Carparking</span>
        </h1> */}
        <ul>
          <li>
            <button onClick={() => showSection('login')}>Login</button>
          </li>
          <li>
            <button onClick={() => showSection('registration')}>Register</button>
          </li>
          <li>
            <button onClick={() => showSection('user-dashboard')}>User Dashboard</button>
          </li>
          <li>
            <button onClick={() => showSection('admin-dashboard')}>Admin Dashboard</button>
          </li>
          <li>
            <button onClick={() => showSection('feedback')}>Feedback</button>
          </li>
          <li>
            <button onClick={() => showSection('booking')}>Booking</button>
          </li>
        </ul>
      </header>
    </nav>
  );
};

export default Sidebar;
