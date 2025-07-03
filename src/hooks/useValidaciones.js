import React from 'react';
import { useProyecto } from '../context/ProyectoContext';
import ConfiguracionProyecto from './ConfiguracionProyecto';
import SeleccionCriterios from './SeleccionCriterios';
import MatrizEvaluacion from './MatrizEvaluacion';
import AnalisisResultados from './AnalisisResultados';

const PantallaActiva = () => {
  const { pantallaActiva } = useProyecto();

  const pantallas = {
    'configuracion': <ConfiguracionProyecto />,
    'criterios': <SeleccionCriterios />,
    'matriz': <MatrizEvaluacion />,
    'resultados': <AnalisisResultados />
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {pantallas[pantallaActiva] || <ConfiguracionProyecto />}
    </div>
  );
};

export default PantallaActiva;