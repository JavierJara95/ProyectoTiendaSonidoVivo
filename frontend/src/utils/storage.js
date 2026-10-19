const EVENT = "sonido-vivo:datos-actualizados";
export function readStorage(key, fallback = []) {
  const value = localStorage.getItem(key);
  if (value === null) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(
      "No se pudieron leer los datos guardados. Revisa el almacenamiento del navegador.",
    );
  }
}
export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVENT));
}
export function subscribeStorage(callback) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
export function notifySessionChanged() {
  window.dispatchEvent(new Event(EVENT));
}
