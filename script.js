document.addEventListener("DOMContentLoaded", function () {
    const mapa = document.getElementById("mapa");
    const tooltip = document.getElementById("tooltip");

    const COR_HIGHLIGHT = "#1d60cd";
    const COR_PADRAO = "#cbd5e1";

    mapa.addEventListener("load", function () {
        const svg = mapa.contentDocument;

        const estados = {
            "BR-AC": { nome: "Acre", quantidade: 0 },
            "BR-AL": { nome: "Alagoas", quantidade: 0 },
            "BR-AP": { nome: "Amapá", quantidade: 0 },
            "BR-AM": { nome: "Amazonas", quantidade: 3 },
            "BR-BA": { nome: "Bahia", quantidade: 4 },
            "BR-CE": { nome: "Ceará", quantidade: 0 },
            "BR-DF": { nome: "Distrito Federal", quantidade: 4 },
            "BR-ES": { nome: "Espírito Santo", quantidade: 0 },
            "BR-GO": { nome: "Goiás", quantidade: 0 },
            "BR-MA": { nome: "Maranhão", quantidade: 0 },
            "BR-MT": { nome: "Mato Grosso", quantidade: 0 },
            "BR-MS": { nome: "Mato Grosso do Sul", quantidade: 0 },
            "BR-MG": { nome: "Minas Gerais", quantidade: 0 },
            "BR-PA": { nome: "Pará", quantidade: 1 },
            "BR-PB": { nome: "Paraíba", quantidade: 3 },
            "BR-PR": { nome: "Paraná", quantidade: 4 },
            "BR-PE": { nome: "Pernambuco", quantidade: 6 },
            "BR-PI": { nome: "Piauí", quantidade: 0 },
            "BR-RJ": { nome: "Rio de Janeiro", quantidade: 31 },
            "BR-RN": { nome: "Rio Grande do Norte", quantidade: 5 },
            "BR-RS": { nome: "Rio Grande do Sul", quantidade: 0 },
            "BR-RO": { nome: "Rondônia", quantidade: 0 },
            "BR-RR": { nome: "Roraima", quantidade: 0 },
            "BR-SC": { nome: "Santa Catarina", quantidade: 0 },
            "BR-SP": { nome: "São Paulo", quantidade: 5 },
            "BR-SE": { nome: "Sergipe", quantidade: 0 },
            "BR-TO": { nome: "Tocantins", quantidade: 0 }
        };

        const todosPaths = svg.querySelectorAll("path");
        todosPaths.forEach(p => {
            p.style.fill = COR_PADRAO;
            p.style.stroke = "#ffffff";
            p.style.strokeWidth = "1";
            p.style.transition = "fill 0.2s ease, filter 0.2s ease";
            p.style.cursor = "pointer";
        });

        Object.keys(estados).forEach(function (id) {
            const estadoElement = svg.getElementById(id);
            const info = estados[id];

            if (estadoElement) {
                estadoElement.addEventListener("mouseenter", function () {
                    // Mantém a borda branca uniforme e aplica o highlight + leve brilho
                    estadoElement.style.fill = COR_HIGHLIGHT;
                    estadoElement.style.filter = "brightness(1.05)";

                    // Atualiza o conteúdo do Tooltip estilo Card
                    tooltip.innerHTML = `
                        <div class="tooltip-header">${info.nome}</div>
                        <div class="tooltip-body">
                            <span>Empreendimentos:</span>
                            <span class="tooltip-badge">${info.quantidade}</span>
                        </div>
                    `;
                    tooltip.classList.remove("hidden");
                });

                estadoElement.addEventListener("mousemove", function (e) {
                    const rect = mapa.getBoundingClientRect();
                    const x = rect.left + e.clientX;
                    const y = rect.top + e.clientY;

                    tooltip.style.left = `${x}px`;
                    tooltip.style.top = `${y}px`;
                });

                estadoElement.addEventListener("mouseleave", function () {
                    // Reseta preenchimento e filtros para o estado original
                    estadoElement.style.fill = COR_PADRAO;
                    estadoElement.style.filter = "none";

                    tooltip.classList.add("hidden");
                });
            }
        });
    });
});