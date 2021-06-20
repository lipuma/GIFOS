import constant from './constants.js';
import { autoCompleteRequest, searchGifosRequest } from './services.js';
import { capitalizeFirstLetter } from './helpers.js';
import { makeGifosCards } from './gifos_card_maker.js';
import { displaySuggestions } from './suggestions_maker.js';

// Variables globales

const autoCompleteURL = constant.BASE_URL + "gifs/search/tags" + constant.API_KEY;
const searchURL = constant.BASE_URL + "gifs/search" + constant.API_KEY;
const searchBarBtn = document.querySelector(".search-bar__button");
const searchClose = document.querySelector(".active-search__close");
const suggestionsBlock = document.querySelector(".active-search__suggestions-list");
const searchInput = document.querySelector(".search-bar__input");
const seeMoreBtn = document.querySelector(".search-results__button");

const searchBarState = {
    INITIAL: "initial",
    WITH_SUGGESTIONS: "with_suggestions",
    WITHOUT_SUGGESTIONS: "without_suggestions",
    AFTER_SEARCH: "after_search",
}
let isCurrentlySearching = false;
let currentPage = 0;

// Eventos

searchInput.addEventListener('keyup', listenInputKeyEvent);
searchClose.addEventListener('click', listenCloseEvent);
searchBarBtn.addEventListener('click', listenSearchClick);
seeMoreBtn.addEventListener('click', seeMore);

// Muestra mas gifs

function seeMore() {
    currentPage++;
    requestGifos(currentPage);
}

// API request

function listenInputKeyEvent(e) {
    const isEnterKey = e.keyCode === 13;
    if (isEnterKey === true) {
        updateSearchBarState(searchBarState.AFTER_SEARCH);
        searchGifos();
        return;
    }
    if (searchInput.value === "") {
        updateSearchBarState(searchBarState.INITIAL);
        isCurrentlySearching = false;
        return;
    }
    if (isCurrentlySearching) {
        return;
    }
    isCurrentlySearching = true;
    requestSuggestions();
}

// Método para solicitar sugerencias a la API

function requestSuggestions() {
    const autoCompleteData = autoCompleteRequest(autoCompleteURL, searchInput.value);
    autoCompleteData.then((response) => {
        if (response.data.length === 0) {
            updateSearchBarState(searchBarState.WITHOUT_SUGGESTIONS);
            isCurrentlySearching = false;
            return;
        }
        displaySuggestions(response.data);
        const suggestionList = document.querySelectorAll(".active-search__suggestion");
        suggestionList.forEach((element) => element.addEventListener('click', listenSelectedSuggestion));
        updateSearchBarState(searchBarState.WITH_SUGGESTIONS);
        isCurrentlySearching = false;
    }).catch((error) => { console.log(error) });
}

// Click en sugerencia

function listenSelectedSuggestion(e) {
    currentPage = 0;
    searchInput.value = e.target.innerText;
    updateSearchBarState(searchBarState.AFTER_SEARCH);
    searchGifos();
}

// Click en X

function listenCloseEvent() {
    updateSearchBarState(searchBarState.INITIAL)
}

// Click lupa

function listenSearchClick() {
    updateSearchBarState(searchBarState.AFTER_SEARCH);
    searchGifos();
}

// Update buscador

function updateSearchBarState(state) {

    switch (state) {
        case searchBarState.INITIAL:
            searchInput.value = "";
            suggestionsBlock.innerHTML = "";
            suggestionsBlock.classList.add("hidden");
            searchClose.classList.add("hidden");
            searchBarBtn.classList.remove("active-search__search");
            searchBarBtn.classList.remove("hidden");
            break;
        case searchBarState.WITH_SUGGESTIONS:
            suggestionsBlock.classList.remove("hidden");
            searchBarBtn.classList.add("active-search__search");
            searchClose.classList.remove("hidden");
            break;
        case searchBarState.WITHOUT_SUGGESTIONS:
            suggestionsBlock.innerHTML = "";
            suggestionsBlock.classList.add("hidden");
            searchClose.classList.remove("hidden");
            searchBarBtn.classList.remove("hidden");
            searchBarBtn.classList.add("active-search__search");
            break;
        case searchBarState.AFTER_SEARCH:
            suggestionsBlock.innerHTML = "";
            suggestionsBlock.classList.add("hidden");
            searchBarBtn.classList.add("active-search__search");
            searchClose.classList.remove("hidden");
            searchBarBtn.classList.add("hidden");
            break;
        default:
            break;
    }
}


// Actualización de la UI y la información de la API para mostrar el gif

function searchGifos() {
    displayGifosSection()
    requestGifos();
}

// Update UI gif

function displayGifosSection() {
    document.querySelector(".search-results__title").textContent = capitalizeFirstLetter(searchInput.value);
    document.querySelector(".search-results").classList.remove("hidden");
    document.querySelector(".search-without-results").classList.add("hidden");
    seeMoreBtn.classList.add("hidden");
}

// Solicita informacion de gif a la API

function requestGifos(page = 0) {
    const gifosData = searchGifosRequest(searchURL, searchInput.value, page);
    gifosData.then((response) => {
        if (response.data.length === 0 & page === 0) {
            document.querySelector(".search-without-results").classList.remove("hidden");
            document.querySelector(".gifos-wrapper").innerHTML = "";
            return;
        }
        if (response.data.length === 0 & page != 0) {
            seeMoreBtn.classList.add("hidden");
            return;
        }
        seeMoreBtn.classList.remove("hidden");
        const htmlNode = document.querySelector(".gifos-wrapper");
        if (page === 0) {
            htmlNode.innerHTML = "";
            window.searchedGifosInfo = response.data;
        } else {
            window.searchedGifosInfo = [...window.searchedGifosInfo || [], ...response.data];
        }
        makeGifosCards(response.data, htmlNode, "search_type", page);

    }).catch((error) => { console.log(error) });
}


export {

    listenSelectedSuggestion
};