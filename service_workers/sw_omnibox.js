import { getQuickLinks } from '../dependencies/storage/quickLinkManager.js';

// Suggest keywords based on input
chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
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
  const link = quickLinks[input]?.link;
  if (link) {
    chrome.tabs.update(null, {
      url: link,
      active: true,
    });
  } else {
    const searchLink = `https://www.google.com/search?q=${encodeURIComponent(
      input
    )}`;
    chrome.tabs.update(null, {
      url: searchLink,
      active: true,
    });
  }
});
