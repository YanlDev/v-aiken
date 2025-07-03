import React, { useState } from "react";
import { useProyecto } from "../../context/ProyectoContext";

const MatrizEvaluacion = () => {
  const { proyecto, actualizarDatos, navegarA, validaciones } = useProyecto();
  const [itemActual, setItemActual] = useState(1);
  
  const criteriosActivos = Object.keys(proyecto.criterios).filter(
    (c) => proyecto.criterios[c]
  );

  const criteriosInfo = {
    relevancia: { nombre: "Relevancia", color: "blue" },
    claridad: { nombre: "Claridad", color: "green" },
    coherencia: { nombre: "Coherencia", color: "purple" },
    suficiencia: { nombre: "Suficiencia", color: "orange" }
  };

  const getEscalaTexto = (valor) => {
    const escala = proyecto.configuracion.escala;
    if (escala === 3) {
      return ["", "No cumple", "Parcial", "Cumple"][valor];
    } else if (escala === 4) {
      return ["", "No cumple", "Bajo nivel", "Moderado", "Alto nivel"][valor];
    } else if (escala === 5) {
      return ["", "Muy bajo", "Bajo", "Moderado", "Alto", "Muy alto"][valor];
    }
    return "";
  };

  const handlePuntuacionChange = (juez, criterio, valor) => {
    actualizarDatos(itemActual, juez, criterio, valor);
  };

  const handleContinuar = () => {
    if (validaciones.datosCompletos()) {
      navegarA("resultados");
    }
  };

  const handleVolver = () => {
    navegarA("criterios");
  };

  const progresoDatos = () => {
    let completados = 0;
    let total = 0;
    
    for (let item = 1; item <= proyecto.configuracion.numItems; item++) {
      for (const criterio of criteriosActivos) {
        for (let juez = 1; juez <= proyecto.configuracion.numJueces; juez++) {
          total++;
          const valor = proyecto.datos[item]?.[criterio]?.[juez];
          if (valor && !isNaN(parseInt(valor)) && parseInt(valor) >= 1 && parseInt(valor) <= proyecto.configuracion.escala) {
            completados++;
          }
        }
      }
    }
    
    return { completados, total, porcentaje: Math.round((completados / total) * 100) };
  };

  const progreso = progresoDatos();

  return (
    <div className="space-y-4">
      {/* Header con progreso */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <i className="fas fa-table mr-3 text-blue-600"></i>
                Matriz de Evaluación
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Ítem {itemActual} de {proyecto.configuracion.numItems} - 
                Ingrese las puntuaciones de los {proyecto.configuracion.numJueces} jueces
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-slate-800">
                Progreso: {progreso.completados}/{progreso.total}
              </div>
              <div className="w-32 bg-slate-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progreso.porcentaje}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-500 mt-1">{progreso.porcentaje}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación de ítems */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setItemActual(Math.max(1, itemActual - 1))}
            disabled={itemActual === 1}
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 rounded-md"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-600">Ítem:</span>
            <select
              value={itemActual}
              onChange={(e) => setItemActual(parseInt(e.target.value))}
              className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({length: proyecto.configuracion.numItems}, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={() => setItemActual(Math.min(proyecto.configuracion.numItems, itemActual + 1))}
            disabled={itemActual === proyecto.configuracion.numItems}
            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 rounded-md"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Matriz de evaluación */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4">
          <div className="space-y-4">
            {criteriosActivos.map((criterio) => (
              <div key={criterio} className="border border-slate-200 rounded-lg p-3">
                <div className="flex items-center mb-4">
                  <div className={`w-3 h-3 rounded-full bg-${criteriosInfo[criterio]?.color || 'blue'}-500 mr-3`}></div>
                  <h3 className="font-semibold text-slate-800">
                    {criteriosInfo[criterio]?.nombre || criterio}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {Array.from({length: proyecto.configuracion.numJueces}, (_, i) => {
                    const juez = i + 1;
                    const valor = proyecto.datos[itemActual]?.[criterio]?.[juez] || "";
                    
                    return (
                      <div key={juez} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2 text-center">
                          Juez {juez}
                        </h4>
                        <div className="space-y-1">
                          {Array.from({length: proyecto.configuracion.escala}, (_, i) => {
                            const puntuacion = i + 1;
                            const radioId = `${criterio}-juez${juez}-puntuacion${puntuacion}`;
                            
                            return (
                              <div key={puntuacion} className="flex items-center">
                                <input
                                  type="radio"
                                  id={radioId}
                                  name={`${criterio}-juez${juez}-item${itemActual}`}
                                  value={puntuacion}
                                  checked={parseInt(valor) === puntuacion}
                                  onChange={(e) => handlePuntuacionChange(juez, criterio, e.target.value)}
                                  className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-slate-300"
                                />
                                <label htmlFor={radioId} className="ml-2 text-sm text-slate-700 cursor-pointer">
                                  {puntuacion} - {getEscalaTexto(puntuacion)}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Información de la escala */}
      {/* <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">
          Escala de Puntuación (1-{proyecto.configuracion.escala})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-blue-700">
          {Array.from({length: proyecto.configuracion.escala}, (_, i) => (
            <div key={i + 1} className="flex items-center">
              <span className="font-medium mr-2">{i + 1}:</span>
              <span>{getEscalaTexto(i + 1)}</span>
            </div>
          ))}
        </div>
      </div> */}

      {/* Botones de navegación */}
      <div className="flex justify-between">
        <button
          onClick={handleVolver}
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Volver</span>
        </button>

        <button
          onClick={handleContinuar}
          disabled={!validaciones.datosCompletos()}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
            validaciones.datosCompletos()
              ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
              : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }`}
        >
          <span>Calcular Resultados</span>
          <i className="fas fa-calculator"></i>
        </button>
      </div>
    </div>
  );
};

export default MatrizEvaluacion;
