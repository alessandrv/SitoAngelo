import React, { useState, useEffect } from "react";
import Stepper, { Step } from "../components/stepper/Stepper";
import casa1 from "../images/casa1.jpg";
import { FaHome } from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import { GiCash } from "react-icons/gi";
import { MdOutlineVisibility } from "react-icons/md";
import { MdClose } from "react-icons/md";
import "./createHouses.css";

const CreateHouse = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [price, setPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [sqft, setSqft] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("houseForm"));
    if (savedData) {
      setName(savedData.name || "");
      setLastName(savedData.lastName || "");
      setEmail(savedData.email || "");
      setCity(savedData.city || "");
      setState(savedData.state || "");
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
      name,
      lastName,
      email,
      city,
      state,
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
    const files = Array.from(e.target.files);
    const imageURLs = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageURLs]);
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="stepper-container">
        <Stepper
          initialStep={1}
          onStepChange={(step) => saveToLocalStorage()}
          onFinalStepCompleted={() => saveToLocalStorage()}
          backButtonText="Previous"
          nextButtonText="Next"
        >
          <Step>
            <h2 className="mainRecup">Informazioni Personali</h2>
            <form className="form">
              <input
                type="text"
                placeholder="First Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="formHouse"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="formHouse"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="formHouse"
              />
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="formHouse"
              />
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="formHouse"
              />
              <input
                type="text"
                placeholder="Zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="formHouse"
              />
            </form>
          </Step>

          <Step>
            <h2 className="mainRecup">Informazioni sulla casa</h2>
            <form className="form">
              <input
                type="text"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="formHouse"
              />
              <input
                type="text"
                placeholder="Bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="formHouse"
              />
              <input
                type="text"
                placeholder="Bathrooms"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="formHouse"
              />
              <input
                type="text"
                placeholder="Sqft"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                className="formHouse"
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="formHouse"
              />

              <input
                type="file"
                accept="image/*"
                id="file-input"
                onChange={handleImageChange}
                multiple
                style={{ display: "none" }}
              />
              <label htmlFor="file-input" className="custom-file-button">
                Scegli le immagini
              </label>

              <div>
                {images.length > 0 && (
                  <>
                    <h3>Anteprima delle immagini:</h3>
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
            </form>
          </Step>

          <Step>
            <h2 className="mainRecup">Recap</h2>
            <p className="recupText2">Ecco cosa hai inserito:</p>
            <div className="form">
              <h3 className="titleRecup">Informazioni Personali</h3>
                <div className="recupPersonal">
                <p className="recupText">
                Nome: {name} {lastName}
              </p>
              <p className="recupText">Email: {email}</p>
              <p className="recupText">Città: {city}</p>
              <p className="recupText">Stato: {state}</p>
              <p className="recupText">CAP: {zip}</p>
                </div>
                <h3 className="titleRecup">Informazioni sulla Casa</h3>
              <div className="recupHouse">
              <p className="recupText">Prezzo: {price}</p>
              <p className="recupText">Camere da letto: {bedrooms}</p>
              <p className="recupText">Bagni: {bathrooms}</p>
              <p className="recupText">Superficie (Sqft): {sqft}</p>
              <p className="recupText">Descrizione: {description}</p>
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
