import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReporteExportacion = ({ proyecto, resultados, onClose }) => {
  const reporteRef = useRef();

  const criteriosActivos = Object.keys(proyecto.criterios).filter(c => proyecto.criterios[c]);
  const criteriosInfo = {
    relevancia: { nombre: "Relevancia", descripcion: "Importancia del ítem para el constructo" },
    claridad: { nombre: "Claridad", descripcion: "Comprensión y redacción del ítem" },
    coherencia: { nombre: "Coherencia", descripcion: "Consistencia con el marco teórico" },
    suficiencia: { nombre: "Suficiencia", descripcion: "Cobertura adecuada de la dimensión" }
  };

  // Estadísticas descriptivas
  const promedios = resultados.map(r => r.promedio);
  const estadisticas = {
    n: resultados.length,
    media: promedios.reduce((a, b) => a + b, 0) / promedios.length,
    desviacion: Math.sqrt(promedios.reduce((sum, val) => sum + Math.pow(val - (promedios.reduce((a, b) => a + b, 0) / promedios.length), 2), 0) / promedios.length),
    minimo: Math.min(...promedios),
    maximo: Math.max(...promedios),
    validos: promedios.filter(p => p >= 0.80).length,
    aceptables: promedios.filter(p => p >= 0.70 && p < 0.80).length,
    revisar: promedios.filter(p => p < 0.70).length
  };

  // Datos para gráfico de barras (V de Aiken por ítem)
  const barData = {
    labels: resultados.map(r => `Ítem ${r.item}`),
    datasets: [{
      label: 'Coeficiente V de Aiken',
      data: promedios,
      backgroundColor: promedios.map(p => 
        p >= 0.80 ? '#10b981' : p >= 0.70 ? '#f59e0b' : '#ef4444'
      ),
      borderColor: promedios.map(p => 
        p >= 0.80 ? '#047857' : p >= 0.70 ? '#d97706' : '#dc2626'
      ),
      borderWidth: 2,
    }]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Coeficientes V de Aiken por Ítem',
        font: { size: 16, weight: 'bold' }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        title: {
          display: true,
          text: 'Coeficiente V de Aiken'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Ítems del Instrumento'
        }
      }
    }
  };

  // Datos para gráfico circular (distribución de validez)
  const doughnutData = {
    labels: ['Válidos (≥0.80)', 'Aceptables (0.70-0.79)', 'Revisar (<0.70)'],
    datasets: [{
      data: [estadisticas.validos, estadisticas.aceptables, estadisticas.revisar],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderColor: ['#047857', '#d97706', '#dc2626'],
      borderWidth: 2,
    }]
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20 }
      },
      title: {
        display: true,
        text: 'Distribución de Validez de Contenido',
        font: { size: 16, weight: 'bold' }
      }
    }
  };




  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Reporte Profesional V de Aiken</h2>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div ref={reporteRef} className="p-6">
          {/* Header del reporte */}
          <div className="header text-center border-b-4 border-blue-600 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              REPORTE DE VALIDEZ DE CONTENIDO
            </h1>
            <h2 className="text-xl text-slate-600 mb-4">Coeficiente V de Aiken</h2>
            <div className="bg-blue-50 rounded-lg p-4 inline-block">
              <h3 className="text-lg font-semibold text-blue-800">{proyecto.info.nombre}</h3>
              <p className="text-blue-600">
                {proyecto.info.investigador} • {proyecto.info.institucion}
              </p>
              <p className="text-sm text-blue-500">Fecha: {new Date(proyecto.info.fecha).toLocaleDateString('es-ES')}</p>
            </div>
          </div>

          {/* Resumen ejecutivo */}
          <div className="section mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <i className="fas fa-chart-line mr-3 text-blue-600"></i>
              Resumen Ejecutivo
            </h3>
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="stat-card bg-white rounded-lg shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-slate-800">{estadisticas.n}</div>
                  <div className="text-sm text-slate-600">Ítems Analizados</div>
                </div>
                <div className="stat-card bg-white rounded-lg shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{estadisticas.media.toFixed(3)}</div>
                  <div className="text-sm text-slate-600">V Promedio</div>
                </div>
                <div className="stat-card bg-white rounded-lg shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{estadisticas.validos}</div>
                  <div className="text-sm text-slate-600">Ítems Válidos</div>
                </div>
                <div className="stat-card bg-white rounded-lg shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-slate-600">{((estadisticas.validos / estadisticas.n) * 100).toFixed(1)}%</div>
                  <div className="text-sm text-slate-600">% Validez</div>
                </div>
              </div>
            </div>
          </div>

          {/* Metodología */}
          <div className="section mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <i className="fas fa-microscope mr-3 text-blue-600"></i>
              Metodología
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-3">Configuración del Estudio</h4>
                <table className="w-full text-sm">
                  <tr><td className="font-medium">Tipo de Validación:</td><td>{proyecto.configuracion.tipoValidacion}</td></tr>
                  <tr><td className="font-medium">Número de Jueces:</td><td>{proyecto.configuracion.numJueces}</td></tr>
                  <tr><td className="font-medium">Escala de Puntuación:</td><td>1-{proyecto.configuracion.escala}</td></tr>
                  <tr><td className="font-medium">Número de Ítems:</td><td>{proyecto.configuracion.numItems}</td></tr>
                </table>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-3">Criterios Evaluados</h4>
                <ul className="text-sm space-y-2">
                  {criteriosActivos.map(criterio => (
                    <li key={criterio} className="flex items-center">
                      <i className="fas fa-check-circle text-green-600 mr-2"></i>
                      <span className="font-medium">{criteriosInfo[criterio]?.nombre}:</span>
                      <span className="ml-1 text-slate-600">{criteriosInfo[criterio]?.descripcion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Fórmula y cálculo */}
          <div className="section mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <i className="fas fa-calculator mr-3 text-blue-600"></i>
              Base Matemática
            </h3>
            <div className="formula bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
              <h4 className="font-semibold text-blue-800 mb-3">Coeficiente V de Aiken</h4>
              <div className="text-lg font-mono text-blue-900 mb-3">
                V = S / [n(c-1)]
              </div>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Donde:</strong></p>
                <p>• <strong>S</strong> = Suma de las puntuaciones ajustadas de todos los jueces</p>
                <p>• <strong>n</strong> = Número de jueces expertos ({proyecto.configuracion.numJueces})</p>
                <p>• <strong>c</strong> = Número de categorías de la escala ({proyecto.configuracion.escala})</p>
              </div>
              <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Ejemplo de cálculo:</strong> Si un ítem recibe puntuaciones [4,4,3,4,4] en escala 1-4 con 5 jueces:
                  <br />S = (4-1) + (4-1) + (3-1) + (4-1) + (4-1) = 3+3+2+3+3 = 14
                  <br />V = 14 / [5(4-1)] = 14/15 = 0.933
                </p>
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <div className="section mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <i className="fas fa-chart-bar mr-3 text-blue-600"></i>
              Análisis Visual
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <Bar data={barData} options={barOptions} />
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>

          {/* Estadísticas descriptivas */}
          <div className="section mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <i className="fas fa-chart-area mr-3 text-blue-600"></i>
              Estadísticas Descriptivas
            </h3>
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left">Estadístico</th>
                    <th className="px-6 py-3 text-left">Valor</th>
                    <th className="px-6 py-3 text-left">Interpretación</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-6 py-4 font-medium">Media (μ)</td>
                    <td className="px-6 py-4">{estadisticas.media.toFixed(4)}</td>
                    <td className="px-6 py-4">Coeficiente promedio de validez</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-6 py-4 font-medium">Desviación Estándar (σ)</td>
                    <td className="px-6 py-4">{estadisticas.desviacion.toFixed(4)}</td>
                    <td className="px-6 py-4">Variabilidad entre ítems</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Mínimo</td>
                    <td className="px-6 py-4">{estadisticas.minimo.toFixed(4)}</td>
                    <td className="px-6 py-4">Ítem con menor validez</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="px-6 py-4 font-medium">Máximo</td>
                    <td className="px-6 py-4">{estadisticas.maximo.toFixed(4)}</td>
                    <td className="px-6 py-4">Ítem con mayor validez</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium">Rango</td>
                    <td className="px-6 py-4">{(estadisticas.maximo - estadisticas.minimo).toFixed(4)}</td>
                    <td className="px-6 py-4">Diferencia entre extremos</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabla de resultados detallada */}
          <div className="section mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <i className="fas fa-table mr-3 text-blue-600"></i>
              Resultados Detallados por Ítem
            </h3>
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Ítem</th>
                    {criteriosActivos.map(criterio => (
                      <th key={criterio} className="px-4 py-3 text-left">{criteriosInfo[criterio]?.nombre}</th>
                    ))}
                    <th className="px-4 py-3 text-left">V Promedio</th>
                    <th className="px-4 py-3 text-left">Interpretación</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((resultado, index) => (
                    <tr key={resultado.item} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-4 py-3 font-medium">Ítem {resultado.item}</td>
                      {criteriosActivos.map(criterio => (
                        <td key={criterio} className="px-4 py-3">
                          {resultado.criterios[criterio]?.toFixed(3) || '-'}
                        </td>
                      ))}
                      <td className="px-4 py-3 font-medium">{resultado.promedio.toFixed(3)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          resultado.promedio >= 0.80 ? 'bg-green-100 text-green-800' :
                          resultado.promedio >= 0.70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {resultado.promedio >= 0.80 ? 'Válido' :
                           resultado.promedio >= 0.70 ? 'Aceptable' : 'Revisar'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Conclusiones y recomendaciones */}
          <div className="section">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <i className="fas fa-lightbulb mr-3 text-blue-600"></i>
              Conclusiones y Recomendaciones
            </h3>
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Validez General del Instrumento:</h4>
                  <p className="text-slate-700">
                    El instrumento presenta un coeficiente V de Aiken promedio de {estadisticas.media.toFixed(3)}, 
                    con {estadisticas.validos} ítems válidos ({((estadisticas.validos / estadisticas.n) * 100).toFixed(1)}% del total), 
                    {estadisticas.aceptables} aceptables y {estadisticas.revisar} que requieren revisión.
                  </p>
                </div>
                
                {estadisticas.revisar > 0 && (
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-red-800 mb-2">Ítems que Requieren Atención:</h4>
                    <p className="text-red-700">
                      Se recomienda revisar los {estadisticas.revisar} ítems con V &lt; 0.70 para mejorar 
                      su claridad, relevancia o coherencia antes de la aplicación final del instrumento.
                    </p>
                  </div>
                )}
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Recomendación Metodológica:</h4>
                  <p className="text-blue-700">
                    {estadisticas.media >= 0.80 ? 
                      "El instrumento presenta evidencia sólida de validez de contenido y puede proceder a la siguiente fase de validación." :
                      estadisticas.media >= 0.70 ?
                      "El instrumento presenta validez de contenido aceptable. Se sugiere considerar las recomendaciones específicas por ítem." :
                      "Se recomienda una revisión integral del instrumento antes de continuar con el proceso de validación."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
            <p>Reporte generado el {new Date().toLocaleDateString('es-ES')} usando Validador Aiken</p>
            <p>Validación multi-criterio automatizada para análisis psicométrico</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteExportacion;