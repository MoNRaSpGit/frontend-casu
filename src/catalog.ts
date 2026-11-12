// Catalogo de ejemplo para instalaciones electricas (precios en pesos
// uruguayos, ficticios: sirven para la prueba).
export type Category = { id: string; label: string; icon: string };
export type Product = { id: string; category: string; name: string; unit: string; price: number };

export const CATEGORIES: Category[] = [
  { id: "cables", label: "Cables", icon: "🧵" },
  { id: "tomas", label: "Tomas y llaves", icon: "🔌" },
  { id: "tablero", label: "Tablero", icon: "🧰" },
  { id: "luz", label: "Iluminación", icon: "💡" },
  { id: "canal", label: "Canalización", icon: "🪈" },
  { id: "tierra", label: "Puesta a tierra", icon: "⏚" }
];

export const PRODUCTS: Product[] = [
  { id: "c-15", category: "cables", name: "Cable 1,5 mm² (rollo 100 m)", unit: "rollo", price: 2450 },
  { id: "c-25", category: "cables", name: "Cable 2,5 mm² (rollo 100 m)", unit: "rollo", price: 3900 },
  { id: "c-4", category: "cables", name: "Cable 4 mm² (rollo 100 m)", unit: "rollo", price: 6100 },
  { id: "c-6", category: "cables", name: "Cable 6 mm² (por metro)", unit: "m", price: 98 },
  { id: "c-tp", category: "cables", name: "Cable taller 3x1,5 mm² (por metro)", unit: "m", price: 74 },
  { id: "t-toma", category: "tomas", name: "Toma doble 10A con tierra", unit: "u", price: 290 },
  { id: "t-toma20", category: "tomas", name: "Toma 20A (aire / horno)", unit: "u", price: 410 },
  { id: "t-llave1", category: "tomas", name: "Llave simple (punto)", unit: "u", price: 185 },
  { id: "t-llave2", category: "tomas", name: "Llave doble (2 puntos)", unit: "u", price: 270 },
  { id: "t-comb", category: "tomas", name: "Llave combinación (pulsador)", unit: "u", price: 240 },
  { id: "t-tapa", category: "tomas", name: "Marco + tapa decorativa", unit: "u", price: 120 },
  { id: "b-ter2", category: "tablero", name: "Térmica 2x16A", unit: "u", price: 520 },
  { id: "b-ter3", category: "tablero", name: "Térmica 2x25A", unit: "u", price: 560 },
  { id: "b-dif", category: "tablero", name: "Disyuntor diferencial 2x40A 30mA", unit: "u", price: 2300 },
  { id: "b-gab", category: "tablero", name: "Gabinete tablero 12 módulos", unit: "u", price: 1450 },
  { id: "b-sobre", category: "tablero", name: "Protector de sobretensión", unit: "u", price: 3200 },
  { id: "l-spot", category: "luz", name: "Spot LED embutir 7W", unit: "u", price: 210 },
  { id: "l-panel", category: "luz", name: "Panel LED 18W", unit: "u", price: 690 },
  { id: "l-plaf", category: "luz", name: "Plafón LED aplicar 24W", unit: "u", price: 880 },
  { id: "l-cinta", category: "luz", name: "Tira LED 5 m + fuente", unit: "u", price: 1190 },
  { id: "l-lamp", category: "luz", name: "Lámpara LED E27 9W", unit: "u", price: 95 },
  { id: "k-cano", category: "canal", name: "Caño corrugado 3/4 (rollo 25 m)", unit: "rollo", price: 640 },
  { id: "k-caja", category: "canal", name: "Caja de paso 10x10", unit: "u", price: 85 },
  { id: "k-cajet", category: "canal", name: "Caja rectangular embutir", unit: "u", price: 38 },
  { id: "k-bande", category: "canal", name: "Canaleta 20x10 (2 m)", unit: "u", price: 260 },
  { id: "p-jab", category: "tierra", name: "Jabalina cobre 5/8 x 1,5 m", unit: "u", price: 980 },
  { id: "p-cable", category: "tierra", name: "Cable verde/amarillo 6 mm² (por metro)", unit: "m", price: 92 },
  { id: "p-bor", category: "tierra", name: "Borne de conexión a tierra", unit: "u", price: 140 }
];

export type LaborPreset = { id: string; name: string; unit: "u" | "h"; price: number };

export const LABOR_PRESETS: LaborPreset[] = [
  { id: "m-boca", name: "Boca de luz (cañería + cableado)", unit: "u", price: 650 },
  { id: "m-toma", name: "Toma (cañería + cableado)", unit: "u", price: 580 },
  { id: "m-llave", name: "Llave / punto de comando", unit: "u", price: 420 },
  { id: "m-tablero", name: "Armado de tablero", unit: "u", price: 4200 },
  { id: "m-tierra", name: "Puesta a tierra completa", unit: "u", price: 3800 },
  { id: "m-visita", name: "Visita técnica / relevamiento", unit: "u", price: 900 },
  { id: "m-hora", name: "Hora de trabajo", unit: "h", price: 750 }
];
