import React, { ReactNode } from "react";
import Options, { TypeOptions } from "./_components/Options";
// import PageTitle from "@/app/components/pageTitle";
import AppointmentContainer from "./_components/AppointmentContainer";
import PageTitle from "@/app/[locale]/components/pageTitle";

interface Layout {
  children: ReactNode;
  params: { id: string };
}

const layout = ({ children, params }: Layout) => {
  const options: TypeOptions = [
    {
      title: "Rendez-vous acceptée",
      url: "/user/properties/" + params.id + "/appointment/accept",
    },
    {
      title: "Nouveau Rendez-vous",
      url: "/user/properties/" + params.id + "/appointment",
    },
  ];
  return (
    <>
      <PageTitle
        title="Mes Rendez-vous"
        linkCaption="Mes annonces"
        href="/user/properties/"
      />
      <Options options={options} />
      <AppointmentContainer id={+params.id} />
      {children}
    </>
  );
};

export default layout;
