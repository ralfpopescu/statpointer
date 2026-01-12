'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  UserPlus, 
  Share2, 
  Check, 
  X, 
  AlertCircle,
  Users 
} from 'lucide-react';
import { Button } from '@/components/Button';
import { RadarChart } from '@/components/RadarChart';
import { MiniRadarChart } from '@/components/MiniRadarChart';
import { decodeStatSpread, encodeParty, parseShareUrl } from '@/utils/encoding';
import { StatSpread } from '@/types';

const MEMBER_COLORS = ['#ff6b35', '#4ecdc4', '#7b68ee', '#ffc857', '#ff6b9d'];

export default function PartyPage() {
  const router = useRouter();
  const [members, setMembers] = useState<StatSpread[]>([]);
  const [linkInput, setLinkInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Aggregate stats from all members
  const aggregatedStats = useMemo(() => {
    const stats: Record<string, number> = {};
    members.forEach(member => {
      Object.entries(member.points).forEach(([attr, value]) => {
        stats[attr] = (stats[attr] || 0) + value;
      });
    });
    return stats;
  }, [members]);

  // Get all unique attributes
  const allAttributes = useMemo(() => {
    const attrs = new Set<string>();
    members.forEach(member => {
      member.attributes.forEach(attr => attrs.add(attr));
    });
    return Array.from(attrs);
  }, [members]);

  // Calculate max value for party chart
  const maxPartyValue = useMemo(() => {
    if (Object.values(aggregatedStats).length === 0) return 10;
    return Math.max(10, ...Object.values(aggregatedStats));
  }, [aggregatedStats]);

  const handleAddMember = useCallback(() => {
    setError(null);
    
    if (!linkInput.trim()) {
      setError('Please paste a stat spread link');
      return;
    }

    // Try to parse the URL
    const parsed = parseShareUrl(linkInput.trim());
    
    if (!parsed || parsed.type !== 'stats') {
      // Try direct decode in case they pasted just the encoded part
      const decoded = decodeStatSpread(linkInput.trim());
      if (decoded) {
        // Check for duplicates
        if (members.some(m => m.characterName === decoded.characterName)) {
          setError(`${decoded.characterName} is already in the party`);
          return;
        }
        setMembers([...members, decoded]);
        setLinkInput('');
        return;
      }
      
      setError('Invalid link. Please use a stat spread link from the "View" page.');
      return;
    }

    const decoded = decodeStatSpread(parsed.data);
    if (!decoded) {
      setError('Could not decode the stat spread. The link may be corrupted.');
      return;
    }

    // Check for duplicates
    if (members.some(m => m.characterName === decoded.characterName)) {
      setError(`${decoded.characterName} is already in the party`);
      return;
    }

    setMembers([...members, decoded]);
    setLinkInput('');
  }, [linkInput, members]);

  const handleRemoveMember = useCallback((index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  }, [members]);

  const handleShare = useCallback(async () => {
    if (members.length === 0) return;

    const party = {
      id: '',
      members,
      aggregatedStats,
    };

    const encodedParty = encodeParty(party);
    const url = `${window.location.origin}/party/${encodedParty}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [members, aggregatedStats]);

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

        <div className="flex items-center gap-4">
          <Users className="w-8 h-8 text-azure" />
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-chalk">
              Party Stats
            </h1>
            <p className="text-mist">
              Combine individual stat spreads into a team view
            </p>
          </div>
        </div>
      </motion.header>

      <div className="max-w-5xl mx-auto">
        {/* Add Member Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl bg-obsidian/50 border border-mist/10"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={linkInput}
              onChange={(e) => {
                setLinkInput(e.target.value);
                setError(null);
              }}
              placeholder="Paste a stat spread link..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
            />
            <Button
              onClick={handleAddMember}
              icon={<UserPlus size={18} />}
            >
              Add Party Member
            </Button>
          </div>
          
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-rose text-sm mt-3"
            >
              <AlertCircle size={16} />
              {error}
            </motion.p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Party Members */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-display text-chalk mb-4">
              Party Members ({members.length})
            </h2>

            {members.length === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-mist/20 text-center">
                <Users className="w-12 h-12 text-mist/30 mx-auto mb-4" />
                <p className="text-mist">
                  No members yet. Paste stat spread links above to build your party.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {members.map((member, index) => (
                    <motion.div
                      key={`${member.characterName}-${index}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative p-4 rounded-xl bg-slate/50 border border-mist/10
                        hover:border-mist/30 transition-colors group"
                    >
                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveMember(index)}
                        className="absolute top-2 right-2 p-1 rounded-full
                          opacity-0 group-hover:opacity-100 transition-opacity
                          bg-midnight/50 hover:bg-rose/20 text-mist hover:text-rose"
                      >
                        <X size={16} />
                      </button>

                      <div className="text-center mb-2">
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
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Aggregated Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <h2 className="text-xl font-display text-chalk mb-4">
              Combined Stats
            </h2>

            <div className="flex-1 p-6 rounded-2xl bg-obsidian border border-mist/10">
              {members.length === 0 ? (
                <div className="h-[340px] flex items-center justify-center">
                  <p className="text-mist text-center">
                    Add party members to see<br />aggregated stats
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    <RadarChart
                      attributes={allAttributes}
                      values={aggregatedStats}
                      maxValue={maxPartyValue}
                      size={300}
                      color="#4ecdc4"
                      showLabels={true}
                      animated={true}
                    />
                  </div>

                  {/* Stats breakdown */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {allAttributes.map(attr => (
                      <div key={attr} className="flex items-center justify-between text-sm">
                        <span className="text-mist truncate flex-1">{attr}</span>
                        <span className="text-azure font-mono ml-2">
                          {aggregatedStats[attr] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Share Button */}
            {members.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <Button
                  onClick={handleShare}
                  icon={copied ? <Check size={18} /> : <Share2 size={18} />}
                  className="w-full"
                >
                  {copied ? 'Link Copied!' : 'Share Party Stats'}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

