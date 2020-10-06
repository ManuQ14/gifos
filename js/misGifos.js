/*Constantes*/
const apiKey = '8pBDwQcxpghuXM30vBDE69Uhx98gPtsU'
const apiBaseUrl = 'https://api.giphy.com/v1/gifs'
const misgifosContainer = document.getElementsByClassName('misgifos-container')[0];
/* Dropdown Themes */
const dropdown = document.getElementById('dropdown');
const themesContainer = document.getElementsByClassName('button-themes');
const buttonLight = document.getElementById('day');
const buttonDark = document.getElementById('night');
const searchButton = document.getElementsByClassName('search-button')[0];
const searchBar = document.getElementById('search-bar');
const suggestedTopics = ['Woo Hoo', 'Sailor Mercury', 'Vaporwave', 'Glitter'];
const suggestionWrapper = document.getElementsByClassName('search-suggestion-wrapper')[0];
const suggestionContainer = document.getElementsByClassName('suggestions-container')[0];
const trendsContainer = document.getElementsByClassName('trends-container')[0];
const trendsElement = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const pageResults = document.getElementsByClassName('page-results')[0];
const btnRelated = document.getElementsByClassName('btn')[0];
const btnChild = document.getElementsByClassName('btn-related')[0];
const searchResult = document.getElementsByClassName('search-result')[0];


/* Cambio  de tema */
buttonDark.addEventListener("click", () => {
    document.body.classList.replace("themeLight", "themeDark");
    // Guardar elección de Tema
    localStorage.setItem('selectedTheme', 'themeDark');
});

buttonLight.addEventListener("click", () => {
    document.body.classList.replace("themeDark", "themeLight");
    // Guardar elección de Tema
    localStorage.setItem('selectedTheme', 'themeLight');
});

dropdown.addEventListener("click", () => {
    themesContainer[0].classList.toggle("hide-themes");
});

themesContainer[0].addEventListener("focusout", (evento) => {
    console.log(evento)
    themesContainer[0].classList.toggle("hide-themes");
    evento.stopPropagation()
});

// Buscar el tema guardado
window.addEventListener('load', () => {
    let selectedTheme = localStorage.getItem('selectedTheme');
    if (selectedTheme != null && selectedTheme == 'themeDark') {
        document.body.classList.replace("themeLight", "themeDark")
    } else {
        document.body.classList.replace("themeDark", "themeLight");
    }
})


// Carga de Mis Gifos
window.addEventListener('load', () => {
    getMygif().forEach((mygif) => {
        let gridItem = document.createElement("img");
        gridItem.src = mygif.images.original.url
        let gridContainer = document.createElement('div');
        gridContainer.classList.add("item-rectangular");
        gridContainer.appendChild(gridItem);
        misgifosContainer.appendChild(gridContainer);
    });
})

function getMygif() {
    let mygif = [];
    for (var i = 0; i < localStorage.length; i++) {
        let item = localStorage.getItem(localStorage.key(i))
        if (localStorage.key(i).startsWith('myGif')) {
            mygif.push(JSON.parse(item));
        }
    }
    return mygif
}