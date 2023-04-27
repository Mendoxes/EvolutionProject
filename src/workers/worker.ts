
let timerId: any;
let mouseMoved = false;

// Start the timer
timerId = setInterval(() =>
{
    if (!mouseMoved)
    {

        window.postMessage('screensaver-started');
    }
    mouseMoved = false;
}, 30000);

// Listen for mouse events

window.addEventListener('mousemove', () =>
{
    mouseMoved = true;

    window.postMessage('screensaver-stopped');
});


export { }