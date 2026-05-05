# markdown-negotiation

Exposes a markdown representation of the homepage for agent use.

## Endpoints

- `GET /index.md`
- `GET /` with `Accept: text/markdown` (edge middleware on supported hosts)

## Behavior

- HTML remains the default browser response.
- Supported edge middleware returns markdown with `Content-Type: text/markdown`.

