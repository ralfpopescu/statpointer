'use client';

import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

interface PointControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** The absolute maximum for bar display (defaults to max). Use this when max is dynamic but bar should show progress toward a fixed total. */
  absoluteMax?: number;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showBar?: boolean;
}

export function PointControl({
  value,
  onChange,
  min = 0,
  max = 10,
  absoluteMax,
  label,
  disabled = false,
  size = 'md',
  showBar = true,
}: PointControlProps) {
  const canDecrease = value > min && !disabled;
  const canIncrease = value < max && !disabled;

  const sizeClasses = {
    sm: {
      container: 'gap-2',
      button: 'w-6 h-6',
      icon: 14,
      value: 'text-lg w-6',
      bar: 'h-1.5',
    },
    md: {
      container: 'gap-3',
      button: 'w-8 h-8',
      icon: 16,
      value: 'text-xl w-8',
      bar: 'h-2',
    },
    lg: {
      container: 'gap-4',
      button: 'w-10 h-10',
      icon: 20,
      value: 'text-2xl w-10',
      bar: 'h-2.5',
    },
  };

  const s = sizeClasses[size];
  // Use absoluteMax for bar display if provided, otherwise fall back to max
  const barMax = absoluteMax ?? max;
  const percentage = barMax > min ? ((value - min) / (barMax - min)) * 100 : 0;

  return (
    <div className={`flex flex-col ${s.container}`}>
      {label && (
        <span className="text-chalk font-body text-sm opacity-80">{label}</span>
      )}
      
      <div className={`flex items-center ${s.container}`}>
        {/* Decrease button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => canDecrease && onChange(value - 1)}
          disabled={!canDecrease}
          className={`
            ${s.button} rounded-full flex items-center justify-center
            transition-all duration-200
            ${canDecrease 
              ? 'bg-slate border border-mist/30 text-chalk hover:bg-obsidian hover:border-ember/50' 
              : 'bg-slate/50 border border-mist/10 text-mist/30 cursor-not-allowed'
            }
          `}
        >
          <Minus size={s.icon} />
        </motion.button>

        {/* Value display */}
        <motion.span
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`${s.value} text-center font-display text-ember font-bold`}
        >
          {value}
        </motion.span>

        {/* Increase button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => canIncrease && onChange(value + 1)}
          disabled={!canIncrease}
          className={`
            ${s.button} rounded-full flex items-center justify-center
            transition-all duration-200
            ${canIncrease 
              ? 'bg-slate border border-mist/30 text-chalk hover:bg-obsidian hover:border-ember/50' 
              : 'bg-slate/50 border border-mist/10 text-mist/30 cursor-not-allowed'
            }
          `}
        >
          <Plus size={s.icon} />
        </motion.button>
      </div>

      {/* Progress bar */}
      {showBar && (
        <div className={`w-full ${s.bar} bg-slate rounded-full overflow-hidden`}>
          <motion.div
            className={`${s.bar} bg-gradient-to-r from-ember to-gold rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      )}
    </div>
  );
}

