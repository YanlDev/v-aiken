import React, { createContext, useContext, useState, useEffect } from "react";

// Crear el Context
const ProyectoContext = createContext();

// Hook personalizado para usar el Context
export const useProyecto = () => {
  const context = useContext(ProyectoContext);
  if (!context) {
    throw new Error("useProyecto debe usarse dentro de ProyectoProvider");
  }
  return context;
};

// Provider Component
export const ProyectoProvider = ({ children }) => {
  const [proyecto, setProyecto] = useState({
    info: {
      nombre: "Proyecto de prueba",
      investigador: "Investigador de prueba",
      institucion: "Institución de prueba",
      fecha: new Date().toISOString().split("T")[0],
    },
    configuracion: {
      tipoValidacion: "contenido-basica",
      numJueces: 5,
      numItems: 10,
      escala: 4,
    },
    criterios: {
      relevancia: true,
      claridad: true,
      coherencia: false,
      suficiencia: false,
    },
    datos: {},
    resultados: [],
  });

  const [pantallaActiva, setPantallaActiva] = useState("configuracion");
  const [proyectoKey, setProyectoKey] = useState(Date.now());

  // Funciones de actualización
  const actualizarInfo = (campo, valor) => {
    setProyecto((prev) => ({
      ...prev,
      info: { ...prev.info, [campo]: valor },
    }));
  };

  const actualizarConfiguracion = (campo, valor) => {
    setProyecto((prev) => ({
      ...prev,
      configuracion: { ...prev.configuracion, [campo]: valor },
    }));
  };

  const actualizarCriterios = (nuevosCriterios) => {
    setProyecto((prev) => ({
      ...prev,
      criterios: { ...prev.criterios, ...nuevosCriterios },
    }));
  };

  const actualizarDatos = (item, juez, criterio, valor) => {
    setProyecto((prev) => ({
      ...prev,
      datos: {
        ...prev.datos,
        [item]: {
          ...prev.datos[item],
          [criterio]: {
            ...prev.datos[item]?.[criterio],
            [juez]: valor,
          },
        },
      },
    }));
  };

  const calcularVAiken = (puntuacionesItem, escala, numJueces) => {
    const valores = Object.values(puntuacionesItem).map((v) => parseInt(v));
    if (valores.some((v) => isNaN(v) || v < 1 || v > escala)) {
      return null;
    }

    const S = valores.reduce((sum, val) => sum + (val - 1), 0);
    const n = numJueces;
    const c = escala;

    return S / (n * (c - 1));
  };

  const calcularResultados = () => {
    const criteriosActivos = Object.keys(proyecto.criterios).filter(
      (c) => proyecto.criterios[c]
    );
    const nuevosResultados = [];

    for (let item = 1; item <= proyecto.configuracion.numItems; item++) {
      const resultadoItem = {
        item,
        criterios: {},
        promedio: 0,
      };

      let sumaV = 0;
      let criteriosCalculados = 0;

      for (const criterio of criteriosActivos) {
        const puntuacionesCriterio = proyecto.datos[item]?.[criterio] || {};
        const vAiken = calcularVAiken(
          puntuacionesCriterio,
          proyecto.configuracion.escala,
          proyecto.configuracion.numJueces
        );

        if (vAiken !== null) {
          resultadoItem.criterios[criterio] = vAiken;
          sumaV += vAiken;
          criteriosCalculados++;
        }
      }

      if (criteriosCalculados > 0) {
        resultadoItem.promedio = sumaV / criteriosCalculados;
        nuevosResultados.push(resultadoItem);
      }
    }

    setProyecto((prev) => ({ ...prev, resultados: nuevosResultados }));
  };

  // Validaciones
  const validaciones = {
    configuracionCompleta: () => {
      return (
        proyecto.info.nombre.trim() !== "" &&
        proyecto.info.investigador.trim() !== ""
      );
    },

    criteriosDefinidos: () => {
      return Object.values(proyecto.criterios).some((c) => c === true);
    },

    datosCompletos: () => {
      const criteriosActivos = Object.keys(proyecto.criterios).filter(
        (c) => proyecto.criterios[c]
      );

      for (let item = 1; item <= proyecto.configuracion.numItems; item++) {
        for (const criterio of criteriosActivos) {
          for (let juez = 1; juez <= proyecto.configuracion.numJueces; juez++) {
            const valor = proyecto.datos[item]?.[criterio]?.[juez];
            if (
              !valor ||
              isNaN(parseInt(valor)) ||
              parseInt(valor) < 1 ||
              parseInt(valor) > proyecto.configuracion.escala
            ) {
              return false;
            }
          }
        }
      }
      return true;
    },

    puedeCalcular: () => {
      return (
        validaciones.configuracionCompleta() &&
        validaciones.criteriosDefinidos() &&
        validaciones.datosCompletos()
      );
    },
  };

  // Navegación
  const navegarA = (pantalla) => {
    setPantallaActiva(pantalla);
  };

  // Utilidades
  const limpiarProyecto = () => {
    const proyectoLimpio = {
      info: {
        nombre: "",
        investigador: "",
        institucion: "",
        fecha: new Date().toISOString().split("T")[0],
      },
      configuracion: {
        tipoValidacion: "contenido-basica",
        numJueces: 5,
        numItems: 10,
        escala: 4,
      },
      criterios: {
        relevancia: true,
        claridad: true,
        coherencia: false,
        suficiencia: false,
      },
      datos: {},
      resultados: [],
    };
    
    setProyecto(proyectoLimpio);
    setPantallaActiva("configuracion");
    setProyectoKey(Date.now());
  };

  // Persistencia (solo en web, no en Electron)
  useEffect(() => {
    // Solo cargar desde localStorage si NO estamos en Electron
    if (!window.electronAPI) {
      const proyectoGuardado = localStorage.getItem("proyecto-v-aiken");
      if (proyectoGuardado) {
        try {
          const proyectoParseado = JSON.parse(proyectoGuardado);
          setProyecto(proyectoParseado.proyecto || proyectoParseado);
          setPantallaActiva(proyectoParseado.pantallaActiva || "configuracion");
        } catch (error) {
          console.error("Error al cargar proyecto guardado:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    // Solo guardar en localStorage si NO estamos en Electron
    if (!window.electronAPI) {
      const dataToSave = {
        proyecto,
        pantallaActiva,
      };
      localStorage.setItem("proyecto-v-aiken", JSON.stringify(dataToSave));
    }
  }, [proyecto, pantallaActiva]);

  // Valor del Context
  const value = {
    proyecto,
    pantallaActiva,
    proyectoKey,
    navegarA,
    actualizarInfo,
    actualizarConfiguracion,
    actualizarCriterios,
    actualizarDatos,
    calcularResultados,
    validaciones,
    limpiarProyecto,
  };

  return (
    <ProyectoContext.Provider value={value}>
      {children}
    </ProyectoContext.Provider>
  );
};
