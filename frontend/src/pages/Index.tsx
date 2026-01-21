import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { ChallengeTracker } from '@/components/ChallengeTracker';
import { CreateChallengeModal } from '@/components/CreateChallengeModal';
import { ReferralCard } from '@/components/ReferralCard';
import { useChallengeStore } from '@/hooks/useChallengeStore';
import { useUserData } from '@/hooks/useUserData';
import { createChallenge } from '@/lib/challengeUtils'; // Keep for offline mode fallback
import { useAuth } from '@/contexts/AuthContext';
import { canCreateChallenge } from '@/services/challengeService';

import { ThemeSelector } from '@/components/ThemeSelector';
import { AdBanner } from '@/components/ads/AdBanner';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const { challenge, challenges, selectChallenge, isLoaded, saveChallenge, toggleDeposit, resetChallenge } = useChallengeStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { showAd } = useInterstitialAd();
  const { userData } = useUserData();
  const { user } = useAuth();

  const handleCreateChallenge = (
    name: string,
    targetAmount: number,
    numberOfDeposits: number,
    mode: 'classic' | 'fixed'
  ) => {
    const newChallenge = createChallenge(name, targetAmount, numberOfDeposits, mode);
    saveChallenge(newChallenge);
    setShowCreateModal(false);
  };

  const onNewChallengeClick = () => {
    // Check limits
    const currentCount = challenges ? challenges.length : (challenge ? 1 : 0);
    if (canCreateChallenge(userData, currentCount)) {
      setShowCreateModal(true);
    } else {
      setShowUpgradeModal(true);
    }
  };

  const handleToggleDeposit = async (depositId: number) => {
    if (!challenge) return;

    const deposit = challenge.deposits.find((d) => d.id === depositId);
    if (deposit && !deposit.isPaid && !challenge.isPaid) {
      const nextCounter = (challenge.adsDepositCounter || 0) + 1;
      if (nextCounter % 3 === 0) {
        await showAd();
      }
    }

    await toggleDeposit(depositId);
  };

  // Show loading state while hydrating
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
      {/* Top Bar for Multi-Challenge */}
      {challenges && challenges.length > 0 && (
        <div className="container max-w-md mx-auto px-4 pt-4 flex items-center justify-between">
          {challenges.length > 1 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 max-w-[200px]">
                  <span className="truncate">{challenge.name}</span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {challenges.map(c => (
                  <DropdownMenuItem key={c.id} onClick={() => selectChallenge(c.id)}>
                    {c.name} {c.isPaid && "✨"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="font-semibold text-lg truncate max-w-[200px]">{challenge.name}</div>
          )}

          <Button size="sm" variant="ghost" className="text-primary gap-1" onClick={onNewChallengeClick}>
            <Plus className="w-4 h-4" /> Novo
          </Button>
        </div>
      )}

      <ChallengeTracker
        challenge={challenge}
        onToggleDeposit={handleToggleDeposit}
        onReset={resetChallenge}
      />

      {/* Show Referral Card if authenticated */}
      {user && userData && (
        <div className="container max-w-md mx-auto px-4 pb-20 space-y-6">
          <ReferralCard
            referralCode={userData.referralCode}
            hasAvailableReward={userData.referralRewardClaimed}
            className="mt-6"
          />

          <div className="bg-card rounded-2xl p-6 shadow-sm border space-y-4">
            <h3 className="font-semibold text-lg">Personalização</h3>
            <ThemeSelector />
          </div>
        </div>
      )}

      <AdBanner challenge={challenge} />

      <CreateChallengeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateChallenge}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        triggerAction="criar múltiplos desafios"
      />
    </>
  );
};

export default Index;
