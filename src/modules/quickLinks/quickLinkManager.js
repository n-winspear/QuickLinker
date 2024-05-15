// Adding new QuickLink to storage
export const addQuickLink = (keyword, url) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('quickLinks', (data) => {
      const quickLinks = data.quickLinks || {};
      if (quickLinks[keyword]) {
        console.error(`Quick link for '${keyword}' already exists.`);
        resolve(false);
        return;
      }
      quickLinks[keyword] = { url };
      chrome.storage.local.set({ quickLinks }, () => {
        console.log(`Quick link for '${keyword}' added.`);
        resolve(true);
      });
    });
  });
};

// Editing QuickLink in storage
export const editQuickLink = (keyword, newUrl) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('quickLinks', (data) => {
      const quickLinks = data.quickLinks || {};
      if (!quickLinks[keyword]) {
        console.error(`Quick link for '${keyword}' not found.`);
        resolve(false);
        return;
      }
      quickLinks[keyword].url = newUrl;
      chrome.storage.local.set({ quickLinks }, () => {
        console.log(`Quick link for '${keyword}' updated.`);
        resolve(true);
      });
    });
  });
};

// Deleting QuickLink from storage
export const deleteQuickLink = (keyword) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('quickLinks', (data) => {
      const quickLinks = data.quickLinks || {};
      if (!quickLinks[keyword]) {
        console.error(`Quick link for '${keyword}' not found.`);
        resolve(false);
        return;
      }
      delete quickLinks[keyword];
      chrome.storage.local.set({ quickLinks }, () => {
        console.log(`Quick link for '${keyword}' deleted.`);
        resolve(true);
      });
    });
  });
};
