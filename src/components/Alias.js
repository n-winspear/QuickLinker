const Alias = (id, keyword, url) => {
    return `
        <li class="aliasItem" data-id="${id}">
            <span class="aliasKeyword" data-keywordId="1">${keyword}</span>
            <span class="aliasArrow">&#8594;</span>
            <a class="aliasUrl" href="${url}" target="_blank"
                >${url}
            </a>
            <div class="button removeBtn" role="button">
                <i class="material-icons" style="font-size: 20px"
                    >delete</i
                >
            </div>
        </li>`;
};

export default Alias;
