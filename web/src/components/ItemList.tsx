import React, { useEffect, useState } from "react";
import { type Item, listItems, createItem as apiCreate, updateItem as apiUpdate, deleteItem as apiDelete } from "../api/items";
import Loader from "./Loader";
import ItemForm from "./ItemForm";

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Item | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listItems();
      setItems(res);
    } catch (err: any) {
      setError(err.message || "Error al listar items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleCreate = async (payload: Partial<Item>) => {
    try {
      const saved = await apiCreate(payload);
      setItems((s) => [saved, ...s]);
      setShowForm(false);
    } catch (err: any) {
      alert("Error creando item: " + (err.message || err));
    }
  };

  const handleUpdate = async (id: string, payload: Partial<Item>) => {
    try {
      const updated = await apiUpdate(id, payload);
      setItems((s) => s.map((it) => (it.itemId === id ? updated : it)));
      setEditing(null);
      setShowForm(false);
    } catch (err: any) {
      alert("Error actualizando item: " + (err.message || err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este item?")) return;
    try {
      await apiDelete(id);
      setItems((s) => s.filter((it) => it.itemId !== id));
    } catch (err: any) {
      alert("Error eliminando: " + (err.message || err));
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="card error">Error: {error}</div>;

  return (
    <section>
      <div className="toolbar">
        <button className="btn" onClick={() => { setShowForm((s) => !s); setEditing(null); }}>
          Nuevo producto
        </button>
        <button className="btn btn-secondary" onClick={fetch}>Refrescar</button>
      </div>

      {showForm && (
        <div className="card">
          <h3>{editing ? "Editar producto" : "Crear producto"}</h3>
          <FormContainer
            initial={editing || undefined}
            onCancel={() => { setShowForm(false); setEditing(null); }}
            onSaved={async (itemOrPayload: any) => {
              // parent handles API calls here: if editing -> update else create
              if (editing) {
                await handleUpdate(editing.itemId, itemOrPayload);
              } else {
                await handleCreate(itemOrPayload);
              }
            }}
          />
        </div>
      )}

      <div className="grid">
        {items.length === 0 && <div className="card">No hay productos.</div>}
        {items.map((it) => (
          <article key={it.itemId} className="card">
            <h3>{it.name}</h3>
            <p className="muted">{it.description}</p>
            <div className="meta">
              <strong>{it.price != null ? `$ ${it.price}` : "-"}</strong>
              <time>{new Date(it.createdAt || "").toLocaleString()}</time>
            </div>
            <div className="actions">
              <button className="btn btn-link" onClick={() => { setEditing(it); setShowForm(true); }}>
                Editar
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(it.itemId)}>Borrar</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/**
 * Small adapter: FormContainer uses ItemForm internals and handles submit to parent
 */
function FormContainer({ initial, onCancel, onSaved }: { initial?: Partial<Item>, onCancel?: () => void, onSaved: (payload: Partial<Item>) => Promise<void> }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [price, setPrice] = useState(initial?.price?.toString() || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(initial?.name || "");
    setDescription(initial?.description || "");
    setPrice(initial?.price?.toString() || "");
  }, [initial]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("El nombre es obligatorio");
    setSaving(true);
    try {
      const payload: Partial<Item> = { name: name.trim(), description: description.trim(), price: price ? Number(price) : undefined };
      await onSaved(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <label>
        Nombre
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Descripción
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        Precio
        <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" />
      </label>
      <div className="actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>Cancelar</button>
        <button type="submit" className="btn" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
      </div>
    </form>
  );
}
