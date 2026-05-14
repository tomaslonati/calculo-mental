import type { GameMode } from '../types/game';

export interface ModeConfig {
  id: GameMode;
  label: string;
  short: string;
  description: string;
  hint: string;
}

export const MODES: ModeConfig[] = [
  {
    id: 'clasico',
    label: 'Clásico',
    short: 'Resolvé y escribí',
    description: 'Ingresá el resultado de cada operación con el teclado numérico.',
    hint: 'Input manual',
  },
  {
    id: 'verdadero_falso',
    label: 'Verdadero o falso',
    short: '¿Es correcto?',
    description: 'Decidí si el resultado mostrado corresponde a la operación.',
    hint: 'V / F',
  },
  {
    id: 'multiple_choice',
    label: 'Opción múltiple',
    short: '4 opciones',
    description: 'Elegí la respuesta correcta entre cuatro alternativas.',
    hint: '4 opciones',
  },
  {
    id: 'contra_reloj',
    label: 'Contra reloj',
    short: '60 segundos',
    description: 'Respondé tantas operaciones como puedas en un minuto.',
    hint: '60s',
  },
];

export const MODES_BY_ID: Record<GameMode, ModeConfig> = MODES.reduce(
  (acc, m) => {
    acc[m.id] = m;
    return acc;
  },
  {} as Record<GameMode, ModeConfig>,
);
