# Smiles for Belize — Nonprofit Website

## Project Overview

Nonprofit dental accessibility website for **Smiles for Belize** — promoting dental accessibility, education, and outreach across Belize through free clinics, school visits, and community partnerships. **Faith Edgar (Miss World Belize 2025)** is the brand ambassador.

**Mission:** Oral health is essential health. Every person, regardless of income or location, deserves to live with comfort, confidence, and care.

**Repo:** `get-proofpilot/Smiles-for-Belize`
**Branch:** `claude/brand-style-guide-JzwUd` (default branch)
**Hosting:** Railway (auto-deploys on push to GitHub)
**Stack:** React + Vite + Tailwind CSS v4

## Build & Dev

```bash
npm install
npm run dev          # Vite dev server
npm run build        # Production build → dist/
```

Railway runs `npm run build` then serves `dist/` via `serve -s dist -l $PORT`.

## File Structure

```
src/
├── App.tsx                    # Root — assembles all sections
├── main.tsx                   # Vite entry point
├── styles/index.css           # Tailwind v4 config, brand tokens, animations
└── components/
    ├── Navbar.tsx              # Sticky nav, transparent→solid on scroll
    ├── Hero.tsx                # Mission-focused hero with video player
    ├── Programs.tsx            # 4 program cards (clinics, screenings, education, outreach)
    ├── ImpactStats.tsx         # Bento grid stats with SVG icons
    ├── Ambassador.tsx          # Team/volunteer section with Faith Edgar
    ├── WhereWeWork.tsx         # 4 Belizean locations
    ├── Testimonials.tsx        # 3 testimonial cards
    ├── DonateCTA.tsx           # Donation call to action
    └── Footer.tsx              # 4-column footer

public/
├── images/                    # Photos (ambassador-*, clinic-*, kids-*, etc.)
│   ├── icons/                 # 12 two-tone dental icon PNGs
│   └── illustrations/         # ReCraft-generated assets (not currently used in components)
└── videos/                    # Ambassador intro video
```

## Design System

### Brand Colors (Tailwind v4 @theme tokens)
```
--color-brand-navy: #224888       (primary dark)
--color-brand-sky: #7CAEEB        (primary accent)
--color-brand-sky-light: #B8D6F5  (light accent)
--color-brand-sky-soft: #EEF5FC   (tint/background)
--color-dental-bg: #F8FAFC        (page background)
```

### Typography
- **Headings:** Poppins (400–800 weight)
- **Body:** Inter (400–600 weight)
- Loaded via Google Fonts

### Design Patterns
- SVG tooth/dental-tool line-art as subtle monochrome background decorations
- Sparkle star SVG accents scattered at low opacity
- IntersectionObserver scroll-triggered `.fade-in` animations
- CSS `animate-float` keyframe for gentle bobbing elements
- Sticky navbar with transparent→solid on scroll
- Mobile responsive with hamburger menu
- Bento grid layout for impact stats
- Photo cards with gradient overlays and hover reveal text

## Key Copy / Messaging

**H1:** "Bringing Dental Care to Every Community"
**Sub:** "Oral health is essential health. Through free clinics, school visits, and community partnerships, we're making dental care accessible to every Belizean — regardless of income or location."

The tone is nonprofit/mission-driven, not clinical/commercial. We are NOT a dental company — we're a nonprofit providing access, education, and outreach.

## Deployment

```bash
# Push to GitHub triggers Railway auto-deploy
git push origin claude/brand-style-guide-JzwUd
```

## Roadmap

- [ ] Add more pages: About, Programs detail, Get Involved, Donate
- [ ] Canvas briefing integration (canvas.html exports briefing for Claude brand strategy)
- [ ] Accessibility audit (alt text, ARIA, keyboard nav, contrast)
- [ ] Performance optimization (image compression, lazy loading audit)
- [ ] Integrate editorial-style photo cutouts into hero section (collage aesthetic)
