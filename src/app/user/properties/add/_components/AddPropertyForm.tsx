"use client";

import React, { useState } from "react";
import Stepper from "./Stepper";
import Basic from "./basic";

import { Prisma, PropertyStatus, PropertyType } from "@prisma/client";
import { cn } from "@nextui-org/react";

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

interface Props {
  types: PropertyType[];
  statuses: PropertyStatus[];
}
const AddPropertyForm = (props: Props) => {
  const [step, setStep] = useState(0);

  return (
    <div>
      <Stepper
        className="m-2"
        items={steps}
        activeItem={step}
        setActiveItem={setStep}
      />
      <form className="mt-3 p-2">
        <Basic
          className={cn({ hidden: step !== 0 })}
          next={() => setStep((prev) => prev + 1)}
          types={props.types}
          statuses={props.statuses}
        />
      </form>
    </div>
  );
};

export default AddPropertyForm;
