#!/bin/bash

# Script para limpiar archivos de desarrollo y generar solo el ejecutable final

echo "🧹 Limpiando archivos de desarrollo..."

# Eliminar archivos temporales
rm -rf node_modules/.cache
rm -rf dist
rm -rf release/linux-unpacked
rm -rf release/__appImage-x64

echo "✅ Limpieza completada"
echo "📦 Ejecutable disponible en: release/Validador Aiken-1.0.0.AppImage"

# Mostrar tamaño del ejecutable
if [ -f "release/Validador Aiken-1.0.0.AppImage" ]; then
    SIZE=$(du -h "release/Validador Aiken-1.0.0.AppImage" | cut -f1)
    echo "📏 Tamaño del ejecutable: $SIZE"
fi