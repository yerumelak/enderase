import React from 'react';
import '../Styles/Header.css';

const Header = ({ showSection, handleLogout }) => {
  return (
    <header>
      {/* <h1>
        እነደራሴ
        <span className="smaller-text">Enderase Carparking</span>
      </h1> */}
      <nav>
        <ul>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
