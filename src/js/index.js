//!Global Controller App
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from './models/List';
import Likes from "./models/Likes";

import * as searchView from "./views/searchView";
import * as listView from "./views/listView";
import * as recipeView from "./views/recipeView";
import * as likesView from './views/likesView';

import { elements, loader, clearLoader } from "./views/base";
//import { toFixed } from "core-js/fn/number/epsilon";

/*For Storing all data
 * 1. Search object
 * 2. Current recipe object
 * 3. Shopping List
 * 4. Liked Recipe
 */
const state = {};

//TODO Search part of the application

const controlSearch = async () => {
  //1. Get input data from view
  const query = searchView.getInput();

  if (query) {
    // 2. New search object and add to state
    state.search = new Search(query);

    //3. Prepare UI the result
    searchView.clearInput();
    searchView.clearList();
    loader(elements.searchLoader);

    try {
      //4. Search for recipes
      await state.search.getRecipe(query);

      //5. Render result the on UI
      clearLoader();
      searchView.renderRecipes(state.search.result);
    } catch (error) {
      clearLoader();
      alert(error);
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchBtn.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline"); // closest = ichidagi bosilsa ham btn bosildi deb hsbolaydi
  if (btn) {
    const gotoPage = parseInt(btn.dataset.goto);
    searchView.renderRecipes(state.search.result, gotoPage);
  }
});

//TODO Recipe part of the application

const controlRecipe = async () => {
  //Get ID from URL
  const id = window.location.hash.replace("#", "");

  if (id) {
    //Prepare UI for changes
    recipeView.clearRecipe();
    loader(elements.recipe);

    if (state.search) searchView.highlightSelected(id);

    //Create new Recipe object
    state.recipe = new Recipe(id);

    try {
      //Get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      //Calculate servings and time
      state.recipe.calcServings();
      state.recipe.calcTime();

      //Render Recipe to UI
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      alert("Something wrong in getting recipe");
    }
  }
};

window.addEventListener("hashchange", controlRecipe);
window.addEventListener("load", controlRecipe);


window.addEventListener('load', () => {
    state.likes = new Likes();

    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    
    
    //Render existent likes

    state.likes.likes.forEach(like => {
      likesView.renderLike(like);
    });
});


//TODO Control list

const controlList = () => {
  if (!state.list) state.list = new List();

  //Add element to the list
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};


//Handle each ingredients
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item', '.shopping__item *').dataset.itemid;

  //Handle delete button
  if (e.target.matches('.shopping__delete', '.shopping__delete *')) {
    //Delete from list(data)
    state.list.deleteItem(id);

    //Delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value);
    state.list.updateItem(id, val);
  }
});

//Control likes
const controlLike = () => {
  if (!state.likes)  state.likes = new Likes();
   const currentID = state.recipe.id;

   if (!state.likes.isLiked(id)) { // Not yet likes, now it add the likes list
    //add likes to the state

    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //toggle the like button
      likesView.toggleLikeButton(true);
    //add like to the UI
      likesView.renderLike(newLike);



   } else if (state.likes.isLiked(id)) { //  Already liked, now remove the like

    //Remove likes from UI
    state.likes.deleteLike(currentID);

    //toggle the like button
    likesView.toggleLikeButton(false);
    //Remove like from the UI
    likesView.deleteLike(id);

   }

};

//Update Servings
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease", ".btn-decrease *")) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase", ".btn-increase *")) {
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add', 'recipe__btn--add *')) {
    controlList();
  } else if (e.target.matches('.recipe__love', '.recipe__love *')) {
    controlLike();
  }
});



//TODO List 
