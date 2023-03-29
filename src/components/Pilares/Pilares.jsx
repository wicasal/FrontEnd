import React, { useState, useContext, useEffect, useRef } from "react";
import Container from "@mui/material/Container";
import SvgIcon from "@mui/material/SvgIcon";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CircularProgress from "@mui/material/CircularProgress";
import Badge from "@mui/material/Badge";
import CheckIcon from "@mui/icons-material/Check";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import SearchIcon from "@mui/icons-material/Search";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API from "../../configFiles/API/api";
import { ReactComponent as Logo } from "../../assets/images/Logo-login.svg";
import { TiendaContext } from "../../context/TiendaContext";
import CajaPilar from "./CajaPilar";
import { ReactComponent as IconoChecklistTienda } from "../../assets/images/iconos-pilares/Icono-checklist-tienda.svg";
import { ReactComponent as IconoFinalizar } from "../../assets/images/iconos-pilares/Icono-finalizar.svg";
import { ReactComponent as Circle } from "../../assets/images/iconos-pilares/circle.svg";

/**
 * Componente principal del modulo de pilares.
 *
 * Carga los pilares usando el componente de CajaPilar, asi como tambien muestra el deplegable del encargado.
 * Ademas, en este componente se puede finalizar la visita a la tienda
 *
 * Servicios utilizados:
 *
 * - /Colaborador: Para obtener los encargados de la tienda.
 * - /Pilar: Para obtener los datos del pilar, como el ID y las preguntas.
 * - /Pilar/Evaluacion/RutaVisitaDetalle: Para consultar el estado de la visita,, la gestion de tienda y los pilares.
 * - /Pilar/FinalizarVisita: Para finalizar la visita
 * - /Encargado : Para consultar por codigo de encargado
 */
