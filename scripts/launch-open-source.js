const { spawn } = require("child_process");
const path = require("path");

const OPEN_REQUESTED = process.argv.includes("--open") || process.env.OPEN_BROWSER === "1";

const processes = [];
let shuttingDown = false;

function start(name, scriptPath, extraArgs = []) {
  const child = spawn(process.execPath, [scriptPath, ...extraArgs], {
    stdio: "inherit"
  });

  child.on("exit", (code, signal) => {
    if (signal || code !== 0) {
      stopAll(`${name} exited ${signal || code}`);
    }
  });

  processes.push(child);
  return child;
}

function stopAll(reason) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  for (const child of processes) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  if (reason) {
    console.log(reason);
  }
}

const backendScript = path.join(__dirname, "..", "backend-mock", "server.js");
const frontendScript = path.join(__dirname, "serve-frontend.js");

start("backend", backendScript);
start("frontend", frontendScript, OPEN_REQUESTED ? ["--open"] : []);

process.on("SIGINT", () => {
  stopAll("Interrupted");
  process.exit(0);
});

process.on("SIGTERM", () => {
  stopAll("Terminated");
  process.exit(0);
});
