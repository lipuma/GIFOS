import constant from './constants.js';
import { apiRequest, uploadGifosRequest } from './services.js';


// Variables globales 
const LOCAL_STORAGE_MYGIFS = "My Gifos";
const video = document.querySelector(".create-gifos__wrapper-image");
const startBtn = document.querySelector(".start");
const recordBtn = document.querySelector(".record");
const finishBtn = document.querySelector(".finish");
const uploadBtn = document.querySelector(".upload");
const counter = document.getElementsByClassName("counter");
const repeatCaptureBtn = document.querySelector(".create-gifos-status__repeat-capture");
const uploadGifoURL = constant.UPLOAD_URL + "gifs" + constant.API_KEY;
const timerHTML = document.querySelector('.create-gifos-status__timming');
let gifoURL;
let gifoData;
let recordingStartDate;
let ticker;


// Eventos
startBtn.addEventListener("click", startListener);
uploadBtn.addEventListener("click", uploadGifo);
repeatCaptureBtn.addEventListener("click", recordAgain);
document.querySelector(".card-button__link").addEventListener("click", () => copyURL(gifoURL));
document.querySelector(".card-button__download").addEventListener("click", () => downloadGifo(gifoURL));


// Boton start listener

function startListener() {
    askCameraPermissionUI();
    getStreamAndRecord();
}

// Start video streaming

async function getStreamAndRecord() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: 480,
                height: 320
            }
        });
        showVideo(stream);
        recordBtn.classList.remove("hidden");
        const recorder = createRecorder(stream);
        recordBtn.addEventListener("click", () => startRecording(recorder));
        finishBtn.addEventListener("click", () => stopRecording(recorder));

    } catch (error) {
        console.log(error);
    }
};


// Muestra mensaje de permiso

function askCameraPermissionUI() {
    document.querySelector(".create-gifos__wrapper-title").innerHTML = `¿Nos das acceso<span class="line-break"></span>a tu cámara?`;
    document.querySelector(".create-gifos__wrapper-info").innerHTML = `El acceso a tu camara será válido sólo<span class="line-break"></span>por el tiempo en el que estés creando el GIFO.`;
    startBtn.classList.add("hidden");
    counter[0].classList.toggle("counter-process");
};

// Comienza streaming camara

function showVideo(stream) {
    video.classList.remove("hidden");
    video.srcObject = stream;
    video.play();
}

// Crea objeto recorder

function createRecorder(stream) {
    const recorder = RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function() {
            console.log('started');
        },
    });
    recorder.camera = stream;
    return recorder;
};

// Start grabacion

function startRecording(recorder) {
    timerHTML.classList.remove("hidden");
    setupTicker();
    recorder.startRecording();
    recordBtn.classList.add("hidden");
    finishBtn.classList.remove("hidden");
    counter[0].classList.toggle("counter-process");
    counter[1].classList.toggle("counter-process");
};

// Timer grabador

function setupTicker() {
    recordingStartDate = new Date().getTime();
    ticker = setInterval(updateRecordedTime, 1000);
}

// Calcula tiempo grabador

function updateRecordedTime() {
    const elapsedTimeInMilliseconds = new Date().getTime() - recordingStartDate;
    const elapsedTime = calculateTimeDuration(elapsedTimeInMilliseconds / 1000);
    timerHTML.textContent = elapsedTime;
}

// Frena timer grabador

function stopTicker() {
    recordingStartDate = null;
    clearInterval(ticker);
}

// Stop grabador

function stopRecording(recorder) {
    stopTicker();
    timerHTML.textContent = calculateTimeDuration(0);
    timerHTML.classList.add("hidden");
    finishBtn.classList.add("hidden");
    uploadBtn.classList.remove("hidden");
    repeatCaptureBtn.classList.remove("hidden");
    recorder.stopRecording(() => prepareGifInfo(recorder));
    document.querySelector(".create-gifos__wrapper-title").innerHTML = `¿Quieres guardar tu Gifo?`;
    document.querySelector(".create-gifos__wrapper-info").innerHTML = "";
    video.srcObject = null;
    recorder.camera.stop();
    recorder = null;
};

// Incluye info del grabador al formulario

function prepareGifInfo(recorder) {
    const form = new FormData();
    form.append('file', recorder.getBlob(), 'myGif.gif');
    console.log(form.get('file'));
    gifoData = form;
};

// Request para subir gif

function uploadGifo() {
    showUploadingUI()
    document.querySelector(".create-gifos__wrapper-title").innerHTML = "";
    const uploadGifoData = uploadGifosRequest(uploadGifoURL, gifoData);

    uploadGifoData
        .then((response) => {
            const gifoInfo = response.data;
            const gifoID = gifoInfo.id;
            let myGifosIDs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_MYGIFS)) || [];
            myGifosIDs.push(gifoInfo);
            localStorage.setItem(LOCAL_STORAGE_MYGIFS, JSON.stringify(myGifosIDs));
            confirmUploadUI();

            const requestGifoInfoURL = `${constant.BASE_URL}gifs/${gifoID}${constant.API_KEY}`;
            return apiRequest(requestGifoInfoURL);
        }).then(response => {
            gifoURL = response.data.images.original.url;
        })
        .catch((error) => { console.log(error) });
};

// Upload status

function showUploadingUI() {
    repeatCaptureBtn.classList.toggle("hidden");
    document.querySelector(".overlay").classList.toggle("hidden");
    counter[1].classList.toggle("counter-process");
    counter[2].classList.toggle("counter-process");
    uploadBtn.classList.add("hidden");
}

// Upload Succes

function confirmUploadUI() {
    document.querySelectorAll(".uploading").forEach(element => element.classList.toggle("hidden"));
    document.querySelectorAll(".uploaded").forEach(element => element.classList.toggle("hidden"));
}

// Grabar de nuevo

function recordAgain() {
    uploadBtn.classList.add("hidden");
    repeatCaptureBtn.classList.toggle("hidden");
    recordBtn.classList.remove("hidden");
    getStreamAndRecord();
}

// Calcula duracion

function calculateTimeDuration(secs) {
    let hr = Math.floor(secs / 3600);
    let min = Math.floor((secs - (hr * 3600)) / 60);
    let sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (min < 10) {
        min = "0" + min;
    }

    if (sec < 10) {
        sec = "0" + sec;
    }

    if (hr <= 0) {
        return min + ':' + sec;
    }

    return hr + ':' + min + ':' + sec;
}

// Bajar Gif

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

// Copiar URL del gif

function copyURL(gifoURL) {
    const aux = document.createElement("input");
    aux.setAttribute("value", gifoURL);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
};