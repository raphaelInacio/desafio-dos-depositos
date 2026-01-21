import { Button } from '@/components/ui/button';

export function LandingFooter({ onStart }: { onStart: () => void }) {
    return (
        <>
            <section className="py-24 px-8 text-center bg-white">
                <h2 className="font-headline font-extrabold text-4xl md:text-5xl mb-4 text-text">
                    Comece Gratuitamente.<br />Sem Cartão de Crédito.
                </h2>
                <p className="font-subhead text-xl text-text-light mb-8">
                    Experimente agora e transforme seus sonhos em realidade
                </p>
                <Button
                    onClick={onStart}
                    className="px-8 py-6 text-lg bg-pink hover:bg-pink/90 text-white font-subhead font-bold rounded-xl shadow-tactile hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-sm"
                >
                    Criar Meu Primeiro Desafio
                </Button>
                <div className="mt-4 inline-block bg-emerald text-white px-4 py-2 rounded-full text-sm font-bold">
                    100% grátis para começar
                </div>
            </section>

            <footer className="bg-dark text-white/70 py-8 px-8 text-center">
                <p>&copy; 2025 Desafio dos Depósitos. Todos os direitos reservados.</p>
                <p className="mt-2 text-sm">Transformando sonhos em realidade, um depósito por vez.</p>
            </footer>
        </>
    );
}
