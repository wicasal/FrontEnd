import React from "react";
import { useState, useRef } from "react";
import SvgIcon from "@mui/material/SvgIcon";
// import { GoogleLogin } from "react-google-login";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../configFiles/API/api";
import { ReactComponent as Logo } from "../../assets/images/Logo-login.svg";
import gcp from "../../configFiles/google/gcp";
import useScript from "../../hooks/useScript";

/**
 * Componente principal del módulo de login.
 *
 * Se utiliza Google Identity Services para la autenticación.
 *
 * Servicios utilizados:
 *
 * - /Colaborador: Para obtener los datos de la posicion del dataStudio del Colaborador.
 */

const Login = () => {
  const url = API.url;
  const client_id = gcp.client_id;
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState(false);
  const [datosAlerta, setDatosAlerta] = useState({
    mensaje: "warning",
    tipo: "",
    titulo: "",
  });
  const [loader, setLoader] = useState(false);

  // Funcion para parsear el token JWT recibido luego de la autenticación con google
  const parseJwt = (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  // Se carga el script de google dinamicamente usando el custom hook useScript

  const googleSignInButton = useRef(null);
  useScript("https://accounts.google.com/gsi/client", () => {
    window.google.accounts.id.initialize({
      client_id: client_id,
      callback: responseGoogle,
    });
    window.google.accounts.id.renderButton(
      googleSignInButton.current,
      { theme: "outline", size: "large", text: "signin_with", width: "250" } // customization attributes
    );
  });

  // Manejamos la respuesta de google. Se setean los datos del colaborador
  const responseGoogle = (resp) => {
    setLoader(true);
    let response = parseJwt(resp.credential);
    let correo = response.email;
    axios.get(`${url}Colaborador?correo=${correo}`).then((res) => {
      localStorage.setItem("datastudio", res.data[0].identificadorDataStudio);
      localStorage.setItem("user", response.email);
      localStorage.setItem("user_id", res.data[0].id);
      localStorage.setItem(
        "name",
        res.data[0].nombre + " " + res.data[0].apellido
      );

      localStorage.setItem("cargo", res.data[0].cargo);
      // 3DE362AD-A6D3-4AED-804B-1868AB5E8954 Recursos Humanos
      // DAFCF999-4DFA-4025-BA4C-E9AB95399CC3 Comercial
      localStorage.setItem("idArea", res.data[0].idArea);

      navigate("/");
    });
  };

  // Mostramos la ayuda cuando el usuaraio hace click en "Necesito ayuda"
  const mostrarAyuda = () => {
    setAlerta(!alerta);
    setDatosAlerta({
      mensaje:
        "Lamentamos que tengas problemas, por favor comentanos tu problema a nuestro correo electronico: ayuda@vitrix.com",
      tipo: "warning",
      titulo: "¿Tienes algún problema al iniciar sesión?",
    });
  };

  return (
    <>
      {/* Logo  */}
      <Grid container>
        <Grid item xs={12} className="div-logo-login">
          <SvgIcon component={Logo} className="logo-login" inheritViewBox />
        </Grid>
      </Grid>
      {/* Google login button */}
      <Grid container>
        <Grid item xs={12} className="google-button-login">
          <div
            style={{ display: "inline-block" }}
            ref={googleSignInButton}
          ></div>
          <p onClick={mostrarAyuda}>¿Necesitas Ayuda?</p>
        </Grid>
      </Grid>
      {loader ? (
        <Grid container>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Grid>
        </Grid>
      ) : (
        ""
      )}
      {alerta ? (
        <Grid container>
          <Grid item xs={12} className="div-alerta">
            <Alert severity={datosAlerta.tipo} className="alerta-ayuda">
              <AlertTitle>
                <b>{datosAlerta.titulo}</b>
              </AlertTitle>
              {datosAlerta.mensaje}
            </Alert>
          </Grid>
        </Grid>
      ) : (
        ""
      )}
      {/* Footer */}
      <Grid container className="footer">
        <Grid item xs={12}>
          <p>© Copyright - Trade Alliance Corporation</p>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
