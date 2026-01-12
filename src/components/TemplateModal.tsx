'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Template } from '@/types';
import { TEMPLATES } from '@/utils/templates';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
}

export function TemplateModal({ isOpen, onClose, onSelect }: TemplateModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-midnight/80 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
              md:max-w-2xl md:w-full max-h-[80vh] overflow-auto
              bg-obsidian border border-mist/20 rounded-2xl shadow-2xl z-50 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display text-chalk">Choose a Template</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate transition-colors text-mist hover:text-chalk"
              >
                <X size={24} />
              </button>
            </div>

            {/* Template list */}
            <div className="flex flex-wrap gap-3">
              {TEMPLATES.map((template, index) => (
                <motion.button
                  key={template.roleName}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => {
                    onSelect(template);
                    onClose();
                  }}
                  className="group relative px-5 py-3 rounded-xl
                    bg-slate border border-mist/20
                    hover:border-ember/50 hover:bg-slate/80
                    transition-all duration-300"
                >
                  <span className="text-chalk font-body font-medium group-hover:text-ember transition-colors">
                    {template.roleName}
                  </span>
                  <div className="mt-1 text-xs text-mist">
                    {template.attributes.length} attributes
                  </div>
                  
                  {/* Hover preview */}
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2
                    hidden group-hover:block z-10 w-48 p-3
                    bg-midnight border border-mist/20 rounded-lg shadow-xl">
                    <div className="text-xs text-mist space-y-1">
                      {template.attributes.map(attr => (
                        <div key={attr} className="text-chalk/70">• {attr}</div>
                      ))}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Info text */}
            <p className="mt-6 text-sm text-mist text-center">
              Select a template to pre-fill your attributes, or close to start from scratch.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

