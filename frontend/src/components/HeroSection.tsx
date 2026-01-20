import { motion } from 'framer-motion';
import { PiggyBank, Target, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onStartChallenge: () => void;
}

export function HeroSection({ onStartChallenge }: HeroSectionProps) {
  const features = [
    {
      icon: Target,
      title: 'Defina sua meta',
      description: 'Escolha quanto quer guardar e em quantos depósitos',
    },
    {
      icon: PiggyBank,
      title: 'Marque seu progresso',
      description: 'Toque para registrar cada depósito feito',
    },
    {
      icon: TrendingUp,
      title: 'Celebre cada vitória',
      description: 'Compartilhe suas conquistas com amigos',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-12">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center"
        >
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl gradient-hero shadow-glow"
          >
            <PiggyBank className="h-12 w-12 text-primary-foreground" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 text-4xl font-extrabold leading-tight sm:text-5xl"
          >
            Desafio dos{' '}
            <span className="text-gradient-hero">Depósitos</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 text-lg text-muted-foreground"
          >
            Transforme suas economias em um jogo.{' '}
            <br className="hidden sm:block" />
            Acompanhe, celebre e compartilhe cada vitória.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="hero"
              size="xl"
              onClick={onStartChallenge}
              className="group animate-pulse-glow"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Começar Agora
              <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 bg-muted/50 px-4 py-12">
        <div className="mx-auto max-w-lg">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-8 text-center text-2xl font-bold"
          >
            Como funciona?
          </motion.h2>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 rounded-2xl bg-card p-4 shadow-card"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-hero text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
        <p>
          Feito com 💚 para quem quer guardar dinheiro
        </p>
      </footer>
    </div>
  );
}
