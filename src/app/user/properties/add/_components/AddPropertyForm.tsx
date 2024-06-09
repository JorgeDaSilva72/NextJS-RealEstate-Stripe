"use client";

import React, { useState } from "react";
import Stepper from "./Stepper";

const steps = [
  {
    label: "Basique",
  },
  {
    label: "Emplacement",
  },
  {
    label: "Caractéristiques",
  },
  {
    label: "Photos",
  },
  {
    label: "Contact",
  },
];
const AddPropertyForm = () => {
  const [step, setStep] = useState(0);

  return (
    <div>
      <Stepper
        className="m-2"
        items={steps}
        activeItem={step}
        setActiveItem={setStep}
      />
    </div>
  );
};

export default AddPropertyForm;
