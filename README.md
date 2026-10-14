# Wania Naeem — UI/UX Designer Portfolio

Static site (HTML + CSS + JS, GSAP ScrollTrigger). Open `index.html` to run.

## Update content (only edit `data.js`)
- `site.email`, `site.socials`, `site.formEndpoint` — contact details (empty = hidden)
- `projects` — 4 projects: title, category, status, description, tools, figmaUrl, prototypeUrl, images
- `journey` — academic journey milestones

## Add your real screens
Put images in `assets/projects/<folder>/` using the file names listed in `data.js`:
- `donation-routing/` 01-registration.png, 02-login.png, 03-donation.png, 04-donation-tracking.png
- `styra/` screen-01.png … (add more entries in data.js as you design)
- `ecommerce/` 01-onboarding.png, 02-home.png, 03-product.png
- `screens/` screen-01.png … (any number)

Until an image exists, a neutral placeholder is shown.

## Colors
All colors are CSS variables at the top of `styles.css` (`:root`).
