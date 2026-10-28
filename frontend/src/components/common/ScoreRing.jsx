import React from 'react';

export default function ScoreRing({ score = 0, size = 'lg', label = '', className = '' }) {
  const normalizedScore = Math.max(0, Math.min(100, Number(score) || 0));

  if (size === 'sm') {
    // 32px inline table ring
    const radius = 12;
    const circumference = 2 * Math.PI * radius; // 75.398
    const offset = circumference - (normalizedScore / 100) * circumference;

    return (
      <div className={`relative w-8 h-8 flex items-center justify-center shrink-0 ${className}`}>
        <svg className="w-8 h-8 transform -rotate-90">
          <circle
            className="text-surface-container"
            cx="16"
            cy="16"
            fill="transparent"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
          />
          <circle
            className="text-secondary transition-all duration-700 ease-out"
            cx="16"
            cy="16"
            fill="transparent"
            r={radius}
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
        <span className="absolute font-code-score text-label-sm font-semibold text-on-surface">
          {Math.round(normalizedScore)}
        </span>
      </div>
    );
  }

  // Large Hero Gauge (from SkillSight AI banner)
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // 314.159
  const offset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className={`relative w-44 h-44 flex items-center justify-center ${className}`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          className="text-surface-container"
          cx="60"
          cy="60"
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
        />
        <circle
          className="text-secondary transition-all duration-700 ease-out"
          cx="60"
          cy="60"
          fill="none"
          r={radius}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="8"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-headline-xl text-headline-xl text-on-surface tracking-tighter">
          {normalizedScore.toFixed(1)}%
        </span>
        {label && (
          <span className="font-code-metric text-code-metric text-on-surface-variant font-medium uppercase mt-0.5">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
