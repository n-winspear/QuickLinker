import {
  updateThemeStyles,
  setTheme,
} from '../../dependencies/themes/themeSwitcher.js';

// Event listeners for Home
const instructionsBtn = document.getElementById('home-button');
instructionsBtn.addEventListener('click', () => {
  chrome.tabs.update(null, {
    url: '/options/options.html',
    active: true,
  });
});

// Event listeners for Theme Switcher
const themeSwitcher = document.querySelector('.theme-switcher');
const themeSwitcherIcon = themeSwitcher.querySelector('#theme-switcher-button');
const themeList = themeSwitcher.querySelector('.theme-list');
const themeListItems = themeSwitcher.querySelectorAll('.theme-list li');

themeSwitcherIcon.addEventListener('click', () => {
  themeList.classList.toggle('theme-list-open');
});

themeListItems.forEach((item) => {
  // This is where theme swtiching happens
  item.addEventListener('click', async () => {
    const themeName = item.getAttribute('data-theme-name');
    await updateThemeStyles(themeName);
    await setTheme(themeName);
    themeList.classList.toggle('theme-list-open');
    themeListItems.forEach((item) => {
      item.classList.remove('active-theme');
    });
    item.classList.add('active-theme');
  });
});
