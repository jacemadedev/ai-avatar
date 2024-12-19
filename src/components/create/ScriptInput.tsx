interface ScriptInputProps {
  value: string;
  onChange: (text: string) => void;
}

export function ScriptInput({ value, onChange }: ScriptInputProps) {
  return (
    <div className="relative">
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Script
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Write what you want your avatar to say
        </p>
      </div>

      <div className="relative group">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[200px] p-6 bg-white dark:bg-gray-800 rounded-2xl 
            border border-gray-200 dark:border-gray-700
            shadow-sm focus:shadow-lg
            transition-all duration-200
            text-base leading-relaxed
            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            dark:focus:ring-blue-500/30 dark:focus:border-blue-400
            placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Enter your message here..."
          style={{ resize: 'none' }}
        />
        
        {/* Character count */}
        <div className="absolute bottom-4 right-4 text-sm text-gray-400 dark:text-gray-500">
          {value.length} characters
        </div>
      </div>
    </div>
  );
} 