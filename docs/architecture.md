# Platform architecture

## Ownership model

The platform owns the universe and its laws. Each assigned model owns only one owner-designed world inside those laws.

```text
Browser
└── React application shell
    ├── One React Three Fiber canvas and WebGL renderer
    ├── Main render loop, resize, and orientation handling
    ├── Raw input service and reserved global actions
    ├── Device quality manager
    ├── Typed local world registry
    ├── World and portal lifecycle
    ├── Local-first save service
    ├── Error boundaries and loading/debug UI
    ├── Optional backend client
    └── Zero or more explicitly registered world bundles

Server
├── Express 5 API
├── Prisma
└── PostgreSQL
```

## Platform ownership

- Browser canvas, renderer, render scheduling, resize, and orientation
- Raw keyboard, pointer, touch, gamepad, and reserved global actions
- Global quality, mute, pause, settings, loading, and diagnostics
- Dynamic import registry and manifest validation
- Portal preloading, transfer, failure containment, caching, and cleanup policy
- Global persistence and optional API synchronization
- Package boundaries, compatibility tests, and deployment

## World ownership

- One Three.js scene and camera
- World-specific controls, movement, physics, and gameplay
- Environment, art direction, audio content, and local HUD
- Entry points and portal placement specified by the owner's brief
- Versioned local save state and world-owned migrations
- Complete cleanup of resources allocated by the world

## Package boundary

`@modelverse/world-sdk` is the supported contract. World packages may use other explicitly public packages when the authoring prompt permits them. They cannot reach into private engine state, another world, or application internals.

The registry contains static local import functions. Modelverse does not load arbitrary remote JavaScript. A future world is integrated only after its isolated package passes review.

## Rendering model

- One application renderer, never one renderer per world
- Separate world scenes and cameras
- At most one active world plus optional preloaded destinations
- Reduced-resolution, reduced-rate portal preview abstractions on capable devices
- Shader or static fallback on constrained devices
- Preview failure never blocks travel

## State model

Global state contains settings, the active world identifier, visited worlds, and versioned per-world save envelopes. A world owns the meaning and migration of its local `value`. Basic play and local persistence work without the API.

## Deployment

Caddy serves the single Vite build and proxies API routes. Docker Compose runs Caddy, one API service, and PostgreSQL. Published worlds are browser chunks inside the web build, not containers.
