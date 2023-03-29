import React from "react";
import { useParams } from "react-router-dom";
/**
    Compronente auxiliar que permite redirigir a sitios externos 
 */

const ExternalRedirect = () => {
  const params = useParams();

  let links = {
    apo: "https://texmoda.com.co:8402/",
    drive: "https://drive.google.com/drive/u/0/priority",
  };
  window.location.replace(links[params.page]);

  return <h3 className="texto-blanco">Redireccionando...</h3>;
};

export default ExternalRedirect;
