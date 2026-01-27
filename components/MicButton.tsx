import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface MicButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  type?: 'text' | 'number';
}

export const MicButton: React.FC<MicButtonProps> = ({ onTranscript, className = '', type = 'text' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
    }
  }, []);

  const handleListen = () => {
    if (isListening) return;

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        
        if (type === 'number') {
          // Try to convert number words to digits (basic attempt)
          const numberValue = parseInt(transcript.replace(/[^0-9]/g, ''));
          if (!isNaN(numberValue)) {
            onTranscript(numberValue.toString());
          } else {
            // Fallback for simple words like "fifty" -> web speech api usually handles this, 
            // but if it returns text, we pass it and let the parent handle or just pass raw.
            onTranscript(transcript);
          }
        } else {
          onTranscript(transcript);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      console.error(error);
      setIsListening(false);
    }
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={handleListen}
      disabled={isListening}
      className={`
        relative p-3 rounded-full transition-all duration-300 flex items-center justify-center
        ${isListening 
          ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.7)] animate-pulse' 
          : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-110'
        } 
        ${className}
      `}
      title="Tap to speak"
    >
      {isListening ? (
        <MicOff size={24} />
      ) : (
        <Mic size={24} />
      )}
    </button>
  );
};