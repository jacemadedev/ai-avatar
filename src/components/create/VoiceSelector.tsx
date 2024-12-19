import { Voice, VOICES } from '@/types';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onSelect: (voice: Voice) => void;
}

export function VoiceSelector({ selectedVoiceId, onSelect }: VoiceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedVoice = VOICES.find(v => v.id === selectedVoiceId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Voice
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Choose a voice for your avatar
        </p>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-white dark:bg-gray-800 
          rounded-2xl border border-gray-200 dark:border-gray-700
          shadow-sm hover:shadow-md
          transition-all duration-200
          text-left flex items-center justify-between
          group"
      >
        <div>
          <span className="block text-base text-gray-900 dark:text-white">
            {selectedVoice?.name || 'Select a voice'}
          </span>
          <span className="block text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {selectedVoice?.language || 'Choose from available options'}
          </span>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 
            ${isOpen ? 'rotate-180' : ''} 
            group-hover:text-gray-600 dark:group-hover:text-gray-300`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 py-2 
          bg-white dark:bg-gray-800 
          rounded-2xl border border-gray-200 dark:border-gray-700
          shadow-xl
          max-h-[300px] overflow-y-auto">
          {VOICES.map((voice) => (
            <button
              key={voice.id}
              onClick={() => {
                onSelect(voice);
                setIsOpen(false);
              }}
              className={`w-full px-6 py-3 text-left transition-colors
                hover:bg-gray-50 dark:hover:bg-gray-700/50
                ${selectedVoiceId === voice.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
            >
              <span className={`block text-base 
                ${selectedVoiceId === voice.id 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-900 dark:text-white'}`}>
                {voice.name}
              </span>
              <span className="block text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {voice.language}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 