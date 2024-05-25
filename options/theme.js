// Setting theme on page load
import {
  getCurrentTheme,
  updateThemeStyles,
} from '../dependencies/themes/themeSwitcher.js';

const themeName = await getCurrentTheme();
await updateThemeStyles(themeName);
