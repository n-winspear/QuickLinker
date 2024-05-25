// Setting theme on page load
import { getCurrentTheme, updateThemeStyles } from './themeSwitcher.js';

const themeName = await getCurrentTheme();
await updateThemeStyles(themeName);
