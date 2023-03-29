import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

const Calendario = () => {
  var today = new Date();
  var y = today.getFullYear();
  var m = today.getMonth();
  var d = today.getDate();

  const EventData = [
    {
      title: "Twice event For two Days",
      allDay: false,
      start: new Date(y, m, 3),
      end: new Date(y, m, 5),
      color: "default",
    },
    {
      title: "Learn ReactJs",
      start: new Date(y, m, d + 3, 10, 30),
      end: new Date(y, m, d + 3, 11, 30),
      allDay: false,
      color: "green",
    },
    {
      title: "Launching MaterialArt Angular",
      start: new Date(y, m, d + 7, 12, 0),
      end: new Date(y, m, d + 7, 14, 0),
      allDay: false,
      color: "red",
    },
    {
      title: "Lunch with Mr.Rau",
      start: new Date(y, m, d - 2, 12, 0),
      end: new Date(y, m, d - 2, 13, 0),
      allDay: false,
      color: "azure",
    },
    {
      title: "Lunch with Mr.Benito",
      start: new Date(y, m, d - 2, 15, 30),
      end: new Date(y, m, d - 2, 16, 30),
      allDay: false,
      color: "azure",
    },
    {
      title: "Lunch with Mr.Daddy",
      start: new Date(y, m, d - 2, 20, 0),
      end: new Date(y, m, d - 2, 20, 45),
      allDay: false,
      color: "azure",
    },
    {
      title: "Lunch with Mr.Jhay",
      start: new Date(y, m, d - 2, 21, 0),
      end: new Date(y, m, d - 2, 23, 0),
      allDay: false,
      color: "azure",
    },
    {
      title: "Visita: Zara Home",
      start: new Date(y, m, d - 1, 12, 0),
      end: new Date(y, m, d - 1, 13, 0),
      allDay: false,
      color: "azure",
    },
    {
      title: "Going For Party of Sahs",
      start: new Date(y, m, d + 1, 19, 0),
      end: new Date(y, m, d + 1, 22, 30),
      allDay: false,
      color: "azure",
    },
    {
      title: "Learn Ionic",
      start: new Date(y, m, 23),
      end: new Date(y, m, 25),
      color: "orange",
      allDay: false,
    },
    {
      title: "Research of making own Browser",
      start: new Date(y, m, 19),
      end: new Date(y, m, 22),
      color: "default",
      allDay: false,
    },
  ];

  const [calevents] = useState(EventData);

  const localizer = momentLocalizer(moment);

  return (
    <>
      <Container maxWidth="lg" className="texto-blanco" sx={{ pt: 5 }}>
        <Grid container>
          <Grid
            item
            xs={6}
            sx={{ textAlign: "left", pt: 1 }}
            className="btn-regresar"
          >
            <Link to="/landingcalendario">
              <ArrowBackIosNewIcon />
              <span>Regresar</span>
            </Link>
          </Grid>
          <Grid item xs={6} className="titulo-template-indicadores">
            <Typography variant="h4">Calendario</Typography>
          </Grid>
        </Grid>
      </Container>
      <Box
        sx={{
          backgroundColor: "transparent",
          mt: 5,
          mx: 10,
          p: 3,
          height: "71vh",
          borderRadius: 2,
        }}
      >
        <Calendar
          localizer={localizer}
          events={calevents}
          startAccessor="start"
          endAccessor="end"
          // views={["month","agenda"]}
          messages={{
            week: "Semana",
            work_week: "Work Week",
            allDay: "Todo el día",
            day: "Dia",
            month: "Mes",
            previous: "<",
            next: ">",
            yesterday: "Ayer",
            tomorrow: "Mañana",
            today: "Hoy",
            agenda: "Agenda",
            noEventsInRange: "There are no events in this range.",

            showMore: (total) => `+${total} más`,
          }}
        />
      </Box>
    </>
  );
};

export default Calendario;
