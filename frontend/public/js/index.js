import { getAll, remove } from "./api.js";

document.getElementById("resource-label").textContent = window.RESOURCE;

async function load() {
  try {
    const records = await getAll();
    const tbody = document.getElementById("records");
    const empty = document.getElementById("empty");

    if (records.length === 0) {
      empty.classList.add("visible");
      return;
    }

    records.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.id}</td>
        <td class="font-medium">${r.name}</td>
        <td>${r.genre}</td>
        <td>${r.country}</td>
        <td>${r.year_formed}</td>
        <td>${r.rating}</td>
        <td>
          <span class="badge ${r.is_active ? 'badge-active' : 'badge-inactive'}">
            ${r.is_active ? 'Sí' : 'No'}
          </span>
        </td>
        <td class="text-right">
          <a href="show.html?id=${r.id}" class="action-link">Ver</a>
          <a href="edit.html?id=${r.id}" class="action-link">Editar</a>
          <button data-id="${r.id}" class="action-delete delete-btn">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("¿Eliminar este registro?")) return;
        try {
          await remove(btn.dataset.id);
          location.reload();
        } catch (e) {
          showError(`Error al eliminar: ${e.message}`);
        }
      });
    });
  } catch (e) {
    showError(`Error al cargar los registros: ${e.message}`);
  }
}

function showError(msg) {
  const el = document.getElementById("error");
  el.textContent = msg;
  el.classList.add("visible");
}

load();
