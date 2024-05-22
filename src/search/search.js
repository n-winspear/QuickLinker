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
    const keyword = query.trim();
    if (quickLinks[keyword]) {
      const url = quickLinks[keyword].url;
      window.location.replace(url);
    } else {
      console.log(`No quick link found for keyword: ${keyword}`);
      const url = `https://www.google.com/search?q=${query}`;
      window.location.replace(url);
    }
  }
};

// Call handleSearch on page load (in case query sent directly)
window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');
  handleSearch(query);
};
