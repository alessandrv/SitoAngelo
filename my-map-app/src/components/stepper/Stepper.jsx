import React, { useState, useEffect } from "react";
import "./steppers.css";

// Componente per il passo (Step)
export function Step({ children }) {
  return <div className="step">{children}</div>;
}

// Componente Stepper
export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  backButtonText = "Back",
  nextButtonText = "Next",
  finishButtonText = "Finish",
  onClose = () => {} // Callback per gestire la chiusura
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const stepsArray = React.Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isLastStep = currentStep === totalSteps;

  useEffect(() => {
    // Funzione per rimuovere i dati dal localStorage quando il Stepper è chiuso
    return () => {
      // Questa funzione viene chiamata quando il componente viene smontato (chiuso)
      localStorage.removeItem("houseForm");
      console.log("localStorage rimosso");
    };
  }, []);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange(newStep); // Callback per il cambiamento dello step
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange(newStep); // Callback per il cambiamento dello step
    }
  };

  const handleFinish = () => {
    console.log("Stepper Completed!");
  };

  return (
    <div>
      {/* Overlay per lo sfondo semi-trasparente */}
      <div className="stepper-overlay"></div>

      <div className="stepper">
        {/* Pulsante di chiusura (X) */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        {/* Mostra il contenuto del passo corrente */}
        <div className="step-content">
          {stepsArray[currentStep - 1]}
        </div>

        {/* Navigazione */}
        <div className="stepper-footer">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="back-button"
          >
            {backButtonText}
          </button>
          {isLastStep ? (
            <button onClick={handleFinish} className="finish-button">
              {finishButtonText}
            </button>
          ) : (
            <button onClick={handleNext} className="next-button">
              {nextButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
