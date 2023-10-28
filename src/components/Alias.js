class Alias {
    constructor(keyword, url) {
        this.keyword = keyword;
        this.url = url;
        this.id = generateId();
    }

    getOptionsPageHTML = () => {
        return `
        <li class="aliasItem">
            <span class="aliasKeyword" data-keywordId="1">${this.keyword}</span>
            <span class="aliasArrow">&#8594;</span>
            <a class="aliasUrl" href="${this.url}" target="_blank"
                >${this.url}
            </a>
            <div class="button removeBtn" role="button" data-keyword="${this.keyword}">
                <i class="material-icons" style="font-size: 20px"
                    >delete</i
                >
            </div>
        </li>`;
    };
}
