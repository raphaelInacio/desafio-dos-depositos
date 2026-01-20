import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { ChallengeTracker } from '@/components/ChallengeTracker';
import { CreateChallengeModal } from '@/components/CreateChallengeModal';
import { useChallengeStore } from '@/hooks/useChallengeStore';
import { createChallenge } from '@/lib/challengeUtils';

const Index = () => {
  const { challenge, isLoaded, saveChallenge, toggleDeposit, resetChallenge } = useChallengeStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateChallenge = (
    name: string,
    targetAmount: number,
    numberOfDeposits: number,
    mode: 'classic' | 'fixed'
  ) => {
    const newChallenge = createChallenge(name, targetAmount, numberOfDeposits, mode);
    saveChallenge(newChallenge);
  };

  // Show loading state while hydrating from localStorage
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If no challenge exists, show the hero/landing page
  if (!challenge) {
    return (
      <>
        <HeroSection onStartChallenge={() => setShowCreateModal(true)} />
        <CreateChallengeModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateChallenge}
        />
      </>
    );
  }

  // Show the tracker if a challenge exists
  return (
    <ChallengeTracker
      challenge={challenge}
      onToggleDeposit={toggleDeposit}
      onReset={resetChallenge}
    />
  );
};

export default Index;
