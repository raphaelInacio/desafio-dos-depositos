import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Deposit } from '@/types/challenge';
import { formatCurrency } from '@/lib/challengeUtils';
import { cn } from '@/lib/utils';

interface DepositCardProps {
  deposit: Deposit;
  onToggle: (id: number) => void;
  index: number;
}

export function DepositCard({ deposit, onToggle, index }: DepositCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle(deposit.id)}
      className={cn(
        'relative aspect-square w-full rounded-xl border-2 p-2 transition-all duration-300',
        'flex flex-col items-center justify-center gap-1',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        deposit.isPaid
          ? 'border-success bg-success text-success-foreground shadow-glow'
          : 'border-border bg-card text-card-foreground hover:border-primary/50 hover:shadow-card'
      )}
    >
      {deposit.isPaid && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-gold-foreground"
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </motion.div>
      )}
      
      <span className="text-xs font-medium opacity-60">#{deposit.id}</span>
      <span className={cn(
        'text-sm font-bold leading-none',
        deposit.isPaid && 'line-through opacity-70'
      )}>
        {formatCurrency(deposit.value)}
      </span>
    </motion.button>
  );
}
