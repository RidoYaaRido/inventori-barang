import "../utils/style.css";
import { ChevronDown } from "lucide-react";
import { ROLES, roleMeta } from "../utils/data";

export default function RoleSelect({ value, onChange }) {
  const meta = roleMeta[value] || { bg: "#f1f5f9", color: "#475569" };
  return (
    <div className="role-select-wrapper">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="role-select-element"
        style={{
          border: `1.5px solid ${meta.color}30`,
          background: meta.bg,
          color: meta.color,
        }}
      >
        {ROLES.map(r => <option key={r}>{r}</option>)}
      </select>
      <ChevronDown size={14} className="role-select-chevron" style={{ color: meta.color }} />
    </div>
  );
}