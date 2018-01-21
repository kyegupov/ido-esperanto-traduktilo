declare var vortaroIoEoKruda: { [klefo: string]: string };

interface IoEoVorto {
    bazo: string; 
    participSufixo: string;
    dezinenco: string;
}

function senDezinenco(vorto: IoEoVorto) {
    return vorto.bazo + vorto.participSufixo;
}

function analizarIdo(s: string, neParticipo: boolean = false): IoEoVorto {
    let matcho = s.match(/(.*?)([aio]n?t)?(a|[io]n?|[aiou]s|ez|[aio]r|e)$/);
    if (matcho) {
        if (neParticipo) {
            return {bazo: matcho[1] + (matcho[2] || ""), participSufixo: "", dezinenco: matcho[3]};
        } else {
            return {bazo: matcho[1], participSufixo: matcho[2] || "", dezinenco: matcho[3]};
        }
    }
    return {bazo: s, participSufixo: "", dezinenco: ""};
}

function analizarEsperanto(s: string): IoEoVorto {
    let matcho = s.match(/(.*?)([aio]n?t)?([ao]j?n?|[aio]s|u|i|e)$/);
    if (matcho) {
        return {bazo: matcho[1], participSufixo: matcho[2] || "", dezinenco: matcho[3]};
    }
    return {bazo: s, participSufixo: "", dezinenco: ""};
}

interface Traduktar {
    normalizarDezinenco: (string) => string;
    traduktarDezinenco: (string) => string;
}

let traduktarIoEo : Traduktar = {
    normalizarDezinenco: function(s: string): string {
        if (s == "a") {
            return "a";
        }
        if (s.match(/^[io]n?$/)) {
            return "o";
        }
        if (s.match(/^[aiou]s|ez|[aio]r$/)) {
            return "as";
        }
        if (s == "e") {
            return "e";
        }
        return ""; // Devas esar eroro!
    },

    traduktarDezinenco: function(s: string): string {
        if (s=="a" || s=="e" || s.match(/on?|[aiou]s/)) {
            return s;
        }
        let m = s.match(/i(n?)/);
        if (m) {
            return "oj" + m[1];
        }
        if (s == "ez") {
            return "u";
        }
        if (s == "ar") {
            return "i";
        }
        let m2 = s.match(/([io])r/);
        if (m2) {
            return m2[1] + "nti"; // -ir -> -inti, -or -> -onti
        }
        return ""; // Devas esar eroro!
    }
}

