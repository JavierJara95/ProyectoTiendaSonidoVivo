// Ejecutar desde la raíz del repositorio: node corregir-iconos.cjs
// Cambia las importaciones y retira la dependencia sin instalar paquetes.
const fs = require("node:fs");
const path = require("node:path");

try {
  const root = path.resolve(process.argv[2] || process.cwd());
  const frontend = fs.existsSync(path.join(root, "src")) && fs.existsSync(path.join(root, "package.json"))
    ? root : path.join(root, "frontend");
  const sourceRoot = path.join(frontend, "src");
  if (!fs.existsSync(sourceRoot)) throw new Error("Ejecuta este archivo desde la carpeta del repositorio que contiene frontend.");
  const suppliedIconPath = path.join(__dirname, "frontend", "src", "components", "ui", "Icons.jsx");
  const iconSource = fs.readFileSync(suppliedIconPath, "utf8");
  const supported = new Set([...iconSource.matchAll(/export const (\w+)\s*=/g)].map(match => match[1]));
  const targetIconPath = path.join(sourceRoot, "components", "ui", "Icons.jsx");
  const changes = [];
  const missing = new Set();
  function walk(directory) {
    for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
      if (item.isSymbolicLink()) continue;
      const file = path.join(directory, item.name);
      if (item.isDirectory()) walk(file);
      else if (/\.[cm]?[jt]sx?$/.test(item.name)) {
        const original = fs.readFileSync(file, "utf8");
        const updated = original.replace(/\bimport\s*\{([^}]*)\}\s*from\s*(["'])lucide-react\2\s*;?/g,
          (statement, names, quote) => {
            for (const name of names.split(",").map(value => value.trim()).filter(Boolean)) {
              const imported = name.split(/\s+as\s+/)[0];
              if (!supported.has(imported)) missing.add(imported);
            }
            let relative = path.relative(path.dirname(file), targetIconPath).split(path.sep).join("/");
            if (!relative.startsWith(".")) relative = "./" + relative;
            return `import {${names}} from ${quote}${relative}${quote};`;
          });
        if (/(?:from\s*|require\s*\(|import\s*\()(["'])lucide-react\1/.test(updated))
          throw new Error(`Importación no compatible en ${path.relative(frontend, file)}. No se aplicaron cambios.`);
        if (updated !== original) changes.push({ file, original, updated });
      }
    }
  }
  walk(sourceRoot);
  if (missing.size) throw new Error("Estos iconos aún no tienen un reemplazo local: " + [...missing].join(", ") + ". No se aplicaron cambios.");
  if (fs.existsSync(targetIconPath)) {
    const original = fs.readFileSync(targetIconPath, "utf8");
    if (original !== iconSource) changes.push({ file: targetIconPath, original, updated: iconSource });
  } else changes.push({ file: targetIconPath, original: null, updated: iconSource });
  for (const name of ["package.json", "package-lock.json"]) {
    const file = path.join(frontend, name);
    if (!fs.existsSync(file)) continue;
    const original = fs.readFileSync(file, "utf8");
    const data = JSON.parse(original);
    let changed = false;
    const remove = object => {
      if (object && Object.hasOwn(object, "lucide-react")) {
        delete object["lucide-react"];
        changed = true;
      }
    };
    for (const field of ["dependencies", "devDependencies", "optionalDependencies"]) {
      remove(data[field]);
      remove(data.packages?.[""]?.[field]);
    }
    const transitive = Object.entries(data.packages || {}).some(([key, item]) =>
      key && key !== "node_modules/lucide-react" && ["dependencies", "optionalDependencies", "peerDependencies"].some(field => item[field]?.["lucide-react"]));
    if (!transitive && data.packages?.["node_modules/lucide-react"]) {
      delete data.packages["node_modules/lucide-react"];
      changed = true;
    }
    if (changed) {
      const indent = original.match(/\n([\t ]+)"/)?.[1] || "  ";
      let updated = JSON.stringify(data, null, indent) + "\n";
      if (original.includes("\r\n")) updated = updated.replace(/\n/g, "\r\n");
      changes.push({ file, original, updated });
    }
  }
  const written = [];
  try {
    for (const change of changes) {
      written.push(change);
      fs.mkdirSync(path.dirname(change.file), { recursive: true });
      fs.writeFileSync(change.file, change.updated);
    }
  } catch (error) {
    for (const change of written.reverse()) {
      if (change.original === null) fs.rmSync(change.file, { force: true });
      else fs.writeFileSync(change.file, change.original);
    }
    throw error;
  }
  console.log(`Listo. ${changes.length} archivos actualizados; iconos locales de React preparados.`);
  for (const change of changes) console.log("- " + path.relative(root, change.file));
  console.log("Guarda los cambios en tu rama desde GitHub Desktop.");
} catch (error) {
  console.error("No se pudo aplicar la corrección: " + error.message);
  process.exitCode = 1;
}
