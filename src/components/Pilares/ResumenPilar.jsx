import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import moment from "moment";
import "moment/locale/es";
import axios from "axios";
import { TiendaContext } from "../../context/TiendaContext";
import API from "../../configFiles/API/api";
import { ReactComponent as Circle } from "../../assets/images/iconos-pilares/circle.svg";

/**
 * Componente principal de la pantalla de Resumen de Pilar.
 *
 * Aqui se muestras las respuestas generadar en la visita para el pilar correspondiente
 *
 * Servicios utilizados:
 *
 * - /Macroproceso: Para obtener la lista de macroprocesos responsables.
 * - /Pilar/ResumenEvaluacionPilar: Para obtener las respuestas del pilar en la visita
 * - /Colaborador : Para obtener la data del colaborador encargado
 */

const ResumenPilar = () => {
  const url = API.url;

  const params = useParams();
  const navigate = useNavigate();
  const { tiendaContext, responsableVisitaContext } = useContext(TiendaContext);

  const [tituloPagina, setTituloPagina] = useState("");
  const [resumen, setResumen] = useState({});
  const [colorPuntaje, setColorPuntaje] = useState("");
  const [loader, setLoader] = useState(true);

  // para poner en mayusculas solo las primeras letras del nombre
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  useEffect(() => {
    let resumenAux = {};
    let pilarNombre = "";
    let mounted = false;
    if (mounted) return;
    setTituloPagina(params.pilar);
    pilarNombre = params.pilar;

    let macroprocesosList = [];
    axios.get(`${url}Macroproceso`).then((res) => {
      macroprocesosList = res.data;
      console.log(
        "🚀 ~ file: ResumenPilar.jsx:66 ~ axios.get ~ macroprocesosList",
        macroprocesosList
      );

      axios
        .get(
          `${url}Pilar/ResumenEvaluacionPilar/${tiendaContext.idRutaVisitaDetalle}`
        )
        .then((res) => {
          // Seteamos la data en la vista
          resumenAux["fecha"] = moment(res.data.fechaVisita).format(
            "DD/MM/YYYY"
          );
          resumenAux["logo"] = res.data.fotoMarca[res.data.marca];
          resumenAux["dt"] = toTitleCase(localStorage.getItem("name"));

          let puntajeAcumulado = 0;
          let observaciones = [];
          let planes = [];
          let macroprocesos = [];

          res.data.pilarEvaluacions.forEach((pilar) => {
            if (pilar.idPilarNavigation.nombre === pilarNombre) {
              puntajeAcumulado += pilar.calificacionPromedio;
              pilar.pilarDetalleEvaluacions.forEach((pregunta) => {
                if (pregunta.observacion)
                  observaciones.push(pregunta.observacion);
                if (pregunta.planAccion) planes.push(pregunta.planAccion);
                if (pregunta.macroprocesoResponsable) {
                  for (const key in macroprocesosList) {
                    if (macroprocesosList.hasOwnProperty(key)) {
                      let macroAux = macroprocesosList[key].find(
                        (o) => o.id === pregunta.macroprocesoResponsable
                      );
                      if (macroAux !== undefined)
                        macroprocesos.push(macroAux.macroProceso);
                    }
                  }
                }
              });
            }
          });

          puntajeAcumulado = puntajeAcumulado.toFixed(1);

          if (puntajeAcumulado >= 1 && puntajeAcumulado < 1.9) {
            setColorPuntaje("rojo");
          } else if (puntajeAcumulado >= 2 && puntajeAcumulado < 2.9) {
            setColorPuntaje("naranja");
          } else if (puntajeAcumulado >= 3 && puntajeAcumulado < 3.9) {
            setColorPuntaje("verde");
          } else {
            setColorPuntaje("azul");
          }

          resumenAux["puntaje"] = puntajeAcumulado;
          resumenAux["observaciones"] = observaciones;
          resumenAux["planes"] = planes;
          resumenAux["macroprocesos"] = macroprocesos;

          axios
            .get(`${url}Colaborador/${responsableVisitaContext.id}`)
            .then((res) => {
              resumenAux["encargado"] = toTitleCase(
                res.data.nombre + " " + res.data.apellido
              );
              setResumen(resumenAux);
              setLoader(false);
            });
        });
    });

    return () => {
      mounted = true;
    };
  }, [
    navigate,
    params.pilar,
    responsableVisitaContext,
    tiendaContext,
    tiendaContext.idRutaVisitaDetalle,
    url,
  ]);

  // Elementos para controlar el acordion
  const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 },
  };

  const items = [
    <Box className="itemCarrousel" data-value="1">
      1
    </Box>,
    <Box className="itemCarrousel" data-value="2">
      2
    </Box>,
    <Box className="itemCarrousel" data-value="3">
      3
    </Box>,
    <Box className="itemCarrousel" data-value="4">
      4
    </Box>,
    <Box className="itemCarrousel" data-value="5">
      5
    </Box>,
  ];

  return (
    <>
      {loader ? (
        <Grid container className="loader">
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Grid>
        </Grid>
      ) : (
        <>
          <Container
            maxWidth="lg"
            className="texto-blanco"
            sx={{ mb: 5, pt: 5 }}
          >
            <Grid container>
              <Grid
                item
                xs={12}
                sx={{ textAlign: "left", pt: 1, mb: 3 }}
                className="btn-regresar"
              >
                <Link to="/pilares">
                  <ArrowBackIosNewIcon />
                  <span>Regresar</span>
                </Link>
              </Grid>
              <Grid item xs={6}>
                <img
                  src={resumen.logo}
                  alt="Logo marca"
                  className="img-marca-resumen"
                />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ pt: 7 }}
                className="titulo-template-indicadores"
              >
                <Typography variant="h4">Feedback Visita</Typography>
                <Typography variant="h6">Pilar: {tituloPagina}</Typography>
              </Grid>
            </Grid>
          </Container>
          <Container maxWidth="lg" className="texto-blanco padding-box-nav-bar">
            <Grid container className="bg-blanco fold-corner-card ">
              <Grid item xs={6}>
                <p>
                  <b>Encargado:</b> {resumen.encargado}
                </p>
                <p>
                  <b>DT:</b> {resumen.dt}
                </p>
                <p>
                  <b>Tienda:</b> {tiendaContext.nombreTienda}
                </p>
              </Grid>
              <Grid item xs={6} textAlign="right">
                <p>
                  <b>Fecha:</b> {resumen.fecha}
                </p>
                <Grid container>
                  <Grid item xs={8}></Grid>
                  <Grid
                    item
                    xs={2}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <b>Calificación:</b>
                    <span className="numero-puntaje-resumen-pilar">
                      {resumen.puntaje}
                    </span>
                  </Grid>
                  <Grid item xs={2}>
                    <Box className={"puntaje-resumen-pilar"}>
                      <Box className={colorPuntaje}>
                        <Circle />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                className="border-top-gris"
                sx={{ py: 4, display: "none" }}
              >
                <AliceCarousel
                  mouseTracking
                  items={items}
                  responsive={responsive}
                  disableButtonsControls
                  infinite
                />
              </Grid>

              {/* OBservaciones */}
              <Grid item xs={12} sx={{ my: 2 }}>
                <Accordion defaultExpanded={false}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography variant="h7">
                      <b>Observaciones:</b>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    {resumen.observaciones.length > 0 ? (
                      <ul>
                        {resumen.observaciones.map((observacion, index) => {
                          return (
                            <li key={"observaacion" + index}>{observacion}</li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p>No hay Observaciones</p>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Plan de accion */}
              <Grid item xs={12} sx={{ my: 2 }}>
                <Accordion defaultExpanded={false}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography variant="h7">
                      <b>Plan de Acción:</b>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    {resumen.planes.length > 0 ? (
                      <ul>
                        {resumen.planes.map((plan, index) => {
                          return <li key={"plan" + index}>{plan}</li>;
                        })}
                      </ul>
                    ) : (
                      <p>No hay Planes de Acción</p>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Grid>

              {/* Macroproceso */}
              <Grid item xs={12} sx={{ my: 2 }}>
                <Accordion defaultExpanded={false}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography variant="h7">
                      <b>Macroproceso Involucrado:</b>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    {resumen.macroprocesos.length > 0 ? (
                      <ul>
                        {resumen.macroprocesos.map((proceso, index) => {
                          return (
                            <li key={"macroproceso" + index}>{proceso}</li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p>No hay Macroprocesos Involucrados</p>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button className="btn-descargar-pdf" sx={{ display: "none" }}>
                  Descargar PDF
                </Button>
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </>
  );
};

export default ResumenPilar;
