import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface LandingHeroProps {
    onStart: () => void;
}

export function LandingHero({ onStart }: LandingHeroProps) {
    return (
        <section className="min-h-screen flex items-center justify-center pt-24 pb-16 px-8 relative overflow-hidden bg-gradient-to-br from-emerald via-gold to-pink">
            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-[gradientMove_10s_ease_infinite_alternate]" />
                {/* Confetti */}
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
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center items-center relative"
                >
                    <div className="relative w-[200px] h-[250px]">
                        {[0, 1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ translateY: [-10, 0, -10] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                                className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-[#fbbf24] to-gold shadow-[0_8px_16px_rgba(0,0,0,0.2)] flex items-center justify-center text-4xl"
                                style={{
                                    bottom: `${i * 60}px`,
                                    left: i % 2 === 0 ? '50%' : i === 1 ? '30%' : '70%',
                                    transform: 'translateX(-50%)' // Note: This gets overridden by animate in framer-motion, handled via style if static
                                }}
                            >
                                <div style={{ transform: i % 2 === 0 ? 'translateX(-50%)' : 'none', position: 'absolute', left: i % 2 === 0 ? '50%' : 'auto' }}>
                                    💰
                                </div>
                            </motion.div>
                        ))}
                        {/* Fix alignment manually since absolute positioning with transforms can be tricky in loops */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[#fbbf24] to-gold shadow-lg flex items-center justify-center text-3xl animate-[float_3s_ease-in-out_infinite]">💰</div>
                        <div className="absolute bottom-[60px] left-[30%] w-20 h-20 rounded-full bg-gradient-to-br from-[#fbbf24] to-gold shadow-lg flex items-center justify-center text-3xl animate-[float_3s_ease-in-out_infinite] delay-200">💰</div>
                        <div className="absolute bottom-[120px] left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[#fbbf24] to-gold shadow-lg flex items-center justify-center text-3xl animate-[float_3s_ease-in-out_infinite] delay-400">💰</div>
                        <div className="absolute bottom-[180px] left-[70%] -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[#fbbf24] to-gold shadow-lg flex items-center justify-center text-3xl animate-[float_3s_ease-in-out_infinite] delay-600">💰</div>

                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute top-1/2 -right-8 text-6xl text-emerald drop-shadow-md"
                        >
                            <Check strokeWidth={4} className="w-16 h-16" />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
