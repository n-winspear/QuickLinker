import { deleteQuickLink } from '../modules/quickLinks/quickLinkManager.js';
import Alias from '../components/Alias.js';

const addEventListeners = () => {
  try {
    Array.from(document.getElementsByClassName('aliasItem')).forEach((item) => {
      let keyword = item.getAttribute('data-keyword');
      let removeBtn = item.querySelector(':scope > .removeBtn');

      removeBtn.addEventListener('click', async () => {
        const success = await deleteQuickLink(keyword);
        if (success) {
          item.remove();
        } else {
          console.error(`Failed to remove alias for '${keyword}'`);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};

const displayAliases = async () => {
  try {
    const result = await chrome.storage.local.get('quickLinks');
    const quickLinks = result.quickLinks || {};
    const list = document.getElementById('aliasItems');

    const html = Object.keys(quickLinks)
      .map((keyword) => Alias(keyword, quickLinks[keyword].url))
      .join('');

    list.innerHTML = html;
    addEventListeners();
  } catch (error) {
    console.error(error);
  }
};

displayAliases();
