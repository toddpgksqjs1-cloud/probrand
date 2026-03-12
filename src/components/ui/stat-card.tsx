"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
}

export function StatCard({ title, value, change, prefix, suffix, icon }: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-card rounded-xl border border-border p-5 card-hover">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted font-medium">{title}</span>
        {icon && <div className="text-muted">{icon}</div>}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold">
          {prefix}{typeof value === "number" ? value.toLocaleString() : value}{suffix}
        </span>
        {change !== undefined && (
          <span
            className={`flex items-center text-sm font-medium mb-0.5 ${
              isPositive ? "text-accent" : isNegative ? "text-danger" : "text-muted"
            }`}
          >
            {isPositive ? <ArrowUpRight size={14} /> : isNegative ? <ArrowDownRight size={14} /> : null}
            {isPositive ? "+" : ""}{change}%
          </span>
        )}
      </div>
    </div>
  );
}
