import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { PartyPopper, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/challengeUtils';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  depositValue: number;
  totalSaved: number;
  progressPercentage: number;
}

export function CelebrationModal({
  isOpen,
  onClose,
  depositValue,
  totalSaved,
  progressPercentage,
}: CelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti!
      const duration = 2000;
      const end = Date.now() + duration;

      const colors = ['#22c55e', '#f59e0b', '#3b82f6', '#ec4899'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen]);

  const handleShare = async () => {
    const text = `🎉 Acabei de guardar ${formatCurrency(depositValue)}! Já tenho ${formatCurrency(totalSaved)} (${progressPercentage}%) do meu objetivo. #DesafioDosDepósitos`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Desafio dos Depósitos',
          text,
        });
      } catch (e) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(text);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-card p-6 text-center shadow-card-hover"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full gradient-gold shadow-gold"
            >
              <PartyPopper className="h-10 w-10 text-gold-foreground" />
            </motion.div>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-2 text-2xl font-bold"
            >
              Parabéns! 🎉
            </motion.h2>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-2 text-muted-foreground"
            >
              Você acabou de guardar
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-4 text-3xl font-bold text-gradient-hero"
            >
              {formatCurrency(depositValue)}
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-6 rounded-xl bg-muted p-4"
            >
              <div className="text-sm text-muted-foreground">Total guardado</div>
              <div className="text-xl font-bold">{formatCurrency(totalSaved)}</div>
              <div className="mt-1 text-sm font-semibold text-primary">
                {progressPercentage}% da meta
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex gap-3"
            >
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Continuar
              </Button>
              <Button variant="hero" className="flex-1" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
