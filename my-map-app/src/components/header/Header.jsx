import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './headers.css';
import { FaSearch, FaUserCircle, FaBars } from 'react-icons/fa';

const Header = ({ onSearch, onLocationSelect }) => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const accountMenuRef = useRef(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
      
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search function - get suggestions as user types
  useEffect(() => {
    // Only trigger search if there's at least 3 characters
    if (search.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      searchLocation();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const searchLocation = async () => {
    if (!search.trim() || search.trim().length < 3) {
      return;
    }
    
    setIsSearching(true);
    
    try {
      console.log('Searching for:', search);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&limit=5`
      );
      
      const data = await response.json();
      console.log('Search results:', data);
      setSearchResults(data);
      
      // Notify parent component about the search
      if (onSearch) {
        onSearch(search);
      }
    } catch (error) {
      console.error('Error searching for location:', error);
      alert('Failed to search for location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search button click
  const handleSearchClick = (e) => {
    e.preventDefault();
    searchLocation();
    
    // If there's only one result and we're done searching, select it automatically
    if (searchResults.length === 1 && !isSearching) {
      selectLocation(searchResults[0]);
    } else {
      // Blur input to remove focus after search
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const selectLocation = (result) => {
    console.log('Selected location:', result);
    // Clear search results after selection
    setSearchResults([]);
    setSearch(result.display_name);
    
    // Notify parent component about the selected location
    if (onLocationSelect) {
      const newCenter = [parseFloat(result.lat), parseFloat(result.lon)];
      onLocationSelect(newCenter);
    }
    
    // Close menu if open on mobile
    if (menuOpen) {
      setMenuOpen(false);
    }
    
    // Blur input to remove focus after selection
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults.length > 0) {
        selectLocation(searchResults[0]);
      } else {
        searchLocation();
        // Blur input to remove focus after search
        if (inputRef.current) {
          inputRef.current.blur();
        }
      }
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleAccountMenu = () => {
    setAccountMenuOpen(!accountMenuOpen);
  };

  return (
    <header className="header-container">
      <div className="logo">
        <Link to="/">Fakebnb</Link>
      </div>

      <div className="search" ref={searchRef}>
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for a location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <button 
            onClick={handleSearchClick} 
            className="searchButton" 
            disabled={isSearching}
          >
            <FaSearch />
          </button>
        </form>

        {/* Search results dropdown */}
        {searchResults.length > 0 && (
          <div className="search-results-dropdown">
            <ul>
              {searchResults.map((result) => (
                <li 
                  key={result.place_id} 
                  onClick={() => selectLocation(result)}
                >
                  {result.display_name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="right-section">
       

        {/* Account Menu */}
        <div className="account-menu-container" ref={accountMenuRef}>
          <button 
            className="account-button" 
            onClick={toggleAccountMenu}
            aria-label="Open account menu"
          >
            <div className="account-button-content">
              <FaBars className="menu-icon" />
              <FaUserCircle className="user-icon" />
            </div>
          </button>
          
          {accountMenuOpen && (
            <div className="account-dropdown">
              <div className="account-dropdown-content">
                <ul>
                  <li className="dropdown-header">Account</li>
                  <li><Link to="/signup">Sign up</Link></li>
                  <li><Link to="/login">Log in</Link></li>
                  <li className="divider"></li>
                  <li><Link to="/host">Host your home</Link></li>
                  <li><Link to="/host-experience">Host an experience</Link></li>
                  <li><Link to="/help">Help</Link></li>
                </ul>
              </div>
            </div>
          )}
        </div>

       

       
      </div>
    </header>
  );
};

export default Header;
