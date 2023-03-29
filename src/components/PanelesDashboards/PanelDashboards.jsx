import React, { useState, useEffect, useContext } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/images/Logo-login.svg";
import CajaDashboard from "./CajaDashboard";
import { TiendaContext } from "../../context/TiendaContext";
import API from "../../configFiles/API/api";
/**
 * Componente principal del modulo de panel de dashboards.
 *
 * Este componente renderiza las cajas qque contienen los dashboards y consulta sus url de data studio desde la api.
 *
 *  Servicios utilizados:
 *
 * - /DataStudioUrl/GetUrls: Para obtener la información de todos los dashboards a mostrar en vitrix.
 *
 */
const PanelDashboards = () => {
  const navigate = useNavigate();
  const url = API.url;

  const [alturaBox, setAlturaBox] = useState(0);
  const [loader, setLoader] = useState(true);
  const [listaDashboards, setListaDashboards] = useState([]);

  const { setListaDashboardsContext } = useContext(TiendaContext);

  const resizeWindow = () => {
    if (window.screen.height > 768) {
      setAlturaBox(window.screen.height - 500);
    } else {
      setAlturaBox(window.screen.height - 200);
    }
  };

  // detectamos el resize para calcular la altura de un box
  useEffect(() => {
    window.addEventListener("resize", resizeWindow);

    return () => {
      window.removeEventListener("resize", resizeWindow);
    };
  }, []);

  // Detectamos el cambio de resolucion para mostrar mejor las cajas
  useEffect(() => {
    resizeWindow();

    let user = localStorage.getItem("user");
    if (user === null) {
      navigate("/login");
    } else {
      let posicion = localStorage.getItem("datastudio");
      let userId = localStorage.getItem("user_id");
      let idArea = localStorage.getItem("idArea");

      // Obtenemos todos los dashboards

      axios
        .get(`${url}DataStudioUrl/GetUrls/${posicion}/${userId}/${idArea}`)
        .then((res) => {
          let listaDashboardsAux = res.data.map((prop) => {
            let json = {
              nombre: prop.nombreUrl,
              icono: prop.icono,
              rutaUrl: prop.urlSinParametros,
            };
            return json;
          });
          setListaDashboards(listaDashboardsAux);
          setListaDashboardsContext(listaDashboardsAux);
          setLoader(false);
        });
    }
  }, [navigate, setListaDashboardsContext, url]);

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
          <Container maxWidth="md">
            {/* Logo  */}
            <Box sx={{ py: 4, my: 5 }} className="center-content">
              <SvgIcon component={Logo} className="logotipo" inheritViewBox />
              <Typography
                variant="h5"
                className="texto-amarillo"
                sx={{ mt: 2 }}
              >
                <b>Panel de Dashboards</b>
              </Typography>
            </Box>
          </Container>
          <Box
            sx={{ flexGrow: 1, mt: 0, pt: 1, height: alturaBox }}
            className="body-white padding-box-nav-bar"
          >
            <Container maxWidth="md">
              <Grid container spacing={2} sx={{ py: 2, mt: 4 }}>
                {/* Listamos todos los dashboards */}
                {listaDashboards.map((prop, key) => {
                  return (
                    <Grid item xs={4} key={key}>
                      <CajaDashboard
                        nombre={prop.nombre}
                        icono={prop.icono}
                        rutaUrl={prop.rutaUrl}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Container>
          </Box>
        </>
      )}
    </>
  );
};

export default PanelDashboards;
