import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LandingHeroProps {
    onStart: () => void;
}

export function LandingHero({ onStart }: LandingHeroProps) {

    useEffect(() => {
        const timer = setTimeout(() => {
            triggerConfetti();
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const triggerConfetti = () => {
        const duration = 3000;
        const end = Date.now() + duration;
        const colors = ['#ec4899', '#10b981', '#f59e0b'];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    };

    return (
        <section className="min-h-screen flex items-center justify-center pt-24 pb-16 px-8 relative overflow-hidden bg-gradient-to-br from-emerald via-gold to-pink">
            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-[gradientMove_10s_ease_infinite_alternate]" />
                {/* Floating Confetti */}
                {[...Array(9)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2.5 h-2.5 opacity-60 animate-[fall_linear_infinite]"
                        style={{
                            left: `${(i + 1) * 10}%`,
                            animationDuration: `${5 + (i % 5)}s`,
                            backgroundColor: i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#10b981' : '#f59e0b',
                            animationDelay: `${i * 0.5}s`
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center relative z-10">
                <div className="text-left">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white mb-6 backdrop-blur-sm border border-white/20"
                    >
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span className="text-sm font-semibold">O jeito mais divertido de poupar</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-headline font-extrabold text-4xl md:text-6xl leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/80"
                    >
                        Transforme Seu Sonho em Realidade – Um Depósito Por Vez
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="font-subhead text-xl text-white/95 mb-8 leading-relaxed"
                    >
                        Alcance suas metas financeiras de forma divertida e consistente com o rastreador gamificado de desafios de poupança.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Button
                            onClick={onStart}
                            className="px-8 py-6 text-lg bg-pink hover:bg-pink/90 text-white font-subhead font-bold rounded-xl shadow-tactile hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(236,72,153,0.4)] transition-all active:translate-y-0 active:shadow-sm"
                        >
                            Começar Meu Desafio Grátis
                        </Button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative flex justify-center items-center"
                >
                    {/* Glass Card Container */}
                    <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden p-4 group">

                        {/* Mock Browser/App Header */}
                        <div className="absolute top-0 left-0 right-0 h-10 bg-white/10 border-b border-white/10 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                        </div>

                        {/* Grid Image */}
                        <div className="mt-8 w-full h-full rounded-xl overflow-hidden shadow-inner relative bg-white/5">
                            <img
                                src="/hero-grid.png"
                                alt="Dashboard do Desafio"
                                className="w-full h-full object-cover object-top opacity-95 group-hover:scale-105 transition-transform duration-700"
                            />

                            {/* Overlay Gradient for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                        </div>

                        {/* Floating Checkmark Animation */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                            transition={{ delay: 1.5, type: 'spring' }}
                            className="absolute bottom-12 right-12 w-16 h-16 bg-emerald rounded-full flex items-center justify-center shadow-lg border-4 border-white z-20"
                        >
                            <Check className="w-8 h-8 text-white" strokeWidth={4} />
                        </motion.div>

                        {/* 3D Floating Elements Decoration */}
                        <motion.div
                            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl shadow-xl flex items-center justify-center text-3xl rotate-12 z-30"
                        >
                            💰
                        </motion.div>

                        <motion.div
                            animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/20 backdrop-blur-lg border border-white/40 rounded-full shadow-xl z-30"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
