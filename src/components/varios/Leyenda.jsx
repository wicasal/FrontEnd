import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/**
 *
 * Componente que muestra la leyenda en las vista de Pilar y Evaluacion de Gestión de tienda
 */
const Leyenda = () => {
  return (
    <div>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h7">
            <b>Escala de Calificación de Objetivos</b>
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{pt:0}}>
          <div className="div-leyenda">
            <span>
              <div className="box-numero rojo">1</div> No cumple con este
              objetivo, o no vive este comportamiento
            </span>
            <span>
              <div className="box-numero naranja">2</div> En ocasiones cumple este objetivo, o vive comportamiento
            </span>
            <span>
              <div className="box-numero verde">3</div> Siempre cumple este objetivo, o en todo momento vive el comportamiento{" "}
            </span>
            <span>
              <div className="box-numero azul">4</div> Es ejemplo, modelo y
              forma a otros en este objetivo o comportamiento
            </span>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Leyenda;
