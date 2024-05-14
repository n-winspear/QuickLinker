chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
  await chrome.omnibox.setDefaultSuggestion({
    description: 'Enter a keyword to find a shortcut.',
  });
  const { linkSuggestions } = await chrome.storage.local.get('linkSuggestions');
  const suggestions = linkSuggestions.map((link) => {
    return { content: link, description: `Open ${link}` };
  });
  suggest(suggestions);
});
