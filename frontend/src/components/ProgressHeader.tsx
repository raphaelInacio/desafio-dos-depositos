import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp } from 'lucide-react';
import { ChallengeStats } from '@/types/challenge';
import { formatCurrency } from '@/lib/challengeUtils';

interface ProgressHeaderProps {
  stats: ChallengeStats;
  challengeName: string;
}

export function ProgressHeader({ stats, challengeName }: ProgressHeaderProps) {
  return (
    <div className="rounded-2xl gradient-hero p-6 text-primary-foreground shadow-glow">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{challengeName}</h1>
        <div className="flex items-center gap-1 rounded-full bg-primary-foreground/20 px-3 py-1 text-sm font-semibold backdrop-blur-sm">
          <Trophy className="h-4 w-4" />
          {stats.progressPercentage}%
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-4 h-4 overflow-hidden rounded-full bg-primary-foreground/20">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-primary-foreground"
          initial={{ width: 0 }}
          animate={{ width: `${stats.progressPercentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" 
          style={{ backgroundSize: '200% 100%' }} 
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-primary-foreground/10 p-3 backdrop-blur-sm">
          <div className="mb-1 flex items-center gap-1 text-xs opacity-80">
            <Target className="h-3 w-3" />
            Meta
          </div>
          <div className="text-lg font-bold">{formatCurrency(stats.totalGoal)}</div>
        </div>
        
        <div className="rounded-xl bg-primary-foreground/10 p-3 backdrop-blur-sm">
          <div className="mb-1 flex items-center gap-1 text-xs opacity-80">
            <TrendingUp className="h-3 w-3" />
            Guardado
          </div>
          <div className="text-lg font-bold">{formatCurrency(stats.savedSoFar)}</div>
        </div>
        
        <div className="rounded-xl bg-primary-foreground/10 p-3 backdrop-blur-sm">
          <div className="mb-1 text-xs opacity-80">Depósitos</div>
          <div className="text-lg font-bold">
            {stats.depositsCompleted}/{stats.totalDeposits}
          </div>
        </div>
      </div>
    </div>
  );
}
