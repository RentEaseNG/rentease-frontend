# Navigation & Dashboard Regression Checklist

This checklist confirms the successful implementation of the UX refinements and ensures no regressions across different breakpoints.

## 1. Logout Flow & Security
- [ ] **Accidental Logout Prevention**: Clicking the profile avatar opens the `UserDropdown` instead of logging out immediately.
- [ ] **Confirmation Dialog**: Clicking "Log out" in the dropdown shows a red confirmation prompt.
- [ ] **Session Destruction**: Clicking "Yes, Logout" correctly clears `AuthContext` and redirects to `/`.
- [ ] **Cancel Action**: Clicking "Cancel" on the logout prompt returns the dropdown to its normal state without logging out.

## 2. Navigation & Link Consolidation
- [ ] **Navbar Cleanliness**: "Add Property" link is absent from the global navigation.
- [ ] **Entry Point Consolidation**: Landlords must navigate to "My Properties" to find the "List New Property" entry point.
- [ ] **Role-Based Visibility**: "My Properties" is only visible to users with `Landlord`, `Admin`, or `SuperAdmin` roles.
- [ ] **Active States**: Navbar links show the correct `bg-brand-50` background when on the corresponding route.

## 3. Icon Consistency (Audit)
- [ ] **Standard Sizes**: Stat icons are `24px`, UI decorators are `14px`.
- [ ] **Standard Weights**: Stats use `fill`, general UI uses `regular`, small decorators use `bold`.
- [ ] **Color Palette**: Icons use standard `zinc` and `brand` color tokens.

## 4. Cross-Platform Responsiveness
- [ ] **Desktop (1280px+)**: Horizontal navbar with `UserDropdown` visible.
- [ ] **Tablet (768px - 1024px)**: Responsive grid in Dashboards (column shifts).
- [ ] **Mobile (< 768px)**: 
    - [ ] Hamburger menu works correctly.
    - [ ] Mobile logout (SignOut icon) functions as expected.
    - [ ] Dashboard cards stack vertically.
