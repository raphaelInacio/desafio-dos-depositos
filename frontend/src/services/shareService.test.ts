import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { shareProgress } from './shareService';
import { Challenge, ChallengeStats } from '@/types/challenge';

// Mock console.log e console.error para evitar spam nos logs
const originalLog = console.log;
const originalError = console.error;

beforeEach(() => {
    console.log = vi.fn();
    console.error = vi.fn();
});

afterEach(() => {
    console.log = originalLog;
    console.error = originalError;
    vi.clearAllMocks();
});

describe('shareService', () => {
    const mockChallenge: Challenge = {
        id: 'test-123',
        name: 'Desafio de R$ 5.000',
        targetAmount: 5000,
        numberOfDeposits: 100,
        mode: 'classic',
        deposits: [],
        createdAt: new Date('2024-01-01'),
    };

    const mockStats: ChallengeStats = {
        totalGoal: 5000,
        savedSoFar: 1250,
        remainingAmount: 3750,
        progressPercentage: 25,
        depositsCompleted: 25,
        totalDeposits: 100,
    };

    describe('shareProgress', () => {
        it('should format text correctly with challenge data', async () => {
            // Mock Web Share API
            const mockShare = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'share', {
                value: mockShare,
                writable: true,
                configurable: true,
            });

            await shareProgress(mockChallenge, mockStats);

            expect(mockShare).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Desafio dos Depósitos',
                    url: expect.any(String),
                })
            );

            // Verificar que o texto contém os elementos corretos
            const callArg = mockShare.mock.calls[0][0];
            expect(callArg.text).toContain('25%');
            expect(callArg.text).toContain('Desafio de R$ 5.000');
            expect(callArg.text).toContain('1.250');
            expect(callArg.text).toContain('#DesafioDosDepositos');
        });

        it('should return true on successful Web Share', async () => {
            // Mock Web Share API
            const mockShare = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'share', {
                value: mockShare,
                writable: true,
                configurable: true,
            });

            const result = await shareProgress(mockChallenge, mockStats);

            expect(result).toBe(true);
            expect(mockShare).toHaveBeenCalled();
        });

        it('should return false when user cancels share', async () => {
            // Mock Web Share API with AbortError
            const mockShare = vi.fn().mockRejectedValue(new DOMException('User cancelled', 'AbortError'));
            Object.defineProperty(navigator, 'share', {
                value: mockShare,
                writable: true,
                configurable: true,
            });

            const result = await shareProgress(mockChallenge, mockStats);

            expect(result).toBe(false);
        });

        it('should fallback to clipboard when Web Share API is not available', async () => {
            // Remove Web Share API
            Object.defineProperty(navigator, 'share', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            // Mock Clipboard API
            const mockWriteText = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'clipboard', {
                value: { writeText: mockWriteText },
                writable: true,
                configurable: true,
            });

            const result = await shareProgress(mockChallenge, mockStats);

            expect(result).toBe(true);
            expect(mockWriteText).toHaveBeenCalled();

            // Verificar que o texto contém os elementos corretos
            const textArg = mockWriteText.mock.calls[0][0];
            expect(textArg).toContain('25%');
            expect(textArg).toContain('Desafio de R$ 5.000');
            expect(textArg).toContain('1.250');
            expect(textArg).toContain('#DesafioDosDepositos');
        });

        it('should handle clipboard errors gracefully', async () => {
            // Remove Web Share API
            Object.defineProperty(navigator, 'share', {
                value: undefined,
                writable: true,
                configurable: true,
            });

            // Mock Clipboard API with error
            const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard denied'));
            Object.defineProperty(navigator, 'clipboard', {
                value: { writeText: mockWriteText },
                writable: true,
                configurable: true,
            });

            const result = await shareProgress(mockChallenge, mockStats);

            expect(result).toBe(false);
        });

        it('should format text correctly with 0% progress', async () => {
            const zeroStats: ChallengeStats = {
                ...mockStats,
                savedSoFar: 0,
                progressPercentage: 0,
                depositsCompleted: 0,
            };

            const mockShare = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'share', {
                value: mockShare,
                writable: true,
                configurable: true,
            });

            await shareProgress(mockChallenge, zeroStats);

            expect(mockShare).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Desafio dos Depósitos',
                    url: expect.any(String),
                })
            );

            const callArg = mockShare.mock.calls[0][0];
            expect(callArg.text).toContain('0%');
            expect(callArg.text).toContain('0,00');
        });

        it('should format text correctly with 100% progress', async () => {
            const fullStats: ChallengeStats = {
                ...mockStats,
                savedSoFar: 5000,
                progressPercentage: 100,
                depositsCompleted: 100,
            };

            const mockShare = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'share', {
                value: mockShare,
                writable: true,
                configurable: true,
            });

            await shareProgress(mockChallenge, fullStats);

            expect(mockShare).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Desafio dos Depósitos',
                    url: expect.any(String),
                })
            );

            const callArg = mockShare.mock.calls[0][0];
            expect(callArg.text).toContain('100%');
            expect(callArg.text).toContain('5.000,00');
        });

        it('should handle long challenge names', async () => {
            const longNameChallenge: Challenge = {
                ...mockChallenge,
                name: 'Desafio Super Ultra Mega Grande para Economizar Muito Dinheiro para Realizar Meus Sonhos',
            };

            const mockShare = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'share', {
                value: mockShare,
                writable: true,
                configurable: true,
            });

            await shareProgress(longNameChallenge, mockStats);

            expect(mockShare).toHaveBeenCalledWith({
                title: 'Desafio dos Depósitos',
                text: expect.stringContaining('Desafio Super Ultra Mega Grande'),
                url: expect.any(String),
            });
        });
    });
});
