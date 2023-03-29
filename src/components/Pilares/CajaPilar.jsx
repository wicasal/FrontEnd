import React, { useState, useEffect, useContext } from "react";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { TiendaContext } from "../../context/TiendaContext";
import { ReactComponent as Circle } from "../../assets/images/iconos-pilares/circle.svg";
import Typography from "@mui/material/Typography";

/**
 *
 * Componente que renderiza la caja donde se muestra el pilar con su imagen en el módulo de pilares
 */

const CajaPilar = (props) => {
  let dataPilar = props.dataPilar;
  let direccionBorderRadius = props.borderRadius;
  let completado = props.completado ? "completado" : "";
  let puntaje = props.puntaje;
  let visitaFinalizada = props.visitaFinalizada;

  const { setPilarContext } = useContext(TiendaContext);

  const [colorPuntaje, setColorPuntaje] = useState("");

  // Segun el puntaje recibido se muestra define un estilo
  useEffect(() => {

    if (puntaje >= 1 && puntaje < 1.9) {
      setColorPuntaje("rojo");
    } else if (puntaje >= 2 && puntaje < 2.9) {
      setColorPuntaje("naranja");
    } else if (puntaje >= 3 && puntaje < 3.9) {
      setColorPuntaje("verde");
    } else {
      setColorPuntaje("azul");
    }
  }, [puntaje, dataPilar]);

  const navigate = useNavigate();

  return (
    <>
      <Grid
        item
        xs={12}
        sm={6}
        onClick={() => {
          if (!props.completado && !visitaFinalizada) {
            navigate(`/pilar/${dataPilar.nombre}`);
            setPilarContext(dataPilar);
          }
        }}
      >
        <Stack
          className="d-flex direction-row"
          sx={{ justifyContent: "start", alignContent: "center", mb: 2 }}
        >
          <img
            alt={"icono " + dataPilar.nombre}
            src={dataPilar.urlIcono}
            width="25"
            height="25"
          />
          <Typography
            variant="h6"
            className="d-inline title-contenedor"
            sx={{ marginLeft: 2 }}
          >
            <b>{dataPilar.nombre}</b>
          </Typography>
        </Stack>
        <Stack
          className={`contenedor-view ${direccionBorderRadius} ${completado}`}
          sx={{
            backgroundImage: `linear-gradient(black, black),
          url(${dataPilar.urlImagen})`,
          }}
        >
          <Button
            className="btn-primary order-0 puntaje "
            onClick={() => {
              navigate(`/resumen/${dataPilar.nombre}`);
            }}
          >
            <Stack direction="row" sx={{ justifyContent: "center" }}>
              <RemoveRedEyeIcon sx={{ mr: 2 }} />
              Ver Resumen
            </Stack>
          </Button>
          <Stack className="position-relative order-1 puntaje">
            <Stack className={"align-center puntaje-pilar"}>
              <Box className={colorPuntaje}>
                <Circle />
                {/* Validamos si es entero o decimal para mostrarlo con el decimal truncado */}
                <span className="">
                  {puntaje % 1 === 0 ? puntaje : puntaje.toFixed(1)}
                </span>
              </Box>
            </Stack>
            <p className="points">Puntaje</p>
          </Stack>
        </Stack>
      </Grid>
    </>
  );
};

CajaPilar.propTypes = {
  /** Informacion del pilar */
  dataPilar: PropTypes.object.isRequired,
  /** controla la direccion en la que se muestra el border radius de la caja */
  direccionBorderRadius: PropTypes.string,
  /** dice si el pilar esta completado o no */
  completado: PropTypes.bool.isRequired,
  /** puntaje del pilar */
  puntaje: PropTypes.number.isRequired,
  /** Estado de la visita de la tienda */
  visitaFinalizada: PropTypes.bool.isRequired,
};

export default CajaPilar;
