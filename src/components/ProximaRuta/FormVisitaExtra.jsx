import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { TiendaContext } from "../../context/TiendaContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import API from "../../configFiles/API/api";

/**
 * Componente principal del Formulario de Visita extraoficial.
 *
 * Este formulario recibe la respuesta del DT de porque la tienda va a recibir una visita extraordinaria.
 *
 * Servicios utilizados:
 * - /Ruta/CrearVisitaExtraoficial: Para enviar la informacion al back sobre la tienda que sera visitada extraoficialmente
 */
const FormVisitaExtra = (props) => {
  const url = API.url;
  const navigate = useNavigate();

  let tipoVisitaExtraoficial = props.tipoVisitaExtraoficial;
  let handleCloseModalExtraoficial = props.handleCloseModalExtraoficial;
  let tienda = props.tienda;
  let idRuta = props.idRuta;

  // Seteamos los estados del contexto
  const { setTiendaContext } = useContext(TiendaContext);

  // Definimos la validacion de los campos del formulario
  const validationSchema = Yup.object().shape({
    observacion: Yup.string().required("Observación requerida"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  // react-hook-form hook
  const metodosForm = useForm(formOptions);

  const onSubmit = (datos) => {
    let json = {
      idRutaVisita: idRuta,
      idTienda: tienda.id,
      visitaTipo: tipoVisitaExtraoficial,
      observacionSiVisitaExtraoficial: datos.observacion,
    };

    axios.post(`${url}Ruta/CrearVisitaExtraoficial`, json).then((res) => {

      let idRutaVisitaDetalleAux = res.data.idRutaVisitaDetalle;
      let tiendaAux = tienda;
      tiendaAux["idRutaVisitaDetalle"] = idRutaVisitaDetalleAux;
      tiendaAux["idTienda"] = tienda.id;
      setTiendaContext(tiendaAux);
      navigate("/pilares");
    });
  };

  return (
    <>
      <form onSubmit={metodosForm.handleSubmit(onSubmit)}>
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ textAlign: "left", mt: 2, mb: 1 }}>
            <Typography variant="body1">
              <b>
                Situación de la Visita Extraoficial{" "}
                {tipoVisitaExtraoficial ? "Virtual" : "Física"}
              </b>
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ py: 2 }}>
            {/* observacion */}
            <Controller
              name={"observacion"}
              control={metodosForm.control}
              rules={{
                required: true,
              }}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  className="textarea-blanca"
                  multiline
                  rows={4}
                  placeholder="Realiza tu Observación"
                />
              )}
            />
            {metodosForm.formState.errors.observacion && (
              <Typography variant="subtitle2" className="error-msg">
                {metodosForm.formState.errors.observacion.message}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "center" }}>
            <Button
              className="btn-cancelar"
              onClick={() => handleCloseModalExtraoficial()}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "center" }}>
            <Button className="btn-finalizar" type="submit">
              Finalizar
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

FormVisitaExtra.propTypes = {
  /** Indica el tipo de visita extraoficial: virtual o física */
  tipoVisitaExtraoficial: PropTypes.string.isRequired,
  /** funcion para cerrar el modal de visita extraoficial */
  handleCloseModalExtraoficial: PropTypes.func.isRequired,
  /** tienda */
  tienda: PropTypes.object.isRequired,
  /** id de la ruta */
  idRuta: PropTypes.string.isRequired,
};

export default FormVisitaExtra;
