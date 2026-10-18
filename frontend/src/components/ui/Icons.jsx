import { forwardRef } from "react";

// Iconos locales dibujados con SVG. Solo requieren React.
function createIcon(name, drawing) {
  const Icon = forwardRef(function LocalIcon(
    { size = 24, color = "currentColor", strokeWidth = 2, title, ...props },
    ref,
  ) {
    const named = Boolean(title || props["aria-label"] || props["aria-labelledby"]);
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={named ? undefined : true}
        role={named ? "img" : undefined}
        focusable="false"
        {...props}
      >
        {title && <title>{title}</title>}
        {drawing}
      </svg>
    );
  });
  Icon.displayName = `${name}Icon`;
  return Icon;
}

export const Menu = createIcon("Menu", <path d="M4 5h16M4 12h16M4 19h16" />);
export const X = createIcon("X", <path d="m5 5 14 14M19 5 5 19" />);
export const Plus = createIcon("Plus", <path d="M12 4v16M4 12h16" />);
export const ArrowLeft = createIcon("ArrowLeft", <path d="M20 12H4m6-6-6 6 6 6" />);
export const ArrowRight = createIcon("ArrowRight", <path d="M4 12h16m-6-6 6 6-6 6" />);
export const ArrowUpRight = createIcon("ArrowUpRight", <path d="M6 18 18 6M6 6h12v12" />);
export const ChevronLeft = createIcon("ChevronLeft", <path d="m15 5-7 7 7 7" />);
export const ChevronRight = createIcon("ChevronRight", <path d="m9 5 7 7-7 7" />);
export const AudioLines = createIcon("AudioLines", <path d="M3 10v4M7 6v12M12 3v18M17 7v10M21 10v4" />);
export const Search = createIcon("Search", <><circle cx="10" cy="10" r="6" /><path d="m15 15 6 6" /></>);
export const Bell = createIcon("Bell", <><path d="M6 15V9a6 6 0 0 1 12 0v6l2 3H4l2-3Zm4 6h4" /><path d="M12 3V2" /></>);
export const LayoutDashboard = createIcon("LayoutDashboard", <><rect x="3" y="3" width="7" height="10" rx="1" /><rect x="14" y="3" width="7" height="6" rx="1" /><rect x="3" y="17" width="7" height="4" rx="1" /><rect x="14" y="13" width="7" height="8" rx="1" /></>);
export const ChartNoAxesCombined = createIcon("ChartNoAxesCombined", <path d="M4 20v-5m5 5V9m5 11v-7m5 7V5M3 10l6-6 5 3 7-5" />);
export const ShoppingBag = createIcon("ShoppingBag", <><path d="M5 8h14l2 13H3L5 8Z" /><path d="M8 9V6a4 4 0 0 1 8 0v3" /></>);
export const Package = createIcon("Package", <><path d="m3 7 9-5 9 5v10l-9 5-9-5V7Zm0 0 9 5 9-5M12 12v10" /><path d="m7 5 9 5" /></>);
export const CircleDollarSign = createIcon("CircleDollarSign", <><circle cx="12" cy="12" r="10" /><path d="M12 5v14m4-11h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8" /></>);
export const Download = createIcon("Download", <path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" />);
export const LogOut = createIcon("LogOut", <path d="M9 3H4v18h5m5-14 5 5-5 5M8 12h11" />);
export const ReceiptText = createIcon("ReceiptText", <><path d="M5 2h14v20l-3-2-4 2-4-2-3 2V2Z" /><path d="M9 7h6M9 11h6M9 15h4" /></>);
export const AlertTriangle = createIcon("AlertTriangle", <><path d="M12 3 2 21h20L12 3Z" /><path d="M12 9v5m0 3v1" /></>);
export const CheckCircle2 = createIcon("CheckCircle2", <><circle cx="12" cy="12" r="10" /><path d="m7 12 3 3 7-7" /></>);
export const ShieldCheck = createIcon("ShieldCheck", <><path d="m12 2 8 3v7c0 5-8 10-8 10S4 17 4 12V5l8-3Z" /><path d="m8 11 3 3 5-5" /></>);
export const ShieldX = createIcon("ShieldX", <><path d="m12 2 8 3v7c0 5-8 10-8 10S4 17 4 12V5l8-3Z" /><path d="m9 9 6 6m0-6-6 6" /></>);
export const Users = createIcon("Users", <><circle cx="9" cy="7" r="4" /><path d="M2 21v-3a7 7 0 0 1 14 0v3m1-17a4 4 0 0 1 0 8m2 3c2 1 3 3 3 6" /></>);
export const UserCheck = createIcon("UserCheck", <><circle cx="8" cy="7" r="4" /><path d="M1 21v-3a7 7 0 0 1 13-4m1-3 3 3 5-5" /></>);
export const UserX = createIcon("UserX", <><circle cx="8" cy="7" r="4" /><path d="M1 21v-3a7 7 0 0 1 13-4m3-6 6 6m0-6-6 6" /></>);
export const Pencil = createIcon("Pencil", <><path d="m3 16-1 6 6-1L21 8l-5-5L3 16Zm0 0 5 5m5-15 5 5" /><path d="m16 3 2-2 5 5-2 2" /></>);
export const Puzzle = createIcon("Puzzle", <path d="M3 3h6V2a3 3 0 0 1 6 0v1h6v6h1a3 3 0 0 1 0 6h-1v6h-6v-1a3 3 0 0 0-6 0v1H3v-6h1a3 3 0 0 0 0-6H3V3Z" />);
