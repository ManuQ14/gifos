const apiKey = "m3y0SF4OTmxII6i3KYicBFG8inGbMb0d";
const apiBaseUrl = "https://api.giphy.com/v1/gifs";
const dropdown = document.getElementById('dropdown');
const themesContainer = document.getElementsByClassName('button-themes');
const buttonDark = document.getElementById('night');
const buttonLight = document.getElementById('day');
const buttonContainer = document.getElementsByClassName("botonera");
const searchButton = document.getElementsByClassName('search-button')[0];
const searchBar = document.getElementById('search-bar')
const suggestedTopics = ['Jonathan Van Ness', 'Sailor Mercury', 'Vaporwave', 'Glitter'];
const suggestionWrapper = document.getElementsByClassName('search-suggestion-wrapper')[0];
const suggestionContainer = document.getElementsByClassName('suggestions-container')[0];
const trendsContainer = document.getElementsByClassName('trends-container')[0];
const trendsElement = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const pageResults = document.getElementsByClassName('page-results')[0];
const btnChild = document.getElementsByClassName('btn-related')[0];
const btn = document.getElementsByClassName('btn')[0];
const btnRelated = document.getElementsByClassName('btn')[0];
const searchResult = document.getElementsByClassName('search-result')[0];



//Handlers


//Cambio de temas

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






//Contenedor de los botones de sugerencia

searchBar.addEventListener('input', event => {
    if (searchBar.value) {
        searchButton.classList.remove('button-disabled')
        searchButton.classList.add('button-active')
    } else {
        searchButton.classList.remove('button-active')
        searchButton.classList.add('button-disabled')
    }
    suggestionWrapper.classList.remove('hidden')
});





//Accion del botón de búsqueda

searchButton.addEventListener("click", () => {
    if (searchBar.value) {
        searchAndAppendGifs(searchBar.value)
    }
})

function searchAndAppendGifs(searchText) {
    getSearchResults(searchText)
        .then(result => {
            let titleResult = document.getElementsByClassName('title-result')[0]
            if (titleResult)
                titleResult.remove();

            let widthArray = result.data.filter(element => {
                return element.images.original.width > element.images.original.height;
            })

            console.log(widthArray);
            let squareGif = result.data.filter(element => {
                return element.images.original != widthArray;
            })

            trendsContainer.classList.replace('trends-container', 'hidden');
            suggestionContainer.classList.replace('suggestions-container', 'hidden');
            let arrayTittle = document.getElementsByClassName('title-box');
            for (let i = 0; i < arrayTittle.length; i++) {
                arrayTittle[i].classList.replace('title-box-div', 'hidden');
            }
            for (let i = 0; i < 10; i++) {
                let clase = trendsElement[i]
                if (clase == "five" || clase == "ten") {
                    let gridItem = document.createElement("img");
                    let hashtagBottom = document.createElement('div');
                    hashtagBottom.innerHTML = `#${getHashtag(widthArray[i].title)}`
                    hashtagBottom.classList.add('hashtag-bottom', 'hashtag-bottom-flex');
                    gridItem.classList.add("grid-item", clase);
                    gridItem.src = widthArray[i].images.original.url;
                    let gridContainer = document.createElement('div');
                    gridContainer.classList.add("grid-item", clase);
                    gridContainer.appendChild(gridItem);
                    gridContainer.appendChild(hashtagBottom);
                    pageResults.appendChild(gridContainer);
                } else {
                    let gridItem = document.createElement("img");
                    let hashtagBottom = document.createElement('div');
                    hashtagBottom.innerHTML = `#${getHashtag(widthArray[i].title)}`
                    hashtagBottom.classList.add('hashtag-bottom', 'hashtag-bottom-flex');
                    gridItem.classList.add("grid-item", clase);
                    gridItem.src = squareGif[i].images.original.url;
                    let gridContainer = document.createElement('div');
                    gridContainer.classList.add("grid-item", clase);
                    gridContainer.appendChild(gridItem);
                    gridContainer.appendChild(hashtagBottom);
                    pageResults.appendChild(gridContainer);
                }
            }

            let searchItem = document.createElement("div");
            searchItem.classList.add("title-result");
            searchItem.innerHTML = `${searchText} (resultados)`
            document.body.insertBefore(searchItem, pageResults);
        })
}




