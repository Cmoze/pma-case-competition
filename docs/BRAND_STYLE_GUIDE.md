# BYU Marriott Brand Style Guide (for the PMA Website)

Source: https://marriott.byu.edu/brand/, which builds on the university guide at https://brand.byu.edu. This page distills it into concrete values for this codebase. Follow it for any new UI.

## Colors

Primary
| Name  | Hex     | HSL              | Notes |
|-------|---------|------------------|-------|
| Navy  | #002E5D | 210 100% 18%     | The BYU Marriott color. Never treat an accent color as equal or secondary to Navy. |
| White | #FFFFFF | 0 0% 100%        | |

Secondary
| Name       | Hex     | HSL           |
|------------|---------|---------------|
| Royal      | #003DA5 | 218 100% 32%  |
| Slate Gray | #7C878E | 203 7% 52%    |

Accent, light tones (use sparingly)
| Name        | Hex     |
|-------------|---------|
| Yellow      | #F2CD00 |
| Orange      | #DC8633 |
| Purple      | #9B7793 |
| Green       | #6FA287 |
| Slate Blue  | #5B7F95 |

Accent, medium tones
| Name   | Hex     |
|--------|---------|
| Brown  | #9E652E |
| Red    | #D14124 |
| Purple | #72246C |
| Green  | #44693D |
| Blue   | #006FA8 |

Accent, dark tones
| Name        | Hex     |
|-------------|---------|
| Dark Brown  | #493C38 |
| Maroon      | #51140C |
| Dark Purple | #3D023C |
| Dark Green  | #023508 |
| Dark Blue   | #011C2B |

Rules:
* Navy and white carry the brand. Accent colors support one specific, limited message (one stat callout, one badge). They are not a general palette.
* Do not pair an accent color with Navy in a way that suggests the accent has equal or secondary status.
* Avoid hardcoded hex values in components. Use the theme tokens below.

### CSS token mapping (`src/index.css` and shadcn tokens)

| shadcn/Tailwind token      | Brand color | HSL          |
|-----------------------------|-------------|--------------|
| `--primary` / `--ring`      | Navy        | 210 100% 18% |
| `--primary-foreground`      | White       | 0 0% 100%    |
| `--secondary`               | Royal       | 218 100% 32% |
| `--secondary-foreground`    | White       | 0 0% 100%    |
| `--muted-foreground`        | Slate Gray  | 203 7% 52%   |
| `--accent`                  | One accent color only, not the full set |
| `--accent-foreground`       | White or Navy, whichever has better contrast against the accent |

If you need an accent and are unsure which, use Slate Blue (#5B7F95). It sits closest to Royal and Navy.

## Typography

* Headlines: **Libre Franklin** (Google Fonts), the free stand in for BYU's Franklin Gothic fallback. Lean on weights 700 to 900 for presence. Tailwind class: `font-heading`.
* Body and UI: **IBM Plex Sans** (Google Fonts), the university's own web body font. Tailwind class: `font-sans` (the default).
* Use 18px (1.125rem) as the floor for body text.
* Never use more than two typefaces in one piece. Logos are exempt.

| Level | Font | Size | Weight |
|-------|------|------|--------|
| H1 | Libre Franklin | 2.75rem / 44px (mobile 2.25rem / 36px) | 800 |
| H2 | Libre Franklin | 2rem / 32px | 700 |
| H3 | Libre Franklin | 1.5rem / 24px | 700 |
| H4 | Libre Franklin | 1.25rem / 20px | 600 |
| Body | IBM Plex Sans | 1.125rem / 18px | 400 |
| Small and UI | IBM Plex Sans | 0.875rem / 14px | 400 to 500 |

## Pattern (background motif)

* The BYU Marriott pattern is a repeating "M" shape tiled at a fixed 30 degree angle. It is a background texture, not an icon or logo. Never crop it down to a single M.
* Always render it in Navy over a solid background color, never over photos, illustrations, or another pattern.
* If the composition uses an accent color, balance it with an equal amount of Navy.
* When cropping the pattern, follow the angle of the M edges. Never cut straight through an M.

## Logos

* Keep the existing PMA mark as is. Do not redraw or recolor it.
* Student association logos must not mimic or contain any part of a BYU or BYU Marriott logo, must not include BYU athletic marks (stretch Y, cougar head), and must not spell out "BYU" in custom type.
* BYU Marriott logos come only in Full Color (navy and slate gray), Navy, White, and Black. Never distort, stretch, add effects, rearrange, or place them on low contrast backgrounds.

## Voice and content patterns

* Copy is mission driven. Headlines are short and aspirational; procedural pages are plain and practical with clear instructions.
* Social proof favors concrete stat callouts (big numbers) and short profile cards (name, class year, role) over long quoted testimonials.
* Footers carry social icons, utility links, and a copyright line.