const Pilares = () => {
  const url = API.url;
  const [colaboradoresTienda, setColaboradoresTienda] = useState([]);
  const [alturaBox, setAlturaBox] = useState(0);
  const [pilares, setPilares] = useState({});
  const [pilaresStatus, setPilaresStatus] = useState({});
  const [puedeFinalizar, setPuedeFinalizar] = useState(false);
  const [gestionFinalizada, setGestionFinalizada] = useState(false);
  const [visitaFinalizada, setVisitaFinalizada] = useState(false);
  const [tipoBusquedaEncargado, setTipoBusquedaEncargado] = useState("0");

  const saldoFinalizado = useRef(false);

  const {
    tiendaContext,
    setPilaresContext,
    responsableVisitaContext,
    setResponsableVisitaContext,
  } = useContext(TiendaContext);
  const [loader, setLoader] = useState(true);

  const [responsableTienda, setResponsableTienda] = useState(
    responsableVisitaContext.id ? responsableVisitaContext.id : ""
  );

  const [disabledEncargado, setDisabledEncargado] = useState(false);

  const [colorPuntaje, setColorPuntaje] = useState("");
  const [puntajePorcentaje, setPuntajePorcentaje] = useState(0);
  const [mensajeErrorCodigoEncargado, setMensajeErrorCodigoEncargado] =
    useState("");

  const navigate = useNavigate();

  // Para controlar el modal de finalizar
  const [openModalFinalizar, setOpenModalFinalizar] = useState(false);
  const handleModalFinalizar = () =>
    setOpenModalFinalizar((prevState) => !prevState);

  // detectamos el resize para calcular la altura de un box

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

  const areaRRHH = useRef(
    localStorage.idArea === "3DE362AD-A6D3-4AED-804B-1868AB5E8954"
  );

  // Definimos la validacion de los campos del formulario
  const validationSchema = Yup.object().shape({
    codigoEncargado: Yup.string().required("Código requerido"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // react-hook-form hook
  const metodosForm = useForm(formOptions);

  // Protegemos la ruta para cuando este logueado nada mas
  useEffect(() => {
    let user = localStorage.getItem("user");
    if (user === null) navigate("/login");
  }, [navigate]);

  // Detectamos el cambio de resolucion para mostrar mejor las cajas
  useEffect(() => {
    resizeWindow();

    // protegemos la ruta si no hay una tienda seleccionada
    if (!tiendaContext.idTienda) {
      navigate("/proximaruta");
    }
  }, [tiendaContext, navigate]);

  useEffect(() => {
    let mounted = false;
    if (mounted) return;
    let codigoTienda = tiendaContext.codigoTienda;
    let idRutaVisitaDetalle = tiendaContext.idRutaVisitaDetalle;
    let config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "content-type": "application/json",
      },
    };
    // Consultamos los colaboradores de la tienda
    let listaEncargados = [];
    axios
      .get(`${url}Colaborador/?codigoTienda=${codigoTienda}`, config)
      .then((res) => {
        if (mounted) return;
        setColaboradoresTienda(res.data);
        listaEncargados = res.data;
      });

    // Consultamos los pilares para obtener su uiid y las preguntas
    // Se tiene que enviar como paramentro o en body el idArea

    async function fetchPilar() {
      let idArea = localStorage.getItem("idArea");
      await axios.get(`${url}Pilar/?idArea=${idArea}`, config).then((res) => {
        if (mounted) return;
        let pilaresAux = res.data;
        setPilares(pilaresAux);
        setPilaresContext(pilaresAux);

        // Consultamos las calificaciones del pilar segun la ruta
        axios
          .get(
            `${url}Pilar/Evaluacion/RutaVisitaDetalle/${idRutaVisitaDetalle}/ResumenVisitaTienda`,
            config
          )
          .then((res) => {
            if (mounted) return;

            let json = {};
            let idColab =
              res.data.idColabEncargado === 0
                ? res.data.idColabEncargadoGestionTienda
                : res.data.idColabEncargado;

            if (idColab !== 0) {
              setResponsableTienda(idColab);

              // Si el encargado esta en la lista, fue seleccionado por lista sino fue buscado por codigo
              let encargado = listaEncargados.find((o) => o.id === idColab);
              let responsableVisitaAux = {
                codigo: encargado ? false : true,
                id: idColab,
              };

              if (encargado === undefined) {
                axios.get(`${url}Colaborador/${idColab}`).then((res) => {
                  responsableVisitaAux["nombre"] =
                    res.data.nombre + " " + res.data.apellido;
                  metodosForm.setValue(
                    "codigoEncargado",
                    res.data.nombre + " " + res.data.apellido,
                    {
                      shouldValidate: false,
                    }
                  );
                });
              }

              setResponsableVisitaContext(responsableVisitaAux);

              setDisabledEncargado(true);
            }

            setGestionFinalizada(
              res.data.estadoEvaluacionGestionTienda === "Finalizada"
            );
            setVisitaFinalizada(res.data.estadoVisita === "Finalizado");

            saldoFinalizado.current =
              res.data.estadoEvaluacionGestionTiendaSaldo === "Finalizada";

            let pilaresPuntaje = res.data.pilarEvaluacions;
            pilaresAux.map((pilar) => {
              let pilarAux = pilaresPuntaje.find((o) => o.idPilar === pilar.id);

              if (
                pilarAux &&
                pilarAux.idEstado === "737b8ff3-8617-420a-aa11-b92516d9f101"
              ) {
                if (areaRRHH.current) {
                  setPuedeFinalizar(true);
                } else {
                  setPuedeFinalizar(
                    res.data.estadoEvaluacionGestionTienda === "Finalizada"
                  );
                }
              }

              if (pilarAux) {
                json[pilar.nombre] = {
                  completado:
                    pilarAux.idEstado === "737b8ff3-8617-420a-aa11-b92516d9f101"
                      ? true
                      : false,
                  puntaje: pilarAux.calificacionPromedio,
                };
              } else {
                json[pilar.nombre] = {
                  completado: false,
                  puntaje: 0,
                };
              }

              return true;
            });

            setPilaresStatus(json);
            setLoader(false);
          });
      });
    }

    fetchPilar();

    return () => (mounted = true);
  }, [
    url,
    setPilaresContext,
    tiendaContext.codigoTienda,
    tiendaContext,
    setResponsableVisitaContext,
    metodosForm,
  ]);

  // Manejamos el cambio de responsable de la tienda
  const handleChangeResponsable = (event) => {
    setResponsableTienda(event.target.value);
    setResponsableVisitaContext({
      codigo: false,
      id: event.target.value,
    });
  };

  //Manejamos la busqueda de responsable por codigo

  const onSubmitEncargadoCodigo = (data) => {
    axios
      .get(
        `${url}Encargado?codigoSap=${data.codigoEncargado}&pais=${tiendaContext.pais}`
      )
      .then((res) => {
        setMensajeErrorCodigoEncargado("");
        setResponsableTienda(res.data.id);
        setResponsableVisitaContext({
          codigo: true,
          id: res.data.id,
          nombre: res.data.nombre + " " + res.data.apellido,
        });

        metodosForm.setValue(
          "codigoEncargado",
          res.data.nombre + " " + res.data.apellido,
          {
            shouldValidate: false,
          }
        );
      })
      .catch((err) => {
        setMensajeErrorCodigoEncargado("Encargado no encontrado");
      });
  };

  // Manejamos el boton de finalizar visita
  const finalizarPilar = () => {
    let puntajePromedio = 0;
    let cantidadCompletados = 0;
    // Contamos los completados
    for (var prop in pilaresStatus) {
      if (pilaresStatus[prop].completado) {
        puntajePromedio += pilaresStatus[prop].puntaje;
        cantidadCompletados++;
      }
    }

    puntajePromedio = puntajePromedio / cantidadCompletados;
    setPuntajePorcentaje(puntajePromedio);

    // Segun el puntaje mostramos los estilos correspondientes
    if (puntajePromedio >= 1 && puntajePromedio < 1.9) {
      setColorPuntaje("rojo");
    } else if (puntajePromedio >= 2 && puntajePromedio < 2.9) {
      setColorPuntaje("naranja");
    } else if (puntajePromedio >= 3 && puntajePromedio < 3.9) {
      setColorPuntaje("verde");
    } else {
      setColorPuntaje("azul");
    }
    handleModalFinalizar();

    // construimos el json para finalizar la visita con el id de completado
    // let json = {
    //   idRutaVisitaDetalle: tiendaContext.idRutaVisitaDetalle,
    //   idRutaVisitaDetalleEstadoPilar: "5f62e43a-4045-4e09-a6b2-ae71805acd86",
    // };

    let idRutaVisitaDetalle = tiendaContext.idRutaVisitaDetalle;

    axios
      .put(`${url}Pilar/FinalizarVisita/${idRutaVisitaDetalle}`)
      .then((res) => {});
  };

  return (
    <>
      {/*HEADER*/}
      {loader ? (
        <Grid container className="loader">
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Grid>
        </Grid>
      ) : (
        <>
          <Container maxWidth="md">
            <Grid container>
              {/* Boton regresar */}
              <Grid
                item
                xs={12}
                sx={{ textAlign: "left", mt: 6 }}
                className="btn-regresar"
              >
                <Link to="/proximaruta">
                  <ArrowBackIosNewIcon />
                  <span>Regresar</span>
                </Link>
              </Grid>
            </Grid>
            {/* Logo  */}
            <Box sx={{ py: 4 }} className="center-content">
              <SvgIcon component={Logo} className="logotipo" inheritViewBox />
              <Typography
                variant="h5"
                className="texto-amarillo"
                sx={{ mt: 2 }}
              >
                <b>Tienda {tiendaContext.nombreTienda}</b>
              </Typography>
            </Box>
          </Container>

          {/* Elegir encargado */}
          <Box sx={{ flexGrow: 1, py: 4, px: 12 }} className="container-gray">
            <Container maxWidth="md">
              <Grid container spacing={1}>
                <Grid item xs={12} sm={12}>
                  <FormControl sx={{ width: "100%", mb: 2 }}>
                    <Typography
                      variant="body1"
                      className="texto-blanco"
                      sx={{ mb: 1 }}
                    >
                      <b>Seleccionar responsable de la visita por:</b>
                    </Typography>
                    <Controller
                      name={`codigoEncargadoRadio`}
                      defaultValue={""}
                      control={metodosForm.control}
                      render={({ field: { onChange, value, name } }) => (
                        <RadioGroup
                          sx={{ width: "100%" }}
                          name={name}
                          value={tipoBusquedaEncargado}
                          row
                          aria-labelledby={`codigoEncargadoRadio`}
                          onChange={(e) => {
                            setTipoBusquedaEncargado(e.target.value);
                            setResponsableTienda("");
                            setMensajeErrorCodigoEncargado("");
                            setResponsableVisitaContext({
                              codigo: e.target.value === "0" ? false : true,
                              id: "",
                              nombre: "",
                            });
                            metodosForm.setValue("codigoEncargado", "", {
                              shouldValidate: false,
                            });
                          }}
                        >
                          <FormControlLabel
                            value="0"
                            control={<Radio />}
                            size="small"
                            label="Lista de encargados"
                            className="encargado-radio"
                            disabled={disabledEncargado}
                            checked={!responsableVisitaContext.codigo}
                          />
                          <FormControlLabel
                            value="1"
                            control={<Radio size="small" />}
                            label="Código de empleado"
                            className="encargado-radio"
                            disabled={disabledEncargado}
                            checked={responsableVisitaContext.codigo}
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                  {!responsableVisitaContext.codigo && (
                    <FormControl variant="filled" className="inputFill">
                      <InputLabel>Responsable de la Visita</InputLabel>
                      <Select
                        disabled={disabledEncargado}
                        value={responsableTienda}
                        onChange={(e) => handleChangeResponsable(e)}
                      >
                        {colaboradoresTienda.map((colab) => (
                          <MenuItem key={colab.id} value={colab.id}>
                            {`${colab.nombre} ${colab.apellido}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {responsableVisitaContext.codigo && (
                    <form
                      onSubmit={metodosForm.handleSubmit(
                        onSubmitEncargadoCodigo
                      )}
                    >
                      <Stack direction="row" spacing={2}>
                        <FormControl sx={{ width: "100%" }}>
                          <Controller
                            name={"codigoEncargado"}
                            control={metodosForm.control}
                            defaultValue={responsableVisitaContext.nombre}
                            render={({ field }) => (
                              <TextField
                                disabled={disabledEncargado}
                                {...field}
                                onChange={(e) => {
                                  // Para borrar el error
                                  setMensajeErrorCodigoEncargado("");
                                  metodosForm.setValue(
                                    "codigoEncargado",
                                    e.target.value,
                                    {
                                      shouldValidate: false,
                                    }
                                  );
                                }}
                                placeholder="Escribe el código del encargado"
                              />
                            )}
                          />
                          {metodosForm.formState.errors.codigoEncargado && (
                            <Typography
                              variant="subtitle2"
                              className="error-msg"
                            >
                              {
                                metodosForm.formState.errors.codigoEncargado
                                  .message
                              }
                            </Typography>
                          )}
                          {mensajeErrorCodigoEncargado !== "" && (
                            <Typography
                              variant="subtitle2"
                              className="error-msg"
                            >
                              {mensajeErrorCodigoEncargado}
                            </Typography>
                          )}
                        </FormControl>
                        <Button
                          className="btn btn-buscar-encargado"
                          type="submit"
                          disabled={disabledEncargado}
                        >
                          <SearchIcon fontSize={"large"} />
                        </Button>
                      </Stack>
                    </form>
                  )}
                </Grid>
              </Grid>
            </Container>
          </Box>

          {/*CUERPO DE LA PAGINA*/}
          <Box
            sx={{
              flexGrow: 1,
              mt: 0,
              py: 4,
              height: responsableTienda === "" ? alturaBox : "auto",
            }}
            className="body-white padding-box-nav-bar"
          >
            <Container maxWidth="md">
              {responsableTienda === "" ? (
                <Box sx={{ p: 10, textAlign: "center" }}>
                  <Typography variant="h6" gutterBottom component="div">
                    Selecciona el Responsable de la Visita
                    <br />
                    para poder continuar
                  </Typography>
                </Box>
              ) : (
                <>
                  {/* Gestion de tienda y preguntas de saldo */}
                  <Grid
                    container
                    spacing={1}
                    sx={{ pt: 2, pb: 6 }}
                    className="border-bot-gris"
                  >
                    {/* Checklist de la tienda */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "start",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{ pt: 0.5, ml: 0 }}
                      >
                        {gestionFinalizada ? (
                          <Badge
                            badgeContent={<CheckIcon />}
                            color="success"
                            className="check-badge-proxima-ruta check-badge-gestion"
                          >
                            <Button
                              variant="contained"
                              className="btn btn-checklist-tienda"
                            >
                              <SvgIcon
                                component={IconoChecklistTienda}
                                inheritViewBox
                              />
                            </Button>
                          </Badge>
                        ) : (
                          <Button
                            variant="contained"
                            className="btn btn-checklist-tienda"
                            onClick={() => {
                              navigate("/gestion/tienda");
                            }}
                            disabled={responsableTienda === ""}
                          >
                            <SvgIcon
                              component={IconoChecklistTienda}
                              inheritViewBox
                            />
                          </Button>
                        )}
                        <Typography
                          variant="h6"
                          gutterBottom
                          component="div"
                          className="texto-negro"
                          sx={{ lineHeight: 1.2 }}
                        >
                          <b>
                            Evaluación <br /> Gestión de Tienda
                          </b>
                        </Typography>
                      </Stack>
                    </Grid>
                    {/* Checklist de saldo */}
                    {areaRRHH.current ? (
                      ""
                    ) : (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{ pt: 0.5, ml: 0 }}
                        >
                          {saldoFinalizado.current ? (
                            <Badge
                              badgeContent={<CheckIcon />}
                              color="success"
                              className="check-badge-proxima-ruta check-badge-gestion"
                            >
                              <Button
                                variant="contained"
                                className="btn btn-checklist-tienda"
                              >
                                <SvgIcon
                                  component={IconoChecklistTienda}
                                  inheritViewBox
                                />
                              </Button>
                            </Badge>
                          ) : (
                            <Button
                              variant="contained"
                              className="btn btn-checklist-tienda"
                              onClick={() => {
                                navigate("/gestion/saldo");
                              }}
                              disabled={responsableTienda === ""}
                            >
                              <SvgIcon
                                component={IconoChecklistTienda}
                                inheritViewBox
                              />
                            </Button>
                          )}
                          <Typography
                            variant="h6"
                            gutterBottom
                            component="div"
                            className="texto-negro"
                            sx={{ lineHeight: 1.2 }}
                          >
                            <b>
                                Mínimos<br/> de saldo
                            </b>
                          </Typography>
                        </Stack>
                      </Grid>
                    )}
                  </Grid>

                  {/* Cajas pilares */}
                  <Grid container spacing={3} sx={{ py: 2, mt: 1 }}>
                    {pilares.map((pilar, i) => (
                      <CajaPilar
                        key={pilar.id}
                        visitaFinalizada={visitaFinalizada}
                        dataPilar={pilar}
                        borderRadius={i % 2 === 0 ? "left" : "right"}
                        completado={
                          pilaresStatus[pilar.nombre]
                            ? pilaresStatus[pilar.nombre].completado
                            : false
                        }
                        puntaje={
                          pilaresStatus[pilar.nombre]
                            ? pilaresStatus[pilar.nombre].puntaje
                            : 0
                        }
                      />
                    ))}
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Stack direction="column" spacing={1}>
                      {visitaFinalizada ? (
                        <Badge
                          badgeContent={<CheckIcon />}
                          color="success"
                          className="check-badge-proxima-ruta"
                        >
                          <Button
                            variant="contained"
                            className="btn btn-submit-pilar"
                          >
                            <SvgIcon
                              component={IconoFinalizar}
                              inheritViewBox
                            />
                          </Button>
                        </Badge>
                      ) : (
                        <Button
                          variant="contained"
                          className="btn btn-submit-pilar"
                          disabled={!puedeFinalizar}
                          onClick={() => finalizarPilar()}
                        >
                          <SvgIcon component={IconoFinalizar} inheritViewBox />
                        </Button>
                      )}

                      <Typography variant="h6" gutterBottom component="div">
                        <b>Finalizar Visita</b>
                      </Typography>
                    </Stack>
                  </Grid>
                </>
              )}
            </Container>
          </Box>
          {/* MODAL FINALIZAR VISITA */}
          <Modal
            open={openModalFinalizar}
            onClose={(_, reason) => {
              if (reason !== "backdropClick") {
                handleModalFinalizar();
              }
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="modal-finalizar-pilar">
              <Grid container spacing={1}>
                <Grid item xs={12} sx={{ textAlign: "center", minHeight: 125 }}>
                  <Typography variant="h3" sx={{ color: "black" }}>
                    <b>
                      Completaste
                      <br /> la Visita
                    </b>
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "center", mt: 3 }}>
                  <Stack className={"align-center puntaje-modal-pilar"}>
                    <Box className={colorPuntaje}>
                      <Circle />
                      <span className="">
                        {/* Validamos si es entero o decimal para mostrarlo con el decimal truncado */}
                        {puntajePorcentaje % 1 === 0
                          ? puntajePorcentaje
                          : puntajePorcentaje.toFixed(1)}
                      </span>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "center", mt: 3 }}>
                  <Button
                    className="btn-continuar"
                    onClick={() => navigate("/proximaruta")}
                  >
                    Continuar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Modal>
        </>
      )}
    </>
  );
};

export default Pilares;
