import { elements } from './base';
import { setWordLimit } from './searchView';

export const toggleLikeButton = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icon.svg#${iconString}`);
};

export const toggleLikeMenu = numLikes => {
    elements.likes.style.visibility = numLikes > 0 ? 'visible' : 'invisible';
};


export const renderLike = like => {
    const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.imd}" alt="Test">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${setWordLimit(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>`;
    elements.likesList.insertAdjacentHTML('afterbegin', markup);
};


export const deleteLike = (id) => {
    const el = document.querySelector(`.likes__link[href='${id}']`).parentNode;
    el.parentElement.removeChild();
};