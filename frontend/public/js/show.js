import { getOne } from "./api.js";

const id = new URLSearchParams(window.location.search).get("id");

document.getElementById("resource-label").textContent = window.RESOURCE;
document.getElementById("edit-link").href = `edit.html?id=${id}`;

const LABELS = ["Banda / Artista", "Género", "País", "Año Inicio", "Rating", "Activa"];
const KEYS   = ["campo1", "campo2", "campo3", "campo4", "campo5", "campo6"];

async function load() {
  try {
    const r = await getOne(id);

    document.getElementById("card").innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 2rem;">
        <div>
          <p class="form-label" style="margin-bottom: 0.25rem;">ID ${r.id}</p>
          <h1 style="font-size: 1.5rem; font-weight: 600; margin: 0; color:#f8fafc;">${r.campo1}</h1>
        </div>
      </div>
      <dl class="form-grid">
        ${KEYS.map((k, i) => `
          <div>
            <dt class="form-label">${LABELS[i]}</dt>
            <dd style="color: #e2e8f0; font-size:1rem; margin-top:0.25rem; font-weight: 500;">${
              k === "campo6"
                ? `<span style="font-size:0.75rem; padding:0.25rem 0.5rem; border-radius:1rem; ${r[k] ? 'background:#064e3b; color:#34d399;' : 'background:#334155; color:#94a3b8;'}">${r[k] ? 'Sí' : 'No'}</span>`
                : r[k]
            }</dd>
          </div>
        `).join("")}
      </dl>
    `;
  } catch (e) {
    document.getElementById("error").textContent = `Error al cargar el registro: ${e.message}`;
    document.getElementById("error").classList.add("visible");
    document.getElementById("card").style.display = "none";
  }
}

load();
