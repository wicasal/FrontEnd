import React, { useState, useEffect, useContext } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { ReactComponent as Logo } from "../../assets/images/Logo-login.svg";
import CustomPaginationActionsTable from "./CustomPaginationActionsTable";
import { TiendaContext } from "../../context/TiendaContext";
import API from "../../configFiles/API/api";
import FormHistorial from "./FormHistorial";

/**
 * Componente principal de vista de Historial de visitas.
 * Se muestra una tabla listando las visitas de la tienda y permitiendo mostrar la vista de resumen
 */
const Historial = () => {
  const url = API.url;

  const navigate = useNavigate();

  const { tiendaContext } = useContext(TiendaContext);

  const [mostrarTabla, setMostrarTabla] = useState(-1);
  const [listaVisitas, setListaVisitas] = useState([]);

  // Protegemos la ruta para cuando este logueado nada mas
  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user === null) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    let mounted = false;
    if (mounted) return;

    // protegemos la ruta si no hay una tienda seleccionada
    if (!tiendaContext.idTienda && !tiendaContext.id) {
      navigate("/proximaruta");
    }

    return () => {
      mounted = true;
    };
  }, [navigate, tiendaContext]);

  // Formatea la data para mostrarla en la tabla con el boton
  const createData = (tipo, fecha, hora, resultado, idRutaVisitaDetalle) => {
    let verde_puntaje = "#95c11f";
    let rojo_puntaje = "#fc225b";
    let naranja_puntaje = "#f9b233";
    let azul_puntaje = "#008fb1";

    let color = "";
    if (resultado >= 1 && resultado < 1.9) {
      color = rojo_puntaje;
    } else if (resultado >= 2 && resultado < 2.9) {
      color = naranja_puntaje;
    } else if (resultado >= 3 && resultado < 3.9) {
      color = verde_puntaje;
    } else {
      color = azul_puntaje;
    }

    const buttom = (
      <a
        rel="noopener noreferrer"
        href={`${url}Pilar/ResumenVisita/${idRutaVisitaDetalle}`}
        target="_blank"
      >
        {" "}
        <Button>Ver</Button>
      </a>
    );
    return { tipo, fecha, hora, resultado, color, buttom };
  };

  const handleMostrarTabla = (visitas) => {
    if (visitas.length > 0) {
      let visitasAux = [];
      visitas.forEach((visita) => {
        visitasAux.push(
          createData(
            visita.tipo,
            visita.fecha,
            visita.hora,
            visita.resultado,
            visita.idRutaVisitaDetalle
          )
        );
      });
      setMostrarTabla(1);
      setListaVisitas(visitasAux);
    } else {
      setMostrarTabla(0);
    }
  };

  return (
    <>
      <Container maxWidth="lg" className="texto-blanco padding-box-nav-bar">
        {/* Boton regresar */}
        <Grid
          item
          xs={12}
          sx={{ textAlign: "left", mt: 6, mb: 3 }}
          className="btn-regresar"
        >
          <Link to="/proximaruta">
            <ArrowBackIosNewIcon />
            <span>Regresar</span>
          </Link>
        </Grid>
        <Grid container className="">
          <Grid item xs={12}>
            {/* Logo  */}
            <Box sx={{ pt: 0 }} xs="12" className="center-content">
              <SvgIcon component={Logo} className="logotipo" inheritViewBox />
              <Typography
                variant="h5"
                className="texto-amarillo"
                sx={{ mt: 5 }}
              >
                <b>Historial de Visita</b>
              </Typography>
              <Typography
                variant="h6"
                className="texto-amarillo"
                sx={{ mt: 2 }}
              >
                <b>Tienda {tiendaContext.nombreTienda}</b>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ my: 10, textAlign: "center" }}>
            <FormHistorial
              idTienda={tiendaContext.idTienda ?? tiendaContext.id}
              handleMostrarTabla={handleMostrarTabla}
              setMostrarTabla={setMostrarTabla}
            />
          </Grid>
          {mostrarTabla === 1 && (
            <Grid item xs={12} sx={{ mt: 0 }}>
              <CustomPaginationActionsTable listaVisitas={listaVisitas} />
            </Grid>
          )}
          {mostrarTabla === 0 && (
            <Grid item xs={12} sx={{ mt: 0, textAlign: "center" }}>
              <p>
                No hay visitas registradas para la tienda en la fecha
                establecida
              </p>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Historial;
