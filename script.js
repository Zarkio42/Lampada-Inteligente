class SmartLamp {
    constructor() {
        this.imgLampada = document.getElementById("img-lamp");
        this.palco = document.querySelector(".palco-lampada");
        this.pontoStatus = document.getElementById("ponto-status");
        this.textoStatus = document.getElementById("texto-status");
        this.btnMic = document.getElementById("btn-mic");
        this.legenda = document.getElementById("legenda");
        this.quebrada = false;
        this.ligada = false;
        this.cliques = 0;
        this.ouvindo = false;
        this.recognition = null;

        this.init();
    }

    init() {
        const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (Speech) {
            this.recognition = new Speech();
            this.recognition.lang = "pt-BR";
            this.recognition.continuous = true;
            this.recognition.onresult = (e) => this.processarFala(e);
            this.recognition.onend = () => { if (this.ouvindo) this.recognition.start(); };
        } else {
            this.btnMic.style.display = "none";
            alert("Navegador sem suporte a voz.");
        }

        this.imgLampada.addEventListener('click', () => this.contarCliques());

        document.getElementById('btn-tema').addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
        });
    }

    comando(acao, cor = 'padrao') {
        if (this.quebrada) return;

        if (acao === 'ligar') {
            this.ligada = true;
            this.imgLampada.src = "./images/aceso.png";
            this.palco.classList.add('ativa');
            this.mudarCor(cor);
            this.atualizarUI(true, `LIGADO (${cor.toUpperCase()})`);
        }
        else if (acao === 'desligar') {
            this.ligada = false;
            this.imgLampada.src = "./images/apagado.png";
            this.palco.classList.remove('ativa');
            this.mudarCor('desligado');
            this.atualizarUI(false, "DESLIGADO");
            this.imgLampada.style.filter = "drop-shadow(0 10px 15px rgba(0,0,0,0.3))";
        }
    }

    mudarCor(nomeCor) {
        const cores = {
            'padrao': { filtro: 'sepia(0)', hex: 'rgba(255, 223, 0, 0.4)' },
            'azul': { filtro: 'hue-rotate(180deg) saturate(3)', hex: 'rgba(0, 168, 255, 0.4)' },
            'vermelho': { filtro: 'hue-rotate(320deg) saturate(4)', hex: 'rgba(255, 56, 56, 0.4)' },
            'verde': { filtro: 'hue-rotate(80deg) saturate(2)', hex: 'rgba(46, 204, 113, 0.4)' },
            'rosa': { filtro: 'hue-rotate(280deg) saturate(2)', hex: 'rgba(255, 121, 121, 0.4)' },
            'roxo': { filtro: 'hue-rotate(240deg) saturate(3)', hex: 'rgba(156, 136, 255, 0.4)' },
            'desligado': { filtro: 'none', hex: 'transparent' }
        };

        const config = cores[nomeCor] || cores['padrao'];

        document.documentElement.style.setProperty('--cor-luz-atual', config.hex);

        if (this.ligada) {
            this.imgLampada.style.filter = `drop-shadow(0 10px 15px rgba(0,0,0,0.3)) ${config.filtro}`;
        }
    }

    contarCliques() {
        if (this.quebrada) return;
        this.cliques++;
        if (this.cliques >= 3) this.quebrar();
    }

    quebrar() {
        this.quebrada = true;
        this.ligada = false;
        this.imgLampada.src = "./images/quebrado.png";
        this.imgLampada.style.width = "390px";
        this.palco.classList.remove('ativa');
        this.imgLampada.style.filter = "grayscale(100%) contrast(1.2)";
        document.documentElement.style.setProperty('--cor-luz-atual', 'transparent');

        this.atualizarUI(false, "QUEBRADA");
        alert("Ops! Você quebrou a lâmpada. Recarregue a página.");

        if (this.ouvindo) this.alternarReconhecimento();
    }

    atualizarUI(ativo, texto) {
        this.textoStatus.innerText = texto;
        this.pontoStatus.style.backgroundColor = ativo ? "#2ecc71" : (texto === "QUEBRADA" ? "#000" : "#ff4757");
        this.pontoStatus.style.boxShadow = ativo ? "0 0 10px #2ecc71" : "none";
    }

    alternarReconhecimento() {
        if (this.ouvindo) {
            this.recognition.stop();
            this.ouvindo = false;
            this.btnMic.classList.remove('gravando');
            this.legenda.innerText = "Reconhecimento pausado.";
        } else {
            this.recognition.start();
            this.ouvindo = true;
            this.btnMic.classList.add('gravando');
            this.legenda.innerText = "Ouvindo...";
        }
    }

    processarFala(e) {
        const indice = e.resultIndex;
        const texto = e.results[indice][0].transcript.toLowerCase().trim();
        this.legenda.innerText = `"${texto}"`;

        if (texto.includes('ligar') || texto.includes('acender')) this.comando('ligar');
        else if (texto.includes('desligar') || texto.includes('apagar')) this.comando('desligar');
        else if (texto.includes('quebrar') || texto.includes('explodir')) this.quebrar();

        else if (texto.includes('azul')) this.comando('ligar', 'azul');
        else if (texto.includes('vermelho')) this.comando('ligar', 'vermelho');
        else if (texto.includes('verde')) this.comando('ligar', 'verde');
        else if (texto.includes('rosa')) this.comando('ligar', 'rosa');
        else if (texto.includes('roxo')) this.comando('ligar', 'roxo');

        else if (texto.includes('festa')) {
            let cores = ['azul', 'vermelho', 'verde', 'rosa', 'roxo'];
            let i = 0;
            const intervalo = setInterval(() => {
                if (!this.ligada) clearInterval(intervalo);
                this.comando('ligar', cores[i]);
                i = (i + 1) % cores.length;
            }, 500);
        }
    }
}

const app = new SmartLamp();