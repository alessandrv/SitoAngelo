import React, { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import ListingSidebar from "./ListingSidebar";
import Header from "./components/header/Header";
import "./App.css";

function App() {
  const [listings, setListings] = useState([]);
  const [hoveredListingId, setHoveredListingId] = useState(null);
  const [activeListingId, setActiveListingId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapVisible, setMapVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (!mobile) {
        setMapVisible(false);
      } else {
        setMapVisible(true);
      }
    };
    
    checkIfMobile();
    
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleMapVisibility = () => {
    setMapVisible((prevState) => !prevState);
  };

  const handleListingsChange = (newListings) => {
    setListings(newListings);
  };

  const handleListingHover = (listingId) => {
    setHoveredListingId(listingId);
  };

  const handleListingClick = (listing) => {
    setActiveListingId(listing.id);
  };

  const handleHeaderSearch = (query) => {
    setSearchQuery(query);
  };

  const handleLocationSelect = (center) => {
    setSelectedLocation(center);
  };

  return (
    <div className="app-container">
      <Header
        onSearch={handleHeaderSearch}
        onLocationSelect={handleLocationSelect}
      />
      <div className={`app ${isMobile ? 'mobile-layout' : 'desktop-layout'}`}>
        <div className={`sidebar ${isMobile && mapVisible ? "hidden" : "visible"}`}>
          <ListingSidebar
            listings={listings}
            onListingHover={handleListingHover}
            onListingClick={handleListingClick}
            activeListingId={activeListingId}
          />
        </div>
        
        <div className={`map-section ${isMobile ? (mapVisible ? "visible" : "hidden") : "visible"}`}>
          <MapComponent
            onListingsChange={handleListingsChange}
            hoveredListingId={hoveredListingId}
            activeListingId={activeListingId}
            searchQuery={searchQuery}
            selectedLocation={selectedLocation}
          />
        </div>
      </div>

      <button className={`toggle-map-btn ${isMobile ? 'show-toggle' : ''}`} onClick={toggleMapVisibility}>
        {mapVisible ? "View Listings" : "View Map"}
      </button>
    </div>
  );
}

export default App;
