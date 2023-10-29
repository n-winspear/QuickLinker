import { saveAlias, removeAlias } from './storage.js';

// Listener for Omnibox (URL bar) events
chrome.omnibox.onInputEntered.addListener(async (text) => {
    try {
        const result = await chrome.storage.sync.get('aliases');
        const aliasesArray = Object.values(result.aliases);

        const matchedAlias = aliasesArray.find(
            (alias) => alias.keyword === text
        );

        const url = matchedAlias
            ? matchedAlias.url
            : `https://www.google.com/search?q=${text}`;

        await chrome.tabs.update({ url: url });
    } catch (error) {
        console.error(error);
    }
});

// Listener for Popup events
chrome.runtime.onMessage.addListener(async (message, sender) => {
    const { action, id, keyword, url } = message;

    try {
        let storageResponse;
        switch (action) {
            // Adding New Alias
            case 'saveAlias':
                storageResponse = await saveAlias(id, keyword, url);

                if (storageResponse.status !== 'success')
                    throw new Error('Error storing alias');

                chrome.runtime.sendMessage({
                    action: 'response',
                    status: 'success',
                });

                break;

            // Removing Alias
            case 'removeAlias':
                storageResponse = await removeAlias(id);

                if (storageResponse.status !== 'success')
                    throw new Error('Error removing alias');

                chrome.runtime.sendMessage({
                    action: 'response',
                    status: 'success',
                });

                break;

            // Unknown Action
            default:
                throw new Error('Unknown action');
        }
    } catch (error) {
        chrome.runtime.sendMessage({
            action: 'response',
            status: 'error',
            error: error.message,
        });
    }
});
