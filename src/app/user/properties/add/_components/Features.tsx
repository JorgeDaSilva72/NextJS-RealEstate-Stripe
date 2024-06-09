import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { Button, Card, Checkbox, Input, cn } from "@nextui-org/react";
import React from "react";

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
}
const Features = (props: Props) => {
  const handleNext = () => {
    props.next();
  };
  return (
    <Card
      className={cn(
        "p-2  grid grid-cols-1 md:grid-cols-2 gap-3",
        props.className
      )}
    >
      <Input label="Chambre(s)" />

      <Input label="Salle(s) de bain" />
      <Input label="Place(s) de stationnement" />

      <Input label="Superficie en m²" />
      <div className="flex flex-col  md:flex-row  items-center justify-around ">
        <Checkbox>Possède une piscine</Checkbox>

        <Checkbox>Possède un jardin/une cour</Checkbox>

        <Checkbox>Possède un balcon/terrasse</Checkbox>
      </div>
      <div className="flex justify-center col-span-2 gap-3">
        <Button
          onClick={props.prev}
          startContent={<ChevronLeftIcon className="w-6" />}
          color="primary"
          className="w-36"
        >
          Précédent
        </Button>
        <Button
          onClick={handleNext}
          endContent={<ChevronRightIcon className="w-6" />}
          color="primary"
          className="w-36"
        >
          Suivant
        </Button>
      </div>
    </Card>
  );
};

export default Features;
