import { Challenge, Deposit, ChallengeStats } from '@/types/challenge';

export function generateDeposits(
  targetAmount: number,
  numberOfDeposits: number,
  mode: 'classic' | 'fixed'
): Deposit[] {
  if (mode === 'fixed') {
    const fixedValue = Math.round((targetAmount / numberOfDeposits) * 100) / 100;
    return Array.from({ length: numberOfDeposits }, (_, i) => ({
      id: i + 1,
      value: fixedValue,
      isPaid: false,
    }));
  }

  // Classic mode: Generate varied values that sum to targetAmount
  // Using a simple distribution algorithm
  const deposits: Deposit[] = [];
  let remainingAmount = targetAmount;
  const minValue = Math.max(1, Math.floor(targetAmount / numberOfDeposits / 3));
  const maxValue = Math.ceil((targetAmount / numberOfDeposits) * 2);

  for (let i = 0; i < numberOfDeposits - 1; i++) {
    const avgRemaining = remainingAmount / (numberOfDeposits - i);
    const min = Math.max(minValue, avgRemaining * 0.3);
    const max = Math.min(maxValue, avgRemaining * 1.7, remainingAmount - (numberOfDeposits - i - 1) * minValue);
    
    let value = Math.round(min + Math.random() * (max - min));
    value = Math.max(1, Math.min(value, remainingAmount - (numberOfDeposits - i - 1)));
    
    deposits.push({
      id: i + 1,
      value,
      isPaid: false,
    });
    remainingAmount -= value;
  }

  // Last deposit gets the remainder
  deposits.push({
    id: numberOfDeposits,
    value: Math.round(remainingAmount * 100) / 100,
    isPaid: false,
  });

  // Shuffle the deposits for variety
  return deposits
    .sort(() => Math.random() - 0.5)
    .map((d, i) => ({ ...d, id: i + 1 }));
}

export function calculateStats(challenge: Challenge): ChallengeStats {
  const savedSoFar = challenge.deposits
    .filter((d) => d.isPaid)
    .reduce((sum, d) => sum + d.value, 0);
  
  const depositsCompleted = challenge.deposits.filter((d) => d.isPaid).length;
  
  return {
    totalGoal: challenge.targetAmount,
    savedSoFar: Math.round(savedSoFar * 100) / 100,
    remainingAmount: Math.round((challenge.targetAmount - savedSoFar) * 100) / 100,
    progressPercentage: Math.round((savedSoFar / challenge.targetAmount) * 100),
    depositsCompleted,
    totalDeposits: challenge.numberOfDeposits,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function createChallenge(
  name: string,
  targetAmount: number,
  numberOfDeposits: number,
  mode: 'classic' | 'fixed'
): Challenge {
  return {
    id: crypto.randomUUID(),
    name,
    targetAmount,
    numberOfDeposits,
    mode,
    deposits: generateDeposits(targetAmount, numberOfDeposits, mode),
    createdAt: new Date(),
  };
}
