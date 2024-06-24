import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherGraphiqueAvis, afficherGraphiquePieces } from "./avis.js";

const sectionFiches = document.querySelector(".fiches");

let pieces = window.localStorage.getItem("pieces");

if (pieces === null) {
    const piece = await fetch("http://localhost:8081/pieces").then(pieces => pieces.json());
    const valeurPieces = JSON.stringify(piece);
    pieces = piece;
    window.localStorage.setItem("pieces", valeurPieces);
} else {
    pieces = JSON.parse(pieces)
}

ajoutListenerEnvoyerAvis();

document.getElementById('filtrePrix').addEventListener('input', function () {
    let value = document.getElementById('filtrePrix').value;
    const piecesFilterValue = pieces.filter((piece) => piece.prix <= value);
    sectionFiches.innerHTML = "";
    genererPieces(piecesFilterValue);
})


const noms = pieces.map(piece => piece.nom);
let pieceAbordable = [], pieceDisponible = [];

for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].prix < 35) pieceAbordable.push(noms[i]);
    if (pieces[i].disponibilite === true) pieceDisponible.push(`${noms[i]} - ${pieces[i].prix} €`);
}


function genererPieces(element) {
    for (let article of element) {
        let array = [];
        const imageElement = document.createElement('img'), titleElement = document.createElement('h2'), priceElement = document.createElement('p');
        const categorieElement = document.createElement('p'), descriptionElement = document.createElement('p'), dispoElement = document.createElement('p');
        const articleElement = document.createElement('article'), avisBouton = document.createElement("button");

        imageElement.src = article.image;
        titleElement.innerText = article.nom;
        priceElement.innerText = `Prix: ${article.prix} ${article.prix < 35 ? '€' : '€€€'}`;
        categorieElement.innerText = article.categorie ?? "(aucune catégorie)";
        descriptionElement.innerText = article.description ?? "(Pas de description pour le moment)";
        dispoElement.innerText = `${article.disponibilite === true ? "En stock" : "Rupture de stock"}`;
        avisBouton.dataset.id = article.id, avisBouton.textContent = "Afficher les avis";

        array.push(imageElement, titleElement, priceElement, categorieElement, descriptionElement, dispoElement, avisBouton);

        sectionFiches.appendChild(articleElement);

        for (let elem of array) {
            articleElement.appendChild(elem);
        }
        ajoutListenersAvis();
    }
}
genererPieces(pieces);



const boutonTrierCroissant = document.querySelector(".btn-trier");
const boutonTrierDecroissant = document.querySelector(".btn-trier-desc");

boutonTrierCroissant.addEventListener("click", function () {
    const piecesCroissant = pieces.sort((a, b) => a.prix - b.prix);
    sectionFiches.innerHTML = "";
    genererPieces(piecesCroissant);
});
boutonTrierDecroissant.addEventListener("click", function () {
    const piecesDecroissant = pieces.sort((a, b) => b.prix - a.prix);
    sectionFiches.innerHTML = "";
    genererPieces(piecesDecroissant);
});

const boutonFilter = document.querySelector(".btn-filtrer");
const boutonFilterDescription = document.querySelector(".btn-filtrer-description");

boutonFilterDescription.addEventListener("click", function () {
    const piecesFiltresAvecDescription = pieces.filter((piece) => piece.description);
    sectionFiches.innerHTML = "";
    genererPieces(piecesFiltresAvecDescription);
});

boutonFilter.addEventListener("click", function () {
    const piecesFiltres = pieces.filter((piece) => piece.prix >= 35);
    sectionFiches.innerHTML = "";
    genererPieces(piecesFiltres);
});

const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
    window.localStorage.removeItem("pieces");
});

const abordablesElements = document.createElement('ul');
for (let i = 0; i < pieceAbordable.length; i++) {
    const nomElement = document.createElement('li');
    nomElement.innerText = pieceAbordable[i];
    abordablesElements.appendChild(nomElement)
}
document.querySelector('.abordables')
    .appendChild(abordablesElements)


const disponiblesElements = document.createElement('ul');
for (let i = 0; i < pieceDisponible.length; i++) {
    const nomElement = document.createElement('li');
    nomElement.innerText = pieceDisponible[i];
    disponiblesElements.appendChild(nomElement)
}
document.querySelector('.disponibles')
    .appendChild(disponiblesElements)

await afficherGraphiqueAvis()
await afficherGraphiquePieces()