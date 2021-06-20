// Toma info de gif de la API

function apiRequest(URL) {
    return new Promise((resolve, reject) => {
        fetch(URL)
            .then(response => { resolve(response.json()) })
            .catch(error => { reject(error) })
    });
}

// Obtiene sugerencias

function autoCompleteRequest(URL, queryTerm) {
    const completeURL = `${URL}&q=${queryTerm}`;
    return apiRequest(completeURL);
}

// Obtiene gif segun el termino buscado

function searchGifosRequest(URL, queryTerm, page) {
    const offset = page * 12;
    const completeURL = `${URL}&q=${queryTerm}&limit=12&offset=${offset}`;
    return apiRequest(completeURL);
}

// Sube gif creado por usuario

function uploadGifosRequest(URL, gifoData) {
    return new Promise((resolve, reject) => {
        fetch(URL, { method: 'POST', body: gifoData })
            .then(response => { resolve(response.json()) })
            .catch(error => { reject(error) })
    });
}

export {

    apiRequest,
    autoCompleteRequest,
    searchGifosRequest,
    uploadGifosRequest
};