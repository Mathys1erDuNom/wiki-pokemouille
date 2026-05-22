const genMeta = {
    gen1: { label: "GEN I — Kanto",  file: "/json/pokemon_gen1_normal.json" },
    gen2: { label: "GEN II — Johto", file: "/json/pokemon_gen2_normal.json" },
    gen3: { label: "GEN III — Hoenn", file: "/json/pokemon_gen3_normal.json" },
    gen4: { label: "GEN IV — Sinnoh", file: "/json/pokemon_gen4_normal.json" },
    gen5: { label: "GEN V — Unys",  file: "/json/pokemon_gen5_normal.json" },
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
    if (!data || data.length === 0) {
      container.innerHTML = '<div class="gen-error">Aucun Pokémon trouvé.</div>';
      return;
    }
  
    const rows = data.map(p => {
      const types = p.type.map(t =>
        `<span class="type-badge type-${t.toLowerCase()}">${t}</span>`
      ).join(" ");
  
      const evo = p.evo?.name ?? "—";
  
      const stats = `
        <span title="PV">❤️ ${p.stats.hp}</span>
        <span title="Attaque">⚔️ ${p.stats.attack}</span>
        <span title="Défense">🛡️ ${p.stats.defense}</span>
        <span title="Atk Spé">✨ ${p.stats.special_attack}</span>
        <span title="Déf Spé">💫 ${p.stats.special_defense}</span>
        <span title="Vitesse">💨 ${p.stats.speed}</span>
      `;
  
      return `
        <tr>
          <td><img class="poke-sprite" src="${p.image}" alt="${p.name}"></td>
          <td><strong>${p.name}</strong></td>
          <td>${types}</td>
          <td class="poke-stats">${stats}</td>
          <td>${p.attacks.join(", ")}</td>
          <td>${p.current_xp} / ${p.xp_evo}</td>
          <td>${evo}</td>
        </tr>
      `;
    }).join("");
  
    container.innerHTML = `
      <table class="wiki-table pokemon-table">
        <thead>
          <tr>
            <th></th>
            <th>Nom</th>
            <th>Types</th>
            <th>Stats</th>
            <th>Attaques</th>
            <th>XP</th>
            <th>Évolution</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }