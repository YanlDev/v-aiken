import React from "react";
import { useProyecto } from "../../context/ProyectoContext";

const Header = () => {
  const { proyecto, limpiarProyecto } = useProyecto();

  const handleNuevoProyecto = () => {
    if (
      window.confirm(
        "¿Está seguro que desea crear un nuevo proyecto?"
      )
    ) {
      // Si estamos en Electron, abrir nueva ventana
      if (window.electronAPI) {
        window.electronAPI.newProject();
      } else {
        // Si estamos en web, limpiar proyecto actual
        limpiarProyecto();
      }
    }
  };

  return (
    <div className="bg-slate-800 text-white px-4 py-2 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
            <i className="fas fa-check-double text-white text-sm"></i>
          </div>
          <div>
            <h1 className="text-lg font-semibold">Validador Aiken</h1>
            <p className="text-xs text-slate-300">
              {proyecto.info.nombre ||
                "Validación multi-criterio automatizada"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Botón Nuevo Proyecto */}
          <button
            onClick={handleNuevoProyecto}
            className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs transition-colors duration-200 flex items-center space-x-1"
            title="Nuevo Proyecto"
          >
            <i className="fas fa-plus text-xs"></i>
            <span>Nuevo</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Header;
