import React from "react";
import { useProyecto } from "../../context/ProyectoContext";

const Sidebar = () => {
  const { pantallaActiva, navegarA, validaciones, proyecto } = useProyecto();

  const navegacion = [
    {
      id: "configuracion",
      titulo: "Configuración",
      subtitulo: "Proyecto y metodología",
      icono: "fas fa-cog",
      completado: validaciones.configuracionCompleta(),
      activo: true,
    },
    {
      id: "criterios",
      titulo: "Criterios",
      subtitulo: "Aspectos a evaluar",
      icono: "fas fa-clipboard-list",
      completado: validaciones.criteriosDefinidos(),
      activo: validaciones.configuracionCompleta(),
    },
    {
      id: "matriz",
      titulo: "Matriz",
      subtitulo: "Ingreso de datos",
      icono: "fas fa-table",
      completado: validaciones.datosCompletos(),
      activo:
        validaciones.configuracionCompleta() &&
        validaciones.criteriosDefinidos(),
    },
    {
      id: "resultados",
      titulo: "Resultados",
      subtitulo: "Análisis V de Aiken",
      icono: "fas fa-chart-bar",
      completado: proyecto.resultados.length > 0,
      activo: validaciones.puedeCalcular(),
    },
  ];

  const calcularProgreso = () => {
    const completados = navegacion.filter((item) => item.completado).length;
    return Math.round((completados / navegacion.length) * 100);
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
            Flujo de Trabajo
          </h2>
          <div className="text-xs text-slate-500">
            {calcularProgreso()}% completo
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${calcularProgreso()}%` }}
          ></div>
        </div>

        <nav className="space-y-2">
          {navegacion.map((item, index) => (
            <button
              key={item.id}
              onClick={() => item.activo && navegarA(item.id)}
              disabled={!item.activo}
              className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                pantallaActiva === item.id
                  ? "bg-blue-50 border-2 border-blue-200 text-blue-800"
                  : item.activo
                  ? "bg-slate-50 hover:bg-slate-100 border-2 border-transparent hover:border-slate-200 text-slate-700"
                  : "bg-slate-25 border-2 border-transparent text-slate-400 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      pantallaActiva === item.id
                        ? "bg-blue-600 text-white"
                        : item.activo
                        ? "bg-slate-200 text-slate-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <i className={item.icono}></i>
                  </div>
                  <div>
                    <div className="font-semibold">{item.titulo}</div>
                    <div className="text-xs opacity-75">{item.subtitulo}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {item.completado && (
                    <i className="fas fa-check-circle text-green-500"></i>
                  )}
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      pantallaActiva === item.id
                        ? "border-blue-600 bg-blue-600 text-white"
                        : item.activo
                        ? "border-slate-300 text-slate-600"
                        : "border-slate-200 text-slate-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Estado del proyecto */}
      <div className="border-t border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">
          Estado del Proyecto
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Configuración:</span>
            <span
              className={
                validaciones.configuracionCompleta()
                  ? "text-green-600 font-medium"
                  : "text-slate-400"
              }
            >
              {validaciones.configuracionCompleta() ? "Completa" : "Pendiente"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Criterios:</span>
            <span
              className={
                validaciones.criteriosDefinidos()
                  ? "text-green-600 font-medium"
                  : "text-slate-400"
              }
            >
              {validaciones.criteriosDefinidos() ? "Definidos" : "Pendiente"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Jueces:</span>
            <span className="text-slate-800 font-medium">
              {proyecto.configuracion.numJueces}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Ítems:</span>
            <span className="text-slate-800 font-medium">
              {proyecto.configuracion.numItems}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Escala:</span>
            <span className="text-slate-800 font-medium">
              1-{proyecto.configuracion.escala}
            </span>
          </div>
        </div>

        {/* Información adicional si hay resultados */}
        {proyecto.resultados.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Resultados:</span>
              <span className="text-blue-600 font-medium">
                {proyecto.resultados.length} ítems calculados
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
