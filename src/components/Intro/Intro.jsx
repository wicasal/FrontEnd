import React from "react";
import video from "../../assets/videos/initial_screen.mp4";
/**
 * Componente que muestra el video de inicio de Vitrix
 */
const Intro = () => {
  return (
    <video width="100%" height="100%" autoPlay loop muted className="vh100">
      <source src={video} type="video/mp4" />
    </video>
  );
};

export default Intro;
