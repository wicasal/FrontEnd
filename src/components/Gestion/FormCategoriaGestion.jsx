import React, { useState, useEffect, useContext } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import ListSubheader from "@mui/material/ListSubheader";
import Modal from "@mui/material/Modal";
import ErrorIcon from "@mui/icons-material/Error";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { InputLabel } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import API from "../../configFiles/API/api";
import { ReactComponent as IconoFinalizar } from "../../assets/images/iconos-pilares/Icono-finalizar.svg";
import { TiendaContext } from "../../context/TiendaContext";

/**
 * Componente que renderiza el formulario de la evauaclion de tienda. Se muestra el formulario con sus categorias para ser evaluadas y se envia.
 *
 * Servicios utilizados:
 * - /Macroproceso: Para obtener los macroprocesos.
 * - /GestionTienda/GestionTiendaEvaluacion: Para enviar la respuesta de la gestion de tienda
 */
const FormCategoriaGestion = (props) => {
  const url = API.url;
  const navigate = useNavigate();

  let categoriasPreguntas = props.categoriasPreguntas;
  let tipoGestion = props.tipoGestion;

  // definimos los estados del contexto que vamos a utilizar
  const { tiendaContext, responsableVisitaContext } = useContext(TiendaContext);

  const [manejadorCategoria, setManejadorCategoria] = useState({});
  const [listaPreguntas, setListaPreguntas] = useState([]);
  const [listaProcesos, setListaProcesos] = useState([]);
  const [mostrarSpinner, setMostrarSpinner] = useState(false);
  const [dataForm, setDataForm] = useState({});

  // Para controlar el modal de confirmacion
  const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false);
  const handleModalConfirmacion = () =>
    setOpenModalConfirmacion((prevState) => !prevState);

  // Para controlar el modal de finalizar
  const [openModalFinalizar, setOpenModalFinalizar] = useState(false);
  const handleModalFinalizar = () =>
    setOpenModalFinalizar((prevState) => !prevState);

  // Definimos la validacion de los campos del formulario
  const validationSchema = Yup.object().shape({
    preguntas: Yup.array().of(
      Yup.object().shape({
        calificacion: Yup.string().required("Califiación requerida"),
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

  useEffect(() => {
    let mounted = false;
    if (mounted) return;

    remove();
    let contadorPreguntas = 0;
    categoriasPreguntas.forEach((element) => {
      element.preguntas.forEach((pregunta) => {
        append({
          calificacion: "",
          observacion: "",
          macroproceso: "",
          id: pregunta.id,
          id_categoria: element.id,
        });
        setListaPreguntas((prevState) => [...prevState, pregunta.descripcion]);
      });
      let aux = manejadorCategoria;
      aux[contadorPreguntas] = element.nombre;
      contadorPreguntas += element.preguntas.length;
      setManejadorCategoria(aux);
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

    return () => {
      mounted = true;
    };
  }, [append, remove, manejadorCategoria, url, categoriasPreguntas]);

  const onSubmit = (data) => {
    setDataForm(data);
    handleModalConfirmacion();
  };

  const enviarDatos = () => {
    setMostrarSpinner(true);

    let arrayData = [];
    let jsonAuxCategoria = {};
    let arrayDataPreguntas = [];
    let jsonAuxPregunta = {};

    // Construimos el json de respuesta
    categoriasPreguntas.forEach((element) => {
      jsonAuxCategoria = {};
      jsonAuxCategoria = {
        idGestionTienda: element.id,
        idColaborador: responsableVisitaContext.id,
        idRutaVisitaDetalle: tiendaContext.idRutaVisitaDetalle,
      };

      element.preguntas.forEach((pregunta) => {
        let preguntaRespuesta = dataForm.preguntas.find(
          (o) => o.id === pregunta.id
        );
        jsonAuxPregunta = {};
        jsonAuxPregunta["idGestionTiendaDetalle"] = preguntaRespuesta.id;
        jsonAuxPregunta["calificacion"] = 4;
        jsonAuxPregunta["isCheck"] =
          preguntaRespuesta.calificacion === "1" ? true : false;
        jsonAuxPregunta["observacion"] = preguntaRespuesta.observacion;
        jsonAuxPregunta["macroprocesoresponsable"] =
          preguntaRespuesta.macroproceso;
        arrayDataPreguntas.push(jsonAuxPregunta);
      });
      jsonAuxCategoria["gestionTiendaDetalleEvaluacions"] = arrayDataPreguntas;
      arrayDataPreguntas = [];
      arrayData.push(jsonAuxCategoria);
    });


    // Enviamos al respuesta
    axios
      .post(`${url}GestionTienda/GestionTiendaEvaluacion`, arrayData)
      .then((res) => {
        handleModalConfirmacion();
        handleModalFinalizar();
      });
  };

  return (
    <>
      <form onSubmit={metodosForm.handleSubmit(onSubmit)}>
        <ul>
          {fields.map((field, index) => (
            <Box key={`box-${field.id}`}>
              {manejadorCategoria[index] ? (
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 500, mt: 6, ml: -2, pl: 0 }}
                  className="texto-amarillo"
                >
                  <b>{manejadorCategoria[index]}</b>
                </Typography>
              ) : (
                ""
              )}
              <Grid item xs={12} sx={{ my: 3, ml: 0 }}>
                <li>
                  <Typography
                    variant="h6"
                    htmlFor={`preguntas.${index}.calificacion`}
                    key={`label-${field.id}`}
                    className="label-categoria"
                    sx={{ ml: 1 }}
                  >
                    {"     " + listaPreguntas[index]}
                  </Typography>
                </li>
                {/* Radio buttons */}
                <Grid item xs={12}>
                  <FormControl>
                    <Controller
                      name={`preguntas.${index}.calificacion`}
                      defaultValue={""}
                      control={metodosForm.control}
                      render={({ field: { onChange, value, name } }) => (
                        <RadioGroup
                          name={name}
                          row
                          aria-labelledby={`preguntas.${index}.calificacion`}
                          onChange={onChange}
                        >
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="Si cumple"
                            className="pilar-radio"
                          />
                          <FormControlLabel
                            value="0"
                            control={<Radio />}
                            label="No cumple"
                            className="pilar-radio"
                          />
                        </RadioGroup>
                      )}
                    />
                    {metodosForm.formState.errors.preguntas?.[index]
                      ?.calificacion && (
                      <Typography variant="subtitle2" className="error-msg">
                        {
                          metodosForm.formState.errors.preguntas?.[index]
                            ?.calificacion?.message
                        }
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                {/* observacion */}
                <Grid item xs={12} sx={{ my: 2 }}>
                  <Controller
                    name={`preguntas.${index}.observacion`}
                    control={metodosForm.control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        placeholder="Realiza tu Observación (Opcional)"
                      />
                    )}
                  />
                  {metodosForm.formState.errors.preguntas?.[index]
                    ?.observacion && (
                    <Typography variant="subtitle2" className="error-msg">
                      {
                        metodosForm.formState.errors.preguntas?.[index]
                          ?.observacion?.message
                      }
                    </Typography>
                  )}
                </Grid>
                {/* Select microresponsable */}
                <Grid item xs={12} sx={{ my: 2 }}>
                  <FormControl variant="filled" className="inputFill">
                    <InputLabel>Macroproceso Responsable (Opcional)</InputLabel>
                    <Controller
                      control={metodosForm.control}
                      name={`preguntas.${index}.macroproceso`}
                      defaultValue=""
                      render={({ field: { onChange, value } }) => (
                        <Select onChange={onChange} value={value}>
                          {listaProcesos.map((proceso) =>
                            typeof proceso === "string"
                              ? [
                                  <hr />,
                                  <ListSubheader
                                    onClick={() => {}}
                                    className="texto-amarillo"
                                  >
                                    {proceso}
                                  </ListSubheader>,
                                ]
                              : proceso.map((hijo, i) => (
                                  <MenuItem key={i} value={hijo.id}>
                                    {hijo.macroProceso}
                                  </MenuItem>
                                ))
                          )}
                        </Select>
                      )}
                    />
                  </FormControl>
                  {metodosForm.formState.errors.preguntas?.[index]
                    ?.macroproceso && (
                    <Typography variant="subtitle2" className="error-msg">
                      {
                        metodosForm.formState.errors.preguntas?.[index]
                          ?.macroproceso?.message
                      }
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          ))}
        </ul>
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
                  <b>Finalizar Evaluación</b>
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
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  <b>
                    ¿Estás seguro que quieres
                    <br /> Finalizar la Evaluación?
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
                <Button className="btn-finalizar" onClick={() => enviarDatos()}>
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
        {/* Modal de finalizar */}
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
          <Box className="modal-finalizar-gestion">
            <Grid container spacing={1}>
              <Grid item xs={12} sx={{ textAlign: "center", minHeight: 125 }}>
                <Typography variant="h5" sx={{ color: "black" }}>
                  <b>Completaste la Evaluación de Gestión de {tipoGestion}</b>
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center", mt: 0 }}>
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
      </form>
    </>
  );
};

FormCategoriaGestion.propTypes = {
  /** Lista con las catergorias y sus preguntas */
  categoriasPreguntas: PropTypes.array.isRequired,
};

export default FormCategoriaGestion;
