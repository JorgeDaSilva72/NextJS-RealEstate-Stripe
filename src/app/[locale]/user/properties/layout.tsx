// import HeaderPropertiesWrapper from "@/app/components/HeaderPropertiesWrapper";
import React, { ReactNode } from "react";
// import HeaderPropertiesWrapper from "../../components/HeaderPropertiesWrapper";

interface Props {
  children: ReactNode;
  modalDelete: ReactNode;
}
const PropertiesLayout = ({ children, modalDelete }: Props) => {
  return (
    <div>
      {/* <HeaderPropertiesWrapper /> */}
      {children}
      <div>{modalDelete}</div>
    </div>
  );
};

export default PropertiesLayout;
