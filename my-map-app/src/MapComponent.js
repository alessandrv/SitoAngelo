import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
// Important: Import the Leaflet CSS
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import './SearchBar.css';

// Fix the default icon issue in Leaflet
function fixLeafletIcon() {
  delete L.Icon.Default.prototype._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: icon,
    iconUrl: icon,
    shadowUrl: iconShadow
  });
}

// House coordinates (San Francisco, change as needed)
const defaultHouseCoordinates = [37.7749, -122.4194];

// Create a custom house icon
const houseIcon = L.icon({
  iconUrl: 'https://img.icons8.com/color/48/000000/cottage.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

// Component to handle map center updates
const ChangeMapView = ({ center }) => {
  const map = useMap();
  map.setView(center, 13);
  return null;
};

const MapComponent = () => {
  // Fix Leaflet icon issues on component mount
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const [center, setCenter] = useState(defaultHouseCoordinates);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [customMarkers, setCustomMarkers] = useState([
    {
      position: defaultHouseCoordinates,
      name: 'Default House',
      description: 'This gorgeous property is available for viewing!',
      id: 'default'
    }
  ]);
  const [showAddMarkerForm, setShowAddMarkerForm] = useState(false);
  const [newMarkerData, setNewMarkerData] = useState({
    name: '',
    description: ''
  });
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Search for location using Nominatim API
  const searchLocation = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching for location:', error);
      alert('Failed to search for location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Select a location from search results
  const selectLocation = (result) => {
    const newCenter = [parseFloat(result.lat), parseFloat(result.lon)];
    setCenter(newCenter);
    setSelectedLocation({
      position: newCenter,
      display_name: result.display_name
    });
    setSearchResults([]);
    setShowAddMarkerForm(true);
  };

  // Add a new custom marker
  const addCustomMarker = (e) => {
    e.preventDefault();
    
    if (!selectedLocation || !newMarkerData.name) return;
    
    const newMarker = {
      position: selectedLocation.position,
      name: newMarkerData.name,
      description: newMarkerData.description || 'No description provided.',
      id: Date.now().toString()
    };
    
    setCustomMarkers([...customMarkers, newMarker]);
    setNewMarkerData({ name: '', description: '' });
    setShowAddMarkerForm(false);
    setSelectedLocation(null);
  };

  // Cancel adding a new marker
  const cancelAddMarker = () => {
    setShowAddMarkerForm(false);
    setNewMarkerData({ name: '', description: '' });
    setSelectedLocation(null);
  };

  return (
    <div className="map-container">
      {/* Search bar and form */}
      <div className="search-container">
        <form onSubmit={searchLocation} className="search-form">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for an address..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        {/* Search results */}
        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Search Results:</h3>
            <ul>
              {searchResults.map((result) => (
                <li key={result.place_id} onClick={() => selectLocation(result)}>
                  {result.display_name}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Add marker form */}
        {showAddMarkerForm && selectedLocation && (
          <div className="add-marker-form">
            <h3>Add a House at this Location</h3>
            <p><strong>Address:</strong> {selectedLocation.display_name}</p>
            <form onSubmit={addCustomMarker}>
              <div className="form-group">
                <label htmlFor="name">House Name:</label>
                <input
                  type="text"
                  id="name"
                  value={newMarkerData.name}
                  onChange={(e) => setNewMarkerData({...newMarkerData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  value={newMarkerData.description}
                  onChange={(e) => setNewMarkerData({...newMarkerData, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="add-button">Add House</button>
                <button type="button" className="cancel-button" onClick={cancelAddMarker}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* Map with markers */}
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: '100%', height: '100vh' }}
      >
        <ChangeMapView center={center} />
        
        {/* Minimalist Map Tile Layer - Shows streets, water, and green areas */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Display all custom markers */}
        {customMarkers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={marker.position} 
            icon={houseIcon}
          >
            <Popup>
              <div>
                <h3>{marker.name}</h3>
                <p>{marker.description}</p>
                <p>Location: {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}</p>
                <button onClick={() => alert(`Booking requested for ${marker.name}!`)}>
                  Book a viewing
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent; 