//Suggestions Gifs
window.addEventListener("load", () => {
    suggestedTopics.forEach(element => {
        getSearchResults(element)
            .then(result => {
                const firstResult = result.data[0];
                let boxSuggestion = document.createElement("div");
                boxSuggestion.classList.add("box-suggestions");
                boxSuggestion.innerHTML = `<div class="hashtag">#${element} <img src='./iconos/button3.svg' class="close-btn"></div>
                                           <div class="gif-container"><img src=${firstResult.images.fixed_height.url} class="box-image" data-search="${element}"><div class="see-more"><div class="dotted-a" data-search="${element}">Ver Más...</div></div></img>
                                           </div>`
                suggestionContainer.appendChild(boxSuggestion);
            })
    });
});
suggestionContainer.addEventListener("click", (evento) => {
    if (evento.target !== evento.currentTarget)
        searchAndAppendGifs(evento.target.dataset.search)
    evento.stopPropagation();
});




//Trends Gifs
window.addEventListener("load", () => {
    getTrendsResults()
        .then(result => {
            console.log(result);
            let widthArray = result.data.filter(element => {
                return element.images.original.width > element.images.original.height;
            })
            console.log(widthArray);
            let squareGif = result.data.filter(element => {
                return element.images.original != widthArray;
            })
            for (let i = 0; i < 10; i++) {
                let clase = trendsElement[i]
                if (clase == "five" || clase == "ten") {
                    let gridItem = document.createElement("img");
                    let hashtagBottom = document.createElement('div');
                    hashtagBottom.innerHTML = `#${getHashtag(widthArray[i].title)}`
                    hashtagBottom.classList.add('hashtag-bottom', 'hashtag-bottom-flex');
                    gridItem.src = widthArray[i].images.original.url
                    let gridContainer = document.createElement('div');
                    gridContainer.classList.add("grid-item", clase);
                    gridContainer.appendChild(gridItem);
                    gridContainer.appendChild(hashtagBottom);
                    trendsContainer.appendChild(gridContainer);
                } else {
                    let gridItem = document.createElement("img");
                    let hashtagBottom = document.createElement('div');
                    hashtagBottom.innerHTML = `#${getHashtag(squareGif[i].title)}`
                    hashtagBottom.classList.add('hashtag-bottom', 'hashtag-bottom-flex');
                    gridItem.src = squareGif[i].images.original.url
                    let gridContainer = document.createElement('div');
                    gridContainer.classList.add("grid-item", clase);
                    gridContainer.appendChild(gridItem);
                    gridContainer.appendChild(hashtagBottom);
                    trendsContainer.appendChild(gridContainer);
                }
            }
        })
})









//Botones de sugerencia post búsqueda

searchButton.addEventListener('click', () => {
    if (searchBar.value) {
        btnRelated.classList.remove('hidden')
        btnRelated.classList.add('btn')
        btnRelated.style.display = "flex";
    }
})

btn.addEventListener("click", (evento) => {
    searchAndAppendGifs(evento.target.dataset.search)
});


searchBar.addEventListener('input', () => {
    if (searchBar.value) {
        btnRelated.classList.remove('btn');
        btnRelated.style.display = "none"
    }
})





//Accion sobre los botones grises: Suggestions Results
suggestionWrapper.addEventListener('mousedown', e => {
    searchAndAppendGifs(e.target.dataset.search)
    searchBar.value = e.target.dataset.search
    suggestionWrapper.classList.add('hidden');
})
searchBar.addEventListener('blur', () => {
    suggestionWrapper.classList.add('hidden');
})





//Accion sobre el botón de búsqueda

searchBar.addEventListener('input', () => {
    if (searchBar.value) {
        searchButton.classList.remove('search-button');
        searchButton.classList.add('button-active');
    } else {
        searchButton.classList.remove('button-active');
        searchButton.classList.add('search-button');
    }

})





//Searchbar results function
function getSearchResults(search) {
    const found =
        fetch('https://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + apiKey)
        .then((response) => {
            return response.json()
        }).then(data => {
            return data
        })
        .catch((error) => {
            return error
        })
    return found
}



//Search Suggestion function
function getSuggestionsResults(search) {
    const found =
        fetch('https://api.giphy.com/v1/tags/related/{term}?api_key=' + apiKey)
        .then((response) => {
            return response.json()
        }).then(data => {
            return data
        })
        .catch((error) => {
            return error
        })
    return found
}






//Trends results function
function getTrendsResults() {
    const found = fetch('https://api.giphy.com/v1/gifs/trending?api_key=' + apiKey)
        .then((response) => {
            return response.json()
        }).then(data => {
            return data
        })
        .catch((error) => {
            return error
        })
    return found
}


//Title trends function

function getHashtag(title) {
    let gifUser = title.indexOf('GIF');
    let titleResult = title.substring(0, gifUser);
    return titleResult;
}
