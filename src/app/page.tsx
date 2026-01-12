'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Plus, Users, Sparkles, Target, Zap } from 'lucide-react';
import { Button } from '@/components/Button';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-ember/5 blur-3xl"
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-azure/5 blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Logo / Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Target className="w-14 h-14 text-ember" strokeWidth={1.5} />
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5 text-gold absolute -top-1 -right-1" />
              </motion.div>
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">
            <span className="text-gradient-ember">Stat</span>{' '}
            <span className="text-chalk">Pointer</span>
          </h1>

          <p className="text-xl md:text-2xl text-mist font-body max-w-2xl mx-auto leading-relaxed">
            Visualize your strengths. Share your skillset.
            <br />
            <span className="text-chalk/80">
              Create beautiful stat spreads like your favorite RPG characters.
            </span>
          </p>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-12 max-w-xl"
        >
          {[
            { icon: Target, text: 'Define your class' },
            { icon: Zap, text: 'Allocate your points' },
            { icon: Users, text: 'Build your party' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full
                bg-slate/50 border border-mist/10 text-mist text-sm"
            >
              <item.icon size={16} className="text-ember" />
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            size="lg"
            onClick={() => router.push('/builder')}
            icon={<Plus size={20} />}
          >
            New Class
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push('/party')}
            icon={<Users size={20} />}
          >
            Collect Party Stats
          </Button>
        </motion.div>

        {/* Decorative stat preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 relative"
        >
          <svg width="200" height="200" viewBox="0 0 200 200" className="opacity-20">
            <defs>
              <linearGradient id="previewGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#4ecdc4" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            {/* Simple hexagon shape */}
            <polygon
              points="100,10 180,55 180,145 100,190 20,145 20,55"
              fill="url(#previewGrad)"
              stroke="#ff6b35"
              strokeWidth="1"
            />
            {/* Inner hexagon */}
            <polygon
              points="100,40 150,70 150,130 100,160 50,130 50,70"
              fill="none"
              stroke="#4ecdc4"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />
          </svg>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-mist/50 text-sm">
        <p>Create • Share • Collaborate</p>
      </footer>
    </main>
  );
}

