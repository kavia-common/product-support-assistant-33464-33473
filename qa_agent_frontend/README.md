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
- `npm start` – start dev server (http://localhost:3000)
- `npm test` – run tests
- `npm run build` – production build

## Environment
Create a `.env` using `.env.example` if integrating with a backend:
- `REACT_APP_API_BASE_URL` – Base URL for backend Q&A API (no trailing slash)

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
