// Variables globales

const LOCAL_STORAGE_IS_DARK = "Dark Theme";
const darkThemeLink = document.querySelector(".dark-mode");
const lightThemeLink = document.querySelector(".day-mode");
const logo = document.querySelector(".navigation-bar__logo");
const camera = document.querySelector(".camera");
const film = document.querySelector(".film");

// Eventos

darkThemeLink.addEventListener("click", changeTheme);
lightThemeLink.addEventListener("click", changeTheme);

// Cambio de tema

function changeTheme(e) {
    document.querySelector("body").classList.toggle("dark");
    if (e.target.innerHTML === "Modo Nocturno") {
        localStorage.setItem(LOCAL_STORAGE_IS_DARK, "true");
        darkThemeLink.classList.add("hidden");
        lightThemeLink.classList.remove("hidden");
        logo.src = "./assets/logo-mobile_nigh.svg";
        if (camera) {
            camera.src = "./assets/camara-modo-noc.svg";
            film.src = "./assets/pelicula-modo-noc.svg";
        };
    } else {
        localStorage.setItem(LOCAL_STORAGE_IS_DARK, "false");
        darkThemeLink.classList.remove("hidden");
        lightThemeLink.classList.add("hidden");
        logo.src = "./assets/logo-mobile.svg";
        if (camera) {
            camera.src = "./assets/camara.svg";
            film.src = "./assets/pelicula.svg";
        };
    };
};

// Chequea si darkmode esta activo

function darkThemeCheck() {
    if (localStorage.getItem(LOCAL_STORAGE_IS_DARK) === "true") {
        document.querySelector("body").classList.add("dark");
        darkThemeLink.classList.add("hidden");
        lightThemeLink.classList.remove("hidden");
        logo.src = "./assets/logo-mobile_nigh.svg";
        if (camera) {
            camera.src = "./assets/camara-modo-noc.svg";
            film.src = "./assets/pelicula-modo-noc.svg";
        };
    };
};

darkThemeCheck();