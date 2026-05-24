# Architecture

U Agent Open Source is organized as a small local demo that separates interface, mock API, sample data, and documentation.

## Components

### Frontend Demo

`frontend-demo/` contains a static HTML, CSS, and JavaScript interface. It shows a support queue, a selected customer thread, safety notes, and a deterministic draft reply. The UI is intentionally framework-free so it can be inspected without installing dependencies.

### Backend Mock

`backend-mock/` contains a local Node.js server built with the standard library. It exposes mock health, thread list, and draft endpoints. The draft endpoint is deterministic and does not call a model provider or external service.

### Sample Data

`sample-data/` contains fake customer support threads. The data is designed to exercise UI states without representing real customers, real accounts, or real operational records.

## Data Flow

1. The browser loads `frontend-demo/index.html`.
2. The frontend requests fake threads from the local mock API.
3. If the mock API is unavailable, the frontend uses embedded fallback data.
4. Selecting a thread renders fake messages and a safe canned draft.
5. The local mock API can return a deterministic draft for the selected thread.

## Boundaries

The demo has no production network dependency. It should remain suitable for public review, onboarding, design discussion, and documentation without exposing private implementation details.
