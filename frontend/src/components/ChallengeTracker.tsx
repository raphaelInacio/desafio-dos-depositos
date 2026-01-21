import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Settings } from 'lucide-react';
import { ProgressHeader } from './ProgressHeader';
import { TrackerGrid } from './TrackerGrid';
import { CelebrationModal } from './CelebrationModal';
import { Challenge } from '@/types/challenge';
import { calculateStats } from '@/lib/challengeUtils';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ChallengeTrackerProps {
  challenge: Challenge;
  onToggleDeposit: (depositId: number) => void;
  onReset: () => void;
}

export function ChallengeTracker({ challenge, onToggleDeposit, onReset }: ChallengeTrackerProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastPaidDeposit, setLastPaidDeposit] = useState<number | null>(null);
  const previousPaidRef = useRef<Set<number>>(new Set());

  const stats = calculateStats(challenge);

  // Detect when a new deposit is marked as paid
  useEffect(() => {
    const currentPaid = new Set(
      challenge.deposits.filter((d) => d.isPaid).map((d) => d.id)
    );

    // Find newly paid deposits
    currentPaid.forEach((id) => {
      if (!previousPaidRef.current.has(id)) {
        const deposit = challenge.deposits.find((d) => d.id === id);
        if (deposit) {
          setLastPaidDeposit(deposit.value);
          setShowCelebration(true);
        }
      }
    });

    previousPaidRef.current = currentPaid;
  }, [challenge.deposits]);

  const handleToggle = useCallback((depositId: number) => {
    onToggleDeposit(depositId);
  }, [onToggleDeposit]);

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 px-4 py-4 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          {/* Challenge Name as Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald to-gold rounded-full flex items-center justify-center text-xl shadow-sm">
              💰
            </div>
            <div>
              <h1 className="font-headline font-extrabold text-lg leading-tight text-text">
                {challenge.name}
              </h1>
              <p className="text-[10px] uppercase tracking-wider font-bold text-text-light">
                {stats.progressPercentage}% concluído
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-pink font-bold hover:text-pink/80 hover:bg-pink/5 gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Reiniciar</span>
                  <span className="sm:hidden">Novo</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl border-2 border-black/5 shadow-card">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-headline font-extrabold text-2xl">Começar um novo desafio?</AlertDialogTitle>
                  <AlertDialogDescription className="text-text-light font-subhead text-base">
                    Isso irá apagar todo o seu progresso atual em <strong className="text-text">{challenge.name}</strong>. Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl font-bold border-2 border-black/10">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onReset} className="bg-destructive hover:bg-destructive/90 text-white font-bold rounded-xl shadow-sm">
                    Sim, reiniciar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-4xl px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <ProgressHeader challenge={challenge} stats={stats} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TrackerGrid deposits={challenge.deposits} onToggleDeposit={handleToggle} />
        </motion.div>
      </main>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        depositValue={lastPaidDeposit || 0}
        totalSaved={stats.savedSoFar}
        progressPercentage={stats.progressPercentage}
      />
    </div>
  );
}
