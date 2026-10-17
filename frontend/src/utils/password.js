// PBKDF2 evita guardar contraseñas legibles. Esta demostración NO sustituye un backend seguro.
const iterations = 100000;
const encoder = new TextEncoder();
const hex = (bytes) =>
  Array.from(new Uint8Array(bytes), (n) =>
    n.toString(16).padStart(2, "0"),
  ).join("");
async function derive(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  return hex(
    await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: encoder.encode(salt),
        iterations,
        hash: "SHA-256",
      },
      key,
      256,
    ),
  );
}
export async function hashPassword(password) {
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  return { salt, hash: await derive(password, salt) };
}
export async function verifyPassword(password, credential) {
  if (!credential?.salt || !credential?.hash) return false;
  return (await derive(password, credential.salt)) === credential.hash;
}
