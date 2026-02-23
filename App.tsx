import React, { useState } from 'react';
import { AppStep, CreatureData, MonsterType } from './types';
import { SketchUploader } from './components/SketchUploader';
import { Interview } from './components/Interview';
import { ColorPickerStep } from './components/ColorPickerStep';
import { Button } from './components/Button';
import { MicButton } from './components/MicButton';
import { generateMonsterCard, editMonsterCard } from './services/geminiService';
import { Sparkles, Wand2, RefreshCcw, Download, Palette } from 'lucide-react';

const INITIAL_DATA: CreatureData = {
  name: '',
  type: MonsterType.FIRE,
  hp: 50,
  description: '',
  specialAbility: '',
  specialAbilityDamage: 40,
  sketchBase64: null,
  sketchFeatures: '',
  selectedColors: [],
  colorHarmony: 'Harmonize'
};

function App() {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [creatureData, setCreatureData] = useState<CreatureData>(INITIAL_DATA);
  const [generatedCardUrl, setGeneratedCardUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleUpload = (base64: string) => {
    setCreatureData(prev => ({ ...prev, sketchBase64: base64 }));
    setStep(AppStep.INTERVIEW);
  };

  const handleInterviewComplete = () => {
    setStep(AppStep.COLOR);
  };

  const handleColorComplete = async () => {
    setStep(AppStep.GENERATING);
    try {
      const url = await generateMonsterCard(creatureData);
      if (url) {
        setGeneratedCardUrl(url);
        setStep(AppStep.RESULT);
      } else {
        throw new Error("Failed to generate image.");
      }
    } catch (err) {
      console.error(err);
      setError("Oh no! The creation machine got jammed. Please try again.");
      setStep(AppStep.INTERVIEW); // Go back to interview on error
    }
  };

  const handleEditCard = async () => {
    if (!editPrompt || !generatedCardUrl) return;
    
    setIsRegenerating(true);
    try {
      const newUrl = await editMonsterCard(generatedCardUrl, editPrompt);
      if (newUrl) {
        setGeneratedCardUrl(newUrl);
        setIsEditing(false);
        setEditPrompt('');
      } else {
        throw new Error("Failed to edit image");
      }
    } catch (err) {
      console.error(err);
      alert("The magic wand fizzled! Try a different instruction.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleReset = () => {
    setCreatureData(INITIAL_DATA);
    setGeneratedCardUrl(null);
    setStep(AppStep.LANDING);
    setError(null);
    setIsEditing(false);
    setEditPrompt('');
  };

  const handleEditVoiceInput = (text: string) => {
    setEditPrompt(prev => prev ? `${prev} ${text}` : text);
  };

  return (
    <div className="min-h-screen bg-slate-100 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="max-w-5xl mx-auto px-4 py-8 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center transform -rotate-6 shadow-lg border-2 border-purple-400">
              <Sparkles className="text-yellow-300 w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-purple-900 tracking-tight">
              Creature<span className="text-purple-500">Wizard</span>
            </h1>
          </div>
          {step !== AppStep.LANDING && (
            <button 
              onClick={handleReset}
              className="text-sm font-bold text-gray-500 hover:text-red-500 flex items-center bg-white px-3 py-1 rounded-full shadow-sm"
            >
              Start Over
            </button>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-center w-full">
          
          {step === AppStep.LANDING && (
            <div className="text-center animate-fade-in-up">
              <div className="mb-8 relative inline-block">
                <div className="absolute inset-0 bg-purple-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <img 
                  src="https://robohash.org/creature-wizard-demo?set=set2&size=400x300" 
                  alt="Example Monster" 
                  className="relative rounded-3xl shadow-2xl border-4 border-white transform rotate-2 w-80 md:w-96 mx-auto hover:rotate-0 transition-transform duration-500 bg-purple-50"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border-2 border-purple-100 transform -rotate-3">
                  <p className="font-bold text-purple-900">Draw it. Snap it. Play it!</p>
                </div>
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold text-purple-900 mb-6 drop-shadow-sm">
                Unleash Your <br/><span className="text-purple-500">Inner Wizard</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                Turn your sketchbook scribbles into real, playable trading cards with the power of magic!
              </p>
              <Button size="lg" onClick={() => setStep(AppStep.UPLOAD)} className="text-2xl px-12 py-6 shadow-xl shadow-purple-200 bg-purple-500 hover:bg-purple-400 border-purple-700 text-white">
                <Wand2 className="inline mr-3 mb-1" />
                Start Magic
              </Button>
            </div>
          )}

          {step === AppStep.UPLOAD && (
            <div className="w-full">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-purple-900">Show us your creature!</h2>
                <p className="text-gray-500">Upload a clear photo of your drawing.</p>
              </div>
              <SketchUploader onUpload={handleUpload} />
            </div>
          )}

          {step === AppStep.INTERVIEW && (
            <div className="w-full">
              {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl text-center font-bold border border-red-200">
                  {error}
                </div>
              )}
              <Interview 
                creatureData={creatureData} 
                setCreatureData={setCreatureData}
                onComplete={handleInterviewComplete}
              />
            </div>
          )}

          {step === AppStep.COLOR && (
             <div className="w-full">
               <ColorPickerStep 
                 creatureData={creatureData}
                 setCreatureData={setCreatureData}
                 onComplete={handleColorComplete}
               />
             </div>
          )}

          {(step === AppStep.GENERATING || isRegenerating) && (
            <div className="text-center w-full max-w-lg mx-auto">
              <div className="relative w-48 h-48 mx-auto mb-8">
                <div className="absolute inset-0 border-8 border-purple-100 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 border-t-8 border-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Wand2 className="w-16 h-16 text-purple-500 animate-bounce" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">
                {isRegenerating ? "Casting Transformation..." : "Summoning Creature..."}
              </h2>
              <p className="text-xl text-gray-600 animate-pulse">
                "Mixing {creatureData.selectedColors.join(' and ')}..." <br/>
                "Infusing with {creatureData.type} power..."
              </p>
            </div>
          )}

          {step === AppStep.RESULT && generatedCardUrl && !isRegenerating && (
            <div className="w-full flex flex-col items-center animate-fade-in-up pb-12">
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 mb-6 text-center">
                Behold Your Creation!
              </h2>
              
              <div className="relative group perspective-1000 mb-8 w-full max-w-2xl px-4">
                <div className="relative transform transition-transform duration-500 hover:scale-[1.02]">
                  {/* Backdrop Glow - made subtle */}
                  <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-3xl opacity-20"></div>
                  
                  {/* Main Card Image - increased size and ensured opacity */}
                  <img 
                    src={generatedCardUrl} 
                    alt="Generated Card" 
                    className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white bg-white relative z-10"
                  />
                  
                  {/* Holographic overlay - only on hover, z-20 to be on top */}
                  <div className="absolute inset-0 z-20 rounded-2xl bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700 mix-blend-overlay" style={{ backgroundSize: '200% 200%' }}></div>
                </div>
              </div>

              {/* Edit Mode Section */}
              {isEditing ? (
                 <div className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-xl border-2 border-purple-100 mb-8 animate-fade-in">
                   <h3 className="text-xl font-bold text-purple-900 mb-2">Magic Wand</h3>
                   <p className="text-gray-500 mb-4 text-sm">What would you like to change about this card?</p>
                   <div className="relative">
                     <textarea 
                       value={editPrompt}
                       onChange={(e) => setEditPrompt(e.target.value)}
                       placeholder="Example: Make the monster green, Add lightning in the background..."
                       className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none mb-4 h-24 resize-none"
                     />
                     <div className="absolute right-2 bottom-6">
                        <MicButton onTranscript={handleEditVoiceInput} />
                     </div>
                   </div>
                   <div className="flex gap-3">
                     <Button onClick={() => setIsEditing(false)} variant="secondary" size="sm">Cancel</Button>
                     <Button onClick={handleEditCard} size="sm" disabled={!editPrompt.trim()}>Cast Spell</Button>
                   </div>
                 </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl px-4">
                  <Button 
                    variant="secondary" 
                    onClick={() => setIsEditing(true)} 
                    className="flex-1 flex items-center justify-center border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <Palette className="mr-2" size={20} />
                    Magic Edit
                  </Button>
                  
                  <a 
                    href={generatedCardUrl} 
                    download={`${creatureData.name}-card.png`}
                    className="flex-1"
                  >
                    <Button size="md" className="w-full flex items-center justify-center bg-green-500 hover:bg-green-400 border-green-700 text-white">
                      <Download className="mr-2" size={20} />
                      Save Card
                    </Button>
                  </a>
                  
                  <Button 
                    variant="secondary" 
                    onClick={handleReset} 
                    className="flex-1 flex items-center justify-center"
                  >
                    <RefreshCcw className="mr-2" size={20} />
                    New
                  </Button>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;