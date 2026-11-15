export const LUMI_STATS_CSS = `
:where(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) {
  --ls-bg: var(--lumiverse-bg, #0b1120);
  --ls-surface: var(--lumiverse-bg-elevated, #131c31);
  --ls-fill: var(--lumiverse-fill-subtle, rgba(148, 163, 184, 0.06));
  --ls-fill-hover: var(--lumiverse-fill-hover, rgba(148, 163, 184, 0.12));
  --ls-glass: var(--lcs-glass-bg, color-mix(in srgb, var(--ls-surface) 92%, transparent));
  --ls-glass-border: var(--lcs-glass-border, color-mix(in srgb, var(--lumiverse-border, rgba(148, 163, 184, 0.2)) 85%, transparent));
  --ls-blur: var(--lcs-glass-blur, blur(14px));
  --ls-text: var(--lumiverse-text, #f1f5f9);
  --ls-muted: var(--lumiverse-text-muted, #94a3b8);
  --ls-dim: var(--lumiverse-text-dim, #64748b);
  --ls-primary: var(--lumiverse-primary, #38bdf8);
  --ls-accent: var(--lumiverse-accent, #818cf8);
  --ls-border: color-mix(in srgb, var(--lumiverse-border, rgba(148, 163, 184, 0.2)) 78%, transparent);
  --ls-border-hover: var(--lumiverse-border-hover, color-mix(in srgb, var(--ls-primary) 42%, var(--ls-border)));
  --ls-success: var(--lumiverse-success, #10b981);
  --ls-danger: var(--lumiverse-danger, #f43f5e);
  --ls-warning: var(--lumiverse-warning, #f59e0b);
  --ls-radius: var(--lumiverse-radius, 12px);
  --ls-glow: 0.35;
  --ls-fast: var(--lumiverse-transition-fast, 140ms ease);
  --ls-font: var(--lumiverse-font-family, system-ui, -apple-system, sans-serif);
  --ls-mono: var(--lumiverse-font-mono, ui-monospace, monospace);
}

.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay {
  color: var(--ls-text);
  font-family: var(--ls-font);
  font-size: 13px;
  line-height: 1.5;
  box-sizing: border-box;
  isolation: isolate;
}

:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) *,
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) *::before,
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) *::after {
  box-sizing: border-box;
}

.ls-svg-icon {
  flex: none;
  display: inline-block;
  vertical-align: middle;
}

.ls-root {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  background: var(--ls-surface);
  overflow: hidden;
  container-type: inline-size;
}

/* Full-Window Studio Overlay */
.ls-studio-overlay {
  position: fixed;
  inset: 0;
  width: var(--app-scaled-viewport-width, 100vw);
  height: var(--app-scaled-viewport-height, 100vh);
  background: radial-gradient(circle at 18% 0%, color-mix(in srgb, var(--ls-primary) 9%, transparent), transparent 48%), color-mix(in srgb, var(--ls-bg) 97%, transparent);
  backdrop-filter: blur(22px);
  z-index: 950;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  container-type: inline-size;
}
.ls-studio-overlay.ls-studio-in-modal {
  position: relative;
  inset: auto;
  width: 100%;
  height: 100%;
  min-height: 0;
  z-index: auto;
}
.ls-studio-topbar {
  flex: none;
  padding: 10px 20px;
  border-bottom: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-surface) 94%, transparent);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.ls-studio-workspace {
  flex: 1 1 0%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
}
@container (min-width: 980px) {
  .ls-studio-workspace {
    display: grid;
    grid-template-columns: 228px minmax(0, 1.45fr) minmax(340px, 0.85fr);
    overflow: hidden;
  }
}
.ls-studio-sidebar {
  flex: none;
  padding: 12px 10px;
  border-bottom: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 38%, var(--ls-surface));
  display: flex;
  flex-direction: row;
  gap: 5px;
  overflow-x: auto;
}
@container (min-width: 980px) {
  .ls-studio-sidebar {
    flex-direction: column;
    border-bottom: 0;
    border-right: 1px solid var(--ls-border);
    overflow-y: auto;
    overflow-x: hidden;
  }
}
.ls-studio-nav-btn {
  width: 100%;
  justify-content: flex-start !important;
  text-align: left;
  padding: 9px 12px !important;
  border-radius: calc(var(--ls-radius) - 2px) !important;
  border-color: transparent !important;
  background: transparent !important;
  display: flex !important;
  flex-direction: column;
  align-items: flex-start !important;
  gap: 2px !important;
  min-width: 165px;
}
.ls-studio-nav-btn:hover:not(:disabled) {
  background: var(--ls-fill) !important;
}
.ls-studio-nav-btn[aria-current="page"] {
  background: color-mix(in srgb, var(--ls-primary) 14%, transparent) !important;
  border-color: color-mix(in srgb, var(--ls-primary) 38%, transparent) !important;
  color: var(--ls-text) !important;
}
@container (min-width: 980px) {
  .ls-studio-nav-btn {
    min-width: 0;
  }
}
.ls-studio-nav-title {
  font-size: 12.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 7px;
}
.ls-studio-nav-sub {
  font-size: 11px;
  font-weight: 450;
  color: var(--ls-muted);
}
.ls-studio-pane {
  flex: none;
  padding: 18px 20px calc(22px + var(--ls-kb-inset, 0px));
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ls-studio-preview-pane {
  flex: none;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
@container (min-width: 980px) {
  .ls-studio-pane {
    height: 100%;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: thin;
  }
  .ls-studio-preview-pane {
    height: 100%;
    min-height: 0;
    overflow-y: auto;
    padding: 18px 18px 18px 0;
    scrollbar-width: thin;
  }
}
.ls-hero-banner {
  padding: 14px 16px;
  border-radius: var(--ls-radius);
  border: 1px solid color-mix(in srgb, var(--ls-primary) 26%, var(--ls-border));
  background: linear-gradient(135deg, color-mix(in srgb, var(--ls-primary) 9%, var(--ls-surface)), var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ls-preset-card {
  padding: 13px 14px;
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-border);
  background: var(--ls-fill);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  transition: border-color var(--ls-fast), background var(--ls-fast), transform var(--ls-fast);
}
.ls-preset-card:hover {
  border-color: var(--ls-border-hover);
  background: var(--ls-fill-hover);
  transform: translateY(-1px);
}
.ls-preset-card[data-active="true"] {
  border-color: color-mix(in srgb, var(--ls-primary) 65%, var(--ls-border));
  background: color-mix(in srgb, var(--ls-primary) 8%, var(--ls-surface));
}
.ls-subnav-pills {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: calc(var(--ls-radius) - 2px);
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 42%, var(--ls-surface));
  flex-wrap: wrap;
}
.ls-quick-pill {
  border-style: dashed !important;
  font-size: 11.5px !important;
}

/* Typography */
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) h2 {
  font-size: 17px;
  font-weight: 750;
  letter-spacing: -0.02em;
  margin: 0 0 4px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) h3 {
  font-size: 13.5px;
  font-weight: 700;
  margin: 0 0 4px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) p {
  margin: 3px 0;
  overflow-wrap: anywhere;
}
.ls-kicker {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--ls-muted);
}
.ls-muted {
  color: var(--ls-muted);
  font-size: 12px;
}

/* Tactile Controls */
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) :is(button, input, select, textarea) {
  font: inherit;
  color: inherit;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) button {
  min-height: 32px;
  padding: 5px 10px;
  border-radius: calc(var(--ls-radius) - 4px);
  border: 1px solid var(--ls-border);
  background: var(--ls-fill);
  color: var(--ls-text);
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  transition: background var(--ls-fast), border-color var(--ls-fast), transform var(--ls-fast);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) button:hover:not(:disabled) {
  background: var(--ls-fill-hover);
  border-color: var(--ls-border-hover);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) button:active:not(:disabled) {
  transform: translateY(1px);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) :is(button[aria-current="page"], button[aria-pressed="true"], .ls-btn-primary) {
  background: color-mix(in srgb, var(--ls-primary) 18%, var(--ls-surface));
  color: var(--ls-text);
  border-color: color-mix(in srgb, var(--ls-primary) 58%, var(--ls-border));
  font-weight: 700;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) .ls-btn-primary {
  background: var(--ls-primary);
  color: var(--lumiverse-primary-contrast, #04131d);
  border-color: var(--ls-primary);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) .ls-btn-sm {
  min-height: 26px;
  padding: 3px 8px;
  font-size: 11px;
  border-radius: 7px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) .ls-btn-icon {
  min-width: 26px;
  min-height: 26px;
  padding: 4px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) .ls-btn-ghost {
  background: transparent;
  border-color: transparent;
  color: var(--ls-muted);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) .ls-btn-ghost:hover:not(:disabled) {
  background: var(--ls-fill-hover);
  color: var(--ls-text);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay) .ls-btn-danger:hover:not(:disabled) {
  border-color: var(--ls-danger);
  color: var(--ls-danger);
}

.ls-input {
  display: block;
  width: 100%;
  min-height: 34px;
  padding: 6px 10px;
  border-radius: calc(var(--ls-radius) - 4px);
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 55%, var(--ls-surface));
  color: var(--ls-text);
  font-size: 12.5px;
}
.ls-input:focus {
  outline: none;
  border-color: var(--ls-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--ls-primary) 20%, transparent);
}
select.ls-input, .ls-select {
  cursor: pointer;
}
select.ls-input option, .ls-select option {
  background-color: var(--lumiverse-bg-elevated, var(--ls-surface));
  color: var(--ls-text);
}
textarea.ls-input {
  min-height: 68px;
  resize: vertical;
}
.ls-label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ls-muted);
  margin-bottom: 10px;
}

/* Layout Containers */
.ls-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.ls-row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.ls-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: 8px;
}

/* Game Skins, Frame Shapes, Blur & Density */
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="sleek"] {
  color-scheme: dark;
  --ls-bg: #080c15;
  --ls-glass: #0d1322;
  --ls-surface: #11192c;
  --ls-text: #f1f5f9;
  --ls-muted: #94a3b8;
  --ls-fill: rgba(255, 255, 255, 0.045);
  --ls-fill-hover: rgba(255, 255, 255, 0.09);
  --ls-glass-border: rgba(148, 163, 184, 0.18);
  --ls-border: rgba(148, 163, 184, 0.16);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="minimal"] {
  --ls-glass: var(--lumiverse-bg, #0b1120);
  --ls-glass-border: var(--lumiverse-border, rgba(148, 163, 184, 0.16));
  --ls-blur: none;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="soft"] {
  --ls-glass: var(--lumiverse-bg-elevated, var(--ls-surface));
  --ls-glass-border: color-mix(in srgb, var(--ls-primary) 18%, var(--ls-border));
  --ls-blur: none;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="neon"] {
  color-scheme: dark;
  --ls-bg: #050812;
  --ls-glass: rgba(10, 15, 30, 0.92);
  --ls-surface: #0d1428;
  --ls-text: #f8fafc;
  --ls-muted: #94a3b8;
  --ls-glass-border: color-mix(in srgb, var(--ls-primary) 42%, rgba(148, 163, 184, 0.2));
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="arcane_rpg"] {
  color-scheme: dark;
  --ls-bg: #0e0c0a;
  --ls-surface: #181411;
  --ls-glass: linear-gradient(160deg, rgba(28, 23, 18, 0.96), rgba(14, 12, 10, 0.96));
  --ls-text: #fef3c7;
  --ls-muted: #d6c5a3;
  --ls-primary: #f59e0b;
  --ls-accent: #38bdf8;
  --ls-fill: rgba(245, 158, 11, 0.06);
  --ls-fill-hover: rgba(245, 158, 11, 0.12);
  --ls-border: rgba(245, 158, 11, 0.2);
  --ls-glass-border: rgba(245, 158, 11, 0.34);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="cyber_hud"] {
  color-scheme: dark;
  --ls-bg: #040814;
  --ls-surface: #091224;
  --ls-glass:
    repeating-linear-gradient(0deg, rgba(56, 189, 248, 0.025) 0 1px, transparent 1px 4px),
    linear-gradient(145deg, rgba(7, 15, 32, 0.94), rgba(4, 9, 20, 0.96));
  --ls-text: #e0f2fe;
  --ls-muted: #7dd3fc;
  --ls-fill: rgba(56, 189, 248, 0.06);
  --ls-fill-hover: rgba(56, 189, 248, 0.13);
  --ls-border: rgba(56, 189, 248, 0.22);
  --ls-glass-border: color-mix(in srgb, var(--ls-primary) 48%, transparent);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="persona_pop"] {
  color-scheme: dark;
  --ls-bg: #0f070a;
  --ls-surface: #1b0c12;
  --ls-glass: linear-gradient(155deg, rgba(28, 11, 18, 0.96), rgba(13, 6, 10, 0.97));
  --ls-text: #fff1f2;
  --ls-muted: #fda4af;
  --ls-primary: #f43f5e;
  --ls-accent: #facc15;
  --ls-fill: rgba(244, 63, 94, 0.08);
  --ls-fill-hover: rgba(244, 63, 94, 0.16);
  --ls-border: rgba(255, 255, 255, 0.18);
  --ls-glass-border: rgba(244, 63, 94, 0.56);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-style="cozy_vn"] {
  --ls-glass: linear-gradient(160deg, color-mix(in srgb, var(--ls-surface) 94%, var(--ls-primary) 6%), var(--ls-surface));
  --ls-glass-border: color-mix(in srgb, var(--ls-primary) 26%, var(--ls-border));
}

:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-frame="sharp"] {
  --ls-radius: 3px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-frame="rounded"] {
  --ls-radius: 14px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-frame="chamfered"] {
  --ls-radius: 4px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-frame="chamfered"] :is(.ls-hud, .ls-inline-card, .ls-card) {
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-frame="ornate"] :is(.ls-hud, .ls-inline-card, .ls-card) {
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--ls-primary) 20%, transparent),
    0 6px 24px rgba(0, 0, 0, 0.35);
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-blur="false"] {
  --ls-blur: none;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-compact="true"] {
  font-size: 12px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-compact="true"] .ls-card {
  padding: 9px 11px;
  gap: 6px;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-compact="true"] .ls-stat-cell {
  padding: 7px 9px;
  gap: 4px;
}

.ls-card {
  padding: 12px 14px;
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-glass-border);
  background: var(--ls-glass);
  backdrop-filter: var(--ls-blur);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Chips & Delta Badges */
.ls-chip {
  display: inline-flex;
  align-items: center;
  gap: 4.5px;
  padding: 2.5px 8.5px;
  border-radius: 999px;
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-fill) 90%, transparent);
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  max-width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ls-chip-accent {
  border-color: color-mix(in srgb, var(--ls-primary) 45%, var(--ls-border));
  background: color-mix(in srgb, var(--ls-primary) 13%, var(--ls-surface));
  color: var(--ls-text);
}
.ls-presence-pill {
  cursor: pointer;
  user-select: none;
}
.ls-delta {
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.ls-delta.is-pos {
  color: var(--ls-success);
  background: color-mix(in srgb, var(--ls-success) 15%, transparent);
}
.ls-delta.is-neg {
  color: var(--ls-danger);
  background: color-mix(in srgb, var(--ls-danger) 15%, transparent);
}

/* Drawer Layout */
.ls-drawer-head {
  padding: 10px 14px;
  border-bottom: 1px solid var(--ls-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex: none;
}
.ls-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 750;
}
.ls-brand-mark {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: color-mix(in srgb, var(--ls-primary) 16%, transparent);
  border: 1px solid color-mix(in srgb, var(--ls-primary) 65%, transparent);
  color: var(--ls-primary);
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
}
.ls-drawer-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-bottom: 1px solid var(--ls-border);
  overflow-x: auto;
  scrollbar-width: none;
  flex: none;
}
.ls-drawer-nav::-webkit-scrollbar {
  display: none;
}
.ls-drawer-nav > button {
  flex: 1 0 auto;
  white-space: nowrap;
}
.ls-drawer-body {
  flex: 1 1 0%;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 14px calc(14px + var(--ls-kb-inset, 0px));
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: thin;
}
.ls-status-bar {
  padding: 6px 14px;
  border-top: 1px solid var(--ls-border);
  font-size: 11.5px;
  color: var(--ls-muted);
  flex: none;
}
.ls-status-bar:empty {
  display: none;
}
.ls-status-bar[data-error="true"] {
  color: var(--ls-danger);
}

/* Stat Cells, Compact Rows, Bipolar Bars & Clocks */
.ls-stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 170px), 1fr));
  gap: 8px;
  align-items: start;
}
.ls-stat-cell[data-span="full"] {
  grid-column: 1 / -1;
}
.ls-stat-row-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  border-radius: calc(var(--ls-radius) - 4px);
  border: 1px solid var(--ls-border);
  background: var(--ls-fill);
  transition: border-color var(--ls-fast), background var(--ls-fast);
}
.ls-stat-row-compact:hover {
  border-color: var(--ls-border-hover);
  background: var(--ls-fill-hover);
}
.ls-feed-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 2px;
}
.ls-feed-card {
  padding: 6px 9px;
  border-radius: 8px;
  border-left: 2px solid color-mix(in srgb, var(--ls-primary) 55%, transparent);
  background: color-mix(in srgb, var(--ls-bg) 38%, transparent);
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ls-feed-subject {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--ls-primary);
  display: flex;
  align-items: center;
  gap: 5px;
}
.ls-step-chain {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
}
.ls-step-strip {
  padding: 5px 7px;
  border-radius: 7px;
  background: color-mix(in srgb, var(--ls-bg) 30%, transparent);
}
.ls-step-node {
  display: inline-flex;
  align-items: center;
  padding: 2.5px 7.5px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--ls-fill) 115%, transparent);
  font-size: 11.5px;
  line-height: 1.35;
  color: var(--ls-text);
}
.ls-step-node:last-child {
  background: color-mix(in srgb, var(--ls-primary) 13%, var(--ls-surface));
  font-weight: 600;
}
.ls-step-arrow {
  color: var(--ls-muted);
  font-size: 11px;
  font-weight: 700;
  user-select: none;
}
.ls-kv-grid {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 2px;
}
.ls-kv-row {
  display: grid;
  grid-template-columns: minmax(76px, 28%) minmax(0, 1fr);
  gap: 8px;
  align-items: baseline;
  padding: 4px 7px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--ls-bg) 32%, transparent);
}
.ls-kv-key {
  font-size: 10.5px;
  font-weight: 700;
  color: var(--ls-primary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  overflow-wrap: anywhere;
}
.ls-kv-val {
  font-size: 12px;
  color: var(--ls-text);
  overflow-wrap: anywhere;
}
.ls-stat-cell {
  padding: 9px 11px;
  border-radius: calc(var(--ls-radius) - 3px);
  border: 1px solid var(--ls-border);
  border-left: 2.5px solid var(--ls-bar-color, var(--ls-border));
  background: var(--ls-fill);
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
  transition: border-color var(--ls-fast), background var(--ls-fast);
}
.ls-stat-cell:hover {
  border-color: var(--ls-border-hover);
}
.ls-stat-cell[data-locked="true"] {
  border-style: dashed;
}
.ls-stat-cell[data-uncalibrated="true"] {
  opacity: 0.78;
}
.ls-bar-track {
  position: relative;
  height: 7px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ls-text) 11%, transparent);
  overflow: hidden;
}
.ls-bar-track[data-bipolar="true"]::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1.5px;
  background: color-mix(in srgb, var(--ls-text) 40%, transparent);
}
.ls-bar-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--ls-bar-color, var(--ls-primary)) 82%, #000),
    var(--ls-bar-color, var(--ls-primary))
  );
  transition: width 0.26s cubic-bezier(0.22, 1, 0.36, 1), margin-left 0.26s ease;
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-meter="segmented"] .ls-bar-fill {
  background: repeating-linear-gradient(
    90deg,
    var(--ls-bar-color, var(--ls-primary)) 0 9px,
    transparent 9px 11px
  );
}
:is(.ls-root, .ls-inline-host, .ls-hud, .ls-studio-overlay)[data-ls-meter="glow"] .ls-bar-fill {
  background: linear-gradient(
    90deg,
    var(--ls-bar-color, var(--ls-primary)),
    color-mix(in srgb, var(--ls-bar-color, var(--ls-primary)) 60%, #ffffff)
  );
  box-shadow: 0 0 calc(12px * var(--ls-glow, 0.45)) color-mix(in srgb, var(--ls-bar-color, var(--ls-primary)) 70%, transparent);
}
.ls-clock-bar {
  display: grid;
  gap: 4px;
  width: 100%;
}
.ls-clock-seg {
  height: 7px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--ls-text) 13%, transparent);
  cursor: pointer;
  transition: background var(--ls-fast);
}
.ls-clock-seg.is-filled {
  background: var(--ls-primary);
}

/* Inline Message Ribbon & Floating HUD */
.ls-calibrating-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 8px 0 2px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--ls-muted);
  background: color-mix(in srgb, var(--ls-primary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--ls-primary) 28%, transparent);
  border-radius: 999px;
}
.ls-calibrating-pill::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ls-primary);
  animation: ls-calibrating-pulse 1.2s ease-in-out infinite;
}
@keyframes ls-calibrating-pulse {
  0%, 100% { opacity: 0.35; transform: scale(0.85); }
  50% { opacity: 1; transform: scale(1.12); }
}
.ls-inline-host {
  width: 100%;
  margin: 8px 0 4px;
}
.ls-inline-card {
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-glass-border);
  border-top: 2px solid color-mix(in srgb, var(--ls-primary) 75%, transparent);
  background: var(--ls-glass);
  backdrop-filter: var(--ls-blur);
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ls-inline-pill-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  min-height: 34px;
}
.ls-hud {
  position: relative;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-glass-border);
  border-top: 2px solid color-mix(in srgb, var(--ls-primary) 80%, transparent);
  background: var(--ls-glass);
  backdrop-filter: var(--ls-blur);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.34),
    0 0 calc(20px * var(--ls-glow, 0.35)) color-mix(in srgb, var(--ls-primary) 12%, transparent);
}
.ls-hud-pill {
  padding: 7px 11px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  height: 100%;
  cursor: pointer;
  background: linear-gradient(135deg, color-mix(in srgb, var(--ls-primary) 7%, transparent), transparent 65%);
}
.ls-hud-pill[data-empty-deck="true"] {
  gap: 0;
}
.ls-hud-pill[data-pill-skin="split_deck"][data-empty-deck="true"] .ls-pill-top-deck {
  border-bottom: 0;
}
.ls-game-pill-main {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 0 0 auto;
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.ls-inline-pill-bar > .ls-game-pill-main {
  flex: 1 1 0%;
  width: auto;
}
.ls-game-pill-main::-webkit-scrollbar {
  display: none;
}
.ls-avatar-stack {
  display: inline-flex;
  align-items: center;
  flex: none;
}
.ls-avatar-stack-item {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid var(--ls-surface);
  background: color-mix(in srgb, var(--ls-primary) 22%, var(--ls-bg));
  color: var(--ls-text);
  font-size: 9px;
  font-weight: 800;
  display: grid;
  place-items: center;
  overflow: hidden;
  margin-left: -5px;
}
.ls-avatar-stack-item:first-child {
  margin-left: 0;
}
.ls-avatar-stack-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ls-pill-gauge {
  flex: none;
  min-width: 82px;
  max-width: 126px;
  padding: 2.5px 7px;
  border-radius: 7px;
  border: 1px solid color-mix(in srgb, var(--ls-bar-color, var(--ls-primary)) 30%, var(--ls-border));
  background: color-mix(in srgb, var(--ls-bg) 45%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ls-pill-gauge-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-size: 10px;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ls-pill-gauge-track {
  height: 3.5px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ls-text) 13%, transparent);
  overflow: hidden;
}
.ls-hud-header-bar {
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 7px 10px 6px;
  border-bottom: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 28%, transparent);
}
.ls-hud-top-row,
.ls-pill-top-deck {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap !important;
  gap: 6px;
  min-width: 0;
  width: 100%;
}
.ls-hud-title-badge {
  display: inline-flex;
  align-items: center;
  flex: 1 1 0%;
  gap: 6px;
  font-size: 12px;
  font-weight: 750;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ls-pill-actions,
.ls-hud-top-row > .ls-row {
  flex: none;
  flex-wrap: nowrap !important;
}
.ls-hud-tabs-scroll {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}
.ls-hud-tabs-scroll::-webkit-scrollbar {
  display: none;
}
.ls-hud-tabs-scroll > button {
  flex: none;
  white-space: nowrap;
}
.ls-hud-tab-icon-only {
  min-width: 32px !important;
  padding: 4px 8px !important;
  font-size: 13px !important;
}
.ls-hud-content {
  flex: 1 1 0%;
  min-height: 0;
  overflow-y: auto;
  padding: 10px 12px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scrollbar-width: thin;
}
.ls-hud-resize-grip {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 18px;
  height: 18px;
  z-index: 25;
  cursor: nwse-resize;
  display: grid;
  place-items: center;
  font-size: 11px;
  color: var(--ls-muted);
  opacity: 0.65;
  user-select: none;
  touch-action: none;
  border-radius: 4px;
}
.ls-hud-resize-grip:hover {
  opacity: 1;
  color: var(--ls-primary);
  background: var(--ls-fill-hover);
}
.ls-color-swatch {
  width: 22px;
  height: 22px;
  min-height: 22px !important;
  padding: 0 !important;
  border-radius: 50% !important;
  border: 2px solid var(--ls-border) !important;
}
.ls-color-swatch[aria-pressed="true"] {
  border-color: var(--ls-text) !important;
  box-shadow: 0 0 0 2px var(--ls-primary);
}

/* Cast Icon Roster (In Scene / Away) */
.ls-roster-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ls-roster-strip {
  display: flex;
  align-items: stretch;
  gap: 6px;
  overflow-x: auto;
  padding: 2px 2px 4px;
  scrollbar-width: thin;
}
.ls-roster-icon-btn {
  flex: none;
  min-width: 62px;
  max-width: 80px;
  padding: 6px 8px !important;
  border-radius: calc(var(--ls-radius) - 2px) !important;
  border: 1px solid var(--ls-border) !important;
  background: var(--ls-fill) !important;
  color: var(--ls-text) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 4px !important;
}
.ls-roster-icon-btn:hover {
  border-color: var(--ls-border-hover) !important;
  background: var(--ls-fill-hover) !important;
  transform: translateY(-1px);
}
.ls-roster-icon-btn[aria-pressed="true"] {
  border-color: color-mix(in srgb, var(--ls-primary) 70%, var(--ls-border)) !important;
  background: color-mix(in srgb, var(--ls-primary) 13%, var(--ls-surface)) !important;
}
.ls-roster-avatar {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--ls-primary) 15%, var(--ls-bg));
  border: 1.5px solid var(--ls-border);
  display: grid;
  place-items: center;
  font-size: 12.5px;
  font-weight: 800;
  color: var(--ls-primary);
}
.ls-roster-icon-btn[aria-pressed="true"] .ls-roster-avatar {
  border-color: var(--ls-primary);
}
.ls-roster-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.ls-roster-dot {
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--ls-surface);
}
.ls-roster-dot.is-present {
  background: var(--ls-success);
}
.ls-roster-dot.is-away {
  background: var(--ls-dim);
}
.ls-roster-name {
  font-size: 11px;
  font-weight: 650;
  max-width: 72px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* RPG Mechanics & Game Widgets */
.ls-rpg-skill-wrap,
.ls-rpg-xp-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ls-rpg-sp-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2.5px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 750;
  background: color-mix(in srgb, var(--ls-warning) 16%, transparent);
  border: 1px solid color-mix(in srgb, var(--ls-warning) 40%, var(--ls-border));
}
.ls-rpg-skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 185px), 1fr));
  gap: 6px;
}
.ls-rpg-skill-node {
  padding: 7px 9px;
  border-radius: 8px;
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 35%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ls-rpg-skill-node[data-unlocked="true"] {
  border-color: color-mix(in srgb, var(--ls-primary) 45%, var(--ls-border));
}
.ls-rpg-skill-node[data-maxed="true"] {
  border-color: color-mix(in srgb, var(--ls-warning) 55%, var(--ls-border));
  background: color-mix(in srgb, var(--ls-warning) 8%, var(--ls-surface));
}
.ls-rpg-skill-node[data-locked-req="true"] {
  opacity: 0.65;
  border-style: dashed;
}
.ls-rpg-level-crest {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  background: var(--ls-primary);
  color: var(--lumiverse-primary-contrast, #04131d);
}
.ls-rpg-xp-track {
  height: 9px;
}
.ls-rpg-attr-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(72px, 1fr));
  gap: 6px;
}
.ls-rpg-attr-cell {
  padding: 6px 8px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--ls-bg) 35%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1px;
}
.ls-rpg-attr-val {
  font-size: 15px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--ls-primary);
}
.ls-rpg-radar-box {
  display: grid;
  place-items: center;
  padding: 4px;
}
.ls-rpg-radar-svg {
  width: 100%;
  max-width: 230px;
  height: auto;
  color: var(--ls-text);
}
.ls-rpg-loot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 165px), 1fr));
  gap: 6px;
}
.ls-rpg-loot-card {
  padding: 6px 8px;
  border-radius: 8px;
  border-left: 2.5px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 35%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ls-rpg-loot-card[data-rarity="uncommon"] { border-left-color: #10b981; }
.ls-rpg-loot-card[data-rarity="rare"] { border-left-color: #38bdf8; }
.ls-rpg-loot-card[data-rarity="epic"] { border-left-color: #a855f7; }
.ls-rpg-loot-card[data-rarity="legendary"] {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), var(--ls-surface));
}
.ls-rpg-fx-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 650;
  border: 1px solid var(--ls-border);
  background: var(--ls-fill);
}
.ls-rpg-fx-pill[data-fx-kind="buff"] {
  border-color: color-mix(in srgb, var(--ls-success) 45%, transparent);
  background: color-mix(in srgb, var(--ls-success) 13%, transparent);
  color: var(--ls-success);
}
.ls-rpg-fx-pill[data-fx-kind="debuff"] {
  border-color: color-mix(in srgb, var(--ls-danger) 45%, transparent);
  background: color-mix(in srgb, var(--ls-danger) 13%, transparent);
  color: var(--ls-danger);
}
.ls-rpg-heart-btn {
  min-width: 24px !important;
  min-height: 24px !important;
  padding: 1px !important;
  border: 0 !important;
  background: transparent !important;
  font-size: 13px !important;
}
.ls-rpg-currency-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 2px;
}
.ls-rpg-currency-val {
  font-size: 14.5px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

/* Showcase Character Dossier & Spatial Map */
.ls-thought-box {
  padding: 8px 11px;
  border-radius: 8px;
  border-left: 2.5px solid var(--ls-primary);
  background: var(--ls-fill);
  font-size: 12px;
  font-style: italic;
}
.ls-dossier-shell {
  display: grid;
  grid-template-columns: 1fr;
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-border);
  background: var(--ls-surface);
  overflow: hidden;
  min-height: 400px;
}
@container (min-width: 560px) {
  .ls-dossier-shell:not([data-no-portrait="true"]) {
    grid-template-columns: minmax(210px, 33%) minmax(0, 1fr);
  }
}
.ls-dossier-shell[data-no-portrait="true"] {
  min-height: 0;
}
.ls-dossier-compact-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding: 11px 13px;
  border-radius: calc(var(--ls-radius) - 2px);
  border: 1px solid color-mix(in srgb, var(--ls-primary) 28%, var(--ls-border));
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--ls-primary) 11%, var(--ls-bg)),
    color-mix(in srgb, var(--ls-surface) 94%, var(--ls-bg))
  );
}
.ls-dossier-compact-hero h2 {
  margin: 0;
  font-size: 16px;
}
.ls-dossier-monogram {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: color-mix(in srgb, var(--ls-primary) 16%, var(--ls-surface));
  border: 1px solid color-mix(in srgb, var(--ls-primary) 45%, var(--ls-border));
  color: var(--ls-primary);
  display: grid;
  place-items: center;
  font-size: 14px;
  font-weight: 800;
  flex: none;
}
.ls-cast-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--ls-primary) 14%, var(--ls-bg));
  border: 1px solid color-mix(in srgb, var(--ls-primary) 35%, var(--ls-border));
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  color: var(--ls-primary);
  overflow: hidden;
  flex: none;
}
.ls-cast-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ls-cast-mini-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 6px;
}
.ls-cast-mini-meter {
  padding: 6px 8px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--ls-bg) 34%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ls-dossier-rail {
  position: relative;
  min-height: 290px;
  background: radial-gradient(circle at 50% 25%, color-mix(in srgb, var(--ls-primary) 18%, transparent), transparent 70%), var(--ls-bg);
  border-bottom: 1px solid var(--ls-border);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}
@container (min-width: 560px) {
  .ls-dossier-rail {
    border-bottom: 0;
    border-right: 1px solid var(--ls-border);
  }
}
.ls-dossier-portrait {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}
.ls-dossier-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 15%;
}
.ls-dossier-initial {
  font-size: 60px;
  font-weight: 800;
  color: var(--ls-muted);
}
.ls-dossier-overlay {
  position: relative;
  z-index: 2;
  padding: 36px 14px 12px;
  background: linear-gradient(0deg, rgba(8, 12, 21, 0.94) 15%, rgba(8, 12, 21, 0.55) 70%, transparent 100%);
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ls-dossier-main {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  overflow-y: auto;
}
.ls-map-viewport {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 270px;
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-border);
  background:
    radial-gradient(rgba(148, 163, 184, 0.14) 1px, transparent 1px),
    radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--ls-primary) 8%, transparent), transparent 55%),
    var(--ls-bg);
  background-size: 18px 18px, 100% 100%, 100% 100%;
  overflow: hidden;
  user-select: none;
}
.ls-mz-zone-box {
  position: absolute;
  border-radius: calc(var(--ls-radius) - 2px);
  border: 1px solid color-mix(in srgb, var(--ls-zone-color, var(--ls-border)) 42%, transparent);
  background: color-mix(in srgb, var(--ls-zone-color, var(--ls-surface)) 6%, var(--ls-surface) 86%);
  backdrop-filter: blur(6px);
  z-index: 1;
  overflow: hidden;
}
.ls-mz-zone-box[data-has-current="true"] {
  border-color: color-mix(in srgb, var(--ls-zone-color, var(--ls-primary)) 75%, transparent);
}
.ls-mz-zone-head {
  width: 100%;
  min-height: 26px !important;
  padding: 3px 9px !important;
  border: 0 !important;
  border-bottom: 1px solid color-mix(in srgb, var(--ls-zone-color, var(--ls-border)) 28%, transparent) !important;
  border-radius: 0 !important;
  background: color-mix(in srgb, var(--ls-zone-color, var(--ls-primary)) 12%, transparent) !important;
  color: var(--ls-text) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  cursor: pointer;
}
.ls-mz-node-tile {
  position: absolute;
  transform: translate(-50%, -50%);
  min-width: 96px;
  max-width: 164px;
  padding: 5px 9px !important;
  min-height: 30px !important;
  border-radius: 8px !important;
  border: 1px solid var(--ls-border) !important;
  background: color-mix(in srgb, var(--ls-bg) 82%, var(--ls-surface)) !important;
  color: var(--ls-text) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 2px !important;
  z-index: 4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.ls-mz-node-tile[data-current="true"] {
  border-color: var(--ls-primary) !important;
  background: color-mix(in srgb, var(--ls-primary) 18%, var(--ls-surface)) !important;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--ls-primary) 28%, transparent), 0 6px 14px rgba(0, 0, 0, 0.38);
}
.ls-mz-node-tile[data-selected="true"]:not([data-current="true"]) {
  border-color: var(--ls-accent) !important;
}
.ls-mz-node-title {
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 148px;
}
.ls-mz-node-avatars {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.ls-mz-mini-av {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--ls-primary);
  background: var(--ls-surface);
  font-size: 8px;
  font-weight: 800;
  display: grid;
  place-items: center;
  overflow: hidden;
}
.ls-mz-mini-av img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ls-mz-edge-pill {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 1px 6px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ls-bg) 92%, var(--ls-surface));
  border: 1px solid var(--ls-border);
  font-size: 9.5px;
  font-weight: 650;
  color: var(--ls-muted);
  white-space: nowrap;
  pointer-events: none;
  z-index: 3;
}
.ls-mz-edge-pill[data-route="true"] {
  border-color: var(--ls-primary);
  color: var(--ls-text);
}
.ls-mz-ft-card {
  padding: 8px 10px;
  border-radius: calc(var(--ls-radius) - 2px);
  border: 1px solid var(--ls-border);
  background: var(--ls-fill);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.ls-mz-ft-card[data-current="true"] {
  border-color: var(--ls-primary);
  background: color-mix(in srgb, var(--ls-primary) 10%, var(--ls-surface));
}
.ls-mz-ft-thumb {
  width: 54px;
  height: 42px;
  border-radius: 7px;
  border: 1px solid var(--ls-border);
  background: var(--ls-bg);
  overflow: hidden;
  display: grid;
  place-items: center;
  flex: none;
  font-size: 18px;
}
.ls-mz-ft-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Visual Novel Affinity Constellation & Bond Web */
.ls-web-legend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
  padding: 5px 9px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--ls-bg) 40%, var(--ls-surface));
  font-size: 10.5px;
}
.ls-web-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--ls-muted);
  font-weight: 600;
}
.ls-web-swatch {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.ls-bw-stage {
  position: relative;
  width: 100%;
  min-height: 290px;
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-border);
  background:
    radial-gradient(circle at 50% 48%, color-mix(in srgb, var(--ls-primary) 10%, transparent), transparent 68%),
    var(--ls-bg);
  overflow: hidden;
  user-select: none;
}
.ls-bw-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.ls-bw-node {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  background: transparent !important;
  border: 0 !important;
  padding: 2px !important;
  cursor: pointer;
  z-index: 4;
}
.ls-bw-node:hover {
  transform: translate(-50%, -50%) scale(1.06) !important;
}
.ls-bw-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--ls-surface);
  border: 2px solid var(--ls-bond-color, var(--ls-border));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 800;
  color: var(--ls-text);
}
.ls-bw-node[data-focal="true"] .ls-bw-avatar {
  width: 46px;
  height: 46px;
  border-width: 2.5px;
  border-color: var(--ls-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ls-primary) 22%, transparent), 0 6px 16px rgba(0, 0, 0, 0.45);
}
.ls-bw-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.ls-bw-name {
  padding: 1.5px 7px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ls-bg) 92%, var(--ls-surface));
  border: 1px solid var(--ls-border);
  font-size: 10.5px;
  font-weight: 700;
  color: var(--ls-text);
  white-space: nowrap;
  max-width: 115px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ls-bw-node[data-focal="true"] .ls-bw-name {
  border-color: var(--ls-primary);
}
.ls-bw-edge-pill {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 2px 7px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ls-bg) 94%, var(--ls-surface));
  border: 1px solid var(--ls-bond-color, var(--ls-border));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  font-size: 10px;
  line-height: 1.3;
  color: var(--ls-text);
  z-index: 3;
  max-width: 132px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  cursor: pointer;
}
.ls-bw-edge-pill:hover {
  z-index: 6;
  border-color: var(--ls-primary);
}
.ls-bw-edge-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ls-bw-pair-card {
  padding: 9px 11px;
  border-radius: calc(var(--ls-radius) - 2px);
  border: 1px solid var(--ls-border);
  border-left: 3px solid var(--ls-bond-color, var(--ls-primary));
  background: var(--ls-fill);
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.ls-bw-two-col {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 185px), 1fr));
  gap: 7px;
}
.ls-bw-dir-box {
  padding: 7px 9px;
  border-radius: 7px;
  background: color-mix(in srgb, var(--ls-bg) 34%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ls-bw-cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1.5px 7.5px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 700;
  border: 1px solid color-mix(in srgb, var(--ls-bond-color, var(--ls-border)) 50%, transparent);
  background: color-mix(in srgb, var(--ls-bond-color, var(--ls-primary)) 14%, transparent);
  color: var(--ls-text);
}

/* 2D Visual Novel Fullscreen Stage & Procedural Weather */
.ls-vn-stage {
  position: fixed;
  inset: 0;
  width: var(--app-scaled-viewport-width, 100vw);
  height: var(--app-scaled-viewport-height, 100vh);
  background: radial-gradient(circle at 50% 30%, #172038, #060913 78%);
  color-scheme: dark;
  --ls-bg: #070b14;
  --ls-surface: #0f1626;
  --ls-text: #f8fafc;
  --ls-muted: #94a3b8;
  --ls-glass: rgba(15, 23, 42, 0.85);
  z-index: 940;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  user-select: none;
}
.ls-vn-bg-stack {
  position: absolute;
  inset: -3%;
  z-index: 1;
  pointer-events: none;
  transition: translate 120ms linear;
}
.ls-vn-bg-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(var(--ls-vn-amb-bri, 0.96)) saturate(var(--ls-vn-amb-sat, 1.02));
}
.ls-vn-bg-base {
  background-image: radial-gradient(circle at 50% 28%, rgba(56, 189, 248, 0.22), rgba(15, 23, 42, 0.92) 62%, #050811 100%);
}
.ls-vn-bg-front {
  opacity: 0;
  transition: none;
}
.ls-vn-bg-stack[data-bg-tr="wipe"] .ls-vn-bg-front {
  opacity: 1;
  clip-path: inset(0 100% 0 0);
}
.ls-vn-bg-stack[data-bg-tr="iris"] .ls-vn-bg-front {
  opacity: 1;
  clip-path: circle(0% at 50% 50%);
}
.ls-vn-bg-front.is-active {
  opacity: 1;
  transition: opacity 760ms ease, clip-path 760ms cubic-bezier(0.22, 1, 0.36, 1);
}
.ls-vn-bg-stack[data-bg-tr="wipe"] .ls-vn-bg-front.is-active {
  clip-path: inset(0 0 0 0);
}
.ls-vn-bg-stack[data-bg-tr="iris"] .ls-vn-bg-front.is-active {
  clip-path: circle(145% at 50% 50%);
}
.ls-vn-bg-strips {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.ls-vn-bg-strip {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transform: translateX(var(--strip-from, -115%));
  transition: transform 680ms cubic-bezier(0.22, 1, 0.36, 1) var(--strip-delay, 0ms);
}
.ls-vn-bg-strips.is-active .ls-vn-bg-strip {
  transform: translateX(0);
}
.ls-vn-curtain {
  position: absolute;
  inset: 0;
  z-index: 80;
  background: #04070f;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 420ms ease;
  pointer-events: none;
}
.ls-vn-curtain.is-active {
  opacity: 1;
}
.ls-vn-flash {
  position: absolute;
  inset: 0;
  z-index: 85;
  pointer-events: none;
  opacity: 0;
}

/* Weather Particle Layers */
.ls-vn-weather-layer {
  position: absolute;
  inset: -4%;
  z-index: 6;
  pointer-events: none;
  overflow: hidden;
}
.ls-vn-rain-wash {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.28), rgba(30, 58, 138, 0.12));
}
.ls-vn-rain-layer {
  position: absolute;
  inset: -18%;
  transform: rotate(var(--tilt, 8deg));
}
.ls-vn-rain-layer > i {
  display: block;
  width: 100%;
  height: calc(100% + var(--th, 400px));
  background-image: var(--tile);
  background-repeat: repeat;
  background-size: var(--tw, 280px) var(--th, 400px);
  animation: ls-vn-rain-fall var(--dur, 0.35s) linear infinite;
}
@keyframes ls-vn-rain-fall {
  from { transform: translate3d(0, calc(-1 * var(--th, 400px)), 0); }
  to { transform: translate3d(0, 0, 0); }
}
.ls-vn-fx-layer {
  position: absolute;
  inset: 0;
}
.ls-vn-pt {
  position: absolute;
  display: block;
  top: -24px;
  width: var(--sz, 8px);
  height: var(--sz, 8px);
  opacity: var(--o, 0.85);
  border-radius: 50%;
  pointer-events: none;
}
.ls-vn-splash {
  height: calc(var(--sz, 16px) * 0.32);
  border: 1.5px solid rgba(226, 232, 240, 0.55);
  background: transparent;
  animation: ls-vn-splash-ring var(--fd, 0.75s) ease-out var(--dl, 0s) infinite;
}
@keyframes ls-vn-splash-ring {
  0% { transform: scale(0.15); opacity: 0.85; }
  100% { transform: scale(1.35); opacity: 0; }
}
.ls-vn-flake {
  background: radial-gradient(circle, #ffffff 35%, rgba(255, 255, 255, 0) 75%);
  animation: ls-vn-fall var(--fd, 10s) linear var(--dl, 0s) infinite;
}
.ls-vn-petal {
  background: radial-gradient(ellipse at 35% 35%, #ffe4ef 22%, #f472b6 78%, transparent 100%);
  border-radius: 68% 22% 68% 22%;
  animation: ls-vn-fall var(--fd, 11s) linear var(--dl, 0s) infinite;
}
.ls-vn-firefly {
  background: radial-gradient(circle, #fef08a 18%, rgba(250, 204, 21, 0.65) 48%, transparent 76%);
  box-shadow: 0 0 12px rgba(250, 204, 21, 0.55);
  animation: ls-vn-blink var(--fd, 3.6s) ease-in-out var(--dl, 0s) infinite alternate;
}
.ls-vn-ember {
  top: auto;
  bottom: -24px;
  background: radial-gradient(circle, #fef08a 20%, #f97316 62%, transparent 80%);
  box-shadow: 0 0 10px rgba(249, 115, 22, 0.55);
  animation: ls-vn-rise var(--fd, 4.5s) ease-in var(--dl, 0s) infinite;
}
.ls-vn-fog-wash {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(148, 163, 184, 0.22) 0%, rgba(148, 163, 184, 0.08) 55%, transparent 100%);
}
.ls-vn-fog-layer {
  position: absolute;
  inset: -10% -25%;
  background:
    radial-gradient(ellipse 45% 28% at 28% 72%, rgba(226, 232, 240, 0.28), transparent 70%),
    radial-gradient(ellipse 50% 32% at 72% 80%, rgba(203, 213, 225, 0.24), transparent 72%);
  animation: ls-vn-fog-drift 14s ease-in-out infinite alternate;
}
.ls-vn-fog-2 {
  animation-duration: 19s;
  animation-direction: alternate-reverse;
  opacity: 0.75;
}
@keyframes ls-vn-fog-drift {
  from { transform: translate3d(-6%, 0, 0) scale(1.02); }
  to { transform: translate3d(6%, -2%, 0) scale(1.08); }
}
@keyframes ls-vn-fall {
  from { transform: translate3d(0, -5vh, 0) rotate(0deg); }
  to { transform: translate3d(var(--dx, -8vw), 108vh, 0) rotate(340deg); }
}
@keyframes ls-vn-rise {
  from { transform: translate3d(0, 4vh, 0) scale(1); opacity: 0.95; }
  to { transform: translate3d(var(--dx, 6vw), -106vh, 0) scale(0.35); opacity: 0; }
}
@keyframes ls-vn-blink {
  0% { opacity: 0.22; transform: translate3d(-10px, 6px, 0) scale(0.75); }
  100% { opacity: 1; transform: translate3d(12px, -18px, 0) scale(1.22); }
}

/* 2D Character Sprite Stage Slots & Emotion Rigs */
.ls-vn-actors-layer {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 60px 6% 0;
  pointer-events: none;
  transition: translate 120ms linear, scale 220ms ease;
}
.ls-vn-actors-layer[data-shot-mode="closeup"] .ls-vn-sprite-img {
  max-height: 96vh;
  transform: scale(1.18);
  transform-origin: 50% 22%;
}
.ls-vn-actors-layer[data-shot-mode="full"] .ls-vn-sprite-img {
  max-height: 78vh;
}
.ls-vn-actor-slot {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: auto;
  cursor: grab;
  transition: filter 240ms ease, transform 240ms ease;
}
.ls-vn-actor-slot:active {
  cursor: grabbing;
}
.ls-vn-actor-slot[data-active-speaker="false"] {
  filter: brightness(0.72) saturate(0.85);
}
.ls-vn-actor-slot[data-active-speaker="true"] {
  z-index: 14;
  filter: drop-shadow(var(--ls-vn-rim-x, 0px) 0 18px var(--ls-vn-rim-color, rgba(56, 189, 248, 0.38)));
}
.ls-vn-actor-slot[data-emotion="joy"][data-active-speaker="true"] .ls-vn-avatar-rig {
  animation: ls-vn-emo-joy 0.55s ease;
}
.ls-vn-actor-slot[data-emotion="anger"][data-active-speaker="true"] .ls-vn-avatar-rig {
  animation: ls-vn-emo-anger 0.42s ease;
}
.ls-vn-actor-slot[data-emotion="surprise"][data-active-speaker="true"] .ls-vn-avatar-rig {
  animation: ls-vn-emo-surprise 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes ls-vn-emo-joy {
  0%, 100% { translate: 0 0; }
  45% { translate: 0 -10px; }
}
@keyframes ls-vn-emo-anger {
  0%, 100% { translate: 0 0; }
  25% { translate: -5px 0; }
  75% { translate: 5px 0; }
}
@keyframes ls-vn-emo-surprise {
  0%, 100% { translate: 0 0; }
  35% { translate: 0 -14px; }
}
.ls-vn-gizmo-bar {
  display: flex;
  gap: 4px;
  padding: 4px 6px;
  border-radius: 999px;
  background: rgba(9, 13, 24, 0.85);
  border: 1px solid var(--ls-border);
  margin-bottom: 8px;
  opacity: 0;
  transition: opacity var(--ls-fast);
}
.ls-vn-actor-slot:hover .ls-vn-gizmo-bar,
.ls-vn-actor-slot[data-active-speaker="true"] .ls-vn-gizmo-bar {
  opacity: 1;
}
.ls-vn-sprite-img {
  max-height: 85vh;
  max-width: min(38vw, 460px);
  width: auto;
  height: auto;
  object-fit: contain;
  user-select: none;
}
.ls-vn-placeholder-card {
  width: 200px;
  height: 245px;
  margin-bottom: 180px;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* VN Top HUD, Popovers & Bottom Dialogue Dock */
.ls-vn-top-hud {
  position: relative;
  z-index: 30;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  background: linear-gradient(180deg, rgba(6, 9, 18, 0.84) 0%, rgba(6, 9, 18, 0.4) 72%, transparent 100%);
}
.ls-vn-hud-widget {
  position: fixed;
  top: 64px;
  right: 18px;
  width: min(380px, 92vw);
  height: 92px;
  z-index: 75;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  cursor: grab;
  transition: width 180ms ease, height 180ms ease;
}
.ls-vn-hud-widget:active {
  cursor: grabbing;
}
.ls-vn-hud-widget[data-expanded="true"] {
  width: min(420px, 94vw);
  height: min(500px, calc(100vh - 250px));
}
.ls-vn-popovers {
  position: relative;
  z-index: 80;
  pointer-events: none;
}
.ls-vn-director-popover {
  position: fixed;
  top: 62px;
  right: 18px;
  width: min(340px, 92vw);
  pointer-events: auto;
}
.ls-vn-side-drawer {
  position: fixed;
  top: 62px;
  right: 18px;
  bottom: 215px;
  width: min(440px, 94vw);
  overflow-y: auto;
  pointer-events: auto;
}
.ls-vn-d20-overlay {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(4, 7, 15, 0.55);
  pointer-events: auto;
}
.ls-vn-d20-card {
  width: min(340px, 90vw);
  text-align: center;
  align-items: center;
}
.ls-vn-bottom-dock {
  position: relative;
  z-index: 30;
  width: min(1020px, 95vw);
  margin: auto auto calc(14px + var(--ls-kb-inset, 0px));
}
.ls-vn-dialogue-box {
  padding: 16px 20px 14px;
  border-radius: calc(var(--ls-radius) + 2px);
  border: 1px solid color-mix(in srgb, var(--ls-primary) 35%, var(--ls-border));
  border-top: 2px solid var(--ls-primary);
  background: linear-gradient(180deg, rgba(10, 15, 29, 0.92), rgba(7, 11, 22, 0.96));
  backdrop-filter: blur(18px);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.6);
  cursor: pointer;
}
.ls-vn-speaker-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 800;
  color: #041019;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
}
.ls-vn-prose {
  min-height: 68px;
  max-height: 155px;
  overflow-y: auto;
  margin-top: 10px;
  font-size: 15px;
  line-height: 1.65;
  color: #f8fafc;
  user-select: text;
}
.ls-vn-prose-quote {
  color: #7dd3fc;
  font-weight: 600;
}
.ls-vn-prose-thought {
  color: #cbd5e1;
  font-style: italic;
}
.ls-vn-controls-bar {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--ls-border);
}
.ls-vn-reply-form {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--ls-border);
}

/* Stage Visual Studio Asset Gallery Cards */
.ls-asset-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 245px), 1fr));
  gap: 10px;
}
.ls-asset-card {
  padding: 10px;
  border-radius: calc(var(--ls-radius) - 2px);
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 38%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ls-asset-thumb {
  width: 100%;
  height: 148px;
  border-radius: 8px;
  background: var(--ls-bg);
  border: 1px solid var(--ls-border);
  overflow: hidden;
  display: grid;
  place-items: center;
}
.ls-asset-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* VN Illustrated Zone Atlas & Destination Cards */
.ls-vn-breadcrumb {
  gap: 5px;
}
.ls-vn-atlas-canvas {
  position: relative;
  width: 100%;
  min-height: 180px;
  aspect-ratio: 16 / 6;
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-border);
  background:
    radial-gradient(rgba(148, 163, 184, 0.14) 1px, transparent 1px),
    radial-gradient(circle at 30% 25%, color-mix(in srgb, var(--ls-primary) 12%, transparent), transparent 58%),
    var(--ls-bg);
  background-size: 18px 18px, 100% 100%, 100% 100%;
  overflow: hidden;
  user-select: none;
}
.ls-vn-zone-hub {
  position: absolute;
  transform: translate(-50%, -50%);
  min-width: 132px;
  max-width: 210px;
  padding: 8px 12px !important;
  border-radius: calc(var(--ls-radius) - 1px) !important;
  border: 1.5px solid color-mix(in srgb, var(--ls-zone-color, var(--ls-border)) 58%, transparent) !important;
  background: color-mix(in srgb, var(--ls-bg) 82%, var(--ls-surface)) !important;
  color: var(--ls-text) !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 4px !important;
  z-index: 4;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.42);
}
.ls-vn-zone-hub[data-current="true"] {
  border-color: var(--ls-primary) !important;
  box-shadow: 0 0 0 2.5px color-mix(in srgb, var(--ls-primary) 30%, transparent), 0 8px 24px rgba(0, 0, 0, 0.5);
}
.ls-vn-dest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 8px;
}
.ls-vn-dest-card {
  padding: 8px 10px;
  border-radius: calc(var(--ls-radius) - 2px);
  border: 1px solid var(--ls-border);
  background: var(--ls-fill);
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: border-color var(--ls-fast), background var(--ls-fast), transform var(--ls-fast);
}
.ls-vn-dest-card:hover {
  border-color: var(--ls-border-hover);
  background: var(--ls-fill-hover);
  transform: translateY(-1px);
}
.ls-vn-dest-card[data-current="true"] {
  border-color: color-mix(in srgb, var(--ls-primary) 68%, var(--ls-border));
  background: color-mix(in srgb, var(--ls-primary) 10%, var(--ls-surface));
}
.ls-vn-dest-card[data-selected="true"]:not([data-current="true"]) {
  border-color: var(--ls-accent);
}
.ls-vn-dest-thumb {
  width: 48px;
  height: 40px;
  border-radius: 7px;
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 70%, var(--ls-surface));
  overflow: hidden;
  display: grid;
  place-items: center;
  flex: none;
  font-size: 18px;
}
.ls-vn-dest-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ls-vn-dest-info {
  flex: 1 1 0%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ls-vn-dest-info strong {
  font-size: 12px;
  overflow-wrap: anywhere;
}

/* Portaled Searchable Dropdowns (works inside overlays, modals & accordions) */
.ls-dd-wrap {
  position: relative;
  display: inline-flex;
  width: 100%;
  min-width: 0;
}
.ls-dd-wrap[data-compact="true"] {
  width: auto;
}
.ls-dd-trigger {
  width: 100%;
  min-height: 34px;
  padding: 5px 10px !important;
  border-radius: calc(var(--ls-radius, 12px) - 4px) !important;
  border: 1px solid var(--ls-border) !important;
  background: color-mix(in srgb, var(--ls-bg) 55%, var(--ls-surface)) !important;
  color: var(--ls-text) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 8px !important;
  font-size: 12.5px !important;
  font-weight: 600 !important;
  text-align: left;
}
.ls-dd-wrap[data-compact="true"] .ls-dd-trigger {
  min-height: 26px !important;
  padding: 2px 8px !important;
  font-size: 11px !important;
  border-radius: 6px !important;
}
.ls-dd-trigger[aria-expanded="true"] {
  border-color: var(--ls-primary) !important;
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--ls-primary) 22%, transparent);
}
.ls-dd-trigger-label {
  flex: 1 1 0%;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ls-dd-caret {
  flex: none;
  font-size: 10px;
  opacity: 0.72;
}
.ls-dd-menu {
  position: fixed;
  z-index: 2147483640;
  min-width: 185px;
  max-height: 280px;
  display: flex;
  flex-direction: column;
  padding: 6px;
  gap: 4px;
  border-radius: calc(var(--ls-radius, 12px) - 2px);
  border: 1px solid color-mix(in srgb, var(--ls-primary, #38bdf8) 55%, var(--ls-border, rgba(148,163,184,0.3)));
  background: var(--ls-surface, #131c31);
  color: var(--ls-text, #f1f5f9);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.58);
  box-sizing: border-box;
  font-family: var(--ls-font, system-ui, sans-serif);
  font-size: 12.5px;
}
.ls-dd-search {
  width: 100%;
  min-height: 30px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--ls-border, rgba(148, 163, 184, 0.25));
  background: var(--ls-bg, #0b1120);
  color: var(--ls-text, #f1f5f9);
  font: inherit;
  font-size: 12px;
  outline: none;
}
.ls-dd-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  max-height: 224px;
  scrollbar-width: thin;
}
.ls-dd-option {
  width: 100%;
  min-height: 30px;
  padding: 5px 9px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--ls-text, #f1f5f9);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
}
.ls-dd-option:hover:not(:disabled) {
  background: var(--ls-fill-hover, rgba(148, 163, 184, 0.16));
}
.ls-dd-option[aria-selected="true"] {
  background: color-mix(in srgb, var(--ls-primary, #38bdf8) 20%, transparent);
  color: var(--ls-primary, #38bdf8);
  font-weight: 750;
}
.ls-dd-option:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.ls-dd-sublabel {
  font-size: 10.5px;
  opacity: 0.72;
}

/* Synchronous Accordions & Tactile Switches */
.ls-accordion {
  border-radius: var(--ls-radius);
  border: 1px solid var(--ls-border);
  background: var(--ls-fill);
  margin-bottom: 8px;
}
.ls-accordion-head {
  list-style: none;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  font-size: 12.5px;
  user-select: none;
}
.ls-accordion-head::-webkit-details-marker {
  display: none;
}
.ls-accordion-chev {
  font-size: 11px;
  color: var(--ls-muted);
  transition: transform var(--ls-fast);
}
.ls-accordion[open] .ls-accordion-chev {
  transform: rotate(180deg);
}
.ls-accordion-body {
  padding: 0 12px 12px;
  border-top: 1px solid var(--ls-border);
  padding-top: 10px;
}
.ls-toggle-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  flex: none;
}
.ls-toggle-switch input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.ls-toggle-track {
  width: 34px;
  height: 19px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ls-text) 18%, transparent);
  border: 1px solid var(--ls-border);
  position: relative;
  transition: background var(--ls-fast), border-color var(--ls-fast);
}
.ls-toggle-track::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--ls-text);
  transition: transform var(--ls-fast);
}
.ls-toggle-switch input:checked + .ls-toggle-track {
  background: var(--ls-primary);
  border-color: var(--ls-primary);
}
.ls-toggle-switch input:checked + .ls-toggle-track::after {
  transform: translateX(15px);
  background: var(--lumiverse-primary-contrast, #04131d);
}
.ls-check-row {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  cursor: pointer;
  padding: 3px 0;
}
.ls-formula-status {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 45%, var(--ls-surface));
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ls-formula-status[data-status="ok"] {
  border-color: color-mix(in srgb, var(--ls-success) 55%, var(--ls-border));
}
.ls-formula-status[data-status="warn"] {
  border-color: color-mix(in srgb, var(--ls-warning) 55%, var(--ls-border));
}
.ls-formula-status[data-status="error"] {
  border-color: color-mix(in srgb, var(--ls-danger) 55%, var(--ls-border));
}

/* Cast Icon Mode Grid & Character-Named Tabs */
.ls-roster-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
  gap: 8px;
}
.ls-roster-grid .ls-roster-icon-btn {
  min-width: 0;
  max-width: none;
  width: 100%;
  padding: 10px 8px !important;
}
.ls-roster-grid .ls-roster-name {
  max-width: 100%;
  font-size: 11.5px;
}
.ls-roster-role {
  font-size: 10px;
  font-weight: 500;
  color: var(--ls-muted);
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ls-cast-tabs-bar {
  display: flex;
  align-items: center;
  gap: 5px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}
.ls-cast-tabs-bar::-webkit-scrollbar {
  display: none;
}
.ls-cast-tab-group {
  display: inline-flex;
  align-items: stretch;
  flex: none;
}
.ls-cast-tab-btn {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  white-space: nowrap;
}
.ls-cast-tab-close {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  border-left: 0 !important;
  padding: 2px 6px !important;
  min-width: 22px !important;
  color: var(--ls-muted) !important;
}
.ls-cast-tab-close:hover:not(:disabled) {
  color: var(--ls-danger) !important;
}

/* Custom Stat Category Headers */
.ls-cat-group {
  gap: 8px;
}
.ls-hud-cat-head {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-left: 3px solid var(--ls-primary);
  background: color-mix(in srgb, var(--ls-fill) 85%, transparent);
  border-radius: 6px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ls-muted);
}

/* 10 Floating Pill Skins */
.ls-pill-live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ls-success);
  box-shadow: 0 0 8px var(--ls-success);
  flex: none;
}
.ls-pill-title-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ls-hud-pill[data-pill-skin="glass_capsule"] {
  background: linear-gradient(135deg, color-mix(in srgb, var(--ls-primary) 9%, transparent), color-mix(in srgb, var(--ls-surface) 92%, transparent));
  backdrop-filter: blur(18px);
}
.ls-hud-pill[data-pill-skin="vn_dialogue_bar"] {
  background: linear-gradient(180deg, rgba(10, 15, 29, 0.94), rgba(7, 11, 22, 0.96));
  border-top: 2px solid var(--ls-primary);
}
.ls-hud-pill[data-pill-skin="vn_dialogue_bar"] .ls-pill-title-text {
  letter-spacing: 0.02em;
  font-weight: 800;
}
.ls-hud-pill[data-pill-skin="rpg_status_bar"] {
  background: linear-gradient(160deg, rgba(32, 26, 20, 0.95), rgba(16, 13, 10, 0.97));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ls-primary) 28%, transparent);
}
.ls-hud-pill[data-pill-skin="persona_ticker"] {
  background: linear-gradient(150deg, color-mix(in srgb, var(--ls-primary) 22%, var(--ls-bg)), var(--ls-bg));
}
.ls-hud-pill[data-pill-skin="persona_ticker"] .ls-hud-title-badge {
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 900;
}
.ls-hud-pill[data-pill-skin="cyber_telemetry"] {
  font-family: var(--ls-mono);
  background:
    repeating-linear-gradient(0deg, rgba(56, 189, 248, 0.03) 0 1px, transparent 1px 4px),
    rgba(4, 10, 22, 0.95);
}
.ls-hud-pill[data-pill-skin="minimal_floating"] {
  background: color-mix(in srgb, var(--ls-surface) 68%, transparent);
  backdrop-filter: blur(12px);
}
.ls-hud-pill[data-pill-skin="minimal_floating"] .ls-pill-actions > button:not(:last-child) {
  opacity: 0;
  transition: opacity var(--ls-fast);
}
.ls-hud-pill[data-pill-skin="minimal_floating"]:hover .ls-pill-actions > button:not(:last-child) {
  opacity: 1;
}
.ls-hud-pill[data-pill-skin="neon_edge"] {
  border-left: 4px solid var(--ls-primary);
  box-shadow: inset 10px 0 24px color-mix(in srgb, var(--ls-primary) 18%, transparent);
}
.ls-hud-pill[data-pill-skin="split_deck"] {
  padding: 0;
  gap: 0;
}
.ls-hud-pill[data-pill-skin="split_deck"] .ls-pill-top-deck {
  padding: 6px 11px;
  background: color-mix(in srgb, var(--ls-primary) 16%, var(--ls-surface));
  border-bottom: 1px solid var(--ls-border);
}
.ls-hud-pill[data-pill-skin="split_deck"] .ls-pill-bottom-deck {
  padding: 6px 11px;
}
.ls-hud-pill[data-pill-skin="compact_badge"] {
  padding: 5px 10px;
}
.ls-hud-pill[data-pill-skin="ledger_strip"] {
  background: color-mix(in srgb, var(--ls-bg) 82%, var(--ls-surface));
  font-family: var(--ls-mono);
}
.ls-hud-pill[data-pill-skin="ledger_strip"] .ls-chip {
  border-radius: 4px;
}

/* 8 New Stat Visual Display Styles */
.ls-arc-list {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.ls-arc-card {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 40%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ls-arc-title {
  font-size: 12px;
  font-weight: 750;
}
.ls-arc-status {
  padding: 1.5px 7px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.04em;
  background: color-mix(in srgb, var(--ls-primary) 18%, transparent);
  color: var(--ls-primary);
}
.ls-arc-status[data-arc-status="dormant"],
.ls-arc-status[data-arc-status="retired"],
.ls-arc-status[data-arc-status="drop"] {
  background: var(--ls-fill);
  color: var(--ls-muted);
}
.ls-arc-status[data-arc-status="payoff"],
.ls-arc-status[data-arc-status="done"],
.ls-arc-status[data-arc-status="complete"],
.ls-arc-status[data-arc-status="completed"] {
  background: color-mix(in srgb, var(--ls-success) 18%, transparent);
  color: var(--ls-success);
}
.ls-arc-status[data-arc-status="urgent"],
.ls-arc-status[data-arc-status="fail"],
.ls-arc-status[data-arc-status="failed"] {
  background: color-mix(in srgb, var(--ls-danger) 18%, transparent);
  color: var(--ls-danger);
}
.ls-arc-clock {
  margin: 1px 0;
}
.ls-arc-summary {
  margin: 0 !important;
  font-size: 12px;
}
.ls-arc-meta {
  display: flex;
  gap: 6px;
  align-items: baseline;
  font-size: 11.5px;
}

.ls-stat-acc {
  border-radius: 8px;
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 38%, var(--ls-surface));
}
.ls-stat-acc-head {
  list-style: none;
  padding: 6px 9px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  cursor: pointer;
  font-size: 12px;
}
.ls-stat-acc-head::-webkit-details-marker {
  display: none;
}
.ls-stat-acc-preview {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 55%;
}
.ls-stat-acc-body {
  padding: 6px 9px 8px;
  border-top: 1px solid var(--ls-border);
}

.ls-matrix-card {
  padding: 7px 9px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--ls-bg) 38%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ls-matrix-cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 6px;
}
.ls-matrix-cell {
  padding: 6px 8px;
  border-radius: 6px;
  background: var(--ls-fill);
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 11.5px;
}
.ls-matrix-footer {
  padding: 5px 8px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--ls-primary) 10%, transparent);
  font-size: 11.5px;
}

.ls-minibars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 7px;
}
.ls-minibar-cell {
  padding: 6px 8px;
  border-radius: 7px;
  background: color-mix(in srgb, var(--ls-bg) 35%, var(--ls-surface));
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
}

.ls-statpills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.ls-statpill-tile {
  padding: 4px 9px;
  border-radius: 7px;
  border: 1px solid var(--ls-border);
  background: color-mix(in srgb, var(--ls-bg) 40%, var(--ls-surface));
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-variant-numeric: tabular-nums;
}

.ls-ledger-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ls-ledger-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 5px 8px;
  border-radius: 6px;
  background: color-mix(in srgb, var(--ls-bg) 35%, var(--ls-surface));
  font-size: 12px;
}

.ls-timeline-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 10px;
  border-left: 2px solid color-mix(in srgb, var(--ls-primary) 45%, var(--ls-border));
}
.ls-timeline-item {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 12px;
}
.ls-timeline-dot {
  position: absolute;
  left: -15px;
  top: 5px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ls-primary);
  border: 2px solid var(--ls-surface);
}

.ls-checklist {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ls-checklist-row {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  padding: 3px 4px;
}
.ls-checklist-box {
  width: 15px;
  height: 15px;
  border-radius: 4px;
  border: 1.5px solid var(--ls-border);
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 800;
  flex: none;
}
.ls-checklist-row[data-done="true"] .ls-checklist-box {
  background: var(--ls-success);
  border-color: var(--ls-success);
  color: #04131d;
}
`;
