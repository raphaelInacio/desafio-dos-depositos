import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    createChallenge,
    getChallenges,
    getDeposits,
    updateDeposit,
    deleteChallenge,
    subscribeToChallenge,
    ChallengeInput,
} from "./challengeService";
import * as firestore from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

// Mock do Firebase Firestore
vi.mock("firebase/firestore", async () => {
    const actual = await vi.importActual("firebase/firestore");
    return {
        ...actual,
        collection: vi.fn(),
        doc: vi.fn(),
        getDoc: vi.fn(),
        getDocs: vi.fn(),
        setDoc: vi.fn(),
        updateDoc: vi.fn(),
        deleteDoc: vi.fn(),
        writeBatch: vi.fn(),
        onSnapshot: vi.fn(),
        Timestamp: actual.Timestamp,
        increment: vi.fn(),
    };
});

// Mock do firebase.ts
vi.mock("./firebase", () => ({
    db: {},
    auth: {},
    storage: {},
}));

// Mock do challengeUtils
vi.mock("@/lib/challengeUtils", () => ({
    generateDeposits: vi.fn((targetAmount, numberOfDeposits, mode) => {
        // Mock simples: retorna deposits fixos
        return Array.from({ length: numberOfDeposits }, (_, i) => ({
            id: i + 1,
            value: targetAmount / numberOfDeposits,
            isPaid: false,
        }));
    }),
}));

