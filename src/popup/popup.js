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
    const errorMessage = document.getElementById('errorMessage');

    if (!keyword || !url) {
      errorMessage.classList.add('showError');
      return;
    }

    errorMessage.classList.remove('showError');

    const id = Math.random() * 10000;

    await chrome.runtime.sendMessage({
      action: 'saveAlias',
      id: id,
      keyword: keyword,
      url: url,
    });

    clearInputFields();
  } catch (error) {
    console.error(error);
    alert('Please enter a valid Keyword and URL');
  }
};

// Event listeners
document
  .getElementById('optionsBtn')
  .addEventListener('click', handleOptionsButtonClick);

document
  .getElementById('saveBtn')
  .addEventListener('click', handleSaveButtonClick);

document.getElementById('keyword').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') handleSaveButtonClick();
});

document.getElementById('url').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') handleSaveButtonClick();
});

// Response listener from background.js
chrome.runtime.onMessage.addListener((message) => {
  try {
    const { action, status, error } = message;

    switch (action) {
      case 'saveAlias':
        if (!status === 'success') throw new Error(error);
        break;

      default:
        throw new Error('Popup response listener action not defined', action);
    }
  } catch (error) {
    console.error(error);
  }
});
