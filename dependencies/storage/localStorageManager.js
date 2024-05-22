import { getQuickLinks } from './quickLinkManager.js';

export const exportQuickLinks = async () => {
  console.log('Exporting quickLinks...');
  const quickLinks = await getQuickLinks();
  const jsonString = JSON.stringify(quickLinks, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quickLinks.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const importQuickLinks = async () => {
  console.log('Importing quickLinks...');
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.onchange = function (event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedData = JSON.parse(e.target.result);
        chrome.storage.local.set({ quickLinks: importedData }, () => {
          alert('QuickLinks imported successfully!');
          chrome.runtime.sendMessage({ action: 'quickLinkAdded' });
        });
      } catch (error) {
        alert('Failed to import QuickLinks: Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
};
