const modGrid = document.getElementById("mod-grid");
const resultCount = document.getElementById("result-count");
const searchInput = document.getElementById("search");
const loaderFilter = document.getElementById("loader-filter");
const statusFilter = document.getElementById("status-filter");

let allMods = [];

initializeMods();

async function initializeMods() {
  try {
    const response = await fetch("data/mods.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Unable to load mod catalog data.");
    }

    allMods = await response.json();

    populateFilters(allMods);
    renderMods(allMods);
  } catch (error) {
    renderError(error);
  }
}

/* =========================================
   Filters
========================================= */

function populateFilters(mods) {
  const loaders = [
    ...new Set(mods.flatMap(mod => mod.loaders || []))
  ].sort();

  const statuses = [
    ...new Set(mods.map(mod => mod.status).filter(Boolean))
  ].sort();

  loaders.forEach(loader => {
    loaderFilter.appendChild(new Option(loader, loader));
  });

  statuses.forEach(status => {
    statusFilter.appendChild(new Option(status, status));
  });
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const loader = loaderFilter.value;
  const status = statusFilter.value;

  const filteredMods = allMods.filter(mod => {
    const searchableText = [
      mod.name,
      mod.slug,
      mod.status,
      mod.tagline,
      mod.summary,
      mod.bestFor,
      ...(mod.loaders || []),
      ...(mod.minecraftVersions || []),
      ...(mod.categories || []),
      ...(mod.features || [])
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !query || searchableText.includes(query);
    const matchesLoader = !loader || (mod.loaders || []).includes(loader);
    const matchesStatus = !status || mod.status === status;

    return matchesSearch && matchesLoader && matchesStatus;
  });

  renderMods(filteredMods);
}

/* =========================================
   Render Mods
========================================= */

function renderMods(mods) {
  modGrid.innerHTML = "";

  resultCount.textContent =
    `${mods.length} mod${mods.length === 1 ? "" : "s"} shown`;

  if (!mods.length) {
    modGrid.innerHTML = `
      <article class="forge-card">
        <span class="card-kicker">No Results</span>

        <h2>No matching mods found</h2>

        <p>
          Try a different search term, loader, or status filter.
        </p>
      </article>
    `;
    return;
  }

  mods.forEach(mod => {
    modGrid.appendChild(createModCard(mod));
  });
}

function createModCard(mod) {
  const card = document.createElement("article");

  card.className = "forge-card mod-card preload-card";

  const categories = Array.isArray(mod.categories)
    ? mod.categories
    : [];

  const loaders = Array.isArray(mod.loaders)
    ? mod.loaders
    : [];

  const versions = Array.isArray(mod.minecraftVersions)
    ? mod.minecraftVersions
    : [];

  const features = Array.isArray(mod.features)
    ? mod.features
    : [];

  const links = mod.links || {};

  card.innerHTML = `
    <div class="mod-topline">
      <span class="card-kicker">
        ${escapeHTML(mod.status || "Listed")}
      </span>

      <div class="pill-row">
        ${loaders.map(loader => `
          <span class="pill">${escapeHTML(loader)}</span>
        `).join("")}

        ${versions.map(version => `
          <span class="pill">${escapeHTML(version)}</span>
        `).join("")}
      </div>
    </div>

    <div>
      <h2>
        ${escapeHTML(mod.name || "Unnamed Mod")}
      </h2>

      <p class="mod-tagline">
        ${escapeHTML(mod.tagline || "")}
      </p>
    </div>

    <p>
      ${escapeHTML(mod.summary || "")}
    </p>

    <dl class="meta">
      <div>
        <dt>Purpose</dt>
        <dd>
          ${escapeHTML(categories.join(", ") || "Utility")}
        </dd>
      </div>

      <div>
        <dt>Best For</dt>
        <dd>
          ${escapeHTML(mod.bestFor || "Minecraft players and modpacks")}
        </dd>
      </div>
    </dl>

    <div>
      <p class="eyebrow">Highlights</p>

      <ul class="clean">
        ${features.map(feature => `
          <li>${escapeHTML(feature)}</li>
        `).join("")}
      </ul>
    </div>

    <footer class="mod-actions">
      ${renderLink("CurseForge", links.curseforge)}
      ${renderLink("GitHub", links.github)}
      ${renderLink("Modrinth", links.modrinth)}
    </footer>
  `;

  return card;
}

/* =========================================
   Links
========================================= */

function renderLink(label, href) {
  if (!href) {
    return `
      <span class="btn inactive">
        ${escapeHTML(label)} Pending
      </span>
    `;
  }

  return `
    <a class="btn secondary" href="${escapeAttribute(href)}" target="_blank" rel="noopener noreferrer">
      ${escapeHTML(label)}
    </a>
  `;
}

/* =========================================
   Error Handling
========================================= */

function renderError(error) {
  modGrid.innerHTML = `
    <article class="forge-card">
      <span class="card-kicker">Error</span>

      <h2>Catalog unavailable</h2>

      <p>
        ${escapeHTML(error.message)}
      </p>
    </article>
  `;

  resultCount.textContent = "Load failure";
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

function escapeAttribute(value) {
  return escapeHTML(value);
}

/* =========================================
   Events
========================================= */

searchInput.addEventListener("input", applyFilters);
loaderFilter.addEventListener("change", applyFilters);
statusFilter.addEventListener("change", applyFilters);