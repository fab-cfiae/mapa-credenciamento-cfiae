document.addEventListener("DOMContentLoaded", function () {
    const mapa = document.getElementById("mapa");
    const modal = document.getElementById("modal-empresas");
    const modalClose = document.getElementById("modal-close");
    const modalTitle = document.getElementById("modal-region-title");
    const modalBadge = document.getElementById("modal-badge");
    const modalList = document.getElementById("modal-empresas-list");

    const COR_HIGHLIGHT = "#1d60cd";
    const COR_PADRAO = "#cbd5e1";

    const regioes = {
        "Norte": {
            nome: "Região Norte",
            estados: ["BR-AC", "BR-AP", "BR-AM", "BR-PA", "BR-RO", "BR-RR", "BR-TO"],
            empresas: ["Credenciadora Amazônia Imóveis", "Norte Cred Soluções"]
        },
        "Nordeste": {
            nome: "Região Nordeste",
            estados: ["BR-AL", "BR-BA", "BR-CE", "BR-MA", "BR-PB", "BR-PE", "BR-PI", "BR-RN", "BR-SE"],
            empresas: ["Nordeste Crédito Imobiliário", "Litoral Credenciamentos", "Sertão Financiamentos"]
        },
        "CentroOeste": {
            nome: "Região Centro-Oeste",
            estados: ["BR-DF", "BR-GO", "BR-MT", "BR-MS"],
            empresas: ["Capital & Planalto Imóveis", "Centro-Oeste Finanças"]
        },
        "Sudeste": {
            nome: "Região Sudeste",
            estados: ["BR-ES", "BR-MG", "BR-RJ", "BR-SP"],
            empresas: ["Sudeste Crédito Imobiliário", "Guanabara Imóveis", "Paulista Credenciadora", "Minas Financiamentos"]
        },
        "Sul": {
            nome: "Região Sul",
            estados: ["BR-PR", "BR-RS", "BR-SC"],
            empresas: ["Sul Cred Imobiliária", "Pampa Financiamentos"]
        }
    };

    const estadoParaRegiao = {};
    Object.keys(regioes).forEach(chaveRegiao => {
        regioes[chaveRegiao].estados.forEach(estadoId => {
            estadoParaRegiao[estadoId] = chaveRegiao;
        });
    });

    let mapaInicializado = false;

    function abrirModal(dadosRegiao) {
        modalTitle.textContent = dadosRegiao.nome;
        modalBadge.textContent = `${dadosRegiao.empresas.length} empresa(s)`;
        
        modalList.innerHTML = dadosRegiao.empresas
            .map(emp => `<li>${emp}</li>`)
            .join('');

        modal.classList.remove("hidden");
    }

    function fecharModal() {
        modal.classList.add("hidden");
    }

    // Fechar modal no botão ou clicando fora do card
    modalClose.addEventListener("click", fecharModal);
    modal.addEventListener("click", function (e) {
        if (e.target === modal) fecharModal();
    });

    function inicializarMapa() {
        if (mapaInicializado) return;

        const svg = mapa.contentDocument;
        if (!svg) return;

        const testePath = svg.querySelector("path");
        if (!testePath) return;

        mapaInicializado = true;

        const todosPaths = svg.querySelectorAll("path");
        todosPaths.forEach(p => {
            p.style.fill = COR_PADRAO;
            p.style.stroke = "#ffffff";
            p.style.strokeWidth = "1";
            p.style.transition = "fill 0.2s ease, filter 0.2s ease";
            p.style.cursor = "pointer";
        });

        Object.keys(estadoParaRegiao).forEach(function (estadoId) {
            const estadoElement = svg.getElementById(estadoId);
            const chaveRegiao = estadoParaRegiao[estadoId];
            const dadosRegiao = regioes[chaveRegiao];

            if (estadoElement) {
                // Hover ilumina a região inteira
                estadoElement.addEventListener("mouseenter", function () {
                    dadosRegiao.estados.forEach(id => {
                        const el = svg.getElementById(id);
                        if (el) {
                            el.style.fill = COR_HIGHLIGHT;
                            el.style.filter = "brightness(1.05)";
                        }
                    });
                });

                estadoElement.addEventListener("mouseleave", function () {
                    dadosRegiao.estados.forEach(id => {
                        const el = svg.getElementById(id);
                        if (el) {
                            el.style.fill = COR_PADRAO;
                            el.style.filter = "none";
                        }
                    });
                });

                // Clique abre o modal com as empresas
                estadoElement.addEventListener("click", function () {
                    abrirModal(dadosRegiao);
                });
            }
        });
    }

    try {
        if (mapa.contentDocument && mapa.contentDocument.readyState === "complete") {
            inicializarMapa();
        }
    } catch (e) {}

    mapa.addEventListener("load", inicializarMapa);

    const intervalFallback = setInterval(() => {
        if (!mapaInicializado) {
            try {
                if (mapa.contentDocument && mapa.contentDocument.querySelector("path")) {
                    inicializarMapa();
                    clearInterval(intervalFallback);
                }
            } catch (e) {}
        } else {
            clearInterval(intervalFallback);
        }
    }, 50);

    setTimeout(() => {
        clearInterval(intervalFallback);
    }, 3000);
});
