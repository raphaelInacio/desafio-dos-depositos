import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Zap, Palette, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function UpgradePage() {
    const { user } = useAuth();

    const handleUpgrade = () => {
        if (!user) {
            toast.error("Você precisa estar logado para fazer o upgrade.");
            return;
        }

        // Redirect directly to Hotmart checkout
        window.location.href = 'https://pay.hotmart.com/I104071194N?checkoutMode=10';
    };

    return (
        <div className="min-h-screen bg-background pb-20 pt-6 px-4">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                        <span className="text-gradient-hero">Evolua para</span> <span className="text-gradient-gold">Premium</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Desbloqueie todo o potencial da sua jornada financeira por menos de um café.
                    </p>
                </div>

                {/* Pricing Card */}
                <Card className="max-w-md mx-auto border-amber-200 dark:border-amber-800 shadow-gold relative overflow-hidden">
                    {/* Top Banner */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-yellow-600"></div>

                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full w-fit mb-2">
                            <Star className="w-8 h-8 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Acesso Vitalício</CardTitle>
                        <CardDescription>Pagamento único, sem mensalidades</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="flex justify-center items-baseline gap-1">
                            <span className="text-sm text-muted-foreground line-through">R$ 19,90</span>
                            <span className="text-4xl font-extrabold text-foreground">R$ 4,99</span>
                        </div>

                        <div className="space-y-3">
                            <FeatureRow icon={<Zap className="w-5 h-5 text-amber-500" />} text="Desafios Ilimitados" />
                            <FeatureRow icon={<Palette className="w-5 h-5 text-purple-500" />} text="Temas Exclusivos (Neon, Pastel)" />
                            <FeatureRow icon={<ShieldCheck className="w-5 h-5 text-emerald-500" />} text="Sem Anúncios (Zero Ads)" />
                            <FeatureRow icon={<Star className="w-5 h-5 text-blue-500" />} text="Acesso prioritário a novas features" />
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button
                            className="w-full h-12 text-lg font-bold bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-lg border-0"
                            onClick={handleUpgrade}
                        >
                            <span className="flex items-center gap-2">
                                Quero ser Premium <ArrowRight className="w-5 h-5" />
                            </span>
                        </Button>
                    </CardFooter>
                </Card>

                {/* Testimonials or FAQ could go here */}
                <p className="text-center text-sm text-muted-foreground">
                    Pagamento seguro processado pela Hotmart. Satisfação garantida.
                </p>
            </div>
        </div>
    );
}

function FeatureRow({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="shrink-0">{icon}</div>
            <span className="font-medium">{text}</span>
        </div>
    );
}
