import { cardButtonAction, checkFavorite } from './card_buttons_actions.js';


// Crea cards

function makeGifosCards(gifosInfo, htmlNode, cardType, page = 0) {
    const gifosHTML = gifosInfo.map((gifo, index) => {
        const gifoURL = gifo.images.original.url;
        const gifoUser = gifo.username;
        const gifoTitle = gifo.title;
        const gifoID = gifo.id;
        const isFavorite = checkFavorite(gifoID);
        return cardMarkup(gifoURL, gifoUser, gifoTitle, cardType, index + (page * 12), isFavorite);
    });
    htmlNode.innerHTML += gifosHTML.join("\n");
    htmlNode.querySelectorAll('.card-button').forEach((button) => button.addEventListener('click', cardButtonAction));
    htmlNode.querySelectorAll('.gifos-container-card__img').forEach((image) => image.addEventListener('click', cardButtonAction));
};

// Card metodo

const cardMarkup = ((url, user, title, cardType, index, isFavorite) => {
    const cardContent = `
        <img class="gifos-container-card__img" src="${url}" alt="Gifo" data-type="maximize" data-cardType="${cardType}" data-index="${index}">
        <div class="overlay">
            <div class="gifos-container-card__buttons">
                <button class="card-button fav-hover ${isFavorite?'hidden':''}" data-type="add-favorite" data-cardType="${cardType}" data-index="${index}" type="button"><i class="icon-icon-fav-hover"></i></i></button>
                <button class="card-button fav-active ${isFavorite?'':'hidden'}" data-type="remove-favorite" data-cardType="${cardType}" data-index="${index}" type="button"><i class="icon-icon-fav-active"></i></button>
                <button class="card-button" data-type="download" data-cardType="${cardType}" data-index="${index}" type="button"><i class="icon-icon-download"></i></button>
                <button class="card-button maximize" data-type="maximize" data-cardType="${cardType}" data-index="${index}" type="button"><i class="icon-icon-max"></i></button>
            </div>
            <div class="gifos-container-card__info">
                <p class="card__user">${user}</p>
                <p class="card__title">${title}</p>
            </div>
        </div>`

    if (cardType === "trending_type") {
        return (
            `<div class="gifos-container-card trending-card">${cardContent}</div>`
        );
    } else {
        return (
            `<div class="gifos-container-card">${cardContent}</div>`
        );
    };
});


export {

    makeGifosCards
};