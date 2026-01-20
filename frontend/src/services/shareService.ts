import { Challenge, ChallengeStats } from '@/types/challenge';
import { formatCurrency } from '@/lib/challengeUtils';

/**
 * Compartilha o progresso do desafio usando Web Share API quando disponível
 * ou fallback para clipboard em navegadores que não suportam.
 * 
 * @param challenge - O desafio atual
 * @param stats - Estatísticas do desafio
 * @returns Promise<boolean> - true se o compartilhamento foi bem-sucedido ou o texto foi copiado
 */
export async function shareProgress(
    challenge: Challenge,
    stats: ChallengeStats
): Promise<boolean> {
    // Gera texto dinâmico com progresso atual
    const text = `🎯 ${stats.progressPercentage}% do meu desafio "${challenge.name}"! Já economizei ${formatCurrency(stats.savedSoFar)}. #DesafioDosDepositos`;

    const shareData = {
        title: 'Desafio dos Depósitos',
        text,
        url: window.location.origin,
    };

    // Tenta usar Web Share API (disponível em mobile)
    if (navigator.share) {
        try {
            await navigator.share(shareData);

            // Log analytics event
            console.log('[Analytics] Share - Web Share API', {
                challengeId: challenge.id,
                challengeName: challenge.name,
                progress: stats.progressPercentage,
            });

            return true;
        } catch (error) {
            // Usuário cancelou ou erro ocorreu
            if (error instanceof Error && error.name === 'AbortError') {
                // Usuário cancelou - não é erro
                console.log('[Analytics] Share - Cancelled by user');
                return false;
            }

            // Outro erro - log mas não falha
            console.error('[Share] Web Share API error:', error);
            return false;
        }
    }

    // Fallback: copiar para clipboard
    try {
        await navigator.clipboard.writeText(text);

        // Log analytics event
        console.log('[Analytics] Share - Clipboard fallback', {
            challengeId: challenge.id,
            challengeName: challenge.name,
            progress: stats.progressPercentage,
        });

        return true;
    } catch (error) {
        console.error('[Share] Clipboard error:', error);
        return false;
    }
}
