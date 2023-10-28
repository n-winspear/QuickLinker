const clearInputFields = () => {
    document.getElementById('keyword').value = '';
    document.getElementById('url').value = '';
};

const handleOptionsButtonClick = () => {
    try {
        chrome.runtime.openOptionsPage();
    } catch (error) {
        console.error(error);
    }
};

const handleSaveButtonClick = async () => {
    try {
        const keyword = document.getElementById('keyword').value.trim();
        const url = document.getElementById('url').value.trim();

        if (!keyword || !url)
            throw new Error('Please enter a valid keyword and URL');

        const id = generateId();

        await chrome.runtime.sendMessage({
            action: 'saveAlias',
            id: id,
            keyword: keyword,
            url: url,
        });

        clearInputFields();
    } catch (error) {
        console.error(error);
    }
};

// Event listeners
document
    .getElementById('optionsBtn')
    .addEventListener('click', handleOptionsButtonClick);

document
    .getElementById('saveBtn')
    .addEventListener('click', handleSaveButtonClick);

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
