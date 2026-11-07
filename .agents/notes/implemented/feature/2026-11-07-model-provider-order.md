# Agent Note: Reorder model providers

Status: implemented

English | [中文](2026-11-07-model-provider-order.zh.md)

## Problem

The Models page displayed configured providers in adapter-directory order, so users could not keep frequently used providers together or give a preferred provider the first position. Provider order is a user-interface preference, not part of an adapter's profile or model request.

## Decision

The Host registers the `ui-models` settings namespace with a `providerOrder` string-array field. The Models client binds that namespace through the shared settings scope and persists provider route ids there. An absent or empty preference leaves the directory order unchanged; saved ids order matching rows first, and unlisted rows retain their relative directory order. The preference is not filtered when a provider is absent, so a later reappearance can retain its saved position.

Configured provider cards support native drag-and-drop and labeled move-up and move-down buttons. The buttons provide keyboard operation and a live announcement identifies the new position. A failed Host write restores the order accepted by the settings mirror and announces the failure. A remote browser follows the settings scope's memory mode, so its order lasts only for that process.

The shared settings scope also observes external settings updates and carries revision ordering. This extends the Host-backed preference approach in [the web preferences decision](../bug-fix/2026-08-06-host-backed-web-preferences.md) without adding a separate browser-storage authority.

## Alternatives considered

**Persist the order in `localStorage`.** The order belongs with other user preferences and should use the existing Host settings document, which follows the user's DSH home across reloads and origins. A second browser-storage authority would diverge across ports and would not follow the existing settings invalidation path.

**Sort providers by display name or keep directory order only.** Neither preserves a user's chosen order; the adapter directory remains the source of the default and tie-breaking order, while the settings preference records only deliberate changes.

**Provide drag-and-drop without move buttons.** Native drag-and-drop is convenient for pointer users but does not provide equivalent keyboard operation. Labeled move buttons support both keyboard use and screen-reader announcements.

## Consequences

The order setting is independent of provider profiles and does not change model routing or adapter registration. New providers that have no saved rank appear after ranked rows in their directory order; removed route ids remain in the preference. Remote browsers can rearrange rows during a process but cannot persist the choice across reloads because the settings API is loopback-only.

Host schema coverage verifies the default and rejects non-string ids. Store and component coverage verifies directory fallback, saved ordering, persistence, keyboard controls, and announcements. The Models web scenario verifies that a reordered list survives a full page reload and pins the rendered list in a keyless ARIA snapshot.
