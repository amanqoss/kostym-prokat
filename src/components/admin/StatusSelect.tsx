"use client";

type Option = { value: string; label: string };

export default function StatusSelect({
  defaultValue,
  options,
  onChangeAction,
}: {
  defaultValue: string;
  options: Option[];
  onChangeAction: (value: string) => Promise<void>;
}) {
  return (
    <select
      defaultValue={defaultValue}
      onChange={(e) => onChangeAction(e.target.value)}
      className="rounded-lg border border-border px-2 py-1 text-xs"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
