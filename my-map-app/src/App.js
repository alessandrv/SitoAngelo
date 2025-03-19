import React, { useState } from "react";
import MapComponent from "./MapComponent";
import ListingSidebar from "./ListingSidebar";
import "./App.css";

function App() {
  const [listings, setListings] = useState([]);
  const [hoveredListingId, setHoveredListingId] = useState(null);
  const [activeListingId, setActiveListingId] = useState(null);

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

  return (
    <>
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
          />
        </div>
      </div>
    </>
  );
}

export default App;
