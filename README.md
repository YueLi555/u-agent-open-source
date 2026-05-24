# U Agent Open Source

This is an open-source-safe starter folder for U Agent. It is a local, mock-only demo scaffold intended to show the product shape without exposing private infrastructure, customer data, credentials, paid service code, native app packaging assets, or live third-party integrations.

# Download APP and Read the Website 
Download on Apple store: U Agent
Website: uagent.app

## What Is Included

- Static frontend demo for reviewing a fake support workflow.
- Local mock backend using only built-in Node.js modules.
- Fake sample customer threads for demonstration.
- Architecture and safety boundary documentation.
- Basic security policy and ignore rules.

## What Is Not Included

- Live service endpoints or production domains.
- Private environment files or credentials.
- Real customer data.
- Real inbox, storage, identity, billing, native app packaging, or deployment integrations.
- App review, packaging, or store configuration.

## Folder Layout

```text
u-agent-open-source/
  README.md
  package.json
  LICENSE
  SECURITY.md
  .gitignore
  docs/
    architecture.md
    safety-boundaries.md
  scripts/
    launch-open-source.js
    serve-frontend.js
  frontend-demo/
    index.html
    styles.css
    app.js
  backend-mock/
    README.md
    server.js
  sample-data/
    fake-customer-threads.json
```

## Run locally

Start both local servers:

```bash
npm start
```

Open the frontend in a browser if you want the launcher to do that for you:

```bash
npm run start:open
```

Other useful commands:

```bash
npm run backend
npm run frontend
npm run frontend:open
npm run smoke
```

The frontend first tries the local mock API at `http://127.0.0.1:8787`; if the API is not running, it falls back to embedded mock data in the browser.

## Development Principles

This folder should stay safe to publish. Add only mock data, local-only demo code, documentation, tests, and examples that do not depend on private infrastructure.
