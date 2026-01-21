import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface LandingNavbarProps {
    onStart: () => void;
}

export function LandingNavbar({ onStart }: LandingNavbarProps) {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-offwhite/80 backdrop-blur-md border-b border-black/5"
        >
            <Link to="/" className="flex items-center gap-2 font-headline font-extrabold text-xl text-text decoration-0">
                <span className="w-8 h-8 bg-gradient-to-br from-emerald to-gold rounded-full flex items-center justify-center text-lg shadow-sm">
                    💰
                </span>
                Desafio dos Depósitos
            </Link>

            <div className="flex items-center gap-4">
                <Link to="/login" className="text-text font-medium hover:text-pink transition-colors">
                    Login
                </Link>
                <Button
                    onClick={onStart}
                    className="bg-pink hover:bg-pink/90 text-white font-subhead font-bold shadow-tactile hover:-translate-y-0.5 hover:shadow-lg transition-all active:translate-y-0 active:shadow-sm"
                >
                    Começar Grátis
                </Button>
            </div>
        </motion.nav>
    );
}
