export interface Avatar {
  id: string;
  name: string;
  preview: string;
}

export interface Voice {
  id: string;
  name: string;
  language: string;
}

export interface VideoConfig {
  text: string;
  avatar: {
    id: string;
    style: 'normal' | 'happy' | 'sad' | 'angry';
  };
  voice: {
    id: string;
    name: string;
  };
  subtitles: {
    enabled: boolean;
    style: 'bold' | 'normal';
    position: 'bottom' | 'top';
  };
}

// Male Avatars
export const MALE_AVATARS: Avatar[] = [
  { id: '4906bbce5e1a49d9936a59403c2c8efe', name: 'Male 1', preview: '👨‍💼' },
  { id: 'd6efc8c226f947b79414b0306aa238cb', name: 'Male 2', preview: '👨‍💼' },
  { id: 'dc7f5f7b570741d38ec8bd1d06fd8acf', name: 'Male 3', preview: '👨‍💼' },
  { id: '36818e88569b4df68fc1d1310bf20c42', name: 'Male 4', preview: '👨‍💼' },
  { id: '9f7d0c9b13094fce8ea937568fb42409', name: 'Male 5', preview: '👨‍💼' },
  { id: 'ae8df65281314abeb547a14687764e58', name: 'Male 6', preview: '👨‍💼' },
  { id: '159c3167739842acb1644a4a985c950c', name: 'Male 7', preview: '👨‍💼' },
  { id: '9ad468ef2ebd4a889572aa053a81fd60', name: 'Male 8', preview: '👨‍💼' },
  { id: '220d54045019433182de54afa4145c9e', name: 'Male 9', preview: '👨‍💼' },
  { id: '926e54d505ca4727ac3c435ff4713c36', name: 'Male 10', preview: '👨‍💼' },
];

// Female Avatars
export const FEMALE_AVATARS: Avatar[] = [
  { id: '8a99c97065274f65b1b32bc16a9afa2a', name: 'Female 1', preview: '👩‍💼' },
  { id: '7e41675b2f8144d5bf998b8e48400260', name: 'Female 2', preview: '👩‍💼' },
  { id: '18d5a9c4fbfe41978f15ee0e6f60f72f', name: 'Female 3', preview: '👩‍💼' },
  { id: 'de3a4df978294974aeecba80a4b5e393', name: 'Female 4', preview: '👩‍💼' },
  { id: 'eacc40bd7e64472786393f78b3353a55', name: 'Female 5', preview: '👩‍💼' },
  { id: '56e51924bcca4f3c8d587875ee631b5b', name: 'Female 6', preview: '👩‍💼' },
  { id: '1cc1bca44f5b42419e72d6c2f836fcfa', name: 'Female 7', preview: '👩‍💼' },
  { id: 'b45a5392c1494acaabdcee001f19d5bc', name: 'Female 8', preview: '👩‍💼' },
  { id: '98422c4dba0e47839b765b8d3ce0effb', name: 'Female 9', preview: '👩‍💼' },
  { id: 'c17b0fd137024b08833f0d64d13e73b8', name: 'Female 10', preview: '👩‍💼' },
  { id: '5efa75fc5fed4ef98bbc9964770107fd', name: 'Female 11', preview: '👩‍💼' },
  { id: 'bf8cef04aafb4584a3afb7a06a9846a7', name: 'Female 12', preview: '👩‍💼' },
  { id: '7606ec9651e9454aae41cb293a4a6f93', name: 'Female 13', preview: '👩‍💼' },
  { id: '4d1440e8beb6451cb89edcef24cc02b5', name: 'Female 14', preview: '👩‍💼' },
  { id: 'a322e4a9cb68424289fbce5459a04227', name: 'Female 15', preview: '👩‍💼' },
  { id: 'e0816712d481406895289662b02c1e18', name: 'Female 16', preview: '👩‍💼' },
];

// Combine all avatars
export const AVATARS = [...MALE_AVATARS, ...FEMALE_AVATARS];

// Male Voices
export const MALE_VOICES: Voice[] = [
  { id: '23e526605d744f66b85a7eb5116db028', name: 'Male Voice 1', language: 'English' },
  { id: '8b92884579014f8e8147836bbd0c13ca', name: 'Male Voice 2', language: 'English' },
  { id: 'a04d81d19afd436db611060682276331', name: 'Male Voice 3', language: 'English' },
  { id: '086b225655694cd9ae60e712469ce474', name: 'Male Voice 4', language: 'English' },
  { id: '606c9d2a08be4e4f8cb38eafef8090de', name: 'Male Voice 5', language: 'English' },
];

// Female Voices
export const FEMALE_VOICES: Voice[] = [
  { id: '8273e0a033074b5bb98d7ce3ab727bd9', name: 'Female Voice 1', language: 'English' },
  { id: '166aa8d7acd1495a839d34024ccb1505', name: 'Female Voice 2', language: 'English' },
  { id: '445a8c7de9e74ed2a0dd02d5885ac589', name: 'Female Voice 3', language: 'English' },
  { id: '035ec8f52ec247cdbed5f3bf9f7991ef', name: 'Female Voice 4', language: 'English' },
  { id: '080ae8ef6a0c48b98486a48be132fdd0', name: 'Female Voice 5', language: 'English' },
];

// Combine all voices
export const VOICES = [...MALE_VOICES, ...FEMALE_VOICES]; 