const http = require("http");
const fs = require("fs");
const path = require("path");

const HOST = "127.0.0.1";
const PORT = 8787;
const DATA_PATH = path.join(__dirname, "..", "sample-data", "fake-customer-threads.json");

function readThreads() {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  return JSON.parse(raw).threads;
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type"
  });
  response.end(JSON.stringify(payload, null, 2));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10_000) {
        request.destroy();
        reject(new Error("Request body too large"));
      }
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function buildDraft(thread) {
  const firstName = thread.customer.split(" ")[0];
  return [
    `Hi ${firstName},`,
    "",
    `Thanks for writing in about "${thread.subject}". I checked the mock conversation and the next best step is to confirm the current setting, try the local troubleshooting step, and reply with the result so the support team can close the loop.`,
    "",
    "Best,",
    "U Agent Demo"
  ].join("\n");
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  const url = new URL(request.url, `http://${HOST}:${PORT}`);

  if (request.method === "GET" && url.pathname === "/health") {
    sendJson(response, 200, { ok: true, mode: "mock" });
    return;
  }

  if (request.method === "GET" && url.pathname === "/threads") {
    sendJson(response, 200, { threads: readThreads() });
    return;
  }

  if (request.method === "POST" && url.pathname === "/assistant/draft") {
    const body = await readBody(request);
    const parsed = body ? JSON.parse(body) : {};
    const thread = readThreads().find((item) => item.id === parsed.threadId);

    if (!thread) {
      sendJson(response, 404, { error: "Unknown mock thread" });
      return;
    }

    sendJson(response, 200, {
      threadId: thread.id,
      draft: buildDraft(thread)
    });
    return;
  }

  sendJson(response, 404, { error: "Not found" });
});

server.listen(PORT, HOST, () => {
  console.log(`U Agent mock server listening at http://${HOST}:${PORT}`);
});
