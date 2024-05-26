export const exportQuickLinks = async () => {
  console.log('Exporting quickLinks...');
  const quickLinks = await new Promise((resolve, reject) => {
    chrome.storage.local.get('quickLinks', (data) => {
      const quickLinks = data.quickLinks || {};
      resolve(quickLinks);
    });
  });
  const jsonString = JSON.stringify(quickLinks, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quickLinks.json';

  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  console.log('Export complete.');
  return Promise.resolve();
};

export const importQuickLinks = async () => {
  console.log('Importing quickLinks...');
  try {
    const file = await selectQuickLinksFile();
    await processQuickLinksFile(file);
  } catch (error) {
    console.error('Error importing quickLinks:', error);
  }
};

export const selectQuickLinksFile = () => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = function (event) {
      const file = event.target.files[0];
      if (!file) {
        reject('No file selected');
        return;
      }
      resolve(file);
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
};

export const processQuickLinksFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedData = JSON.parse(e.target.result);
        chrome.storage.local.set({ quickLinks: importedData }, () => {
          alert('QuickLinks imported successfully!');
          resolve();
        });
      } catch (error) {
        alert('Failed to import QuickLinks: Invalid JSON file.');
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};
