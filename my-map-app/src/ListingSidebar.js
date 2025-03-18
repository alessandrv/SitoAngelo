import React from 'react';
import './ListingSidebar.css';

const ListingSidebar = ({ listings, onListingHover, onListingClick, activeListingId }) => {
  return (
    <div className="listings-sidebar">
      <div className="listings-header">
        <h2>Properties In View</h2>
        <p>{listings.length} homes in current map area</p>
      </div>
      
      <div className="listings-container">
        {listings.length === 0 ? (
          <div className="no-listings">
            <p>No properties in the current map view.</p>
            <p>Try zooming out or panning to another area.</p>
          </div>
        ) : (
          listings.map(listing => (
            <div 
              key={listing.id}
              className={`listing-card ${activeListingId === listing.id ? 'active' : ''}`}
              onMouseEnter={() => onListingHover(listing.id)}
              onMouseLeave={() => onListingHover(null)}
              onClick={() => onListingClick(listing)}
            >
              <div className="listing-image">
                {/* Using a house emoji as a placeholder, you can replace with real images */}
                <div className="placeholder-image">🏠</div>
              </div>
              <div className="listing-content">
                <h3>{listing.name}</h3>
                <p className="listing-description">{listing.description}</p>
                <p className="listing-location">
                  Location: {listing.position[0].toFixed(4)}, {listing.position[1].toFixed(4)}
                </p>
                <button className="booking-button">Book a viewing</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListingSidebar; 