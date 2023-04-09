if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/path/to/your/service-worker.js').then(function (registration) {
        console.log('Service worker registered successfully:', registration.scope);
    }).catch(function (error) {
        console.log('Service worker registration failed:', error);
    });
}


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === 'startExtension') {
        setInputsListen();
        sendResponse('thanks')
    }
});


