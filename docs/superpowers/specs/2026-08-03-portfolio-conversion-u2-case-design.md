# Portfolio Conversion and U2 Case Design

**Date:** 2026-08-03  
**Status:** Approved in conversation; awaiting written-spec review  
**Primary audience:** Recruiters and employers  
**Secondary audience:** Potential development clients

## 1. Context

The current portfolio has a strong technical identity, correct semantics, accessible navigation, a dark theme, and expressive motion. The audit identified four gaps that limit its ability to convert visitors:

1. The mobile hero clips long text and pushes the primary calls to action below the first screen.
2. The portfolio describes engineering principles more convincingly than it demonstrates shipped work.
3. Real career data exists in the repository but is not shown as employment history.
4. Initial transfer and rendering are heavier than necessary because of TTF fonts, JavaScript, analytics, and server response time.

The redesign will evolve the existing Terminal Grid visual system rather than replace it.

## 2. Goals

- Make the visitor understand the developer's name, role, experience, and availability within the first screen.
- Prioritize employment without removing a clear contact path for clients.
- Present U2 as the single flagship project with a dedicated case-study page and real screenshots.
- Show the existing IdaProject and O2 career history.
- Keep six non-featured projects available in a compact grid without competing visually with U2.
- Preserve RU/EN, light/dark themes, keyboard navigation, command palette, and reduced-motion support.
- Improve real and lab performance while preserving the site's motion identity.
- Add missing canonical, sitemap, structured-data, language-routing, and security infrastructure.

## 3. Non-goals

- No visual rebrand or replacement of the Terminal Grid identity.
- No public grade such as Junior, Middle, Senior, Lead, or Staff. The visible role is exactly `Frontend Engineer` in English and `Frontend Engineer` in the Russian hero.
- No invented conversion metrics, performance percentages, business outcomes, or team details.
- No CMS, admin panel, database, authentication, blog redesign, or project-page framework beyond the U2 case needed for this iteration.
- No screenshot-heavy treatment for all seven projects.

## 4. Chosen Direction

The chosen visual direction is **Terminal Grid Evolution (Option A)**.

It keeps the current blue grid, monospaced system labels, light/dark palette, command palette, and interactive accents. The hierarchy changes from a generic engineering manifesto to a personal portfolio:

1. Amiran Bestaev.
2. Frontend Engineer.
3. A concise value proposition.
4. Verifiable experience signals.
5. U2 as the flagship case.

## 5. Information Architecture

### 5.1 Header

The primary navigation becomes:

- Experience
- U2
- Projects
- Stack
- Contact

Language, theme, command palette, and Telegram controls remain. The mobile menu keeps its dialog semantics and keyboard behavior.

### 5.2 Homepage order

1. Compact header.
2. Personal hero.
3. Proof strip.
4. Featured U2 teaser.
5. Career history.
6. Compact grid of the other six projects.
7. Condensed stack and principles.
8. Contact footer.

### 5.3 Hero content

The hero shows:

- `Амиран Бестаев` / `Amiran Bestaev`.
- `Frontend Engineer` with no grade.
- A short positioning statement focused on scalable product interfaces for real estate and e-commerce.
- Moscow and the existing availability status.
- Calls to action: View U2, Download CV, Contact.
- A shortened boot sequence of at most two lines on desktop and a minimal or hidden version on narrow mobile screens.

The proof strip contains:

- 5+ years of commercial development.
- Vue 2/3 and Nuxt 2/3.
- Two product-company experience entries.

### 5.4 Featured U2 teaser

U2 appears once as the single flagship case. It is not repeated in the compact project grid.

The teaser contains:

- A real U2 screenshot.
- Product type and concise summary.
- Verified contribution: property showcase, filtering, typed logic, and selection scenarios.
- Technology tags.
- Internal link to the U2 case.
- External link to the public product.

### 5.5 Career history

The homepage displays the existing localized data without changing facts:

- IdaProject — July 2024 to present.
- O2 — February 2021 to July 2024.

Each entry shows role, period, stack, and existing bullet points. The current “System Approach” accordion is removed from the homepage. The separate existing principles section remains and no longer substitutes for employment history.

