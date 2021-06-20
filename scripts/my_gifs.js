import constant from './constants.js';
import { apiRequest } from './services.js';

// Variables globales

const LOCAL_STORAGE_MYGIFS = "My Gifos";
const downloadMyGifosBaseURL = constant.BASE_URL + "gifs";
const htmlNode = document.querySelector(".gifos-wrapper");
const seeMoreBtn = document.querySelector(".links-content__button");
let startingPage = 0;
let currentPage = 1;

// Eventos

document.querySelector(".my-gifos__fullsize-exit").addEventListener('click', refreshMyGifs);
seeMoreBtn.addEventListener('click', seeMore);

// Muestra mas gifs

function seeMore() {
    startingPage++;
    currentPage++;
    drawMyGifs(window.myGifosInfo);
}

// Toma info de ID del gif

function getGifosIds() {
    let stringIds = [];
    const uploadedGifos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MYGIFS)) || [];
    console.log(uploadedGifos);
    uploadedGifos.forEach(gifo => {
        stringIds.push(gifo.id);
    });
    stringIds = stringIds.join();
    console.log(stringIds);
    return stringIds;
}

// Baja info del gif

function downloadMyGifos() {
    const gifosIds = getGifosIds();
    const completeURL = `${downloadMyGifosBaseURL}${constant.API_KEY}&ids=${gifosIds}`;
    console.log(completeURL);
    const downloadMyGifos = apiRequest(completeURL);
    downloadMyGifos.then(gifosData => {
            window.myGifosInfo = gifosData.data;
            drawMyGifs(gifosData.data);
            if (currentPage > 1) {
                startingPage = currentPage - 1
            };
        })
        .catch((error) => { console.log(error) });
};

// Muestra gif subidos por usuario

function drawMyGifs(gifosData) {
    const initialIndex = startingPage * 12;
    const finalIndex = currentPage * 12;
    const gifosDataSlice = gifosData.slice(initialIndex, finalIndex);

    if (gifosData.length === 0) {
        document.querySelector(".no-content").classList.remove("hidden");
        seeMoreBtn.classList.add("hidden");
        return;
    }
    if (startingPage === 0) {
        htmlNode.innerHTML = "";
    };
    document.querySelector(".no-content").classList.add("hidden");
    makeMyGifosCards(gifosDataSlice, htmlNode, startingPage);
    const deleteBtnNodes = Array.from(htmlNode.querySelectorAll(".delete"));
    deleteBtnNodes.forEach(node => node.addEventListener('click', refreshMyGifs));

    if (gifosData.slice(finalIndex, finalIndex + 12).length === 0) {
        seeMoreBtn.classList.add("hidden");
    };
};

// Elimina gif de usuario

function refreshMyGifs() {
    htmlNode.innerHTML = "";
    startingPage = 0;
    downloadMyGifos();
};

// Toma info de gif y crea cards

function makeMyGifosCards(gifosInfo, htmlNode, page = 0) {
    const gifosHTML = gifosInfo.map((gifo, index) => {
        const gifoURL = gifo.images.original.url;
        const gifoUser = gifo.username;
        const gifoTitle = gifo.title;
        return cardMarkup(gifoURL, gifoUser, gifoTitle, index + (page * 12));
    });
    htmlNode.innerHTML += gifosHTML.join("\n");
    htmlNode.querySelectorAll('.my-gifos__card-button').forEach((button) => button.addEventListener('click', cardButtonAction));
    htmlNode.querySelectorAll('.my-gifos__gifos-container-card__img').forEach((image) => image.addEventListener('click', cardButtonAction));
};

// Metodo de marking de card

