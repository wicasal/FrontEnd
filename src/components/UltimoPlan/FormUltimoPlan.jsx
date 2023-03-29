import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import SvgIcon from "@mui/material/SvgIcon";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Modal from "@mui/material/Modal";
import ErrorIcon from "@mui/icons-material/Error";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import API from "../../configFiles/API/api";
import { ReactComponent as IconoFinalizar } from "../../assets/images/iconos-pilares/Icono-finalizar.svg";

/**
 * Componente que maneja el formulario del Ultimo plan de acción.
 *
 * En este componente se completa la evaluación del último plan de acción.
 *
 * Servicios utilizados:
 * - /Pilar/FinalizarPlanAccion: Para enviar al back la evaluación de los planes de acción.
 *
 */
const FormUltimoPlan = (props) => {
  const url = API.url;
  const navigate = useNavigate();

  const pilares = props.pilares;

  const [listaPreguntas, setListaPreguntas] = useState([]);
  const [manejadorPilar, setmanejadorPilar] = useState({});

  const [dataForm, setDataForm] = useState({});
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

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
        calificacion: Yup.string().required("Seleccione una opción"),
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

    pilares.forEach((element) => {
      element.preguntas.forEach((pregunta) => {
        append({
          calificacion: "",
          id: pregunta.id,
          idPilarEvaluacion: pregunta.idPilarEvaluacion,
          idRutaVisitaDetalle: pregunta.idRutaVisitaDetalle,
        });
        setListaPreguntas((prevState) => [...prevState, pregunta]);
      });
      let aux = manejadorPilar;
      aux[contadorPreguntas] = element.nombre;
      contadorPreguntas += element.preguntas.length;
      setmanejadorPilar(aux);
    });

    return () => {
      mounted = true;
    };
  }, [append, manejadorPilar, pilares, remove]);

  const onSubmit = (data) => {
    setDataForm(data);
    handleModalConfirmacion();
  };

  const enviarDatos = () => {
    setMostrarSpinner(true);

    let datos = [];
    dataForm["preguntas"].forEach((elemento) => {
      let json = {
        idPilarEvaluacion: elemento.idPilarEvaluacion,
        idPilarDetalleSeguimiento: elemento.id,
        calificacion: elemento.calificacion,
        idRutaVisitaDetalle: elemento.idRutaVisitaDetalle,
      };
      datos.push(json);
    });

    axios.put(`${url}Pilar/FinalizarPlanAccion`, datos).then((res) => {
      handleModalConfirmacion();
      handleModalFinalizar();
    });
  };

  return (
    <form onSubmit={metodosForm.handleSubmit(onSubmit)}>
      <ul>
        {fields.map((field, index) => (
          <Box key={`box-${field.id}`}>
            {manejadorPilar[index] ? (
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, mt: 4, ml: -2, pl: 0 }}
                className="texto-amarillo"
              >
                <b>{manejadorPilar[index]}</b>
              </Typography>
            ) : (
              ""
            )}
            <Grid item xs={12} sx={{ my: 3, ml: -2 }}>
              <Grid container sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography
                    variant="body1"
                    className="label-categoria texto-amarillo"
                  >
                    <b>Fecha de Compromiso:</b>
                  </Typography>
                  <Typography variant="body1" color="white">
                    {listaPreguntas[index].fecha}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body1"
                    className="label-categoria texto-amarillo"
                  >
                    <b>Macroproceso Responsable:</b>
                  </Typography>
                  <Typography variant="body1" className="label-categoria">
                    {listaPreguntas[index].macroproceso}
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ mt: 3 }}>
                  <Typography
                    variant="body1"
                    className="label-categoria texto-amarillo"
                  >
                    <b>Plan de Acción:</b>
                  </Typography>
                  <Typography variant="body1" className="label-categoria">
                    {listaPreguntas[index].planAccion}
                  </Typography>
                </Grid>
              </Grid>
              {/* Radio buttons */}
              <Grid item xs={12} sx={{ mt: 3, mb: 1 }}>
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
                          label="Si"
                          className="pilar-radio"
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="No"
                          className="pilar-radio"
                        />
                        <FormControlLabel
                          value="-1"
                          control={<Radio />}
                          label="N/A"
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
              <hr />
            </Grid>
          </Box>
        ))}{" "}
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
                <b>Finalizar Último Plan de Acción</b>
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
                  <br /> finalizar el Último Plan de Acción?
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
                <b>Completaste el Último Plan de Acción</b>
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center", mt: 0 }}>
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
    </form>
  );
};

FormUltimoPlan.propTypes = {
  /** Lista con los planes de acción por pilar */
  pilares: PropTypes.array.isRequired,
};

export default FormUltimoPlan;
