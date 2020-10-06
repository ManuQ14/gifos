const apiKey = "m3y0SF4OTmxII6i3KYicBFG8inGbMb0d";
const apiBaseUrl = "https://api.giphy.com/v1/gifs";


const buttonStart = document.getElementsByClassName('start')[0];
const loadingWindow = document.getElementsByClassName('loading-window')[0];
const captureWindow = document.getElementsByClassName('capture')[0];
const captureTitle = document.getElementsByClassName('capture-title')[0];
const video = document.getElementsByClassName('video')[0];
const buttonCaptureContainer = document.getElementsByClassName('button-capture-container')[0];
const captureButton = document.getElementsByClassName('button-capture')[0];
const buttonCaptureImg = document.getElementsByClassName('button-capture-img')[0];
const captureImg = document.getElementsByClassName('capture-img')[0];
const timerHidden = document.getElementsByClassName('timer-hidden')[0];
const timerOn = document.getElementById('timer');
const buttonsUpload = document.getElementById('uploadWrapper');
const uploadGif = document.getElementById('upload');
const repeatGif = document.getElementById('repeat');
const playBar = document.getElementsByClassName('playbar')[0];
const playBarContainer = document.getElementsByClassName("playbar-container")[0];
const videoContainer = document.getElementsByClassName("video-container")[0];
const uploadingGif = document.getElementsByClassName("uploading-gif")[0];
const cancelGif = document.getElementById('cancelGif');
const secondaryButton = document.getElementsByClassName("secondary-button")[0];
const progresBarItems = document.getElementsByClassName("progress-bar-item");
const successWindow = document.getElementsByClassName('success-hidden')[0];
const gifPreview = document.getElementsByClassName("gif-preview")[0];
const videoPreview = document.getElementsByClassName('video-preview')[0];
const copyLink = document.getElementsByClassName('copy-link')[0];
const downloadGif = document.getElementsByClassName('download-gif')[0];
const misgifosContainer = document.getElementsByClassName('misgifos-container')[0];
const gifReady = document.getElementsByClassName('gif-ready')[0];
var isRecording = false;
var recorder;
var stopRecording = false;
var stream, form;
let preview;



// Buscar el tema guardado

window.addEventListener('load', () => {
    let selectedTheme = localStorage.getItem('selectedTheme');
    if (selectedTheme != null && selectedTheme == 'themeDark') {
        document.body.classList.replace("themeLight", "themeDark")
    } else {
        document.body.classList.replace("themeDark", "themeLight");
    }
})

//Funcionalidades

buttonStart.addEventListener('click', () => {
    getStreamAndRecord()
})

function getStreamAndRecord() {
    navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                height: {
                    max: 434,
                    exact: 434
                },
                width: {
                    max: 838,
                    exact: 838
                },
            }
        })
        .then(function (cameraResponse) {
            stream = cameraResponse;
            video.srcObject = stream;
            video.play()
            captureButton.addEventListener('click', captureButtonCallback);
        })
    return (true);
}

function captureButtonCallback() {
    isRecording = !isRecording;
    if (isRecording) {
        recorder = RecordRTC(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 390,
            height: 270,
            onGifRecordingStarted: () => {
                console.log('Empezo a grabar');
            }
        })
        recorder.startRecording();
        setTimer();
        recorder.camera = stream;
        captureTitle.innerHTML = 'Capturando tu Gifo <img src="iconos/button3.svg" class="close">';
        captureButton.innerHTML = 'Listo';
        captureButton.classList.add('ready');
        buttonCaptureImg.classList.add('box-recording');
        captureImg.classList.add('recording');
    } else {
        recorder.stopRecording(stopRecordingCallback);
    }
}

function stopRecordingCallback() {
    recorder.camera.stop()
    video.classList.add('hidden');
    preview = document.createElement('img');
    videoContainer.appendChild(preview);
    preview.classList.replace('preview', 'video');
    preview.src = URL.createObjectURL(recorder.getBlob())
    form = new FormData();
    form.append('file', recorder.getBlob(), 'myGif.gif');
    downloadFile = recorder.getBlob();
    recorder.destroy();
    recorder = null;
    buttonCaptureContainer.classList.replace('button-capture-container', 'hidden');
    buttonsUpload.classList.replace('buttons-hidden', 'buttons-upload');
    uploadGif.addEventListener("click", uploadGifCallback);
    repeatGif.addEventListener('click', () => {
        uploadGif.removeEventListener('click', uploadGifCallback);
        captureTitle.innerHTML = 'Un Chequeo antes de empezar <img src="iconos/button3.svg" class="close">';
        captureButton.innerHTML = 'Capturar';
        captureButton.classList.remove('ready');
        buttonCaptureImg.classList.remove('box-recording');
        captureImg.classList.remove('recording');
        buttonCaptureContainer.classList.replace('hidden', 'button-capture-container');
        timerOn.classList.replace('timer-on', 'timer-hidden');
        buttonsUpload.classList.replace('buttons-upload', 'buttons-hidden');
        preview.removeAttribute('src');
        video.classList.replace('hidden', 'video');
        captureButton.removeEventListener('click', captureButtonCallback);
        getStreamAndRecord();
    })
    return (preview);
}

