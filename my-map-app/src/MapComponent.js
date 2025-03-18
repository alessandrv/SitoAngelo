import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
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

// Default coordinates (San Francisco)
const defaultCoordinates = [37.7749, -122.4194];

// Create a custom house icon
const createHouseIcon = (isActive = false) => {
  return L.icon({
    iconUrl: isActive 
      ? 'https://img.icons8.com/color/48/000000/cottage.png'
      : 'https://img.icons8.com/color/48/000000/cottage.png',
    iconSize: isActive ? [48, 48] : [40, 40],
    iconAnchor: isActive ? [24, 48] : [20, 40],
    popupAnchor: [0, -40],
    className: isActive ? 'active-house-icon' : ''
  });
};

// Create a user location icon
const userLocationIcon = L.icon({
  iconUrl: 'https://img.icons8.com/color/48/000000/marker--v1.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Modified ChangeMapView to use smart zoom behavior
const ChangeMapView = ({ center, shouldUpdate }) => {
  const map = useMap();
  
  useEffect(() => {
    if (shouldUpdate) {
      // Get the current zoom level
      const currentZoom = map.getZoom();
      
      // Define the optimal zoom level for viewing a property
      const optimalPropertyZoom = 15;
      
      // Define a minimum zoom threshold - if we're zoomed out beyond this,
      // we'll adjust the zoom to ensure the property is visible
      const minZoomThreshold = 11;
      
      if (currentZoom < minZoomThreshold) {
        // We're too zoomed out to properly see the property
        // Use a better zoom level but not the maximum detail
        map.setView(center, 13);
      } else {
        // Current zoom is sufficient, just pan to the new center
        map.setView(center, currentZoom);
      }
    }
  }, [center, map, shouldUpdate]);
  
  return null;
};

// Component to track map bounds and update visible properties
const BoundsWatcher = ({ onBoundsChange, markers }) => {
  const map = useMapEvents({
    moveend: () => {
      const bounds = map.getBounds();
      const visibleMarkers = markers.filter(marker => 
        bounds.contains(L.latLng(marker.position[0], marker.position[1]))
      );
      onBoundsChange(visibleMarkers, map);
    },
    zoomend: () => {
      const bounds = map.getBounds();
      const visibleMarkers = markers.filter(marker => 
        bounds.contains(L.latLng(marker.position[0], marker.position[1]))
      );
      onBoundsChange(visibleMarkers, map);
    }
  });

  // Initialize visible markers
  useEffect(() => {
    if (map) {
      const bounds = map.getBounds();
      const visibleMarkers = markers.filter(marker => 
        bounds.contains(L.latLng(marker.position[0], marker.position[1]))
      );
      onBoundsChange(visibleMarkers, map);
    }
  }, [markers, map, onBoundsChange]);

  return null;
};

// Component to handle marker updates
const DynamicMarker = ({ position, isActive, isHovered, popup, onClick }) => {
  const markerRef = useRef(null);
  
  // Control popup opening/closing based on hover or active state
  useEffect(() => {
    if (!markerRef.current) return;
    
    const marker = markerRef.current;
    
    // Open popup if marker is active (clicked) or hovered
    if ((isActive || isHovered) && marker) {
      marker.openPopup();
    } 
    // Close popup if not active and not hovered
    else if (!isActive && !isHovered && marker) {
      marker.closePopup();
    }
  }, [isActive, isHovered]);
  
  return (
    <Marker 
      ref={markerRef}
      position={position} 
      icon={createHouseIcon(isActive || isHovered)}
      eventHandlers={{
        click: onClick
      }}
    >
      {popup}
    </Marker>
  );
};

// Modified function to use map zoom level and actual icon dimensions for collision detection
// AND track collision groups for hover behavior
function filterCollidingMarkers(markers, previouslyDisplayed = [], map = null, iconSize = 40, hoveredListingId = null) {
  if (!markers || markers.length === 0 || !map) return markers;
  
  // Calculate distance between markers based on their pixel positions on the screen
  const getPixelDistance = (pos1, pos2) => {
    // Convert lat/lng to pixel coordinates based on current map view
    const pixel1 = map.latLngToContainerPoint(L.latLng(pos1[0], pos1[1]));
    const pixel2 = map.latLngToContainerPoint(L.latLng(pos2[0], pos2[1]));
    
    // Calculate Euclidean distance in pixels
    const dx = pixel1.x - pixel2.x;
    const dy = pixel1.y - pixel2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Create groups of colliding markers based on pixel distance
  const groups = [];
  const processed = new Set();
  
  markers.forEach((marker, i) => {
    if (processed.has(i)) return;
    
    const group = [i];
    processed.add(i);
    
    markers.forEach((otherMarker, j) => {
      if (i !== j && !processed.has(j)) {
        const distance = getPixelDistance(marker.position, otherMarker.position);
        // Use icon size to determine collision (if icons overlap)
        if (distance < iconSize) {
          group.push(j);
          processed.add(j);
        }
      }
    });
    
    groups.push(group);
  });
  
  // For each collision group, prefer to select a previously displayed marker if available
  // OR the currently hovered marker if it's in this group
  const selectedIndices = groups.map(group => {
    // If only one marker in the group (no collision), just return it
    if (group.length === 1) {
      return group[0];
    }

    // Get the marker IDs in this group
    const groupMarkerIds = group.map(idx => markers[idx].id);
    
    // If the currently hovered listing ID matches a marker in this group, prioritize it
    if (hoveredListingId && groupMarkerIds.includes(hoveredListingId)) {
      const hoveredIdx = group.find(idx => markers[idx].id === hoveredListingId);
      if (hoveredIdx !== undefined) {
        return hoveredIdx;
      }
    }
    
    // Otherwise, check if any marker in this group was previously displayed
    const previouslyShownInGroup = previouslyDisplayed.find(
      prevMarker => groupMarkerIds.includes(prevMarker.id)
    );
    
    // If we have a previously shown marker in this group, use it
    if (previouslyShownInGroup) {
      const idxInGroup = group.findIndex(idx => markers[idx].id === previouslyShownInGroup.id);
      if (idxInGroup >= 0) {
        return group[idxInGroup];
      }
    }
    
    // Otherwise, select a random marker from the group
    const randomIdx = Math.floor(Math.random() * group.length);
    return group[randomIdx];
  });
  
  // Store collision group information on the markers
  const result = markers.filter((_, idx) => selectedIndices.includes(idx));
  
  // Add collision group info to each marker
  groups.forEach(group => {
    if (group.length > 1) {
      // This is a collision group
      const groupMarkerIds = group.map(idx => markers[idx].id);
      
      // Find the selected marker(s) from this group
      result.forEach(marker => {
        if (groupMarkerIds.includes(marker.id)) {
          // This marker is part of a collision group
          marker.collisionGroup = groupMarkerIds;
        }
      });
    }
  });
  
  return result;
}

const MapComponent = ({ onListingsChange, hoveredListingId, activeListingId }) => {
  // Fix Leaflet icon issues on component mount
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const [center, setCenter] = useState(defaultCoordinates);
  const [shouldUpdateView, setShouldUpdateView] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [customMarkers, setCustomMarkers] = useState([
    {
      position: defaultCoordinates,
      name: 'Beautiful Waterfront Home',
      description: 'Gorgeous property with stunning views of the bay. Features 3 bedrooms, 2 bathrooms, and a modern kitchen.',
      id: 'default'
    },
    {
      position: [37.7849, -122.4294],
      name: 'Charming Victorian House',
      description: 'Classic San Francisco Victorian home with original details. Located in a vibrant neighborhood with excellent restaurants.',
      id: 'house2'
    },
    {
      position: [37.7649, -122.4094],
      name: 'Modern Downtown Loft',
      description: 'Sleek urban loft with high ceilings and floor-to-ceiling windows. Close to public transit and shopping.',
      id: 'house3'
    },
    // Add some markers that are very close to each other to test collision detection
    {
      position: [37.7650, -122.4095], // Very close to Modern Downtown Loft
      name: 'Downtown Luxury Condo',
      description: 'Luxurious condominium in the heart of downtown with stunning city views and premium amenities.',
      id: 'house4'
    },
    {
      position: [37.7651, -122.4093], // Very close to Modern Downtown Loft
      name: 'Urban Studio Apartment',
      description: 'Chic studio apartment with modern design. Perfect for young professionals working downtown.',
      id: 'house5'
    }
  ]);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [displayedMarkers, setDisplayedMarkers] = useState([]);
  const [showAddMarkerForm, setShowAddMarkerForm] = useState(false);
  const [newMarkerData, setNewMarkerData] = useState({
    name: '',
    description: ''
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [collisionGroups, setCollisionGroups] = useState({}); // Track collision groups
  const [lastSelectedInGroup, setLastSelectedInGroup] = useState({}); // Track last selected marker in each group

  // Initialize the map reference
  const handleMapCreate = (map) => {
    setMapInstance(map);
  };

  // Handle changes in visible markers (within map bounds)
  const handleBoundsChange = (newVisibleMarkers, map) => {
    setVisibleMarkers(newVisibleMarkers);
    
    // Store the map instance for future reference
    if (map && !mapInstance) {
      setMapInstance(map);
    }
    
    // Use the map instance to calculate collisions with zoom-awareness
    const currentMap = map || mapInstance;
    
    // Filter colliding markers for display on the map, using the icon size
    const iconSize = 40; // Size of our house icon in pixels
    
    // Use the currently hovered listing ID and last selected marker in each group for stable filtering
    const filteredForDisplay = filterCollidingMarkers(
      newVisibleMarkers, 
      displayedMarkers, 
      currentMap, 
      iconSize,
      hoveredListingId || null
    );
    
    // Extract collision groups from the filtered markers
    const groups = {};
    filteredForDisplay.forEach(marker => {
      if (marker.collisionGroup) {
        groups[marker.collisionGroup.join('_')] = marker.collisionGroup;
      }
    });
    setCollisionGroups(groups);
    
    // Apply last selected markers that should persist
    let finalMarkers = [...filteredForDisplay];
    
    // For each collision group, if we previously selected a marker via hover,
    // make sure it's still displayed even after hover ends
    Object.entries(lastSelectedInGroup).forEach(([groupKey, selectedId]) => {
      const group = groups[groupKey];
      if (group && !hoveredListingId) {
        // There's no current hover, but we have a persisting selection for this group
        
        // Check if the selected marker is already displayed
        const isDisplayed = finalMarkers.some(m => m.id === selectedId);
        
        if (!isDisplayed && group.includes(selectedId)) {
          // The persisting marker is not displayed but should be
          
          // Find the marker to replace
          const markerToReplace = finalMarkers.find(m => 
            m.collisionGroup && m.collisionGroup.join('_') === groupKey
          );
          
          if (markerToReplace) {
            // Find the marker data for the selected ID
            const replacementMarker = newVisibleMarkers.find(m => m.id === selectedId);
            
            if (replacementMarker) {
              // Replace the marker
              finalMarkers = finalMarkers.filter(m => m.id !== markerToReplace.id);
              
              // Copy collision group info to the replacement
              replacementMarker.collisionGroup = group;
              finalMarkers.push(replacementMarker);
            }
          }
        }
      }
    });
    
    setDisplayedMarkers(finalMarkers);
    
    // Pass all visible markers to the parent component for the sidebar
    if (onListingsChange) {
      onListingsChange(newVisibleMarkers);
    }
  };

  // Update hover state without changing map view
  useEffect(() => {
    if (hoveredListingId) {
      setShouldUpdateView(false);
    }
  }, [hoveredListingId]);

  // Update center with auto-panning when explicitly clicking on a listing
  useEffect(() => {
    if (activeListingId) {
      const activeListing = customMarkers.find(marker => marker.id === activeListingId);
      if (activeListing) {
        setCenter(activeListing.position);
        setShouldUpdateView(true);
      }
    }
  }, [activeListingId, customMarkers]);

  // Locate the user on initial load
  useEffect(() => {
    locateUser();
  }, []);

  // Function to get user's geolocation
  const locateUser = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    setGeoError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setCenter([latitude, longitude]);
        setShouldUpdateView(true);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setGeoError("Location permission denied. Please enable location services.");
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setGeoError("Location request timed out.");
            break;
          default:
            setGeoError("An unknown error occurred while getting location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

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
    setShouldUpdateView(true);
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
  
  // Handle marker click
  const handleMarkerClick = (markerId) => {
    // Do not change center on marker click
  };

  // Update when a listing is hovered to show hidden colliding markers
  useEffect(() => {
    if (hoveredListingId) {
      // First, find if this marker is part of a collision group
      // and if it's not currently displayed
      const isDisplayed = displayedMarkers.some(m => m.id === hoveredListingId);
      
      if (!isDisplayed) {
        // Find the collision group this marker belongs to
        for (const marker of displayedMarkers) {
          if (marker.collisionGroup && marker.collisionGroup.includes(hoveredListingId)) {
            // This marker is visible and part of a collision group containing our hovered marker
            // We need to recalculate which markers to display
            if (mapInstance) {
              // Update last selected in this group
              setLastSelectedInGroup(prev => ({
                ...prev,
                [marker.collisionGroup.join('_')]: hoveredListingId
              }));
            }
            break;
          }
        }
      }
    }
  }, [hoveredListingId, displayedMarkers, mapInstance]);

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
        
        {/* Geolocation button */}
        <div className="geolocation-controls">
          <button 
            onClick={locateUser} 
            className="locate-button"
            disabled={isLocating}
          >
            {isLocating ? 'Locating...' : 'Use My Location'}
          </button>
          {geoError && <p className="geo-error">{geoError}</p>}
        </div>
        
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
        ref={mapRef}
        center={center}
        zoom={13}
        style={{ width: '100%', height: '100vh' }}
        whenCreated={handleMapCreate}
      >
        <ChangeMapView center={center} shouldUpdate={shouldUpdateView} />
        <BoundsWatcher onBoundsChange={handleBoundsChange} markers={customMarkers} />
        
        {/* Minimalist Map Tile Layer - Shows streets, water, and green areas */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={userLocation} 
            icon={userLocationIcon}
          >
            <Popup>
              <div>
                <h3>Your Location</h3>
                <p>This is your current position based on your device's GPS or network location.</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Display non-colliding or randomly selected markers */}
        {displayedMarkers.map((marker) => (
          <DynamicMarker
            key={marker.id}
            position={marker.position}
            isActive={activeListingId === marker.id}
            isHovered={hoveredListingId === marker.id}
            onClick={() => handleMarkerClick(marker.id)}
            popup={
              <Popup 
                autoPan={false} 
                closeButton={activeListingId === marker.id}
                autoClose={activeListingId !== marker.id}
              >
                <div>
                  <h3>{marker.name}</h3>
                  <p>{marker.description}</p>
                  <p>Location: {marker.position[0].toFixed(4)}, {marker.position[1].toFixed(4)}</p>
                  <button onClick={() => alert(`Booking requested for ${marker.name}!`)}>
                    Book a viewing
                  </button>
                </div>
              </Popup>
            }
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent; 