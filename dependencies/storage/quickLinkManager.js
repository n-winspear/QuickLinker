// Get all QuickLinks from storage
export const getQuickLinks = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('quickLinks', (data) => {
      const quickLinks = data.quickLinks || {};
      resolve(quickLinks);
    });
  });
};

// Adding new QuickLink to storage
export const addQuickLink = (shortcut, link, name) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('quickLinks', (data) => {
      const quickLinks = data.quickLinks || {};
      if (quickLinks[shortcut]) {
        console.error(`Quick link for '${shortcut}' already exists.`);
        resolve(false);
        return;
      }
      quickLinks[shortcut] = { link, name };
      chrome.storage.local.set({ quickLinks }, () => {
        console.log(`Quick link for '${shortcut}' added.`);
        chrome.runtime.sendMessage({ action: 'quickLinkAdded' });
        resolve(true);
      });
    });
  });
};

// Editing QuickLink in storage
export const editQuickLink = (shortcut, newLink, newName) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('quickLinks', (data) => {
      const quickLinks = data.quickLinks || {};
      if (!quickLinks[shortcut]) {
        console.error(`Quick link for '${shortcut}' not found.`);
        resolve(false);
        return;
      }
      quickLinks[shortcut].link = newLink;
      quickLinks[shortcut].name = newName;

      chrome.storage.local.set({ quickLinks }, () => {
        console.log(`Quick link for '${shortcut}' updated.`);
        resolve(true);
      });
    });
  });
};

// Deleting QuickLink from storage
export const deleteQuickLink = (shortcut) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('quickLinks', (data) => {
      const quickLinks = data.quickLinks || {};
      if (!quickLinks[shortcut]) {
        console.error(`Quick link for '${shortcut}' not found.`);
        resolve(false);
        return;
      }
      delete quickLinks[shortcut];
      chrome.storage.local.set({ quickLinks }, () => {
        console.log(`Quick link for '${shortcut}' deleted.`);
        resolve(true);
      });
    });
  });
};
