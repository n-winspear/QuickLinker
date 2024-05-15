import { deleteQuickLink } from '../modules/quickLinks/quickLinkManager.js';
import QuickLink from '../components/QuickLink.js';

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
    const result = await chrome.storage.local.get('quickLinks');
    const quickLinks = result.quickLinks || {};
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

displayQuickLinks();
