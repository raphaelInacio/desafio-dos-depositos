import React from 'react';
import { useUserData } from '@/hooks/useUserData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Lock, Moon, Sun, Palette, Zap } from 'lucide-react';
import { UpgradeModal } from './UpgradeModal';
import { toast } from 'sonner';

type Theme = 'light' | 'dark' | 'pastel' | 'neon';

const themes: { id: Theme; name: string; icon: React.ReactNode; isPremium: boolean }[] = [
    { id: 'light', name: 'Claro', icon: <Sun className="w-4 h-4" />, isPremium: false },
    { id: 'dark', name: 'Escuro', icon: <Moon className="w-4 h-4" />, isPremium: false }, // Typically dark mode is free, but let's see PRD. PRD says "Paid User Benefits: ... Dark Mode". Let's stick to PRD.
    { id: 'pastel', name: 'Pastel', icon: <Palette className="w-4 h-4" />, isPremium: true },
    { id: 'neon', name: 'Neon', icon: <Zap className="w-4 h-4" />, isPremium: true },
];

// PRD mentions "Paid User Benefits ... Dark Mode". So Dark Mode is likely Premium too.
// Let's adjust 'dark' to be isPremium=true based on PRD line 98: "Acesso a temas exclusivos (Dark Mode, Pastel, Neon)."
themes.find(t => t.id === 'dark')!.isPremium = true;


export function ThemeSelector() {
    const { userData } = useUserData();
    const [currentTheme, setCurrentTheme] = React.useState<Theme>('light');
    const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

    React.useEffect(() => {
        // On mount, check current theme from document
        const isDark = document.documentElement.classList.contains('dark');
        const dataTheme = document.documentElement.getAttribute('data-theme') as Theme;

        if (dataTheme) {
            setCurrentTheme(dataTheme);
        } else if (isDark) {
            setCurrentTheme('dark');
        } else {
            setCurrentTheme('light');
        }
    }, []);

    const handleThemeChange = (theme: Theme) => {
        const themeObj = themes.find(t => t.id === theme);
        if (themeObj?.isPremium && !userData?.isPremium) {
            setShowUpgradeModal(true);
            return;
        }

        // Apply theme
        const root = document.documentElement;

        // Remove all theme classes/attributes first
        root.classList.remove('dark');
        root.removeAttribute('data-theme');

        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme !== 'light') {
            root.setAttribute('data-theme', theme);
        }

        setCurrentTheme(theme);
        toast.success(`Tema ${themeObj?.name} aplicado!`);
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Temas</h3>
            <div className="grid grid-cols-2 gap-3">
                {themes.map((theme) => {
                    const isActive = currentTheme === theme.id;
                    const isLocked = theme.isPremium && !userData?.isPremium;

                    return (
                        <Button
                            key={theme.id}
                            variant={isActive ? "default" : "outline"}
                            className={`justify-start relative h-12 ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                            onClick={() => handleThemeChange(theme.id)}
                        >
                            <div className="flex items-center gap-2 w-full">
                                {theme.icon}
                                <span>{theme.name}</span>
                                {isLocked && (
                                    <Lock className="w-4 h-4 ml-auto text-muted-foreground" />
                                )}
                                {isActive && !isLocked && (
                                    <Check className="w-4 h-4 ml-auto" />
                                )}
                            </div>
                        </Button>
                    );
                })}
            </div>

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                triggerAction="trocar o tema"
            />
        </div>
    );
}
