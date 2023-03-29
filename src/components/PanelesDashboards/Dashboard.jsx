import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import FormDashboard from "./FormDashboard";

/**
 * Componente de dashboards del panel de dashboards.
 *
 * Este componente muestra el iframe del dashboard seleccionado en el panel de dashboards.
 *
 */
const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState("hidden");
  const [displayIframe, setDisplayIframe] = useState("none");
  const [dataStudio, setDataStudio] = useState("");
  const navigate = useNavigate();

  // Protegemos la ruta para cuando este logueado nada mas, en caso contrario es enviado a /login
  // Cargamos el dataStudio del home de la ruta especificada e instanciamos los parametros necesarios
  useEffect(() => {
    let mounted = false;
    if (mounted) return;

    setDataStudio(localStorage.getItem("urlDashboard"));

    let body = document.getElementsByTagName("body")[0];
    body.style.overflow = "hidden";

    return () => {
      mounted = true;
      body.style.overflow = "inherit";
    };
  }, [navigate]);

  // Seteamos el tiempo de espera para cargar el iframe
  const tiempoIframe = () => {
    let mounted = false;
    if (mounted) return;
    setTimeout(() => {
      setDisplayIframe("inherit");
      setLoading(true);
      setVisible("visible");
    }, 4000);
    return () => (mounted = true);
  };

  const changeDataStudioUrl = (url) => {
    setDataStudio(url);
  };

  return (
    <Grid container className="padding-box-nav-bar">
      {/* Dropdown de dashboards */}
      <Grid container className="fondo-gris" sx={{ justifyContent: "end" }}>
        <Grid
          item
          xs={3}
          sx={{ textAlign: "left", my: 3 }}
          className="barra-top-dashboards"
        >
          <FormDashboard
            changeDataStudioUrl={changeDataStudioUrl}
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        {!loading && (
          <Box className="skeleton-full-width">
            <Box sx={{ flexGrow: 1 }} padding={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CircularProgress />
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
        <Box sx={{ visibility: visible, display: displayIframe }}>
          <iframe
            onLoad={tiempoIframe}
            className="responsive-iframe-rutas"
            title="inicio"
            allowFullScreen
            security="restricted"
            frameBorder="0"
            src={dataStudio}
          ></iframe>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
