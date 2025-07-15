# URL Shortener React App – Design Document

## Architecture & Folder Structure

- **src/**
  - **pages/**: Page-level components (UrlShortenerPage, StatisticsPage, RedirectHandler)
  - **components/**: Reusable UI components (to be added)
  - **utils/**: Utility functions (e.g., validation, logging)
  - **hooks/**: Custom React hooks (to be added)
  - **App.tsx**: Main app component with routing
  - **main.tsx**: Entry point, theme setup

## Technology Stack

- **React** (with TypeScript): UI logic and rendering
- **Material UI**: Component library for styling
- **React Router DOM**: Client-side routing
- **localStorage/sessionStorage**: Client-side persistence

## Routing Strategy

- `/` – URL Shortener Page
- `/stats` – Statistics Page
- `/:shortcode` – Redirection Handler

## Data Modeling & Persistence

- Store shortened URLs, analytics, and logs in localStorage/sessionStorage
- Track: shortcode, original URL, creation/expiry time, click count, click source, geolocation

## Key Design Decisions

- Functional components and React hooks
- Custom logging middleware (no console.log)
- All validation and error handling client-side
- Responsive, minimal UI with Material UI

## Assumptions

- No backend; all logic is client-side
- Users are pre-authorized (no auth UI)
- Geolocation via public API (country/region only)

---

*Details to be expanded as implementation progresses.* 