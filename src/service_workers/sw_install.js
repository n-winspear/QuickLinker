// chrome.runtime.onInstalled.addListener(({ reason }) => {
//   if (reason === 'install') {
//     // Set default QuickLinks
//     chrome.storage.local.set(
//       {
//         quickLinks: {
//           gg: { url: 'https://google.com' },
//           yt: { url: 'https://youtube.com' },
//           gh: { url: 'https://github.com' },
//         },
//       },
//       () => console.log('Default quickLinks object has been set.')
//     );
//   }
// });

import { addQuickLink } from '../dependencies/storage/quickLinkManager.js';

// Listener for setting default quick links
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    // Open welcome page
    // chrome.tabs.create({
    //   url: `chrome-extension://${chrome.runtime.id}/src/options/welcome/welcome.html`,
    // });

    const DEFAULT_LINKS = [
      { keyword: 'gg', url: 'https://google.com' },
      { keyword: 'yt', url: 'https://youtube.com' },
      { keyword: 'gh', url: 'https://github.com' },
    ];

    DEFAULT_LINKS.forEach(async ({ keyword, url }) => {
      await addQuickLink(keyword, url);
    });
  }
});
