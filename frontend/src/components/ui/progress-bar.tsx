interface ProgressBarProps {
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div>
      <div className="mb-2 text-sm font-medium text-ink">Progreso: {safeValue}%</div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full bg-signal transition-all duration-500"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
