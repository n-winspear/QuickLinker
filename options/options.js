import {
  addQuickLink,
  getQuickLinks,
  deleteQuickLink,
} from '../dependencies/storage/quickLinkManager.js';

import {
  importQuickLinks,
  exportQuickLinks,
  processQuickLinksFile,
} from '../dependencies/storage/localStorageManager.js';

import { debounce } from '../helpers/debounce.js';
import { sortQuickLinks } from '../helpers/sortQuickLinks.js';
import { getRootDomain } from '../helpers/getRootDomain.js';

const QuickLink = (shortcut, link, name) => `
  <li class="quick-link-component" data-shortcut="${shortcut}">
  <p id="shortcut">${shortcut}</p>
  <p id="name">${name}</p>
  <div class="component-actions">
    <div class="view-link-popup" data-link-action-popup>
      <span id="viewLinkBtn" class="material-symbols-outlined action-icon" data-link-action-popup-btn>
        visibility
      </span>
      <p class="view-link-popup-content">${link}</p>
    </div>
    <span id="editBtn" class="material-symbols-outlined action-icon">
      edit
    </span>
    <span id="deleteBtn" class="material-symbols-outlined action-icon">
      delete
    </span>
  </div>
  </li>
`;

const addQuickLinkComponentEventListeners = () => {
  try {
    Array.from(document.getElementsByClassName('quick-link-component')).forEach(
      (item) => {
        let shortcut = item.getAttribute('data-shortcut');
        let viewLinkBtn = item.querySelector('#viewLinkBtn');
        let editBtn = item.querySelector('#editBtn');
        let deleteBtn = item.querySelector('#deleteBtn');

        deleteBtn.addEventListener('click', async () => {
          const success = await deleteQuickLink(shortcut);
          if (success) {
            item.remove();
          } else {
            console.error(`Failed to remove quick link for '${keyword}'`);
          }
        });
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const displayQuickLinks = async () => {
  try {
    const quickLinks = await getQuickLinks();
    const sortedLinks = await sortQuickLinks(quickLinks);
    const list = document.getElementById('quick-link-components');

    const html = Object.keys(sortedLinks)
      .map((keyword) => {
        const name =
          'name' in sortedLinks[keyword]
            ? sortedLinks[keyword].name
            : 'Could not identify.';

        return QuickLink(keyword, sortedLinks[keyword].link, name);
      })
      .join('');

    list.innerHTML = html;
    addQuickLinkComponentEventListeners();
  } catch (error) {
    console.error(error);
  }
};

// New Quick Link
const handleSaveButtonClick = async () => {
  try {
    const shortcut = document.getElementById('shortcutInput').value.trim();
    const link = document.getElementById('linkInput').value.trim();
    let name = document.getElementById('nameInput').value.trim();

    console.log('here', typeof name);

    if (!shortcut || !link) {
      showMessage('Shortcut and Link are required.', 'error');
      return;
    }

    if (name === '' || name === undefined) {
      name = await getRootDomain(link);
    }

    // TODO: FIX THE SHOW MESSGE FUNCTION

    const success = await addQuickLink(shortcut, link, name);

    if (success) {
      clearInputFields();
      displayQuickLinks();
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

const handleFileDrop = async (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;

  if (files.length > 0) {
    const file = files[0];
    if (file.type === 'application/json') {
      try {
        await processQuickLinksFile(file);
        displayQuickLinks();
      } catch (error) {
        console.error('Error processing dropped file:', error);
      }
    } else {
      alert('Please drop a valid JSON file.');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'quickLinkAdded') {
      displayQuickLinks();
      sendResponse({ status: 'success' });
    }
  });

  // Event listeners for QuickLink actions
  document.addEventListener('click', (e) => {
    const isLinkPopupActionBtn = e.target.matches(
      '[data-link-action-popup-btn]'
    );
    if (
      !isLinkPopupActionBtn &&
      e.target.closest('[data-link-action-popup]') != null
    ) {
      return;
    }

    let currentLinkActionPopup;
    if (isLinkPopupActionBtn) {
      currentLinkActionPopup = e.target.closest('[data-link-action-popup]');
      currentLinkActionPopup.classList.toggle('active-popup');
    }

    document
      .querySelectorAll('[data-link-action-popup].active-popup')
      .forEach((popup) => {
        if (popup === currentLinkActionPopup) {
          return;
        }
        popup.classList.remove('active-popup');
      });
  });

  // Event listeners for Export
  document
    .getElementById('exportBtn')
    .addEventListener('click', async () => await exportQuickLinks());

  // Event listeners for New Quick Link
  document
    .getElementById('clearBtn')
    .addEventListener('click', clearInputFields);
  document
    .getElementById('saveBtn')
    .addEventListener('click', debounce(handleSaveButtonClick, 300));
  document
    .querySelectorAll('#shortcutInput, #linkInput, #nameInput')
    .forEach((element) => element.addEventListener('keydown', handleEnterKey));

  // Event listeners for Import
  document.querySelectorAll('.importBtn').forEach((element) =>
    element.addEventListener(
      'click',
      debounce(async () => {
        await importQuickLinks();
        displayQuickLinks();
      }, 300)
    )
  );

  // Handling drag & drop
  const uploadBox = document.getElementById('upload-box');

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
    uploadBox.addEventListener(
      eventName,
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    );
    document.body.addEventListener(
      eventName,
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    );
  });

  // Highlight the drop area when the file is over it
  ['dragenter', 'dragover'].forEach((eventName) => {
    uploadBox.addEventListener(
      eventName,
      () => {
        uploadBox.classList.add('upload-box-drag');
      },
      false
    );
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    uploadBox.addEventListener(
      eventName,
      () => {
        uploadBox.classList.remove('upload-box-drag');
      },
      false
    );
  });

  // Handle dropped files
  uploadBox.addEventListener('drop', handleFileDrop, false);

  displayQuickLinks();
});
