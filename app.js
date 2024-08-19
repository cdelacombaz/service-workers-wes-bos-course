import {drawToCanvas, populateVideo} from "./src/video";
import {countdown, takePhoto} from "./src/photo";


async function start() {
    const videoEl = document.querySelector('video');
    const canvasEl = document.querySelector('canvas');
    const strip = document.querySelector('.strip');
    const filterButtons = document.querySelectorAll('button.filter');
    const countdownButton = document.querySelector('.count');

    if (!videoEl) throw Error('No video Element Found on the page');
    await populateVideo(videoEl);

    canvasEl.height = videoEl.videoHeight;
    canvasEl.width = videoEl.videoWidth;

    // start to draw the video
    let interval = setInterval(() => {
        drawToCanvas(videoEl, canvasEl);
    }, 16);

    filterButtons.forEach(button => {
        button.addEventListener('click', async function () {
            clearInterval(interval);
            // lazy load the filters
            const filters = await import('./src/filters.js');
            console.log("=>(app.js:28) filters", filters);
            interval = setInterval(() => {
                drawToCanvas(videoEl, canvasEl, filters[this.dataset.filter]);
            }, 16);
        });
    });

    canvasEl.addEventListener('click', () => {
        takePhoto(videoEl, canvasEl, strip);
    });

    countdownButton.addEventListener('click', () => {
        console.log('Click');
        countdown(videoEl, canvasEl, strip);
    });
}

start();

// this is just a little bit of code that makes our tooling reload the page if and then the modules are updated. For development only
// if (module.hot) {
//     module.hot.dispose(() => {
//         window.location.reload();
//     });
// }

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        const registration = await navigator.serviceWorker.register('/service-workers-wes-bos-course.github.io/service-worker.js', {
            scope: '/service-workers-wes-bos-course.github.io/',
        });
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        registration.onupdatefound = () => {
            alert('Hey, there is an update to this app! Just refresh your browser to see');
        };
    });
}
