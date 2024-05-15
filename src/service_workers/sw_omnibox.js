const NUMBER_OF_PREVIOUS_SEARCHES = 4;

// Suggest keywords based on input
chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
  await chrome.omnibox.setDefaultSuggestion({
    description: 'Enter a keyword to find a quick link.',
  });

  const { quickLinks } = await chrome.storage.local.get('quickLinks');

  if (quickLinks) {
    const suggestions = Object.keys(quickLinks)
      .filter((keyword) => keyword.includes(input))
      .map((keyword) => ({
        content: quickLinks[keyword].url,
        description: `Open ${quickLinks[keyword].url}`,
      }));

    suggest(suggestions);
  }
});

// Navigate to the URL on input enter
chrome.omnibox.onInputEntered.addListener((input) => {
  chrome.storage.local.get('quickLinks', ({ quickLinks }) => {
    const url = quickLinks[input]?.url;
    if (url) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.update(tabs[0].id, { url });
      });
    } else {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
        input
      )}`;
      chrome.tabs.update(tabs[0].id, { url: searchUrl });
    }
  });
});
