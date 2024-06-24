export function ajoutListenersAvis() {
    const piecesElements = document.querySelectorAll(".fiches article button");

    for (let i = 0; i < piecesElements.length; i++) {
        piecesElements[i].addEventListener("click", async function (event) {
            let avis = window.localStorage.getItem("avis");
            if (avis === null) {
                const id = event.target.dataset.id
                const response = await fetch(`http://localhost:8081/pieces/${id}/avis`);
                avis = await response.json();
                let avisStorage = JSON.stringify(avis);
                localStorage.setItem('avis', avisStorage);
            } else {
                avis = JSON.parse(avis);
            }

            const pieceElement = event.target.parentElement;

            const avisElement = document.createElement("p");
            for (let j = 0; j < avis.length; j++) {
                avisElement.innerHTML += `${avis[j].utilisateur}: ${avis[j].commentaire} <br> <br>`;
                avisElement.setAttribute("id", `avis-client${i}`)
            }
            const verification = document.getElementById(`avis-client${i}`);
            if (!verification) pieceElement.appendChild(avisElement)

        });
    }
}

export function ajoutListenerEnvoyerAvis() {
    const formulaireAvis = document.querySelector(".formulaire-avis");
    formulaireAvis.addEventListener("submit", function (event) {
        event.preventDefault();
        const avis = {
            pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
            utilisateur: event.target.querySelector("[name=utilisateur").value,
            commentaire: event.target.querySelector("[name=commentaire]").value,
            nbEtoiles: event.target.querySelector("[name=etoile]").value
        };
        const chargeUtile = JSON.stringify(avis);

        fetch("http://localhost:8081/avis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });
    });
}


export async function afficherGraphiqueAvis() {

    const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json());
    const nb_commentaires = [0, 0, 0, 0, 0];
    for (let commentaire of avis) {
        nb_commentaires[commentaire.nbEtoiles - 1]++;
    }
    const labels = ["5", "4", "3", "2", "1"];

    const data = {
        labels: labels,
        datasets: [{
            label: "Étoiles attribuées",
            data: nb_commentaires.reverse(),
            backgroundColor: "rgba(255, 230, 0, 1)",
        }],
    };

    const config = {
        type: "bar",
        data: data,
        options: {
            indexAxis: "y",
        },
    };

    const graphiqueAvis = new Chart(
        document.querySelector("#graphique-avis"),
        config,
    );
}

export async function afficherGraphiquePieces() {

    const pieces = await fetch("http://localhost:8081/pieces").then(pieces => pieces.json());
    const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json());
    const length = avis.length, labels = ["Disponible", "Indisponible"];

    let pieceDisponible = [], pieceNonDisponible = [], avisDisponible = [], avisIndisponible = [];

    for (let piece of pieces) {
        piece.disponibilite === true ? pieceDisponible.push(piece) : pieceNonDisponible.push(piece);
    }
    for (let elem of pieceDisponible) {
        for (let i = 0; i < length; i++) {
            if (elem.id === avis[i].pieceId) avisDisponible.push(avis[i])
        }
    }

    for (let elem of pieceNonDisponible) {
        for (let i = 0; i < length; i++) {
            if (elem.id === avis[i].pieceId) avisIndisponible.push(avis[i])
        }
    }

    let avisDisponibleLength = avisDisponible.length, avisIndisponibleLength = avisIndisponible.length;



    const data = {
        labels: labels,
        datasets: [{
            label: "Nombres de commentaires",
            data: [avisDisponibleLength, avisIndisponibleLength],
            backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
            borderWidth: 1
        }],
    };

    const config = {
        type: "bar",
        data: data,
        options: {
            indexAxis: "x",
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        },
    };

    const graphiqueAvis = new Chart(
        document.querySelector("#graphique-pieces-avis"),
        config,
    );
}
