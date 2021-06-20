const LOCAL_STORAGE_FAVORITES = "Favorite Gifos";
const LOCAL_STORAGE_TEMPORAL_FAVORITE = "Gifo temporal Info";

// Selecciona funcion de acuerdo a boton

function cardButtonAction(e) {
    const gifoIndex = e.currentTarget.getAttribute('data-index');
    const gifoCardType = e.currentTarget.getAttribute('data-cardType');
    const downloadFrom = e.currentTarget.getAttribute('data-download');
    const gifoInfo = getGifoInformation(gifoCardType, gifoIndex);
    switch (e.currentTarget.getAttribute('data-type')) {
        case "add-favorite":
            toggleFav(gifoCardType, gifoIndex);
            addfavoriteGifo(gifoCardType, gifoIndex);
            break;
        case "remove-favorite":
            toggleFav(gifoCardType, gifoIndex, gifoInfo[3]);
            removeFavoriteGifo(gifoInfo[3]);
            break;
        case "download":
            downloadGifo(gifoCardType, downloadFrom, gifoInfo);
            break;
        case "maximize":
            maximizeGifo(gifoInfo);
            maximizeButtonsConf(gifoCardType, gifoIndex, gifoInfo[3]);
            break;
        default:
            break;
    };
};

// Toma info de GIF

function getGifoInformation(gifoCardType, gifoIndex) {
    let gifoURL;
    let gifoUser;
    let gifoTitle;
    let gifoID;
    switch (gifoCardType) {
        case "trending_type":
            gifoURL = window.trendingGifosInfo[gifoIndex].images.original.url;
            gifoUser = window.trendingGifosInfo[gifoIndex].username;
            gifoTitle = window.trendingGifosInfo[gifoIndex].title;
            gifoID = window.trendingGifosInfo[gifoIndex].id;
            break;
        case "search_type":
            gifoURL = window.searchedGifosInfo[gifoIndex].images.original.url;
            gifoUser = window.searchedGifosInfo[gifoIndex].username;
            gifoTitle = window.searchedGifosInfo[gifoIndex].title;
            gifoID = window.searchedGifosInfo[gifoIndex].id;
            break;
        case "favorites":
            const favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
            const temporalGifo = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TEMPORAL_FAVORITE));
            if (gifoIndex < favoriteGifosSelected.length) {
                gifoURL = favoriteGifosSelected[gifoIndex].images.original.url;
                gifoUser = favoriteGifosSelected[gifoIndex].username;
                gifoTitle = favoriteGifosSelected[gifoIndex].title;
                gifoID = favoriteGifosSelected[gifoIndex].id;
            } else {
                gifoURL = temporalGifo.images.original.url;
                gifoUser = temporalGifo.username;
                gifoTitle = temporalGifo.title;
                gifoID = temporalGifo.id;
            };


            break;
        default:
            break;
    };
    return [gifoURL, gifoUser, gifoTitle, gifoID];
};

// Agrega info del gif a un arreglo en local storage

function addfavoriteGifo(gifoCardType, gifoIndex) {
    let favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    switch (gifoCardType) {
        case "trending_type":
            favoriteGifosSelected.push(window.trendingGifosInfo[gifoIndex]);
            break;
        case "search_type":
            favoriteGifosSelected.push(window.searchedGifosInfo[gifoIndex]);
            break;
        case "favorites":
            const temporalGifo = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TEMPORAL_FAVORITE));
            favoriteGifosSelected.push(temporalGifo);
            break;
        default:
            break;
    };
    localStorage.setItem(LOCAL_STORAGE_FAVORITES, JSON.stringify(favoriteGifosSelected));
};

// Borra info del gif en el local storage

function removeFavoriteGifo(gifoID) {
    let favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    let favoriteIndex;
    favoriteGifosSelected.forEach((gifoInfo, index) => {
        if (gifoInfo.id === gifoID) {
            favoriteIndex = index;
        };
    });
    favoriteGifosSelected.splice(favoriteIndex, 1);
    localStorage.setItem(LOCAL_STORAGE_FAVORITES, JSON.stringify(favoriteGifosSelected));
};

//  Esconder o mostrar boton favorito

