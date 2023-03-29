import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import API from "../../configFiles/API/api";
import Button from "@mui/material/Button";

/**
 * Componente del home.
 *
 * Este componente muestra el iframe del home y el boton de cerrar sesion.
 *
 * Servicios utilizados:
 *
 * - DataStudioUrl: Para obtener el link del dataStudio del home.
 */
const Inicio = () => {
  const url = API.url;
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

    let user = localStorage.getItem("user");
    if (user === null) {
      navigate("/login");
    } else {
      let idDataStudioHome = "0"; // Esto es por convencion con el API
      let posicion = localStorage.getItem("datastudio");
      axios
        .get(
          `${url}DataStudioUrl/tipo/${idDataStudioHome}?perfilId=${posicion}`
        )
        .then((res) => {
          setDataStudio(res.data.urlResumida);
        });
    }

    let body = document.getElementsByTagName("body")[0];
    body.style.overflow = "hidden";

    return () => {
      mounted = true;
      body.style.overflow = "inherit";
    };
  }, [navigate, url]);

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

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Grid container className="padding-box-nav-bar">
      <Grid item xs={12} className="barra-cerrar-sesion">
        <Button
          variant="text"
          onClick={cerrarSesion}
          className="btn-cerrar-sesion"
        >
          Cerrar Sesion <LogoutIcon sx={{ ml: 1 }} />
        </Button>
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
            className="responsive-iframe-inicio"
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

export default Inicio;
