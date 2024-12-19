import { Voice, VOICES } from '@/types';

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onSelect: (voice: Voice) => void;
}

export function VoiceSelector({ selectedVoiceId, onSelect }: VoiceSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Voice
      </label>
      <select
        value={selectedVoiceId}
        onChange={(e) => {
          const voice = VOICES.find(v => v.id === e.target.value);
          if (voice) onSelect(voice);
        }}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
      >
        {VOICES.map((voice) => (
          <option key={voice.id} value={voice.id}>
            {voice.name}
          </option>
        ))}
      </select>
    </div>
  );
} 