declare module 'raf-loop' {
  export interface Engine {
    start: () => void;
    stop: () => void;
    on: (s: 'tick', listener: (dt: number) => void) => void;
  }

  export default function loop(fn?: (dt: number) => void): Engine;
}
