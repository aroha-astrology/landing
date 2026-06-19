import { create } from 'zustand';

/**
 * Shared "scene inputs" — page scroll progress (0 top → 1 bottom) and the
 * normalized pointer (-1..1). Published from SmoothScrollProvider and read by
 * the WebGL camera rig inside useFrame, a non-React channel so camera/parallax
 * updates never trigger re-renders. The pointer lives here (not R3F's
 * state.pointer) because the canvas is pointer-events:none behind the content.
 */
interface ScrollState {
  progress: number;
  px: number;
  py: number;
  setProgress: (p: number) => void;
  setPointer: (px: number, py: number) => void;
}

export const useScroll = create<ScrollState>((set) => ({
  progress: 0,
  px: 0,
  py: 0,
  setProgress: (progress) => set({ progress }),
  setPointer: (px, py) => set({ px, py }),
}));
