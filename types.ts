export enum AppStep {
  LANDING = 'LANDING',
  UPLOAD = 'UPLOAD',
  INTERVIEW = 'INTERVIEW',
  COLOR = 'COLOR',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
}

export enum MonsterType {
  FIRE = 'Fire',
  WATER = 'Water',
  GRASS = 'Grass',
  ELECTRIC = 'Electric',
  PSYCHIC = 'Psychic',
  FIGHTING = 'Fighting',
  DARKNESS = 'Darkness',
  METAL = 'Metal',
  FAIRY = 'Fairy',
  DRAGON = 'Dragon'
}

export interface CreatureData {
  name: string;
  type: MonsterType;
  hp: number;
  description: string;
  specialAbility: string;
  specialAbilityDamage: number;
  sketchBase64: string | null;
  sketchFeatures: string; // "The circles are eyes, the triangle is the tail"
  selectedColors: string[];
  colorHarmony: 'Harmonize' | 'Contrast' | 'Surprise Me';
}

export interface QuestionStep {
  id: keyof CreatureData | 'sketchFeatures';
  question: string;
  helperText: string;
  inputType: 'text' | 'select' | 'number' | 'textarea';
  options?: string[];
}