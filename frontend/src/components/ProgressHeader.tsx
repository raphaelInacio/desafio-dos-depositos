import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Share2 } from 'lucide-react';
import { Challenge, ChallengeStats } from '@/types/challenge';
import { formatCurrency } from '@/lib/challengeUtils';
import { shareProgress } from '@/services/shareService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ProgressHeaderProps {
  challenge: Challenge;
  stats: ChallengeStats;
}

export function ProgressHeader({ challenge, stats }: ProgressHeaderProps) {
  const handleShare = async () => {
    const success = await shareProgress(challenge, stats);

    if (success) {
      // Se usou Web Share API, não mostra toast (nativo já mostra feedback)
      if (!navigator.share) {
        toast.success('Progresso copiado!', {
          description: 'Cole em suas redes sociais para compartilhar.',
        });
      }
    } else {
      toast.error('Não foi possível compartilhar', {
        description: 'Tente novamente.',
      });
    }
  };

  return (
    <div className="rounded-2xl gradient-hero p-6 text-primary-foreground shadow-glow">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{challenge.name}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-1 rounded-full bg-primary-foreground/20 px-3 py-1.5 text-sm font-semibold backdrop-blur-sm hover:bg-primary-foreground/30 transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
          <div className="flex items-center gap-1 rounded-full bg-primary-foreground/20 px-3 py-1 text-sm font-semibold backdrop-blur-sm">
            <Trophy className="h-4 w-4" />
            {stats.progressPercentage}%
          </div>
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
