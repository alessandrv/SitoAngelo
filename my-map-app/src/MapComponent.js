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

// Default coordinates (Center of Italy)
const defaultCoordinates = [42.7, 12.8];

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

// Component to force map refresh when needed
const MapRefresher = () => {
  const map = useMap();
  
  useEffect(() => {
    // Force a map refresh to fix mobile rendering issues
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);
  
  return null;
};

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

const MapComponent = ({ onListingsChange, hoveredListingId, activeListingId, searchQuery, selectedLocation }) => {
  // Fix Leaflet icon issues on component mount
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const [center, setCenter] = useState(defaultCoordinates);
  const [shouldUpdateView, setShouldUpdateView] = useState(true);
  const [customMarkers, setCustomMarkers] = useState([
    {
      position: defaultCoordinates,
      name: 'Historic Apartment in Centro Storico',
      description: 'Beautiful apartment in the heart of Rome with stunning views of ancient architecture. Walking distance to the Colosseum and Pantheon.',
      id: 'default'
    },
    {
      position: [43.7696, 11.2558],
      name: 'Renaissance Villa in Florence',
      description: 'Elegant Florentine villa with original Renaissance details. Located near the Duomo with a private garden and terrace.',
      id: 'house2'
    },
    {
      position: [45.4642, 9.1900],
      name: 'Modern Loft in Milan',
      description: 'Contemporary loft in Milan\'s fashion district. High ceilings, designer furnishings, and close to world-class shopping and dining.',
      id: 'house3'
    },
    {
      position: [45.4371, 12.3326],
      name: 'Canal-side Apartment in Venice',
      description: 'Charming apartment overlooking a quiet canal in Venice. Authentic Venetian decor with modern amenities and a water entrance.',
      id: 'house4'
    },
    {
      position: [40.8518, 14.2681],
      name: 'Coastal Villa in Naples',
      description: 'Stunning villa with panoramic views of the Bay of Naples and Mount Vesuvius. Features a private pool and Mediterranean garden.',
      id: 'house5'
    },
    {
      position: [38.1157, 13.3615],
      name: 'Historic Palazzo in Palermo',
      description: 'Restored historic palazzo in the heart of Palermo, Sicily. Featuring ornate Baroque details, high frescoed ceilings, and a central courtyard.',
      id: 'house6'
    }
  ]);
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [displayedMarkers, setDisplayedMarkers] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [collisionGroups, setCollisionGroups] = useState({});
  const [lastSelectedInGroup, setLastSelectedInGroup] = useState({});
  
  // Get user's location if available
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn("Error getting location:", error);
        }
      );
    }
  }, []);

  // Initialize the map reference
  const handleMapCreate = (map) => {
    setMapInstance(map);
  };

  // Handle changes in visible markers (within map bounds)
  const handleBoundsChange = (newVisibleMarkers, map) => {
    setVisibleMarkers(newVisibleMarkers);
    
    if (map && !mapInstance) {
      setMapInstance(map);
    }
    
    const currentMap = map || mapInstance;
    const iconSize = 40;
    
    const filteredForDisplay = filterCollidingMarkers(
      newVisibleMarkers, 
      displayedMarkers, 
      currentMap, 
      iconSize,
      hoveredListingId || null
    );
    
    const groups = {};
    filteredForDisplay.forEach(marker => {
      if (marker.collisionGroup) {
        groups[marker.collisionGroup.join('_')] = marker.collisionGroup;
      }
    });
    setCollisionGroups(groups);
    
    let finalMarkers = [...filteredForDisplay];
    
    Object.entries(lastSelectedInGroup).forEach(([groupKey, selectedId]) => {
      const group = groups[groupKey];
      if (group && !hoveredListingId) {
        const isDisplayed = finalMarkers.some(m => m.id === selectedId);
        
        if (!isDisplayed && group.includes(selectedId)) {
          const markerToReplace = finalMarkers.find(m => 
            m.collisionGroup && m.collisionGroup.join('_') === groupKey
          );
          
          if (markerToReplace) {
            const replacementMarker = newVisibleMarkers.find(m => m.id === selectedId);
            
            if (replacementMarker) {
              finalMarkers = finalMarkers.filter(m => m.id !== markerToReplace.id);
              replacementMarker.collisionGroup = group;
              finalMarkers.push(replacementMarker);
            }
          }
        }
      }
    });
    
    setDisplayedMarkers(finalMarkers);
    
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

  // Update map when a new location is selected from the header search
  useEffect(() => {
    if (selectedLocation) {
      setCenter(selectedLocation);
      setShouldUpdateView(true);
    }
  }, [selectedLocation]);

  // Handle marker click
  const handleMarkerClick = (markerId) => {
    // Do not change center on marker click
  };

  // Update when a listing is hovered to show hidden colliding markers
  useEffect(() => {
    if (hoveredListingId) {
      const isDisplayed = displayedMarkers.some(m => m.id === hoveredListingId);
      
      if (!isDisplayed) {
        for (const marker of displayedMarkers) {
          if (marker.collisionGroup && marker.collisionGroup.includes(hoveredListingId)) {
            if (mapInstance) {
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
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={5}
        style={{ width: '100%', height: '100%' }}
        whenCreated={handleMapCreate}
      >
        {/* Add this component to ensure map is properly sized on mobile */}
        <MapRefresher />
        <ChangeMapView center={center} shouldUpdate={shouldUpdateView} />
        <BoundsWatcher onBoundsChange={handleBoundsChange} markers={customMarkers} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
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