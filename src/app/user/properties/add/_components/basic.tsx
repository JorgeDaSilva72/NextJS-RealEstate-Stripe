import {
  Card,
  Input,
  Select,
  SelectItem,
  Textarea,
  cn,
} from "@nextui-org/react";
import { PropertyStatus, PropertyType } from "@prisma/client";
import React from "react";

interface Props {
  className?: string;
  types: PropertyType[];
  statuses: PropertyStatus[];
  next: () => void;
}
const Basic = (props: Props) => {
  return (
    <Card
      className={cn(
        "p-2 gap-3 grid grid-cols-1 md:grid-cols-3",
        props.className
      )}
    >
      <Input label="Nom" className="md:col-span-3" name="name" />
      <Textarea
        label="Description"
        className="md:col-span-3"
        name="description"
      />

      <Select label="Type" selectionMode="single" name="typeId">
        {props.types.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.value}
          </SelectItem>
        ))}
      </Select>
      <Select label="Statut" selectionMode="single" name="statusId">
        {props.statuses.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.value}
          </SelectItem>
        ))}
      </Select>
      <Input label="Prix" name="price" />
    </Card>
  );
};

export default Basic;
