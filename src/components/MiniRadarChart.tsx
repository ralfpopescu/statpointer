'use client';

import { motion } from 'framer-motion';

interface MiniRadarChartProps {
  attributes: string[];
  values: Record<string, number>;
  maxValue?: number;
  size?: number;
  color?: string;
}

export function MiniRadarChart({
  attributes,
  values,
  maxValue = 10,
  size = 120,
  color = '#ff6b35',
}: MiniRadarChartProps) {
  const center = size / 2;
  const radius = (size - 10) / 2;
  const angleStep = (2 * Math.PI) / attributes.length;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = attributes
    .map((attr, i) => {
      const value = values[attr] || 0;
      const point = getPoint(i, value);
      return `${point.x},${point.y}`;
    })
    .join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id={`miniGrad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Grid circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="rgba(160, 160, 176, 0.15)"
        strokeWidth="1"
      />

      {/* Axis lines */}
      {attributes.map((_, i) => {
        const point = getPoint(i, maxValue);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="rgba(160, 160, 176, 0.15)"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon */}
      <motion.polygon
        points={polygonPoints}
        fill={`url(#miniGrad-${color.replace('#', '')})`}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      />
    </svg>
  );
}

