# Accessibility and Browser Testing Guide (Step 17)

This document maps out testing checklists and design rules to ensure that the **Quantum Mentor World** pages are fully accessible, cross-browser compatible, and screen-reader friendly.

---

## 1. Keyboard Navigation Rules

* All interactive elements must be focusable using the standard `Tab` key.
* Actions (buttons, tabs, links) must be executable via the `Enter` or `Space` key.
* The focus path must flow logically from top-to-bottom and left-to-right following the page's visual structure.

---

## 2. Focus States and Outlines

* Native or custom outlines (`outline: 2px solid var(--primary)`) must remain visible on keyboard focus.
* Do NOT use `outline: none` unless setting corresponding customized `:focus-visible` selectors.

---

## 3. Screen Reader Integration (ARIA)

* **Images Alt Tags:** Every visual asset or card icon must declare descriptive `alt` text. Decorative patterns must specify empty `alt=""` properties.
* **Form Controls:** Every text field, dropdown list, or search bar must have associated `<label>` attributes or an explicit `aria-label` attribute.
* **Dynamic Content Announcements:** Dynamic notifications (like toaster announcements) must use `aria-live="polite"` elements to declare messages to screen readers. Refer to [AccessibilityUtils.announceToScreenReader](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/accessibility.js).

---

## 4. Modal and Dialog Overlays

* **Focus Isolation (Trap Focus):** When modal structures open (like the safe redirect modal), keyboard focus must be locked within the dialog context. Refer to [trapFocus](file:///g:/Projects/Quantum%20Mentor%20Web%20For%20custom%20Part%202/frontend/assets/js/accessibility.js).
* **Escape to Close:** Pressing the `Escape` key must automatically dismiss active modally-mounted frames.

---

## 5. Color Contrast

* Text layouts must meet WCAG AA standards (minimum contrast ratio of 4.5:1 for normal body copy, and 3:1 for headers).
* Secondary information must use styling variables (`var(--text-muted)`) to avoid readability strain against dark backgrounds.

---

## 6. Browser Verification Matrix

Validate visual alignments, dynamic actions, and API requests across these environments:

| Browser | Device Mode | Key Checkpoints |
|---|---|---|
| **Chrome** | Desktop / Mobile Responsive | Layout grids, performance lazy loading, file uploads |
| **Edge** | Desktop | Form validation, CORS handling, scrollbar styles |
| **Firefox** | Desktop / Mobile | Keyboard outlines, SVG rendering, animations |
| **Safari** | iOS Mobile (if available) | Touch targets, scroll bounce boundaries, font sizes |

---

## 7. Common Issues and Resolutions

### Focus outline missing
* **Resolution:** Ensure the button or anchor elements do not override the default focus layout. Add:
  ```css
  a:focus-visible, button:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }
  ```

### Modal backdrop doesn't lock focus
* **Resolution:** Run `AccessibilityUtils.trapFocus(modalElement)` immediately after injecting modal overlays.
