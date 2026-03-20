# Purushothaman R — Portfolio 2.0

> *"Developing the hidden logic that powers seamless user experiences."*

---

## Live Environment
- **Primary Domain**: [purushoth.is-a.dev](https://purushoth.is-a.dev)

---

## The Vision

Every developer reaches a point where their online presence needs to match the work they're doing — not just list it. This portfolio is a **clean, full-stack narrative** built to tell a story through architecture, consistency, and professional communication.

The design philosophy is simple: clean typography, intentional whitespace, and a layout that guides the reader through the development journey rather than overwhelming them with information.

---

## What's Inside

The site is a full-stack application with seven key sections, each with a specific purpose:

- **Home** — The hook. A bold typographic hero featuring a stats card and a direct **LinkedIn** call-to-action alongside GitHub.
- **About** — The story. A two-column editorial layout with a long-form narrative about the transition from frontend development to backend architecture.
- **GitHub Activity** — The evidence of consistency. A custom-built **GitHub Contribution Heatmap** that pulls live, global data through a high-performance backend scraper.
- **Projects** — The architectural case studies. Projects framed around the problem they solved, the design decisions made, and the measurable impact.
- **Skills** — The inventory. Skills organized by functional roles.
- **Achievements** — The credentials. A numbered editorial list of certifications with verification links.
- **Contact** — The open door. A professional contact section with a dedicated backend email service and LinkedIn integration.

---

## The Technical Foundation

This project is built on a robust **full-stack architecture**:

```
Frontend (Netlify):
React 19 + TypeScript   — UI and type safety
Vite                    — Build tooling
Tailwind CSS v4         — Styling via @theme configuration
Framer Motion           — Cell-tracking tooltips and scroll animations

Backend (Vercel):
Node.js + Express       — API layer (Vite-proxied)
Custom HTML Scraper     — Global GitHub contribution data fetching
Nodemailer              — Custom contact form email service
```

---

## Split Deployment Strategy

This project is optimized for a **split deployment** to leverage the best features of both Netlify and Vercel:

### 1. Backend (Vercel)
The `api/` folder contains standalone Vercel Functions.
- **Deployment**: Deploy the repository to Vercel. Vercel will automatically detect the `api` directory and host your serverless functions.
- **Env Vars**: Set `GITHUB_TOKEN`, `GITHUB_USERNAME`, `SMTP_USER`, and `SMTP_PASS` in the Vercel dashboard.

### 2. Frontend (Netlify)
The React UI is hosted on Netlify and proxies API requests to Vercel.
- **Proxy Setup**: In `netlify.toml`, update the `/api/*` redirect rule with your actual Vercel backend URL:
  ```toml
  [[redirects]]
    from = "/api/*"
    to = "https://your-vercel-backend.vercel.app/api/:splat"
    status = 200
  ```
- **Deployment**: Connect your repo to Netlify. It will build the `dist` folder and use the redirects to communicate with the Vercel backend seamlessly.

---

## Running It Locally

Clone the repository and install dependencies for both the frontend and the `api` folder:

```bash
npm install
cd api && npm install && cd ..
```

The contact form requires SMTP credentials. Create an `api/.env` file from the provided `api/env.example` and start the development server:

```bash
npm run dev
```

---

## Contact

**Purushothaman R**  
Full Stack Developer — Bangalore, India  
[rpurushothaman500@gmail.com](mailto:rpurushothaman500@gmail.com)  
[linkedin.com/in/purushothaman-web](https://www.linkedin.com/in/purushothaman-web/)  
[github.com/purushothaman-web](https://github.com/purushothaman-web)
