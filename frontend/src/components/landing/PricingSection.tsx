import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface PricingSectionProps {
    onStart: () => void;
}

export function PricingSection({ onStart }: PricingSectionProps) {
    return (
        <section className="py-20 px-8 bg-offwhite relative" id="pricing">
            {/* Gold Shapes Decoration */}
            <div className="absolute top-[10%] right-[10%] w-[100px] h-[100px] bg-gold opacity-10 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-[morph_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-[20%] left-[5%] w-[100px] h-[100px] bg-gold opacity-10 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-[morph_8s_ease-in-out_infinite] delay-2000" />

            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="font-headline font-extrabold text-4xl md:text-5xl text-text mb-4">Planos</h2>
                    <p className="font-subhead text-xl text-text-light">Free vs Premium</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-10 rounded-2xl border-2 border-black/10 shadow-md hover:-translate-y-2 transition-transform"
                    >
                        <h3 className="font-headline font-extrabold text-2xl mb-2 text-text">Free</h3>
                        <div className="font-headline font-extrabold text-4xl text-pink mb-2">
                            <span className="text-2xl align-top">R$</span> 0
                        </div>
                        <p className="text-text-light mb-8">1 Desafio Grátis</p>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 border-b border-black/5 pb-3">
                                <Check className="text-emerald w-5 h-5 flex-shrink-0" />
                                <span>1 desafio ativo</span>
                            </li>
                            <li className="flex items-center gap-3 border-b border-black/5 pb-3">
                                <Check className="text-emerald w-5 h-5 flex-shrink-0" />
                                <span>Tema padrão</span>
                            </li>
                            <li className="flex items-center gap-3 border-b border-black/5 pb-3 text-text-light">
                                <X className="w-5 h-5 flex-shrink-0" />
                                <span>Com anúncios</span>
                            </li>
                            <li className="flex items-center gap-3 border-b border-black/5 pb-3 text-text-light">
                                <X className="w-5 h-5 flex-shrink-0" />
                                <span>Analytics básicos</span>
                            </li>
                        </ul>

                        <Button
                            onClick={onStart}
                            className="w-full py-6 bg-transparent hover:bg-text text-text hover:text-white border-2 border-text font-subhead font-bold rounded-xl transition-all"
                        >
                            Começar Grátis
                        </Button>
                    </motion.div>

                    {/* Premium Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white relative p-10 rounded-2xl border-2 border-gold shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:-translate-y-2 transition-transform overflow-hidden"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/30 to-transparent rotate-45 animate-[shimmer_3s_infinite] pointer-events-none" />

                        <div className="absolute top-[-1px] left-1/2 -translate-x-1/2 bg-gold text-white px-4 py-1 rounded-b-xl text-xs font-bold tracking-wide">
                            ✨ POPULAR
                        </div>

                        <h3 className="font-headline font-extrabold text-2xl mb-2 text-text">Premium</h3>
                        <div className="font-headline font-extrabold text-4xl text-pink mb-2">
                            <span className="text-2xl align-top">R$</span> 4,99
                        </div>
                        <p className="text-text-light mb-8">por desafio</p>

                        <ul className="space-y-4 mb-8 relative z-10">
                            <li className="flex items-center gap-3 border-b border-black/5 pb-3">
                                <Check className="text-emerald w-5 h-5 flex-shrink-0" />
                                <span>Desafios ilimitados</span>
                            </li>
                            <li className="flex items-center gap-3 border-b border-black/5 pb-3">
                                <Check className="text-emerald w-5 h-5 flex-shrink-0" />
                                <span>Temas exclusivos</span>
                            </li>
                            <li className="flex items-center gap-3 border-b border-black/5 pb-3">
                                <Check className="text-emerald w-5 h-5 flex-shrink-0" />
                                <span>Sem anúncios</span>
                            </li>
                            <li className="flex items-center gap-3 border-b border-black/5 pb-3">
                                <Check className="text-emerald w-5 h-5 flex-shrink-0" />
                                <span>Analytics avançados</span>
                            </li>
                        </ul>

                        <Button
                            onClick={onStart}
                            className="w-full py-6 bg-gradient-to-br from-gold to-[#fbbf24] text-dark shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-lg font-subhead font-bold rounded-xl transition-all relative z-10"
                        >
                            Assinar Premium
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
