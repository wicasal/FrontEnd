import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import ListSubheader from "@mui/material/ListSubheader";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import moment from "moment";
import "moment/locale/es";
import PropTypes from "prop-types";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FilledInput, InputLabel } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useFormContext, Controller } from "react-hook-form";

/**
 * Componente que renderiza cada una de las preguntas del formulario.
 *
 * Maneja un estado propio para cada una de ellas, el cual nos permite mostrar las opciones correspondientes segun la
 * respuesta del usuario.
 */

const PreguntaTemplate = (props) => {
  let pregunta = props.pregunta;
  let id = props.id;
  let listaProcesos = props.listaProcesos;
  const [radioValue, setRadioValue] = useState("0");

  // const [responsable, setResponsable] = useState("");
  const [archivos, setArchivos] = useState([]);

  moment.locale("es");

  // Definimos el formContext
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Render para el datepicker
  const renderInput = (props) => (
    <FormControl variant="filled" className="inputFill">
      <InputLabel>Fecha de Compromiso</InputLabel>
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

  // Funciones para manejar los achivos
  const onChangeFiles = (e) => {
    let files = e.target.files;
    let filesArr = Array.prototype.slice.call(files);
    setArchivos(filesArr);
  };

  const styles = {
    textAlign: "center",
    display: "flex",
  };

  return (
    <>
      <Grid container>
        {/* Titulo de la pregunta */}
        <Grid item xs={12}>
          <ul>
            <li>
              <Typography
                variant="body1"
                sx={{ pl: 1, mt: 4, fontWeight: 500 }}
              >
                {pregunta.descripcion}
              </Typography>
            </li>
          </ul>
        </Grid>
        {/* INPUT HIDDEN QUE MANEJA EL ID DE LA PREGUNTA */}
        <input type="hidden" name="preguntaId" value={id}></input>

        {/* Radio buttoms */}
        <Grid item xs={12}>
          <FormControl>
            <Controller
              name={`preguntas.${id}.calificacion`}
              control={control}
              render={({ field: { onChange, value, name } }) => (
                <RadioGroup
                  name={name}
                  row
                  defaultValue={""}
                  aria-labelledby={`preguntas.${id}.calificacion`}
                  onChange={onChange}
                >
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="1"
                    className="pilar-radio"
                    onChange={(e) => setRadioValue(e.target.value)}
                  />
                  <FormControlLabel
                    onChange={(e) => setRadioValue(e.target.value)}
                    value="2"
                    control={<Radio />}
                    label="2"
                    className="pilar-radio"
                  />
                  <FormControlLabel
                    onChange={(e) => setRadioValue(e.target.value)}
                    value="3"
                    control={<Radio />}
                    label="3"
                    className="pilar-radio"
                  />
                  <FormControlLabel
                    onChange={(e) => setRadioValue(e.target.value)}
                    value="4"
                    control={<Radio />}
                    label="4"
                    className="pilar-radio"
                  />
                  <FormControlLabel
                    onChange={(e) => setRadioValue(e.target.value)}
                    value=""
                    control={<Radio />}
                    label="N/A"
                    className="pilar-radio"
                  />
                </RadioGroup>
              )}
            />
            {errors.preguntas?.[id]?.calificacion && (
              <Typography variant="subtitle2" className="error-msg">
                {errors.preguntas?.[id]?.calificacion?.message}
              </Typography>
            )}
          </FormControl>
        </Grid>
        {/* observacion */}
        <Grid item xs={12} sx={{ my: 2 }}>
          <Controller
            name={`preguntas.${id}.observacion`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                multiline
                rows={4}
                placeholder="Realiza tu observación"
              />
            )}
          />
          {errors.preguntas?.[id]?.observacion && (
            <Typography variant="subtitle2" className="error-msg">
              {errors.preguntas?.[id]?.observacion?.message}
            </Typography>
          )}
        </Grid>
        {(radioValue === "1" || radioValue === "2") && (
          <>
            <Grid container spacing={2}>
              {/* Datepicker fecha de compromiso */}
              <Grid item xs={12} sm={6} sx={{ my: 2 }}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <Controller
                    name={`preguntas.${id}.fecha`}
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        disablePast
                        inputFormat="DD/MM/YYYY"
                        onChange={onChange}
                        value={value}
                        renderInput={renderInput}
                      />
                    )}
                  />
                </LocalizationProvider>
                {errors.preguntas?.[id]?.fecha && (
                  <Typography variant="subtitle2" className="error-msg">
                    {errors.preguntas?.[id]?.fecha?.message}
                  </Typography>
                )}
              </Grid>
              {/* Select microresponsable */}
              <Grid item xs={12} sm={6} sx={{ my: 2 }}>
                <FormControl variant="filled" className="inputFill">
                  <InputLabel>Macroproceso Responsable</InputLabel>
                  <Controller
                    control={control}
                    name={`preguntas.${id}.macroproceso`}
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
                {errors.preguntas?.[id]?.macroproceso && (
                  <Typography variant="subtitle2" className="error-msg">
                    {errors.preguntas?.[id]?.macroproceso?.message}
                  </Typography>
                )}
              </Grid>
            </Grid>
            {/* plan de accion */}
            <Grid item xs={12} sx={{ my: 2 }}>
              <Controller
                name={`preguntas[${id}].planAccion`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    multiline
                    rows={4}
                    placeholder="Escribe un plan de acción"
                  />
                )}
              />
              {errors.preguntas?.[id]?.planAccion && (
                <Typography variant="subtitle2" className="error-msg">
                  {errors.preguntas?.[id]?.planAccion?.message}
                </Typography>
              )}
            </Grid>
          </>
        )}
        {/* Archivo */}
        <Grid item xs={12} sx={{ my: 2, display: "none" }}>
          <Box style={styles} className="inputFill">
            <label className="custom-file-upload">
              <Controller
                control={control}
                name={`preguntas[${id}].archivo`}
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
                <Box className="nombre-archivo">
                  <img
                    id="imagenPrevisualizacion"
                    src={URL.createObjectURL(x)}
                    alt={x.name}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

PreguntaTemplate.propTypes = {
  /** pregunta a ser evaluada  */
  pregunta: PropTypes.object.isRequired,
  /** variable de control del formArray */
  id: PropTypes.number.isRequired,
  /** lista de los macroprocesos responsables obtenidos del API */
  listaProcesos: PropTypes.array.isRequired,
};

export default PreguntaTemplate;
