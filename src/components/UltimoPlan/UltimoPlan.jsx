import React, { useState, useEffect, useContext } from "react";
import Stack from "@mui/material/Stack";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import "moment/locale/es";
import { TiendaContext } from "../../context/TiendaContext";
import FormUltimoPlan from "../UltimoPlan/FormUltimoPlan";
import API from "../../configFiles/API/api";

/**
 * Componente principal del modulo de último plan de acción.
 *
 * En este componente se llama al componente del formUltimoPlan y se muestra la información
 *
 * Servicios utilizados:
 * -  Macroproceso: Para obtener la lista de macroprocesos
 * - Pilar/ResumenEvaluacionPilar: Para obtener los planes de acción asociados a la tienda.
 * - Colaborador: Para obtener la lista de los encargados de las tiendas.
 *
 * */
const UltimoPlan = () => {
  const url = API.url;
  const navigate = useNavigate();

  const [loader, setLoader] = useState(true);
  const [preguntasControlador, setPreguntasControlador] = useState(false);
  const { tiendaContext } = useContext(TiendaContext);
  const [datosColaboradores, setDatosColaboradores] = useState({});
  const [pilares, setPilares] = useState([]);

  // para poner en mayusculas solo las primeras letras del nombre
  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  // protegemos la ruta si no hay una tienda
  useEffect(() => {
    if (!tiendaContext.idTienda && !tiendaContext.id) {
      navigate("/proximaruta");
    }
  }, [tiendaContext, navigate]);

  // Protegemos la ruta para cuando este logueado nada mas
  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user === null) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    let mounted = false;
    if (mounted) return;

    let datosColabsAux = {};

    // Hacemos la diferencia entre idTienda y id porq idTienda esta si la tienda pertenece a la ruta sino es solo id
    let idTienda = tiendaContext.idTienda
      ? tiendaContext.idTienda
      : tiendaContext.id;
    let idDt = localStorage.getItem("user_id");


    axios
      .get(`${url}Pilar/UltimoPlanAccion/Tienda/${idTienda}/${idDt}`)
      .then((res) => {

        let pilaresAux = [];
        // aunControlador sirve para saber si tienes planes de accion y mostrar el form o mostrar el mensaje de no hay palnes de accion
        let auxControlador = false;

        let colaboradorEncargado = "";

        res.data.map((pilar) => {
          let dataPilar = pilar.data;
          let dataPreguntasAux = {};
          let arrayAuxPreguntas = [];

          dataPilar.forEach((pregunta) => {
            dataPreguntasAux["nombre"] = pregunta.nombre;
            dataPreguntasAux["id"] = pregunta.idPilar;
            colaboradorEncargado = pregunta.idColaborador;

            let preguntaAux = {
              idPilarEvaluacion: pregunta.idPilarEvaluacion,
              idRutaVisitaDetalle: pregunta.idRutaVisitaDetalle,
              id: pregunta.idPilarDetalleSeguimientoEvaluacion,
              planAccion: pregunta.planAccion,
              fecha: moment(pregunta.fechaCompromiso).format("DD/MM/YYYY"),
              macroproceso: pregunta.nombreMacroproceso,
            };
            arrayAuxPreguntas.push(preguntaAux);
          });
          dataPreguntasAux["preguntas"] = arrayAuxPreguntas;
          if (arrayAuxPreguntas.length > 0) auxControlador = true;

          pilaresAux.push(dataPreguntasAux);
          dataPreguntasAux = {};
          return true;
        });

        setLoader(false);
        setPilares(pilaresAux);
        setPreguntasControlador(auxControlador);

        if (auxControlador) {
          // Consultamos al colaborador para obtener el nombre
          axios.get(`${url}Colaborador/${colaboradorEncargado}`).then((res) => {
            datosColabsAux["encargado"] = toTitleCase(
              res.data.nombre + " " + res.data.apellido
            );
            datosColabsAux["dt"] = toTitleCase(localStorage.getItem("name"));
            setDatosColaboradores(datosColabsAux);
          });
        }
      });

    return () => {
      mounted = true;
    };
  }, [
    tiendaContext.id,
    tiendaContext.idRutaVisitaDetalle,
    tiendaContext.idTienda,
    url,
  ]);

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
            sx={{ mb: 10, pt: 5 }}
          >
            <Grid container>
              <Grid
                item
                xs={6}
                sx={{ textAlign: "left", pt: 1 }}
                className="btn-regresar"
              >
                <Link to="/proximaruta">
                  <ArrowBackIosNewIcon />
                  <span>Regresar</span>
                </Link>
              </Grid>
              <Grid item xs={6} className="titulo-template-indicadores">
                <Typography variant="h4">Plan de Acción</Typography>
              </Grid>
            </Grid>
          </Container>
          {preguntasControlador ? (
            <Container
              maxWidth="lg"
              className="texto-blanco bg-gris padding-box-nav-bar"
            >
              <Grid container sx={{ textAlign: "center" }}>
                <Grid
                  item
                  xs={6}
                  sx={{ mt: 4, py: 4 }}
                  className="border-right-amarillo"
                >
                  <Stack>
                    <Typography variant="h6" className="texto-amarillo">
                      <b>DT:</b>{" "}
                    </Typography>
                    <Typography variant="h6" color="white">
                      {datosColaboradores.dt}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={6} sx={{ mt: 4, py: 4 }}>
                  <Stack>
                    <Typography variant="h6" className="texto-amarillo">
                      <b>Encargado:</b>{" "}
                    </Typography>
                    <Typography variant="h6" color="white">
                      {datosColaboradores.encargado}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
              <Grid container sx={{ mt: 6 }}>
                <Grid item xs={12}>
                  <FormUltimoPlan pilares={pilares} />
                </Grid>
              </Grid>
            </Container>
          ) : (
            <Grid container>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography variant="body1" color="white">
                  No hay planes de acción para evaluar
                </Typography>
              </Grid>
            </Grid>
          )}
        </>
      )}{" "}
    </>
  );
};

export default UltimoPlan;
