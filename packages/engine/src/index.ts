import { create } from "zustand";

export type DeviceQuality = "low" | "medium" | "high";
export type QualitySettings = {
  level: DeviceQuality;
  pixelRatio: number;
  shadows: "off" | "low" | "high";
  portalPreview: "shader" | "static" | "live";
  portalPreviewFps: number;
  postProcessing: boolean;
  textureTier: "small" | "medium" | "large";
  particleMultiplier: number;
  drawDistanceMultiplier: number;
};
const presets: Record<DeviceQuality, QualitySettings> = {
  low: {
    level: "low",
    pixelRatio: 1,
    shadows: "off",
    portalPreview: "shader",
    portalPreviewFps: 0,
    postProcessing: false,
    textureTier: "small",
    particleMultiplier: 0.3,
    drawDistanceMultiplier: 0.6,
  },
  medium: {
    level: "medium",
    pixelRatio: 1.35,
    shadows: "low",
    portalPreview: "static",
    portalPreviewFps: 10,
    postProcessing: false,
    textureTier: "medium",
    particleMultiplier: 0.65,
    drawDistanceMultiplier: 0.8,
  },
  high: {
    level: "high",
    pixelRatio: 2,
    shadows: "high",
    portalPreview: "live",
    portalPreviewFps: 20,
    postProcessing: true,
    textureTier: "large",
    particleMultiplier: 1,
    drawDistanceMultiplier: 1,
  },
};
export const selectInitialQuality = (
  mobile: boolean,
  devicePixelRatio: number,
  reducedMotion: boolean,
): QualitySettings => {
  const level: DeviceQuality = mobile || devicePixelRatio > 2 ? "low" : "medium";
  const selected = presets[level];
  return {
    ...selected,
    pixelRatio: Math.min(devicePixelRatio, selected.pixelRatio),
    postProcessing: selected.postProcessing && !reducedMotion,
  };
};
export const degradeQuality = (quality: QualitySettings): QualitySettings =>
  quality.level === "high"
    ? {
        ...presets.medium,
        pixelRatio: Math.min(quality.pixelRatio, presets.medium.pixelRatio),
      }
    : {
        ...presets.low,
        pixelRatio: Math.min(quality.pixelRatio, presets.low.pixelRatio),
      };
export type ShellState = {
  paused: boolean;
  muted: boolean;
  debug: boolean;
  quality: QualitySettings;
  setPaused: (value: boolean) => void;
  toggleMuted: () => void;
  toggleDebug: () => void;
  setQuality: (quality: QualitySettings) => void;
};
const reducedMotion =
  typeof matchMedia === "function" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobile = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
export const useShellStore = create<ShellState>((set) => ({
  paused: false,
  muted: false,
  debug: false,
  quality: selectInitialQuality(
    mobile,
    typeof devicePixelRatio === "number" ? devicePixelRatio : 1,
    reducedMotion,
  ),
  setPaused: (paused) => set({ paused }),
  toggleMuted: () => set((state) => ({ muted: !state.muted })),
  toggleDebug: () => set((state) => ({ debug: !state.debug })),
  setQuality: (quality) => set({ quality }),
}));
export const qualityPreset = (level: DeviceQuality): QualitySettings => ({
  ...presets[level],
});
