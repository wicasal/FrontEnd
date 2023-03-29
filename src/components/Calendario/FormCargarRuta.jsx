import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import PropTypes from "prop-types";
import API from "../../configFiles/API/api";

/**
 * Componente que maneja el formulario para cargar el CSV que contiene la ruta del DT.
 *
 * Aqui, el DT puede cargar un archivo de formato CSV que contiene la proxima ruta a cargar en el sistema.
 *
 * Servicios Utilizados:
 * - /Ruta/GestionRuta/CargarArchivo: Se envia el archivo .csv con la ruta
 */

const FormCargarRuta = (props) => {
  const url = API.url;

  let handleCloseModalCargar = props.handleCloseModalCargar;

  const [archivos, setArchivos] = useState([]);
  const [mensajeModal, setMensajeModal] = useState({});
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  // Para controlar el modal de finalizar
  const [openModalFinalizar, setOpenModalFinalizar] = useState(false);
  const handleModalFinalizar = () =>
    setOpenModalFinalizar((prevState) => !prevState);

  // Definimos la validacion de los campos del formulario
  const validationSchema = Yup.object().shape({
    archivo: Yup.string().required("Archivo requerido"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  // react-hook-form hook
  const metodosForm = useForm(formOptions);

  // Funciones para manejar los achivos
  const onChangeFiles = (e) => {
    let files = e.target.files;
    let filesArr = Array.prototype.slice.call(files);
    setArchivos(filesArr);
  };

  const onSubmit = async (data) => {
    setMostrarSpinner(true);
    const formData = new FormData();
    formData.append("archivo", archivos[0]);

    axios
      .post(`${url}Ruta/GestionRuta/CargarArchivo`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        setMensajeModal({
          boton: "Continuar",
          mensaje: "Archivo cargado correctamente",
        });
        handleModalFinalizar();
      })
      .catch((err) => {
        setMensajeModal({
          boton: "Reintentar",
          mensaje: "Hubo un error cargando el archivo",
        });
        handleModalFinalizar();
      });
  };

  return (
    <>
      <form onSubmit={metodosForm.handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ textAlign: "left", mt: 2, mb: 1 }}>
            <Typography variant="body1">
              <b>Cargar Ruta</b>
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ my: 2 }}>
            <Box
              sx={{ textAlign: "center", display: "flex" }}
              className="inputFill"
            >
              <label className="custom-file-upload">
                <Controller
                  control={metodosForm.control}
                  name={`archivo`}
                  render={({ field, fieldState }) => (
                    <div>
                      <input
                        id="archivos"
                        type="file"
                        onChange={(event) => {
                          onChangeFiles(event);
                          field.onChange(event.target.files);
                        }}
                      />
                    </div>
                  )}
                />
                <CloudUploadIcon fontSize="small" /> <br />
                <span>Subir Archivo</span>
              </label>
              {archivos.map((x, index) => (
                <Box key={index} className="file-preview">
                  <Box className="nombre-archivo">{x.name}</Box>
                </Box>
              ))}
            </Box>
            {metodosForm.formState.errors.archivo && (
              <Typography
                variant="subtitle2"
                className="error-msg"
                sx={{ mt: 1 }}
              >
                {metodosForm.formState.errors.archivo.message}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "center", mt: 2 }}>
            <Button
              className="btn-cancelar"
              onClick={() => handleCloseModalCargar()}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "center", mt: 2 }}>
            <Button className="btn-finalizar" type="submit">
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
      </form>
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
        <Box className="modal-finalizar-subir-archivo">
          <Grid container spacing={1} sx={{ pt: 10 }}>
            <Grid item xs={12} sx={{ textAlign: "center", minHeight: 95 }}>
              <Typography variant="h5" sx={{ color: "black" }}>
                <b>{mensajeModal.mensaje}</b>
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center", mt: 0 }}>
              <Button
                className="btn-continuar"
                onClick={() => handleCloseModalCargar()}
              >
                {mensajeModal.boton}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

FormCargarRuta.propTypes = {
  /** Funcion que oculta el modal de cargar ruta */
  handleCloseModalCargar: PropTypes.func.isRequired,
};

export default FormCargarRuta;
