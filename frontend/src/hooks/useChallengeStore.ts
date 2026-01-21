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
  subscribeToChallenges,
  ChallengeInput,
} from '@/services/challengeService';

const STORAGE_KEY = 'desafio-depositos-challenge';

export function useChallengeStore() {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]); // Task 8.0: Store all challenges
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
        // Setup realtime listener for ALL challenges
        unsubscribe = subscribeToChallenges( // Use subscribeToChallenges instead of one-off get
          user.uid,
          (updatedChallenges) => {
            setChallenges(updatedChallenges);

            // If there's no active challenge selected, or the selected one was deleted, select the first one
            setChallenge(prev => {
              if (!prev) return updatedChallenges.length > 0 ? updatedChallenges[0] : null;

              const stillExists = updatedChallenges.find(c => c.id === prev.id);
              return stillExists || (updatedChallenges.length > 0 ? updatedChallenges[0] : null);
            });

            setIsLoaded(true);
          },
          (error) => {
            console.error('Error in challenges subscription:', error);
            setIsLoaded(true); // Ensure we set loaded even on error
          }
        );

      } catch (error) {
        console.error('Failed to setup challenges listener:', error);
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
        setChallenges([parsed]); // LocalStorage supports only 1 for now
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
      // LocalStorage mode doesn't really store the array, just the active one
    }
  }, [challenge, isLoaded, user]);

  // ==================== PUBLIC INTERFACE ====================

  const selectChallenge = useCallback((challengeId: string) => {
    const selected = challenges.find(c => c.id === challengeId);
    if (selected) {
      setChallenge(selected);
    }
  }, [challenges]);

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
        // Optimistic update handled by listener, but we can try to set it immediately if needed
        // setChallenge(created); 
      } catch (error) {
        console.error('Failed to create challenge in Firestore:', error);
        throw error;
      }
    } else {
      // localStorage mode
      setChallenge(newChallenge);
      setChallenges([newChallenge]);
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

        // Listener will update state
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
        const updatedChallenge = {
          ...prev,
          deposits: updatedDeposits,
          completedAt: allPaid ? new Date() : undefined,
        };

        setChallenges([updatedChallenge]);
        return updatedChallenge;
      });
    }
  }, [user, challenge]);

  const resetChallenge = useCallback(async () => {
    if (user && challenge) {
      // Firestore mode: delete challenge from backend
      try {
        await deleteChallenge(user.uid, challenge.id);
        // Listener handles removal
      } catch (error) {
        console.error('Failed to delete challenge from Firestore:', error);
        throw error;
      }
    } else {
      // localStorage mode
      localStorage.removeItem(STORAGE_KEY);
      setChallenge(null);
      setChallenges([]);
    }
  }, [user, challenge]);

  return {
    challenge,
    challenges,
    selectChallenge,
    isLoaded,
    saveChallenge,
    toggleDeposit,
    resetChallenge,
  };
}
