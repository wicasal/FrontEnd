import React, { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import FormControl from "@mui/material/FormControl";
import { FilledInput, InputLabel } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import "moment/locale/es";
import axios from "axios";
import PropTypes from "prop-types";
import API from "../../configFiles/API/api";

/**
 * Componente del formulario de historial de visita.
 * Aqui se selecciona el rango de fechas a buscar en las visitas del colaborador para esa tienda
 *
 * Servicios utilizados:
 *
 * - /Ruta/GetVisitas: Para obtener el listado de visitas del dt.
 */
const FormHistorial = (props) => {
  let idTienda = props.idTienda;
  let handleMostrarTabla = props.handleMostrarTabla;
  let setMostrarTabla = props.setMostrarTabla;

  const url = API.url;

  const [fechaInicioState, setFechaInicioState] = useState(new Date());
  const [fechaFinState, setFechaFinState] = useState(new Date());
  const [loader, setLoader] = useState(false);
  const [tipoConsulta, setTipoConsulta] = useState([]);
  const [errorTipoConsulta, setErrorTipoConsulta] = useState(false);

  // react-hook-form hook
  const metodosForm = useForm();

  // Renders para el datepicker
  const renderInputFechaInicio = (props) => (
    <FormControl variant="filled" className="inputFill">
      <InputLabel>Fecha Inicio</InputLabel>
      <FilledInput
        type="text"
        inputRef={props.inputRef}
        inputProps={props.inputProps}
        value={props.value}
        onClick={props.onClick}
        onChange={props.onChange}
        endAdornment={props.InputProps?.endAdornment}
      />
    </FormControl>
  );

  const renderInputFechaFin = (props) => (
    <FormControl variant="filled" className="inputFill">
      <InputLabel>Fecha Fin</InputLabel>
      <FilledInput
        type="text"
        inputRef={props.inputRef}
        inputProps={props.inputProps}
        value={props.value}
        onClick={props.onClick}
        onChange={props.onChange}
        endAdornment={props.InputProps?.endAdornment}
      />
    </FormControl>
  );

  const tiposConsultas = [
    "Mis visitas",
    "Visitas RRHH",
    "Visitas Comercial",
    "Visitas Operaciones",
  ];

  const dictConsultas = {
    "Mis visitas": "0",
    "Visitas RRHH": "3DE362AD-A6D3-4AED-804B-1868AB5E8954",
    "Visitas Comercial": "DAFCF999-4DFA-4025-BA4C-E9AB95399CC3",
    "Visitas Operaciones": "6F077AE4-91BF-4F5A-BA7F-E1DB790428DC",
  };

  const handleChange = (event) => {
    setErrorTipoConsulta(false);

    const {
      target: { value },
    } = event;
    setTipoConsulta(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const onSubmit = () => {
    setMostrarTabla(-1);
    let fechaInicio = moment(fechaInicioState).format("YYYY-MM-DD");
    // let fechaInicio = "2022-01-01";
    let fechaFin = moment(fechaFinState).format("YYYY-MM-DD");
    // let fechaFin = "2022-12-31";
    let idEncargado = localStorage.getItem("user_id");

    if (tipoConsulta.length <= 0) {
      setErrorTipoConsulta(true);
      return;
    } else {
      setErrorTipoConsulta(false);
    }

    setLoader(true);
    const tipoConsultaJson = tipoConsulta.map((tipo) => dictConsultas[tipo]);

    const json = {
      idTienda: String(idTienda),
      idEncargadoVisita: idEncargado,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      tiposConsulta: tipoConsultaJson,
    };

    axios.post(`${url}Ruta/GetVisitas`, json).then((res) => {
      let visitasAux = [];
      res.data.forEach((visita) => {
        visitasAux.push({
          tipo: visita.tipoVisita,
          fecha: moment(visita.fechaFinalizaVisita).format("DD-MM-YYYY"),
          hora: visita.horaFinalizaVisita,
          resultado: visita.promedioTienda.toFixed(1),
          idRutaVisitaDetalle: visita.idRutaVisitaDetalle,
        });
      });
      setLoader(false);
      handleMostrarTabla(visitasAux);
    });
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <form onSubmit={metodosForm.handleSubmit(onSubmit)}>
        <Stack
          direction="row"
          spacing={5}
          justifyContent="center"
          alignItems="center"
        >
          <div>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name={`fechaInicio`}
                control={metodosForm.control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    disableFuture
                    inputFormat="DD/MM/YYYY"
                    onChange={(e) => {
                      setFechaInicioState(e);
                    }}
                    value={fechaInicioState}
                    renderInput={renderInputFechaInicio}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Controller
                name={`fechaFin`}
                control={metodosForm.control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    disableFuture
                    inputFormat="DD/MM/YYYY"
                    onChange={(e) => {
                      setFechaFinState(e);
                    }}
                    value={fechaFinState}
                    renderInput={renderInputFechaFin}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
          <div>
            <FormControl
              className="inputFill"
              variant="filled"
              sx={{ m: 1, width: 300, textAlign: "left" }}
            >
              <InputLabel id="demo-multiple-checkbox-label">
                Tipo de consulta
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={tipoConsulta}
                onChange={handleChange}
                renderValue={(selected) => selected.join(", ")}
              >
                {tiposConsultas.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={tipoConsulta.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <Button
              variant="contained"
              className="btn btn-submit-pilar"
              type="submit"
              disabled={fechaFinState < fechaInicioState}
            >
              <SearchIcon fontSize="large" />
            </Button>
          </div>
        </Stack>
        {fechaFinState < fechaInicioState && (
          <Typography
            variant="subtitle2"
            className="error-msg"
            sx={{ textAlign: "center", mt: 1 }}
          >
            La fecha de fin debe ser menor que la de inicio
          </Typography>
        )}
        {errorTipoConsulta && (
          <Typography
            variant="subtitle2"
            className="error-msg"
            sx={{ textAlign: "center", mt: 1 }}
          >
            Debe escoger un tipo de consulta
          </Typography>
        )}
        {loader ? (
          <Grid item xs={12} sx={{ textAlign: "center", mt: 5 }}>
            <CircularProgress />
          </Grid>
        ) : (
          ""
        )}
      </form>
    </Box>
  );
};

FormHistorial.propTypes = {
  /** funcion que controla si se muestra la tabla con los resultados  */
  handleMostrarTabla: PropTypes.func.isRequired,
  /** id de la tienda */
  idTienda: PropTypes.number.isRequired,
};

export default FormHistorial;
