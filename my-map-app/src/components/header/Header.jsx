import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './headers.css';

function Header() {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const searchButton = () => {
    console.log(search);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <div className="header-container">
        <h1>Web App</h1>
        <span className='search'>
          <input 
            type="text" 
            placeholder="Cerca la tua prossima casa!" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <button onClick={searchButton} className='searchButton'>
            Search
          </button>
        </span>

        {/* Hamburger menu */}
        <div className="hamburger-menu" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Close (X) icon */}
        <div className={`${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        {/* Menu */}
        <nav className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <ul>
            <li>
              <h3 className={`close-menu ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>X</h3>
            </li>
            <li>
              <Link to="/" className='mobile'>Home</Link>
            </li>
            <li>
              <Link to="/ContactUs" className='mobile'>Contattaci</Link>
            </li>
            <li>
              <Link to="/AboutUs" className='mobile'>Chi Siamo</Link>
            </li>
            <li>
              <Link to="/login" className='mobile'>Login</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
