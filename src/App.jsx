import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Router from "./Router";
import Intro from "./components/Intro/Intro";
import { TiendaProvider } from "./context/TiendaContext";

/**
 * Componente raiz de Vitrix.
 * Muestra primero el componente <Intro/> que es el video y luego carga el <Router/>.
 */
function App() {
  // Se debe poner en false en caso que no se quiera mostrar el video del inicio
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntro(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TiendaProvider>
      <Grid className="App">{intro ? <Intro /> : <Router />}</Grid>
    </TiendaProvider>
  );
}

export default App;
