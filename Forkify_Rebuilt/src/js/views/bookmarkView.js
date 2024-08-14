import View from "./View.js";
import previewView from "./previewView.js";

class BookmarkView extends View {
  _parentEl = document.querySelector(".bookmarks");
  _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it ;)";

  addHandlerBookmarks(handler) {
    window.addEventListener("load", function () {
      handler();
    });
  }

  _generateMarkup() {
    return this._data.map((res) => previewView.render(res, false)).join("");
  }
}

export default new BookmarkView();
