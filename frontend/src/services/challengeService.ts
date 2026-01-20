import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    writeBatch,
    query,
    where,
    onSnapshot,
    Timestamp,
    Unsubscribe,
    increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { Challenge, Deposit } from "@/types/challenge";
import { generateDeposits } from "@/lib/challengeUtils";

// ==================== TYPES ====================

export interface ChallengeInput {
    name: string;
    targetAmount: number;
    numberOfDeposits: number;
    mode: "classic" | "fixed";
}

// ==================== CONVERTERS ====================

/**
 * Converte um documento Firestore para Challenge
 */
function firestoreToChallenge(id: string, data: any): Challenge {
    return {
        id,
        name: data.name,
        targetAmount: data.targetAmount,
        numberOfDeposits: data.numberOfDeposits,
        mode: data.mode,
        deposits: [], // Deposits carregados separadamente
        createdAt: data.createdAt?.toDate() || new Date(),
        completedAt: data.completedAt?.toDate(),
        isPaid: data.isPaid || false,
        adsDepositCounter: data.adsDepositCounter || 0,
    };
}

/**
 * Converte um documento Firestore para Deposit
 */
function firestoreToDeposit(id: string, data: any): Deposit {
    return {
        id: parseInt(id, 10),
        value: data.value,
        isPaid: data.isPaid || false,
        paidAt: data.paidAt?.toDate(),
        note: data.note,
        receiptUrl: data.receiptUrl,
    };
}

/**
 * Converte Challenge para formato Firestore (sem deposits)
 */
function challengeToFirestore(challenge: Omit<Challenge, "deposits">) {
    return {
        name: challenge.name,
        targetAmount: challenge.targetAmount,
        numberOfDeposits: challenge.numberOfDeposits,
        mode: challenge.mode,
        createdAt: Timestamp.fromDate(challenge.createdAt),
        completedAt: challenge.completedAt ? Timestamp.fromDate(challenge.completedAt) : null,
        isPaid: challenge.isPaid,
        adsDepositCounter: challenge.adsDepositCounter,
    };
}

/**
 * Converte Deposit para formato Firestore
 */
function depositToFirestore(deposit: Deposit) {
    return {
        value: deposit.value,
        isPaid: deposit.isPaid,
        paidAt: deposit.paidAt ? Timestamp.fromDate(deposit.paidAt) : null,
        note: deposit.note || null,
        receiptUrl: deposit.receiptUrl || null,
    };
}

// ==================== CRUD OPERATIONS ====================

/**
 * Cria um novo challenge com todos os deposits em batch write atômico
 */
export async function createChallenge(
    uid: string,
    input: ChallengeInput
): Promise<Challenge> {
    const challengeRef = doc(collection(db, `users/${uid}/challenges`));

    // Check user data for referral logic
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    // Default challenge state
    let isPaid = false;
    let adsDepositCounter = 0;

    if (userSnap.exists()) {
        const userData = userSnap.data();

        // 1. CONSUME REWARD Logic
        // If user has a claimed reward, this challenge is FREE (isPaid=true)
        if (userData.referralRewardClaimed) {
            isPaid = true;
            // Reset reward claimed status
            await updateDoc(userRef, { referralRewardClaimed: false });
        }

        // 2. GRANT REWARD Logic
        // Check if this is the FIRST challenge ever created by this user
        const challengesQuery = query(collection(db, `users/${uid}/challenges`));
        const challengesSnap = await getDocs(challengesQuery);

        // If snapshot is empty (or only contains the one we are about to create - but we haven't created it yet), 
        // wait, we are inside createChallenge, we haven't committed batch yet. 
        // But `challengesQuery` runs against DB.

        if (challengesSnap.empty && userData.referredBy) {
            // This is the first challenge! Check referrer.
            const referrerRef = doc(db, "users", userData.referredBy);
            const referrerSnap = await getDoc(referrerRef);

            if (referrerSnap.exists()) {
                // Grant reward to referrer
                await updateDoc(referrerRef, {
                    referralRewardClaimed: true,
                    trialExpiresAt: null // Infinite trial logic for next challenge uses referralRewardClaimed
                });
            }
        }
    }

    const challenge: Omit<Challenge, "deposits"> = {
        id: challengeRef.id,
        name: input.name,
        targetAmount: input.targetAmount,
        numberOfDeposits: input.numberOfDeposits,
        mode: input.mode,
        createdAt: new Date(),
        isPaid: isPaid,
        adsDepositCounter: adsDepositCounter,
    };

    // Gerar deposits usando a função utilitária existente
    const deposits = generateDeposits(
        input.targetAmount,
        input.numberOfDeposits,
        input.mode
    );

    // Batch write: challenge + todos os deposits atomicamente
    const batch = writeBatch(db);

    // Adicionar challenge
    batch.set(challengeRef, challengeToFirestore(challenge));

    // Adicionar todos os deposits
    for (const deposit of deposits) {
        const depositRef = doc(
            collection(challengeRef, "deposits"),
            deposit.id.toString()
        );
        batch.set(depositRef, depositToFirestore(deposit));
    }

    await batch.commit();

    return {
        ...challenge,
        deposits,
    };
}

/**
 * Busca todos os challenges de um usuário
 */
export async function getChallenges(uid: string): Promise<Challenge[]> {
    const challengesRef = collection(db, `users/${uid}/challenges`);
    const snapshot = await getDocs(challengesRef);

    const challenges: Challenge[] = [];

    for (const docSnap of snapshot.docs) {
        const challenge = firestoreToChallenge(docSnap.id, docSnap.data());

        // Carregar deposits
        const deposits = await getDeposits(uid, challenge.id);
        challenges.push({
            ...challenge,
            deposits,
        });
    }

    return challenges;
}

