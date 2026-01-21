import { motion } from 'framer-motion';

export function GallerySection() {
    const polaroids = [
        { label: 'Primeira!', caption: 'Primeiro depósito', rotation: 'rotate-2', image: '/images/gallery_first_deposit_1768994708880.png' },
        { label: 'R$ 50', caption: 'Almoço economizado', rotation: '-rotate-3', image: '/images/gallery_saved_lunch_1768995057741.png' },
        { label: 'Meta!', caption: 'Meio do caminho', rotation: 'rotate-1', image: '/images/gallery_halfway_milestone_1768995164656.png' },
        { label: 'Extra', caption: 'Freela extra', rotation: '-rotate-2', image: '/images/gallery_freelance_extra_1768995290973.png' },
        { label: 'R$ 100', caption: 'Bônus guardado', rotation: 'rotate-3', image: '/images/gallery_saved_bonus_1768995402445.png' },
        { label: '💪', caption: 'Mais uma vitória', rotation: '-rotate-1', image: '/images/gallery_victory_trophy_1768995564854.png' },
    ];

    return (
        <section className="py-20 px-8 bg-white">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-headline font-extrabold text-4xl md:text-5xl mb-12 text-text"
                    >
                        Seu Álbum de Conquistas
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-black/5 shadow-md"
                    >
                        <div className="font-subhead text-2xl italic text-text mb-6 relative pl-8">
                            <span className="absolute left-0 top-0 text-6xl text-pink leading-[0] font-serif">"</span>
                            Revisar meu álbum me dá forças para continuar
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald to-gold rounded-full flex items-center justify-center text-white font-bold">
                                MS
                            </div>
                            <div className="font-semibold text-text">Mariana S.</div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-3 gap-4 -rotate-2">
                    {polaroids.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white p-3 pb-12 shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-transform hover:z-10 hover:rotate-0 hover:scale-105 ${item.rotation}`}
                        >
                            <div className="w-full aspect-square bg-offwhite mb-2 relative overflow-hidden rounded-sm">
                                <img
                                    src={item.image}
                                    alt={item.caption}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded text-xs font-bold shadow-sm whitespace-nowrap">
                                    {item.label}
                                </div>
                            </div>
                            <div className="text-center font-mono text-xs text-text">{item.caption}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
