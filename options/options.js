import {
  addQuickLink,
  getQuickLinks,
  deleteQuickLink,
  editQuickLink,
} from '../dependencies/storage/quickLinkManager.js';

import {
  importQuickLinks,
  exportQuickLinks,
  processQuickLinksFile,
} from '../dependencies/storage/localStorageManager.js';

import { debounce } from '../helpers/debounce.js';
import { sortQuickLinks } from '../helpers/sortQuickLinks.js';
import { getRootDomain } from '../helpers/getRootDomain.js';
import {
  setTheme,
  updateThemeStyles,
} from '../dependencies/themes/themeSwitcher.js';

chrome.storage.local.get('showWelcome', (data) => {
  const showWelcome = data.showWelcome || false;
  if (showWelcome) {
    chrome.storage.local.set({ showWelcome: false });
    chrome.tabs.update(null, {
      url: '/options/instructions/welcome.html',
      active: true,
    });
  }
});

const QuickLink = (shortcut, link, name) => `
  <li class="quick-link-component" data-shortcut="${shortcut}" >
    <div class="quick-link-summary">
      <p id="shortcut">${shortcut}</p>
      <p id="name">${name}</p>
      <div class="component-actions">
        <span id="viewLinkBtn" class="material-symbols-rounded action-icon" data-link-action-popup-btn>
          visibility
        </span>
        <span id="editBtn" class="material-symbols-rounded action-icon">
          edit
        </span>
        <span id="deleteBtn" class="material-symbols-rounded action-icon" >
          delete
        </span>
      </div>
    </div>
    <div class="quick-link-details"><p><i>${link}</i></p></div>
    <div class="quick-link-edit">
      <div class="quick-link-edit-inputs">
        <input class="editNameInput" type="text" placeholder="Name (optional)" value="${name}"/>
        <input class="editLinkInput" type="text" placeholder="Shortcut" value="${link}"/>
      </div>
      <div class="quick-link-edit-actions">
        <button class="space-mono-bold editSaveBtn">Save</button>
      </div>
      <span class="quick-link-edit-message"></span>
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
        let message = viewLinkBtn.addEventListener('click', () => {
          item
            .querySelector('.quick-link-details')
            .classList.toggle('show-details');
        });

        editBtn.addEventListener('click', () => {
          item.querySelector('.quick-link-edit').classList.toggle('show-edit');
          item.querySelector('.editSaveBtn').addEventListener(
            'click',
            debounce(() => handleEditLinkSaveButtonClick(item), 300)
          );

          item
            .querySelectorAll('.editLinkInput, .editNameInput')
            .forEach((element) =>
              element.addEventListener('keydown', (e) =>
                handleEnterKey(e, item)
              )
            );
        });

        deleteBtn.addEventListener('click', async () => {
          const deleteConfirmed = item.hasAttribute('data-delete-confirmed');
          if (!deleteConfirmed) {
            item.setAttribute('data-delete-confirmed', true);
            deleteBtn.innerHTML = 'check';
            setTimeout(() => {
              item.removeAttribute('data-delete-confirmed');
              deleteBtn.innerHTML = 'delete';
            }, 3000);
            return;
          }

          const success = await deleteQuickLink(shortcut);
          if (success) {
            item.remove();
          } else {
            item.removeAttribute('data-delete-confirmed');
            deleteBtn.innerHTML = 'delete';
            console.error(`Failed to remove quick link for '${keyword}'`);
            showMessage(item, 'Failed to delete quick link', 'error');
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
const handleNewLinkSaveButtonClick = async () => {
  try {
    const shortcut = document.getElementById('shortcutInput').value.trim();
    const link = document.getElementById('linkInput').value.trim();
    let name = document.getElementById('nameInput').value.trim();
    const message = document.querySelector('.new-link-message');

    if (!shortcut || !link) {
      showMessage(message, 'Shortcut and Link are required.', 'error');
      return;
    }

    if (name === '' || name === undefined) {
      name = await getRootDomain(link);
    }

    const success = await addQuickLink(shortcut, link, name);

    if (success) {
      clearInputFields();
      displayQuickLinks();
      showMessage(message, 'Quick link added successfully.', 'success');
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

// Edit Quick Link
const handleEditLinkSaveButtonClick = async (element) => {
  try {
    const shortcut = element.querySelector('#shortcut').innerHTML.trim();
    const link = element.querySelector('.editLinkInput').value.trim();
    let name = element.querySelector('.editNameInput').value.trim();
    const message = element.querySelector('.quick-link-edit-message');
    const editSaveBtn = element.querySelector('.editSaveBtn');

    if (!link) {
      showMessage(message, 'Link is required.', 'error');
      return;
    }

    editSaveBtn.disabled = true;

    if (name === '' || name === undefined) {
      name = await getRootDomain(link);
    }

    const success = await editQuickLink(shortcut, link, name);

    if (success) {
      showMessage(message, 'Quick link edited successfully.', 'success');
      setTimeout(() => {
        displayQuickLinks();
        editSaveBtn.disabled = false;
      }, 1500);
    } else {
      showMessage(message, 'Failed to edit quick link.', 'error');
    }
  } catch (error) {
    console.error(error);
    showMessage('An error occurred while editing the quick link.', 'error');
  }
};

const handleEnterKey = (event, item = null) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    if (item !== null) {
      handleEditLinkSaveButtonClick(item);
    } else {
      handleNewLinkSaveButtonClick();
    }
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

  // Event listeners for Theme Switcher
  const themeSwitcher = document.querySelector('.theme-switcher');
  const themeSwitcherIcon = themeSwitcher.querySelector(
    '#theme-switcher-button'
  );
  const themeList = themeSwitcher.querySelector('.theme-list');
  const themeListItems = themeSwitcher.querySelectorAll('.theme-list li');

  themeSwitcherIcon.addEventListener('click', () => {
    themeList.classList.toggle('theme-list-open');
  });

  themeListItems.forEach((item) => {
    // This is where theme swtiching happens
    item.addEventListener('click', async () => {
      const themeName = item.getAttribute('data-theme-name');
      await updateThemeStyles(themeName);
      await setTheme(themeName);
      themeList.classList.toggle('theme-list-open');
      themeListItems.forEach((item) => {
        item.classList.remove('active-theme');
      });
      item.classList.add('active-theme');
    });
  });

  // Event listeners for Instructions
  const instructionsBtn = document.getElementById('instructions-button');
  instructionsBtn.addEventListener('click', () => {
    chrome.tabs.update(null, {
      url: '/options/instructions/welcome.html',
      active: true,
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
    .addEventListener('click', debounce(handleNewLinkSaveButtonClick, 300));
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
