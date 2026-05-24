const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const HOST = "127.0.0.1";
const PORT = Number(process.env.FRONTEND_PORT || 3000);
const ROOT = path.resolve(__dirname, "..", "frontend-demo");
const OPEN_REQUESTED = process.argv.includes("--open") || process.env.OPEN_BROWSER === "1";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function openBrowser(url) {
  const command =
    process.platform === "darwin"
      ? ["open", [url]]
      : process.platform === "win32"
        ? ["cmd", ["/c", "start", "", url]]
        : ["xdg-open", [url]];

  try {
    const child = spawn(command[0], command[1], {
      detached: true,
      stdio: "ignore"
    });
    child.on("error", (error) => {
      console.warn(`Could not open browser automatically: ${error.message}`);
    });
    child.unref();
  } catch (error) {
    console.warn(`Could not open browser automatically: ${error.message}`);
  }
}

function send(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, {
    "content-type": "text/plain; charset=utf-8",
    ...headers
  });
  response.end(body);
}

function serveFile(response, requestPath) {
  const fullPath = path.resolve(ROOT, `.${requestPath}`);
  const relative = path.relative(ROOT, fullPath);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    send(response, 403, "Forbidden");
    return;
  }

  fs.readFile(fullPath, (error, buffer) => {
    if (error) {
      send(response, 404, "Not found");
      return;
    }

    const contentType = MIME_TYPES[path.extname(fullPath).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, { "content-type": contentType });
    response.end(buffer);
  });
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${HOST}:${PORT}`);
  const pathname = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  serveFile(response, pathname);
});

server.listen(PORT, HOST, () => {
  const url = `http://${HOST}:${PORT}`;
  console.log(`U Agent frontend demo serving at ${url}`);
  if (OPEN_REQUESTED) {
    openBrowser(url);
  }
});

function shutdown(signal) {
  server.close(() => {
    console.log(`Frontend server stopped after ${signal}`);
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
