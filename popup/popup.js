import { addQuickLink } from '../dependencies/storage/quickLinkManager.js';

// Debounce function to limit the rate at which a function can fire.
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const handleOptionsButtonClick = () => {
  chrome.runtime.openOptionsPage();
};

const handleSaveButtonClick = async () => {
  try {
    const keyword = document.getElementById('keyword').value.trim();
    const url = document.getElementById('url').value.trim();

    if (!keyword || !url) {
      showMessage('Keyword and URL are required.', 'error');
      return;
    }

    const success = await addQuickLink(keyword, url);

    if (success) {
      clearInputFields();
      showMessage('Quick link added successfully.', 'success');
    } else {
      showMessage('Keyword already exists.', 'error');
    }
  } catch (error) {
    console.error(error);
    showMessage('An error occurred while adding the quick link.', 'error');
  }
};

const handleEnterKey = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    handleSaveButtonClick();
  }
};

document
  .getElementById('optionsBtn')
  .addEventListener('click', handleOptionsButtonClick);
document
  .getElementById('saveBtn')
  .addEventListener('click', debounce(handleSaveButtonClick, 300));
document.getElementById('keyword').addEventListener('keydown', handleEnterKey);
document.getElementById('url').addEventListener('keydown', handleEnterKey);

const clearInputFields = () => {
  document.getElementById('keyword').value = '';
  document.getElementById('url').value = '';
};

const showMessage = (message, type) => {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
  messageElement.className = '';
  messageElement.classList.add(type);
  messageElement.style.display = 'flex';

  setTimeout(() => {
    messageElement.style.display = 'none';
  }, 5000);
};
