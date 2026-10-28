import React from 'react';

export default function EmptyState({ icon = 'inbox', title = 'No data found', description = '', actionText = '', onAction }) {
  return (
    <div className="flex flex-col items-center justify-center p-space-xl bg-surface-container-lowest rounded-xl shadow-sm text-center">
      <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-outline mb-space-md">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-surface">{title}</h3>
      {description && (
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mt-1 mb-space-md">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-inverse-surface font-label-md text-label-md shadow-sm transition-colors"
          type="button"
        >
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
}
