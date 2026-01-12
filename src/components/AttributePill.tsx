'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pencil, Check } from 'lucide-react';

interface AttributePillProps {
  value: string;
  onDelete?: () => void;
  onEdit?: (newValue: string) => void;
  editable?: boolean;
  deletable?: boolean;
  color?: string;
  className?: string;
}

export function AttributePill({
  value,
  onDelete,
  onEdit,
  editable = true,
  deletable = true,
  color = 'ember',
  className = '',
}: AttributePillProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleConfirm = () => {
    if (editValue.trim() && onEdit) {
      onEdit(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  const colorClasses: Record<string, string> = {
    ember: 'bg-ember/20 border-ember/50 text-ember hover:bg-ember/30',
    azure: 'bg-azure/20 border-azure/50 text-azure hover:bg-azure/30',
    violet: 'bg-violet/20 border-violet/50 text-violet hover:bg-violet/30',
    gold: 'bg-gold/20 border-gold/50 text-gold hover:bg-gold/30',
    rose: 'bg-rose/20 border-rose/50 text-rose hover:bg-rose/30',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
        border transition-colors duration-200 font-body text-sm
        ${colorClasses[color] || colorClasses.ember}
        ${className}
      `}
    >
      {/* Delete button */}
      {deletable && onDelete && (
        <button
          onClick={onDelete}
          className="opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Delete attribute"
        >
          <X size={14} />
        </button>
      )}

      {/* Label or input */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.input
            key="input"
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleConfirm}
            className="bg-transparent border-none outline-none w-24 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        ) : (
          <motion.span
            key="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-w-[3rem] text-center"
          >
            {value}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Edit/Confirm button */}
      {editable && onEdit && (
        <button
          onClick={() => {
            if (isEditing) {
              handleConfirm();
            } else {
              setIsEditing(true);
            }
          }}
          className="opacity-60 hover:opacity-100 transition-opacity"
          aria-label={isEditing ? 'Confirm' : 'Edit attribute'}
        >
          {isEditing ? <Check size={14} /> : <Pencil size={14} />}
        </button>
      )}
    </motion.div>
  );
}

