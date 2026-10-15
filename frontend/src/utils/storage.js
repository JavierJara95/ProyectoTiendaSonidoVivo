export function guardarDatos(clave, datos) {
  localStorage.setItem(
    clave,
    JSON.stringify(datos)
  )
}

export function cargarDatos(clave, datosIniciales) {
  const datosGuardados = localStorage.getItem(clave)

  if (!datosGuardados) {
    return datosIniciales
  }

  try {
    return JSON.parse(datosGuardados)
  } catch {
    return datosIniciales
  }
}