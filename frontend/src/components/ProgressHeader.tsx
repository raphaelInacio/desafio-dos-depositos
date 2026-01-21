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
    <div className="rounded-2xl bg-gradient-to-br from-emerald via-emerald to-green-600 p-6 text-white shadow-tactile border-2 border-emerald-600 mb-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-headline font-extrabold text-2xl tracking-tight">{challenge.name}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-sm font-bold backdrop-blur-sm hover:bg-white/30 text-white border border-white/10 transition-colors h-auto"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
          <div className="flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-sm font-bold text-white shadow-sm border border-orange-400">
            <Trophy className="h-4 w-4" />
            {stats.progressPercentage}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-6 h-6 overflow-hidden rounded-full bg-black/20 border border-black/5 shadow-inner">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#fbbf24] to-gold shadow-[0_2px_10px_rgba(245,158,11,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${stats.progressPercentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite_linear]"
          style={{ backgroundSize: '200% 100%' }}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
          <div className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-80">
            <Target className="h-3 w-3" />
            Meta
          </div>
          <div className="font-headline font-extrabold text-xl md:text-2xl">{formatCurrency(stats.totalGoal)}</div>
        </div>

        <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
          <div className="mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider opacity-80">
            <TrendingUp className="h-3 w-3" />
            Guardado
          </div>
          <div className="font-headline font-extrabold text-xl md:text-2xl text-gold-200">{formatCurrency(stats.savedSoFar)}</div>
        </div>

        <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
          <div className="mb-1 text-xs font-bold uppercase tracking-wider opacity-80">Depósitos</div>
          <div className="font-headline font-extrabold text-xl md:text-2xl">
            {stats.depositsCompleted}<span className="text-white/50 text-base">/{stats.totalDeposits}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
