declare module 'buzz' {
  export class sound {
    constructor(url: string);
    play: () => sound;
    mute: () => sound;
    unmute: () => sound;
  }
  export class group {
    constructor(sounds: sound[]);
    mute: () => sound;
    unmute: () => sound;
    play: () => sound;
  }
  export const sounds: sound[];
  export const all: () => group;
}