### 5.6 Other projects

The six remaining projects use compact cards:

- Fordewind
- Massandra Park
- Maks
- Novaya
- Vkusno i Bystro
- Tsvet Divanov

Cards retain project name, type, concise contribution, tags, and external URL. They use a denser layout than the current cards and do not receive full screenshot galleries.

## 6. U2 Case Page

### 6.1 Routes

- Russian: `/projects/u2`
- English: `/en/projects/u2`

### 6.2 Page structure

1. Case header with back navigation, portfolio identity, and external U2 link.
2. Hero with title, product summary, and a real desktop screenshot.
3. Fact strip: role, focus, stack, and production status.
4. Engineering narrative:
   - Task.
   - Personal contribution.
   - Technical approach.
   - Functional result.
5. Screenshot gallery with desktop and mobile views.
6. Technology list.
7. Result statement without unverified numerical metrics.
8. Navigation back to the homepage and an external next-project reference to Novaya.

### 6.3 Screenshot policy

The user explicitly authorized independent capture of public project screenshots.

Implementation will capture U2 views from the public website. The selected images should demonstrate:

- Homepage or primary product presentation.
- Catalog and filters.
- Property selection or card flow.
- At least one mobile view when the public interface supports it.

Screenshots are portfolio evidence, not decorative stock imagery. They are stored under `public/projects/u2/`, optimized to WebP and AVIF where supported, assigned explicit dimensions, and lazy-loaded below the case hero.

## 7. Components and Data Boundaries

### 7.1 Homepage components

- `HeroSection`: personal positioning and mobile-safe first screen.
- `FeaturedCaseSection`: U2 teaser only.
- `CareerSection`: actual employment history.
- `ProjectGrid`: six non-featured projects.
- Existing `SkillsSection` and `PrinciplesSection`: condensed presentation.

### 7.2 Case components

- `CaseHero`.
- `CaseFacts`.
- `CaseNarrative`.
- `CaseGallery`.
- `CaseResult`.
- `CaseNavigation`.

Each component receives explicit localized data and does not reach into global copy internally.

### 7.3 Data model

Project data gains explicit fields needed for stable routing and presentation:

- The existing stable `id` as route identity; no second slug field is introduced.
- `featured` boolean.
- `casePath` for internal navigation.
- Optional teaser media.
- Localized case facts and narrative for U2.
- Gallery assets with `src`, `alt`, `width`, and `height`.

The portfolio validator enforces:

- Exactly one featured project.
- U2 is the featured project in both locales.
- Locale project order and identifiers remain aligned.
- U2 case content exists in RU and EN.
- Internal case paths and asset metadata are valid.
- Duplicate project IDs and URLs remain rejected.

## 8. Language and SEO Routing

Language becomes URL-addressable:

- Russian homepage: `/`
- English homepage: `/en`
- Russian U2 case: `/projects/u2`
- English U2 case: `/en/projects/u2`

The language toggle navigates to the equivalent route instead of only changing client state. The URL is authoritative: `/` and `/projects/u2` always render Russian, while `/en` and `/en/projects/u2` always render English. The toggle may update the saved preference for future UI use, but saved state never overrides the current route.

Each page provides:

- Absolute canonical URL.
- Matching RU/EN `hreflang` links plus `x-default`.
- Absolute Open Graph URL and image.
- Localized title and description.
- `Person` JSON-LD for Amiran Bestaev.
- `WebSite` JSON-LD on homepages.
- `CreativeWork` structured data for the U2 case.

The sitemap contains the four public routes. `robots.txt` continues to allow indexing and references the sitemap.

## 9. Motion and Interaction

- Server-rendered content is visible before animation setup.
- GSAP enhances visible content; it does not define the only visible state.
- Hero entrance completes in approximately one second.
- Desktop fine-pointer devices keep subtle parallax, pointer glow, tilt, and magnetic CTA behavior.
- Coarse-pointer devices receive simple fade/slide reveals without tilt or pointer tracking.
- ScrollTrigger work is delayed until it is needed and cleaned up on unmount.
- `prefers-reduced-motion` disables nonessential motion while preserving all content and controls.
- Light/dark theme transitions remain short and do not animate large layout properties.

