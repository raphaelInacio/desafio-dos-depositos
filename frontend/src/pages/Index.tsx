import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { ChallengeTracker } from '@/components/ChallengeTracker';
import { CreateChallengeModal } from '@/components/CreateChallengeModal';
import { ReferralCard } from '@/components/ReferralCard';
import { useChallengeStore } from '@/hooks/useChallengeStore';
import { useUserData } from '@/hooks/useUserData';
import { createChallenge } from '@/lib/challengeUtils'; // Keep for offline mode fallback
import { useAuth } from '@/contexts/AuthContext';

import { AdBanner } from '@/components/ads/AdBanner';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';

const Index = () => {
  const { challenge, isLoaded, saveChallenge, toggleDeposit, resetChallenge } = useChallengeStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { showAd } = useInterstitialAd();
  const { userData } = useUserData();
  const { user } = useAuth();

  const handleCreateChallenge = (
    name: string,
    targetAmount: number,
    numberOfDeposits: number,
    mode: 'classic' | 'fixed'
  ) => {
    // Check limits for Free users (if authenticated logic should ideally be here or in modal)
    // Detailed validation is better placed in "canCreateChallenge" logic
    const newChallenge = createChallenge(name, targetAmount, numberOfDeposits, mode);
    saveChallenge(newChallenge);
    setShowCreateModal(false);
  };

  const handleToggleDeposit = async (depositId: number) => {
    if (!challenge) return;

    const deposit = challenge.deposits.find((d) => d.id === depositId);
    if (deposit && !deposit.isPaid && !challenge.isPaid) {
      // Check if this payment triggers an interstitial (every 3rd deposit)
      // We use current counter + 1 because this action will increment it
      const nextCounter = (challenge.adsDepositCounter || 0) + 1;
      if (nextCounter % 3 === 0) {
        await showAd();
      }
    }

    await toggleDeposit(depositId);
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
    <>
      <ChallengeTracker
        challenge={challenge}
        onToggleDeposit={handleToggleDeposit}
        onReset={resetChallenge}
      />

      {/* Show Referral Card if authenticated */}
      {user && userData && (
        <div className="container max-w-md mx-auto px-4 pb-20">
          <ReferralCard
            referralCode={userData.referralCode}
            hasAvailableReward={userData.referralRewardClaimed}
            className="mt-6"
          />
        </div>
      )}

      <AdBanner challenge={challenge} />
    </>
  );
};

export default Index;
