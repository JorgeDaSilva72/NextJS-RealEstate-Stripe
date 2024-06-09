import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { Button, Card, Input, Textarea, cn } from "@nextui-org/react";
import React from "react";

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
}
const Location = (props: Props) => {
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
      <Input label="Adresse" />

      <Input label="Numéro de boîte postale" />

      <Input label="Ville" />

      <Input label="Etat" />

      <Input label="Région" className="col-span-2" />

      <Textarea label="Informations complémentaires" className="col-span-2" />
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

export default Location;
