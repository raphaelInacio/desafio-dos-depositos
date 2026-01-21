import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function LandingNavbar() {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-offwhite/80 backdrop-blur-md border-b border-black/5"
        >
            <a href="#" className="flex items-center gap-2 font-headline font-extrabold text-xl text-text decoration-0">
                <span className="w-8 h-8 bg-gradient-to-br from-emerald to-gold rounded-full flex items-center justify-center text-lg shadow-sm">
                    💰
                </span>
                Desafio dos Depósitos
            </a>

            <div className="flex items-center gap-4">
                <a href="#login" className="text-text font-medium hover:text-pink transition-colors">
                    Login
                </a>
                <Button
                    className="bg-pink hover:bg-pink/90 text-white font-subhead font-bold shadow-tactile hover:-translate-y-0.5 hover:shadow-lg transition-all active:translate-y-0 active:shadow-sm"
                >
                    Começar Grátis
                </Button>
            </div>
        </motion.nav>
    );
}
