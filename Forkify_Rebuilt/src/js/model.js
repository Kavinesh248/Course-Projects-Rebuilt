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
};

export const loadRecipe = async function (id) {
  try {
    const res = await getJSON(`${API_URL}${id}`);

    let { recipe } = res.data;
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      image: recipe.image_url,
      sourceUrl: recipe.source_url,
      cookingTime: recipe.cooking_time,
    };
    state.recipe = recipe;
  } catch (err) {
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
