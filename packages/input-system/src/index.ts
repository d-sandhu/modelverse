import type { InputService, RawInputState, TouchPoint } from "@modelverse/world-sdk";

export type RawInputOptions = {
  onReservedAction?: (action: "escape" | "mute" | "fullscreen" | "debug") => void;
};

export const createRawInputService = (
  element: HTMLElement,
  options: RawInputOptions = {},
): InputService & { dispose: () => void } => {
  const keys = new Set<string>();
  const buttons = new Set<number>();
  const touches = new Map<number, TouchPoint>();
  const pointer = { x: 0, y: 0, deltaX: 0, deltaY: 0, isDown: false };
  let wheelDelta = 0;
  const listeners: Array<() => void> = [];
  const listen = <K extends keyof WindowEventMap>(
    target: Window | HTMLElement,
    name: K,
    handler: (event: WindowEventMap[K]) => void,
    eventOptions?: AddEventListenerOptions,
  ) => {
    target.addEventListener(name, handler as EventListener, eventOptions);
    listeners.push(() =>
      target.removeEventListener(name, handler as EventListener, eventOptions),
    );
  };
  listen(window, "keydown", (event) => {
    keys.add(event.code);
    const reserved =
      event.code === "Escape"
        ? "escape"
        : event.code === "KeyM"
          ? "mute"
          : event.code === "KeyF"
            ? "fullscreen"
            : event.code === "Backquote"
              ? "debug"
              : undefined;
    if (reserved !== undefined && !event.repeat) options.onReservedAction?.(reserved);
  });
  listen(window, "keyup", (event) => keys.delete(event.code));
  listen(window, "blur", () => {
    keys.clear();
    buttons.clear();
    touches.clear();
    pointer.isDown = false;
  });
  listen(element, "pointerdown", (event) => {
    pointer.isDown = true;
    buttons.add(event.button);
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });
  listen(window, "pointerup", (event) => {
    pointer.isDown = false;
    buttons.delete(event.button);
  });
  listen(
    window,
    "pointermove",
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.deltaX += event.movementX;
      pointer.deltaY += event.movementY;
      if (event.pointerType === "touch") {
        const previous = touches.get(event.pointerId);
        touches.set(event.pointerId, {
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          startX: previous?.startX ?? event.clientX,
          startY: previous?.startY ?? event.clientY,
        });
      }
    },
    { passive: true },
  );
  listen(element, "pointerdown", (event) => {
    if (event.pointerType === "touch")
      touches.set(event.pointerId, {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        startX: event.clientX,
        startY: event.clientY,
      });
  });
  listen(window, "pointerup", (event) => touches.delete(event.pointerId));
  listen(
    element,
    "wheel",
    (event) => {
      wheelDelta += event.deltaY;
    },
    { passive: true },
  );
  return {
    getState: (): RawInputState => ({
      keysDown: new Set(keys),
      buttonsDown: new Set(buttons),
      pointer: { ...pointer },
      touches: [...touches.values()],
      wheelDelta,
      gamepads: [...(navigator.getGamepads?.() ?? [])].filter(
        (gamepad): gamepad is Gamepad => gamepad !== null,
      ),
    }),
    consumePointerDelta: () => {
      const value = { x: pointer.deltaX, y: pointer.deltaY };
      pointer.deltaX = 0;
      pointer.deltaY = 0;
      wheelDelta = 0;
      return value;
    },
    requestPointerLock: async () => {
      await element.requestPointerLock();
    },
    releasePointerLock: () => document.exitPointerLock(),
    setCursorVisible: (visible) => {
      element.style.cursor = visible ? "auto" : "none";
    },
    dispose: () => listeners.splice(0).forEach((remove) => remove()),
  };
};
