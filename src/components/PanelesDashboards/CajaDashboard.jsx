import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * Componente que renderiza el elemento de caja en la vista de panel de Dashboards
 *
 * Este componente muestra la caja que encierra cada uno de los dashboards disponibles
 */
const CajaDashboard = (props) => {
  const navigate = useNavigate();

  let nombre = props.nombre;
  let icono = props.icono;
  let rutaUrl = props.rutaUrl;

  return (
    <Box
      className="cajaPanel"
      onClick={() => {
        navigate(`/dashboard`);
        localStorage.setItem("urlDashboard", rutaUrl);
      }}
      sx={{pt:4}}
    >
      <Stack spacing={3}>
        <img src={icono} alt="Icono Dashboard" className="icono-dashboard" />
        <Typography variant="h7">
          <b>{nombre}</b>
        </Typography>
      </Stack>
    </Box>
  );
};

CajaDashboard.propTypes = {
  /** Nombre del dashboard */
  nombre: PropTypes.string.isRequired,
  /** Componente con el icono en SVG */
  icono: PropTypes.any.isRequired,
  /** Ruta del dataStudio seleccionado  */
  rutaUrl: PropTypes.string.isRequired,
};

export default CajaDashboard;
