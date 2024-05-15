chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.storage.local.set(
      {
        quickLinks: {
          g: {
            url: 'https://google.com',
          },
          fb: {
            url: 'https://facebook.com',
          },
          yt: {
            url: 'https://youtube.com',
          },
        },
      },
      () => console.log('Default quickLinks object has been set.')
    );
  }
});
