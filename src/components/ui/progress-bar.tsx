"use client";

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  max,
  color = "#2563eb",
  label,
  showValue = true,
  size = "md",
}: ProgressBarProps) {
  const percentage = (value / max) * 100;
  const heightClass = size === "sm" ? "h-1.5" : size === "md" ? "h-2.5" : "h-4";

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm font-medium">{label}</span>}
          {showValue && (
            <span className="text-sm text-muted">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full ${heightClass} overflow-hidden`}>
        <div
          className={`${heightClass} rounded-full progress-animate`}
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
