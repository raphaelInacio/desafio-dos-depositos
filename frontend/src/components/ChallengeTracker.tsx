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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-lg font-bold text-gradient-hero">Desafio</h1>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reiniciar desafio?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isso irá apagar todo o seu progresso atual. Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={onReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Reiniciar
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
          <ProgressHeader stats={stats} challengeName={challenge.name} />
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
