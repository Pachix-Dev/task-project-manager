interface ProgressBarProps {
  value: number;
}

export function ProgressBar({ value }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[var(--ink-700)]">
        <span>Progreso</span>
        <span>{safeValue}%</span>
      </div>
      <div className="h-3.5 w-full overflow-hidden rounded-full bg-[var(--ink-700)]/15">
        <div
          className="h-full bg-gradient-to-r from-[var(--brand-600)] to-[var(--brand-500)] transition-all duration-500"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
