chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    // Set default QuickLinks
    chrome.storage.local.set(
      {
        quickLinks: {
          gg: { url: 'https://google.com' },
          yt: { url: 'https://youtube.com' },
          gh: { url: 'https://github.com' },
        },
      },
      () => console.log('Default quickLinks object has been set.')
    );
  }
});
