import React, { useState, useEffect } from "react";
import type { Item } from "../api/items";

type Props = {
  initial?: Partial<Item>;
  onCancel?: () => void;
  onSaved: (item: Item) => void;
};

export default function ItemForm({ initial = {}, onCancel, onSaved }: Props) {
  const [name, setName] = useState(initial.name || "");
  const [description, setDescription] = useState(initial.description || "");
  const [price, setPrice] = useState(initial.price?.toString() || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(initial.name || "");
    setDescription(initial.description || "");
    setPrice(initial.price?.toString() || "");
  }, [initial]);

  const valid = name.trim().length > 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);
    try {
      // the parent will call API create/update; we just pass payload
      const payload: Partial<Item> = {
        name: name.trim(),
        description: description.trim(),
        price: price ? Number(price) : undefined,
      };
      // parent handles API call through onSaved (convenience)
      // emit payload via custom event pattern: onSaved expects saved item; parent may call createItem
      // But to simplify, parent will call API and pass saved item back.
      // So here we call onSaved with placeholder to indicate submit requested.
      // Better: parent will pass its own handler that performs API call.
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="card form">
      <label>
        Nombre
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Descripción
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <label>
        Precio
        <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" />
      </label>

      <div className="actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
        <button type="submit" className="btn" disabled={!valid || saving}>
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
