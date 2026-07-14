# Mobile and performance

Touch is part of SDK 0.1. The platform provides a virtual joystick, drag surface, action button, safe-area layout, and onboarding primitives, but it does not prescribe one universal world control layout. Future world authors must choose controls appropriate to their mechanics. Platform UI respects safe-area insets, coarse-pointer queries, 42px minimum actions, and reduced-motion preferences. Portrait shows an orientation suggestion rather than silently breaking layout.

The quality manager starts mobile and very-high-DPR devices on low. Low uses a shader portal fallback, 1x pixel ratio, no shadows or post-processing, fewer particles, and reduced draw distance. Medium uses static previews. High permits reduced-rate live previews. Sustained-frame degradation primitives exist; measured thresholds and live render-target scheduling need real-device profiling before SDK freeze.

No real-device measurements have been recorded. Do not treat desktop emulation as mobile performance evidence.
