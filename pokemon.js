const genMeta = {
    gen1: { label: "GEN I — Kanto",  file: "/json/gen1.json" },
    gen2: { label: "GEN II — Johto", file: "/json/gen2.json" },
    gen3: { label: "GEN III — Hoenn", file: "/json/gen3.json" },
    gen4: { label: "GEN IV — Sinnoh", file: "/json/gen4.json" },
    gen5: { label: "GEN V — Unova",  file: "/json/gen5.json" },
  };
  
  let currentGen = null;
  
  async function toggleGen(genKey) {
    const panel   = document.getElementById("gen-panel");
    const title   = document.getElementById("gen-panel-title");
    const content = document.getElementById("gen-panel-content");
  
    if (currentGen === genKey) {
      closeGen();
      return;
    }
  
    currentGen = genKey;
  
    document.querySelectorAll(".gen-card").forEach(c => c.classList.remove("active"));
    document.querySelector(`[onclick="toggleGen('${genKey}')"]`).classList.add("active");
  
    title.textContent = genMeta[genKey].label;
    content.innerHTML = '<div class="gen-loading">Chargement...</div>';
    panel.style.display = "block";
  
    panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  
    try {
      const res = await fetch(genMeta[genKey].file);
      if (!res.ok) throw new Error("Fichier introuvable");
      const data = await res.json();
      renderPokemonList(data, content);
    } catch (e) {
      content.innerHTML = `<div class="gen-error">Impossible de charger le fichier JSON.<br><small>${e.message}</small></div>`;
    }
  }
  
  function closeGen() {
    document.getElementById("gen-panel").style.display = "none";
    document.querySelectorAll(".gen-card").forEach(c => c.classList.remove("active"));
    currentGen = null;
  }
  
  function renderPokemonList(data, container) {
    if (!data.pokemon || data.pokemon.length === 0) {
      container.innerHTML = '<div class="gen-error">Aucun Pokémon trouvé.</div>';
      return;
    }
  
    const rows = data.pokemon.map(p => `
      <tr>
        <td class="poke-id">#${String(p.id).padStart(3, "0")}</td>
        <td><strong>${p.nom}</strong></td>
        <td>${p.types.map(t => `<span class="type-badge type-${t.toLowerCase()}">${t}</span>`).join(" ")}</td>
        <td>${p.xp_evo ?? "—"}</td>
        <td>${p.evolution ?? "—"}</td>
        <td>${p.shiny ? "✨" : "—"}</td>
      </tr>
    `).join("");
  
    container.innerHTML = `
      <table class="wiki-table pokemon-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Types</th>
            <th>XP Évo</th>
            <th>Évolution</th>
            <th>Shiny</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }