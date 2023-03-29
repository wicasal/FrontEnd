import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FormControl from "@mui/material/FormControl";
import { InputLabel } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ListSubheader from "@mui/material/ListSubheader";
import SvgIcon from "@mui/material/SvgIcon";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import ErrorIcon from "@mui/icons-material/Error";
import AddIcon from "@mui/icons-material/Add";
import { CircleFlag } from "react-circle-flags";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import "moment/locale/es";
import API from "../../configFiles/API/api";
import paises from "../../configFiles/paises/codigosPaises";
import Iframe from "../varios/Iframe";
import { TiendaContext } from "../../context/TiendaContext";
import { ReactComponent as IconoPilarVisita } from "../../assets/images/iconos-proxima-ruta/pilares-visita.svg";
import { ReactComponent as IconoUltimoPlan } from "../../assets/images/iconos-proxima-ruta/ultimo-plan.svg";
import { ReactComponent as IconoVisitaFisica } from "../../assets/images/iconos-proxima-ruta/visita-fisica.svg";
import { ReactComponent as IconoVisitaVirtual } from "../../assets/images/iconos-proxima-ruta/visita-virtual.svg";
import { ReactComponent as IconoHistorialVisitas } from "../../assets/images/iconos-proxima-ruta/historial-visita.svg";

import FormVisitaExtra from "../ProximaRuta/FormVisitaExtra";

/**
 * Componente principal del modulo de proxima ruta.
 *
 * Controla la tienda seleccionada para hacer la visita, muestra el mapa tactico usando el componente de IFrame.
 *
 * Servicios utilizados:
 *
 * - /DataStudioUrl: Para obtener el link del dataStudio del mapa tactico.
 * - /Ruta: Para obtener la información de la proxima ruta del colborador.
 * - /Tienda: Para obtener la información de las tiendas que no estan en la ruta
 */
