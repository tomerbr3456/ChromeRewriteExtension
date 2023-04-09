let isLoading = false;

const WIDTHOFFSET = 15;
const OFFSET = 5;

async function getSuggestions(text) {
    divLoader.style.display = 'block';
    return fetch("https://api.ai21.com/studio/v1/paraphrase", {
        headers: {
            "Authorization": "Bearer LZQruxNMCgKfRayqRaJkygDKTjvfaIxn", "Content-Type": "application/json"
        }, body: JSON.stringify({style: 'casual', text: text}), method: "POST"
    }).then(response => response.json())
        .then(data => {
            divLoader.style.display = 'none';
            return data.suggestions.map((suggest) => suggest.text);
        }).catch(error => console.log(error));

}


function createSuggestionsCard(input, suggestions) {
    const card = document.createElement("div");
    card.classList.add("suggestions-card");

    const cardContent = document.createElement("div");

    suggestions.forEach((suggestion) => {
        const suggestionElement = document.createElement("p");
        suggestionElement.classList.add('suggest');
        suggestionElement.innerText = suggestion;
        suggestionElement.addEventListener('click', async () => {
            input.value = suggestionElement.innerText;
            card.remove();
            cardContent.remove();
        });
        cardContent.appendChild(suggestionElement);
    });

    // Add card content to card
    card.appendChild(cardContent);
    const {height, width} = card.getBoundingClientRect();
    // Position card above input
    const inputRect = input.getBoundingClientRect();
    card.style.left = inputRect.left - width - WIDTHOFFSET + "px";
    card.style.top = inputRect.top - height - 200 - OFFSET + "px";

    document.body.appendChild(card);
}


function addRewriteButton(input) {
    if (input === document.activeElement) {
        const rewriteButton = document.createElement('button');
        rewriteButton.classList.add('rewrite-button');
        const iconUrl = chrome.runtime.getURL('icon.png');
        const iconImg = document.createElement('img');
        iconImg.src = iconUrl;
        rewriteButton.appendChild(iconImg);
        rewriteButton.addEventListener('click', async () => {
            isLoading = true;
            try {
                const suggestions = await getSuggestions(input.value);
                createSuggestionsCard(input, suggestions);
                isLoading = false;
            } catch (error) {
                isLoading = false;
                console.log(error);
            }
        });

        const {top, left, height, width} = input.getBoundingClientRect();
        document.body.appendChild(rewriteButton);
        const {width: bWidth, height: bHeight} = rewriteButton.getBoundingClientRect();
        rewriteButton.style.position = 'absolute';
        rewriteButton.style.left = (left + window.scrollX + width) - (WIDTHOFFSET + bWidth) + "px";
        rewriteButton.style.top = (top + window.scrollY + height) - OFFSET - bHeight + "px";
        rewriteButton.addEventListener('focusout', () => {
            rewriteButton.remove();
        });
    }
}


function setInputsListen() {
    const inputs = document.querySelectorAll('input, textarea, div[contenteditable=true], p[contenteditable=true]');
    console.info('starting process', inputs);

    inputs.forEach(input => {
        addRewriteButton(input);
    });
}

const divLoader = document.createElement('div');
divLoader.classList.add('spinner');
document.body.appendChild(divLoader);

window.addEventListener('load', function () {
    chrome.runtime.sendMessage({type: 'startExtension'});
});
// setTimeout(setInputsListen, 5000);
document.addEventListener('focusin', () => {
    const inputs = ['input', 'textarea'];
    console.log(document.activeElement, 'active');
    if (document.activeElement && inputs.indexOf(document.activeElement.tagName.toLowerCase()) !== -1)
        addRewriteButton(document.activeElement);
});
