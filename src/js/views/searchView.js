import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearList = () => {
    elements.searchResList.innerHTML = '';
    elements.searchBtn.innerHTML = '';
};

export const highlightSelected = (id) => {
    const resultArr = Array.from(
        document.querySelectorAll('.results__link')
    );

    resultArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`a[href='#${id}']`).classList.add('results__link--active');
};

//Pasta Tomato with some spicy


export const setWordLimit = (title, limit = 17) => {
    const words = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, current) => {
            if (acc + current.length <= limit) {
                words.push(current);
            }
            return acc + current.length;
        }, 0);

        return `${words.join(' ')} ...`;
    }
    return title;
};


const renderRecipe = recipe => {
    const markup = `
    <li>
      <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${setWordLimit(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
      </a>
    </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};


const createButton = (page, type) => {
 return `
         <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
             <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
             <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
         </button>
 `
};

const renderButton = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;

    if (page === 1 && pages > 1) {
        button = createButton(page, 'prev');
        //Only next page button
    }
    else if (page < pages) {
        //Both prev and next button
        button = `${createButton(page, 'prev')} ${createButton(page, 'next')}`;
    } else if (page === pages && pages > 1) {
        //Only prev button
        button = createButton(page, 'next');
    }

    elements.searchBtn.insertAdjacentHTML('afterbegin', button);
};

export const renderRecipes = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(element => {
        renderRecipe(element);
    });

    renderButton(page, recipes.length, resPerPage);
};


