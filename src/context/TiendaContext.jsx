import React, { useState, createContext } from "react";

export const TiendaContext = createContext();

/**
 * En este componente se manejan las variables del contexto de vitrix
 */

export function TiendaProvider({ children }) {
  // Estado para almacenar la tienda seleccionada en la vista de proxima ruta
  const [tiendaContext, setTiendaContext] = useState({});
  // Estado para almacenar la información de los pilares
  const [pilaresContext, setPilaresContext] = useState({});
  // Estado para almacenar la información del pilar seleccionado
  const [pilarContext, setPilarContext] = useState({});
  // Estado para almacenar el id del responsable que recibe la visita del DT
  const [responsableVisitaContext, setResponsableVisitaContext] = useState({});
  // Estado para almacenar la lista de los dashboards del panel de dashboards
  const [listaDashboardsContext, setListaDashboardsContext] = useState("");

  return (
    <TiendaContext.Provider
      value={{
        tiendaContext,
        setTiendaContext,
        pilaresContext,
        setPilaresContext,
        pilarContext,
        setPilarContext,
        responsableVisitaContext,
        setResponsableVisitaContext,
        listaDashboardsContext,
        setListaDashboardsContext,
      }}
    >
      {children}
    </TiendaContext.Provider>
  );
}
