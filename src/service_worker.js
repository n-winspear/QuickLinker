import './service_workers/sw_omnibox.js';
import './service_workers/sw_storage.js';

// Listener for Popup events
chrome.runtime.onMessage.addListener(async (message, sender) => {
  const { action, id, keyword, url } = message;

  try {
    let storageResponse;
    switch (action) {
      // Adding New Alias
      case 'saveAlias':
        storageResponse = await saveAlias(id, keyword, url);

        if (storageResponse.status !== 'success')
          throw new Error('Error storing alias');

        chrome.runtime.sendMessage({
          action: 'saveAlias',
          status: 'success',
          id: id,
        });

        break;

      // Removing Alias
      case 'removeAlias':
        storageResponse = await removeAlias(id);

        if (storageResponse.status !== 'success')
          throw new Error('Error removing alias');

        chrome.runtime.sendMessage({
          action: 'removeAlias',
          status: 'success',
          id: id,
        });

        break;

      // Unknown Action
      default:
        throw new Error('Unknown action');
    }
  } catch (error) {
    chrome.runtime.sendMessage({
      action: 'response',
      status: 'error',
      error: error.message,
    });
  }
});
