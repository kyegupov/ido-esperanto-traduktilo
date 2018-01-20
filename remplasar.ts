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

function normalizarIdoDezinenco(s: string): string {
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
}

function traduktarDezinencoIoEo(s: string): string {
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

document.addEventListener("DOMContentLoaded", function(event) {

    // Preprocedar la vortaro

    let vortaroIoEo : { [klefo: string]: string[]; } = {};
    var vortaroEoIo : { [klefo: string]: string[]; } = {};

    for (let vortoIoString of Object.keys(vortaroIoEoKruda)) {
        let vortiEo = vortaroIoEoKruda[vortoIoString].replace(/\(.*?\)/g, "").split(/[,;] /g);
        let deklenebla = vortoIoString.indexOf(".") >= 0;
        // console.log(vortoIoString);
        // console.log(deklenebla);
        vortoIoString = vortoIoString.replace(/\./g, "").replace(/\(.*?\)/g, "").trim();
        let bazoIo = vortoIoString;
        if (deklenebla) {
            let analizita = analizarIdo(vortoIoString, true);
            bazoIo = senDezinenco(analizita) + "_" + normalizarIdoDezinenco(analizita.dezinenco);
        }

        console.log(bazoIo);
        
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

    document.getElementById("traduktar").onclick = function() {

        let texto = (document.getElementById("fonto") as HTMLTextAreaElement).value;
        let vorti = texto.split(/\b/);
        let texto2 = "";
        let texto2_html = "";

        for (var vorto of vorti) {

            if (vorto.search(/[a-zA-Z]/) == -1) { // ne esas vorto
                texto2_html += vorto;
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
                traduktitaBazi = vortaroIoEo[senDezinenco(analizito) + "_" + normalizarIdoDezinenco(analizito.dezinenco)];
                dezinenco = traduktarDezinencoIoEo(analizito.dezinenco);

                if (!traduktitaBazi && analizito.participSufixo) {
                    // Projeto 3: traduktar participo uzante vorto-bazo kom verbo
                    traduktitaBazi = vortaroIoEo[analizito.bazo + "_as"];
                    dezinenco = analizito.participSufixo + traduktarDezinencoIoEo(analizito.dezinenco);
                }

                if (!traduktitaBazi && analizito.dezinenco == "e") {
                    // Projeto 4: traduktar adverbo uzante vorto kom adjektivo
                    traduktitaBazi = vortaroIoEo[analizito.bazo + "_a"];
                    dezinenco = "e";
                }
                
            }
            // console.log(traduktitaBazi);

            if (traduktitaBazi) {
                let traduktajo = "";
                if (traduktitaBazi.length > 1) {
                    traduktajo = "??";
                    for (let traduktitaBazo of traduktitaBazi) {
                        traduktajo += traduktitaBazo + dezinenco + "??";
                    }
                } else {
                    traduktajo = traduktitaBazi[0] + dezinenco;
                }
                // texto2 += traduktajo + " ";
                if (mayuskulita) {
                    traduktajo = traduktajo.charAt(0).toUpperCase() + traduktajo.substr(1);
                }
                texto2_html += '<span style="color: green">' + traduktajo + '</span>';
            } else {
                // texto2 += "???" + vorto + "??? ";
                if (mayuskulita) {
                    vorto = vorto.charAt(0).toUpperCase() + vorto.substr(1);
                }
                texto2_html += '<span style="color: red">???' + vorto + '???</span>';
            }
        }

        // document.getElementById("rezulto").value = texto2;
        document.getElementById("rezulto_koloroza").innerHTML = texto2_html;
    }
});