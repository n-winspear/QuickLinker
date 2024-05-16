export const QuickLink = (keyword, url) => `
  <li class="quickLinkItem" data-keyword="${keyword}">
    <span class="quickLinkKeyword">${keyword}</span>
    <span class="quickLinkArrow">→</span>
    <span class="quickLinkUrl">${url}</span>
    <button class="button removeBtn" title="Remove">
      <i class="material-icons">remove</i>
    </button>
  </li>
`;
