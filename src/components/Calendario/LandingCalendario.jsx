import React, { useState, useEffect, useRef } from "react";
import Container from "@mui/material/Container";
import SvgIcon from "@mui/material/SvgIcon";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/images/Logo-login.svg";
import FormCargarRuta from "./FormCargarRuta";

/**
 * Componente creado como componente principal del módulo de Calendarios.
 *
 * Actualmente muestra 3 botones:
 * - Ver Ruta: Que redirigue a la vista de proximaRuta.
 * - Cargar Ruta: Que abre el modal para cargar la ruta.
 * - Descargar Plantilla que abre una pestaña con la plantilla en Google Sheets para los DTs.
 *
 */

const LandingCalendario = () => {
  const navigate = useNavigate();

  const [loader, setLoader] = useState(false);
  // Para controlar el modal de cargar archivo
  const [openModalCargar, setOpenModalCargar] = useState(false);
  const handleModalCargar = () => setOpenModalCargar((prevState) => !prevState);

  const rolesRRHH = [
    "JEFE DE RRHH",
    "JEFE DE RRHH REGIONAL",
    "ANALISTA DE RRHH",
    "ANALISTA RRHH",
  ];

  const cargoRRHH = useRef(rolesRRHH.includes(localStorage.cargo));

  const areaRRHH = useRef(
    localStorage.idArea === "3DE362AD-A6D3-4AED-804B-1868AB5E8954"
  );

  // Protegemos la ruta para cuando este logueado nada mas, en caso de no estarlo es enviado a /login
  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user === null) navigate("/login");
    setLoader(false);
  }, [navigate]);

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
          <Container maxWidth="lg">
            <Box sx={{ pt: 25 }} xs="12" className="center-content">
              <SvgIcon component={Logo} className="logotipo" inheritViewBox />
            </Box>
            <Grid container sx={{ pt: 15 }}>
              <Grid item xs={cargoRRHH.current || !areaRRHH.current ? 4 : 12}>
                <Box className="contenedor-button d-flex align-center calendario">
                  <Button
                    className="btn-primary"
                    onClick={() => navigate("/proximaruta")}
                  >
                    Ver Ruta
                  </Button>
                </Box>
              </Grid>
              {(cargoRRHH.current || !areaRRHH.current) && (
                <>
                  <Grid item xs={4}>
                    <Box className="contenedor-button d-flex align-center calendario">
                      <Button
                        className="btn-primary"
                        onClick={() => {
                          handleModalCargar();
                        }}
                      >
                        Cargar Archivo
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box className="contenedor-button d-flex align-center calendario">
                      <Button
                        className="btn-primary"
                        onClick={() => {
                          window.open(
                            "https://docs.google.com/spreadsheets/d/1tEfpTeq0gDm1f0bI3gGuCsjgXmCIYUzUrqATjgjr1jY/edit#gid=852195386",
                            "_blank"
                          );
                        }}
                      >
                        Descargar Plantilla
                      </Button>
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </Container>
          {/* <Container maxWidth="xl">
            <Calendario />
          </Container> */}
        </>
      )}
      {/* Modal cargar archivo  */}
      <Modal
        open={openModalCargar}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleModalCargar();
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-visitaextra modal-cargar-ruta">
          <Grid container spacing={1}>
            <Grid item xs={12} sx={{ textAlign: "center", minHeight: 125 }}>
              <FormCargarRuta handleCloseModalCargar={handleModalCargar} />
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default LandingCalendario;
