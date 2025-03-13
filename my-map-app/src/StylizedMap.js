import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './StylizedMap.css';

// Mapbox requires an access token - you need to sign up and get your own
// Free tier: 50,000 map loads per month
const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN'; // Replace with your token

const StylizedMap = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-122.4194);
  const [lat, setLat] = useState(37.7749);
  const [zoom, setZoom] = useState(12);
  const [markers, setMarkers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProperty, setNewProperty] = useState({ name: '', description: '' });
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (map.current) return; // Initialize map only once
    
    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11', // Minimalist light style
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false // Hide default attribution control
    });

    // Add minimal attribution in our own style
    map.current.addControl(
      new mapboxgl.AttributionControl({
        compact: true,
        customAttribution: '© Mapbox'
      }),
      'bottom-right'
    );

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Save map position on move
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    // Setup click handler for adding markers
    map.current.on('click', (e) => {
      setSelectedLocation({
        lng: e.lngLat.lng,
        lat: e.lngLat.lat
      });
      setShowAddForm(true);
    });
  }, []);

  // Search for an address using Mapbox Geocoding API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchInput)}.json?access_token=${MAPBOX_TOKEN}&limit=5`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const location = data.features[0];
        
        // Center map on the first result
        map.current.flyTo({
          center: location.center,
          zoom: 15,
          essential: true
        });
        
        // Set up to add a marker at this location
        setSelectedLocation({
          lng: location.center[0],
          lat: location.center[1],
          address: location.place_name
        });
        setShowAddForm(true);
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Failed to search for location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Add a new property marker
  const addProperty = (e) => {
    e.preventDefault();
    
    if (!selectedLocation || !newProperty.name) return;
    
    // Create marker
    const newMarker = new mapboxgl.Marker({
      color: "#FF385C" // Airbnb-style red
    })
      .setLngLat([selectedLocation.lng, selectedLocation.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(
            `<h3>${newProperty.name}</h3>
            <p>${newProperty.description || 'No description provided.'}</p>
            <p><button class="popup-button">Book a viewing</button></p>`
          )
      )
      .addTo(map.current);
    
    // Add click event for popup button
    setTimeout(() => {
      const popupButton = document.querySelector('.popup-button');
      if (popupButton) {
        popupButton.addEventListener('click', () => {
          alert(`Booking requested for ${newProperty.name}!`);
        });
      }
    }, 100);
    
    // Save marker for cleanup
    setMarkers(prev => [...prev, newMarker]);
    
    // Reset form
    setNewProperty({ name: '', description: '' });
    setShowAddForm(false);
    setSelectedLocation(null);
  };

  return (
    <div className="stylized-map-container">
      {/* Search bar */}
      <div className="search-controls">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for an address..."
            className="search-input"
          />
          <button type="submit" className="search-button" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
      
      {/* Add property form */}
      {showAddForm && selectedLocation && (
        <div className="property-form">
          <h3>Add a Property</h3>
          {selectedLocation.address && (
            <p className="location-address">{selectedLocation.address}</p>
          )}
          <form onSubmit={addProperty}>
            <div className="form-group">
              <label>Property Name:</label>
              <input
                type="text"
                value={newProperty.name}
                onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={newProperty.description}
                onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                rows="3"
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="add-button">Add Property</button>
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedLocation(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Map container */}
      <div ref={mapContainer} className="map" />
      
      {/* Instructions */}
      <div className="map-info">
        <p>Click anywhere on the map to add a property, or search for an address.</p>
      </div>
    </div>
  );
};

export default StylizedMap; 