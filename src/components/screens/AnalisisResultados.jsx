import React, { useEffect, useState } from "react";
import { useProyecto } from "../../context/ProyectoContext";
import ReporteExportacion from "../ReporteExportacion";

const AnalisisResultados = () => {
  const { proyecto, calcularResultados, navegarA, limpiarProyecto } = useProyecto();
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [mostrarReporte, setMostrarReporte] = useState(false);

  useEffect(() => {
    calcularResultados();
  }, [calcularResultados]);

  const getInterpretacion = (valor) => {
    if (valor >= 0.80) return { texto: "Válido", color: "green", icon: "fas fa-check-circle" };
    if (valor >= 0.70) return { texto: "Aceptable", color: "yellow", icon: "fas fa-exclamation-triangle" };
    return { texto: "Revisar", color: "red", icon: "fas fa-times-circle" };
  };

  const criteriosActivos = Object.keys(proyecto.criterios).filter(c => proyecto.criterios[c]);
  const criteriosInfo = {
    relevancia: { nombre: "Relevancia", descripcion: "Importancia del ítem para el constructo" },
    claridad: { nombre: "Claridad", descripcion: "Comprensión y redacción del ítem" },
    coherencia: { nombre: "Coherencia", descripcion: "Consistencia con el marco teórico" },
    suficiencia: { nombre: "Suficiencia", descripcion: "Cobertura adecuada de la dimensión" }
  };

  const estadisticasGenerales = () => {
    const promedios = proyecto.resultados.map(r => r.promedio);
    if (promedios.length === 0) return null;

    const promedio = promedios.reduce((a, b) => a + b, 0) / promedios.length;
    const validos = promedios.filter(p => p >= 0.80).length;
    const aceptables = promedios.filter(p => p >= 0.70 && p < 0.80).length;
    const revisar = promedios.filter(p => p < 0.70).length;

    return { promedio, validos, aceptables, revisar, total: promedios.length };
  };

  const stats = estadisticasGenerales();


  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <i className="fas fa-calculator text-2xl text-slate-400"></i>
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          Calculando Resultados...
        </h2>
        <p className="text-slate-600 max-w-md">
          No hay datos suficientes para generar el análisis
        </p>
        <button
          onClick={() => navegarA("matriz")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Volver a la Matriz
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center">
            <i className="fas fa-chart-bar mr-3 text-blue-600"></i>
            Análisis de Resultados - V de Aiken
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Coeficientes de validez de contenido calculados para {stats.total} ítems
          </p>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-calculator text-blue-600"></i>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-slate-800">
                {stats.promedio.toFixed(3)}
              </div>
              <div className="text-sm text-slate-600">Promedio General</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-check-circle text-green-600"></i>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-600">
                {stats.validos}
              </div>
              <div className="text-sm text-slate-600">Válidos (≥0.80)</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-yellow-600"></i>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.aceptables}
              </div>
              <div className="text-sm text-slate-600">Aceptables (0.70-0.79)</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-times-circle text-red-600"></i>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-red-600">
                {stats.revisar}
              </div>
              <div className="text-sm text-slate-600">A Revisar (&lt;0.70)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de resultados */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">
            Resultados por Ítem
          </h3>
          <button
            onClick={() => setMostrarDetalles(!mostrarDetalles)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {mostrarDetalles ? 'Ocultar' : 'Mostrar'} detalles por criterio
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ítem
                </th>
                {mostrarDetalles && criteriosActivos.map(criterio => (
                  <th key={criterio} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {criteriosInfo[criterio]?.nombre || criterio}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Promedio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Interpretación
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {proyecto.resultados.map((resultado) => {
                const interpretacion = getInterpretacion(resultado.promedio);
                return (
                  <tr key={resultado.item} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      Ítem {resultado.item}
                    </td>
                    {mostrarDetalles && criteriosActivos.map(criterio => (
                      <td key={criterio} className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {resultado.criterios[criterio]?.toFixed(3) || '-'}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {resultado.promedio.toFixed(3)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${interpretacion.color}-100 text-${interpretacion.color}-800`}>
                        <i className={`${interpretacion.icon} mr-1`}></i>
                        {interpretacion.texto}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interpretación metodológica */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
          <i className="fas fa-info-circle mr-2"></i>
          Interpretación Metodológica
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>V ≥ 0.80:</strong> Ítem válido. Consenso fuerte entre jueces sobre la validez del contenido.</p>
          <p><strong>V = 0.70-0.79:</strong> Ítem aceptable. Consenso moderado, podría beneficiarse de pequeños ajustes.</p>
          <p><strong>V &lt; 0.70:</strong> Ítem a revisar. Consenso insuficiente, requiere modificación o eliminación.</p>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navegarA("matriz")}
          className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Volver a Matriz</span>
        </button>

        <div className="flex space-x-3">
          <button
            onClick={() => setMostrarReporte(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
          >
            <i className="fas fa-file-alt"></i>
            <span>Reporte Profesional</span>
          </button>
          
          
          <button
            onClick={() => {
              if (confirm('¿Está seguro de que desea crear un nuevo proyecto?')) {
                // Si estamos en Electron, abrir nueva ventana
                if (window.electronAPI) {
                  window.electronAPI.newProject();
                } else {
                  // Si estamos en web, limpiar proyecto actual
                  limpiarProyecto();
                }
              }
            }}
            className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
          >
            <i className="fas fa-plus"></i>
            <span>Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      {/* Modal del reporte profesional */}
      {mostrarReporte && (
        <ReporteExportacion
          proyecto={proyecto}
          resultados={proyecto.resultados}
          onClose={() => setMostrarReporte(false)}
        />
      )}
    </div>
  );
};

export default AnalisisResultados;
