# Atepla UI Redesign Plan

**Scope:** UI/styling only — no functionality, logic, or navigation changes.

---

## 1. Global Navigation Bar Redesign (applied to all pages)

**Goal:** Replace the default iOS-style `ion-toolbar` with a modern blue-gradient header.

**Approach:**
- Add a global CSS class/variable set in `src/global.scss` and `src/theme/variables.scss`.
- Use a `.modern-toolbar` class on all `ion-header > ion-toolbar` elements.
- Style:
  - Background: `linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)` (or use existing `--ion-color-primary` gradient)
  - White title text, centered with proper padding.
  - White back buttons/icons with subtle hover/active states.
  - Slightly rounded bottom corners and a soft shadow.
  - Modern font weight (600–700).
- **Pages to update:**
  - `plates-list.page.html` (Manage Your Plates)
  - `plates-for-the-day-page/plates-for-the-day.page.html`
  - `choose-date-page/choose-date.page.html`
  - `choose-plate-page/choose-plate.page.html`
  - `family/family.page.html`
  - `family-week-plates/family-week-plates.page.html`
  - `shared-plates/shared-plates.page.html`
  - `shared-plates-list/shared-plates-list.component.html`
  - `grocery-list-page/grocery-list.page.html`
  - `worldwide-recipes/worldwide-recipes.page.html`
  - `settings/settings.page.html`
  - `subscription/subscription.page.html`
  - `help/help.page.html`
  - `share-plate-modal/share-plate-modal.component.html`
  - `plate-details-modal/plate-details.modal.html`
- **What stays the same:** button text, `defaultHref`, click handlers, routing behavior.

---

## 2. Home Page — "Draft — not visible to family" Chip

**Current:** `ion-chip color="medium"` with transparent/transparent-ish grey background and grey text.
**Requested:** Solid grey frame, white text.

**File:** `src/app/landing/landing.page.scss`

**Change:**
```scss
.publish-controls ion-chip[color="medium"] {
  --background: #6B7280; // solid grey
  --color: #ffffff;      // white text
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}
```
- No HTML changes.

---

## 3. Edit / Pencil Icons

**Current:** Small `pencil-outline` icon in top-right of day cards.
**Requested:** Bolder, more clearly pencil-like.

**File:** `src/app/landing/landing.page.scss`

**Change:**
```scss
.edit-btn {
  --color: var(--ion-color-primary);
  --padding-start: 8px;
  --padding-end: 8px;
  --background: rgba(var(--ion-color-primary-rgb), 0.08);
  border-radius: 10px;

  ion-icon {
    font-size: 1.35rem;
    font-weight: 700;
    stroke-width: 48px;
  }
}
```
- Optionally switch icon from `pencil-outline` to `pencil` (filled/bolder) in `landing.page.html`.
- Keep `editDayMenu(plate.date)` handler unchanged.

---

## 4. View Shared Plates Page

**Current:** Basic `ion-card` list with default Ionic styling.
**Requested:** Modern, clean, polished UI.

**Files:**
- `src/app/plates/shared-plates/shared-plates.page.html`
- `src/app/plates/shared-plates/shared-plates.page.scss`
- `src/app/plates/shared-plates-list/shared-plates-list.component.html`
- `src/app/plates/shared-plates-list/shared-plates-list.component.scss`

**Plan:**
- Replace card list with modern list items (white rounded cards, soft shadow, avatar/initials, clear typography).
- Add tab-style segment for Received/Sent with underline indicator.
- Add empty-state illustrations (icon + friendly text).
- Polish selection mode (better checkboxes, batch action bar).
- Use the new modern header.
- Keep all click handlers, selection logic, and API calls identical.

---

## 5. Choose Your Plans Page

**Current issue:** `POPULAR` and `14 Days Free` badges overlap/position awkwardly.
**Requested:**
- Move `POPULAR` to sit naturally at the top of the Pro card, between the outer frame and the content.
- Move `14 Days Free` labels slightly higher but keep them inside the card.
- Polish spacing and positioning.

**Files:**
- `src/app/subscription/subscription.page.html`
- `src/app/subscription/subscription.page.scss`

**Plan:**
- Restructure badge placement in the HTML so `POPULAR` is a top banner (full-width, attached to top of card) and `14 Days Free` is a secondary badge below it.
- Adjust card padding to account for the top banner.
- Use `position: relative/absolute` carefully so badges stay inside the card.
- No changes to plan data, selection, or Stripe checkout logic.

---

## 6. Settings Page

**Current:** Plain `ion-card` forms with default Ionic items.
**Requested:** Modern, clean, consistent UI.

**Files:**
- `src/app/settings/settings.page.html`
- `src/app/settings/settings.page.scss`
- `src/app/settings/components/profile-section/profile-section.component.html`
- `src/app/settings/components/profile-section/profile-section.component.scss`
- `src/app/settings/components/preferences-section/preferences-section.component.html`
- `src/app/settings/components/preferences-section/preferences-section.component.scss`
- `src/app/settings/components/account-section/account-section.component.html`
- `src/app/settings/components/account-section/account-section.component.scss`

**Plan:**
- Add a top hero/profile card with avatar, name, email.
- Convert forms into modern grouped cards with section titles.
- Use rounded inputs, clean toggles, modern buttons.
- Improve segment/tab navigation styling.
- Keep all form controls, validators, and submit handlers unchanged.

---

## 7. Help Page

**Current:** Already has modern styling, but the title may not be perfectly centered.
**Requested:** Center "Help" title in the top navigation bar, clean alignment.

**Files:**
- `src/app/help/help.page.html`
- `src/app/help/help.page.scss`

**Plan:**
- Apply the modern header class.
- Ensure `ion-title` is centered using Ionic's standard centering (e.g. `text-align: center`, proper padding for back button).
- Minor spacing cleanups if needed.

---

## Files I Will NOT Touch

- Any `.ts` logic files (except adding CSS classes via `[class]` bindings if necessary).
- API clients, services, routing, guards.
- Backend code.
- Translations/i18n files.

---

## Testing Checklist

After changes:
1. Home page loads and "Draft" chip is grey with white text.
2. Pencil icons are bolder and clearly clickable.
3. All page headers show the new blue modern header.
4. Shared Plates page looks modern and tabs work.
5. Subscription badges are positioned correctly.
6. Settings page shows modern grouped cards and forms work.
7. Help page title is centered.
8. No console errors and no broken navigation.
