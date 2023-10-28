// Listener for omnibox input
chrome.omnibox.onInputEntered.addListener(async (text) => {
    try {
        const result = await chrome.storage.sync.get('keywords');
        const url =
            result.keywords[text] || `https://www.google.com/search?q=${text}`;
        if (url) {
            await chrome.tabs.update({ url: url });
        }
    } catch (error) {
        console.error(error);
    }
});

// Message listener for popup actions
chrome.runtime.onMessage.addListener((message, sender) => {
    new Promise(async (resolve, reject) => {
        try {
            if (message.action === 'saveKeyword') {
                await saveKeyword(message.keyword, message.url);
                resolve({ status: 'success' });
            } else if (message.action === 'removeKeyword') {
                await removeKeyword(message.keyword);
                resolve({ status: 'success' });
            } else {
                reject(new Error('Unknown action'));
            }
        } catch (error) {
            reject(error);
        }
    }).then(
        (result) =>
            chrome.runtime.sendMessage({ action: 'response', ...result }),
        (error) =>
            chrome.runtime.sendMessage({
                action: 'response',
                status: 'error',
                error: error.message,
            })
    );
});

// Saves a keyword/URL pair to storage
async function saveKeyword(keyword, url) {
    const result = await chrome.storage.sync.get('keywords');
    const keywords = result.keywords || {};
    keywords[keyword] = url;
    await chrome.storage.sync.set({ keywords: keywords });
}

// Removes a keyword from storage
async function removeKeyword(keyword) {
    const result = await chrome.storage.sync.get('keywords');
    const keywords = result.keywords || {};
    delete keywords[keyword];
    await chrome.storage.sync.set({ keywords: keywords });
}
