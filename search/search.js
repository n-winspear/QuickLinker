import { getQuickLinks } from '../dependencies/storage/quickLinkManager.js';

// Receive search query from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setQuery') {
    const query = request.query;
    handleSearch(query);
  }
});

const handleSearch = async (query) => {
  if (query) {
    const quickLinks = await getQuickLinks();
    const shortcut = query.trim();
    if (quickLinks[shortcut]) {
      const url = quickLinks[shortcut].link;
      chrome.tabs.update(null, {
        url: url,
        active: false,
      });
    } else {
      console.log(`No quick link found for shortcut: ${shortcut}`);
      const url = `https://www.google.com/search?q=${query}`;
      chrome.tabs.update(null, {
        url: url,
        active: false,
      });
    }
  }
};

// Call handleSearch on page load (in case query sent directly)
window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');
  handleSearch(query);
};
