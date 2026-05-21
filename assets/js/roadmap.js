const roadmapGrid = document.getElementById("roadmap-grid");
const roadmapCount = document.getElementById("roadmap-count");

let roadmapItems = [];

initializeRoadmap();

async function initializeRoadmap() {
  try {
    const response = await fetch("data/roadmap.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Unable to load roadmap data.");
    }

    roadmapItems = await response.json();

    renderRoadmap(roadmapItems);
  } catch (error) {
    renderError(error);
  }
}

/* =========================================
   Render Roadmap
========================================= */

function renderRoadmap(items) {
  roadmapGrid.innerHTML = "";

  roadmapCount.textContent =
    `${items.length} roadmap phase${items.length === 1 ? "" : "s"}`;

  if (!items.length) {
    roadmapGrid.innerHTML = `
      <article class="forge-card">
        <span class="card-kicker">Empty</span>
        <h2>No roadmap items available</h2>
        <p>Roadmap data has not been published yet.</p>
      </article>
    `;
    return;
  }

  items.forEach(item => {
    roadmapGrid.appendChild(createRoadmapCard(item));
  });
}

/* =========================================
   Create Card
========================================= */

function createRoadmapCard(item) {
  const card = document.createElement("article");

  card.className = "forge-card roadmap-card preload-card";

  const tasks = Array.isArray(item.items)
    ? item.items
    : [];

  card.innerHTML = `
    <div>
      <span class="card-kicker">
        ${escapeHTML(item.phase || "Phase")}
      </span>

      <h2>
        ${escapeHTML(item.title || "Untitled")}
      </h2>

      <p>
        ${escapeHTML(item.description || "")}
      </p>
    </div>

    <dl class="meta">
      <div>
        <dt>Status</dt>
        <dd>
          ${escapeHTML(item.status || "Planned")}
        </dd>
      </div>

      <div>
        <dt>Focus</dt>
        <dd>
          ${escapeHTML(item.focus || "General Development")}
        </dd>
      </div>
    </dl>

    <div>
      <p class="eyebrow">Planned Work</p>

      <ul class="clean">
        ${tasks.map(task => `
          <li>${escapeHTML(task)}</li>
        `).join("")}
      </ul>
    </div>
  `;

  return card;
}

/* =========================================
   Error Handling
========================================= */

function renderError(error) {
  roadmapGrid.innerHTML = `
    <article class="forge-card">
      <span class="card-kicker">Error</span>

      <h2>Roadmap unavailable</h2>

      <p>
        ${escapeHTML(error.message)}
      </p>
    </article>
  `;

  roadmapCount.textContent = "Load failure";
}

/* =========================================
   Utilities
========================================= */

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}