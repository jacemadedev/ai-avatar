interface ScriptInputProps {
  value: string;
  onChange: (text: string) => void;
}

export function ScriptInput({ value, onChange }: ScriptInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Script
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        placeholder="Enter your video script here..."
      />
    </div>
  );
} 