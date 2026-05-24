# Backend Mock

This folder contains a dependency-free local mock server for the U Agent demo.

## Run

```bash
node server.js
```

The server listens on `http://127.0.0.1:8787` and exposes:

- `GET /health`
- `GET /threads`
- `POST /assistant/draft`

All responses are deterministic and based on fake sample data.
