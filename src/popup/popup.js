function validateURL(url) {
    const urlRegex =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(url);
}

document.getElementById('optionsBtn').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
    console.log('hello');
});

document.getElementById('saveBtn').addEventListener('click', async () => {
    const keyword = document.getElementById('keyword').value.trim();
    const url = document.getElementById('url').value.trim();

    if (keyword && validateURL(url)) {
        await chrome.runtime.sendMessage({
            action: 'saveKeyword',
            keyword: keyword,
            url: url,
        });

        document.getElementById('keyword').value = '';
        document.getElementById('url').value = '';
    } else {
        alert('Please enter a valid keyword and URL.');
    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'response') {
        if (message.status === 'success') {
            console.log('displaying');
        } else {
            console.error(message.error);
        }
    }
});
