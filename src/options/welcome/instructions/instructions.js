document.addEventListener('DOMContentLoaded', () => {
  const extensionId = chrome.runtime.id;
  document.getElementById('extensionId').textContent = extensionId;

  document.getElementById('copyButton').addEventListener('click', () => {
    const searchUrl = document.getElementById('searchUrl').textContent;
    navigator.clipboard
      .writeText(searchUrl)
      .then(() => {
        alert('Search URL copied to clipboard!');
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  });
});
