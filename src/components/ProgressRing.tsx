interface Props {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  label?: string;
  /** Fill the inside with the accent when complete (timeline nodes). */
  fillWhenComplete?: boolean;
}

export function ProgressRing({ value, max, size = 56, stroke = 4, label, fillWhenComplete = false }: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = max > 0 ? Math.min(value / max, 1) : 0;
  const complete = max > 0 && value >= max;
  const text = label ?? `${value}/${max}`;
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${value} of ${max} completed`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill={complete && fillWhenComplete ? "var(--color-accent)" : "var(--color-bg-raised)"}
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          style={{ transition: "stroke-dashoffset 150ms" }}
        />
      </svg>
      <span
        className={`absolute text-[0.7rem] font-semibold ${complete && fillWhenComplete ? "text-accent-ink" : "text-text"}`}
      >
        {text}
      </span>
    </span>
  );
}