const cardMarkup = ((url, user, title, index) => {
    return (
        `<div class="gifos-container-card">
        <img class="my-gifos__gifos-container-card__img" src="${url}" alt="Gifo" data-typeMyGifos="maximize" data-indexMyGifos="${index}">
        <div class="overlay">
            <div class="gifos-container-card__buttons">
                <button class="my-gifos__card-button delete" data-typeMyGifos="delete" data-indexMyGifos="${index}" type="button"><i class="icon-icon_trash"></i></i></button>
                <button class="my-gifos__card-button" data-typeMyGifos="download" data-indexMyGifos="${index}" type="button"><i class="icon-icon-download"></i></button>
                <button class="my-gifos__card-button maximize" data-typeMyGifos="maximize" data-indexMyGifos="${index}" type="button"><i class="icon-icon-max"></i></button>
            </div>
            <div class="gifos-container-card__info">
                <p class="my-gifos__card__user">${user}</p>
                <p class="my-gifos__card__title">${title}</p>
            </div>
        </div>
    </div>`
    );
});


// Selecciona funcion de acuerdo al boton

function cardButtonAction(e) {
    const gifoIndex = e.currentTarget.getAttribute('data-indexMyGifos');
    const gifoInfo = getGifoInformation(gifoIndex);
    const deleteFrom = e.currentTarget.getAttribute('data-delete');
    switch (e.currentTarget.getAttribute('data-typeMyGifos')) {
        case "delete":
            removeFGifo(gifoInfo[3]);
            if (deleteFrom === "full-screen") {
                refreshMyGifs();
                toggleModal();
            };
            break;
        case "download":
            downloadGifo(gifoInfo[0]);
            break;
        case "maximize":
            maximizeGifo(gifoInfo);
            maximizeButtonsConf(gifoIndex);
            break;
        default:
            break;
    };
};

// Toma info del gif

function getGifoInformation(gifoIndex) {
    let gifoURL = window.myGifosInfo[gifoIndex].images.original.url;
    let gifoUser = window.myGifosInfo[gifoIndex].username;
    let gifoTitle = window.myGifosInfo[gifoIndex].title;
    let gifoID = window.myGifosInfo[gifoIndex].id;
    return [gifoURL, gifoUser, gifoTitle, gifoID];
};

// Elimina ID del array en local storage

function removeFGifo(gifoID) {
    let myGifs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MYGIFS)) || [];
    let gifIndexInLocalStorage;
    myGifs.forEach((gifoInfo, index) => {
        if (gifoInfo.id === gifoID) {
            gifIndexInLocalStorage = index;
        };
    });
    myGifs.splice(gifIndexInLocalStorage, 1);
    localStorage.setItem(LOCAL_STORAGE_MYGIFS, JSON.stringify(myGifs));
};

// Baja gif

async function downloadGifo(gifoURL) {
    let fetchResponse = await fetch(gifoURL);
    let blobObject = await fetchResponse.blob();
    let imgURL = URL.createObjectURL(blobObject);
    const saveGif = document.createElement("a");
    saveGif.href = imgURL;
    saveGif.download = `myGif.gif`;
    document.body.appendChild(saveGif);
    saveGif.click();
    document.body.removeChild(saveGif);
};


// Maximiza gif

function maximizeGifo(gifoInfo) {
    document.querySelector(".my-gifos__fullsize-gifo").src = gifoInfo[0];
    document.querySelector(".my-gifos__fullsize-user").textContent = gifoInfo[1];
    document.querySelector(".my-gifos__fullsize-title").textContent = gifoInfo[2];
    toggleModal();
};

function toggleModal() {
    document.querySelector(".my-gifs__modal").classList.toggle("hidden");
};

// Incluyo data

function maximizeButtonsConf(gifoIndex) {
    document.querySelector(".my-gifos__fullsize-exit").addEventListener('click', toggleModal);
    const fullsizeButtons = document.querySelectorAll(".my-gifs__fullsize-button");
    fullsizeButtons.forEach(button => {
        button.setAttribute("data-indexMyGifos", gifoIndex);
        button.addEventListener('click', cardButtonAction);
    });
};

downloadMyGifos();