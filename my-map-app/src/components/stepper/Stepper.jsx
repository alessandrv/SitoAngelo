import React, { useState, useEffect } from "react";
import "./steppers.css";

export function Step({ children }) {
  return <div className="step">{children}</div>;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  backButtonText = "Previous",
  nextButtonText = "Next",
  finishButtonText = "Finish",
  onClose = () => {},
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const stepsArray = React.Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isLastStep = currentStep === totalSteps;

  useEffect(() => {
    return () => {
      localStorage.removeItem("houseForm");
      console.log("localStorage rimosso");
    };
  }, []);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange(newStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange(newStep);
    }
  };

  const handleFinish = () => {
    setIsFormSubmitted(true);
    console.log("Stepper Completed!");

    setTimeout(() => {
        setIsFormSubmitted(false);
      }, 3000);
  };

  return (
    <div className="stepper-container">
      <div className="stepper-overlay"></div>

      <div className="stepper">
        <div className="step-content">{stepsArray[currentStep - 1]}</div>

        <div className="stepper-footer">
          <div className="stepper-nav">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="back-button"
            >
              {backButtonText}
            </button>
            <div className="step-indicators">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`step-indicator ${
                    currentStep === index + 1 ? "active" : ""
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            {isLastStep ? (
              isFormSubmitted ? (
                <div className="success-message">
                  <h2>Form inviato con successo!</h2>
                </div>
              ) : (
                <button onClick={handleFinish} className="finish-button">
                  {finishButtonText}
                </button>
              )
            ) : (
              <button onClick={handleNext} className="next-button">
                {nextButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
      <div class="line line1"></div>
<div class="line line2"></div>
<div class="line line3"></div>

    </div>
  );
}
