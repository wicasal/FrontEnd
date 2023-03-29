import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import PropTypes from 'prop-types';

/**
 * Componente Iframe. Carga los dataStudio segun sea el caso. Tambien controla el boton para abrir la version extendida.
 */
const Iframe = (props) => {
  let pagina = props.pagina;
  let dataStudioUrlPreview = props.dataStudioUrlPreview;
  let dataStudioUrlExtended = props.dataStudioUrlExtended;
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState("hidden");
  const [claseIframeContenedor, setClaseIframeContenedor] = useState("");
  const [scroll, setScroll] = useState("");

  useEffect(() => {
    let mounted = false;
    if (mounted) return;

    if (pagina === "pilar") {
      setClaseIframeContenedor(
        "iframe-container-preview margin-top-negativo padding-top-pilar scrollNo"
      );
      setScroll("no");
    } else {
      setClaseIframeContenedor(
        "iframe-container-preview padding-top-proxima-ruta"
      );
      setScroll("yes");
    }
    return () => (mounted = true);
  }, [pagina]);

  const tiempoIframe = () => {
    setTimeout(() => {
      setLoading(true);
      setVisible("visible");
    }, 3000);
  };
  return (
    <div className={claseIframeContenedor}>
      <Box sx={{ visibility: visible }}>
        {dataStudioUrlPreview !== "" && (
          <iframe
            title="inicio"
            onLoad={tiempoIframe}
            ecurity="restricted"
            src={dataStudioUrlPreview}
            frameBorder="0"
            scrolling={scroll}
          ></iframe>
        )}
      </Box>
      {!loading ? (
        <Grid item xs={12} className="spiner-iframe">
          <Box sx={{ flexGrow: 1 }} padding={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CircularProgress />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      ) : (
        ""
      )}
      {pagina !== "proxima ruta" ? (
        <Grid item xs={12} sx={{ visibility: visible, width: 100 }}>
          <Box className="expandir-btn-pilar">
            <a href={dataStudioUrlExtended} target="_blank" rel="noreferrer">
              <Box className="expandir-icon">
                <FullscreenIcon />
              </Box>
            </a>
          </Box>
        </Grid>
      ) : (
        ""
      )}
    </div>
  );
};

Iframe.propTypes = {
  /** nos dice si la pagina en la que estamos es un pilar o no*/
  pagina: PropTypes.string.isRequired,
  /** url de la version resumida del dataStudio */
  dataStudioUrlPreview: PropTypes.string.isRequired,
  /** url de la version extendida del dataStudio */
  dataStudioUrlExtended: PropTypes.string.isRequired
}

export default Iframe;
