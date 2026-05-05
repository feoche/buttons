# webmcp

Provides browser-native tools through the WebMCP API when available.

## Endpoint

- `GET /` (tool registration on page load)

## Behavior

- Calls `navigator.modelContext.provideContext()` with tool definitions.
- Exposes read-only tools for catalog search and category listing.

