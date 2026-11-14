// frontend/js/api.js — Conector entre o app.js original e o FastAPI + MySQL
(function () {
  "use strict";
  var API_BASE = "http://localhost:8000/api";

  window.CapimAPI = {
    // Busca todos os dados do MySQL ao abrir o sistema
    loadState: async function () {
      try {
        var res = await fetch(API_BASE + "/state");
        if (!res.ok) return null;
        return await res.json();
      } catch (e) {
        console.warn("FastAPI offline. Usando dados do navegador (localStorage).");
        return null;
      }
    },

    // Salva todas as alterações (ocorrências, status, equipamentos, rondas) no MySQL
    saveState: async function (stateObj) {
      try {
        var res = await fetch(API_BASE + "/state", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stateObj)
        });
        if (!res.ok) return { ok: false };
        return await res.json();
      } catch (e) {
        console.warn("Não foi possível sincronizar com o FastAPI:", e);
        return { ok: false };
      }
    }
  };
})();