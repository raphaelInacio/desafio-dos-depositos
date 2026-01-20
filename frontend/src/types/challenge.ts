export interface Deposit {
  id: number;
  value: number;
  isPaid: boolean;
  paidAt?: Date;
  note?: string;
  receiptUrl?: string;
}

export interface Challenge {
  id: string;
  name: string;
  targetAmount: number;
  numberOfDeposits: number;
  mode: 'classic' | 'fixed';
  deposits: Deposit[];
  createdAt: Date;
  completedAt?: Date;
  isPaid: boolean;
  adsDepositCounter: number;
}

export interface ChallengeStats {
  totalGoal: number;
  savedSoFar: number;
  remainingAmount: number;
  progressPercentage: number;
  depositsCompleted: number;
  totalDeposits: number;
}