function uploadGifCallback() {
    preview.classList.add("hidden");
    timerOn.classList.replace('timer-on', 'timer-hidden');
    playBar.classList.add("hidden");
    buttonsUpload.classList.add("hidden");
    playBarContainer.classList.add("hidden");
    buttonsUpload.classList.replace('buttons-upload', 'buttons-hidden');
    progressBarAnimation();
    uploadGifReady();
    uploadingGif.classList.remove("hidden");
    uploadingGif.style.display = "flex";
    cancelGif.classList.replace("cancel-hidden", "cancel-btn");
    secondaryButton.classList.add("hidden");
    buttonsUpload.classList.replace("buttons-upload", "buttons-hidden");
}



async function progressBarAnimation() {
    let contador = 0;
    return new Promise((resolve, reject) => {

        setInterval(() => {
            if (contador < progresBarItems.length) {
                progresBarItems[contador].classList.toggle("progress-bar-item-active");
                contador++;
            } else {
                resolve();
            }
        }, 250)

    })


}



function uploadGifReady() {
    fetch('https://upload.giphy.com/v1/gifs?api_key=' + apiKey, {
            method: 'POST',
            body: form,
        })
        .then((respuesta) => {
            if (respuesta.status != 200)
                alert("Ha ocurrido un error, intente nuevamente")
            return respuesta.json();
        })
        .then((respuestaJson) => {
            getGifDetails(respuestaJson.data.id)
        })
        .catch((error) => {
            console.log(error);
        });
}



async function getGifDetails(id) {
    fetch('https://api.giphy.com/v1/gifs/' + id + '?api_key=' + apiKey)
        .then((respuestaApi) => {
            if (respuestaApi.status != 200)
                alert("Ha ocurrido un error, intente nuevamente")
            return respuestaApi.json();
        })
        .then((respuestaJson) => {
            localStorage.setItem('myGif' + id, JSON.stringify(respuestaJson.data));
            uploadingGif.classList.add("hidden");
            uploadingGif.style.display = "none";
            cancelGif.classList.replace("buttons-hidden", "cancel-btn");
            captureWindow.classList.replace('capture', 'hidden');
            successWindow.classList.replace('success-hidden', 'success-upload');
            let videoPreview = document.createElement("img");
            gifPreview.appendChild(videoPreview);
            videoPreview.classList.add('video-preview');
            videoPreview.src = respuestaJson.data.images.fixed_height.url;
            copyLink.addEventListener('click', async () => {
                await navigator.clipboard.writeText(respuestaJson.data.url);
                alert('Se ha copiado exitosamente en el portapapeles');
            })
            downloadGif.addEventListener('click', () => {
                let a = document.createElement('a');
                a.download = 'myGif.gif';
                a.href = window.URL.createObjectURL(downloadFile);
                a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
                a.click();
            })
        })
    await progressBarAnimation();
}
gifReady.addEventListener('click', () => {
    location.reload();
});

//Handler para ocultar ventana 1 y traer la 2
buttonStart.addEventListener('click', () => {
    loadingWindow.classList.add('hidden');
    captureWindow.classList.remove('hidden');
});

captureButton.addEventListener('click', () => {
    timerHidden.classList.replace('timer-hidden', 'timer-on');
});

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
});

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


/* Funcionalidad para el timer */
function setTimer() {
    let seconds = 0;
    let minutes = 0;
    let timer = setInterval(() => {
        if (isRecording == true) {
            if (seconds < 60) {
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }
                timerOn.innerHTML = `00:00:0${minutes}:${seconds}`
                seconds++;
            } else {
                seconds = 0;
                minutes++;
            }
        } else {
            timerOn.innerHTML = `00:00:00:00`
            clearInterval(timer);
        }
    }, 1000);
}