const ProximaRuta = () => {
  const url = API.url;
  const navigate = useNavigate();

  moment.locale("es");

  const [dataStudioUrlPreview, setDataStudioUrlPreview] = useState("");
  const [dataStudioUrlExtended, setDataStudioUrlExtended] = useState("");
  const [listaTiendasRuta, setListaTiendasRuta] = useState([]);
  const [listaTiendasExtra, setListaTiendasExtra] = useState([]);
  const [tienda, setTienda] = useState({
    codigoTienda: "",
  });
  const [loader, setLoader] = useState(true);

  // Para controlar el modal de visita extraoficial
  const [openModalExtraoficial, setOpenModalExtraoficial] = useState(false);
  const handleModalExtraoficial = () =>
    setOpenModalExtraoficial((prevState) => !prevState);

  // Para controlar el modal de confirmacion agregar visita
  const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false);
  const handleModalConfirmacion = () =>
    setOpenModalConfirmacion((prevState) => !prevState);

  const tiendaEnRuta = useRef(false);
  const ruta = useRef();
  const botonPilaresDisabled = useRef(false);
  const idRuta = useRef("");
  const tipoVisitaExtraoficial = useRef("");
  const imgMarca = useRef("");

  // Seteamos los estados del contexto
  const {
    tiendaContext,
    setTiendaContext,
    setResponsableVisitaContext,
    emailColaboradorContext,
  } = useContext(TiendaContext);

  const areaRRHH = useRef(
    localStorage.idArea === "3DE362AD-A6D3-4AED-804B-1868AB5E8954"
  );

  const recoverTiendaContext = useCallback(
    (idTiendaSelect) => {
      let tiendas = [...listaTiendasRuta, ...listaTiendasExtra];;
      let tiendaRuta = tiendas.find((o) => o.codigoTienda === idTiendaSelect);
      //Si la tienda no esta en la ruta deshabilitamos el boton de pilares y habilitamos los de visita extraoficial
      if (Object.keys(tiendaRuta).includes("idRutaVisitaDetalle")) {
        tiendaEnRuta.current = true;
        botonPilaresDisabled.current = false;
      } else {
        botonPilaresDisabled.current = true;
        tiendaEnRuta.current = false;
      }

      // cargamos la data del data studio
      let posicion = localStorage.getItem("datastudio");
      let idDataStudioMapaTactico = "-1"; // Esto es por convencion con el API
      axios
        .get(
          `${url}DataStudioUrl/tipo/${idDataStudioMapaTactico}?tiendaId=${idTiendaSelect}&perfilId=${posicion}`
        )
        .then((res) => {
          setDataStudioUrlPreview(res.data.urlResumida);
          setDataStudioUrlExtended(res.data.urlResumida);
        });

      setTienda(tiendaRuta);
      imgMarca.current = "";
    },
    [listaTiendasExtra, listaTiendasRuta, url]
  );

  // Protegemos la ruta para cuando este logueado nada mas
  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user === null) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    let mounted = false;
    if (mounted) return;
    // Limpiamos los states del context
    setResponsableVisitaContext({});
    // NOTE: Este IDColaborador sera el correo del DT
    let idColaborador = localStorage.getItem("user");
    let config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
      },
    };
    let tiendasExtrasAux = [];

    let rutaAux = {};
    // cargamos las tiendas de la ruta
    axios.get(`${url}Ruta?correo=${idColaborador}`, config).then((resp) => {
      rutaAux = resp.data;
      idRuta.current = rutaAux.id;

      let marca = rutaAux.marcas[0];

      // axios.get(`${url}Tienda?cadena=${marca}`).then((resp2) => {
      axios.get(`${url}Tienda`).then((resp2) => {
        resp2.data.map((tienda, key) => {
          let tiendaAux = rutaAux.recorrido.find(
            (o) => o.codigoTienda === tienda.codigoTienda
          );
          // Si la tienda no esta en la ruta la agrego
          if (tiendaAux === undefined) {
            tiendasExtrasAux.push(tienda);
          }
          return true;
        });
        setListaTiendasExtra(tiendasExtrasAux);
        setLoader(false);
      });

      // Seteamos las fechas de la ruta con el formato necesario para mostrar
      let fechaRutaInicio = moment(rutaAux.periodo.fechaInicial).format(
        "DD-MM-YYYY"
      );
      let fechaRutaFinal = moment(rutaAux.periodo.fechaFinal).format(
        "DD-MM-YYYY"
      );

      rutaAux.periodo.fechaInicial = fechaRutaInicio;
      rutaAux.periodo.fechaFinal = fechaRutaFinal;

      // setemmos los estados

      setListaTiendasRuta(rutaAux.recorrido);
      ruta.current = rutaAux;
      imgMarca.current = rutaAux.marcasEImagen[marca];
    });

    return () => (mounted = true);
  }, [url, setResponsableVisitaContext, emailColaboradorContext]);

  // Cuando cambia la tienda, nos traemos su codigo para cargar el dataStudio
  const handleChangeTienda = (e) => {
    let idTiendaSelect = e.target.value;
    recoverTiendaContext(idTiendaSelect);
  };

  useEffect(() => {
    // Preguntamos si ya habia una tienda seleccionada con anterioridad y si estan las rutas cargadas
    if (
      tiendaContext.codigoTienda &&
      listaTiendasRuta.length > 0 &&
      listaTiendasExtra.length > 0
    )
      recoverTiendaContext(tiendaContext.codigoTienda);
  }, [
    tiendaContext,
    recoverTiendaContext,
    listaTiendasRuta,
    listaTiendasExtra,
  ]);

  // Cuando se desee crear una nueva visita
  const crearNuevaVisita = () => {
    let json = {
      idRutaVisita: idRuta.current,
      idArea: "DAFCF999-4DFA-4025-BA4C-E9AB95399CC3",
      idTienda: tienda.idTienda,
    };

    axios.post(`${url}Ruta/CrearVisitaNueva`, json).then((res) => {
      let idRutaVisitaDetalleAux = res.data.idRutaVisitaDetalle;
      let tiendaAux = tienda;
      tiendaAux["idRutaVisitaDetalle"] = idRutaVisitaDetalleAux;
      tiendaAux["idTienda"] = tienda.idTienda;
      setTiendaContext(tiendaAux);
      navigate("/pilares");
    });
  };

  return (
    <>
      {loader ? (
        <Grid container className="loader">
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Grid>
        </Grid>
      ) : (
        <Container maxWidth="lg" className="texto-blanco padding-box-nav-bar">
          <Grid container className="">
            {/* Boton regresar */}
            <Grid
              item
              xs={12}
              sx={{ textAlign: "left", my: 6 }}
              className="btn-regresar"
            >
              <Link to="/landingcalendario">
                <ArrowBackIosNewIcon />
                <span>Regresar</span>
              </Link>
            </Grid>
            {/* Titulo proxima ruta */}
            <Grid item xs={12} sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom component="div">
                <b>
                  Ruta del{" "}
                  <span className="texto-amarillo">
                    {ruta.current.periodo
                      ? ruta.current.periodo.fechaInicial
                      : ""}{" "}
                    al{" "}
                    {ruta.current.periodo
                      ? ruta.current.periodo.fechaFinal
                      : ""}
                  </span>
                </b>
              </Typography>
            </Grid>
            {/* Seleccionar ruta */}
            <Grid item xs={12}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      component="div"
                      className="texto-amarillo"
                    >
                      <b>Recorrido:</b>
                    </Typography>
                    {/* Aqui mostramos al pais y la bandera */}
                    {tienda.pais ? (
                      <p className="pais-proxima-ruta texto-amarillo">
                        <CircleFlag
                          countryCode={paises[tienda.pais]}
                          height="35"
                        />{" "}
                        <span>
                          <b>{tienda.pais}</b>
                        </span>
                      </p>
                    ) : (
                      ""
                    )}

                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      component="div"
                      sx={{ mb: 4 }}
                    >
                      Tienes{" "}
                      <span className="texto-amarillo">
                        {ruta.current.recorrido
                          ? ruta.current.recorrido.length
                          : 0}
                      </span>{" "}
                      tiendas asignadas en la Ruta
                    </Typography>

                    <span className="texto-blanco">
                      <b>Comienza tu Ruta</b>
                    </span>
                    <FormControl
                      variant="filled"
                      className="inputFill"
                      sx={{ mt: 1 }}
                    >
                      <InputLabel>Selecciona una Tienda</InputLabel>
                      <Select
                        onChange={(e) => handleChangeTienda(e)}
                        value={tienda.codigoTienda}
                      >
                        <ListSubheader
                          onClick={() => {}}
                          className="texto-amarillo"
                        >
                          Tiendas de la Ruta
                        </ListSubheader>
                        {listaTiendasRuta.map((tienda, i) => (
                          <MenuItem key={i} value={tienda.codigoTienda}>
                            {tienda.nombreTienda}
                          </MenuItem>
                        ))}
                        <hr />
                        <ListSubheader
                          onClick={() => {}}
                          className="texto-amarillo"
                        >
                          Todas las Tiendas
                        </ListSubheader>
                        {listaTiendasExtra.map((tienda) => (
                          <MenuItem
                            key={tienda.codigoTienda}
                            value={tienda.codigoTienda}
                          >
                            {tienda.nombreTienda}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box className="img-tienda">
                    {tienda.urlImagenTienda ? (
                      <img src={tienda.urlImagenTienda} alt="Tienda" />
                    ) : (
                      ""
                    )}
                    {imgMarca.current ? (
                      <img src={imgMarca.current} alt="Marca" />
                    ) : (
                      ""
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            {/* Mapa tactico y botones */}
            {tienda.codigoTienda ? (
              <Grid item xs={12} sx={{ mt: 8 }}>
                <Grid
                  container
                  spacing={3}
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  {/* Botones */}
                  {/* Boton ultimo plan */}
                  <Grid item sx={{ textAlign: "center" }}>
                    <Stack direction="column" spacing={1}>
                      <Button
                        variant="contained"
                        className="btn btn-proxima-ruta"
                        onClick={() => {
                          setTiendaContext(tienda);
                          navigate("/ultimoplan");
                        }}
                      >
                        <SvgIcon component={IconoUltimoPlan} inheritViewBox />
                      </Button>
                      <Typography variant="body2" gutterBottom component="div">
                        <b>
                          Último Plan
                          <br /> de Acción
                        </b>
                      </Typography>
                    </Stack>
                  </Grid>
                  {/* Pilres de visita y agregar visita */}
                  <Grid item sx={{ textAlign: "center" }}>
                    <Stack direction="column" spacing={1}>
                      {/* Si el estado de la tienda es este es porq esta finalizada */}
                      {tienda.idEstadoVisitaTienda ===
                        "3edd55cb-d147-4c13-b01b-3279f345a1e6" &&
                      !botonPilaresDisabled.current ? (
                        <>
                          <Button
                            variant="contained"
                            className="btn btn-proxima-ruta"
                            onClick={() => {
                              handleModalConfirmacion();
                            }}
                          >
                            <AddIcon fontSize="large" />
                          </Button>
                          <Typography
                            variant="body2"
                            gutterBottom
                            component="div"
                          >
                            <b>
                              Agregar <br />
                              nueva Visita
                            </b>
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="contained"
                            className="btn btn-proxima-ruta"
                            disabled={botonPilaresDisabled.current}
                            onClick={() => {
                              setTiendaContext(tienda);
                              navigate("/pilares");
                            }}
                          >
                            <SvgIcon
                              component={IconoPilarVisita}
                              inheritViewBox
                            />
                          </Button>
                          <Typography
                            variant="body2"
                            gutterBottom
                            component="div"
                          >
                            <b>
                              Pilares <br />
                              de Visita
                            </b>
                          </Typography>
                        </>
                      )}
                    </Stack>
                  </Grid>
                  {/* Historial de visitas */}
                  <Grid item sx={{ textAlign: "center" }}>
                    <Stack direction="column" spacing={1}>
                      <Button
                        variant="contained"
                        className="btn btn-proxima-ruta"
                        onClick={() => {
                          setTiendaContext(tienda);
                          navigate("/historial");
                        }}
                      >
                        <SvgIcon
                          component={IconoHistorialVisitas}
                          inheritViewBox
                          sx={{}}
                          fontSize="large"
                        />
                      </Button>
                      <Typography variant="body2" gutterBottom component="div">
                        <b>
                          Historial
                          <br /> de Visita
                        </b>
                      </Typography>
                    </Stack>
                  </Grid>
                  {!areaRRHH.current && (
                    <>
                      {/* Visita extraoficial */}
                      <Grid item sx={{ textAlign: "center" }}>
                        <Stack direction="column" spacing={1}>
                          <Button
                            variant="contained"
                            className="btn btn-proxima-ruta"
                            disabled={tiendaEnRuta.current}
                            onClick={() => {
                              handleModalExtraoficial();
                              tipoVisitaExtraoficial.current = 0;
                            }}
                          >
                            <SvgIcon
                              component={IconoVisitaFisica}
                              inheritViewBox
                            />
                          </Button>
                          <Typography
                            variant="body2"
                            gutterBottom
                            component="div"
                          >
                            <b>
                              Visita Extraoficial <br />
                              Física
                            </b>
                          </Typography>
                        </Stack>
                      </Grid>
                      {/* Visita extraoficial virtual */}
                      <Grid item sx={{ textAlign: "center" }}>
                        <Stack direction="column" spacing={1}>
                          <Button
                            variant="contained"
                            className="btn btn-proxima-ruta"
                            disabled={tiendaEnRuta.current}
                            onClick={() => {
                              handleModalExtraoficial();
                              tipoVisitaExtraoficial.current = 1;
                            }}
                          >
                            <SvgIcon
                              component={IconoVisitaVirtual}
                              inheritViewBox
                            />
                          </Button>
                          <Typography
                            variant="body2"
                            gutterBottom
                            component="div"
                          >
                            <b>
                              Visita Extraoficial <br />
                              Virtual
                            </b>
                          </Typography>
                        </Stack>
                      </Grid>
                    </>
                  )}

                  {/* Mapa tactico  */}
                  <Grid item xs={12} sx={{ mt: 4 }}>
                    <Box className="caja-mapa-tactico-proxima-ruta">
                      <Grid container>
                        <Grid item xs={11}>
                          <Stack direction="row" spacing={1} sx={{ my: 1 }}>
                            <Typography variant="h6">
                              <b>{tienda.nombreTienda}</b>
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              className="texto-amarillo"
                              sx={{ pt: 0.5 }}
                            >
                              - {tienda.pais}
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={1} sx={{ textAlign: "right" }}>
                          <Box className="expandir-btn-proxima-ruta">
                            <a
                              href={dataStudioUrlExtended}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Box className="expandir-icon">
                                <FullscreenIcon />
                              </Box>
                            </a>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Iframe
                            pagina="proxima ruta"
                            dataStudioUrlPreview={dataStudioUrlPreview}
                            dataStudioUrlExtended={dataStudioUrlExtended}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              ""
            )}
          </Grid>
        </Container>
      )}
      {/* Modal de visita extraordinaria */}
      <Modal
        open={openModalExtraoficial}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleModalExtraoficial();
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-visitaextra">
          <Grid container spacing={1}>
            <Grid item xs={12} sx={{ textAlign: "center", minHeight: 125 }}>
              <FormVisitaExtra
                tipoVisitaExtraoficial={tipoVisitaExtraoficial.current}
                handleCloseModalExtraoficial={handleModalExtraoficial}
                tienda={tienda}
                idRuta={idRuta.current}
              />
            </Grid>
          </Grid>
        </Box>
      </Modal>
      {/* Modal agregar visita nueva */}
      <Modal
        open={openModalConfirmacion}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleModalConfirmacion();
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-confirmacion-pilar">
          <Grid container spacing={1}>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <ErrorIcon sx={{ color: "#FCBC1D", height: 60, width: 60 }} />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center", mb: 5 }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                <b>
                  ¿Estás seguro que quieres
                  <br /> realizar una nueva ?
                </b>
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "center" }}>
              <Button
                className="btn-cancelar"
                onClick={() => {
                  handleModalConfirmacion();
                }}
              >
                Cancelar
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "center" }}>
              <Button
                className="btn-finalizar"
                onClick={() => crearNuevaVisita()}
              >
                Aceptar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default ProximaRuta;
