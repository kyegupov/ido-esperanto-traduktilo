declare var vortaroIoEoKruda: { [klefo: string]: string };

interface IoEoVorto {
    bazo: string;
    // participSufixo: string;
    dezinenco: string;
} 

function analizarIdo(s: string): IoEoVorto {
    let matcho = s.match(/(.*?)(a|[io]n?|[aiou]s|ez|[aio]r|e)$/);
    if (matcho) {
        return {bazo: matcho[1], dezinenco: matcho[2]};
    }
    return {bazo: s, dezinenco: ""};
}

function analizarEsperanto(s: string): IoEoVorto {
    let matcho = s.match(/(.*?)([ao]j?n?|[aio]s|u|i|e)$/);
    if (matcho) {
        return {bazo: matcho[1], dezinenco: matcho[2]};
    }
    return {bazo: s, dezinenco: ""};
}

document.addEventListener("DOMContentLoaded", function(event) {

    // Preprocedar la vortaro

    let vortaroIoEo : { [klefo: string]: string[]; } = {};
    var vortaroEoIo : { [klefo: string]: string[]; } = {};

    for (let vortoIoString of Object.keys(vortaroIoEoKruda)) {
        let vortiEo = vortaroIoEoKruda[vortoIoString].replace(/\(.*?\)/g, "").split(/[,;] /g);
        let deklenebla = vortoIoString.indexOf(".") >= 0;
        console.log(vortoIoString);
        console.log(deklenebla);
        vortoIoString = vortoIoString.replace(/\./g, "").replace(/\(.*?\)/g, "").trim();
        let bazoIo = deklenebla
            ? analizarIdo(vortoIoString).bazo + "_"
            : vortoIoString;

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
        let vorti = texto.split(" ");
        let texto2 = "";
        let texto2_html = "";

        for (var vorto of vorti) {
            
            let traduktitaBazi = vortaroIoEo[vorto];
            let dezinenco = "";
            console.log(vorto);
            if (!traduktitaBazi) {
                let analizito = analizarIdo(vorto);
                console.log(analizito);
                traduktitaBazi = vortaroIoEo[analizito.bazo + "_"];
                dezinenco = analizito.dezinenco;
            }
            console.log(traduktitaBazi);

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
                texto2_html += '<span style="color: green">' + traduktajo + '</span> ';
            } else {
                // texto2 += "???" + vorto + "??? ";
                texto2_html += '<span style="color: red">???' + vorto + '???</span> ';
            }
        }

        // document.getElementById("rezulto").value = texto2;
        document.getElementById("rezulto_koloroza").innerHTML = texto2_html;
    }

});