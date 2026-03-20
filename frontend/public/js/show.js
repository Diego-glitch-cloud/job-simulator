import { getOne } from "./api.js";

const id = new URLSearchParams(window.location.search).get("id");

document.getElementById("resource-label").textContent = window.RESOURCE;
document.getElementById("edit-link").href = `edit.html?id=${id}`;

const LABELS = ["Banda / Artista", "Género", "País", "Año Inicio", "Rating", "Activa"];
const KEYS   = ["name", "genre", "country", "year_formed", "rating", "is_active"];

async function load() {
  try {
    const r = await getOne(id);

    document.getElementById("card").innerHTML = `
      <div class="show-header-row">
        <div>
          <p class="form-label show-label-id">ID ${r.id}</p>
          <h1 class="font-semibold">${r.name}</h1>
        </div>
      </div>
      <dl class="form-grid">
        ${KEYS.map((k, i) => `
          <div>
            <dt class="form-label">${LABELS[i]}</dt>
            <dd class="show-value">${
              k === "is_active"
                ? `<span class="badge ${r[k] ? 'badge-active' : 'badge-inactive'}">${r[k] ? 'Sí' : 'No'}</span>`
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
