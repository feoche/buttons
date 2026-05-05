export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const accept = request.headers.get("accept") || "";

  const isHome = url.pathname === "/" || url.pathname === "/index.html";
  const wantsMarkdown = request.method === "GET" && isHome && accept.includes("text/markdown");

  let response;
  if (wantsMarkdown) {
    const markdownRequest = new Request(new URL("/index.md", request.url), request);
    response = await context.next(markdownRequest);
  } else {
    response = await context.next();
  }

  const headers = new Headers(response.headers);

  if (isHome) {
    headers.append(
      "Link",
      '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"'
    );
    headers.append("Link", '</docs/api>; rel="service-doc"; type="text/markdown"');
    headers.append(
      "Link",
      '</api/openapi.json>; rel="service-desc"; type="application/openapi+json"'
    );
    headers.append(
      "Link",
      '</.well-known/mcp/server-card.json>; rel="describedby"; type="application/json"'
    );
    headers.append("Vary", "Accept");
  }

  if (wantsMarkdown && response.ok) {
    headers.set("Content-Type", "text/markdown; charset=utf-8");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

