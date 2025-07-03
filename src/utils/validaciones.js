export const validarConfiguracion = (proyecto) => {
  const errores = [];

  // Validar informaci�n b�sica
  if (!proyecto.info.nombre?.trim()) {
    errores.push("El nombre del proyecto es obligatorio");
  }

  if (!proyecto.info.investigador?.trim()) {
    errores.push("El investigador principal es obligatorio");
  }

  // Validar configuraci�n metodol�gica
  if (!proyecto.configuracion.tipoValidacion) {
    errores.push("Debe seleccionar un tipo de validaci�n");
  }

  if (proyecto.configuracion.numJueces < 3) {
    errores.push("Se requieren al menos 3 jueces para la validaci�n");
  }

  if (proyecto.configuracion.numJueces > 20) {
    errores.push("No se recomienda m�s de 20 jueces");
  }

  if (proyecto.configuracion.numItems < 1) {
    errores.push("Debe tener al menos 1 �tem");
  }

  if (proyecto.configuracion.numItems > 100) {
    errores.push("No se recomienda m�s de 100 �tems");
  }

  if (![3, 4, 5].includes(proyecto.configuracion.escala)) {
    errores.push("La escala debe ser de 3, 4 o 5 puntos");
  }

  return {
    esValido: errores.length === 0,
    errores
  };
};

export const validarCriterios = (criterios) => {
  const errores = [];
  const criteriosSeleccionados = Object.values(criterios).filter(Boolean);

  if (criteriosSeleccionados.length === 0) {
    errores.push("Debe seleccionar al menos un criterio de evaluaci�n");
  }

  // Validar criterios obligatorios seg�n el tipo
  if (!criterios.relevancia && !criterios.claridad) {
    errores.push("Relevancia y Claridad son criterios fundamentales");
  }

  return {
    esValido: errores.length === 0,
    errores
  };
};

export const validarDatos = (datos, configuracion, criterios) => {
  const errores = [];
  const criteriosActivos = Object.keys(criterios).filter(c => criterios[c]);

  for (let item = 1; item <= configuracion.numItems; item++) {
    for (const criterio of criteriosActivos) {
      for (let juez = 1; juez <= configuracion.numJueces; juez++) {
        const valor = datos[item]?.[criterio]?.[juez];
        
        if (!valor) {
          errores.push(`Falta puntuaci�n: �tem ${item}, ${criterio}, Juez ${juez}`);
          continue;
        }

        const puntuacion = parseInt(valor);
        if (isNaN(puntuacion) || puntuacion < 1 || puntuacion > configuracion.escala) {
          errores.push(`Puntuaci�n inv�lida: �tem ${item}, ${criterio}, Juez ${juez} (${valor})`);
        }
      }
    }
  }

  return {
    esValido: errores.length === 0,
    errores,
    progreso: {
      total: configuracion.numItems * criteriosActivos.length * configuracion.numJueces,
      completados: calcularDatosCompletos(datos, configuracion, criterios)
    }
  };
};

export const calcularDatosCompletos = (datos, configuracion, criterios) => {
  const criteriosActivos = Object.keys(criterios).filter(c => criterios[c]);
  let completados = 0;

  for (let item = 1; item <= configuracion.numItems; item++) {
    for (const criterio of criteriosActivos) {
      for (let juez = 1; juez <= configuracion.numJueces; juez++) {
        const valor = datos[item]?.[criterio]?.[juez];
        const puntuacion = parseInt(valor);
        
        if (!isNaN(puntuacion) && puntuacion >= 1 && puntuacion <= configuracion.escala) {
          completados++;
        }
      }
    }
  }

  return completados;
};

export const validarVAiken = (puntuaciones, escala, numJueces) => {
  const errores = [];
  
  if (!Array.isArray(puntuaciones)) {
    errores.push("Las puntuaciones deben ser un array");
    return { esValido: false, errores };
  }

  if (puntuaciones.length !== numJueces) {
    errores.push(`Se esperan ${numJueces} puntuaciones, se recibieron ${puntuaciones.length}`);
  }

  for (let i = 0; i < puntuaciones.length; i++) {
    const puntuacion = parseInt(puntuaciones[i]);
    if (isNaN(puntuacion) || puntuacion < 1 || puntuacion > escala) {
      errores.push(`Puntuaci�n ${i + 1} inv�lida: ${puntuaciones[i]}`);
    }
  }

  return {
    esValido: errores.length === 0,
    errores
  };
};

export const interpretarVAiken = (valor) => {
  if (valor >= 0.80) {
    return {
      nivel: "valido",
      texto: "V�lido",
      descripcion: "Consenso fuerte entre jueces. El �tem es v�lido para el constructo.",
      color: "green",
      recomendacion: "Mantener el �tem sin modificaciones"
    };
  } else if (valor >= 0.70) {
    return {
      nivel: "aceptable",
      texto: "Aceptable",
      descripcion: "Consenso moderado entre jueces. El �tem es aceptable con peque�os ajustes.",
      color: "yellow",
      recomendacion: "Considerar peque�as modificaciones para mejorar la claridad"
    };
  } else {
    return {
      nivel: "revisar",
      texto: "Revisar",
      descripcion: "Consenso insuficiente entre jueces. El �tem requiere revisi�n.",
      color: "red",
      recomendacion: "Modificar sustancialmente o eliminar el �tem"
    };
  }
};

export const generarReporte = (resultados, configuracion, criterios) => {
  const criteriosActivos = Object.keys(criterios).filter(c => criterios[c]);
  const promedios = resultados.map(r => r.promedio);
  
  const estadisticas = {
    total: resultados.length,
    promedio: promedios.reduce((a, b) => a + b, 0) / promedios.length,
    validos: promedios.filter(p => p >= 0.80).length,
    aceptables: promedios.filter(p => p >= 0.70 && p < 0.80).length,
    revisar: promedios.filter(p => p < 0.70).length,
    maximo: Math.max(...promedios),
    minimo: Math.min(...promedios)
  };

  const recomendaciones = [];
  
  if (estadisticas.revisar > 0) {
    recomendaciones.push(`${estadisticas.revisar} �tems requieren revisi�n (V < 0.70)`);
  }
  
  if (estadisticas.aceptables > 0) {
    recomendaciones.push(`${estadisticas.aceptables} �tems son aceptables pero podr�an mejorarse`);
  }
  
  if (estadisticas.validos === estadisticas.total) {
    recomendaciones.push("Todos los �tems son v�lidos. Excelente validez de contenido.");
  }

  return {
    estadisticas,
    recomendaciones,
    criteriosEvaluados: criteriosActivos.length,
    metadatos: {
      escala: configuracion.escala,
      numJueces: configuracion.numJueces,
      tipoValidacion: configuracion.tipoValidacion
    }
  };
};