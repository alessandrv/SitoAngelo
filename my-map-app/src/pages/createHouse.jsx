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

  const [showSteps, setShowSteps] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageURLs = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imageURLs]);
  };

  const handleShowSteps = () => {
    setShowSteps(true);
  };

  const handleCloseSteps = () => {
    setShowSteps(false);
    localStorage.removeItem("houseForm");
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

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

  return (
    <div>
      <div className="container-casa">
        <img src={casa1} className="img" />
        <div className="textCasa">
          <h1>Metti la Tua Casa in Affitto con Noi</h1>
          <p>
            Hai una casa o un appartamento da mettere in affitto? Affittare la
            tua proprietà non è mai stato così semplice! Segui i passaggi qui
            sotto per iniziare subito.
          </p>
          <p>
            Siamo qui per supportarti in ogni fase del processo, per garantire
            che tu trovi in fretta il locatario giusto.
          </p>
          <button onClick={handleShowSteps} className="show-steps-button">
            Pubblica ora la tua casa!
          </button>
        </div>
      </div>

      <div className="how-it-works">
        <h2 className="title-how-it">Come Funziona?</h2>
        <img src={casa1} className="img" />
        <ul className="steps">
          <div className="container-icon">
            <FaHome className="icon-width" />
            <li>
              Inserisci i dettagli della proprietà: Compila il modulo con le
              informazioni sulla tua casa.
            </li>
          </div>
          <div className="container-icon">
            <MdAddPhotoAlternate className="icon-width" />
            <li>
              Aggiungi foto e descrizione: Le foto parlano da sole! Carica
              immagini chiare della proprietà.
            </li>
          </div>
          <div className="container-icon">
            <GiCash className="icon-width" />
            <li>
              Fissiamo il prezzo giusto: Ti guideremo nella determinazione del
              prezzo giusto per il tuo immobile.
            </li>
          </div>
          <div className="container-icon">
            <MdOutlineVisibility className="icon-width" />
            <li>
              Pubblica l'annuncio: Una volta completato, il tuo annuncio sarà
              visibile a migliaia di potenziali inquilini.
            </li>
          </div>
        </ul>
      </div>

      {showSteps && (
        <div className="stepper-container">
          <Stepper
            initialStep={1}
            onStepChange={(step) => saveToLocalStorage()}
            onFinalStepCompleted={() => saveToLocalStorage()}
            backButtonText="Previous"
            nextButtonText="Next"
            onClose={handleCloseSteps}
          >
            <Step>
              <h2>Informazioni Personali</h2>
              <form>
                <input
                  type="text"
                  placeholder="First Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Zip"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                />
              </form>
              <p>Ora passiamo ai dati della casa!</p>
            </Step>

            <Step>
              <h2>Informazioni sulla casa</h2>
              <form>
                <input
                  type="text"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Bedrooms"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Bathrooms"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Sqft"
                  value={sqft}
                  onChange={(e) => setSqft(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
              <h2>Recap</h2>
              <p>Ecco cosa hai inserito:</p>
              <div>
                <h3>Informazioni Personali</h3>
                <p>
                  Nome: {name} {lastName}
                </p>
                <p>Email: {email}</p>
                <p>Città: {city}</p>
                <p>Stato: {state}</p>
                <p>CAP: {zip}</p>
                <h3>Informazioni sulla Casa</h3>
                <p>Prezzo: {price}</p>
                <p>Camere da letto: {bedrooms}</p>
                <p>Bagni: {bathrooms}</p>
                <p>Superficie (Sqft): {sqft}</p>
                <p>Descrizione: {description}</p>
                <h3>Immagini Caricate</h3>
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
                  <p>Nessuna immagine caricata</p>
                )}
              </div>
            </Step>
          </Stepper>
        </div>
      )}
    </div>
  );
};

export default CreateHouse;
