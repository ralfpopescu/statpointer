'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Share2, Check, AlertCircle, Copy } from 'lucide-react';
import { Button } from '@/components/Button';
import { RadarChart } from '@/components/RadarChart';
import { decodeStatSpread } from '@/utils/encoding';
import { StatSpread } from '@/types';

export default function ViewStatsPage() {
  const router = useRouter();
  const params = useParams();
  const encoded = params.encoded as string;

  const [spread, setSpread] = useState<StatSpread | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (encoded) {
      const decoded = decodeStatSpread(encoded);
      if (decoded) {
        setSpread(decoded);
      } else {
        setError('Invalid or corrupted link.');
      }
    }
  }, [encoded]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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

  if (!spread) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const totalUsed = Object.values(spread.points).reduce((sum, p) => sum + p, 0);

  return (
    <main className="min-h-screen px-4 py-8 md:px-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto mb-8"
      >
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-mist hover:text-chalk transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back home</span>
        </button>
      </motion.header>

      {/* Stat Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-lg mx-auto"
      >
        <div className="p-8 rounded-3xl bg-obsidian border border-mist/10 shadow-2xl">
          {/* Character Info */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-display font-bold text-chalk mb-1">
              {spread.characterName}
            </h1>
            <p className="text-ember font-body">{spread.roleName}</p>
          </div>

          {/* Radar Chart */}
          <div className="flex justify-center mb-8">
            <RadarChart
              attributes={spread.attributes}
              values={spread.points}
              maxValue={10}
              size={300}
              showLabels={true}
              animated={true}
            />
          </div>

          {/* Stats List */}
          <div className="space-y-3 mb-8">
            {spread.attributes.map((attr, index) => {
              const value = spread.points[attr] || 0;
              const percentage = (value / 10) * 100;
              
              return (
                <motion.div
                  key={attr}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <span className="text-mist text-sm w-28 truncate">{attr}</span>
                  <div className="flex-1 h-2 bg-slate rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-ember to-gold rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                    />
                  </div>
                  <span className="text-chalk font-mono text-sm w-6 text-right">
                    {value}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Total */}
          <div className="text-center text-mist text-sm mb-6">
            Total: <span className="text-chalk font-bold">{totalUsed}</span> / {spread.totalPoints} points
          </div>

          {/* Share Button */}
          <Button
            variant="secondary"
            onClick={handleCopyLink}
            icon={copied ? <Check size={18} /> : <Copy size={18} />}
            className="w-full"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>
      </motion.div>
    </main>
  );
}

