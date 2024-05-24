import { addQuickLink } from '../dependencies/storage/quickLinkManager.js';
import { debounce } from '../helpers/debounce.js';

const handleOptionsButtonClick = () => {
  chrome.runtime.openOptionsPage();
};

const handleSaveButtonClick = async () => {
  try {
    const shortcut = document.getElementById('shortcutInput').value.trim();
    const link = document.getElementById('linkInput').value.trim();
    const name = document.getElementById('nameInput').value.trim();

    if (!shortcut || !link) {
      showMessage('Shortcut and Link are required.', 'error');
      return;
    }

    // TODO: FIX THE SHOW MESSGE FUNCTION

    const success = await addQuickLink(shortcut, link, name);

    if (success) {
      clearInputFields();
      showMessage('Quick link added successfully.', 'success');
    } else {
      showMessage('Shortcut already exists.', 'error');
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

const clearInputFields = () => {
  document.getElementById('shortcutInput').value = '';
  document.getElementById('linkInput').value = '';
  document.getElementById('nameInput').value = '';
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

document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('optionsBtn')
    .addEventListener('click', handleOptionsButtonClick);
  document
    .getElementById('clearBtn')
    .addEventListener('click', clearInputFields);
  document
    .getElementById('saveBtn')
    .addEventListener('click', debounce(handleSaveButtonClick, 300));
  document
    .querySelectorAll('#shortcutInput, #linkInput, #nameInput')
    .forEach((element) => element.addEventListener('keydown', handleEnterKey));
});
