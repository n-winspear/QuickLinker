export const getCurrentTheme = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('theme', (data) => {
      const theme = data.theme || {};
      const themeName = theme.activeTheme;
      resolve(themeName);
    });
  });
};

export const setTheme = (themeName) => {
  return new Promise((resolve, reject) => {
    // Updating Local Storage
    chrome.storage.local.get('theme', (data) => {
      const theme = data.theme || {};

      theme.activeTheme = themeName;

      chrome.storage.local.set({ theme }, () => {
        console.log(`Theme set to '${themeName}'.`);
        resolve(true);
      });
    });
  });
};

export const updateThemeStyles = (
  themeName = 'vermilion',
  darkMode = false
) => {
  return new Promise((resolve, reject) => {
    try {
      console.log(
        `Switching theme to ${themeName} in ${
          darkMode ? 'dark' : 'light'
        } mode.`
      );
      const root = document.querySelector(':root');
      const navLogo = document.getElementById('nav-logo');
      const themeLogoSrc = `../images/logos/ql-${themeName}/ql-${themeName}_transparent_notext.png`;
      navLogo.src = themeLogoSrc;
      // Theme Property Names
      [
        'primary',
        'secondary',
        'tertiary',
        'dark',
        'medium',
        'light',
        'boxshadow',
        'page',
      ].forEach((themeVariable) => {
        root.style.setProperty(
          `--theme-active-${themeVariable}`,
          `var(--theme-${themeName}-${
            darkMode ? 'dark' : 'light'
          }-${themeVariable})`
        );
      });

      resolve(true);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};
