import { type ReactNode } from "react";

interface FormInputProps {
  label: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  isDark: boolean;
  type?: string;
  icon?: ReactNode;
  disabled?: boolean;
  maxLength?: number;
}

const FormInput = ({
  label,
  defaultValue,
  value,
  onChange,
  isDark,
  type = "text",
  icon,
  disabled,
  maxLength
}: FormInputProps) => (
    <div>
      <label
        className={`block text-sm font-medium mb-2 ${
          isDark ? "text-slate-300" : "text-slate-700"
        }`}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {icon}
          </div>
        )}
        <input
          type={type}
          defaultValue={defaultValue}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
            isDark
              ? "bg-[#313131] border-slate-700 text-white placeholder-slate-500 focus:ring-red-600"
              : "bg-neutral-50 border-neutral-200 text-slate-900 placeholder-slate-400 focus:ring-red-500"
          }`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    </div>
);

export default FormInput;
