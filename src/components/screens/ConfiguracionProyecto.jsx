import React, { useState } from 'react';
import { useProyecto } from '../../context/ProyectoContext';

const ConfiguracionProyecto = () => {
  const { proyecto, proyectoKey, actualizarInfo, actualizarConfiguracion, navegarA, validaciones } = useProyecto();
  const [modalInfo, setModalInfo] = useState(null);

  const infoModales = {
    tipoValidacion: {
      titulo: "Tipos de Validación",
      contenido: {
        "contenido-basica": "Evalúa únicamente Relevancia y Claridad. Recomendado para validaciones rápidas o instrumentos simples.",
        "contenido-completa": "Evalúa Relevancia, Claridad, Coherencia y Suficiencia. Análisis más completo y robusto."
      }
    },
    escala: {
      titulo: "Escalas de Puntuación",
      contenido: {
        "3": "Escala de 3 puntos: Permite decisiones rápidas (No cumple/Parcial/Cumple). Menos sensible a diferencias sutiles.",
        "4": "Escala de 4 puntos: Balance óptimo entre simplicidad y precisión. Ampliamente utilizada en investigación académica.",
        "5": "Escala de 5 puntos: Mayor sensibilidad para detectar diferencias. Útil cuando se requiere más granularidad."
      }
    },
    numJueces: {
      titulo: "Número de Jueces",
      contenido: "Se recomiendan entre 5-10 jueces expertos. Menos de 5 puede comprometer la validez estadística, más de 15 raramente mejora los resultados significativamente."
    }
  };

  const handleContinuar = () => {
    if (validaciones.configuracionCompleta()) {
      navegarA('criterios');
    }
  };

  return (
    <div className="space-y-4">
      {/* Información General */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center">
            <i className="fas fa-info-circle mr-3 text-blue-600"></i>
            Información General del Proyecto
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Datos básicos para identificar y documentar la validación
          </p>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre del Proyecto *
              </label>
              <input
                key={`nombre-${proyectoKey}`}
                type="text"
                value={proyecto.info.nombre}
                onChange={(e) => actualizarInfo('nombre', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Validación Escala de Estrés Laboral"
              />
              {!proyecto.info.nombre.trim() && (
                <p className="text-xs text-red-500 mt-1">Este campo es obligatorio</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Investigador Principal *
              </label>
              <input
                key={`investigador-${proyectoKey}`}
                type="text"
                value={proyecto.info.investigador}
                onChange={(e) => actualizarInfo('investigador', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nombre completo del investigador"
              />
              {!proyecto.info.investigador.trim() && (
                <p className="text-xs text-red-500 mt-1">Este campo es obligatorio</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Institución
              </label>
              <input
                key={`institucion-${proyectoKey}`}
                type="text"
                value={proyecto.info.institucion}
                onChange={(e) => actualizarInfo('institucion', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Universidad o institución"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={proyecto.info.fecha}
                onChange={(e) => actualizarInfo('fecha', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Configuración Metodológica */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-4 py-3 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center">
            <i className="fas fa-microscope mr-3 text-blue-600"></i>
            Configuración Metodológica
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Parámetros técnicos para el análisis de validez
          </p>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de Validación
              </label>
              <select
                value={proyecto.configuracion.tipoValidacion}
                onChange={(e) => actualizarConfiguracion('tipoValidacion', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="contenido-basica">Validación Básica - Relevancia y Claridad</option>
                <option value="contenido-completa">Validación Completa - 4 Criterios</option>
              </select>
              <div className="flex items-center mt-1">
                <button
                  onClick={() => setModalInfo('tipoValidacion')}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <i className="fas fa-info-circle mr-1"></i>
                  ¿Qué tipo elegir?
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Escala de Puntuación
              </label>
              <select
                value={proyecto.configuracion.escala}
                onChange={(e) => actualizarConfiguracion('escala', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={3}>Escala 1-3 (Rápida)</option>
                <option value={4}>Escala 1-4 (Estándar)</option>
                <option value={5}>Escala 1-5 (Detallada)</option>
              </select>
              <div className="flex items-center mt-1">
                <button
                  onClick={() => setModalInfo('escala')}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <i className="fas fa-info-circle mr-1"></i>
                  ¿Cuál escala usar?
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Número de Jueces
              </label>
              <select
                value={proyecto.configuracion.numJueces}
                onChange={(e) => actualizarConfiguracion('numJueces', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Array.from({length: 18}, (_, i) => i + 3).map(n => (
                  <option key={n} value={n}>{n} jueces{n === 5 ? ' (Mínimo)' : n === 7 ? ' (Recomendado)' : ''}</option>
                ))}
              </select>
              <div className="flex items-center mt-1">
                <button
                  onClick={() => setModalInfo('numJueces')}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <i className="fas fa-info-circle mr-1"></i>
                  ¿Cuántos jueces necesito?
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Número de Ítems del Instrumento
              </label>
              <select
                value={proyecto.configuracion.numItems}
                onChange={(e) => actualizarConfiguracion('numItems', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Array.from({length: 50}, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n} ítems</option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Seleccione el número total de ítems de su instrumento
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* Modal de información */}
      {modalInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                {infoModales[modalInfo].titulo}
              </h3>
              <button
                onClick={() => setModalInfo(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="text-sm text-slate-700 space-y-3">
              {typeof infoModales[modalInfo].contenido === 'object' ? (
                Object.entries(infoModales[modalInfo].contenido).map(([key, value]) => (
                  <div key={key} className="border-l-3 border-blue-500 pl-3">
                    <p className="font-medium text-slate-800 mb-1">
                      {key === '3' ? 'Escala 1-3' : 
                       key === '4' ? 'Escala 1-4' :
                       key === '5' ? 'Escala 1-5' :
                       key === 'contenido-basica' ? 'Validación Básica' :
                       key === 'contenido-completa' ? 'Validación Completa' : key}
                    </p>
                    <p>{value}</p>
                  </div>
                ))
              ) : (
                <p>{infoModales[modalInfo].contenido}</p>
              )}
              
              {modalInfo === 'tipoValidacion' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Recomendación:</strong> Para la mayoría de casos, la Validación Completa (4 criterios) ofrece el mejor balance entre rigor metodológico y practicidad.
                  </p>
                </div>
              )}
              
              {modalInfo === 'escala' && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Recomendación:</strong> La escala 1-4 es la más utilizada en investigación académica por su balance entre precisión y simplicidad.
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalInfo(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón de continuar */}
      <div className="flex justify-end">
        <button
          onClick={handleContinuar}
          disabled={!validaciones.configuracionCompleta()}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
            validaciones.configuracionCompleta()
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Continuar a Criterios</span>
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ConfiguracionProyecto;