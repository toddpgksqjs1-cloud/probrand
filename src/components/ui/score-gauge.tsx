"use client";

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

function getGrade(score: number) {
  if (score >= 90) return { grade: "S", color: "#8b5cf6", label: "최적화 완료!" };
  if (score >= 75) return { grade: "A", color: "#10b981", label: "잘하고 있어요!" };
  if (score >= 60) return { grade: "B", color: "#2563eb", label: "평균이에요. 개선하면 효과 큽니다" };
  if (score >= 40) return { grade: "C", color: "#f59e0b", label: "많이 놓치고 있어요" };
  return { grade: "D", color: "#ef4444", label: "기본부터 채워볼까요?" };
}

export function ScoreGauge({ score, size = 180, strokeWidth = 12 }: ScoreGaugeProps) {
  const { grade, color, label } = getGrade(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="score-gauge"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold">{score}</span>
          <span
            className="text-lg font-bold px-2 py-0.5 rounded"
            style={{ color }}
          >
            {grade}등급
          </span>
        </div>
      </div>
      <p className="text-sm text-muted mt-2 text-center">{label}</p>
    </div>
  );
}
