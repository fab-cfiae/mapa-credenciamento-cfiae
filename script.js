document.addEventListener("DOMContentLoaded", function () {
    const mapa = document.getElementById("mapa");
    const tooltip = document.getElementById("tooltip");

    const COR_HIGHLIGHT = "#1d60cd";
    const COR_PADRAO = "#cbd5e1";

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

    // Variável para garantir que a inicialização ocorra apenas uma vez
    let mapaInicializado = false;

    function inicializarMapa() {
        // Evita dupla inicialização
        if (mapaInicializado) return;

        // Tentativa agressiva de capturar o contentDocument
        const svg = mapa.contentDocument;

        // Se o SVG ainda não estiver acessível, interrompe a execução
        if (!svg) {
            return;
        }

        // Tenta capturar um path para confirmar que o DOM interno está pronto
        const testePath = svg.querySelector("path");
        if (!testePath) {
            return;
        }

        // Marca como inicializado com sucesso
        mapaInicializado = true;

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
                    estadoElement.style.fill = COR_HIGHLIGHT;
                    estadoElement.style.filter = "brightness(1.05)";

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
                    // O Firefox precisa que a referência do rect do mapa seja obtida a cada movimento para precisão
                    const rect = mapa.getBoundingClientRect();
                    const x = rect.left + e.clientX;
                    const y = rect.top + e.clientY;

                    tooltip.style.left = `${x}px`;
                    tooltip.style.top = `${y}px`;
                });

                estadoElement.addEventListener("mouseleave", function () {
                    estadoElement.style.fill = COR_PADRAO;
                    estadoElement.style.filter = "none";
                    tooltip.classList.add("hidden");
                });
            }
        });
    }

    // --- Tratamento Definitivo para Carregamento Cross-Browser ---

    // 1. Tenta inicializar IMEDIATAMENTE (Funciona em Chrome/Edge com cache e em alguns casos do Firefox)
    // Se contentDocument já existe e já tem readyState complete, o Firefox muitas vezes trava aqui
    // mas o Chrome precisa dessa linha.
    try {
        if (mapa.contentDocument && mapa.contentDocument.readyState === "complete") {
            inicializarMapa();
        }
    } catch (e) {
        // Se der erro de cross-origin ou segurança no Firefox, ignoramos e seguimos para os escutadores
    }

    // 2. Escutador clássico de 'load' (Para carregamentos normais sem cache e Firefox padrão)
    mapa.addEventListener("load", inicializarMapa);

    // 3. Fallback agressivo: Polling (Verificação forçada a cada 50ms até que o mapa carregue)
    // Isso garante a execução no Firefox caso ele "perca" o evento de load devido a cache rápido
    const intervalFallback = setInterval(() => {
        if (!mapaInicializado) {
            try {
                if (mapa.contentDocument && mapa.contentDocument.querySelector("path")) {
                    inicializarMapa();
                    clearInterval(intervalFallback); // Para o polling quando funcionar
                }
            } catch (e) {
                // Erros de segurança ignorados
            }
        } else {
            clearInterval(intervalFallback); // Mapa já estava pronto
        }
    }, 50);

    // Limpa o intervalo após 3 segundos para não pesar a página se o mapa realmente falhar
    setTimeout(() => {
        clearInterval(intervalFallback);
    }, 3000);
});