## 10. Responsive Behavior

At 390 px width:

- No text, badge, card, or CTA is clipped.
- Long Russian words and availability text wrap safely.
- At 390 × 844, name, role, concise value proposition, and all three primary calls to action are visible without scrolling. The proof strip may begin below the fold.
- The mobile menu remains fully keyboard accessible.
- U2 gallery becomes a single column.
- Compact project cards remain readable without horizontal scroll.

Tablet and desktop layouts preserve the existing grid character while improving spacing and hierarchy.

## 11. Performance Design

### 11.1 Fonts

- Convert the bundled Montserrat upright and italic variable fonts to WOFF2 and stop referencing static TTF files from portfolio CSS.
- Load only those two variable WOFF2 resources.
- Use `font-display: swap`.
- Preload only the critical primary font resource.
- Target initial font transfer below 250 KB, down from approximately 794 KB in the audit.

### 11.2 JavaScript and animation

- Keep GSAP dynamically imported.
- Load ScrollTrigger only on pages and viewports that need it.
- Avoid booting project-card pointer motion on touch devices.
- Remove or defer unused animation work from the initial route.

### 11.3 Rendering and server response

- Prerender the four known public routes.
- Preserve the Node deployment, but serve prerendered HTML where Nuxt supports it.
- Add safe cache headers for immutable hashed assets and appropriate HTML revalidation.

### 11.4 Analytics

Yandex Metrika remains available but does not block the first render. After the browser `load` event, initialization is scheduled with `requestIdleCallback`; browsers without it use a three-second timeout. Analytics failure must not produce application errors or alter visible content.

## 12. Security Headers

The Nuxt response or deployment configuration should add conservative headers compatible with the current external links and analytics:

- `Strict-Transport-Security`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy`.
- `Permissions-Policy`.
- A report-only Content Security Policy that covers the current Nuxt, font, image, GSAP, and Yandex origins without blocking requests.

The implementation does not enforce CSP in this iteration. Report-only violations are used to prepare a later enforcing policy without risking the live portfolio.

## 13. Error Handling and Fallbacks

- Failed case images render a styled fallback with meaningful alt text nearby; layout dimensions remain reserved.
- Missing optional media does not remove case text or navigation.
- A failed GSAP or ScrollTrigger import leaves all content visible and usable.
- A failed analytics request is ignored by application UI.
- Invalid localized case data fails repository validation before build.
- External project links remain ordinary links and do not block internal navigation.
- No numerical result is shown unless it can be sourced from the existing portfolio data or explicitly supplied later.

## 14. Testing and Acceptance Criteria

### 14.1 Data and unit checks

- RU/EN project parity.
- Exactly one featured project and it is U2.
- U2 localized case content and asset metadata.
- No duplicate project IDs or external URLs.
- Correct route-to-locale mapping.
- Generated canonical, hreflang, and structured-data fields.

### 14.2 Browser checks

Playwright covers desktop Chrome and a 390 px mobile viewport:

- Hero identity and CTAs.
- No horizontal overflow or clipped critical text.
- Homepage-to-U2 navigation.
- RU/EN equivalent routes.
- Career entries.
- Six compact projects and no repeated U2 card.
- U2 gallery and image fallbacks.
- Mobile menu, keyboard navigation, and command palette.
- Light/dark themes.
- Reduced motion.
- Content remains visible when animation initialization is unavailable.
- No application console errors.

### 14.3 Build and lab budgets

- `npm test` passes.
- Playwright desktop/mobile suite passes.
- `npm run build` passes.
- Lighthouse LCP remains below 2.5 seconds in the accepted lab run.
- CLS remains below 0.1.
- Accessibility and SEO remain at or above 95.
- Initial font transfer is substantially below the previous approximately 794 KB and targets less than 250 KB.

## 15. Delivery

Implementation should be developed in an isolated feature branch/worktree, reviewed in desktop and mobile browsers, committed in focused steps, merged to `main`, and monitored through the existing GitHub Actions deployment. The public site is checked after deployment for the new hero, U2 route, locale routes, and absence of regressions.
