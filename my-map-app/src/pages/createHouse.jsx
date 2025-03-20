import React, { useState, useEffect } from "react";
import Stepper, { Step } from "../components/stepper/Stepper";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MdClose } from "react-icons/md";
import "./createHouses.css";
import { FaSearch, FaChevronUp, FaChevronDown } from "react-icons/fa";

const CreateHouse = () => {
  const [address, setAddress] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [sqft, setSqft] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [position, setPosition] = useState([37.7749, -122.4194]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("houseForm"));
    if (savedData) {
      setAddress(savedData.address || "");
      setHouseNumber(savedData.houseNumber || "");
      setCity(savedData.city || "");
      setState(savedData.state || "");
      setCountry(savedData.country || "");
      setZip(savedData.zip || "");
      setPrice(savedData.price || "");
      setBedrooms(savedData.bedrooms || "");
      setBathrooms(savedData.bathrooms || "");
      setSqft(savedData.sqft || "");
      setDescription(savedData.description || "");
      setImages(savedData.images || []);
    }
  }, []);

  const saveToLocalStorage = () => {
    const formData = {
      address,
      houseNumber,
      city,
      state,
      country,
      zip,
      price,
      bedrooms,
      bathrooms,
      sqft,
      description,
      images,
    };
    localStorage.setItem("houseForm", JSON.stringify(formData));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const imageURLs = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageURLs]);
  };

  // Gestisce l'evento quando un file viene rilasciato (drag and drop)
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    const imageURLs = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageURLs]);
  };

  // Gestisce l'evento durante il trascinamento
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true); // Aggiungi la classe drag-over
  };

  // Gestisce l'evento quando il file esce dall'area di drag
  const handleDragLeave = () => {
    setIsDragging(false); // Rimuovi la classe drag-over
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const userLocationIcon = L.icon({
    iconUrl: "https://img.icons8.com/color/48/000000/marker--v1.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Funzione per geocodifica inversa con OpenCage API
  const geocodeAddress = (lat, lng, setName, setCity, setState, setZip) => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    )
      .then((response) => response.json())
      .then((result) => {
        const address = result.address;
        setAddress(address.road || "");
        setHouseNumber(address.house_number || "");
        setCity(address.city || address.town || "");
        setState(address.state || "");
        setZip(address.postcode || "");
        setCountry(address.country || "");
      })
      .catch((error) => console.error("Geocoding error:", error));
  };

  const searchLocation = async (search, setSearchResults, setIsSearching) => {
    if (!search.trim() || search.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          search
        )}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching for location:", error);
      alert("Failed to search for location. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchLocation(search, setSearchResults, setIsSearching);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSearchClick = (e) => {
    e.preventDefault();
    searchLocation(search, setSearchResults, setIsSearching);

    if (searchResults.length === 1 && !isSearching) {
      selectLocation(searchResults[0]);
    }
  };

  const selectLocation = (result) => {
    setSearchResults([]);
    setSearch(result.display_name);

    const lat = result.lat;
    const lng = result.lon;

    setPosition([lat, lng]);

    geocodeAddress(lat, lng, setAddress, setCity, setState, setZip);

    handleStepChange(1);
  };

  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    setPosition([lat, lng]);
    geocodeAddress(lat, lng, setAddress, setCity, setState, setZip);
  };

  // Add handlers for incrementing and decrementing number inputs
  const handleIncrement = (setter, value, step = 1) => {
    const numValue = parseFloat(value) || 0;
    setter((numValue + step).toString());
  };

  const handleDecrement = (setter, value, step = 1, min = 0) => {
    const numValue = parseFloat(value) || 0;
    if (numValue - step >= min) {
      setter((numValue - step).toString());
    } else {
      setter(min.toString());
    }
  };

  return (
    <div>
      <div className="stepper-container">
        <Stepper
          initialStep={1}
          onStepChange={handleStepChange}
          onFinalStepCompleted={() => saveToLocalStorage()}
          backButtonText="Previous"
          nextButtonText="Next"
        >
          <Step>
            <h2 className="mainRecup">Informazioni Personali</h2>
            <div className="step-map">
            <div className="search" >
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Search for a location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
          <button 
            onClick={handleSearchClick} 
            className="searchButton" 
            disabled={isSearching}
          >
            <FaSearch />
          </button>
        </form>

        {/* Search results dropdown */}
        {searchResults.length > 0 && (
          <div className="search-results-dropdown-header">
            <ul>
              {searchResults.map((result) => (
                <li 
                  key={result.place_id} 
                  onClick={() => selectLocation(result)}
                >
                  {result.display_name}
                </li>
              ))}
            </ul>
          </div>
        )}
    
               

                {/* Mappa Leaflet */}
                <MapContainer
                  center={position}
                  zoom={13}
                  className="map"
                  onClick={handleMapClick} // Ascolta i click sulla mappa
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={position} icon={userLocationIcon}>
                    <Popup>Your selected location</Popup>
                  </Marker>
                </MapContainer>
              </div>
              <form className="form">
                <div className="input-container">
                  <input
                    type="text"
                    placeholder=" "
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="formHouse"
                  />
                  <span className="floating-label">Address</span>
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder=" "
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    className="formHouse"
                  />
                  <span className="floating-label">House Number</span>
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder=" "
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="formHouse"
                  />
                  <span className="floating-label">City</span>
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder=" "
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="formHouse"
                  />
                  <span className="floating-label">State</span>
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder=" "
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="formHouse"
                  />
                  <span className="floating-label">Country</span>
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder=" "
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="formHouse"
                  />
                  <span className="floating-label">Zip</span>
                </div>
              </form>
            </div>
          </Step>

          <Step>
            <h2 className="mainRecup">Informazioni sulla casa</h2>
            <form className="form">
              {/* Price input with horizontal increment/decrement buttons */}
              <div className="horizontal-number-input">
                <label className="input-label">Price</label>
                <div className="input-control">
                  <button 
                    type="button" 
                    className="number-button minus" 
                    onClick={() => handleDecrement(setPrice, price, 100)}
                    aria-label="Decrease price"
                  >
                    <FaChevronDown />
                  </button>
                  <input
                    type="number"
                    id="price"
                    placeholder="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="value-input"
                  />
                  <button 
                    type="button" 
                    className="number-button plus" 
                    onClick={() => handleIncrement(setPrice, price, 100)}
                    aria-label="Increase price"
                  >
                    <FaChevronUp />
                  </button>
                </div>
              </div>
              
              {/* Bedrooms input with horizontal increment/decrement buttons */}
              <div className="horizontal-number-input">
                <label className="input-label">Bedrooms</label>
                <div className="input-control">
                  <button 
                    type="button" 
                    className="number-button minus" 
                    onClick={() => handleDecrement(setBedrooms, bedrooms, 1)}
                    aria-label="Decrease bedrooms"
                  >
                    <FaChevronDown />
                  </button>
                  <input
                    type="number"
                    id="bedrooms"
                    placeholder="0"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="value-input"
                  />
                  <button 
                    type="button" 
                    className="number-button plus" 
                    onClick={() => handleIncrement(setBedrooms, bedrooms, 1)}
                    aria-label="Increase bedrooms"
                  >
                    <FaChevronUp />
                  </button>
                </div>
              </div>
              
              {/* Bathrooms input with horizontal increment/decrement buttons */}
              <div className="horizontal-number-input">
                <label className="input-label">Bathrooms</label>
                <div className="input-control">
                  <button 
                    type="button" 
                    className="number-button minus" 
                    onClick={() => handleDecrement(setBathrooms, bathrooms, 1)}
                    aria-label="Decrease bathrooms"
                  >
                    <FaChevronDown />
                  </button>
                  <input
                    type="number"
                    id="bathrooms"
                    placeholder="0"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="value-input"
                  />
                  <button 
                    type="button" 
                    className="number-button plus" 
                    onClick={() => handleIncrement(setBathrooms, bathrooms, 1)}
                    aria-label="Increase bathrooms"
                  >
                    <FaChevronUp />
                  </button>
                </div>
              </div>
              
              {/* Square Footage input with horizontal increment/decrement buttons */}
              <div className="horizontal-number-input">
                <label className="input-label">Square Footage</label>
                <div className="input-control">
                  <button 
                    type="button" 
                    className="number-button minus" 
                    onClick={() => handleDecrement(setSqft, sqft, 50)}
                    aria-label="Decrease square footage"
                  >
                    <FaChevronDown />
                  </button>
                  <input
                    type="number"
                    id="sqft"
                    placeholder="0"
                    value={sqft}
                    onChange={(e) => setSqft(e.target.value)}
                    className="value-input"
                  />
                  <button 
                    type="button" 
                    className="number-button plus" 
                    onClick={() => handleIncrement(setSqft, sqft, 50)}
                    aria-label="Increase square footage"
                  >
                    <FaChevronUp />
                  </button>
                </div>
              </div>
              
              <div className="textarea-container">
                <textarea
                  id="description"
                  placeholder=" "
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-description"
                />
                <span className="floating-label">Description of the house</span>
              </div>
            </form>
          </Step>

          <Step>
            <h2 className="mainRecup">MOSTRACI LA TUA CASA!</h2>
            <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={isDragging ? "drag-over" : ""}
      >
            <div className="button-file">
      <input
        type="file"
        accept="image/*"
        id="file-input"
        onChange={handleImageChange}
        style={{ display: "none" }}
        multiple
      />
      <label htmlFor="file-input">       

        <p>{isDragging ? "Rilascia le immagini qui!" : "Trascina le immagini qui"}</p>
      </label>
      </div> 
    </div>
  
            <div>
              {images.length > 0 && (
                <>
                  <h3 className="titleRecup">Anteprima delle immagini:</h3>
                  <div className="image-preview-container">
                    {images.map((image, index) => (
                      <div key={index} className="image-preview-item">
                        <img
                          src={image}
                          alt={`preview-${index}`}
                          className="image-preview-img"
                        />
                        <MdClose
                          onClick={() => handleDeleteImage(index)}
                          className="delete-icon"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Step>

          <Step>
            <h2 className="mainRecup">Riepilogo</h2>
            <div className="form-house">
              <div className="coupleDiv">
                <div className="">
                  <h3 className="titleRecup">Informazioni Personali</h3>
                  <div className="recupPersonal">
                    <p className="recupText">
                      Indirizzo: {address} {houseNumber}
                    </p>
                    <p className="recupText">Città: {city}</p>
                    <p className="recupText">Stato: {state}</p>
                    <p className="recupText">Paese: {country}</p>
                    <p className="recupText">CAP: {zip}</p>
                  </div>
                </div>
                <div>
                  <h3 className="titleRecup">Informazioni sulla Casa</h3>
                  <div className="recupHouse">
                    <p className="recupText">Prezzo: {price}</p>
                    <p className="recupText">Camere da letto: {bedrooms}</p>
                    <p className="recupText">Bagni: {bathrooms}</p>
                    <p className="recupText">Superficie (Sqft): {sqft}</p>
                    <p className="recupText">Descrizione: {description}</p>
                  </div>
                </div>
              </div>
              <h3 className="titleRecup">Immagini Caricate</h3>
              {images.length > 0 ? (
                <div className="image-preview-container">
                  {images.map((image, index) => (
                    <div key={index} className="image-preview-item">
                      <img
                        src={image}
                        alt={`preview-${index}`}
                        className="image-preview-img"
                      />
                      <MdClose
                        onClick={() => handleDeleteImage(index)}
                        className="delete-icon"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="recupText">Nessuna immagine caricata</p>
              )}
            </div>
          </Step>
        </Stepper>
      </div>
    </div>
  );
};

export default CreateHouse;
