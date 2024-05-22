import {
  getQuickLinks,
  deleteQuickLink,
} from '../dependencies/storage/quickLinkManager.js';

import {
  importQuickLinks,
  exportQuickLinks,
} from '../dependencies/storage/localStorageManager.js';

const QuickLink = (keyword, url) => `
  <li class="quickLinkItem" data-keyword="${keyword}">
    <span class="quickLinkKeyword">${keyword}</span>
    <span class="quickLinkArrow">→</span>
    <span class="quickLinkUrl">${url}</span>
    <button class="button removeBtn" title="Remove">
      <i class="material-icons">remove</i>
    </button>
  </li>
`;

const addQuickLinkComponentEventListeners = () => {
  try {
    Array.from(document.getElementsByClassName('quickLinkItem')).forEach(
      (item) => {
        let keyword = item.getAttribute('data-keyword');
        let removeBtn = item.querySelector(':scope > .removeBtn');

        removeBtn.addEventListener('click', async () => {
          const success = await deleteQuickLink(keyword);
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
    const list = document.getElementById('quickLinkItems');

    const html = Object.keys(quickLinks)
      .map((keyword) => QuickLink(keyword, quickLinks[keyword].url))
      .join('');

    list.innerHTML = html;
    addQuickLinkComponentEventListeners();
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'quickLinkAdded') {
      console.log('Received quickLinkAdded message');
      displayQuickLinks();
      sendResponse({ status: 'success' });
    }
  });

  document
    .getElementById('exportBtn')
    .addEventListener('click', exportQuickLinks);
  document
    .getElementById('importBtn')
    .addEventListener('click', importQuickLinks);

  displayQuickLinks();
});
