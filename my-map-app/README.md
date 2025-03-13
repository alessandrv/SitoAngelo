# Map Application with House Markers

This is a React application that shows a map with house markers, similar to Airbnb's interface.

## Features

- Two map options:
  1. OpenStreetMap (with required attribution)
  2. Custom map visualization (no attribution required)
- Interactive house markers
- Address search functionality
- Ability to add custom house markers

## Map Options

### OpenStreetMap (with Leaflet)
- Full-featured real-world map
- Uses OpenStreetMap data with required attribution
- Address search using Nominatim API
- Suitable for real-world applications

### Custom Map Visualization (No Attribution)
- Simplified map visualization with no external dependencies
- No attribution requirements
- Click anywhere to add house markers
- Stylized, abstract representation
- Suitable for demo/prototype applications

## Installation

1. Navigate to the project directory:
   ```
   cd my-map-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## How to Use

1. Choose between the two map options using the toggle in the top-right corner
2. **OpenStreetMap mode**:
   - Search for locations using the search bar
   - Click on search results to select a location
   - Add houses with custom names and descriptions
3. **Custom Map mode**:
   - Click anywhere on the stylized map to add a house
   - Fill in house details in the form
   - Click on house markers to view details

## Legal Considerations

- The OpenStreetMap integration requires attribution according to the [OpenStreetMap License](https://www.openstreetmap.org/copyright)
- The custom map visualization has no external dependencies and requires no attribution

## Technologies Used

- React
- react-leaflet (for the OpenStreetMap option)
- OpenStreetMap and Nominatim API (for real map data)
- Custom CSS for the attribution-free option 