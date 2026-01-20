import { db } from "./firebase";
import { doc, setDoc, getDoc, Timestamp, updateDoc, query, collection, where, getDocs } from "firebase/firestore";
import { User } from "firebase/auth";

export interface UserData {
    email: string;
    displayName: string;
    isPremium: boolean;
    trialExpiresAt: Timestamp | null;
    referralCode: string;
    referredBy: string | null;
    referralRewardClaimed: boolean;
    asaasCustomerId: string | null;
    createdAt: Timestamp;
}

const generateReferralCode = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const createUserDocument = async (user: User, displayName: string, referralCodeArg?: string): Promise<void> => {
    if (!user.email) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const trialExpiresAt = new Date();
        trialExpiresAt.setDate(trialExpiresAt.getDate() + 3);

        let uniqueReferralCode = "";
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 5) {
            uniqueReferralCode = generateReferralCode();
            const q = query(collection(db, "users"), where("referralCode", "==", uniqueReferralCode));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            // Fallback or error handling if needed, but 8 chars is huge space
            console.error("Failed to generate unique referral code after 5 attempts");
            // Proceed anyway to not block user, collision extremely unlikely
        }

        const userData: UserData = {
            email: user.email,
            displayName: displayName,
            isPremium: false,
            trialExpiresAt: Timestamp.fromDate(trialExpiresAt),
            referralCode: uniqueReferralCode,
            referredBy: referralCodeArg || null,
            referralRewardClaimed: false,
            asaasCustomerId: null,
            createdAt: Timestamp.now(),
        };

        await setDoc(userRef, userData);
    }
};

export const getUserDocument = async (uid: string): Promise<UserData | null> => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        return userSnap.data() as UserData;
    }
    return null;
};
