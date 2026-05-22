const atqMeta = {
  atk1: { label: "GEN I — Kanto",  file: "/json/attaques_gen1.json" },
  atk2: { label: "GEN II — Johto", file: "/json/attaques_gen2.json" },
  atk3: { label: "GEN III — Hoenn", file: "/json/attaques_gen3.json" },
  atk4: { label: "GEN IV — Sinnoh", file: "/json/attaques_gen4.json" },
  atk5: { label: "GEN V — Unova",  file: "/json/attaques_gen5.json" },
};

let currentAtk = null;

async function toggleAttaque(atkKey) {
  const panel   = document.getElementById("atk-panel");
  const title   = document.getElementById("atk-panel-title");
  const content = document.getElementById("atk-panel-content");

  if (currentAtk === atkKey) {
    closeAttaque();
    return;
  }

  currentAtk = atkKey;

  document.querySelectorAll("[onclick^='toggleAttaque']").forEach(c => c.classList.remove("active"));
  document.querySelector(`[onclick="toggleAttaque('${atkKey}')"]`).classList.add("active");

  title.textContent = atqMeta[atkKey].label;
  content.innerHTML = '<div class="gen-loading">Chargement...</div>';
  panel.style.display = "block";

  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });

  try {
    const res = await fetch(atqMeta[atkKey].file);
    if (!res.ok) throw new Error("Fichier introuvable");
    const data = await res.json();
    renderAttaqueList(data, content);
  } catch (e) {
    content.innerHTML = `<div class="gen-error">Impossible de charger le fichier JSON.<br><small>${e.message}</small></div>`;
  }
}

function closeAttaque() {
  document.getElementById("atk-panel").style.display = "none";
  document.querySelectorAll("[onclick^='toggleAttaque']").forEach(c => c.classList.remove("active"));
  currentAtk = null;
}

function renderAttaqueList(data, container) {
  if (!data || data.length === 0) {
    container.innerHTML = '<div class="gen-error">Aucune attaque trouvée.</div>';
    return;
  }

  const categoryIcon = {
    physique: "⚔️",
    special:  "✨",
    statut:   "🔄",
  };

  const rows = data.map(a => `
    <tr>
      <td><strong>${a.name}</strong></td>
      <td><span class="type-badge type-${a.type.toLowerCase()}">${a.type}</span></td>
      <td>${categoryIcon[a.category] ?? ""} ${a.category}</td>
      <td>${a.damage ?? "—"}</td>
    </tr>
  `).join("");

  container.innerHTML = `
    <table class="wiki-table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Type</th>
          <th>Catégorie</th>
          <th>Dégâts</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}