# Safety Boundaries

This folder is safe to publish only while it remains a mock-only demo. Treat the following boundaries as hard rules for future changes.

## Allowed

- Static UI examples.
- Local mock server code.
- Fake sample data.
- Documentation.
- Tests that use local fixtures only.
- Generic setup instructions that do not reveal private infrastructure.

## Not Allowed

- Private environment files.
- Real customer records or customer identifiers.
- Live service endpoints or production domains.
- Real inbox, storage, identity, billing, native app packaging, or deployment integrations.
- App review flows, signing assets, or store configuration.
- Any credential, key, token, certificate, or private configuration value.

## Review Checklist

Before publishing or sharing changes from this folder:

1. Confirm all data is fake.
2. Confirm no live endpoint or production domain appears in code or docs.
3. Confirm no private configuration file was copied in.
4. Confirm no real integration code was copied from private repositories.
5. Confirm the mock backend is deterministic and local-only.
