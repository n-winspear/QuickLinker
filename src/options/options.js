function Alias(keyword, url) {
    return `
    <li class="aliasItem">
        <span class="aliasKeyword" data-keywordId="1">${keyword}</span>
        <span class="aliasArrow">&#8594;</span>
        <a class="aliasUrl" href="${url}" target="_blank"
            >${url}
        </a>
        <div class="button removeBtn" role="button" data-keyword="${keyword}">
            <i class="material-icons" style="font-size: 20px"
                >delete</i
            >
        </div>
    </li>`;
}

async function displayAliases() {
    try {
        const items = await chrome.storage.sync.get(null);
        const ul = document.getElementById('aliasItems');
        let html = '';
        for (let keyword in items.keywords) {
            const li = Alias(keyword, items.keywords[keyword]);
            html = html + li;
        }
        ul.innerHTML = html;
        Array.from(document.getElementsByClassName('removeBtn')).forEach(
            (button) => {
                const keyword = button.getAttribute('data-keyword');
                if (keyword) {
                    button.addEventListener('click', () => {
                        console.log('removing', keyword);
                        chrome.runtime.sendMessage({
                            action: 'removeKeyword',
                            keyword: keyword,
                        });
                    });
                }
            }
        );
    } catch (error) {
        console.error(error);
    }
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'response') {
        if (message.status === 'success') {
            displayAliases();
        } else {
            console.error(message.error);
        }
    }
});

displayAliases();
