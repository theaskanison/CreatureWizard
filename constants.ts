import { MonsterType, QuestionStep } from './types';
import { Flame, Droplets, Leaf, Zap, Brain, Sword, Moon, Hexagon, Sparkles, Scale } from 'lucide-react';

export const TYPE_COLORS: Record<MonsterType, string> = {
  [MonsterType.FIRE]: 'bg-red-500',
  [MonsterType.WATER]: 'bg-blue-500',
  [MonsterType.GRASS]: 'bg-green-500',
  [MonsterType.ELECTRIC]: 'bg-yellow-400',
  [MonsterType.PSYCHIC]: 'bg-purple-500',
  [MonsterType.FIGHTING]: 'bg-orange-700',
  [MonsterType.DARKNESS]: 'bg-gray-800',
  [MonsterType.METAL]: 'bg-gray-400',
  [MonsterType.FAIRY]: 'bg-pink-400',
  [MonsterType.DRAGON]: 'bg-indigo-600',
};

export const TYPE_ICONS: Record<MonsterType, any> = {
  [MonsterType.FIRE]: Flame,
  [MonsterType.WATER]: Droplets,
  [MonsterType.GRASS]: Leaf,
  [MonsterType.ELECTRIC]: Zap,
  [MonsterType.PSYCHIC]: Brain,
  [MonsterType.FIGHTING]: Sword,
  [MonsterType.DARKNESS]: Moon,
  [MonsterType.METAL]: Hexagon,
  [MonsterType.FAIRY]: Sparkles,
  [MonsterType.DRAGON]: Scale,
};

export const INTERVIEW_QUESTIONS: QuestionStep[] = [
  {
    id: 'name',
    question: "What is this creature's name?",
    helperText: "Every hero needs a cool name!",
    inputType: 'text',
  },
  {
    id: 'type',
    question: "What element is it?",
    helperText: "Does it like fire, water, or maybe electricity?",
    inputType: 'select',
    options: Object.values(MonsterType),
  },
  {
    id: 'hp',
    question: "How much health (HP) does it have?",
    helperText: "Is it a tiny baby (30-50) or a giant boss (100+)?",
    inputType: 'number',
  },
  {
    id: 'sketchFeatures',
    question: "Look at your drawing. What are the specific shapes?",
    helperText: "Example: 'The circles are eyes', 'The scribble in the middle is energy', 'The triangles are spikes'.",
    inputType: 'textarea',
  },
  {
    id: 'specialAbility',
    question: "What is its super power attack?",
    helperText: "Does it shoot lasers? Roll fast? Sing a sleepy song?",
    inputType: 'text',
  },
  {
    id: 'description',
    question: "Tell me a fun fact about where it lives!",
    helperText: "Does it hide in volcanoes? Sleep in clouds?",
    inputType: 'textarea',
  },
];
