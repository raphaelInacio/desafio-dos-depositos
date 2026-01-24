import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Palette, Plus, ChevronDown, RotateCcw, Settings } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSelector } from './ThemeSelector';
import { ReferralCard } from './ReferralCard';
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
  challenges?: Challenge[];
  onToggleDeposit: (depositId: number) => void;
  onReset: () => void;
  onSelectChallenge: (id: string) => void;
  onNewChallenge: () => void;
  userData?: any;
}

export function ChallengeTracker({
  challenge,
  challenges,
  onToggleDeposit,
  onReset,
  onSelectChallenge,
  onNewChallenge,
  userData
}: ChallengeTrackerProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastPaidDeposit, setLastPaidDeposit] = useState<number | null>(null);

  // Initialize with currently paid deposits to avoid celebration on first load
  const previousPaidRef = useRef<Set<number>>(
    new Set(challenge.deposits.filter((d) => d.isPaid).map((d) => d.id))
  );

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
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 px-3 py-2 md:px-4 md:py-3 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          {/* Left: Challenge Selector */}
          <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald to-gold rounded-full flex items-center justify-center text-lg md:text-xl shadow-sm flex-shrink-0">
              💰
            </div>

            <div className="flex flex-col overflow-hidden">
              {challenges && challenges.length > 1 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 font-headline font-extrabold text-base md:text-lg leading-tight text-text hover:text-pink transition-colors text-left">
                      <span className="truncate">{challenge.name}</span>
                      <ChevronDown className="w-3 h-3 md:w-4 md:h-4 opacity-50 flex-shrink-0" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    {challenges.map(c => (
                      <DropdownMenuItem key={c.id} onClick={() => onSelectChallenge(c.id)}>
                        {c.name} {c.isPaid && "✨"}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <h1 className="font-headline font-extrabold text-base md:text-lg leading-tight text-text truncate">
                  {challenge.name}
                </h1>
              )}

              <p className="text-[10px] uppercase tracking-wider font-bold text-text-light">
                {stats.progressPercentage}% concluído
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-primary gap-1 hidden sm:flex"
              onClick={onNewChallenge}
            >
              <Plus className="w-4 h-4" /> Novo
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="text-primary sm:hidden h-8 w-8"
              onClick={onNewChallenge}
            >
              <Plus className="w-5 h-5" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="text-text-light hover:text-text h-8 w-8 md:h-10 md:w-10">
                  <Settings className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle className="font-headline font-extrabold text-2xl">Configurações</SheetTitle>
                </SheetHeader>

                <div className="space-y-8">
                  {/* Share Section */}
                  {userData && (
                    <section>
                      <div className="flex items-center gap-2 mb-4 text-text font-bold text-lg">
                        <Share2 className="w-5 h-5 text-pink" />
                        <h3>Convidar Amigos</h3>
                      </div>
                      <ReferralCard
                        referralCode={userData.referralCode}
                        hasAvailableReward={userData.referralRewardClaimed}
                      />
                    </section>
                  )}

                  {/* Theme Section */}
                  <section>
                    <div className="flex items-center gap-2 mb-4 text-text font-bold text-lg">
                      <Palette className="w-5 h-5 text-purple-500" />
                      <h3>Aparência</h3>
                    </div>
                    <ThemeSelector />
                  </section>

                  {/* Danger Zone */}
                  <section className="pt-8 border-t border-black/5">
                    <h3 className="text-sm font-bold text-destructive mb-2 uppercase tracking-wider">Zona de Perigo</h3>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/5 border-destructive/20"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Reiniciar este desafio
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl border-2 border-black/5 shadow-card">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-headline font-extrabold text-2xl">Reiniciar desafio?</AlertDialogTitle>
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
                  </section>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-6 pb-24 md:pb-6">
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
