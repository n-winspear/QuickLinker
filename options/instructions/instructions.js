// Event listeners for Home
const instructionsBtn = document.getElementById('home-button');
instructionsBtn.addEventListener('click', () => {
  chrome.tabs.update(null, {
    url: '/options/options.html',
    active: true,
  });
});
