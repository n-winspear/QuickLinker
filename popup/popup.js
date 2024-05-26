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
    const message = document.querySelector('.new-link-message');

    if (!shortcut || !link) {
      showMessage(message, 'Shortcut and Link are required.', 'error');
      return;
    }

    const success = await addQuickLink(shortcut, link, name);

    if (success) {
      clearInputFields();
      showMessage(message, 'Quick link added successfully.', 'success');
      setTimeout(() => window.close(), 2000);
    } else {
      showMessage(message, 'Shortcut already exists.', 'error');
    }
  } catch (error) {
    console.error(error);
    showMessage(
      message,
      'An error occurred while adding the quick link.',
      'error'
    );
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

const showMessage = (element, message, type) => {
  element.textContent = message;
  element.classList.add(type);
  element.style.display = 'flex';
  setTimeout(() => {
    element.classList.remove(type);
    element.style.display = 'none';
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
