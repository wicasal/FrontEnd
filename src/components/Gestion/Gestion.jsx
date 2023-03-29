import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import { TiendaContext } from "../../context/TiendaContext";
import API from "../../configFiles/API/api";
import FormCategoriaGestion from "./FormCategoriaGestion";

/**
 * Componente base de la evaluacion de gestion de tienda. Renderiza la leyendaa de las preguntas y el formulario.
 *
 * Servicios utilizados:
 * - /GestionTienda: Para obtener las categorias y preguntas de la gestion de tienda.
 */
const Gestion = () => {
  const url = API.url;
  const navigate = useNavigate();
  const params = useParams();

  const { tiendaContext } = useContext(TiendaContext);
  const [loader, setLoader] = useState(true);
  const [categoriasPreguntas, setCategoriasPreguntas] = useState([]);

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
    let endpoint =
      params.tipo === "tienda"
        ? "GestionTienda"
        : "GestionTienda/CheckListSaldo";

    axios.get(url + endpoint).then((res) => {
      let gestion = [];
      let gestion_aux = {};
      let response = res.data;
      let aux = [];
      response.map((prop) => {
        gestion_aux = {};
        gestion_aux["nombre"] = prop.nombre;
        gestion_aux["id"] = prop.id;
        aux = [];
        prop.gestionTiendaDetalles.forEach((element) => {
          aux.push({ descripcion: element.descripcion, id: element.id });
        });
        gestion_aux["preguntas"] = aux;
        gestion.push(gestion_aux);
        return true;
      });
      setCategoriasPreguntas(gestion);
      setLoader(false);
    });
  }, [tiendaContext, url, params]);

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
                <Link to="/pilares">
                  <ArrowBackIosNewIcon />
                  <span>Regresar</span>
                </Link>
              </Grid>
              <Grid item xs={6} className="titulo-template-indicadores">
                <Typography variant="h4">Gestión de {params.tipo}</Typography>
              </Grid>
            </Grid>
          </Container>
          <Container
            maxWidth="lg"
            className="texto-blanco bg-gris padding-box-nav-bar"
          >
            <Grid container>
              <Grid item xs={12} sx={{ mt: 4 }}>
                <Box>
                  <FormCategoriaGestion
                    categoriasPreguntas={categoriasPreguntas}
                    tipoGestion={params.tipo}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </>
      )}{" "}
    </>
  );
};

export default Gestion;
