import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, LABOR_PRESETS, PRODUCTS } from "./catalog";
import { EMPTY_BUDGET, budgetText, calcTotals, findProduct, money, type Budget } from "./budget";

type Tab = "materiales" | "obra" | "resumen";

const STORAGE_KEY = "casu-budget";

function loadBudget(): Budget {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...EMPTY_BUDGET, ...(JSON.parse(raw) as Budget) };
  } catch {
    // Sin storage: arranca vacio.
  }
  return EMPTY_BUDGET;
}

export function App() {
  const [budget, setBudget] = useState<Budget>(loadBudget);
  const [tab, setTab] = useState<Tab>("materiales");
  const [category, setCategory] = useState("todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budget));
    } catch {
      // ignorar
    }
  }, [budget]);

  const totals = useMemo(() => calcTotals(budget), [budget]);

  function qtyOf(productId: string) {
    return budget.materials.find((line) => line.productId === productId)?.qty ?? 0;
  }

  function setQty(productId: string, qty: number) {
    setBudget((current) => {
      const exists = current.materials.some((line) => line.productId === productId);
      if (qty <= 0) return { ...current, materials: current.materials.filter((line) => line.productId !== productId) };
      if (exists) return { ...current, materials: current.materials.map((line) => (line.productId === productId ? { ...line, qty } : line)) };
      return { ...current, materials: [...current.materials, { productId, qty }] };
    });
  }

  function addLabor(presetId: string) {
    const preset = LABOR_PRESETS.find((item) => item.id === presetId);
    if (!preset) return;
    setBudget((current) => {
      const existing = current.labor.find((line) => line.id === preset.id);
      if (existing) {
        return { ...current, labor: current.labor.map((line) => (line.id === preset.id ? { ...line, qty: line.qty + 1 } : line)) };
      }
      return { ...current, labor: [...current.labor, { id: preset.id, name: preset.name, unit: preset.unit, price: preset.price, qty: 1 }] };
    });
  }

  function setLaborQty(id: string, qty: number) {
    setBudget((current) => ({
      ...current,
      labor: qty > 0 ? current.labor.map((line) => (line.id === id ? { ...line, qty } : line)) : current.labor.filter((line) => line.id !== id)
    }));
  }

  function setLaborPrice(id: string, price: number) {
    setBudget((current) => ({ ...current, labor: current.labor.map((line) => (line.id === id ? { ...line, price } : line)) }));
  }

  function resetBudget() {
    if (window.confirm("¿Empezar un presupuesto nuevo? Se borra el actual.")) setBudget(EMPTY_BUDGET);
  }

  const visibleProducts = PRODUCTS.filter(
    (product) =>
      (category === "todos" || product.category === category) && product.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <span className="brand-bolt">⚡</span>
          <div>
            <h1>Casu</h1>
            <p>Presupuestos eléctricos</p>
          </div>
        </div>
        <button type="button" className="ghost" onClick={resetBudget}>
          Nuevo
        </button>
      </header>

      <main className="content">
        {tab === "materiales" && (
          <section>
            <div className="card client">
              <input
                placeholder="Cliente"
                value={budget.client.name}
                onChange={(e) => setBudget({ ...budget, client: { ...budget.client, name: e.target.value } })}
              />
              <input
                placeholder="Obra (ej: Casa Pocitos, reforma cocina)"
                value={budget.client.work}
                onChange={(e) => setBudget({ ...budget, client: { ...budget.client, work: e.target.value } })}
              />
            </div>

            <input className="search" placeholder="🔎 Buscar material…" value={search} onChange={(e) => setSearch(e.target.value)} />

            <div className="chips">
              <button type="button" className={category === "todos" ? "chip on" : "chip"} onClick={() => setCategory("todos")}>
                Todo
              </button>
              {CATEGORIES.map((cat) => (
                <button key={cat.id} type="button" className={category === cat.id ? "chip on" : "chip"} onClick={() => setCategory(cat.id)}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            <ul className="list">
              {visibleProducts.map((product) => {
                const qty = qtyOf(product.id);
                return (
                  <li key={product.id} className={qty > 0 ? "item picked" : "item"}>
                    <div className="item-info">
                      <strong>{product.name}</strong>
                      <span>
                        {money(product.price)} / {product.unit}
                      </span>
                    </div>
                    {qty === 0 ? (
                      <button type="button" className="add" onClick={() => setQty(product.id, 1)}>
                        + Agregar
                      </button>
                    ) : (
                      <Stepper value={qty} onChange={(next) => setQty(product.id, next)} />
                    )}
                  </li>
                );
              })}
              {visibleProducts.length === 0 && <li className="empty">No hay materiales con ese nombre.</li>}
            </ul>
          </section>
        )}

        {tab === "obra" && (
          <section>
            <h2>Mano de obra</h2>
            <p className="hint">Tocá un trabajo para sumarlo. Podés cambiar el precio de cada uno.</p>
            <div className="chips wrap">
              {LABOR_PRESETS.map((preset) => (
                <button key={preset.id} type="button" className="chip" onClick={() => addLabor(preset.id)}>
                  + {preset.name}
                </button>
              ))}
            </div>
            <ul className="list">
              {budget.labor.map((line) => (
                <li key={line.id} className="item picked column">
                  <div className="item-info">
                    <strong>{line.name}</strong>
                    <span>{money(line.price * line.qty)}</span>
                  </div>
                  <div className="row-controls">
                    <label className="price-edit">
                      $ por {line.unit === "h" ? "hora" : "unidad"}
                      <input type="number" inputMode="numeric" value={line.price} onChange={(e) => setLaborPrice(line.id, Number(e.target.value) || 0)} />
                    </label>
                    <Stepper value={line.qty} onChange={(next) => setLaborQty(line.id, next)} />
                  </div>
                </li>
              ))}
              {budget.labor.length === 0 && <li className="empty">Todavía no sumaste trabajos.</li>}
            </ul>
          </section>
        )}

        {tab === "resumen" && (
          <section>
            <h2>Presupuesto</h2>
            <div className="card sheet">
              <div className="sheet-head">
                <strong>{budget.client.name || "Cliente sin nombre"}</strong>
                <span>{budget.client.work || "Instalación eléctrica"}</span>
              </div>

              <h3>Materiales</h3>
              {budget.materials.length === 0 && <p className="hint">Sin materiales.</p>}
              {budget.materials.map((line) => {
                const product = findProduct(line.productId);
                if (!product) return null;
                return (
                  <div key={line.productId} className="sheet-row">
                    <span>
                      {line.qty} × {product.name}
                    </span>
                    <b>{money(product.price * line.qty)}</b>
                  </div>
                );
              })}
              <div className="sheet-row sub">
                <span>Margen materiales ({budget.settings.margin}%)</span>
                <b>{money(totals.materialsMargin)}</b>
              </div>

              <h3>Mano de obra</h3>
              {budget.labor.length === 0 && <p className="hint">Sin mano de obra.</p>}
              {budget.labor.map((line) => (
                <div key={line.id} className="sheet-row">
                  <span>
                    {line.qty}
                    {line.unit === "h" ? " h" : " ×"} {line.name}
                  </span>
                  <b>{money(line.price * line.qty)}</b>
                </div>
              ))}

              <div className="sheet-row sub">
                <span>Subtotal</span>
                <b>{money(totals.subtotal)}</b>
              </div>
              {totals.discount > 0 && (
                <div className="sheet-row sub">
                  <span>Descuento ({budget.settings.discount}%)</span>
                  <b>-{money(totals.discount)}</b>
                </div>
              )}
              {budget.settings.iva && (
                <div className="sheet-row sub">
                  <span>IVA 22%</span>
                  <b>{money(totals.iva)}</b>
                </div>
              )}
              <div className="sheet-total">
                <span>TOTAL</span>
                <b>{money(totals.total)}</b>
              </div>
            </div>

            <div className="card settings">
              <label>
                Margen sobre materiales (%)
                <input
                  type="number"
                  inputMode="numeric"
                  value={budget.settings.margin}
                  onChange={(e) => setBudget({ ...budget, settings: { ...budget.settings, margin: Number(e.target.value) || 0 } })}
                />
              </label>
              <label>
                Descuento (%)
                <input
                  type="number"
                  inputMode="numeric"
                  value={budget.settings.discount}
                  onChange={(e) => setBudget({ ...budget, settings: { ...budget.settings, discount: Number(e.target.value) || 0 } })}
                />
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={budget.settings.iva}
                  onChange={(e) => setBudget({ ...budget, settings: { ...budget.settings, iva: e.target.checked } })}
                />
                Incluir IVA 22%
              </label>
            </div>

            <div className="actions">
              <a
                className="primary"
                href={"https://wa.me/?text=" + encodeURIComponent(budgetText(budget))}
                target="_blank"
                rel="noreferrer"
              >
                Enviar por WhatsApp
              </a>
              <button type="button" className="ghost" onClick={() => window.print()}>
                Imprimir / PDF
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="bottom">
        <div className="totalbar" onClick={() => setTab("resumen")}>
          <span>{totals.items} ítems</span>
          <b>{money(totals.total)}</b>
        </div>
        <nav>
          <button type="button" className={tab === "materiales" ? "on" : ""} onClick={() => setTab("materiales")}>
            🧰 Materiales
          </button>
          <button type="button" className={tab === "obra" ? "on" : ""} onClick={() => setTab("obra")}>
            🛠 Mano de obra
          </button>
          <button type="button" className={tab === "resumen" ? "on" : ""} onClick={() => setTab("resumen")}>
            📄 Presupuesto
          </button>
        </nav>
      </footer>
    </div>
  );
}

function Stepper({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  return (
    <div className="stepper">
      <button type="button" onClick={() => onChange(value - 1)} aria-label="Menos">
        −
      </button>
      <input type="number" inputMode="numeric" value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))} />
      <button type="button" onClick={() => onChange(value + 1)} aria-label="Más">
        +
      </button>
    </div>
  );
}
