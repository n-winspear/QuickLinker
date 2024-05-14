import Alias from '../components/Alias.js';

const addEventListeners = () => {
  try {
    Array.from(document.getElementsByClassName('aliasItem')).forEach((item) => {
      let id = item.getAttribute('data-id');
      let removeBtn = item.querySelector(':scope > .removeBtn');

      removeBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({
          action: 'removeAlias',
          id: id,
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
};

const displayAliases = async () => {
  try {
    const result = await chrome.storage.sync.get('aliases');
    const aliases = result.aliases || {};
    const aliasesKeys = Object.keys(result.aliases);
    const list = document.getElementById('aliasItems');

    const html = aliasesKeys
      .map((key) => Alias(key, aliases[key].keyword, aliases[key].url))
      .join('');

    list.innerHTML = html;
    addEventListeners();
  } catch (error) {
    console.error(error);
  }
};

const removeAlias = async (id) => {
  const listElements = Array.from(document.getElementsByClassName('aliasItem'));
  listElements
    .filter((element) => element.getAttribute('data-id') === id)[0]
    .remove();
};

// Response listener from background.js
chrome.runtime.onMessage.addListener((message) => {
  try {
    const { action, status, error, id } = message;

    switch (action) {
      case 'removeAlias':
        if (!status === 'success') throw new Error(error);
        removeAlias(id);
        break;

      default:
        throw new Error(
          'Options page response listener action not defined',
          action
        );
    }
  } catch (error) {
    console.error(error);
  }
});

displayAliases();
