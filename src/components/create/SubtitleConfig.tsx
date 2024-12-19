interface SubtitleConfig {
  enabled: boolean;
  style?: 'bold' | 'normal';
  position?: 'bottom' | 'top';
}

interface SubtitleConfigProps {
  config: SubtitleConfig;
  onChange: (config: SubtitleConfig) => void;
}

export function SubtitleConfig({ config, onChange }: SubtitleConfigProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Subtitles
      </label>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enable-subtitles"
            checked={config.enabled}
            onChange={(e) => onChange({ ...config, enabled: e.target.checked })}
            className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="enable-subtitles" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Enable Subtitles
          </label>
        </div>

        {config.enabled && (
          <>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Style
              </label>
              <select
                value={config.style}
                onChange={(e) => onChange({
                  ...config,
                  style: e.target.value as 'bold' | 'normal'
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              >
                <option value="bold">Bold</option>
                <option value="normal">Normal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Position
              </label>
              <select
                value={config.position}
                onChange={(e) => onChange({
                  ...config,
                  position: e.target.value as 'bottom' | 'top'
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              >
                <option value="bottom">Bottom</option>
                <option value="top">Top</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 