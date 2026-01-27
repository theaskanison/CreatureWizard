import React, { useState } from 'react';
import { INTERVIEW_QUESTIONS, TYPE_COLORS, TYPE_ICONS } from '../constants';
import { CreatureData, MonsterType } from '../types';
import { Button } from './Button';
import { MicButton } from './MicButton';
import { ArrowRight, ArrowLeft, Palette } from 'lucide-react';

interface InterviewProps {
  creatureData: CreatureData;
  setCreatureData: React.Dispatch<React.SetStateAction<CreatureData>>;
  onComplete: () => void;
}

export const Interview: React.FC<InterviewProps> = ({ creatureData, setCreatureData, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentQuestion = INTERVIEW_QUESTIONS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Basic validation
      if (!creatureData.name) {
        alert("Please give your monster a name!");
        return;
      }
      // Calculate random damage if not set, just for fun logic fallback
      if (!creatureData.specialAbilityDamage) {
        setCreatureData(prev => ({ ...prev, specialAbilityDamage: Math.floor(Math.random() * 50) + 30 }));
      }
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleChange = (value: string | number) => {
    setCreatureData(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleVoiceInput = (text: string) => {
    if (currentQuestion.inputType === 'number') {
      const num = parseInt(text.replace(/[^0-9]/g, ''));
      if (!isNaN(num)) {
        handleChange(num);
      }
    } else {
      // If there's already text, append it. If not, replace.
      const currentValue = creatureData[currentQuestion.id] as string;
      const newValue = currentValue ? `${currentValue} ${text}` : text;
      // Capitalize first letter
      const formatted = newValue.charAt(0).toUpperCase() + newValue.slice(1);
      handleChange(formatted);
    }
  };

  const isLastStep = currentStepIndex === INTERVIEW_QUESTIONS.length - 1;

  // Progress Bar
  const progress = ((currentStepIndex + 1) / INTERVIEW_QUESTIONS.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
      {/* Header with Progress */}
      <div className="bg-blue-900 p-6 text-white relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Lab Assistant</h2>
          <span className="bg-blue-800 px-3 py-1 rounded-full text-sm font-bold">
            Step {currentStepIndex + 1}/{INTERVIEW_QUESTIONS.length}
          </span>
        </div>
        <div className="w-full bg-blue-800 rounded-full h-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 p-8 flex flex-col justify-center items-center text-center">
        <div className="mb-8">
           <img 
             src={`https://picsum.photos/seed/${currentQuestion.id}/150/150`} 
             alt="Professor" 
             className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-yellow-400 shadow-md"
           />
           <div className="bg-blue-50 p-6 rounded-2xl relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-50 rotate-45"></div>
             <h3 className="text-2xl font-bold text-blue-900 mb-2">{currentQuestion.question}</h3>
             <p className="text-blue-600">{currentQuestion.helperText}</p>
           </div>
        </div>

        <div className="w-full max-w-md">
          {currentQuestion.inputType === 'text' && (
            <div className="relative">
              <input
                type="text"
                value={creatureData[currentQuestion.id] as string || ''}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full p-4 pr-16 text-xl border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none text-center"
                placeholder="Type answer here..."
                autoFocus
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <MicButton onTranscript={handleVoiceInput} />
              </div>
            </div>
          )}

          {currentQuestion.inputType === 'number' && (
            <div className="relative">
              <input
                type="number"
                value={creatureData[currentQuestion.id] as number || ''}
                onChange={(e) => handleChange(parseInt(e.target.value) || 0)}
                className="w-full p-4 pr-16 text-3xl font-bold border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none text-center"
                placeholder="0"
                autoFocus
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <MicButton onTranscript={handleVoiceInput} type="number" />
              </div>
            </div>
          )}

          {currentQuestion.inputType === 'textarea' && (
            <div className="relative">
              <textarea
                value={creatureData[currentQuestion.id] as string || ''}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full p-4 text-lg border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none h-32"
                placeholder="Tell me more..."
                autoFocus
              />
              <div className="absolute right-2 bottom-2">
                <MicButton onTranscript={handleVoiceInput} />
              </div>
            </div>
          )}

          {currentQuestion.inputType === 'select' && (
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
              {currentQuestion.options?.map((option) => {
                const isSelected = creatureData.type === option;
                const Icon = TYPE_ICONS[option as MonsterType];
                const colorClass = TYPE_COLORS[option as MonsterType];
                
                return (
                  <button
                    key={option}
                    onClick={() => handleChange(option)}
                    className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50 shadow-md transform scale-105' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${colorClass} text-white flex items-center justify-center`}>
                       {Icon && <Icon size={16} />}
                    </div>
                    <span className="font-bold text-gray-700">{option}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-6 bg-gray-50 flex justify-between items-center border-t border-gray-100">
        <button 
          onClick={handleBack}
          disabled={currentStepIndex === 0}
          className={`flex items-center text-gray-500 font-bold hover:text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors ${currentStepIndex === 0 ? 'opacity-0 pointer-events-none' : ''}`}
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        
        <Button onClick={handleNext} size="lg" className="flex items-center shadow-xl shadow-blue-200">
          {isLastStep ? 'Pick Colors' : 'Next'}
          {isLastStep ? <Palette size={20} className="ml-2" /> : <ArrowRight size={20} className="ml-2" />}
        </Button>
      </div>
    </div>
  );
};