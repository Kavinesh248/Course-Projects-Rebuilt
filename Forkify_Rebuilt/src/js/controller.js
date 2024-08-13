import * as model from "./model.js";
import recipeView from "./views/recipeView";
import resultsView from "./views/resultsView.js";
import searchView from "./views/searchView.js";
import paginationView from "./views/paginationView.js";
import bookmarkView from "./views/bookmarkView.js";

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getPageLoadResults());
    bookmarkView.update(model.state.bookmarks);

    // 1) Load recipe and stored in recipe object
    await model.loadRecipe(id);

    //2) Render recipe in the UI
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    const query = searchView.getQuery();

    await model.loadSearchResults(query);

    resultsView.render(model.getPageLoadResults());

    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPageNavigation = function (page) {
  try {
    resultsView.render(model.getPageLoadResults(page));

    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlServings = async function (servings) {
  model.updateServings(servings);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.removeBookmarks(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarkView.render(model.state.bookmarks);
};

const init = async function () {
  recipeView.addHanlerRender(controlRecipes);
  recipeView.addHanlerServings(controlServings);
  recipeView.addHanlerAddBookmark(controlAddBookmarks);
  searchView.addHanlerRender(controlSearchResults);
  paginationView.addHandlerPagination(controlPageNavigation);
};

init();
