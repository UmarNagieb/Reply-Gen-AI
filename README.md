# Gibbs ReplyGen AI

A full-stack email-reply drafting app built with TanStack Start, React 19, and JavaScript. The app runs on Cloudflare Workers and uses OpenRouter to generate replies.

## Run locally

```bash
npm install
```

Create a `.dev.vars` file in the project root and set the server-side OpenRouter key:

```text
OPENROUTER_API_KEY=your-key
```

Then start the development server:

```bash
npm run dev
```

## Build and deploy

```bash
npm run lint
npm run build
npx wrangler deploy --config dist/server/wrangler.json
```

Before deploying, configure the production key as a Worker secret:

```bash
npx wrangler secret put OPENROUTER_API_KEY
```

The HTML document is rendered by `src/routes/__root.jsx`; there is no `index.html`. The Cloudflare Vite plugin runs server code in the Workers runtime in development and builds.

## Project structure

- `src/routes/` contains file-based routes.
- `src/components/` contains the app UI and reusable components.
- `src/lib/server-fns.js` contains validated server functions used by the app.
- `src/server.js` is the Cloudflare Worker entry point.
