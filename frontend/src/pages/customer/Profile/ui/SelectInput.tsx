import React from "react";

type SelectInputProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  isDark?: boolean;
};

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  options,
  onChange,
  isDark = false,
}) => {
  return (
    <div>
      <label
        className={`block text-sm font-medium mb-1 ${
          isDark ? "text-slate-300" : "text-slate-700"
        }`}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 ${
          isDark
            ? "bg-slate-800 border-slate-700 text-white"
            : "bg-white border-slate-300 text-slate-900"
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
