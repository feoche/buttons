# robots-txt

Defines crawl rules and AI crawler policy at `/robots.txt`.

## Endpoints

- `GET /robots.txt`
- `GET /sitemap.xml`

## Behavior

- Provides RFC 9309 compatible `User-agent`, `Allow`, and `Disallow` directives.
- Lists dedicated entries for `GPTBot`, `OAI-SearchBot`, `Claude-Web`, and `Google-Extended`.
- Includes a `Sitemap` directive pointing to `https://mybuttons.fr/sitemap.xml`.

