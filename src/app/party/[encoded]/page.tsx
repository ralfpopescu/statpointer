'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, AlertCircle, Copy, Check, Users } from 'lucide-react';
import { Button } from '@/components/Button';
import { RadarChart } from '@/components/RadarChart';
import { MiniRadarChart } from '@/components/MiniRadarChart';
import { decodeParty } from '@/utils/encoding';
import { PartySpread } from '@/types';

const MEMBER_COLORS = ['#ff6b35', '#4ecdc4', '#7b68ee', '#ffc857', '#ff6b9d'];

export default function ViewPartyPage() {
  const router = useRouter();
  const params = useParams();
  const encoded = params.encoded as string;

  const [party, setParty] = useState<PartySpread | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (encoded) {
      const decoded = decodeParty(encoded);
      if (decoded) {
        setParty(decoded);
      } else {
        setError('Invalid or corrupted party link.');
      }
    }
  }, [encoded]);

  // Get all unique attributes
  const allAttributes = useMemo(() => {
    if (!party) return [];
    const attrs = new Set<string>();
    party.members.forEach(member => {
      member.attributes.forEach(attr => attrs.add(attr));
    });
    return Array.from(attrs);
  }, [party]);

  // Calculate max value for party chart
  const maxPartyValue = useMemo(() => {
    if (!party) return 10;
    const values = Object.values(party.aggregatedStats);
    if (values.length === 0) return 10;
    return Math.max(10, ...values);
  }, [party]);

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

  if (!party) {
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
        className="max-w-5xl mx-auto mb-8"
      >
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-mist hover:text-chalk transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back home</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-azure" />
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-chalk">
                Party Stats
              </h1>
              <p className="text-mist">
                {party.members.length} member{party.members.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={handleCopyLink}
            icon={copied ? <Check size={18} /> : <Copy size={18} />}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>
      </motion.header>

      <div className="max-w-5xl mx-auto">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 p-8 rounded-3xl bg-obsidian border border-mist/10"
        >
          <h2 className="text-2xl font-display text-chalk text-center mb-6">
            Combined Team Stats
          </h2>

          <div className="flex justify-center mb-8">
            <RadarChart
              attributes={allAttributes}
              values={party.aggregatedStats}
              maxValue={maxPartyValue}
              size={350}
              color="#4ecdc4"
              showLabels={true}
              animated={true}
            />
          </div>

          {/* Stats breakdown */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {allAttributes.map((attr, index) => {
              const value = party.aggregatedStats[attr] || 0;
              const percentage = (value / maxPartyValue) * 100;

              return (
                <motion.div
                  key={attr}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.03 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-mist text-sm flex-1 truncate">{attr}</span>
                  <div className="w-20 h-2 bg-slate rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-azure to-violet rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.3 + index * 0.03, duration: 0.5 }}
                    />
                  </div>
                  <span className="text-azure font-mono text-sm w-8 text-right">
                    {value}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Party Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-display text-chalk mb-6">
            Party Members
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {party.members.map((member, index) => (
              <motion.div
                key={`${member.characterName}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="p-4 rounded-xl bg-slate/30 border border-mist/10"
              >
                <div className="text-center mb-3">
                  <h3 className="text-chalk font-body font-medium truncate">
                    {member.characterName}
                  </h3>
                  <p className="text-mist text-xs">{member.roleName}</p>
                </div>

                <div className="flex justify-center">
                  <MiniRadarChart
                    attributes={member.attributes}
                    values={member.points}
                    size={100}
                    color={MEMBER_COLORS[index % MEMBER_COLORS.length]}
                  />
                </div>

                {/* Member's total points */}
                <div className="text-center mt-3">
                  <span className="text-mist text-xs">
                    {Object.values(member.points).reduce((a, b) => a + b, 0)} pts
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

