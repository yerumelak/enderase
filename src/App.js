import React, { useState } from 'react';  // Ensure React is imported
import Header from './component/header';
import Login from './component/Auth/Login';
import Register from './component/Auth/regiter';
import UserDashboard from './component/dashboard/Userdashboard';
import AdminDashboard from './component/dashboard/AdminDashbord';
import Sidebar from './component/Sidebar/Sidebar';
import Booking from './component/Booking/Booking';
import Feedback from './component/feedBack';

import './Styles/main.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);

  const showSection = (sectionId) => {
    setCurrentView(sectionId);
  };

  return (
    <div className="app">
      <Header showSection={showSection} />
      <Sidebar showSection={showSection} />  {/* Add Sidebar here */}
      <main style={{ marginLeft: '220px', padding: '20px' }}> {/* Adjust main content for sidebar */}
        {currentView === 'registration' && <Register showSection={showSection} setUser={setUser} />}
        {currentView === 'login' && <Login showSection={showSection} setUser={setUser} />}
        {currentView === 'user-dashboard' && <UserDashboard user={user} />}
        {currentView === 'admin-dashboard' && <AdminDashboard />}
        {currentView === 'feedback' && <Feedback />}
        {currentView === 'booking' && <Booking />}

      </main>
    </div>
  );
}

export default App;
