import React from "react";
import Box from "@mui/material/Box";

/**
 * Componente utilizado para mostrar el error 404 en caso de ir a una ruta incorrecta.
 */
const NotFound = () => {
  return (
    <Box sx={{height:'100vh'}}>
      <p className="texto-blanco">ERROR 404</p>
    </Box>
  );
};

export default NotFound;
