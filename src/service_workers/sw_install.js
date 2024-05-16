chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    // Notify the user
    // chrome.notifications.create({
    //   type: 'basic',
    //   iconUrl: 'src/icons/icon128.png',
    //   title: 'Quick Linker Installed',
    //   message: 'To set up site search, please follow the instructions.',
    //   buttons: [{ title: 'Show Instructions' }],
    //   priority: 1,
    // });

    // chrome.notifications.onButtonClicked.addListener(
    //   (notificationId, buttonIndex) => {
    //     if (buttonIndex === 0) {
    //       chrome.tabs.create({
    //         url:
    //           'chrome-extension://' +
    //           chrome.runtime.id +
    //           '/src/options/options.html?showInstructions=true',
    //       });
    //     }
    //   }
    // );

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
