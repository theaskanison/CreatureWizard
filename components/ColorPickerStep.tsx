import React from 'react';
import { CreatureData } from '../types';
import { Button } from './Button';
import { Check, Info, Wand2 } from 'lucide-react';

interface ColorPickerStepProps {
  creatureData: CreatureData;
  setCreatureData: React.Dispatch<React.SetStateAction<CreatureData>>;
  onComplete: () => void;
}

const COLORS = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Lime', hex: '#84CC16' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Indigo', hex: '#6366F1' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Fuchsia', hex: '#D946EF' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Rose', hex: '#F43F5E' },
  { name: 'Brown', hex: '#78350F' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Grey', hex: '#6B7280' },
];

export const ColorPickerStep: React.FC<ColorPickerStepProps> = ({ creatureData, setCreatureData, onComplete }) => {
  
  const toggleColor = (colorName: string) => {
    setCreatureData(prev => {
      const current = prev.selectedColors || [];
      if (current.includes(colorName)) {
        return { ...prev, selectedColors: current.filter(c => c !== colorName) };
      }
      if (current.length >= 3) {
        return prev; // Max 3
      }
      return { ...prev, selectedColors: [...current, colorName] };
    });
  };

  const setHarmony = (harmony: CreatureData['colorHarmony']) => {
    setCreatureData(prev => ({ ...prev, colorHarmony: harmony }));
  };

  const isReady = (creatureData.selectedColors?.length || 0) >= 2;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col animate-fade-in-up">
      <div className="bg-purple-600 p-6 text-white text-center">
        <h2 className="text-3xl font-bold mb-2">Color Magic!</h2>
        <p className="opacity-90">Let's paint your creature.</p>
      </div>

      <div className="p-8 flex flex-col gap-8">
        
        {/* Harmony Selection */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center justify-center gap-2">
            1. How should colors work? <Info size={16} className="text-gray-400" />
          </h3>
          <div className="flex justify-center gap-4 flex-wrap">
            {['Harmonize', 'Contrast', 'Surprise Me'].map((option) => (
              <button
                key={option}
                onClick={() => setHarmony(option as any)}
                className={`
                  px-6 py-3 rounded-xl border-2 font-bold transition-all
                  ${creatureData.colorHarmony === option 
                    ? 'bg-purple-100 border-purple-600 text-purple-700 shadow-md scale-105' 
                    : 'bg-white border-gray-200 text-gray-500 hover:border-purple-300'}
                `}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {creatureData.colorHarmony === 'Harmonize' && "Colors will blend nicely like a sunset."}
            {creatureData.colorHarmony === 'Contrast' && "Colors will pop and stand out!"}
            {creatureData.colorHarmony === 'Surprise Me' && "The wizard will choose the magic style!"}
          </p>
        </div>

        {/* Color Wheel / Grid */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-purple-900 mb-2">2. Pick 2 or 3 colors</h3>
          <p className="text-gray-500 mb-6 text-sm">
            Selected: {creatureData.selectedColors.length}/3
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto">
             {COLORS.map((color) => {
               const isSelected = creatureData.selectedColors.includes(color.name);
               return (
                 <button
                   key={color.name}
                   onClick={() => toggleColor(color.name)}
                   disabled={!isSelected && creatureData.selectedColors.length >= 3}
                   className={`
                     w-12 h-12 rounded-full shadow-sm border-2 transition-all transform hover:scale-110
                     ${isSelected ? 'ring-4 ring-purple-300 scale-110 z-10' : 'ring-0'}
                     ${(!isSelected && creatureData.selectedColors.length >= 3) ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                   `}
                   style={{ backgroundColor: color.hex, borderColor: color.name === 'White' ? '#e5e7eb' : 'transparent' }}
                   title={color.name}
                 >
                   {isSelected && <Check className={`mx-auto ${color.name === 'White' || color.name === 'Yellow' ? 'text-black' : 'text-white'}`} size={20} />}
                 </button>
               );
             })}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
           <Button 
             onClick={onComplete} 
             disabled={!isReady}
             size="lg"
             className="w-full md:w-auto"
           >
             Create Card! <Wand2 className="ml-2" size={20} />
           </Button>
        </div>

      </div>
    </div>
  );
};