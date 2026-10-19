export function csvCell(value) {
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}
export function salesCsv(sales) {
  const rows = [
    ["Pedido", "Fecha", "Cliente", "Entrega", "Estado", "Total CLP"],
    ...sales.map((order) => [
      order.id,
      order.fecha,
      order.clienteNombre,
      order.tipoEntrega,
      order.estado,
      order.total,
    ]),
  ];
  return "\uFEFF" + rows.map((row) => row.map(csvCell).join(";")).join("\r\n");
}
export function downloadCsv(sales) {
  const url = URL.createObjectURL(
    new Blob([salesCsv(sales)], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "sonido-vivo-ventas.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
