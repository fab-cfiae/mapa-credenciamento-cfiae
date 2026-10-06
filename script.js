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
            empresas: ["R&N Engenharia e Avaliações", "LAH SERVICOS DE ENGENHARIA LTDA", "PROJETTA SCHORR ENGENHARIA & CONSULTORIA LTDA", "COELHOS ENGENHARIA E SERVIÇOS LTDA", "MANGUALDE ENGENHARIA E CONSULTORIA LTDA", "JRODZINSKI CONSULTORIA E SERVICOS LTDA", "HRC ENGENHARIA", "HALLIADNI ARQUITETURA LTDA", "PLANO GESTÃO DE PROJETOS LTDA", "SANTOS & MARTINS SERVIÇOS LTDA", "VALLE CONSULT CONSTRUCAO E GESTAO DE ATIVOS", "G. E. S. GARCIA LTDA", "ATLAS ENGENHARIA E PLANEJAMENTO LTDA"]
        },
        "Nordeste": {
            nome: "Região Nordeste",
            estados: ["BR-AL", "BR-BA", "BR-CE", "BR-MA", "BR-PB", "BR-PE", "BR-PI", "BR-RN", "BR-SE"],
            empresas: ["R&N Engenharia e Avaliações", "JM. MAIA ENGENHARIA LTDA", "LAH SERVICOS DE ENGENHARIA LTDA", "PROJETTA SCHORR ENGENHARIA & CONSULTORIA LTDA", "COELHOS ENGENHARIA E SERVIÇOS LTDA", "MANGUALDE ENGENHARIA E CONSULTORIA LTDA", "JRODZINSKI CONSULTORIA E SERVICOS LTDA", "HRC ENGENHARIA", "HALLIADNI ARQUITETURA LTDA", "PLANO GESTÃO DE PROJETOS LTDA", "FIBO ENGENHARIA LTDA", "SANTOS & MARTINS SERVIÇOS LTDA", "RMP ENGENHARIA LTDA", "VALLE CONSULT CONSTRUCAO E GESTAO DE ATIVOS", "ATLAS ENGENHARIA E PLANEJAMENTO LTDA"]
        },
        "CentroOeste": {
            nome: "Região Centro-Oeste",
            estados: ["BR-DF", "BR-GO", "BR-MT", "BR-MS"],
            empresas: ["R&N Engenharia e Avaliações", "JM. MAIA ENGENHARIA LTDA", "LAH SERVICOS DE ENGENHARIA LTDA", "PROJETTA SCHORR ENGENHARIA & CONSULTORIA LTDA", "COELHOS ENGENHARIA E SERVIÇOS LTDA", "MANGUALDE ENGENHARIA E CONSULTORIA LTDA", "JRODZINSKI CONSULTORIA E SERVICOS LTDA", "HRC ENGENHARIA", "HALLIADNI ARQUITETURA LTDA", "PLANO GESTÃO DE PROJETOS LTDA", "FIBO ENGENHARIA LTDA", "MULTIPLOS CONSTRUÇÃO E SERVIÇOS LTDA", "SANTOS & MARTINS SERVIÇOS LTDA", "VALLE CONSULT CONSTRUCAO E GESTAO DE ATIVOS", "SA E SILVA ENGENHARIA LTDA", "ATLAS ENGENHARIA E PLANEJAMENTO LTDA", "R. M. OLIVEIRA ME"]
        },
        "Sudeste": {
            nome: "Região Sudeste",
            estados: ["BR-ES", "BR-MG", "BR-RJ", "BR-SP"],
            empresas: ["R&N Engenharia e Avaliações", "FEAT ENGENHARIA", "JM. MAIA ENGENHARIA LTDA", "KFK CONSTRUTORA LTDA", "LAH SERVICOS DE ENGENHARIA LTDA", "MARINA BASSO ARQUITETURA LTDA", "PROJETTA SCHORR ENGENHARIA & CONSULTORIA LTDA", "COELHOS ENGENHARIA E SERVIÇOS LTDA", "MANGUALDE ENGENHARIA E CONSULTORIA LTDA", "JRODZINSKI CONSULTORIA E SERVICOS LTDA", "HRC ENGENHARIA", "HALLIADNI ARQUITETURA LTDA", "PLANO GESTÃO DE PROJETOS LTDA", "FIBO ENGENHARIA LTDA", "IDEIA CONSULTORIA E PROJ DE ARQ E ENG CIVIL LTDA", "J. DANIEL ENGENHARIA LTDA", "STUDIO CL20 ARQUITETURA LTDA", "STUDIO NOW SERVIÇOS DE ARQUITETURA, URBANISMO E INTERIORES LTDA", "C.C.G DE L. FERNANDES – SERVIÇOS ESPECIALIZADOS EM ENGENHARIA", "SANTOS & MARTINS SERVIÇOS LTDA", "RS PEIXOTO ARQUITETURA E ENGENHARIA LTDA", "VALLE CONSULT CONSTRUCAO E GESTAO DE ATIVOS", "SANEVIDA ENGENHARIA LTDA", "ATLAS ENGENHARIA E PLANEJAMENTO LTDA", "FERRIS ENGENHARIA LTDA", "M F CHERPINSKI ENGENHARIA"]
        },
        "Sul": {
            nome: "Região Sul",
            estados: ["BR-PR", "BR-RS", "BR-SC"],
            empresas: ["R&N Engenharia e Avaliações", "JLA ENGENHARIA DE AVALIAÇÕES E PERICIAS", "DAL PIZZOL ENGENHARIA E AVALIAÇÕES LTDA", "LAH SERVICOS DE ENGENHARIA LTDA", "MARINA BASSO ARQUITETURA LTDA", "PROJETTA SCHORR ENGENHARIA & CONSULTORIA LTDA", "COELHOS ENGENHARIA E SERVIÇOS LTDA", "MANGUALDE ENGENHARIA E CONSULTORIA LTDA", "JRODZINSKI CONSULTORIA E SERVICOS LTDA", "HRC ENGENHARIA", "JULIANA RIBEIRO MENDES LTDA", "HALLIADNI ARQUITETURA LTDA", "PLANO GESTÃO DE PROJETOS LTDA", "ARAUJO ENGENHARIA CIVIL LTDA", "SANTOS & MARTINS SERVIÇOS LTDA", "VALLE CONSULT CONSTRUCAO E GESTAO DE ATIVOS", "ATLAS ENGENHARIA E PLANEJAMENTO LTDA", "FERRIS ENGENHARIA LTDA", "M F CHERPINSKI ENGENHARIA"]
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
