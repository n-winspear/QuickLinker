chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    // Set default QuickLinks
    chrome.storage.local.set(
      {
        quickLinks: {
          gg: { link: 'https://google.com', name: 'Youtube' },
          yt: { link: 'https://youtube.com', name: 'Youtube' },
          gh: { link: 'https://github.com', name: 'Github' },
        },
        theme: {
          activeTheme: 'vermilion',
        },
      },
      () => console.log('Default quickLinks object has been set.')
    );
  }
});
