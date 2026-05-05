# link-headers

Adds RFC 8288 discovery links for agent clients.

## Endpoint

- `GET /`

## Behavior

- Sends `Link` headers for `api-catalog`, `service-doc`, and `service-desc`.
- Also includes HTML `<link>` fallback entries in `index.html`.

