import { useState, useEffect, useCallback } from 'react';
import { Challenge } from '@/types/challenge';

const STORAGE_KEY = 'desafio-depositos-challenge';

export function useChallengeStore() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        parsed.createdAt = new Date(parsed.createdAt);
        if (parsed.completedAt) parsed.completedAt = new Date(parsed.completedAt);
        parsed.deposits = parsed.deposits.map((d: any) => ({
          ...d,
          paidAt: d.paidAt ? new Date(d.paidAt) : undefined,
        }));
        setChallenge(parsed);
      } catch (e) {
        console.error('Failed to parse stored challenge:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever challenge changes
  useEffect(() => {
    if (isLoaded && challenge) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(challenge));
    }
  }, [challenge, isLoaded]);

  const saveChallenge = useCallback((newChallenge: Challenge) => {
    setChallenge(newChallenge);
  }, []);

  const toggleDeposit = useCallback((depositId: number) => {
    setChallenge((prev) => {
      if (!prev) return prev;
      
      const updatedDeposits = prev.deposits.map((d) => {
        if (d.id === depositId) {
          return {
            ...d,
            isPaid: !d.isPaid,
            paidAt: !d.isPaid ? new Date() : undefined,
          };
        }
        return d;
      });

      const allPaid = updatedDeposits.every((d) => d.isPaid);

      return {
        ...prev,
        deposits: updatedDeposits,
        completedAt: allPaid ? new Date() : undefined,
      };
    });
  }, []);

  const resetChallenge = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setChallenge(null);
  }, []);

  return {
    challenge,
    isLoaded,
    saveChallenge,
    toggleDeposit,
    resetChallenge,
  };
}
