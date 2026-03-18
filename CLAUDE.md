# Smiles for Belize — Brand Website

## Project Overview

Nonprofit dental charity website for **Smiles for Belize**, providing free dental care to underserved communities across Belize. **Faith Edgar (Miss World Belize 2025)** is the brand ambassador.

**Repo:** `get-proofpilot/Smiles-for-Belize`
**Branch:** `claude/brand-style-guide-JzwUd` (default branch — no main branch)
**Hosting:** Railway (auto-deploys on push to GitHub)
**Stack:** Static HTML/CSS/JS served with `serve -s . -l $PORT`

## File Structure

| File | Purpose |
|------|---------|
| `index.html` | **Homepage** — 10-section nonprofit landing page (~1000 lines, self-contained) |
| `competitor-sections.html` | 13 competitor-inspired section patterns rebuilt with SFB brand |
| `brand-guidelines.html` | Brand identity reference page |
| `canvas.html` + `canvas.js` + `styles.css` | Interactive brand mood board canvas (FigJam-style tool) |
| `images/` | 36 photos (Instagram + video frame grabs) + 1 video |
| `images/icons/` | 12 custom two-tone dental icon PNGs (cropped from purchased spritesheet) |
| `package.json` | Just `serve` dependency for Railway |

## Design System

### Brand Colors (CSS custom properties in index.html)
```
--blue-deep: #0F3B7C    (primary dark)
--blue: #1B5AAF          (primary)
--blue-light: #7CB9E8    (sky/accent)
--blue-pale: #E8F2FC     (tint)
--coral: #E8734A         (CTA / warm accent)
--coral-dark: #d4573a
--gold: #F5C04A          (highlight)
--green: #4CAF7D         (success/nature)
--warm-cream: #FBF8F4    (page background)
--warm-sand: #F5F0E8     (alt section bg)
```

### Typography
- **Headings:** Poppins (400–800 weight)
- **Body:** Inter (400–600 weight)
- Loaded via Google Fonts

### Design Patterns Used
- Grain texture overlay (`body::after` SVG noise filter)
- Floating tooth SVG decorations with CSS keyframe animations
- Dot grid pattern backgrounds
- Gradient mesh / radial gradient hero backgrounds
- Wave SVG dividers between contrasting sections
- IntersectionObserver scroll-triggered `.fade-in` animations
- Sticky navbar with transparent → solid on scroll
- Mobile responsive with hamburger menu

## Homepage Sections (index.html)

1. **Sticky Nav** — Logo + links, transparent→solid on scroll
2. **Hero** — Full viewport, gradient mesh bg, floating teeth, dual CTAs
3. **Programs** — 4-card grid with photos + custom dental icons (dental clinic, healthy smile, oral hygiene, dentist shield)
4. **Impact Stats** — 4 stats on dark gradient background
5. **Ambassador** — Faith Edgar feature with pull quote
6. **B&W Photo Strip** — 5 images with hover colorize effect
7. **Where We Work** — 4 Belizean locations
8. **Testimonials** — 3 testimonial cards
9. **Donate CTA** — Coral gradient with selectable amount circles
10. **Footer** — 4-column grid

## Available Icons (images/icons/)

12 two-tone dental illustration PNGs, auto-trimmed:
- `icon-dental-clinic.png` — Dentist treating patient in chair
- `icon-screening.png` — Dental X-ray/report card
- `icon-treatment.png` — Tooth with drill
- `icon-root-canal.png` — Tooth with cleaning probe
- `icon-healthy-smile.png` — Sparkling smile with teeth
- `icon-teeth-cleaning.png` — Water jet cleaning with sparkles
- `icon-extraction.png` — Tooth extraction
- `icon-braces.png` — Braces/orthodontics
- `icon-oral-hygiene.png` — Toothpaste tube + toothbrush
- `icon-dentist-shield.png` — Dentist with protective tooth shield
- `icon-gum-health.png` — Tooth with gums
- `icon-happy-tooth.png` — Smiling tooth with crown

## Photo Library (images/)

36 photos organized by subject:
- `ambassador-*` — 19 photos of Faith Edgar (dental work, community events, pageant, casual)
- `clinic-wide.jpg`, `dental-care-bw.jpg` — Clinic/treatment shots
- `dental-*-detail.jpg`, `dental-*-closeup.jpg` — Procedure closeups
- `kids-*`, `students-*`, `screening-*` — School visits, screenings, brushing workshops
- `volunteers-talking-students.jpg` — Volunteer interactions
- `logo.jpg` — Organization logo
- `ambassador-video.mp4` — Video of Faith Edgar

## Deployment

```bash
# Push to GitHub triggers Railway auto-deploy
git push origin claude/brand-style-guide-JzwUd
```

## Next Steps / Roadmap

- [ ] Create custom SVG icons/illustrations (dental-themed decorative elements like floating teeth, sparkles, smile curves — similar to the ocean nonprofit inspiration site)
- [ ] Add more pages: About, Programs detail, Get Involved, Donate
- [ ] Canvas briefing integration (canvas.html exports briefing for Claude brand strategy)
- [ ] Accessibility audit (alt text, ARIA, keyboard nav, contrast)
- [ ] Performance optimization (image compression, lazy loading audit)
