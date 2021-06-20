import { capitalizeFirstLetter } from './helpers.js';
const suggestionsBlock = document.querySelector(".active-search__suggestions-list");

// Toma info de sugerencia

function displaySuggestions(suggestions) {
    if (suggestions.length) {
        let htmlSuggestions = ""
        suggestions.forEach(element => {
            htmlSuggestions += suggestionMarkUp(capitalizeFirstLetter(element.name));
            suggestionsBlock.innerHTML = htmlSuggestions;
        });
    }
};

// Sugerencia metodo marking

const suggestionMarkUp = ((suggestion) => {
    return (
        `<li class="active-search__suggestion"><a class="suggestion-selected"><i class="icon-icon-search"></i>${suggestion}</a></li>`
    );
});

export {

    displaySuggestions
};