import React from "react";

const useGetFormatDate = () => {
  return (inputDate:Date) => {
    const dateObject = new Date(inputDate);

    // Extraire les composants de la date
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");

    // Construire une chaîne ISO sans appliquer de décalage
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    return formattedDate;
  };
};

export default useGetFormatDate;