function toggleFav(gifoCardType, gifoIndex, gifoID) {
    let gifosWrap;
    if (gifoCardType === "trending_type") {
        gifosWrap = document.querySelector(".gifos-carrousel");
    } else {
        gifosWrap = document.querySelector(".gifos-wrapper");
    };
    const addFavorite = gifosWrap.getElementsByClassName("fav-hover");
    const removeFavorite = gifosWrap.getElementsByClassName("fav-active");
    addFavorite[gifoIndex].classList.toggle("hidden");
    removeFavorite[gifoIndex].classList.toggle("hidden");

    const wrapBtnMax = document.querySelector(".fullsize-btn-wrap");
    wrapBtnMax.querySelector(".fav-hover").classList.toggle("hidden");
    wrapBtnMax.querySelector(".fav-active").classList.toggle("hidden");

    if (gifoCardType === "favorites") {
        let indexInCarrousel;
        const carrouselWrap = document.querySelector(".gifos-carrousel");
        for (let gifo = 0; gifo < window.trendingGifosInfo.length; gifo++) {
            if (window.trendingGifosInfo[gifo].id === gifoID) {
                indexInCarrousel = gifo;
                const addFavorite = carrouselWrap.getElementsByClassName("fav-hover");
                const removeFavorite = carrouselWrap.getElementsByClassName("fav-active");
                addFavorite[indexInCarrousel].classList.toggle("hidden");
                removeFavorite[indexInCarrousel].classList.toggle("hidden");
                break;
            };
        };

    }
};

// Baja gif

async function downloadGifo(gifoCardType, downloadFrom, gifoInfo) {
    let gifoURL = gifoInfo[0];
    let name = gifoInfo[2];

    if (gifoCardType === "favorites" & downloadFrom === "full-screen") {
        const temporalGifo = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TEMPORAL_FAVORITE));
        gifoURL = temporalGifo.images.original.url;
        name = temporalGifo.title;
    }
    let fetchResponse = await fetch(gifoURL);
    let blobObject = await fetchResponse.blob();
    let imgURL = URL.createObjectURL(blobObject);
    const saveGif = document.createElement("a");
    saveGif.href = imgURL;
    saveGif.download = `${name}.gif`;
    document.body.appendChild(saveGif);
    saveGif.click();
    document.body.removeChild(saveGif);
};

// Maximiza gif

function maximizeGifo(gifoInfo) {
    document.querySelector(".fullsize-gifo").src = gifoInfo[0];
    document.querySelector(".fullsize-user").textContent = gifoInfo[1];
    document.querySelector(".fullsize-title").textContent = gifoInfo[2];
    toggleModal();
};

function toggleModal() {
    document.querySelector(".modal").classList.toggle("hidden");
};

// Incluye info de datos y event listener a los botones

function maximizeButtonsConf(gifoCardType, gifoIndex, gifoID) {
    document.querySelector(".fullsize-exit").addEventListener('click', toggleModal);
    const fullsizeButtons = document.querySelectorAll(".fullsize-button");
    fullsizeButtons.forEach(button => {
        button.setAttribute("data-cardType", gifoCardType);
        button.setAttribute("data-index", gifoIndex);
        button.addEventListener('click', cardButtonAction);
    });
    let isFavorite = checkFavorite(gifoID);
    const wrapBtnMax = document.querySelector(".fullsize-btn-wrap");
    if (isFavorite) {
        wrapBtnMax.querySelector(".fav-hover").classList.add("hidden");
        wrapBtnMax.querySelector(".fav-active").classList.remove("hidden");
    } else {
        wrapBtnMax.querySelector(".fav-hover").classList.remove("hidden");
        wrapBtnMax.querySelector(".fav-active").classList.add("hidden");
    }
};


// Chequea si GIF es favorito

function checkFavorite(gifoID) {
    let isFavorite = false;
    let favoriteGifosSelected = JSON.parse(localStorage.getItem(LOCAL_STORAGE_FAVORITES)) || [];
    for (let gifo = 0; gifo < favoriteGifosSelected.length; gifo++) {
        if (favoriteGifosSelected[gifo].id === gifoID) {
            isFavorite = true;
            break;
        };

    };
    return isFavorite;
}

export {

    cardButtonAction,
    checkFavorite
};