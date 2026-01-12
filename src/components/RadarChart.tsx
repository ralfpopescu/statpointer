'use client';

import { motion } from 'framer-motion';

interface RadarChartProps {
  attributes: string[];
  values: Record<string, number>;
  maxValue?: number;
  size?: number;
  color?: string;
  showLabels?: boolean;
  animated?: boolean;
  className?: string;
}

export function RadarChart({
  attributes,
  values,
  maxValue = 10,
  size = 300,
  color = '#ff6b35',
  showLabels = true,
  animated = true,
  className = '',
}: RadarChartProps) {
  const center = size / 2;
  const radius = (size - 80) / 2;
  const angleStep = (2 * Math.PI) / attributes.length;

  // Calculate positions for each attribute
  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getLabelPoint = (index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = radius + 30;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate polygon points
  const polygonPoints = attributes
    .map((attr, i) => {
      const value = values[attr] || 0;
      const point = getPoint(i, value);
      return `${point.x},${point.y}`;
    })
    .join(' ');

  // Generate grid circles
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background glow */}
        <defs>
          <radialGradient id="chartGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </linearGradient>
        </defs>

        <circle cx={center} cy={center} r={radius} fill="url(#chartGlow)" />

        {/* Grid circles */}
        {gridLevels.map((level, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * level}
            fill="none"
            stroke="rgba(160, 160, 176, 0.2)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

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
              stroke="rgba(160, 160, 176, 0.3)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <motion.polygon
          fill="url(#fillGradient)"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          initial={animated ? { opacity: 0, scale: 0.5, points: polygonPoints } : { points: polygonPoints }}
          animate={animated ? { opacity: 1, scale: 1, points: polygonPoints } : { points: polygonPoints }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        {/* Data points */}
        {attributes.map((attr, i) => {
          const value = values[attr] || 0;
          const point = getPoint(i, value);
          return (
            <motion.circle
              key={attr}
              r="5"
              fill={color}
              stroke="white"
              strokeWidth="2"
              initial={animated ? { opacity: 0, scale: 0, cx: center, cy: center } : { cx: point.x, cy: point.y }}
              animate={animated ? { opacity: 1, scale: 1, cx: point.x, cy: point.y } : { cx: point.x, cy: point.y }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          );
        })}

        {/* Labels */}
        {showLabels &&
          attributes.map((attr, i) => {
            const labelPoint = getLabelPoint(i);
            const angle = angleStep * i - Math.PI / 2;
            const textAnchor =
              Math.abs(Math.cos(angle)) < 0.1
                ? 'middle'
                : Math.cos(angle) > 0
                ? 'start'
                : 'end';

            return (
              <text
                key={attr}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="fill-mist text-xs font-body"
                style={{ fontSize: '11px' }}
              >
                {attr}
              </text>
            );
          })}
      </svg>

      {/* Center value display */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center opacity-60">
          <div className="text-2xl font-display text-chalk">
            {Object.values(values).reduce((a, b) => a + b, 0)}
          </div>
          <div className="text-xs text-mist">total</div>
        </div>
      </div>
    </div>
  );
}

