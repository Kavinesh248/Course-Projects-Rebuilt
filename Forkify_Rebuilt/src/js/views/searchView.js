class SearchView {
  _data;
  _parentEl = document.querySelector(".search");

  getQuery() {
    const query = this._parentEl.querySelector("input").value;
    this._clearInputField();
    return query;
  }

  _clearInputField() {
    this._parentEl.querySelector("input").value = "";
  }

  addHanlerRender(handler) {
    this._parentEl.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
