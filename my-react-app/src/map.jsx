// src/App.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './App.css';
// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Coordinates for the house
const houseCoordinates = [51.505, -0.09]; // Example coordinates, change them as needed

const Map = () => {
  return (
    <div className="App">
      <MapContainer
        center={houseCoordinates}
        zoom={13}
        style={{ width: '100vw', height: '100vh' }}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Marker with custom house icon */}
        <Marker position={houseCoordinates} icon={createHouseIcon()}>
          <Popup>
            <h3>House</h3>
            <p>This is a house located here!</p>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

// Function to create a custom house icon
const createHouseIcon = () => {
  return L.icon({
    iconUrl: 'https://img.icons8.com/ios/50/000000/house.png', // Example house icon
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default Map;
