import React, { useContext } from "react";
import FormControl from "@mui/material/FormControl";
import { InputLabel } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import { TiendaContext } from "../../context/TiendaContext";

/**
 * Componente que maneja el formulario que contiene el dropdown para cambiar de dashboards en el panel.
 *
 */
const FormDashboard = (props) => {
  const changeDataStudioUrl = props.changeDataStudioUrl;

  const { listaDashboardsContext } = useContext(TiendaContext);

  const onChangeSelect = (e) => {
    changeDataStudioUrl(e.target.value);
  };

  return (
    <>
      <FormControl variant="filled" className="inputFill">
        <InputLabel>Lista Dashboards</InputLabel>
        <Select
          defaultValue={""}
          onChange={(e) => {
            onChangeSelect(e);
          }}
        >
          {listaDashboardsContext.map((prop, key) => (
            <MenuItem key={key} value={prop.rutaUrl}>
              {prop.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

FormDashboard.propTypes = {
  /** Funcion que permite cambiar la url del iframe para mostrar el dashboard */
  changeDataStudioUrl: PropTypes.func.isRequired,
};

export default FormDashboard;
