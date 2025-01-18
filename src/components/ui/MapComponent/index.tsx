import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 34.0522, // Exemple : Latitude
  lng: -118.2437, // Exemple : Longitude
};

const MapComponent = () => {
  return (
    <LoadScript googleMapsApiKey="VOTRE_CLE_API">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
