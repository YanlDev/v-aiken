import React from "react";
import { useProyecto } from "../../context/ProyectoContext";
import ConfiguracionProyecto from "./ConfiguracionProyecto";
import SeleccionCriterios from "./SeleccionCriterios";
import MatrizEvaluacion from "./MatrizEvaluacion";
import AnalisisResultados from "./AnalisisResultados";

const PantallaActiva = () => {
  const { pantallaActiva } = useProyecto();

  const renderizarPantalla = () => {
    switch (pantallaActiva) {
      case "configuracion":
        return <ConfiguracionProyecto />;
      case "criterios":
        return <SeleccionCriterios />;
      case "matriz":
        return <MatrizEvaluacion />;
      case "resultados":
        return <AnalisisResultados />;
      default:
        return <ConfiguracionProyecto />;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-3">
        {renderizarPantalla()}
      </div>
    </div>
  );
};

export default PantallaActiva;