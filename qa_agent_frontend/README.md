# Product Support Q&A Frontend (React)

Modern, minimalistic single-page app for a product support assistant. Users can ask natural language questions and see concise answers, with a history panel, error notifications, and optional feedback.

## Features
- User input for natural language questions
- Concise answer rendering
- Query history side panel with clear option
- Error notification system with dismiss
- Optional feedback (thumbs up/down)
- Light, clean design using the specified color scheme:
  - Primary: `#62abf4`
  - Secondary: `#424242`
  - Accent: `#ffb300`

## Quick Start
- `npm start` – start dev server (defaults to http://localhost:3000). If port 3000 is busy, CRA may prompt to use another port.
- `npm run start:port` – start dev server on a fixed port using the PORT env var (defaults to 3000). Use this in CI/non-interactive contexts to avoid prompts.
- `npm test` – run tests
- `npm run build` – production build

If you see "This site can’t be reached" on http://localhost:3000, another process may already be using port 3000. Either stop that process or run the app on a different port by setting `PORT`:

- bash: `PORT=3001 npm start`
- cross-platform (uses cross-env): `npm run start:port` (set `PORT` in `.env` or inline as `PORT=3001 npm run start:port`)

## Environment
Create a `.env` using `.env.example` if integrating with a backend:
- `REACT_APP_API_BASE_URL` – Base URL for backend Q&A API (no trailing slash)
- `PORT` – Optional: Port for the CRA dev server (defaults to 3000). Set this to avoid interactive prompts when 3000 is in use.

By default, this app uses simulated API calls in `src/utils/api.js`. Replace those with `fetch` calls to your backend when available.

## Structure
- `src/App.js` – root layout and composition
- `src/App.css` – theme and component styles
- `src/context/QAContext.js` – centralized state and actions (ask, history, feedback)
- `src/components/*` – Header, Sidebar, QuestionInput, AnswerDisplay, Notification, Feedback
- `src/utils/api.js` – API utilities (currently simulated)

## Accessibility
- Keyboard submit (Enter)
- Alert role for error notifications
- Button labels and titles for clarity

## Notes
- Keep answers concise; long text is preserved with `pre-wrap`.
- History is local to the session and capped at 30 entries.

## Troubleshooting a blank page
If the app loads but the UI appears blank/white:

1) Check the browser console (DevTools → Console):
- If you see: `Cannot read properties of null (reading 'createRoot')`:
  - Cause: The host page does not have a `<div id="root"></div>` for React to mount.
  - Fix: Open the dev server root (e.g., http://localhost:3000/) instead of a wrapper like `/preview.html`, or ensure the host page contains an element with `id="root"`.
  - The app now auto-creates a `#root` element if missing, but serving the real CRA index.html is preferred.

- If you see: `useQA must be used within QAProvider`:
  - Cause: A component is using `useQA` outside `QAProvider`.
  - Fix: Ensure App or your route wraps children in `<QAProvider>...</QAProvider>`.

- If you see 404s for `/static/js/...` or MIME-type errors:
  - Cause: Scripts are not served from the right base path.
  - Fix: Open the CRA dev server root path (/) and avoid custom subpaths; for production builds, configure the `homepage` field in package.json or `PUBLIC_URL`.

2) Check Network tab:
- Reload and ensure `main.*.js` returns 200. If blocked or 404, adjust the URL to the dev server root.

3) Port/host issues:
- Ensure the dev server is actually running. If port 3000 is used by another process, run on a different port:
  - `PORT=3001 npm run start:port`

4) Error UI:
- We ship a basic Error Boundary that will display runtime render errors instead of a blank screen. Check the message shown on-screen and the console log for details.
