import { getQuickLinks } from '../modules/quickLinks/quickLinkManager.js';

const params = new URLSearchParams(window.location.search);
const query = params.get('q');

if (query) {
  getQuickLinks().then((quickLinks) => {
    const keyword = query.trim();
    if (quickLinks[keyword]) {
      const url = quickLinks[keyword].url;
      window.location.replace(url);
    } else {
      alert(`No quick link found for keyword: ${keyword}`);
    }
  });
}
