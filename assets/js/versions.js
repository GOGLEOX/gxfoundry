const versionsGrid = document.getElementById("versions-grid");
const versionsCount = document.getElementById("versions-count");

let versionItems = [];

initializeVersions();

async function initializeVersions() {
  try {
    const response = await fetch("data/versions.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Unable to load version outlook data.");
    }

    versionItems = await response.json();

    renderVersions(versionItems);
  } catch (error) {
    renderError(error);
  }
}

/* =========================================
   Render Versions
========================================= */

function renderVersions(items) {
  versionsGrid.innerHTML = "";

  versionsCount.textContent =
    `${items.length} version target${items.length === 1 ? "" : "s"}`;

  if (!items.length) {
    versionsGrid.innerHTML = `
      <article class="forge-card">
        <span class="card-kicker">Empty</span>
        <h2>No version targets available</h2>
        <p>Version outlook data has not been published yet.</p>
      </article>
    `;
    return;
  }

  items.forEach(item => {
    versionsGrid.appendChild(createVersionCard(item));
  });
}

/* =========================================
   Create Card
========================================= */

function createVersionCard(item) {
  const card = document.createElement("article");
  card.className = "forge-card version-card preload-card";

  const bestFor = Array.isArray(item.bestFor) ? item.bestFor : [];

  card.innerHTML = `
    <div>
      <span class="card-kicker">${escapeHTML(item.stance || "Target")}</span>
      <h2>${escapeHTML(item.target || "Untitled Target")}</h2>
      <p class="card-summary">${escapeHTML(item.summary || "")}</p>
    </div>

    <dl class="card-meta">
      <div>
        <dt>Role</dt>
        <dd>${escapeHTML(item.role || "Compatibility target")}</dd>
      </div>

      <div>
        <dt>Reason</dt>
        <dd>${escapeHTML(item.reason || item.why || "")}</dd>
      </div>
    </dl>

    <div>
      <p class="card-section-title">Best Fit</p>
      <ul class="card-list">
        ${bestFor.map(entry => `<li>${escapeHTML(entry)}</li>`).join("")}
      </ul>
    </div>
  `;

  return card;
}

/* =========================================
   Error Handling
========================================= */

function renderError(error) {
  versionsGrid.innerHTML = `
    <article class="forge-card">
      <span class="card-kicker">Error</span>

      <h2>Version outlook unavailable</h2>

      <p>
        ${escapeHTML(error.message)}
      </p>
    </article>
  `;

  versionsCount.textContent = "Load failure";
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
