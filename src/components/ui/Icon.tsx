import React from 'react';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number | string;
  filled?: boolean;
  className?: string;
}

export function Icon({
  name,
  size = 24,
  filled = false,
  className = '',
  style,
  ...props
}: IconProps) {
  const dynamicStyle: React.CSSProperties = {
    ...style,
    fontSize: typeof size === 'number' ? `${size}px` : size,
    ...(filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : {}),
  };

  return (
    <span
      className={`material-symbols-outlined select-none align-middle ${className}`}
      style={dynamicStyle}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
}

export default Icon;
