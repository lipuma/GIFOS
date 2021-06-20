import { makeGifosCards } from './gifos_card_maker.js';

// Variables GLobales

const LOCAL_STORAGE_FAVORITES = "Favorite Gifos";
const LOCAL_STORAGE_TEMPORAL_FAVORITE = "Gifo temporal Info";
const htmlNode = document.querySelector(".gifos-wrapper");
const seeMoreBtn = document.querySelector(".links-content__button");
let startingPage = 0;
let currentPage = 1;

// Eventos

document.querySelector(".fullsize-exit").addEventListener('click', refreshFavorites);
seeMoreBtn.addEventListener('click', seeMore);

// Muestra mas gif

function seeMore() {
    startingPage++;
    currentPage++;
    drawFavorites();
}

// Muestra los gif favoritos en local storage

function drawFavorites() {
    const favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    const initialIndex = startingPage * 12;
    const finalIndex = currentPage * 12;
    const favoriteGifosSlice = favoriteGifosSelected.slice(initialIndex, finalIndex);
    if (favoriteGifosSelected.length === 0) {
        document.querySelector(".no-content").classList.remove("hidden");
        seeMoreBtn.classList.add("hidden");
        return;
    }
    if (startingPage === 0) {
        htmlNode.innerHTML = "";
    };
    document.querySelector(".no-content").classList.add("hidden");
    makeGifosCards(favoriteGifosSlice, htmlNode, "favorites", startingPage);
    const favotiteBtnNodes = Array.from(htmlNode.querySelectorAll(".fav-active"));
    favotiteBtnNodes.forEach(node => node.addEventListener('click', refreshFavorites));
    const maximizeBtn = Array.from(htmlNode.querySelectorAll(".maximize"))
    maximizeBtn.forEach(node => node.addEventListener('click', temporalGifoInfo));
    const containerImg = Array.from(htmlNode.querySelectorAll(".gifos-container-card__img"))
    containerImg.forEach(node => node.addEventListener('click', temporalGifoInfo));
    seeMoreBtn.classList.remove("hidden");
    if (favoriteGifosSelected.slice(finalIndex, finalIndex + 12).length === 0) {
        seeMoreBtn.classList.add("hidden");
    };
};

// Elimina gif de favoritos

function refreshFavorites() {
    htmlNode.innerHTML = "";
    startingPage = 0;
    drawFavorites();
    startingPage = currentPage - 1;
};

// Guarda info temporal de gif

function temporalGifoInfo(e) {
    const gifoIndex = e.currentTarget.getAttribute('data-index');
    const favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    localStorage.setItem(LOCAL_STORAGE_TEMPORAL_FAVORITE, JSON.stringify(favoriteGifosSelected[gifoIndex]));
}

drawFavorites();


export {
    refreshFavorites
};