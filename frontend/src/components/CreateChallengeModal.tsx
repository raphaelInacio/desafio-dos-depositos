import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Shuffle, Equal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    name: string,
    targetAmount: number,
    numberOfDeposits: number,
    mode: 'classic' | 'fixed'
  ) => void;
}

const presetChallenges = [
  { name: 'Desafio 52 Semanas', deposits: 52, amount: 1378 },
  { name: 'Desafio 100 Depósitos', deposits: 100, amount: 5050 },
  { name: 'Desafio 30 Dias', deposits: 30, amount: 465 },
];

export function CreateChallengeModal({ isOpen, onClose, onCreate }: CreateChallengeModalProps) {
  const [name, setName] = useState('Meu Desafio');
  const [targetAmount, setTargetAmount] = useState('5000');
  const [numberOfDeposits, setNumberOfDeposits] = useState('100');
  const [mode, setMode] = useState<'classic' | 'fixed'>('classic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(targetAmount.replace(/[^\d,]/g, '').replace(',', '.'));
    const deposits = parseInt(numberOfDeposits, 10);
    
    if (amount > 0 && deposits > 0) {
      onCreate(name, amount, deposits, mode);
      onClose();
    }
  };

  const applyPreset = (preset: typeof presetChallenges[0]) => {
    setName(preset.name);
    setTargetAmount(preset.amount.toString());
    setNumberOfDeposits(preset.deposits.toString());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl bg-card p-6 shadow-card-hover sm:rounded-3xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Criar Desafio</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Presets */}
            <div className="mb-6">
              <Label className="mb-2 block text-sm text-muted-foreground">
                Modelos populares
              </Label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {presetChallenges.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="shrink-0 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do desafio</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Viagem dos Sonhos"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Meta (R$)</Label>
                  <Input
                    id="amount"
                    type="text"
                    inputMode="decimal"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="5.000"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="deposits">Nº de depósitos</Label>
                  <Input
                    id="deposits"
                    type="number"
                    value={numberOfDeposits}
                    onChange={(e) => setNumberOfDeposits(e.target.value)}
                    placeholder="100"
                    min="1"
                    max="365"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Mode selector */}
              <div>
                <Label className="mb-2 block">Tipo de valores</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('classic')}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border-2 p-3 text-left transition-all',
                      mode === 'classic'
                        ? 'border-primary bg-accent'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      mode === 'classic' ? 'gradient-hero text-primary-foreground' : 'bg-muted'
                    )}>
                      <Shuffle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Variado</div>
                      <div className="text-xs text-muted-foreground">Valores diferentes</div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setMode('fixed')}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border-2 p-3 text-left transition-all',
                      mode === 'fixed'
                        ? 'border-primary bg-accent'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg',
                      mode === 'fixed' ? 'gradient-hero text-primary-foreground' : 'bg-muted'
                    )}>
                      <Equal className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">Fixo</div>
                      <div className="text-xs text-muted-foreground">Valores iguais</div>
                    </div>
                  </button>
                </div>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full">
                <Sparkles className="mr-2 h-5 w-5" />
                Criar Desafio
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
