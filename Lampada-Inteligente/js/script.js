const lampada = document.getElementById("img-lamp");
var clickOnImage = 0;

lampada.addEventListener("click", function () {
    clickOnImage++
    if (clickOnImage === 3 && lampada.src != "./images/quebrada.png") {
        lampada.src = "./images/quebrada.png"
        lampada.style = "width: 700px;"
        alert("Você quebrou a lâmpada :(")
        clickOnImage = 0
    }
})

function trocaImg(v) {
    let img = document.getElementById("img-lamp");
    let detailLight = document.getElementById("detail-01")
    if (v == 1) {
        img.src = "./images/aceso3.png"
        img.style = "width: 700px;"
        detailLight.style = "background-color: green"
    }
    else {
        img.src = "./images/apagado.png"
        img.style = "width: 700px;"
        detailLight.style = "background-color: red"
    }
}

var speechOnOff = false;
const listAcender = ["acender", "liga", "ligar", "acender luz"];
const listApagar = ["apagar", "apaga", "apagar lâmpada"];

class speechApi {
    constructor() {

        this.speechApi = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.speechApi.continuous = true;
        this.speechApi.lang = "pt-BR";

        this.speechApi.onresult = (e) => {
            var resultIndex = e.resultIndex;
            var transcript = e.results[resultIndex][0].transcript.toLowerCase().trim();
            console.log("Você disse:", transcript);

            if (listAcender.some(p => transcript.includes(p))) {
                trocaImg(1);
            }
            else if (listApagar.some(p => transcript.includes(p))) {
                trocaImg(0);
            }
        };
    }

    start() {
        this.speechApi.start();
        speechOnOff = true;
    }

    stop() {
        this.speechApi.stop();
        speechOnOff = false;
    }

}

const speechApiInstance = new speechApi();

function startAndStop() {
    let btnColor = document.getElementById("speaker");
    if (speechOnOff) {
        speechApiInstance.stop();
        btnColor.classList.remove('recording');
    } else {
        speechApiInstance.start();
        btnColor.classList.add('recording');
    }
}






