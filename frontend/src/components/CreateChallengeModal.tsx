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
  const formatCurrencyInput = (value: string | number) => {
    // Remove everything that is not a digit
    const digits = value.toString().replace(/\D/g, '');

    // Convert to decimal (divide by 100)
    const number = Number(digits) / 100;

    // Format as currency
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const [name, setName] = useState('Meu Desafio');
  const [targetAmount, setTargetAmount] = useState(formatCurrencyInput('500000')); // 5000.00
  const [numberOfDeposits, setNumberOfDeposits] = useState('100');
  const [mode, setMode] = useState<'classic' | 'fixed'>('classic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Parse formatted string: "5.000,00" -> 5000.00
    // Remove dots, replace comma with dot
    const cleanValue = targetAmount.replace(/\./g, '').replace(',', '.');
    const amount = parseFloat(cleanValue);
    const deposits = parseInt(numberOfDeposits, 10);

    if (amount > 0 && deposits > 0) {
      onCreate(name, amount, deposits, mode);
      onClose();
    }
  };

  const applyPreset = (preset: typeof presetChallenges[0]) => {
    setName(preset.name);
    // Multiply by 100 because formatCurrencyInput expects standard string "digits" logic or requires adjustments
    // easier: just format the number directly
    setTargetAmount(preset.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    setNumberOfDeposits(preset.deposits.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Prevent non-numeric inputs from messing up too much, 
    // but the formatter handles \D replace.
    // We just need to ensure we don't block deletion.
    setTargetAmount(formatCurrencyInput(value));
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
              <h2 className="text-xl font-headline font-extrabold text-text">Criar Desafio</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-text-light hover:bg-black/5 transition-colors"
                aria-label="Gravar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Presets */}
            <div className="mb-6">
              <Label className="mb-2 block text-sm font-subhead font-bold text-text-light uppercase tracking-wider">
                Modelos populares
              </Label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {presetChallenges.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="shrink-0 rounded-xl border border-black/10 bg-offwhite px-4 py-2 text-sm font-bold font-subhead transition-all hover:bg-white hover:border-pink hover:text-pink hover:shadow-sm active:scale-95"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-text font-bold mb-1 block">Nome do desafio</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Viagem dos Sonhos"
                  className="mt-1 border-black/10 focus:border-pink focus:ring-pink rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount" className="text-text font-bold mb-1 block">Meta (R$)</Label>
                  <Input
                    id="amount"
                    type="text"
                    inputMode="decimal"
                    value={targetAmount}
                    onChange={handleAmountChange}
                    placeholder="5.000,00"
                    className="mt-1 border-black/10 focus:border-pink focus:ring-pink rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="deposits" className="text-text font-bold mb-1 block">Nº de depósitos</Label>
                  <Input
                    id="deposits"
                    type="number"
                    value={numberOfDeposits}
                    onChange={(e) => setNumberOfDeposits(e.target.value)}
                    placeholder="100"
                    min="1"
                    max="365"
                    className="mt-1 border-black/10 focus:border-pink focus:ring-pink rounded-xl"
                  />
                </div>
              </div>

              {/* Mode selector */}
              <div>
                <Label className="mb-2 block text-text font-bold">Tipo de valores</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('classic')}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border-2 p-3 text-left transition-all',
                      mode === 'classic'
                        ? 'border-pink bg-pink/5'
                        : 'border-black/5 bg-offwhite hover:border-pink/50'
                    )}
                  >
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg shadow-sm',
                      mode === 'classic' ? 'bg-pink text-white' : 'bg-white text-text-light'
                    )}>
                      <Shuffle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold font-subhead text-text">Variado</div>
                      <div className="text-xs text-text-light">Valores diferentes</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode('fixed')}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border-2 p-3 text-left transition-all',
                      mode === 'fixed'
                        ? 'border-pink bg-pink/5'
                        : 'border-black/5 bg-offwhite hover:border-pink/50'
                    )}
                  >
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg shadow-sm',
                      mode === 'fixed' ? 'bg-pink text-white' : 'bg-white text-text-light'
                    )}>
                      <Equal className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold font-subhead text-text">Fixo</div>
                      <div className="text-xs text-text-light">Valores iguais</div>
                    </div>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-pink hover:bg-pink/90 text-white font-headline font-bold text-lg rounded-xl shadow-tactile hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-sm"
              >
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
