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
    <div className="rounded-2xl bg-gradient-to-br from-emerald via-emerald to-green-600 p-4 md:p-6 text-white shadow-tactile border-2 border-emerald-600 mb-6 md:mb-8">
      <div className="mb-4 md:mb-6 flex items-center justify-between">
        <h1 className="font-headline font-extrabold text-xl md:text-2xl tracking-tight leading-none">{challenge.name}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-bold backdrop-blur-sm hover:bg-white/30 text-white border border-white/10 transition-colors h-8 md:h-auto"
          >
            <Share2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
          <div className="flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 md:px-3 text-xs md:text-sm font-bold text-white shadow-sm border border-orange-400 h-8 md:h-auto whitespace-nowrap">
            <Trophy className="h-3 w-3 md:h-4 md:w-4" />
            {stats.progressPercentage}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-4 md:mb-6 h-5 md:h-6 overflow-hidden rounded-full bg-black/20 border border-black/5 shadow-inner">
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
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <div className="rounded-xl bg-white/10 p-2 md:p-4 backdrop-blur-sm border border-white/10 flex flex-col justify-center">
          <div className="mb-0.5 md:mb-1 flex items-center gap-1 text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-80">
            <Target className="h-2.5 w-2.5 md:h-3 md:w-3" />
            Meta
          </div>
          <div className="font-headline font-extrabold text-sm md:text-2xl truncate">{formatCurrency(stats.totalGoal)}</div>
        </div>

        <div className="rounded-xl bg-white/10 p-2 md:p-4 backdrop-blur-sm border border-white/10 flex flex-col justify-center">
          <div className="mb-0.5 md:mb-1 flex items-center gap-1 text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-80">
            <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
            Guardado
          </div>
          <div className="font-headline font-extrabold text-sm md:text-2xl text-gold-200 truncate">{formatCurrency(stats.savedSoFar)}</div>
        </div>

        <div className="rounded-xl bg-white/10 p-2 md:p-4 backdrop-blur-sm border border-white/10 flex flex-col justify-center">
          <div className="mb-0.5 md:mb-1 text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-80">Depósitos</div>
          <div className="font-headline font-extrabold text-sm md:text-2xl truncate">
            {stats.depositsCompleted}<span className="text-white/50 text-[10px] md:text-base">/{stats.totalDeposits}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
