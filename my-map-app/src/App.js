import React, { useState } from "react";
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

  // Handle listings changing from map component
  const handleListingsChange = (newListings) => {
    setListings(newListings);
  };

  // Handle listing hover in sidebar
  const handleListingHover = (listingId) => {
    setHoveredListingId(listingId);
  };

  // Handle listing click in sidebar
  const handleListingClick = (listing) => {
    setActiveListingId(listing.id);
  };

  // Handle search from header
  const handleHeaderSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle location selection from header
  const handleLocationSelect = (center) => {
    setSelectedLocation(center);
  };

  return (
    <div className="app-container">
      <Header 
        onSearch={handleHeaderSearch}
        onLocationSelect={handleLocationSelect}
      />
      <div className="app">
        <ListingSidebar
          listings={listings}
          onListingHover={handleListingHover}
          onListingClick={handleListingClick}
          activeListingId={activeListingId}
        />
        <div className="map-section">
          <MapComponent
            onListingsChange={handleListingsChange}
            hoveredListingId={hoveredListingId}
            activeListingId={activeListingId}
            searchQuery={searchQuery}
            selectedLocation={selectedLocation}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
