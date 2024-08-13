import icons from "url:../../img/icons.svg";
import View from "./View.js";

class BookmarkView extends View {
  _parentEl = document.querySelector(".bookmarks");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it ;)";

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return this._data
      .map((res) => {
        return `
     <li class="preview">
        <a class="preview__link ${
          id === res.id ? "preview__link--active" : ""
        }" href="#${res.id}">
          <figure class="preview__fig">
            <img src="${res.image}" alt="${res.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${res.title}</h4>
            <p class="preview__publisher">${res.publisher}</p>
            <div class="preview__user-generated">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
      })
      .join("");
  }
}

export default new BookmarkView();
