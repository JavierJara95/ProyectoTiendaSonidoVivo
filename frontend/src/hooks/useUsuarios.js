import { useCallback, useEffect, useState } from "react";
import { listUsers } from "../services/usuariosService";

export function useUsuarios() {
  const [users, setUsers] = useState([]);
  const [listError, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision(n => n + 1), []);
  useEffect(() => {
    let active = true;
    listUsers().then(data => {
      if (active) { setUsers(data); setError(""); }
    }).catch(error => { if (active) setError(error.message); });
    return () => { active = false; };
  }, [revision]);
  return { users, listError, refresh };
}
