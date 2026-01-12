'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Share2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { PointControl } from '@/components/PointControl';
import { RadarChart } from '@/components/RadarChart';
import { decodeClass, encodeStatSpread } from '@/utils/encoding';
import { StatClass } from '@/types';

export default function FillStatsPage() {
  const router = useRouter();
  const params = useParams();
  const encoded = params.encoded as string;

  const [statClass, setStatClass] = useState<StatClass | null>(null);
  const [characterName, setCharacterName] = useState('');
  const [points, setPoints] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Decode the class from URL
  useEffect(() => {
    if (encoded) {
      const decoded = decodeClass(encoded);
      if (decoded) {
        setStatClass(decoded);
        // Initialize points to 0 for each attribute
        const initialPoints: Record<string, number> = {};
        decoded.attributes.forEach(attr => {
          initialPoints[attr] = 0;
        });
        setPoints(initialPoints);
      } else {
        setError('Invalid or corrupted link. Please request a new one.');
      }
    }
  }, [encoded]);

  // Calculate remaining points
  const usedPoints = useMemo(() => {
    return Object.values(points).reduce((sum, p) => sum + p, 0);
  }, [points]);

  const remainingPoints = statClass ? statClass.totalPoints - usedPoints : 0;
  const isComplete = remainingPoints === 0 && characterName.trim().length > 0;

  // Calculate max possible value for an attribute
  const getMaxForAttribute = useCallback((attr: string) => {
    if (!statClass) return 0;
    const currentValue = points[attr] || 0;
    // Max is either maxPointsPerAttribute or current + remaining, whichever is smaller
    return Math.min(statClass.maxPointsPerAttribute, currentValue + remainingPoints);
  }, [statClass, points, remainingPoints]);

  const handlePointChange = useCallback((attr: string, value: number) => {
    setPoints(prev => ({
      ...prev,
      [attr]: value,
    }));
  }, []);

  const handleShare = useCallback(async () => {
    if (!statClass || !isComplete) return;

    const spread = {
      id: '',
      classId: statClass.id,
      characterName,
      roleName: statClass.roleName,
      attributes: statClass.attributes,
      points,
      totalPoints: statClass.totalPoints,
      maxPointsPerAttribute: statClass.maxPointsPerAttribute,
    };

    const encodedSpread = encodeStatSpread(spread);
    const url = `${window.location.origin}/view/${encodedSpread}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [statClass, isComplete, characterName, points]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-rose mx-auto mb-4" />
          <h1 className="text-2xl font-display text-chalk mb-2">Oops!</h1>
          <p className="text-mist mb-6">{error}</p>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </main>
    );
  }

  if (!statClass) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

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

        <h1 className="text-3xl md:text-4xl font-display font-bold text-chalk">
          {statClass.roleName}
        </h1>
        <p className="text-mist mt-2">
          Allocate your {statClass.totalPoints} points across the attributes below
        </p>
      </motion.header>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Left Column - Point Allocation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Character Name */}
          <div className="space-y-2">
            <label className="text-sm text-mist font-body">Your Name</label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full text-lg"
            />
          </div>

          {/* Remaining Points */}
          <div className={`
            p-4 rounded-xl border text-center
            ${remainingPoints === 0 
              ? 'bg-azure/10 border-azure/30 text-azure' 
              : remainingPoints < 0
              ? 'bg-rose/10 border-rose/30 text-rose'
              : 'bg-slate border-mist/20 text-chalk'
            }
          `}>
            <span className="text-3xl font-display font-bold">{remainingPoints}</span>
            <span className="text-sm ml-2 opacity-80">points remaining</span>
          </div>

          {/* Attribute Controls */}
          <div className="space-y-4">
            {statClass.attributes.map((attr, index) => (
              <motion.div
                key={attr}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-obsidian/50 border border-mist/10"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-chalk font-body flex-1">{attr}</span>
                  <PointControl
                    value={points[attr] || 0}
                    onChange={(value) => handlePointChange(attr, value)}
                    min={0}
                    max={getMaxForAttribute(attr)}
                    absoluteMax={statClass.maxPointsPerAttribute}
                    size="sm"
                    showBar={true}
                  />
                </div>
              </motion.div>
            ))}
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
              disabled={!isComplete}
              icon={copied ? <Check size={20} /> : <Share2 size={20} />}
              className="w-full"
            >
              {copied ? 'Link Copied!' : 'Get Shareable Link'}
            </Button>
            {!isComplete && (
              <p className="text-mist text-sm text-center mt-2">
                {!characterName.trim() 
                  ? 'Enter your name to continue'
                  : `Allocate all ${remainingPoints} remaining points`
                }
              </p>
            )}
          </motion.div>
        </motion.div>

        {/* Right Column - Radar Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="sticky top-8">
            <div className="p-6 rounded-2xl bg-obsidian/50 border border-mist/10">
              <h2 className="text-xl font-display text-center text-chalk mb-2">
                {characterName || 'Your Character'}
              </h2>
              <p className="text-mist text-sm text-center mb-6">
                {usedPoints} / {statClass.totalPoints} points used
              </p>

              <RadarChart
                attributes={statClass.attributes}
                values={points}
                maxValue={statClass.maxPointsPerAttribute}
                size={300}
                showLabels={true}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

