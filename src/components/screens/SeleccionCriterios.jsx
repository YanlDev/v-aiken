import React from "react";
import { useProyecto } from "../../context/ProyectoContext";

const SeleccionCriterios = () => {
  const { proyecto, actualizarCriterios, navegarA, validaciones } =
    useProyecto();

  const criteriosDisponibles = {
    "contenido-basica": [
      {
        id: "relevancia",
        nombre: "Relevancia",
        descripcion: "¿El ítem es relevante para medir el constructo?",
        obligatorio: true,
      },
      {
        id: "claridad",
        nombre: "Claridad",
        descripcion: "¿El ítem está redactado de forma clara y comprensible?",
        obligatorio: true,
      },
    ],
    "contenido-completa": [
      {
        id: "relevancia",
        nombre: "Relevancia",
        descripcion: "¿El ítem es relevante para medir el constructo?",
        obligatorio: true,
      },
      {
        id: "claridad",
        nombre: "Claridad",
        descripcion: "¿El ítem está redactado de forma clara y comprensible?",
        obligatorio: true,
      },
      {
        id: "coherencia",
        nombre: "Coherencia",
        descripcion: "¿El ítem es coherente con el constructo teórico?",
        obligatorio: false,
      },
      {
        id: "suficiencia",
        nombre: "Suficiencia",
        descripcion: "¿Los ítems son suficientes para cubrir la dimensión?",
        obligatorio: false,
      },
    ],
  };

  const criteriosParaTipo =
    criteriosDisponibles[proyecto.configuracion.tipoValidacion] || [];

  const handleCriterioChange = (criterioId, valor) => {
    actualizarCriterios({ [criterioId]: valor });
  };

  const handleContinuar = () => {
    if (validaciones.criteriosDefinidos()) {
      navegarA("matriz");
    }
  };

  const handleVolver = () => {
    navegarA("configuracion");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center">
            <i className="fas fa-clipboard-list mr-3 text-blue-600"></i>
            Criterios de Evaluación
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Seleccione los aspectos que evaluarán los jueces expertos para el
            tipo de validación:
            <span className="font-medium ml-1">
              {proyecto.configuracion.tipoValidacion === "contenido-basica" &&
                "Validación de Contenido (Básica)"}
              {proyecto.configuracion.tipoValidacion === "contenido-completa" &&
                "Validación de Contenido (Completa)"}
            </span>
          </p>
        </div>
      </div>

      {/* Lista de criterios */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6">
          <div className="space-y-4">
            {criteriosParaTipo.map((criterio) => (
              <div
                key={criterio.id}
                className="border border-slate-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id={criterio.id}
                        checked={proyecto.criterios[criterio.id] || false}
                        onChange={(e) =>
                          handleCriterioChange(criterio.id, e.target.checked)
                        }
                        disabled={criterio.obligatorio}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <label
                          htmlFor={criterio.id}
                          className="text-sm font-medium text-slate-800"
                        >
                          {criterio.nombre}
                        </label>
                        {criterio.obligatorio && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                            Obligatorio
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {criterio.descripcion}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Información sobre los criterios seleccionados */}
      {validaciones.criteriosDefinidos() && (
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center">
            <i className="fas fa-check-circle mr-2"></i>
            Criterios Seleccionados
          </h3>
          <div className="text-sm text-green-700">
            <p className="mb-2">
              Los jueces evaluarán cada ítem según los siguientes criterios:
            </p>
            <ul className="list-disc list-inside space-y-1">
              {Object.keys(proyecto.criterios)
                .filter((criterio) => proyecto.criterios[criterio])
                .map((criterio) => {
                  const info = criteriosParaTipo.find((c) => c.id === criterio);
                  return (
                    <li key={criterio}>
                      <strong>{info?.nombre}:</strong> {info?.descripcion}
                    </li>
                  );
                })}
            </ul>
            <p className="mt-3 font-medium">
              Esto generará una matriz de {proyecto.configuracion.numItems}{" "}
              ítems × {proyecto.configuracion.numJueces} jueces ×{" "}
              {Object.values(proyecto.criterios).filter(Boolean).length}{" "}
              criterios
            </p>
          </div>
        </div>
      )}

      {/* Botones de navegación */}
      <div className="flex justify-between">
        <button
          onClick={handleVolver}
          className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2"
        >
          <i className="fas fa-arrow-left"></i>
          <span>Volver</span>
        </button>

        <button
          onClick={handleContinuar}
          disabled={!validaciones.criteriosDefinidos()}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
            validaciones.criteriosDefinidos()
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
              : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }`}
        >
          <span>Continuar a Matriz</span>
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default SeleccionCriterios;
