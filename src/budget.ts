import { PRODUCTS } from "./catalog";

export type MaterialLine = { productId: string; qty: number };
export type LaborLine = { id: string; name: string; unit: "u" | "h"; price: number; qty: number };
export type Client = { name: string; work: string; phone: string };
export type Settings = { margin: number; discount: number; iva: boolean };
export type Budget = { client: Client; materials: MaterialLine[]; labor: LaborLine[]; settings: Settings };

export const EMPTY_BUDGET: Budget = {
  client: { name: "", work: "", phone: "" },
  materials: [],
  labor: [],
  settings: { margin: 20, discount: 0, iva: true }
};

export const IVA_RATE = 0.22;

export function findProduct(id: string) {
  return PRODUCTS.find((product) => product.id === id);
}

export function calcTotals(budget: Budget) {
  const materialsCost = budget.materials.reduce((sum, line) => sum + (findProduct(line.productId)?.price ?? 0) * line.qty, 0);
  const materialsMargin = materialsCost * (budget.settings.margin / 100);
  const materialsTotal = materialsCost + materialsMargin;
  const laborTotal = budget.labor.reduce((sum, line) => sum + line.price * line.qty, 0);
  const subtotal = materialsTotal + laborTotal;
  const discount = subtotal * (budget.settings.discount / 100);
  const taxable = subtotal - discount;
  const iva = budget.settings.iva ? taxable * IVA_RATE : 0;
  const total = taxable + iva;
  const items = budget.materials.reduce((sum, line) => sum + line.qty, 0) + budget.labor.length;
  return { materialsCost, materialsMargin, materialsTotal, laborTotal, subtotal, discount, iva, total, items };
}

export function money(value: number) {
  return "$ " + Math.round(value).toLocaleString("es-UY");
}

export function budgetText(budget: Budget): string {
  const totals = calcTotals(budget);
  const lines: string[] = ["⚡ *Presupuesto de instalación eléctrica*"];
  if (budget.client.name) lines.push("Cliente: " + budget.client.name);
  if (budget.client.work) lines.push("Obra: " + budget.client.work);
  lines.push("", "*Materiales*");
  for (const line of budget.materials) {
    const product = findProduct(line.productId);
    if (product) lines.push("• " + line.qty + " x " + product.name);
  }
  lines.push("Subtotal materiales: " + money(totals.materialsTotal), "", "*Mano de obra*");
  for (const line of budget.labor) {
    lines.push("• " + line.qty + (line.unit === "h" ? " h " : " x ") + line.name + ": " + money(line.price * line.qty));
  }
  lines.push("Subtotal mano de obra: " + money(totals.laborTotal), "");
  if (totals.discount > 0) lines.push("Descuento: -" + money(totals.discount));
  if (budget.settings.iva) lines.push("IVA 22%: " + money(totals.iva));
  lines.push("*TOTAL: " + money(totals.total) + "*");
  return lines.join("\n");
}
