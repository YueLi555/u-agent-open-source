const API_BASE = "http://127.0.0.1:8787";

const fallbackThreads = [
  {
    id: "thread_demo_001",
    customer: "Avery Park",
    subject: "Question about workspace invitations",
    status: "open",
    summary: "Needs help understanding why a teammate invitation is pending.",
    messages: [
      {
        role: "customer",
        author: "Avery Park",
        time: "09:12",
        body: "I invited a teammate to our workspace, but the invite still says pending. Can someone confirm what they should check?"
      },
      {
        role: "agent",
        author: "Support",
        time: "09:18",
        body: "Thanks for reaching out. I can help check the expected invite flow and next steps."
      }
    ]
  },
  {
    id: "thread_demo_002",
    customer: "Mina Cole",
    subject: "Notification settings are too noisy",
    status: "open",
    summary: "Wants fewer alerts for low-priority workspace updates.",
    messages: [
      {
        role: "customer",
        author: "Mina Cole",
        time: "10:04",
        body: "I like the updates, but I am getting too many notifications for small workspace changes."
      }
    ]
  }
];

let threads = [];
let selectedThreadId = "";

const threadList = document.querySelector("#threadList");
const threadTitle = document.querySelector("#threadTitle");
const threadStatus = document.querySelector("#threadStatus");
const messageList = document.querySelector("#messageList");
const draftBox = document.querySelector("#draftBox");
const refreshDraft = document.querySelector("#refreshDraft");

async function loadThreads() {
  try {
    const response = await fetch(`${API_BASE}/threads`);
    if (!response.ok) {
      throw new Error("Mock API returned an error");
    }
    const payload = await response.json();
    threads = payload.threads;
    threadStatus.textContent = "Mock API";
  } catch {
    threads = fallbackThreads;
    threadStatus.textContent = "Fallback";
  }

  selectedThreadId = threads[0]?.id || "";
  render();
}

function render() {
  renderThreadList();
  renderSelectedThread();
}

function renderThreadList() {
  threadList.innerHTML = "";

  threads.forEach((thread) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `thread-card${thread.id === selectedThreadId ? " is-selected" : ""}`;
    button.innerHTML = `
      <strong>${escapeHtml(thread.customer)}</strong>
      <span>${escapeHtml(thread.subject)}</span>
    `;
    button.addEventListener("click", () => {
      selectedThreadId = thread.id;
      render();
    });
    threadList.appendChild(button);
  });
}

function renderSelectedThread() {
  const thread = getSelectedThread();
  if (!thread) {
    threadTitle.textContent = "No mock threads";
    messageList.innerHTML = "";
    draftBox.textContent = "No draft available.";
    return;
  }

  threadTitle.textContent = thread.subject;
  messageList.innerHTML = "";

  thread.messages.forEach((message) => {
    const item = document.createElement("article");
    item.className = `message ${message.role}`;
    item.innerHTML = `
      <div class="message-meta">
        <strong>${escapeHtml(message.author)}</strong>
        <span>${escapeHtml(message.time)}</span>
      </div>
      <p>${escapeHtml(message.body)}</p>
    `;
    messageList.appendChild(item);
  });

  draftBox.textContent = buildFallbackDraft(thread);
}

async function regenerateDraft() {
  const thread = getSelectedThread();
  if (!thread) {
    return;
  }

  refreshDraft.disabled = true;
  refreshDraft.textContent = "Generating";

  try {
    const response = await fetch(`${API_BASE}/assistant/draft`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ threadId: thread.id })
    });
    if (!response.ok) {
      throw new Error("Mock draft failed");
    }
    const payload = await response.json();
    draftBox.textContent = payload.draft;
  } catch {
    draftBox.textContent = buildFallbackDraft(thread);
  } finally {
    refreshDraft.disabled = false;
    refreshDraft.textContent = "Regenerate mock draft";
  }
}

function getSelectedThread() {
  return threads.find((thread) => thread.id === selectedThreadId);
}

function buildFallbackDraft(thread) {
  return [
    `Hi ${thread.customer.split(" ")[0]},`,
    "",
    `Thanks for the note about "${thread.subject}". I reviewed the mock thread and would suggest confirming the expected setting, sharing the next local-only troubleshooting step, and asking whether the issue is resolved.`,
    "",
    "Best,",
    "U Agent Demo"
  ].join("\n");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

refreshDraft.addEventListener("click", regenerateDraft);
loadThreads();
