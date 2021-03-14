export const elements = {
    searchInput: document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    searchLoader: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchBtn: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likes: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};
export const elementStrings = {
    loader: 'loader'
}

export const loader = parent => {
    const loader = `
        <div class='${elementStrings.loader}'>
            <svg>
                <use href='img/icons.svg#icon-cw'></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentNode.removeChild(loader);
};