import constant from './constants.js';
import { apiRequest } from './services.js';
import { capitalizeFirstLetter } from './helpers.js';
import { listenSelectedSuggestion } from './search.js';

// Variables Globales

const trendingList = document.querySelector(".trending-topics__list");
const trendingTopicsURL = constant.BASE_URL + "trending/searches" + constant.API_KEY;
let trendingTopicsArray = [];
let allTrengingTopics = "";

// Toma info de trendingtopics

const trendingTopicsData = apiRequest(trendingTopicsURL);
trendingTopicsData.then((response) => {
    trendingTopicsArray = response.data.slice(0, 5);
    topicsToLink(trendingTopicsArray);
}).catch((error) => { console.log(error) });

// Convierte trending topic array en links

const topicsToLink = (array => {
    array.forEach(topic => {
        allTrengingTopics += topicsMarkup(topic);
        trendingList.innerHTML = allTrengingTopics;
        trendingList.querySelectorAll('.trending-topics__item').forEach((button) => button.addEventListener('click', listenSelectedSuggestion));
    });
});

// Links making method

const topicsMarkup = (topic => {
    return (`<li class="trending-topics__item"><a href="#search_bar">${capitalizeFirstLetter(topic)}</a></li>`);
});