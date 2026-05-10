# RentEase Icon Design Tokens

All icons in the RentEase Dashboard and Control Center must adhere to these standardized tokens to ensure a unified visual identity.

## Icon Library
- **Library**: `@phosphor-icons/react`
- **Visual Style**: Minimalist, architectural, geometric.

## Sizing Tokens
| Token | Size | Usage |
| :--- | :--- | :--- |
| `icon-xl` | `40` | Main module headers, large illustrative states. |
| `icon-lg` | `24` | Primary stat cards, high-level navigation, quick actions. |
| `icon-md` | `20` | Secondary UI actions, list item icons, dropdown items. |
| `icon-sm` | `16` | Helper text icons, button decorators. |
| `icon-xs` | `14` | Breadcrumbs, small UI decorators (MapPin, Caret). |

## Stroke & Weight
- **Default**: `weight="regular"` (Balanced stroke for most UI elements).
- **Active/Selected**: `weight="fill"` (High-contrast state for emphasis).
- **Stat Icons**: `weight="fill"` (Provides visual weight in metric cards).
- **Small Decorators**: `weight="bold"` (Ensures legibility at small sizes like 12px or 14px).

## Color Palette
- **Primary**: `text-zinc-900` (Main UI icons).
- **Secondary**: `text-zinc-400` (Disabled, non-interactive, or background decorators).
- **Brand**: `text-brand-600` (Success, active states, or brand-specific modules).
- **Alert**: `text-rose-600` (Warnings, errors, or critical actions).
- **Success**: `text-emerald-600` (Completed states, positive confirmations).

## Implementation Example
```jsx
// Stat Card Implementation
<House size={24} weight="fill" className="text-zinc-900" />

// UI Decorator Implementation
<MapPin size={14} weight="bold" className="text-zinc-400" />
```
