import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import NavBar from "./components/navbar/NavBar";
import Login from "./components/Login/Login";
import Inicio from "./components/Inicio/Inicio";
import LandingCalendario from "./components/Calendario/LandingCalendario";
import PilarTemplate from "./components/Pilar/PilarTemplate";
import NotFound from "./components/Error404/NotFound";
import Pilares from "./components/Pilares/Pilares";
import ProximaRuta from "./components/ProximaRuta/ProximaRuta";
import Gestion from "./components/Gestion/Gestion";
import ResumenPilar from "./components/Pilares/ResumenPilar";
import UltimoPlan from "./components/UltimoPlan/UltimoPlan";
import Historial from "./components/Historial/Historial";
import PanelDashboards from "./components/PanelesDashboards/PanelDashboards";
import Dashboard from "./components/PanelesDashboards/Dashboard";
import ScrollToTop from "./components/varios/ScrollToTop";

const Router = () => {
  return (
    <>
      {/* basename para staging */}
      {/* SE DEBE CAMBIAR ESTE BASENAME SEGUN LA RUTA DONDE SE DESPLIEGUE */}
      <BrowserRouter basename="/">
        <ScrollToTop>
          <Routes>
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate replace to="/404" />} />
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/landingcalendario" element={<LandingCalendario />} />
            <Route path="/proximaruta" element={<ProximaRuta />} />
            <Route path="/gestion/:tipo" element={<Gestion />} />
            <Route path="/pilares" element={<Pilares />} />
            <Route path="/pilar/:pilar" element={<PilarTemplate />} />
            <Route path="/resumen/:pilar" element={<ResumenPilar />} />
            <Route path="/paneldashboards" element={<PanelDashboards />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ultimoplan" element={<UltimoPlan />} />
            <Route path="/historial" element={<Historial />} />
          </Routes>
        </ScrollToTop>
        <NavBar />
      </BrowserRouter>
    </>
  );
};

export default Router;
