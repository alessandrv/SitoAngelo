import React, { useState } from 'react';
import './CustomMap.css';

// This is a very simplified custom map visualization
// It doesn't use real geographic data or external map providers
// For a real application, you would need more sophisticated implementation

const CustomMap = () => {
  const [houses, setHouses] = useState([
    { id: 1, x: 150, y: 150, name: "Beach House", description: "Beautiful house near the ocean" },
    { id: 2, x: 300, y: 200, name: "Mountain Retreat", description: "Cozy cabin in the mountains" }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [newHouse, setNewHouse] = useState({ name: '', description: '' });
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [selectedHouse, setSelectedHouse] = useState(null);
  
  // Handle clicks on the map to place new houses
  const handleMapClick = (e) => {
    // Get the click position relative to the map container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setClickPosition({ x, y });
    setShowForm(true);
    setSelectedHouse(null);
  };
  
  // Add a new house to the map
  const addHouse = (e) => {
    e.preventDefault();
    
    if (!newHouse.name) return;
    
    const newHouseObj = {
      id: Date.now(),
      x: clickPosition.x,
      y: clickPosition.y,
      name: newHouse.name,
      description: newHouse.description || 'No description provided.'
    };
    
    setHouses([...houses, newHouseObj]);
    setNewHouse({ name: '', description: '' });
    setShowForm(false);
  };
  
  // Show house details when clicked
  const showHouseDetails = (house) => {
    setSelectedHouse(house);
    setShowForm(false);
  };
  
  return (
    <div className="custom-map-container">
      {/* Simplified map visualization */}
      <div className="custom-map" onClick={handleMapClick}>
        {/* Draw houses on the map */}
        {houses.map((house) => (
          <div
            key={house.id}
            className="house-marker"
            style={{ left: `${house.x}px`, top: `${house.y}px` }}
            onClick={(e) => {
              e.stopPropagation();
              showHouseDetails(house);
            }}
            title={house.name}
          >
            🏠
          </div>
        ))}
      </div>
      
      {/* Form to add a new house */}
      {showForm && (
        <div className="house-form">
          <h3>Add a New House</h3>
          <form onSubmit={addHouse}>
            <div className="form-group">
              <label>House Name:</label>
              <input
                type="text"
                value={newHouse.name}
                onChange={(e) => setNewHouse({...newHouse, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={newHouse.description}
                onChange={(e) => setNewHouse({...newHouse, description: e.target.value})}
                rows="3"
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="add-button">Add House</button>
              <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Show house details when a house is selected */}
      {selectedHouse && (
        <div className="house-details">
          <h3>{selectedHouse.name}</h3>
          <p>{selectedHouse.description}</p>
          <button onClick={() => alert(`Booking requested for ${selectedHouse.name}!`)}>
            Book a viewing
          </button>
          <button className="close-button" onClick={() => setSelectedHouse(null)}>
            Close
          </button>
        </div>
      )}
      
      {/* Instructions */}
      <div className="map-instructions">
        <p>Click anywhere on the map to add a house. Click on a house to view details.</p>
      </div>
    </div>
  );
};

export default CustomMap; 