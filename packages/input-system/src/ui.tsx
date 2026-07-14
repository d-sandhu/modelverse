import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

export type Direction = { x: number; y: number };
export const SafeArea = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <div className={`safe-area ${className}`}>{children}</div>;
export const TouchActionButton = ({
  label,
  onAction,
}: {
  label: string;
  onAction: () => void;
}) => (
  <button
    className="touch-action"
    type="button"
    aria-label={label}
    onPointerDown={(event) => {
      event.preventDefault();
      onAction();
    }}
  >
    {label}
  </button>
);
export const TouchDragArea = ({
  label,
  onDrag,
}: {
  label: string;
  onDrag: (direction: Direction) => void;
}) => {
  const last = useRef<readonly [number, number] | null>(null);
  return (
    <div
      className="touch-drag"
      aria-label={label}
      onPointerDown={(event) => {
        last.current = [event.clientX, event.clientY];
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (last.current === null) return;
        onDrag({
          x: event.clientX - last.current[0],
          y: event.clientY - last.current[1],
        });
        last.current = [event.clientX, event.clientY];
      }}
      onPointerUp={() => {
        last.current = null;
      }}
    />
  );
};
export const VirtualJoystick = ({
  label,
  onChange,
}: {
  label: string;
  onChange: (direction: Direction) => void;
}) => {
  const [direction, setDirection] = useState<Direction>({ x: 0, y: 0 });
  const origin = useRef<readonly [number, number] | null>(null);
  const update = (event: PointerEvent<HTMLDivElement>) => {
    if (origin.current === null) return;
    const next = {
      x: Math.max(-1, Math.min(1, (event.clientX - origin.current[0]) / 44)),
      y: Math.max(-1, Math.min(1, (event.clientY - origin.current[1]) / 44)),
    };
    setDirection(next);
    onChange(next);
  };
  const end = () => {
    origin.current = null;
    const next = { x: 0, y: 0 };
    setDirection(next);
    onChange(next);
  };
  const knobStyle = {
    "--stick-x": `${direction.x * 32}px`,
    "--stick-y": `${direction.y * 32}px`,
  } as CSSProperties;
  return (
    <div
      className="virtual-joystick"
      role="application"
      aria-label={label}
      style={knobStyle}
      onPointerDown={(event) => {
        origin.current = [event.clientX, event.clientY];
        event.currentTarget.setPointerCapture(event.pointerId);
        update(event);
      }}
      onPointerMove={update}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <span />
    </div>
  );
};
export const OrientationSuggestion = () => (
  <div className="orientation-suggestion">Rotate to landscape for a wider view.</div>
);
export const ControlOnboarding = ({
  title,
  children,
  onDismiss,
}: {
  title: string;
  children: ReactNode;
  onDismiss: () => void;
}) => (
  <section className="onboarding" aria-label={`${title} controls`}>
    <strong>{title}</strong>
    <div>{children}</div>
    <button type="button" onClick={onDismiss}>
      Play
    </button>
  </section>
);