/**
 * Busca um challenge específico por ID
 */
export async function getChallenge(
    uid: string,
    challengeId: string
): Promise<Challenge | null> {
    const challengeRef = doc(db, `users/${uid}/challenges/${challengeId}`);
    const docSnap = await getDoc(challengeRef);

    if (!docSnap.exists()) {
        return null;
    }

    const challenge = firestoreToChallenge(docSnap.id, docSnap.data());
    const deposits = await getDeposits(uid, challengeId);

    return {
        ...challenge,
        deposits,
    };
}

/**
 * Busca todos os deposits de um challenge
 */
export async function getDeposits(
    uid: string,
    challengeId: string
): Promise<Deposit[]> {
    const depositsRef = collection(
        db,
        `users/${uid}/challenges/${challengeId}/deposits`
    );
    const snapshot = await getDocs(depositsRef);

    return snapshot.docs
        .map((doc) => firestoreToDeposit(doc.id, doc.data()))
        .sort((a, b) => a.id - b.id); // Ordenar por ID
}

/**
 * Atualiza um deposit específico
 */
export async function updateDeposit(
    uid: string,
    challengeId: string,
    depositId: number,
    updates: Partial<Deposit>
): Promise<void> {
    const depositRef = doc(
        db,
        `users/${uid}/challenges/${challengeId}/deposits/${depositId}`
    );

    const firestoreUpdates: any = {};

    if (updates.isPaid !== undefined) {
        firestoreUpdates.isPaid = updates.isPaid;
    }
    if (updates.paidAt !== undefined) {
        firestoreUpdates.paidAt = updates.paidAt
            ? Timestamp.fromDate(updates.paidAt)
            : null;
    }
    if (updates.note !== undefined) {
        firestoreUpdates.note = updates.note || null;
    }
    if (updates.receiptUrl !== undefined) {
        firestoreUpdates.receiptUrl = updates.receiptUrl || null;
    }

    await updateDoc(depositRef, firestoreUpdates);

    // Se o depósito foi marcado como pago, incrementar o contador de ads no challenge
    if (updates.isPaid === true) {
        const challengeRef = doc(db, `users/${uid}/challenges/${challengeId}`);
        await updateDoc(challengeRef, {
            adsDepositCounter: increment(1)
        });
    }
}

/**
 * Atualiza o challenge (ex: completedAt quando todos deposits pagos)
 */
export async function updateChallenge(
    uid: string,
    challengeId: string,
    updates: Partial<Omit<Challenge, "deposits" | "id">>
): Promise<void> {
    const challengeRef = doc(db, `users/${uid}/challenges/${challengeId}`);

    const firestoreUpdates: any = {};

    if (updates.name !== undefined) {
        firestoreUpdates.name = updates.name;
    }
    if (updates.completedAt !== undefined) {
        firestoreUpdates.completedAt = updates.completedAt
            ? Timestamp.fromDate(updates.completedAt)
            : null;
    }

    await updateDoc(challengeRef, firestoreUpdates);
}

/**
 * Deleta um challenge e todos os seus deposits
 */
export async function deleteChallenge(
    uid: string,
    challengeId: string
): Promise<void> {
    // Deletar todos os deposits primeiro
    const depositsRef = collection(
        db,
        `users/${uid}/challenges/${challengeId}/deposits`
    );
    const depositsSnapshot = await getDocs(depositsRef);

    const batch = writeBatch(db);

    depositsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });

    // Deletar o challenge
    const challengeRef = doc(db, `users/${uid}/challenges/${challengeId}`);
    batch.delete(challengeRef);

    await batch.commit();
}

// ==================== REALTIME LISTENERS ====================

/**
 * Subscribe para updates em tempo real de um challenge específico
 */
export function subscribeToChallenge(
    uid: string,
    challengeId: string,
    onUpdate: (challenge: Challenge) => void,
    onError?: (error: Error) => void
): Unsubscribe {
    const challengeRef = doc(db, `users/${uid}/challenges/${challengeId}`);

    return onSnapshot(
        challengeRef,
        async (docSnap) => {
            if (!docSnap.exists()) {
                return;
            }

            const challenge = firestoreToChallenge(docSnap.id, docSnap.data());
            const deposits = await getDeposits(uid, challengeId);

            onUpdate({
                ...challenge,
                deposits,
            });
        },
        (error) => {
            console.error("Error in challenge listener:", error);
            if (onError) {
                onError(error);
            }
        }
    );
}

/**
 * Subscribe para updates em tempo real de todos os challenges do usuário
 */
export function subscribeToChallenges(
    uid: string,
    onUpdate: (challenges: Challenge[]) => void,
    onError?: (error: Error) => void
): Unsubscribe {
    const challengesRef = collection(db, `users/${uid}/challenges`);

    return onSnapshot(
        challengesRef,
        async (snapshot) => {
            const challenges: Challenge[] = [];

            for (const docSnap of snapshot.docs) {
                const challenge = firestoreToChallenge(docSnap.id, docSnap.data());
                const deposits = await getDeposits(uid, challenge.id);
                challenges.push({
                    ...challenge,
                    deposits,
                });
            }

            onUpdate(challenges);
        },
        (error) => {
            console.error("Error in challenges listener:", error);
            if (onError) {
                onError(error);
            }
        }
    );
}
