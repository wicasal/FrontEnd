import React, { useState, useEffect, useContext } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import Modal from "@mui/material/Modal";
import ErrorIcon from "@mui/icons-material/Error";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "moment/locale/es";
import axios from "axios";
import PropTypes from "prop-types";
import API from "../../configFiles/API/api";
import PreguntaTemplate from "./PreguntaTemplate";
import { ReactComponent as IconoFinalizar } from "../../assets/images/iconos-pilares/Icono-finalizar.svg";
import { TiendaContext } from "../../context/TiendaContext";
import { ReactComponent as Circle } from "../../assets/images/iconos-pilares/circle.svg";

/**
 * Componente del formulario de pilares.
 *
 * Recibe el nombre del pilar a completar y carga las preguntas en base a eso. Muestra
 * el formulario y envia la respuesta al endpoint correpondiente
 *
 * Servicios utilizados:
 *
 * - /Macroproceso: Para obtener la lista de macroprocesos responsables.
 * - /Pilar/Evaluacion: Para enviar la evaluacion de las preguntas del pilar
 */
const FormPreguntasTemplate = (props) => {
  const url = API.url;
  const pilar = props.pilar;
  const navigate = useNavigate();

  const [listaPreguntas, setListaPreguntas] = useState([]);
  const [pilarDetalles, setPilarDetalles] = useState({});
  const [dataForm, setDataForm] = useState({});
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const [colorPuntaje, setColorPuntaje] = useState("");
  const [puntajePorcentaje, setPuntajePorcentaje] = useState(0);
  const [listaProcesos, setListaProcesos] = useState([]);

  // definimos los estados del contexto que vamos a utilizar
  const { pilaresContext, tiendaContext, responsableVisitaContext } =
    useContext(TiendaContext);

  // Para controlar el modal de confirmacion
  const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false);
  const handleModalConfirmacion = () =>
    setOpenModalConfirmacion((prevState) => !prevState);

  // Para controlar el modal de finalizar
  const [openModalFinalizar, setOpenModalFinalizar] = useState(false);
  const handleModalFinalizar = () =>
    setOpenModalFinalizar((prevState) => !prevState);

  // Para controlar el modal de error
  const [openModalError, setOpenModalError] = useState(false);
  const handleModalError = () => setOpenModalError((prevState) => !prevState);

  // Definimos la validacion de los campos del formulario
  const validationSchema = Yup.object().shape({
    preguntas: Yup.array().of(
      Yup.object().shape({
        calificacion: Yup.string(),
        fecha: Yup.string().when("calificacion", {
          is: (calificacion) => calificacion === "1" || calificacion === "2",
          then: Yup.string().required("Fecha requerida"),
        }),
        macroproceso: Yup.string().when("calificacion", {
          is: (calificacion) => calificacion === "1" || calificacion === "2",
          then: Yup.string().required("Macroproceso responsable requerido"),
        }),
        planAccion: Yup.string().when("calificacion", {
          is: (calificacion) => calificacion === "1" || calificacion === "2",
          then: Yup.string().required("Plan de acción requerido"),
        }),
      })
    ),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // react-hook-form hook
  const metodosForm = useForm(formOptions);
  const { fields, append, remove } = useFieldArray({
    name: "preguntas",
    keyname: "preguntasId",
    control: metodosForm.control,
  });

  const watchFieldArray = metodosForm.watch("preguntas");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  // Protegemos la ruta y solo se puede acceder si hay una tienda guardada en el context
  useEffect(() => {
    if (!tiendaContext.idTienda) {
      navigate("/");
    }
  }, [tiendaContext, navigate]);

  useEffect(() => {
    let mounted = false;
    if (mounted) return;

    setListaPreguntas([]);
    // Seteamos el nombre del pilar
    let nombrePilarAux = pilar;

    //  Seteamos la lista de las preguntas del pilar segun el nombre del pilar y la data almacenada en el context
    remove();
    let pilarAux = pilaresContext.find((o) => o.nombre === nombrePilarAux);
    setPilarDetalles(pilarAux);
    pilarAux.pilarDetalles.map((detalle, i) => {
      append({
        calificacion: "",
        observacion: "",
        fecha: "",
        macroproceso: "",
        planAccion: "",
        id: detalle.id,
      });
      return true;
    });

    // Consultamos la lista de procesos
    axios.get(`${url}Macroproceso`).then((res) => {
      let macroProcesos = res.data;
      let listaProcesos = [];
      for (const key in macroProcesos) {
        if (macroProcesos.hasOwnProperty(key)) {
          listaProcesos.push(key);
          listaProcesos.push(macroProcesos[key]);
        }
      }
      setListaProcesos(listaProcesos);
    });

    setListaPreguntas(pilarAux.pilarDetalles);

    return () => (mounted = true);
  }, [pilar, append, url, pilaresContext, remove]);

  function checkVacio(elemento) {
    return elemento.calificacion !== "";
  }

  // Manejamos el evento submit del formulario
  const onSubmit = (data) => {
    let hayVacio = data.preguntas.some(checkVacio);

    setDataForm(data);

    hayVacio ? handleModalConfirmacion() : handleModalError();
  };

  // Funcion que envia el archivo a la api
  const enviarArchivo = (archivo, token) => {
    return new Promise((resolve, reject) => {
      let myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + token);

      let formdata = new FormData();
      formdata.append("fileData", archivo, archivo.name);

      let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      fetch("https://texmoda.com.co:9003/api/v1/files/load", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          let json = JSON.parse(result);
          let idArchivo = json.data.fileNameSaved;
          resolve(idArchivo);
        })
        .catch((error) => {
          reject();
        });
    });
  };

  // Enviar datos maneja a la funcion enviarArchivo en base a promesasa y luego envia la respuesta al api
  const enviarDatos = async () => {
    // Mostramos el spinner del modal
    setMostrarSpinner(true);

    // Pedimos el tkn para el envio de los archivos
    let tokenArchivos = "";

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Seteamos las credenciales
    let raw = JSON.stringify({
      email: "desarrollo@tac.com.co",
      password: "desarrollo1$",
    });

    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    // Pedimos el token para el api del archivo
    await fetch(
      "https://texmoda.com.co:9003/api/auth/get-token",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        let json = JSON.parse(result);
        tokenArchivos = json.token;
      })
      .catch((error) => {
        console.log("error", error);
      });

    // Enviamos todos los archivos
    let promesasArchivos = [];
    dataForm.preguntas.forEach((pregunta) => {
      if (pregunta.archivo) {
        promesasArchivos.push(
          enviarArchivo(pregunta.archivo[0], tokenArchivos)
        );
      } else {
        promesasArchivos.push(
          new Promise((resolve) => {
            resolve("");
          })
        );
      }
    });

    // Cuando todas las promesas en promesasArchivos se envian ejecutamos esto
    Promise.all(promesasArchivos).then((idArchivos) => {
      //Iteramos de nuevo sobre las preguntas ya con los ID de los archivos
      // Estructura del json a enviar al endpoint
      let jsonData = {
        idPilar: pilarDetalles.id,
        idColaborador: responsableVisitaContext.id,
        idRutaVisitaDetalle: tiendaContext.idRutaVisitaDetalle,
        pilarDetalleEvaluacions: "",
      };

      let pilarDetalleEvaluacion = [];
      let porcentajeSuma = 0;
      let cantidadPreguntasContestadas = 0;

      for (let i = 0; i < dataForm.preguntas.length; i++) {
        if (dataForm.preguntas[i].calificacion !== "") {
          cantidadPreguntasContestadas++;
          let evaluacion = {
            idPilarDetalle: dataForm.preguntas[i].id,
            calificacion: dataForm.preguntas[i].calificacion,
            observacion: dataForm.preguntas[i].observacion
              ? dataForm.preguntas[i].observacion
              : "",
            identificadorArchivo: idArchivos[i],
          };
          if (dataForm.preguntas[i].calificacion < 3) {
            evaluacion.pilarDetalleSeguimientoEvaluacion = {
              fechaCompromiso: moment(dataForm.preguntas[i].fecha).format(
                "YYYY-MM-DD"
              ),
              macroprocesoResponsable: dataForm.preguntas[i].macroproceso,
              planAccion: dataForm.preguntas[i].planAccion,
            };
          }
          pilarDetalleEvaluacion.push(evaluacion);
          porcentajeSuma += parseInt(dataForm.preguntas[i].calificacion);
        }
      }

      jsonData.pilarDetalleEvaluacions = pilarDetalleEvaluacion;
      // seteamos el color del circulo de calificacion y el calificacion
      porcentajeSuma = porcentajeSuma / cantidadPreguntasContestadas;
      setPuntajePorcentaje(porcentajeSuma);
      if (porcentajeSuma >= 1 && porcentajeSuma < 1.9) {
        setColorPuntaje("rojo");
      } else if (porcentajeSuma >= 2 && porcentajeSuma < 2.9) {
        setColorPuntaje("naranja");
      } else if (porcentajeSuma >= 3 && porcentajeSuma < 3.9) {
        setColorPuntaje("verde");
      } else {
        setColorPuntaje("azul");
      }

      axios
        .post(`${url}Pilar/Evaluacion`, jsonData)
        .then((res) => {
          handleModalConfirmacion();
          handleModalFinalizar();
        })
        .catch((error) => console.log("ERROR", error));
    });
  };

  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 500, mt: 3 }}>
        Comienza tu Evaluación, califica del 1 al 4
      </Typography>
      <FormProvider {...metodosForm}>
        <form onSubmit={metodosForm.handleSubmit(onSubmit)}>
          {controlledFields.map((pregunta, key) => (
            <Box key={pregunta.id + key}>
              <PreguntaTemplate
                pregunta={listaPreguntas[key]}
                id={key}
                listaProcesos={listaProcesos}
              />
            </Box>
          ))}
          <Grid container>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Box>
                <Stack direction="column" spacing={1}>
                  <Button
                    variant="contained"
                    className="btn btn-submit-pilar"
                    type="submit"
                  >
                    <SvgIcon component={IconoFinalizar} inheritViewBox />
                  </Button>
                  <Typography variant="h6" gutterBottom component="div">
                    <b>Finalizar Pilar</b>
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          {/* Modal de confirmacion */}
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
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    <b>
                      ¿Estás seguro que quieres
                      <br /> Finalizar el Pilar?
                    </b>
                  </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "center" }}>
                  <Button
                    className="btn-cancelar"
                    onClick={() => handleModalConfirmacion()}
                  >
                    Cancelar
                  </Button>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "center" }}>
                  <Button
                    className="btn-finalizar"
                    onClick={() => enviarDatos()}
                  >
                    Finalizar
                  </Button>
                </Grid>
                {mostrarSpinner ? (
                  <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <CircularProgress />
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>
            </Box>
          </Modal>
          {/* Modal de error */}
          <Modal
            open={openModalError}
            onClose={(_, reason) => {
              if (reason !== "backdropClick") {
                handleModalError();
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
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    <b>
                      Debes calificar al menos una pregunta para finalizar el
                      pilar
                    </b>
                  </Typography>
                </Grid>

                <Grid item xs={6} sx={{ textAlign: "center", ml: 13 }}>
                  <Button
                    className="btn-finalizar"
                    onClick={() => handleModalError()}
                  >
                    Aceptar
                  </Button>
                </Grid>
                {mostrarSpinner ? (
                  <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <CircularProgress />
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>
            </Box>
          </Modal>
        </form>
      </FormProvider>
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
              <Typography variant="h5" sx={{ color: "black" }}>
                <b>Completaste el pilar:</b>
              </Typography>
              <Typography variant="h4">
                <b>{pilarDetalles.nombre}</b>
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
                onClick={() => navigate("/pilares")}
              >
                Continuar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

FormPreguntasTemplate.propTypes = {
  /** Nombre del pilar */
  pilar: PropTypes.string.isRequired,
};

export default FormPreguntasTemplate;
