import "regenerator-runtime";
import { getJSON } from "./helpers.js";
import { API_URL, RES_PER_PAGE } from "./config.js";

export const state = {
  recipe: {},
  search: {
    results: [],
    page: 1,
    resPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const res = await getJSON(`${API_URL}${id}`);

    const { recipe } = res.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      image: recipe.image_url,
      sourceUrl: recipe.source_url,
      cookingTime: recipe.cooking_time,
    };

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} 🐦‍🔥🐦‍🔥🐦‍🔥`);
    throw err;
  }
};

export const loadSearchResults = async function (recipe) {
  try {
    const res = await getJSON(`${API_URL}?search=${recipe}`);

    const data = res.data.recipes;
    state.search.results = data.map((res) => {
      return {
        id: res.id,
        title: res.title,
        publisher: res.publisher,
        image: res.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getPageLoadResults = function (page = state.search.page) {
  try {
    state.search.page = page;

    const start = (page - 1) * state.search.resPerPage;
    const end = page * state.search.resPerPage;

    return state.search.results.slice(start, end);
  } catch (err) {
    throw err;
  }
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = ing.quantity
      ? (ing.quantity * newServings) / state.recipe.servings
      : ing.quantity;
  });
  state.recipe.servings = newServings;
};

export const addBookmarks = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
};

export const removeBookmarks = function (id) {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
};
