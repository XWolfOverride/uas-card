window.addEventListener("load", () => {
    const AESAPIPAUAS = "AESAPIPAUAS";
    function valueChange(event) {
        element = event.target;
        v[element.id.substr(2)] = element.value;
        buildhash();
    }
    function flagChange(event) {
        buildhash();
    }
    function lz(num, cnt) {
        if (!cnt)
            cnt = 2;
        num = String(num);
        while (num.length < cnt)
            num = "0" + num;
        return num;
    }
    function buildhash() {
        //Compose flags
        v.flags = "";
        for (var e in n)
            if (e.startsWith("f-") && n[e].checked)
                v.flags += n[e].value;

        //Compose hash
        var cid = v.cid;
        if (cid.substr(0, 11) == AESAPIPAUAS)
            cid = ":" + cid.substr(11);
        var hash = `${cid}-${v.name}-${v.lname}-${v.id}-${v.date}-${v.flags}`;
        document.location.hash = hash;
        console.info(hash);
        n.card.classList.remove("small");
        if (n["f-small"].checked)
            n.card.classList.add("small");
    }

    function readhash() {
        var h = decodeURI(document.location.hash);
        if (h.length == 0)
            return;
        if (h[0] == "#")
            h = h.substr(1);
        h = h.split("-");
        v.cid = h[0];
        v.name = h[1];
        v.lname = h[2];
        v.id = h[3];
        v.date = h[4];
        v.flags = h[5]||"";
        if (v.cid && v.cid[0] == ":")
            v.cid = AESAPIPAUAS + v.cid.substr(1);
        for (var k in v)
            n[k].innerText = v[k];
        n.matricula.innerText = v.id;
        //Flags
        for (var e in n)
            if (e.startsWith("f-"))
                n[e].checked = v.flags.indexOf(n[e].value) >= 0;

        //Regenerate QR
        qrcode.clear(); // clear the code.
        qrcode.makeCode(document.location.href); // make another code.
    }
    var n = {
        "cid": null,
        "name": null,
        "id": null,
        "lname": null,
        "date": null,
        "flags": null,
        "e-cid": null,
        "e-name": null,
        "e-lname": null,
        "e-id": null,
        "e-date": null,
        "e-flags": null,
        "e-date": null,
        "f-small": null,
        // "f-a1a3": null,
        "print": null,
        "matricula": null,
        "card": null,
    }
    var v = {};
    var qrcode = new QRCode("qr", {
        text: "error",
        width: 256,
        height: 256,
        colorDark: "#888",
        colorLight: "white",
        correctLevel: QRCode.CorrectLevel.H
    });
    // Fill card if there is info to fill
    for (k in n)
        n[k] = document.getElementById(k);
    readhash();
    // Init editor
    for (var e in n) {
        if (e[1] != "-")
            continue;
        switch (e[0]) {
            case "e": {
                v[e.substring(2)] = v[e.substring(2)] || "";
                var el = n[e];
                el.addEventListener("input", valueChange);
                el.value = v[e.substring(2)];
            }
                break;
            case "f": {
                n[e].addEventListener("change", flagChange);
            }
                break;
        }

    };
    window.addEventListener("hashchange", readhash);
    n.print.addEventListener("click", event => { window.print() });
    buildhash();
});