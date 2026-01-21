import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    triggerAction?: string; // e.g., "criar múltiplos desafios", "usar tema Neon"
}

export function UpgradeModal({ isOpen, onClose, triggerAction }: UpgradeModalProps) {
    const navigate = useNavigate();

    const handleUpgradeClick = () => {
        onClose();
        navigate('/upgrade');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-card border-border">
                <DialogHeader>
                    <div className="mx-auto bg-gradient-to-br from-amber-400 to-yellow-600 p-3 rounded-full mb-4">
                        <Star className="h-8 w-8 text-white fill-white" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-600">
                        Seja Premium
                    </DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        {triggerAction ? (
                            <span>Para <strong>{triggerAction}</strong>, você precisa ser Premium.</span>
                        ) : (
                            <span>Desbloqueie todo o potencial do seu desafio.</span>
                        )}
                        <br />
                        Invista em você por apenas <span className="font-bold text-foreground">R$ 4,99</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full">
                            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-sm">Criar <strong>desafios ilimitados</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full">
                            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-sm">Acesso a <strong>Todos os Temas</strong> (Neon, Pastel, Dark)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1 rounded-full">
                            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-sm">Experiência <strong>100% sem anúncios</strong></span>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:justify-start gap-2">
                    <Button
                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold shadow-lg shadow-amber-500/20 border-0"
                        onClick={handleUpgradeClick}
                    >
                        Quero ser Premium 🚀
                    </Button>
                    <Button variant="ghost" className="w-full" onClick={onClose}>
                        Talvez depois
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
