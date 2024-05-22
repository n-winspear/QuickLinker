chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'searchQuery') {
    const query = request.query;
    // Load search.html dynamically in the current tab
    chrome.tabs.executeScript(
      null,
      { file: 'search/search.html', runAt: 'document_idle' },
      () => {
        // Send the search query to search.html script
        chrome.tabs.sendMessage(sender.tab.id, {
          action: 'setQuery',
          query: query,
        });
      }
    );
  }
});
