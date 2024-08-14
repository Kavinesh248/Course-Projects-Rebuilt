import "regenerator-runtime";
import { AJAX } from "./helpers.js";
import { API_URL, KEY, RES_PER_PAGE } from "./config.js";

export const state = {
  recipe: {},
  search: {
    results: [],
    page: 1,
    resPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    image: recipe.image_url,
    sourceUrl: recipe.source_url,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const res = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(res);

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
    const res = await AJAX(`${API_URL}?search=${recipe}&key=${KEY}`);

    const data = res.data.recipes;
    state.search.results = data.map((res) => {
      return {
        id: res.id,
        title: res.title,
        publisher: res.publisher,
        image: res.image_url,
        ...(res.key && { key: res.key }),
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

const setDataLocalStorage = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmarks = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  setDataLocalStorage();
};

export const removeBookmarks = function (id) {
  const index = state.bookmarks.findIndex((el) => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  setDataLocalStorage();
};

const getDataLocalStorage = function () {
  const storage = window.localStorage.getItem("bookmarks");
  if (storage) state.bookmarks = JSON.parse(storage);
};

getDataLocalStorage();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter((el) => el[0].startsWith("ingredient") && el[1] !== "")
      .map((ing) => {
        const [quantity, unit, description] = ing[1]
          // .replaceAll(" ", "")
          .split(",")
          .map((el) => el.trim());
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      servings: newRecipe.servings,
      ingredients,
      image_url: newRecipe.image,
      source_url: newRecipe.sourceUrl,
      cooking_time: newRecipe.cookingTime,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmarks(state.recipe);
  } catch (err) {
    console.error(err);
  }
};
