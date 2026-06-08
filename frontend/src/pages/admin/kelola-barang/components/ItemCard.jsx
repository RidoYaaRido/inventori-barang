import { useState } from "react";
import { fmt, STATUS_LABELS } from "../utils/helper";
import { Pencil, Trash2 } from "lucide-react";
import "../utils/style.css";

export default function ItemCard({ item, onEdit, onDelete }) {
  const barPct =
    item.minStock > 0
      ? Math.min((item.stock / (item.minStock * 4)) * 100, 100)
      : 100;

  return (
    <div className="kb-card">
      {/* Status badge */}
      <span className={`kb-card__badge kb-card__badge--${item.status}`}>
        {STATUS_LABELS[item.status]}
      </span>

      {/* Action buttons */}
      <div className="kb-card__actions">
        <button
          className="kb-card__action-btn kb-card__action-btn--edit"
          onClick={() => onEdit(item)}
          title="Edit barang"
        >
          <Pencil size={13} />
        </button>
        <button
          className="kb-card__action-btn kb-card__action-btn--delete"
          onClick={() => onDelete(item.id)}
          title="Hapus barang"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Product info */}
      <div className="kb-card__product">
        <img className="kb-card__img" src={item.image} alt={item.name} />
        <div>
          <div className="kb-card__name">{item.name}</div>
          <div className="kb-card__cat">
            <span
              className={`kb-card__cat-dot kb-card__cat-dot--${item.status}`}
            />
            {item.categoryLabel}
          </div>
          <div className="kb-card__sku">{item.sku}</div>
        </div>
      </div>

      <div className="kb-card__divider" />

      {/* Pricing row */}
      <div className="kb-card__pricing">
        <div>
          <div className="kb-card__price-label">Harga Satuan</div>
          <div className="kb-card__price">{fmt(item.price)}</div>
        </div>
        <div className="kb-card__min">Min: {item.minStock}</div>
      </div>

      {/* Stock bar */}
      <div className="kb-card__stock-row">
        <span className="kb-card__stock-label">
          Stok: <strong>{item.stock} units</strong>
        </span>
      </div>
      <div className="kb-card__bar-track">
        <div
          className={`kb-card__bar-fill kb-card__bar-fill--${item.status}`}
          style={{ width: `${barPct}%` }}
        />
      </div>
    </div>
  );
}
