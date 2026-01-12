'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Share2, 
  Check, 
  ArrowLeft, 
  Sparkles,
  BookOpen 
} from 'lucide-react';
import { Button } from '@/components/Button';
import { AttributePill } from '@/components/AttributePill';
import { PointControl } from '@/components/PointControl';
import { TemplateModal } from '@/components/TemplateModal';
import { RadarChart } from '@/components/RadarChart';
import { encodeClass } from '@/utils/encoding';
import { getRandomPlaceholders, getRandomPlaceholder } from '@/utils/templates';
import { Template } from '@/types';

const COLORS = ['ember', 'azure', 'violet', 'gold', 'rose'];

export default function BuilderPage() {
  const router = useRouter();
  const [roleName, setRoleName] = useState('My Class');
  const [attributes, setAttributes] = useState<string[]>(() => getRandomPlaceholders(3));
  const [totalPoints, setTotalPoints] = useState(15);
  const [maxPointsPerAttribute, setMaxPointsPerAttribute] = useState(10);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAddAttribute = useCallback(() => {
    if (attributes.length < 10) {
      const newAttr = getRandomPlaceholder(attributes);
      setAttributes([...attributes, newAttr]);
    }
  }, [attributes]);

  const handleDeleteAttribute = useCallback((index: number) => {
    if (attributes.length > 3) {
      setAttributes(attributes.filter((_, i) => i !== index));
    }
  }, [attributes]);

  const handleEditAttribute = useCallback((index: number, newValue: string) => {
    const updated = [...attributes];
    updated[index] = newValue;
    setAttributes(updated);
  }, [attributes]);

  const handleSelectTemplate = useCallback((template: Template) => {
    setRoleName(template.roleName);
    setAttributes(template.attributes);
  }, []);

  const handleShare = useCallback(async () => {
    const classData = {
      id: '',
      roleName,
      attributes,
      totalPoints,
      maxPointsPerAttribute,
    };
    const encoded = encodeClass(classData);
    const url = `${window.location.origin}/fill/${encoded}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [roleName, attributes, totalPoints, maxPointsPerAttribute]);

  // Preview values for radar chart
  const previewValues = attributes.reduce((acc, attr, i) => {
    const baseValue = Math.ceil(totalPoints / attributes.length);
    const variance = i % 2 === 0 ? 1 : -1;
    acc[attr] = Math.max(1, Math.min(baseValue + variance, maxPointsPerAttribute));
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-8"
      >
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-mist hover:text-chalk transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back home</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-chalk">
            Class Builder
          </h1>
          
          <Button
            variant="ghost"
            onClick={() => setIsTemplateModalOpen(true)}
            icon={<BookOpen size={18} />}
          >
            Start from template
          </Button>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Left Column - Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* Role Name */}
          <div className="space-y-2">
            <label className="text-sm text-mist font-body">Role Name</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name..."
              className="w-full text-lg font-display"
            />
          </div>

          {/* Total Points */}
          <div className="space-y-2">
            <label className="text-sm text-mist font-body">Total Points to Allocate</label>
            <div className="flex items-center gap-4">
              <PointControl
                value={totalPoints}
                onChange={setTotalPoints}
                min={5}
                max={100}
                size="md"
                showBar={false}
              />
              <span className="text-mist text-sm">points</span>
            </div>
          </div>

          {/* Max Points Per Attribute */}
          <div className="space-y-2">
            <label className="text-sm text-mist font-body">Max Points Per Attribute</label>
            <div className="flex items-center gap-4">
              <PointControl
                value={maxPointsPerAttribute}
                onChange={setMaxPointsPerAttribute}
                min={1}
                max={20}
                size="md"
                showBar={false}
              />
              <span className="text-mist text-sm">max per stat</span>
            </div>
          </div>

          {/* Attributes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-mist font-body">
                Attributes ({attributes.length}/10)
              </label>
              {attributes.length < 10 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddAttribute}
                  icon={<Plus size={16} />}
                >
                  Add
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {attributes.map((attr, index) => (
                  <AttributePill
                    key={`${attr}-${index}`}
                    value={attr}
                    onDelete={attributes.length > 3 ? () => handleDeleteAttribute(index) : undefined}
                    onEdit={(newValue) => handleEditAttribute(index, newValue)}
                    deletable={attributes.length > 3}
                    color={COLORS[index % COLORS.length]}
                  />
                ))}
              </AnimatePresence>
            </div>

            {attributes.length < 3 && (
              <p className="text-rose text-sm">
                You need at least 3 attributes
              </p>
            )}
          </div>

          {/* Share Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              size="lg"
              onClick={handleShare}
              disabled={attributes.length < 3 || !roleName.trim()}
              icon={copied ? <Check size={20} /> : <Share2 size={20} />}
              className="w-full"
            >
              {copied ? 'Link Copied!' : 'Copy Share Link'}
            </Button>
            <p className="text-mist text-sm text-center mt-2">
              Share this link for others to fill out their stats
            </p>
          </motion.div>
        </motion.div>

        {/* Right Column - Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="sticky top-8">
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                bg-slate/50 border border-mist/10 text-mist text-sm">
                <Sparkles size={14} className="text-gold" />
                Preview
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-obsidian/50 border border-mist/10">
              <h2 className="text-xl font-display text-center text-chalk mb-2">
                {roleName || 'Untitled Class'}
              </h2>
              <p className="text-mist text-sm text-center mb-6">
                {totalPoints} points to allocate
              </p>

              {attributes.length >= 3 ? (
                <RadarChart
                  attributes={attributes}
                  values={previewValues}
                  maxValue={maxPointsPerAttribute}
                  size={280}
                  showLabels={true}
                />
              ) : (
                <div className="w-[280px] h-[280px] flex items-center justify-center
                  border-2 border-dashed border-mist/20 rounded-full">
                  <p className="text-mist text-sm text-center">
                    Add at least 3 attributes<br />to see the chart
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Template Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelect={handleSelectTemplate}
      />
    </main>
  );
}

