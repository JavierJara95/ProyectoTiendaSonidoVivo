import { AudioLines } from "../ui/Icons";
export default function Brand({ light = false }) {
  return (
    <span className={`brand ${light ? "brand-light" : ""}`}>
      <span className="brand-mark">
        <AudioLines size={25} aria-hidden="true" />
      </span>
      <span>
        sonido<span className="brand-vivo">vivo</span>
        <small>INSTRUMENTOS & SONIDO</small>
      </span>
    </span>
  );
}
