import { useState, useEffect, useCallback } from 'react';
import { Challenge } from '@/types/challenge';
import { useAuth } from '@/contexts/AuthContext';
import {
  createChallenge,
  getChallenges,
  updateDeposit,
  updateChallenge,
  deleteChallenge,
  subscribeToChallenge,
  ChallengeInput,
} from '@/services/challengeService';

const STORAGE_KEY = 'desafio-depositos-challenge';

export function useChallengeStore() {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // ==================== MODO FIRESTORE ====================

  // Load from Firestore when authenticated
  useEffect(() => {
    if (!user) {
      setIsLoaded(true);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const loadChallenges = async () => {
      try {
        const challenges = await getChallenges(user.uid);

        // Por enquanto, pegamos apenas o primeiro challenge
        // TODO: Implementar múltiplos challenges na Task 8.0 (Premium Features)
        if (challenges.length > 0) {
          setChallenge(challenges[0]);

          // Setup realtime listener
          unsubscribe = subscribeToChallenge(
            user.uid,
            challenges[0].id,
            (updatedChallenge) => {
              setChallenge(updatedChallenge);
            },
            (error) => {
              console.error('Error in challenge subscription:', error);
            }
          );
        }
      } catch (error) {
        console.error('Failed to load challenges from Firestore:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadChallenges();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  // ==================== MODO LOCALSTORAGE ====================

  // Load from localStorage when NOT authenticated (fallback)
  useEffect(() => {
    if (user) return; // Skip if authenticated (Firestore mode)

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
  }, [user]);

  // Save to localStorage whenever challenge changes (only if NOT authenticated)
  useEffect(() => {
    if (user) return; // Skip if authenticated (Firestore handles persistence)

    if (isLoaded && challenge) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(challenge));
    }
  }, [challenge, isLoaded, user]);

  // ==================== PUBLIC INTERFACE ====================

  const saveChallenge = useCallback(async (newChallenge: Challenge) => {
    if (user) {
      // Firestore mode: create challenge in backend
      try {
        const input: ChallengeInput = {
          name: newChallenge.name,
          targetAmount: newChallenge.targetAmount,
          numberOfDeposits: newChallenge.numberOfDeposits,
          mode: newChallenge.mode,
        };

        const created = await createChallenge(user.uid, input);
        setChallenge(created);
      } catch (error) {
        console.error('Failed to create challenge in Firestore:', error);
        throw error;
      }
    } else {
      // localStorage mode
      setChallenge(newChallenge);
    }
  }, [user]);

  const toggleDeposit = useCallback(async (depositId: number) => {
    if (!challenge) return;

    if (user) {
      // Firestore mode: update deposit in backend
      try {
        const deposit = challenge.deposits.find((d) => d.id === depositId);
        if (!deposit) return;

        const updates = {
          isPaid: !deposit.isPaid,
          paidAt: !deposit.isPaid ? new Date() : undefined,
        };

        await updateDeposit(user.uid, challenge.id, depositId, updates);

        // Check if all deposits are now paid
        const updatedDeposits = challenge.deposits.map((d) =>
          d.id === depositId ? { ...d, ...updates } : d
        );
        const allPaid = updatedDeposits.every((d) => d.isPaid);

        if (allPaid && !challenge.completedAt) {
          await updateChallenge(user.uid, challenge.id, {
            completedAt: new Date(),
          });
        } else if (!allPaid && challenge.completedAt) {
          await updateChallenge(user.uid, challenge.id, {
            completedAt: undefined,
          });
        }

        // Listener will update the state automatically
      } catch (error) {
        console.error('Failed to update deposit in Firestore:', error);
        throw error;
      }
    } else {
      // localStorage mode
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
    }
  }, [user, challenge]);

  const resetChallenge = useCallback(async () => {
    if (user && challenge) {
      // Firestore mode: delete challenge from backend
      try {
        await deleteChallenge(user.uid, challenge.id);
        setChallenge(null);
      } catch (error) {
        console.error('Failed to delete challenge from Firestore:', error);
        throw error;
      }
    } else {
      // localStorage mode
      localStorage.removeItem(STORAGE_KEY);
      setChallenge(null);
    }
  }, [user, challenge]);

  return {
    challenge,
    isLoaded,
    saveChallenge,
    toggleDeposit,
    resetChallenge,
  };
}
