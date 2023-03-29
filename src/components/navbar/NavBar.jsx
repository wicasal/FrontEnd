import React, { useEffect } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useState } from "react";
import { useLocation, Link } from "react-router-dom";

// Iconos
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as Icon1 } from "../../assets/images/iconos-navbar/Icono-home-1.svg";
import { ReactComponent as Icon2 } from "../../assets/images/iconos-navbar/Icono-home-2.svg";
import { ReactComponent as Icon3 } from "../../assets/images/iconos-navbar/Icono-home-3.svg";
import { ReactComponent as Icon4 } from "../../assets/images/iconos-navbar/Icono-home-4.svg";
import { ReactComponent as Icon5 } from "../../assets/images/iconos-navbar/Icono-home-5.svg";
import { ReactComponent as Icon6 } from "../../assets/images/iconos-navbar/Icono-home-6.svg";

/**
 * Componente principal de la barra de navegación.
 *
 * Se utilizan elementos de la libreria grafica MaterialUI para el correcto funcionamiento
 */

const NavBar = () => {
  const [value, setValue] = useState(0);
  let location = useLocation();

  useEffect(() => {
    // Si estamos en el login, no mostrar el navbar
    if (location.pathname === "/login") {
      return false;
    }
  }, [location]);

  return (
    <div className="navbar">
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          component={Link}
          to="/"
          icon={<SvgIcon component={Icon1} inheritViewBox />}
        />
        <a
          rel="noopener noreferrer"
          href={"https://sites.google.com/realproperties.com.co/secuoya"}
          target="_blank"
        >
          <BottomNavigationAction
            sx={{ pt: 2.5, width: 100 }}
            icon={<SvgIcon component={Icon2} inheritViewBox />}
          />
        </a>
        <a
          rel="noopener noreferrer"
          href={"https://drive.google.com/drive/u/0/priority"}
          target="_blank"
        >
          <BottomNavigationAction
            sx={{ pt: 2.5, width: 100 }}
            icon={<SvgIcon component={Icon3} inheritViewBox />}
          />
        </a>
        <BottomNavigationAction
          component={Link}
          to={"/paneldashboards"}
          icon={<SvgIcon component={Icon4} inheritViewBox />}
        />
        <BottomNavigationAction
          component={Link}
          to="/landingcalendario"
          icon={<SvgIcon component={Icon5} inheritViewBox />}
        />
        <a
          rel="noopener noreferrer"
          href={"https://texmoda.com.co:8402/"}
          target="_blank"
        >
          <BottomNavigationAction
            sx={{ pt: 2.5, width: 100 }}
            icon={<SvgIcon component={Icon6} inheritViewBox />}
          />
        </a>
      </BottomNavigation>
    </div>
  );
};

export default NavBar;
