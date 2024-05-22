import {
  getQuickLinks,
  deleteQuickLink,
} from '../dependencies/storage/quickLinkManager.js';

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

const addEventListeners = () => {
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
    addEventListeners();
  } catch (error) {
    console.error(error);
  }
};

// Listen for messages to refresh the list
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'quickLinkAdded') {
    displayQuickLinks();
  }
});

// Display instructions if query parameter is present
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('showInstructions')) {
  document.getElementById('instructions').style.display = 'block';
  document.getElementById('extensionId').textContent = chrome.runtime.id;
}

displayQuickLinks();
