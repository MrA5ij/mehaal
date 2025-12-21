import React from 'react';

export function EmptyState({ title }: { title: string }) {
  return (
    <div className="border border-white/10 rounded-lg p-10 text-center opacity-60">
      {title}
    </div>
  );
}
