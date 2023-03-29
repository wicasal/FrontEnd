import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Componente auxiliar que permite que cuando cambiemos de pagina, aparezca desde el comienzo
 */
const ScrollToTop = (props) => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return <>{props.children}</>
};

export default ScrollToTop;