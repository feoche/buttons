# api-catalog

Publishes an API catalog in JSON linkset format for automated API discovery.

## Endpoint

- `GET /.well-known/api-catalog`

## Behavior

- Returns `application/linkset+json`.
- Includes `anchor`, `service-desc`, `service-doc`, and `status` links.

