import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CreationStep, CREATION_STEPS } from '@/types/wizard';
import { VideoConfig, Avatar, Voice, AVATARS, VOICES } from '@/types';
import { ScriptInput } from './ScriptInput';
import { AvatarSelector } from './AvatarSelector';
import { VoiceSelector } from './VoiceSelector';
import { SubtitleConfig } from './SubtitleConfig';

interface WizardProps {
  config: VideoConfig;
  onConfigChange: (config: VideoConfig) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  error: string | null;
}

export function VideoCreationWizard({
  config,
  onConfigChange,
  onGenerate,
  isGenerating,
  error
}: WizardProps) {
  const [currentStep, setCurrentStep] = useState<CreationStep>('script');
  const steps = Object.keys(CREATION_STEPS) as CreationStep[];
  const currentIndex = steps.indexOf(currentStep);

  const goToNextStep = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'script':
        return config.text.trim().length > 0;
      case 'preview':
        return !isGenerating;
      default:
        return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`flex-1 text-sm font-medium ${
                index <= currentIndex ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              {CREATION_STEPS[step].title}
            </button>
          ))}
        </div>
        <div className="h-1 bg-gray-200 rounded-full">
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            {CREATION_STEPS[currentStep].title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {CREATION_STEPS[currentStep].description}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step Content */}
            {currentStep === 'script' && (
              <ScriptInput
                value={config.text}
                onChange={(text: string) => onConfigChange({ ...config, text })}
              />
            )}
            {currentStep === 'avatar' && (
              <AvatarSelector
                selectedAvatarId={config.avatar.id}
                onSelect={(avatar: Avatar) => onConfigChange({
                  ...config,
                  avatar: { ...config.avatar, id: avatar.id },
                  voice: VOICES.find((v: Voice) => v.name.includes(avatar.name)) || config.voice
                })}
              />
            )}
            {currentStep === 'voice' && (
              <VoiceSelector
                selectedVoiceId={config.voice.id}
                onSelect={(voice: Voice) => onConfigChange({
                  ...config,
                  voice: { id: voice.id, name: voice.name }
                })}
              />
            )}
            {currentStep === 'subtitles' && (
              <SubtitleConfig
                config={config.subtitles}
                onChange={(subtitles: VideoConfig['subtitles']) => onConfigChange({ ...config, subtitles })}
              />
            )}
            {currentStep === 'preview' && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="font-medium mb-4">Review Your Choices</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm text-gray-500">Script</dt>
                      <dd className="mt-1">{config.text}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Avatar</dt>
                      <dd className="mt-1">
                        {AVATARS.find((a: Avatar) => a.id === config.avatar.id)?.name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Voice</dt>
                      <dd className="mt-1">{config.voice.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Subtitles</dt>
                      <dd className="mt-1">{config.subtitles.enabled ? 'Enabled' : 'Disabled'}</dd>
                    </div>
                  </dl>
                </div>
                
                <button
                  onClick={onGenerate}
                  disabled={isGenerating}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                >
                  {isGenerating ? 'Generating...' : 'Create Video'}
                </button>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={goToPreviousStep}
            disabled={currentIndex === 0}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </button>
          
          {currentStep !== 'preview' && (
            <button
              onClick={goToNextStep}
              disabled={!canProceed()}
              className="flex items-center px-4 py-2 text-blue-500 hover:text-blue-600 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 