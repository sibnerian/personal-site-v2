import buzz from 'buzz';

const invaderSoundFiles = [
  '/sounds/tone_1.wav',
  '/sounds/tone_2.wav',
  '/sounds/tone_3.wav',
  '/sounds/tone_4.wav',
];
export const invaderSounds =
  typeof window !== 'undefined'
    ? invaderSoundFiles.map((soundFile) => new buzz.sound(soundFile))
    : [];

export function mute() {
  buzz.all().mute();
}

export function unmute() {
  buzz.all().unmute();
}
