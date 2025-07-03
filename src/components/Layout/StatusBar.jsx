import React from "react";
import { useProyecto } from "../../context/ProyectoContext";

const StatusBar = () => {
  const { proyecto, pantallaActiva, validaciones } = useProyecto();

  const navegacion = [
    { id: "configuracion", titulo: "Configuración" },
    { id: "criterios", titulo: "Criterios" },
    { id: "matriz", titulo: "Matriz" },
    { id: "resultados", titulo: "Resultados" },
  ];

  const getEstadoGeneral = () => {
    if (validaciones.puedeCalcular())
      return { texto: "Listo para calcular", color: "text-green-400" };
    if (validaciones.datosCompletos())
      return { texto: "Datos completos", color: "text-blue-400" };
    if (validaciones.criteriosDefinidos())
      return { texto: "Criterios definidos", color: "text-yellow-400" };
    if (validaciones.configuracionCompleta())
      return { texto: "Configuración completa", color: "text-orange-400" };
    return { texto: "Configuración pendiente", color: "text-slate-400" };
  };

  const estadoGeneral = getEstadoGeneral();

  return (
    <div className="bg-slate-800 text-slate-300 px-6 py-2 text-xs flex justify-between items-center">
      <div className="flex space-x-4">
        <span>
          <i className="fas fa-user mr-1"></i>
          Investigador: {proyecto.info.investigador || "No definido"}
        </span>
        <span className="text-slate-500">|</span>
        <span>
          <i className="fas fa-cog mr-1"></i>
          Configuración: {proyecto.configuracion.numJueces} jueces,{" "}
          {proyecto.configuracion.numItems} ítems
        </span>
        <span className="text-slate-500">|</span>
        <span>
          <i className="fas fa-calendar mr-1"></i>
          {proyecto.info.fecha}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <span className={estadoGeneral.color}>
          <i className="fas fa-circle mr-1" style={{ fontSize: "6px" }}></i>
          {estadoGeneral.texto}
        </span>
        <span className="text-slate-500">|</span>
        <span>
          <i className="fas fa-eye mr-1"></i>
          {navegacion.find((n) => n.id === pantallaActiva)?.titulo}
        </span>
        {proyecto.resultados.length > 0 && (
          <>
            <span className="text-slate-500">|</span>
            <span className="text-green-400">
              <i className="fas fa-check-circle mr-1"></i>
              {proyecto.resultados.length} resultados
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default StatusBar;
