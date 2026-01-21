import { motion } from 'framer-motion';

export function HowItWorks() {
    const steps = [
        {
            number: '1',
            icon: '🎯',
            title: 'Crie Seu Desafio',
            description: 'Defina sua meta financeira e escolha o valor e a frequência dos depósitos que cabem no seu bolso.',
        },
        {
            number: '2',
            icon: '✅',
            title: 'Marque Seus Depósitos',
            description: 'Cada vez que você poupar, marque na grade interativa e veja seu progresso crescer.',
        },
        {
            number: '3',
            icon: '🏆',
            title: 'Celebre Cada Conquista',
            description: 'Receba feedback visual satisfatório e compartilhe suas vitórias nas redes sociais.',
        },
    ];

    return (
        <section className="py-20 px-8 bg-offwhite relative overflow-hidden">
            {/* Floating Coins - abstracted as simple divs with animations */}
            <div className="absolute top-[10%] left-[5%] w-[50px] h-[50px] rounded-full bg-gradient-to-br from-[#fbbf24] to-gold opacity-30 animate-[floatAround_15s_ease-in-out_infinite]" />
            <div className="absolute top-[60%] right-[10%] w-[50px] h-[50px] rounded-full bg-gradient-to-br from-[#fbbf24] to-gold opacity-30 animate-[floatAround_15s_ease-in-out_infinite] delay-2000" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-headline font-extrabold text-4xl md:text-5xl text-center mb-16 text-text"
                >
                    Como Funciona
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white p-8 rounded-2xl border border-black/10 shadow-md hover:-translate-y-2 hover:shadow-lg transition-all duration-300 relative overflow-hidden backdrop-blur-sm"
                        >
                            <span className="absolute top-4 right-4 font-headline font-extrabold text-6xl text-pink/20 select-none">
                                {step.number}
                            </span>
                            <div className="text-6xl mb-6 drop-shadow-sm filter">
                                {step.icon}
                            </div>
                            <h3 className="font-subhead font-bold text-2xl mb-2 text-text">
                                {step.title}
                            </h3>
                            <p className="text-text-light leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
