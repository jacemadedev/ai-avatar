export interface Avatar {
  id: string;
  name: string;
  preview: string;
  hasDefaultVoice?: boolean;
  hasDefaultBackground?: boolean;
}

export interface Voice {
  id: string;
  name: string;
  language: string;
}

export interface Background {
  type: 'color' | 'image' | 'video';
  value: string;
  name: string;
}

export const AVATARS: Avatar[] = [
  { id: 'Daisy-inskirt-20220818', name: 'Daisy', preview: '👩' },
  { id: '4906bbce5e1a49d9936a59403c2c8efe', name: 'Brody', preview: '👨‍💼', hasDefaultVoice: true, hasDefaultBackground: true },
  // Temporarily remove Noah and Sarah until we have their correct voice IDs
];

export const VOICES: Voice[] = [
  { id: '2d5b0e6cf36f460aa7fc47e3eee4ba54', name: 'Daisy (English)', language: 'English' },
  // Removed Noah's voice since we're not sure of the correct ID
];

export const BACKGROUNDS: Background[] = [
  { type: 'color', value: '#FFFFFF', name: 'White' },
  { type: 'color', value: '#008000', name: 'Green Screen' },
  { type: 'color', value: '#000000', name: 'Black' },
]; 