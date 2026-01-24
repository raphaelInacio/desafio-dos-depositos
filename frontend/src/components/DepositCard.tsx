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
          ? 'border-emerald bg-emerald text-white shadow-tactile translate-x-[2px] translate-y-[2px] active:translate-x-0 active:translate-y-0 active:shadow-sm'
          : 'border-black/10 bg-white text-text hover:border-pink hover:text-pink hover:shadow-md'
      )}
    >
      {deposit.isPaid && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#fbbf24] to-gold text-white shadow-sm"
        >
          <Check className="h-3 w-3" strokeWidth={3} />
        </motion.div>
      )}

      <span className="font-headline font-extrabold text-xs sm:text-sm leading-none pt-1">
        {formatCurrency(deposit.value).replace('R$', '')}
      </span>
      <span className={cn(
        'text-[9px] sm:text-[10px] font-subhead uppercase tracking-wider opacity-60',
        deposit.isPaid ? 'text-white' : 'text-text-light'
      )}>
        {deposit.isPaid ? 'Pago' : 'Poupar'}
      </span>
    </motion.button>
  );
}
