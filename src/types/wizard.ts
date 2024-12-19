export type CreationStep = 'script' | 'avatar' | 'voice' | 'preview';

export interface StepConfig {
  title: string;
  description: string;
}

export const CREATION_STEPS: Record<CreationStep, StepConfig> = {
  script: {
    title: "Write Your Script",
    description: "Start with your message. Write what you want your avatar to say."
  },
  avatar: {
    title: "Choose Your Avatar",
    description: "Select a digital presenter that matches your brand's style."
  },
  voice: {
    title: "Select the Voice",
    description: "Pick a voice that best represents your message."
  },
  preview: {
    title: "Review & Generate",
    description: "Review your choices and create your video."
  }
}; 