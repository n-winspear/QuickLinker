const addEventListeners = () => {
    try {
        Array.from(document.getElementsByClassName('removeBtn')).forEach(
            (button) => {
                let id = button.getAttribute('data-id');
                button.addEventListener('click', () => {
                    chrome.runtime.sendMessage({
                        action: 'removeAlias',
                        id: id,
                    });
                });
            }
        );
    } catch (error) {
        console.error(error);
    }
};

const displayAliases = async () => {
    try {
        const result = await chrome.storage.sync.get('aliases');
        const aliases = result.aliases || {};
        const aliasesKeys = Object.keys(result.aliases);
        const list = document.getElementById('aliasItems');

        const html = aliasesKeys
            .map((key) => Alias(key, aliases[key].keyword, aliases[key].url))
            .join('');

        list.innerHTML = html;
    } catch (error) {
        console.error(error);
    }
};

const removeAlias = async (id) => {
    const listElements = Array.from(
        document.getElementsByClassName('aliasItem')
    );
    listElements
        .filter((element) => element.getAttribute('data-id') === id)
        .remove();
};

// Response listener from background.js
chrome.runtime.onMessage.addListener((message) => {
    try {
        const { action, status, error } = message;

        switch (action) {
            case 'response':
                if (!status === 'success') throw new Error(error);

            default:
                throw new Error('Popup response listener action not defined');
        }
    } catch (error) {
        console.error(error);
    }
});

displayAliases();
