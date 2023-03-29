import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate, Link } from "react-router-dom";
import { TiendaContext } from "../../context/TiendaContext";
import FormPreguntasTemplate from "./FormPreguntasTemplate";
import Leyenda from "../varios/Leyenda";
import Iframe from "../varios/Iframe";
import API from "../../configFiles/API/api";

/**
 * Componente principal de la pantalla de evaluacion de pilar que carga el Iframe del pilar, desde el componente Iframe, como el formulario desde el componente FormPreguntasTemplate.
 *
 * Servicios utilizados:
 *
 * - /DataStudioUrl: Para obtener el link del dataStudio del pilar.
 */

const PilarTemplate = () => {
  const url = API.url;
  const params = useParams();
  const navigate = useNavigate();
  const { tiendaContext, pilarContext } = useContext(TiendaContext);

  const [tituloPagina, setTituloPagina] = useState("");
  const [dataStudioUrlPreview, setDataStudioUrlPreview] = useState("");
  const [dataStudioUrlExtended, setDataStudioUrlExtended] = useState("");
  const [mostrarDashboard, setMostrarDashboard] = useState(true);
  const [loader, setLoader] = useState(true);

  // protegemos la ruta si no hay una tienda
  useEffect(() => {
    if (!tiendaContext.idTienda) {
      navigate("/");
    }
  }, [tiendaContext, navigate]);

  // Protegemos la ruta para cuando este logueado nada mas
  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user === null) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    // Estos datos los obtenemos del nombre de la tienda al seleccionarla en proximaRuta
    let codTienda = tiendaContext.codigoTienda;

    setTituloPagina(params.pilar);


    // Construimos la ruta para importar los archivos del data studio correspondiente al pilar
    let posicion = localStorage.getItem("datastudio");
    axios
      .get(
        `${url}DataStudioUrl/tipo/${pilarContext.id}?tiendaId=${codTienda}&perfilId=${posicion}`
      )
      .then((res) => {
        setLoader(false);
        setDataStudioUrlPreview(res.data.urlResumida);
        setDataStudioUrlExtended(res.data.urlExtendida);
      })
      .catch((err) => {
        setLoader(false);
        setMostrarDashboard(false);
      });
  }, [params.pilar, navigate, tiendaContext, url, pilarContext]);

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
            sx={{ mb: 20, pt: 5 }}
          >
            <Grid container>
              <Grid
                item
                xs={6}
                sx={{ textAlign: "left", pt: 1 }}
                className="btn-regresar"
              >
                <Link to="/pilares">
                  <ArrowBackIosNewIcon />
                  <span>Regresar</span>
                </Link>
              </Grid>
              <Grid item xs={6} className="titulo-template-indicadores">
                <Typography variant="h4">{tituloPagina}</Typography>
              </Grid>
            </Grid>
          </Container>
          <Container
            maxWidth="lg"
            className="texto-blanco bg-gris padding-box-nav-bar"
          >
            <Grid container>
              {mostrarDashboard && (
                <Grid item xs={12}>
                  <Iframe
                    pagina="pilar"
                    dataStudioUrlPreview={dataStudioUrlPreview}
                    dataStudioUrlExtended={dataStudioUrlExtended}
                  />
                </Grid>
              )}
              <Grid item xs={12} sx={{ mt: 5 }}>
                <Leyenda />
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  <Box>
                    <FormPreguntasTemplate pilar={params.pilar} />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </>
  );
};

export default PilarTemplate;
