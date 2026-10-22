# Michael John Ojoy — Portfolio

Responsive personal portfolio built with React, Vite, and CSS. Content is based on Michael's previous portfolio and the projects in the adjacent `Live Projects` and `Ongoing Projects` folders.

## Run locally

Node.js 24 or newer is required.

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:8080`. The dev server uses strict port binding so a port conflict is visible rather than silently moving to another port.

## Verify

```powershell
npm run lint
npm test
npm run build
```

For a local production preview, run `npm run preview` after building. Stop the development server first because both commands use port 8080.

## Deploy

This is a static Vite site. `vercel.json` sets the Vite framework preset, `npm run build`, and `dist` as the output directory. No server secrets or runtime services are required. The directory is linked to `michael-john-dev/michael-john-ojoy-portfolio`, published at [michaeljohnojoy-portfolio.vercel.app](https://michaeljohnojoy-portfolio.vercel.app/). This is the canonical URL and a verified project domain. The original `michael-john-ojoy.vercel.app` address remains assigned outside this Vercel team.

Edit `src/data.js` to update projects and experience. Projects are grouped by the `type` field (`client` or `self`) and rendered under Client Projects or Self-Initiative Projects. The four project previews in `public/projects` are screenshots of the linked live sites; refresh them when those sites change. Update contact links and the tech stack groups in `src/App.jsx`. The header role animation lives in `src/components/AnimatedTitle.jsx`.

The header continuously types and erases both roles, with a quiet synthesized mechanical-key click for each character. Browser audio policies may delay the sound until the visitor first clicks, taps, or presses a key on the page. The sound is silent while the page is hidden.

Project cards reveal once as they enter view, with staggered timing on larger screens. Hovering or focusing a card lifts the preview, subtly enlarges its image, and highlights its title. Visitors who prefer reduced motion see a shorter fade and stationary hover emphasis.

Tech stack groups reveal independently as they enter view. Each icon and label drops from near its group heading one at a time. This requested effect also plays when the browser prefers reduced motion; motion behavior elsewhere is unchanged.

The hero illustration uses CSS-built desktop, laptop, and phone views. Each rises from a flat position in sequence when the scene first enters view; no external image or animation library is needed.

The experience timeline reveals its rows in order as they enter the viewport, sliding alternately from the left and right. Reduced-motion visitors see the rows without lateral movement. The contact email is displayed as plain text, while LinkedIn remains a link; the three contact icons use distinct accent colors.
