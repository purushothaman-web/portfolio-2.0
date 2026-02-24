# Purushothaman R — Portfolio 2.0

> *"Developing the hidden logic that powers seamless user experiences."*

---

## The Story Behind This Portfolio

Every developer reaches a point where their online presence needs to match the work they're doing — not just list it. This portfolio is version 2.0 of that effort.

The first version was a hacker-aesthetic experiment: terminals, dark grids, blinking cursors. It was fun to build. But as my focus shifted from frontend tinkering to backend architecture and full-stack development, the presentation needed to evolve too. Version 2.0 is the result — an **editorial, narrative-driven** redesign built to tell a story, not just display a résumé.

The design philosophy is simple: clean typography, intentional whitespace, and a layout that guides the reader through the development journey rather than overwhelming them with information.

---

## What's Inside

The site is a single-page application with six sections, each with a specific purpose:

- **Home** — The hook. A bold typographic hero that states the value proposition immediately, paired with a stats card showing the core stack and years of experience (which auto-increments every February 12th, the career anniversary date).

- **About** — The story. A two-column editorial layout with a sticky bio card and a long-form narrative about the transition from frontend development to backend architecture.

- **Projects** — The evidence. Projects presented as architectural case studies — each one framed around the problem it solved, the design decisions made, and the measurable impact.

- **Skills** — The inventory. Skills organized by functional role (Data & Infrastructure, Business Logic, Client Interface) rather than an arbitrary list of logos.

- **Achievements** — The credentials. A numbered editorial list of certifications with inline skill tags, credential IDs, and direct verification links.

- **Contact** — The open door. A minimal, welcoming contact section with a working email form powered by EmailJS.

---

## The Technical Foundation

This is not a CRA bootstrap or a template. Everything was built deliberately:

```
React 19 + TypeScript   — UI and type safety
Vite                    — Build tooling
Tailwind CSS v4         — Styling via @theme configuration
Framer Motion           — Scroll-aware animations
Lucide React            — Icon system
EmailJS                 — Contact form without a backend
Vite Plugin PWA         — Installable as a native-like app
```

The scroll-based navigation uses a custom `IntersectionObserver` hook — no router, no hash routing library. Sections are observed as they enter the viewport and the active navbar link updates accordingly. Smooth scroll offsets account for the fixed navbar height automatically.

---

## Running It Locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/purushothaman-web/portfolio-2.0.git
cd portfolio-2.0
npm install
```

The contact form requires EmailJS credentials. Create a `.env` file from the provided example:

```bash
cp .env.example .env
```

Then fill in your EmailJS service, template, and public key:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

Start the development server:

```bash
npm run dev
```

---

## Deploying

The project is pre-configured for **Netlify** (see `netlify.toml`) and works equally well on **Vercel**. Connect your GitHub repository, add the three EmailJS environment variables in the platform's settings panel, and deploy. The PWA manifest and sitemap are already in place.

---

## Contact

**Purushothaman R**  
Full Stack Developer — Bangalore, KA (originally from Vellore, TN)  
[rpurushothaman500@gmail.com](mailto:rpurushothaman500@gmail.com)  
[github.com/purushothaman-web](https://github.com/purushothaman-web)
