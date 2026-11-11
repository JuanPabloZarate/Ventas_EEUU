import React from 'react';

export function RegistrationPageSkeleton() {
  return (
    <div
      className="flex flex-col gap-6 animate-pulse"
      aria-busy="true"
      aria-label="Cargando formulario de registro"
    >
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-64 bg-surface-container-high rounded" />

      {/* Hero Header Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-4">
        <div className="lg:col-span-8 space-y-3">
          <div className="flex gap-2">
            <div className="h-6 w-48 bg-secondary-fixed/50 rounded-full" />
            <div className="h-6 w-28 bg-tertiary-fixed/50 rounded-full" />
          </div>
          <div className="h-10 w-3/4 bg-surface-container-high rounded-xl" />
          <div className="h-4 w-full bg-surface-container-high rounded" />
        </div>
        <div className="lg:col-span-4">
          <div className="h-20 bg-surface-container-lowest rounded-2xl border border-outline-variant/20" />
        </div>
      </div>

      {/* Workspace Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-24 bg-surface-container-high/60 rounded-2xl" />
          <div className="h-72 bg-surface-container-lowest rounded-2xl border border-outline-variant/20" />
          <div className="h-96 bg-surface-container-lowest rounded-2xl border border-outline-variant/20" />
        </div>
        <div className="lg:col-span-4">
          <div className="h-96 bg-surface-container-lowest rounded-2xl border border-outline-variant/20" />
        </div>
      </div>
    </div>
  );
}

export default RegistrationPageSkeleton;
