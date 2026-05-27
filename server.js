import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const distDir = resolve(__dirname, "dist");
const port = Number(process.env.PORT) || 4173;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function getSafePath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split("?")[0] ?? "/");
  const requestedPath = normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  return resolve(join(distDir, requestedPath));
}

async function readStaticFile(filePath) {
  const fileStat = await stat(filePath);
  if (fileStat.isDirectory()) {
    return readStaticFile(join(filePath, "index.html"));
  }

  return {
    body: await readFile(filePath),
    type: contentTypes[extname(filePath)] ?? "application/octet-stream",
  };
}

createServer(async (request, response) => {
  try {
    const filePath = getSafePath(request.url ?? "/");

    if (!filePath.startsWith(distDir)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const file = await readStaticFile(filePath);
    response.writeHead(200, { "Content-Type": file.type });
    response.end(file.body);
  } catch {
    const fallback = await readFile(join(distDir, "index.html"));
    response.writeHead(200, { "Content-Type": contentTypes[".html"] });
    response.end(fallback);
  }
}).listen(port, "0.0.0.0", () => {
  console.log(`Serving frontend on 0.0.0.0:${port}`);
});
