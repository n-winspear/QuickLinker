import { getQuickLinks } from '../dependencies/storage/quickLinkManager.js';

// Suggest keywords based on input
chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
  // const { quickLinks } = await chrome.storage.local.get('quickLinks');
  const quickLinks = await getQuickLinks();

  if (quickLinks) {
    const suggestions = Object.keys(quickLinks)
      .filter((shortcut) => shortcut.includes(input))
      .map((shortcut) => ({
        content: quickLinks[shortcut].link,
        description: `Open ${quickLinks[shortcut].link}`,
      }));

    suggest(suggestions);
  }
});

chrome.omnibox.onInputEntered.addListener(async (input) => {
  const quickLinks = await getQuickLinks();
  const url = quickLinks[input]?.url;
  if (url) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[0].id, { url });
    });
  } else {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      input
    )}`;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[0].id, { url: searchUrl });
    });
  }
});