document.addEventListener("DOMContentLoaded", function(event) {

    // Preprocedar la vortaro

    let vortaroIoEo : { [klefo: string]: string[]; } = {};
    var vortaroEoIo : { [klefo: string]: string[]; } = {};

    for (let vortoIoString of Object.keys(vortaroIoEoKruda)) {
        let vortiEo = vortaroIoEoKruda[vortoIoString].replace(/\(.*?\)/g, "").replace(/\[.*?\]/g, "").split(/[,;] /g);
        let deklenebla = vortoIoString.indexOf(".") >= 0;
        // console.log(vortoIoString);
        // console.log(deklenebla);
        vortoIoString = vortoIoString.replace(/\./g, "").replace(/\(.*?\)/g, "").trim();
        let bazoIo = vortoIoString;
        if (deklenebla) {
            let analizita = analizarIdo(vortoIoString, true);
            bazoIo = senDezinenco(analizita) + "_" + traduktarIoEo.normalizarDezinenco(analizita.dezinenco);
        }

        // console.log(bazoIo);
        
        for (let vortoEoString of vortiEo) {
            if (vortoEoString === "") {
                vortoEoString = vortoIoString;
            }
            vortoEoString = vortoEoString.replace("~","").trim();

            let bazoEo = deklenebla
                ? analizarEsperanto(vortoEoString).bazo
                : vortoEoString;

            if (!vortaroIoEo.hasOwnProperty(bazoIo)) {
                vortaroIoEo[bazoIo] = [];
            }
            vortaroIoEo[bazoIo].push(bazoEo);

            if (!vortaroEoIo.hasOwnProperty(bazoEo)) {
                vortaroEoIo[bazoEo] = [];
            }
            vortaroEoIo[bazoEo].push(bazoIo);
        }
    }

    // Traduktar-butono

    let fonto = document.getElementById("fonto") as HTMLTextAreaElement;
    fonto.value = window.localStorage.getItem("fonto");
    fonto.onchange = () => window.localStorage.setItem("fonto", fonto.value);

    document.getElementById("traduktar").onclick = function() {

        let traduktilo = traduktarIoEo;

        let texto = fonto.value;
        let vorti = texto.split(/\b/);
        let rezultoVisual = "";
        let rezultoTextal = "";

        let vortoIndexo = 0;

        for (var vorto of vorti) {
            vortoIndexo++;

            if (vorto.search(/[a-zA-Z]/) == -1) { // ne esas vorto
                rezultoVisual += vorto;
                rezultoTextal += vorto;
                continue;
            }

            let mayuskulita = false;
            if (vorto.match(/^[A-Z][^A-Z]+$/)) {
                mayuskulita = true;
                vorto = vorto.toLowerCase();
            }
            
            // Projeto 1: traduktar exakte
            let traduktitaBazi = vortaroIoEo[vorto];
            let dezinenco = "";
            // console.log(vorto);
            if (!traduktitaBazi) {
            // Projeto 2: traduktar vortospeco
            let analizito = analizarIdo(vorto);
                // console.log(analizito);
                traduktitaBazi = vortaroIoEo[senDezinenco(analizito) + "_" + traduktilo.normalizarDezinenco(analizito.dezinenco)];
                dezinenco = traduktilo.traduktarDezinenco(analizito.dezinenco);

                if (!traduktitaBazi && analizito.participSufixo) {
                    // Projeto 3: traduktar participo uzante vorto-bazo kom verbo
                    traduktitaBazi = vortaroIoEo[analizito.bazo + "_as"];
                    dezinenco = analizito.participSufixo + traduktilo.traduktarDezinenco(analizito.dezinenco);
                }

                if (!traduktitaBazi && analizito.dezinenco == "e") {
                    // Projeto 4: traduktar adverbo uzante vorto kom adjektivo
                    traduktitaBazi = vortaroIoEo[analizito.bazo + "_a"];
                    dezinenco = "e";
                }
                
            }
            // console.log(traduktitaBazi);

            if (traduktitaBazi) {

                if (mayuskulita) {
                    for (let i of Object.keys(traduktitaBazi)) {
                        traduktitaBazi[i] = traduktitaBazi[i].charAt(0).toUpperCase() + traduktitaBazi[i].substr(1);
                    }
                }

                let klaso = "";
                
                let traduktajoBuxi = "";
                let traduktajoTextala = "";
                if (traduktitaBazi.length > 1) {
                    traduktajoTextala = "?";
                    for (let traduktitaBazo of traduktitaBazi) {
                        traduktajoBuxi += `<div class="traduktvarianto">${traduktitaBazo}${dezinenco}</div>`;
                        traduktajoTextala += `${traduktitaBazo}${dezinenco}?`;
                    }
                    klaso = "necerta";
                } else {
                    traduktajoBuxi = traduktitaBazi[0] + dezinenco;
                    traduktajoTextala = traduktitaBazi[0] + dezinenco;
                    klaso = "traduktita";
                }
                // console.log(traduktajoTextala);
                rezultoVisual += `<div class="vorto_buxo traduktita" id="vb_${vortoIndexo}">${traduktajoBuxi}</div>`;
                rezultoTextal += `<span id="txt_${vortoIndexo}" class="${klaso}">${traduktajoTextala}</span>`;
            } else {
                let klaso = "netraduktita";
                if (mayuskulita) {
                    vorto = vorto.charAt(0).toUpperCase() + vorto.substr(1);
                }
                rezultoVisual += `<div class="vorto_buxo netraduktita" id="vb_${vortoIndexo}">${vorto}</div>`;
                rezultoTextal += `<span id="txt_${vortoIndexo}" class="${klaso}">?${vorto}?</span>`;
            }
        }

        document.getElementById("rezulto_koloroza").innerHTML = rezultoVisual;
        document.getElementById("rezulto_textala").innerHTML = rezultoTextal;

        let varianti = document.getElementsByClassName("traduktvarianto");
        for (let i=0; i<varianti.length; i++) {
            let varel = varianti[i] as HTMLDivElement;
            varel.onclick = function(event) {
                let genitoro = this.parentNode as HTMLDivElement;
                for (let j=0; j<genitoro.childNodes.length; j++) {
                    let frato = genitoro.childNodes[j] as HTMLDivElement;
                    frato.classList.remove("selektita");
                    frato.classList.add("neselektita");
                }

                this.classList.add("selektita");
                let idNumero = parseInt(genitoro.getAttribute("id").substr(3));
                let textalaVorto = document.getElementById("txt_" + idNumero);
                textalaVorto.classList.remove("necerta");
                textalaVorto.classList.add("traduktita");
                textalaVorto.innerText = this.innerText;
            }
        }
    }
});