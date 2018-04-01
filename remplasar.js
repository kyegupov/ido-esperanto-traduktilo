function senDezinenco(vorto) {
    return vorto.bazo + vorto.participSufixo;
}
function analizarIdo(s, neParticipo) {
    if (neParticipo === void 0) { neParticipo = false; }
    var matcho = s.match(/(.*?)([aio]n?t)?(a|[io]n?|[aiou]s|ez|[aio]r|e)$/);
    if (matcho) {
        if (neParticipo) {
            return { bazo: matcho[1] + (matcho[2] || ""), participSufixo: "", dezinenco: matcho[3] };
        }
        else {
            return { bazo: matcho[1], participSufixo: matcho[2] || "", dezinenco: matcho[3] };
        }
    }
    return { bazo: s, participSufixo: "", dezinenco: "" };
}
function analizarEsperanto(s, neParticipo) {
    if (neParticipo === void 0) { neParticipo = false; }
    var matcho = s.match(/(.*?)([aio]n?t)?([ao]j?n?|[aio]s|u|i|e)$/);
    if (matcho) {
        if (neParticipo) {
            return { bazo: matcho[1] + (matcho[2] || ""), participSufixo: "", dezinenco: matcho[3] };
        }
        else {
            return { bazo: matcho[1], participSufixo: matcho[2] || "", dezinenco: matcho[3] };
        }
    }
    return { bazo: s, participSufixo: "", dezinenco: "" };
}
var traduktarIoEo = {
    normalizarDezinenco: function (s) {
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
    traduktarDezinenco: function (s) {
        if (s == "a" || s == "e" || s.match(/^on?|[aiou]s$/)) {
            return s;
        }
        var m = s.match(/^i(n?)$/);
        if (m) {
            return "oj" + m[1];
        }
        if (s == "ez") {
            return "u";
        }
        if (s == "ar") {
            return "i";
        }
        var m2 = s.match(/^([io])r$/);
        if (m2) {
            return m2[1] + "nti"; // -ir -> -inti, -or -> -onti
        }
        return ""; // Devas esar eroro!
    },
    vortaro: {},
    analizar: analizarIdo
};
var traduktarEoIo = {
    normalizarDezinenco: function (s) {
        if (s.match(/^aj?n?$/)) {
            return "a";
        }
        if (s.match(/^oj?n?$/)) {
            return "o";
        }
        if (s.match(/^([aiou]s|u|i)$/)) {
            return "as";
        }
        if (s == "e") {
            return "e";
        }
        return ""; // Devas esar eroro!
    },
    traduktarDezinenco: function (s) {
        if (s == "e" || s.match(/^(on?|[aiou]s)$/)) {
            return s;
        }
        if (s.match(/^(aj?n?)$/)) {
            return "a";
        }
        var m = s.match(/^(?:oj(n?))$/);
        if (m) {
            return "i" + m[1];
        }
        if (s == "u") {
            return "ez";
        }
        if (s == "i") {
            return "ar";
        }
        return ""; // Devas esar eroro!
    },
    vortaro: {},
    analizar: analizarEsperanto
};
document.addEventListener("DOMContentLoaded", function (event) {
    // Preprocedar la vortaro
    for (var _i = 0, _a = Object.keys(vortaroIoEoKruda); _i < _a.length; _i++) {
        var vortoIoString = _a[_i];
        var vortiEo = vortaroIoEoKruda[vortoIoString].replace(/\(.*?\)/g, "").replace(/\[.*?\]/g, "").split(/[,;] /g);
        var deklenebla = vortoIoString.indexOf(".") >= 0;
        // console.log(vortoIoString);
        // console.log(deklenebla);
        vortoIoString = vortoIoString.replace(/\./g, "").replace(/\(.*?\)/g, "").trim();
        var bazoIo = vortoIoString;
        var normalizitaIo = vortoIoString;
        if (deklenebla) {
            var analizita = analizarIdo(vortoIoString, true);
            bazoIo = senDezinenco(analizita);
            normalizitaIo = bazoIo + "_" + traduktarIoEo.normalizarDezinenco(analizita.dezinenco);
        }
        // console.log(bazoIo);
        for (var _b = 0, vortiEo_1 = vortiEo; _b < vortiEo_1.length; _b++) {
            var vortoEoString = vortiEo_1[_b];
            if (vortoEoString === "") {
                vortoEoString = vortoIoString;
            }
            vortoEoString = vortoEoString.replace("~", "").trim();
            var bazoEo = vortoEoString;
            var normalizitaEo = vortoEoString;
            if (deklenebla) {
                var analizita = analizarEsperanto(vortoEoString, true);
                bazoEo = senDezinenco(analizita);
                normalizitaEo = bazoEo + "_" + traduktarEoIo.normalizarDezinenco(analizita.dezinenco);
            }
            if (!traduktarIoEo.vortaro.hasOwnProperty(normalizitaIo)) {
                traduktarIoEo.vortaro[normalizitaIo] = [];
            }
            traduktarIoEo.vortaro[normalizitaIo].push(bazoEo);
            if (!traduktarEoIo.vortaro.hasOwnProperty(normalizitaEo)) {
                traduktarEoIo.vortaro[normalizitaEo] = [];
            }
            // console.log([bazoEo, bazoIo]);
            traduktarEoIo.vortaro[normalizitaEo].push(bazoIo);
        }
    }
    // Specala reguli
    traduktarEoIo.vortaro["estas"] = ["esas", "es"];
    // Traduktar-butono
    var fonto = document.getElementById("fonto");
    fonto.value = window.localStorage.getItem("fonto");
    fonto.onchange = function () { return window.localStorage.setItem("fonto", fonto.value); };
    var direciono = document.getElementById("direciono");
    direciono.selectedIndex = parseInt(window.localStorage.getItem("direciono"));
    direciono.onchange = function () { return window.localStorage.setItem("direciono", "" + direciono.selectedIndex); };
    document.getElementById("traduktar").onclick = function () {
        var traduktilo = direciono.selectedIndex == 0
            ? traduktarIoEo
            : traduktarEoIo;
        var texto = fonto.value;
        // let vorti = texto.split(/\b/); // Ne agas por ne-ASCII literi di Esperanto :(
        var vorti = texto.replace(/[a-zĉĝĥĵŝŭA-ZĈĜĤĴŜŬ]+/g, "\ufdd0$&\ufdd0").split("\ufdd0");
        var rezultoVisual = "";
        var rezultoTextal = "";
        var vortoIndexo = 0;
        for (var _i = 0, vorti_1 = vorti; _i < vorti_1.length; _i++) {
            var vorto = vorti_1[_i];
            vortoIndexo++;
            if (vorto.search(/[a-zĉĝĥĵŝŭA-ZĈĜĤĴŜŬ]/) == -1) {
                rezultoVisual += vorto;
                rezultoTextal += vorto;
                continue;
            }
            var mayuskulita = false;
            if (vorto.match(/^[A-ZĈĜĤĴŜŬ][^A-ZĈĜĤĴŜŬ]+$/)) {
                mayuskulita = true;
                vorto = vorto.toLowerCase();
            }
            // Projeto 1: traduktar exakte
            var traduktitaBazi = traduktilo.vortaro[vorto];
            var dezinenco = "";
            // console.log(vorto);
            if (!traduktitaBazi) {
                // Projeto 2: traduktar vortospeco
                var analizito = traduktilo.analizar(vorto);
                // console.log(analizito);
                traduktitaBazi = traduktilo.vortaro[senDezinenco(analizito) + "_" + traduktilo.normalizarDezinenco(analizito.dezinenco)];
                // console.log(dezinenco);
                dezinenco = traduktilo.traduktarDezinenco(analizito.dezinenco);
                // console.log(dezinenco);
                // console.log(traduktitaBazi);
                if (!traduktitaBazi && analizito.participSufixo) {
                    // Projeto 3: traduktar participo uzante vorto-bazo kom verbo
                    traduktitaBazi = traduktilo.vortaro[analizito.bazo + "_as"];
                    dezinenco = analizito.participSufixo + traduktilo.traduktarDezinenco(analizito.dezinenco);
                }
                if (!traduktitaBazi && analizito.dezinenco == "e") {
                    // Projeto 4: traduktar adverbo uzante vorto kom adjektivo
                    traduktitaBazi = traduktilo.vortaro[analizito.bazo + "_a"];
                    dezinenco = "e";
                }
            }
            // console.log(traduktitaBazi);
            // Specala reguli
            if (traduktilo == traduktarEoIo) {
                if (vorto == 'kaj' || vorto == 'aŭ') {
                    var tradukto = { 'kaj': 'e', 'aŭ': 'o' }[vorto];
                    var i = vortoIndexo;
                    while (vorti[i].search(/[a-zĉĝĥĵŝŭA-ZĈĜĤĴŜŬ]/) == -1 && i < vorti.length) {
                        i++;
                    }
                    if (i < vorti.length) {
                        var nextaVorto = vorti[i];
                        if (nextaVorto.charAt(0).match(/aeiou/)) {
                            tradukto = tradukto + "d";
                        }
                        traduktitaBazi = [tradukto];
                        dezinenco = "";
                    }
                }
                if (vorto == "la") {
                    // "le" es tre rara
                    traduktitaBazi = ["la"];
                    dezinenco = "";
                }
            }
            if (traduktitaBazi) {
                if (mayuskulita) {
                    for (var _a = 0, _b = Object.keys(traduktitaBazi); _a < _b.length; _a++) {
                        var i = _b[_a];
                        traduktitaBazi[i] = traduktitaBazi[i].charAt(0).toUpperCase() + traduktitaBazi[i].substr(1);
                    }
                }
                var klaso = "";
                var traduktajoBuxi = "";
                var traduktajoTextala = "";
                if (traduktitaBazi.length > 1) {
                    traduktajoTextala = "?";
                    for (var _c = 0, traduktitaBazi_1 = traduktitaBazi; _c < traduktitaBazi_1.length; _c++) {
                        var traduktitaBazo = traduktitaBazi_1[_c];
                        traduktajoBuxi += "<div class=\"traduktvarianto\">" + traduktitaBazo + dezinenco + "</div>";
                        traduktajoTextala += "" + traduktitaBazo + dezinenco + "?";
                    }
                    klaso = "necerta";
                }
                else {
                    traduktajoBuxi = traduktitaBazi[0] + dezinenco;
                    traduktajoTextala = traduktitaBazi[0] + dezinenco;
                    klaso = "traduktita";
                }
                // console.log(traduktajoTextala);
                rezultoVisual += "<div class=\"vorto_buxo traduktita\" id=\"vb_" + vortoIndexo + "\">" + traduktajoBuxi + "</div>";
                rezultoTextal += "<span id=\"txt_" + vortoIndexo + "\" class=\"" + klaso + "\">" + traduktajoTextala + "</span>";
            }
            else {
                var klaso = "netraduktita";
                if (mayuskulita) {
                    vorto = vorto.charAt(0).toUpperCase() + vorto.substr(1);
                }
                rezultoVisual += "<div class=\"vorto_buxo netraduktita\" id=\"vb_" + vortoIndexo + "\">" + vorto + "</div>";
                rezultoTextal += "<span id=\"txt_" + vortoIndexo + "\" class=\"" + klaso + "\">?" + vorto + "?</span>";
            }
        }
        document.getElementById("rezulto_koloroza").innerHTML = rezultoVisual;
        document.getElementById("rezulto_textala").innerHTML = rezultoTextal;
        var varianti = document.getElementsByClassName("traduktvarianto");
        for (var i = 0; i < varianti.length; i++) {
            var varel = varianti[i];
            varel.onclick = function (event) {
                var genitoro = this.parentNode;
                for (var j = 0; j < genitoro.childNodes.length; j++) {
                    var frato = genitoro.childNodes[j];
                    frato.classList.remove("selektita");
                    frato.classList.add("neselektita");
                }
                this.classList.add("selektita");
                var idNumero = parseInt(genitoro.getAttribute("id").substr(3));
                var textalaVorto = document.getElementById("txt_" + idNumero);
                textalaVorto.classList.remove("necerta");
                textalaVorto.classList.add("traduktita");
                textalaVorto.innerText = this.innerText;
            };
        }
    };
});
//# sourceMappingURL=remplasar.js.map