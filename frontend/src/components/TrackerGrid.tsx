import { Deposit } from '@/types/challenge';
import { DepositCard } from './DepositCard';

interface TrackerGridProps {
  deposits: Deposit[];
  onToggleDeposit: (id: number) => void;
}

export function TrackerGrid({ deposits, onToggleDeposit }: TrackerGridProps) {
  return (
    <div className="grid grid-cols-4 gap-1.5 xs:gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8">
      {deposits.map((deposit, index) => (
        <DepositCard
          key={deposit.id}
          deposit={deposit}
          onToggle={onToggleDeposit}
          index={index}
        />
      ))}
    </div>
  );
}
