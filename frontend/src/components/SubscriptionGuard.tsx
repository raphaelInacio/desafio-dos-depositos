import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../hooks/useUserData';
import { UpgradeModal } from './UpgradeModal';
import { Timestamp } from 'firebase/firestore';

export const SubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, loading: authLoading } = useAuth();
    const { userData, loading: userLoading } = useUserData();
    const [showBlocker, setShowBlocker] = useState(false);

    useEffect(() => {
        if (!authLoading && !userLoading && user && userData) {
            // Check if user is premium
            if (userData.isPremium) {
                setShowBlocker(false);
                return;
            }

            // Check if trial is expired
            if (userData.trialExpiresAt) {
                const now = new Date();
                const trialEnd = userData.trialExpiresAt instanceof Timestamp
                    ? userData.trialExpiresAt.toDate()
                    : new Date(userData.trialExpiresAt); // Fallback if it's already a date or string

                if (now > trialEnd) {
                    setShowBlocker(true);
                }
            }
        }
    }, [user, userData, authLoading, userLoading]);

    if (authLoading || userLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    /* 
       If blocker is active, we show the UpgradeModal permanently (or a variant of it).
       Since UpgradeModal is a Dialog, we can use it here.
       However, UpgradeModal usually has a close button. We might want a version that cannot be closed.
       For now, let's effectively block the view or redirect. 
       A cleaner UX might be to render the UpgradeModal with `open={true}` and `onClose={() => {}}` (no-op),
       but that might allow clicking outside.
       
       Let's use a full-screen blocker that USES the UpgradeModal logic but prevents dismissal,
       or simply return the UpgradeModal in a way that it covers everything.
    */

    if (showBlocker) {
        // Render a blocking state
        return (
            <div className="min-h-screen flex items-center justify-center bg-background relative">
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0" />
                <div className="z-10 w-full max-w-md">
                    <UpgradeModal
                        isOpen={true}
                        onClose={() => {/* No-op to prevent closing */ }}
                        triggerAction="continuar usando o app"
                    />
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
