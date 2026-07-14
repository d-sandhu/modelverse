import {
  degradeQuality,
  useShellStore,
  qualityPreset,
  type DeviceQuality,
} from "@modelverse/engine";
import { createRawInputService } from "@modelverse/input-system";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  useEffect,
  useRef,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import type { Mesh } from "three";
import type { Runtime, RuntimeSnapshot } from "./runtime";
import { createRuntime } from "./runtime";
import { checkApiHealth, type ApiStatus } from "./api";

const initialSnapshot: RuntimeSnapshot = {
  activeWorldId: "none",
  loadedWorldIds: [],
  portalStatus: "dormant",
  progress: 0,
  hud: null,
  error: null,
  player: "—",
  fps: 0,
  fade: false,
};
type ErrorBoundaryState = { error: Error | null };
class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }
  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application error boundary", error, info);
  }
  override render() {
    return this.state.error === null ? (
      this.props.children
    ) : (
      <main className="fatal">
        <h1>Modelverse paused safely</h1>
        <p>{this.state.error.message}</p>
        <button type="button" onClick={() => location.reload()}>
          Restart shell
        </button>
      </main>
    );
  }
}
const FoundationScene = ({ active }: { active: boolean }) => {
  const marker = useRef<Mesh>(null);
  const reducedMotion = useRef(
    matchMedia("(prefers-reduced-motion: reduce)").matches,
  ).current;
  useFrame((_state, delta) => {
    if (active && marker.current !== null && !reducedMotion) {
      marker.current.rotation.x += delta * 0.18;
      marker.current.rotation.y += delta * 0.3;
    }
  });
  return active ? (
    <>
      <color attach="background" args={["#07131b"]} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 7, 5]} intensity={2.2} />
      <gridHelper args={[20, 20, "#246276", "#12313d"]} position={[0, -1.5, 0]} />
      <mesh ref={marker}>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial color="#83e9ff" wireframe />
      </mesh>
    </>
  ) : null;
};
const RenderBridge = ({ runtime }: { runtime: Runtime }) => {
  const { gl, size, scene, camera } = useThree();
  const quality = useShellStore((state) => state.quality);
  const slowTime = useRef(0);
  const sampleTime = useRef(0);
  useEffect(() => {
    gl.setPixelRatio(quality.pixelRatio);
    runtime.resize(size.width, size.height, quality.pixelRatio);
  }, [gl, quality.pixelRatio, runtime, size.height, size.width]);
  useFrame((_state, delta) => {
    runtime.update(delta);
    sampleTime.current += delta;
    if (delta > 1 / 28) slowTime.current += delta;
    if (sampleTime.current > 8) {
      if (slowTime.current > 4 && quality.level !== "low")
        useShellStore.getState().setQuality(degradeQuality(quality));
      sampleTime.current = 0;
      slowTime.current = 0;
    }
    const session = runtime.getSession();
    if (session === null) gl.render(scene, camera);
    else gl.render(session.scene, session.camera);
  }, 1);
  return null;
};
export const App = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const runtimeRef = useRef<Runtime | null>(null);
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [ready, setReady] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("checking");
  const debug = useShellStore((state) => state.debug);
  const muted = useShellStore((state) => state.muted);
  const quality = useShellStore((state) => state.quality);
  const toggleDebug = useShellStore((state) => state.toggleDebug);
  const toggleMuted = useShellStore((state) => state.toggleMuted);
  const setQuality = useShellStore((state) => state.setQuality);
  useEffect(() => {
    const element = rootRef.current;
    if (element === null) return;
    const input = createRawInputService(element, {
      onReservedAction: (action) => {
        if (action === "mute") useShellStore.getState().toggleMuted();
        if (action === "debug") useShellStore.getState().toggleDebug();
        if (action === "escape") useShellStore.getState().setPaused(true);
        if (action === "fullscreen")
          void (
            document.fullscreenElement === null
              ? element.requestFullscreen()
              : document.exitFullscreen()
          ).catch((error: unknown) => console.error("Fullscreen request failed", error));
      },
    });
    const runtime = createRuntime(
      input,
      () => ({
        level: useShellStore.getState().quality.level,
        reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      }),
      setSnapshot,
    );
    runtimeRef.current = runtime;
    void runtime
      .start()
      .then(() => setReady(true))
      .catch((error: unknown) => console.error("Initial world failed", error));
    return () => {
      runtime.dispose();
      input.dispose();
      runtimeRef.current = null;
    };
  }, []);
  useEffect(() => {
    void checkApiHealth().then(setApiStatus);
  }, []);
  return (
    <div className="app-shell" ref={rootRef}>
      <header className="topbar">
        <span className="brand">
          MODELVERSE <i>FOUNDATION</i>
        </span>
        <nav>
          <button type="button" onClick={toggleMuted}>
            {muted ? "Unmute" : "Mute"}
          </button>
          <button type="button" onClick={toggleDebug}>
            {debug ? "Hide debug" : "Debug"}
          </button>
          <select
            aria-label="Graphics quality"
            value={quality.level}
            onChange={(event) =>
              setQuality(qualityPreset(event.target.value as DeviceQuality))
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </nav>
      </header>
      <main className="viewport">
        <Canvas
          data-testid="renderer-canvas"
          frameloop="always"
          gl={{ antialias: quality.level !== "low", powerPreference: "high-performance" }}
          camera={{ position: [4, 3, 6], fov: 55 }}
        >
          <FoundationScene active={snapshot.activeWorldId === "none"} />
          <RenderBridge
            runtime={
              runtimeRef.current ??
              ({
                update: () => undefined,
                getSession: () => null,
                resize: () => undefined,
              } as unknown as Runtime)
            }
          />
        </Canvas>
        {snapshot.activeWorldId === "none" ? (
          <section className="foundation-status" data-testid="foundation-status">
            <span className="status-dot" aria-hidden="true" />
            <div>
              <strong>Platform shell ready</strong>
              <p>
                No worlds are registered. Add model-authored packages when they are ready.
              </p>
            </div>
          </section>
        ) : null}
        {snapshot.hud}
        <div className={`fade ${snapshot.fade ? "visible" : ""}`} />
        <div
          className="loading"
          hidden={
            ready &&
            snapshot.portalStatus !== "prefetching-code" &&
            snapshot.portalStatus !== "preloading-assets" &&
            snapshot.portalStatus !== "initializing-world"
          }
        >
          <span>{snapshot.portalStatus.replaceAll("-", " ")}</span>
          <progress max="1" value={snapshot.progress} />
        </div>
        {snapshot.error === null ? null : (
          <aside className="portal-error" role="alert">
            <strong>Portal unavailable</strong>
            <span>{snapshot.error}</span>
            <button type="button" onClick={() => runtimeRef.current?.retry()}>
              Dismiss
            </button>
          </aside>
        )}
        {debug ? (
          <aside className="debug" data-testid="debug-overlay">
            <b>Runtime</b>
            <span>Active world: {snapshot.activeWorldId}</span>
            <span>Loaded: {snapshot.loadedWorldIds.join(", ") || "none"}</span>
            <span>Portal: {snapshot.portalStatus}</span>
            <span>FPS: ~{snapshot.fps}</span>
            <span>Player: {snapshot.player}</span>
            <span>Quality: {quality.level}</span>
            <span>Audio: {muted ? "muted" : "unmuted"}</span>
            <span>Loading: {Math.round(snapshot.progress * 100)}%</span>
            <span>
              Input: {navigator.maxTouchPoints > 0 ? "touch" : "keyboard/mouse"}
            </span>
            <span>API: {apiStatus}</span>
          </aside>
        ) : null}
        <div className="orientation-suggestion">
          Rotate to landscape for the best play view.
        </div>
      </main>
    </div>
  );
};
export const Root = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
