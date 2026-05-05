# ai-rules

Defines explicit AI crawler directives in `robots.txt`.

## Endpoint

- `GET /robots.txt`

## Behavior

- Provides dedicated blocks for `GPTBot`, `OAI-SearchBot`, `Claude-Web`, and `Google-Extended`.
- Uses explicit `Allow` and `Disallow` rules for protected paths.

