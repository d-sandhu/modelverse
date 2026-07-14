# ADR 0001: Platform foundation

Status: accepted on 2026-07-11.

Use one browser application and WebGL renderer. Worlds are dynamically imported workspace packages with separate scenes, cameras, controls, saves, and explicit disposal. The shell owns raw input, rendering, portals, quality, persistence, and global UI. Published worlds are bundles, not containers. Basic play is local-first and never depends on the Express API.

The project owner supplies each world's creative brief. World implementation agents are isolated to one directory and do not choose product concepts or integrate themselves into the platform registry.

Live portal rendering is optional because rendering two worlds is unsafe as a baseline mobile requirement. The initial travel effect is preloading plus a short fade.
