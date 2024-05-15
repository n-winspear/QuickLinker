const Alias = (keyword, url) => `
  <li class="aliasItem" data-keyword="${keyword}">
    <span class="aliasKeyword">${keyword}</span>
    <span class="aliasArrow">→</span>
    <span class="aliasUrl">${url}</span>
    <button class="button removeBtn" title="Remove">
      <i class="material-icons">remove</i>
    </button>
  </li>
`;

export default Alias;
