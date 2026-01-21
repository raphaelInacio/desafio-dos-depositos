import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { LandingHero } from '@/components/landing/LandingHero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { GallerySection } from '@/components/landing/GallerySection';
import { PricingSection } from '@/components/landing/PricingSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
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
  const navigate = useNavigate();

  const handleStartChallenge = () => {
    if (!user) {
      navigate('/register');
      return;
    }
    setShowCreateModal(true);
  };

  // Show Interstitial Ad on Page Load for Free Users
  useEffect(() => {
    if (user && challenge && !userData?.isPremium) {
      // Small delay to ensure UI is ready/viewable before ad attempts to show
      const timer = setTimeout(() => {
        showAd();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, challenge, userData?.isPremium]);

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
    if (!user) {
      navigate('/register');
      return;
    }
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

    // Ad trigger moved to page load
    // if (deposit && !deposit.isPaid && !challenge.isPaid) {
    //   const nextCounter = (challenge.adsDepositCounter || 0) + 1;
    //   // Only show ad if user is NOT premium
    //   if (nextCounter % 3 === 0 && !userData?.isPremium) {
    //     await showAd();
    //   }
    // }

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
        <LandingNavbar onStart={handleStartChallenge} />
        <LandingHero onStart={handleStartChallenge} />
        <HowItWorks />
        <GallerySection />
        <PricingSection onStart={handleStartChallenge} />
        <LandingFooter onStart={handleStartChallenge} />


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
        challenges={challenges}
        onToggleDeposit={handleToggleDeposit}
        onReset={resetChallenge}
        onSelectChallenge={selectChallenge}
        onNewChallenge={onNewChallengeClick}
        userData={userData}
      />

      <AdBanner challenge={challenge} isPremium={userData?.isPremium} />

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
