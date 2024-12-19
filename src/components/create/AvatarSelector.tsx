import { Avatar, AVATARS } from '@/types';

interface AvatarSelectorProps {
  selectedAvatarId: string;
  onSelect: (avatar: Avatar) => void;
}

export function AvatarSelector({ selectedAvatarId, onSelect }: AvatarSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Avatar
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar)}
            className={`p-4 rounded-lg border ${
              selectedAvatarId === avatar.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <span className="text-3xl block mb-2">{avatar.preview}</span>
            <span className="text-sm">{avatar.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 