describe("challengeService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("createChallenge", () => {
        it("should create challenge with batched deposits", async () => {
            const mockBatch = {
                set: vi.fn(),
                commit: vi.fn().mockResolvedValue(undefined),
            };

            const mockChallengeRef = { id: "challenge-123" };
            const mockDepositRef = { id: "1" };

            vi.mocked(firestore.doc).mockReturnValue(mockChallengeRef as any);
            vi.mocked(firestore.collection).mockReturnValue({} as any);
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);

            const input: ChallengeInput = {
                name: "Teste Challenge",
                targetAmount: 1000,
                numberOfDeposits: 10,
                mode: "fixed",
            };

            const result = await createChallenge("user-123", input);

            expect(result.id).toBe("challenge-123");
            expect(result.name).toBe("Teste Challenge");
            expect(result.targetAmount).toBe(1000);
            expect(result.numberOfDeposits).toBe(10);
            expect(result.numberOfDeposits).toBe(10);
            expect(result.deposits).toHaveLength(10);
            expect(result.isPaid).toBe(false);
            expect(result.adsDepositCounter).toBe(0);
            expect(mockBatch.commit).toHaveBeenCalledOnce();
            expect(mockBatch.set).toHaveBeenCalledTimes(11); // 1 challenge + 10 deposits
        });

        it("should generate correct document structure", async () => {
            const mockBatch = {
                set: vi.fn(),
                commit: vi.fn().mockResolvedValue(undefined),
            };

            vi.mocked(firestore.doc).mockReturnValue({ id: "test-id" } as any);
            vi.mocked(firestore.collection).mockReturnValue({} as any);
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);

            const input: ChallengeInput = {
                name: "Test",
                targetAmount: 100,
                numberOfDeposits: 2,
                mode: "classic",
            };

            await createChallenge("user-id", input);

            // Verificar que o primeiro set foi do challenge
            const challengeData = mockBatch.set.mock.calls[0][1];
            expect(challengeData).toHaveProperty("name", "Test");
            expect(challengeData).toHaveProperty("targetAmount", 100);
            expect(challengeData).toHaveProperty("numberOfDeposits", 2);
            expect(challengeData).toHaveProperty("mode", "classic");
            expect(challengeData.createdAt).toBeInstanceOf(Timestamp);
        });
    });

    describe("getChallenges", () => {
        it("should fetch and convert challenges for user", async () => {
            const mockChallengeDoc = {
                id: "challenge-1",
                data: () => ({
                    name: "My Challenge",
                    targetAmount: 500,
                    numberOfDeposits: 5,
                    mode: "fixed",
                    createdAt: Timestamp.now(),
                }),
            };

            const mockDepositDocs = [
                {
                    id: "1",
                    data: () => ({ value: 100, isPaid: true, paidAt: Timestamp.now() }),
                },
                {
                    id: "2",
                    data: () => ({ value: 100, isPaid: false, paidAt: null }),
                },
            ];

            vi.mocked(firestore.getDocs).mockResolvedValueOnce({
                docs: [mockChallengeDoc],
            } as any);

            vi.mocked(firestore.getDocs).mockResolvedValueOnce({
                docs: mockDepositDocs,
            } as any);

            const challenges = await getChallenges("user-123");

            expect(challenges).toHaveLength(1);
            expect(challenges[0].id).toBe("challenge-1");
            expect(challenges[0].name).toBe("My Challenge");
            expect(challenges[0].deposits).toHaveLength(2);
            expect(challenges[0].deposits[0].isPaid).toBe(true);
        });

        it("should return empty array if no challenges", async () => {
            vi.mocked(firestore.getDocs).mockResolvedValue({
                docs: [],
            } as any);

            const challenges = await getChallenges("user-123");

            expect(challenges).toEqual([]);
        });
    });

    describe("getDeposits", () => {
        it("should fetch deposits sorted by id", async () => {
            const mockDocs = [
                { id: "3", data: () => ({ value: 300, isPaid: false }) },
                { id: "1", data: () => ({ value: 100, isPaid: true }) },
                { id: "2", data: () => ({ value: 200, isPaid: false }) },
            ];

            vi.mocked(firestore.getDocs).mockResolvedValue({
                docs: mockDocs,
            } as any);

            const deposits = await getDeposits("user-123", "challenge-1");

            expect(deposits).toHaveLength(3);
            expect(deposits[0].id).toBe(1);
            expect(deposits[1].id).toBe(2);
            expect(deposits[2].id).toBe(3);
        });
    });

    describe("updateDeposit", () => {
        it("should update deposit isPaid and paidAt", async () => {
            const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
            vi.mocked(firestore.updateDoc).mockImplementation(mockUpdateDoc);
            vi.mocked(firestore.doc).mockReturnValue({} as any);

            const now = new Date();
            await updateDeposit("user-123", "challenge-1", 5, {
                isPaid: true,
                paidAt: now,
            });


            expect(mockUpdateDoc.mock.calls[0][1]).toHaveProperty("isPaid", true);
            expect(mockUpdateDoc.mock.calls[0][1].paidAt).toBeInstanceOf(Timestamp);

            // Verify counter increment
            expect(mockUpdateDoc).toHaveBeenCalledTimes(2);
            expect(mockUpdateDoc.mock.calls[1][1]).toEqual({
                adsDepositCounter: undefined, // increment returns undefined in mock unless implemented
            });
            expect(firestore.increment).toHaveBeenCalledWith(1);
        });

        it("should handle partial updates", async () => {
            const mockUpdateDoc = vi.fn().mockResolvedValue(undefined);
            vi.mocked(firestore.updateDoc).mockImplementation(mockUpdateDoc);
            vi.mocked(firestore.doc).mockReturnValue({} as any);

            await updateDeposit("user-123", "challenge-1", 1, {
                note: "Saved from selling old books",
            });

            expect(mockUpdateDoc).toHaveBeenCalledOnce();
            expect(mockUpdateDoc.mock.calls[0][1]).toHaveProperty(
                "note",
                "Saved from selling old books"
            );
        });
    });

    describe("deleteChallenge", () => {
        it("should delete challenge and all deposits in batch", async () => {
            const mockBatch = {
                delete: vi.fn(),
                commit: vi.fn().mockResolvedValue(undefined),
            };

            const mockDepositDocs = [
                { ref: { id: "1" } },
                { ref: { id: "2" } },
                { ref: { id: "3" } },
            ];

            vi.mocked(firestore.getDocs).mockResolvedValue({
                docs: mockDepositDocs,
            } as any);
            vi.mocked(firestore.writeBatch).mockReturnValue(mockBatch as any);
            vi.mocked(firestore.doc).mockReturnValue({} as any);
            vi.mocked(firestore.collection).mockReturnValue({} as any);

            await deleteChallenge("user-123", "challenge-1");

            expect(mockBatch.delete).toHaveBeenCalledTimes(4); // 3 deposits + 1 challenge
            expect(mockBatch.commit).toHaveBeenCalledOnce();
        });
    });

    describe("subscribeToChallenge", () => {
        it("should call callback on document changes", () => {
            const mockUnsubscribe = vi.fn();
            const mockCallback = vi.fn();

            vi.mocked(firestore.onSnapshot).mockReturnValue(mockUnsubscribe);
            vi.mocked(firestore.doc).mockReturnValue({} as any);

            const unsubscribe = subscribeToChallenge(
                "user-123",
                "challenge-1",
                mockCallback
            );

            expect(firestore.onSnapshot).toHaveBeenCalledOnce();
            expect(unsubscribe).toBe(mockUnsubscribe);
        });

        it("should handle errors via onError callback", () => {
            const mockOnError = vi.fn();
            const mockOnSnapshot = vi.fn((ref, onNext, onError) => {
                // Simular erro
                onError(new Error("Firestore error"));
                return vi.fn();
            });

            vi.mocked(firestore.onSnapshot).mockImplementation(mockOnSnapshot);
            vi.mocked(firestore.doc).mockReturnValue({} as any);

            subscribeToChallenge(
                "user-123",
                "challenge-1",
                vi.fn(),
                mockOnError
            );

            expect(mockOnError).toHaveBeenCalledWith(
                expect.objectContaining({ message: "Firestore error" })
            );
        });

        it("should unsubscribe correctly", () => {
            const mockUnsubscribe = vi.fn();
            vi.mocked(firestore.onSnapshot).mockReturnValue(mockUnsubscribe);
            vi.mocked(firestore.doc).mockReturnValue({} as any);

            const unsubscribe = subscribeToChallenge(
                "user-123",
                "challenge-1",
                vi.fn()
            );

            unsubscribe();

            expect(mockUnsubscribe).toHaveBeenCalledOnce();
        });
    });

    describe("data conversions", () => {
        it("should convert Firestore Timestamp to Date", async () => {
            const firestoreTimestamp = Timestamp.now();
            const mockDoc = {
                id: "challenge-1",
                data: () => ({
                    name: "Test",
                    targetAmount: 100,
                    numberOfDeposits: 1,
                    mode: "fixed",
                    createdAt: firestoreTimestamp,
                    completedAt: null,
                }),
            };

            vi.mocked(firestore.getDocs)
                .mockResolvedValueOnce({ docs: [mockDoc] } as any)
                .mockResolvedValueOnce({ docs: [] } as any);

            const challenges = await getChallenges("user-123");

            expect(challenges[0].createdAt).toBeInstanceOf(Date);
            expect(challenges[0].createdAt.getTime()).toBeCloseTo(
                firestoreTimestamp.toDate().getTime(),
                -2
            );
        });
    });
});
