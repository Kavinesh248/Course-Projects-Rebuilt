import * as model from "./model.js";
import recipeView from "./views/recipeView";
import resultsView from "./views/resultsView.js";
import searchView from "./views/searchView.js";
import paginationView from "./views/paginationView.js";

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1) Load recipe and stored in recipe object
    await model.loadRecipe(id);

    //2) Render recipe in the UI
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
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

const init = async function () {
  recipeView.addHanlerRender(controlRecipes);
  searchView.addHanlerRender(controlSearchResults);
  paginationView.addHandlerPagination();
};

init();
