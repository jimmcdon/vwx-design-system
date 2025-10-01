/**
 * VWX Design System - Components
 *
 * This package exports Web Components built with Lit for the VW Xperience Design System.
 *
 * @example
 * import '@vwx/components';
 * // or import specific components
 * import '@vwx/components/atoms/button';
 */

// ==========================================
// ATOMS - Foundational Components
// ==========================================

// Typography
export * from './atoms/Heading';
export * from './atoms/Text';

// Buttons & Actions
export * from './atoms/Button';
export * from './atoms/IconButton';

// Form Inputs
export * from './atoms/TextInput';
export * from './atoms/Textarea';
export * from './atoms/Select';

// Form Selection
export * from './atoms/Checkbox';
export * from './atoms/Radio';
export * from './atoms/Toggle';

// Feedback
export * from './atoms/Badge';
export * from './atoms/Tag';
export * from './atoms/Spinner';

// Navigation
export * from './atoms/Link';
export * from './atoms/Breadcrumb';

// Layout & Visual
export * from './atoms/Divider';
export * from './atoms/Avatar';
export * from './atoms/Icon';
export * from './atoms/ProgressBar';

// ==========================================
// MOLECULES (Coming in Phase 2)
// ==========================================
// export * from './molecules';

// ==========================================
// ORGANISMS - Dashboard Components (Phase 2)
// ==========================================

// Gauges & Indicators
export * from './organisms/speedometer';
export * from './organisms/fuel-gauge';
export * from './organisms/odometer';
export * from './organisms/tachometer';
export * from './organisms/temperature-gauge';

// Indicators & Alerts
export * from './organisms/turn-signal';
export * from './organisms/warning-light';

// Controls
export * from './organisms/ignition-switch';
export * from './organisms/choke-knob';
export * from './organisms/light-switch';

// Displays
export * from './organisms/dashboard-clock';

// ==========================================
// AI INTEGRATION - BYOK Components (Phase 3)
// ==========================================
export * from './ai';

console.log('VWX Components loaded - 20+ Atomic components + 11 Dashboard components + 4 AI components ready');
