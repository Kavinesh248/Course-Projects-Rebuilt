import icons from "url:../../img/icons.svg";
import View from "./View.js";
import previewView from "./previewView.js";

class ResultsView extends View {
  _parentEl = document.querySelector(".results");
  _errorMessage = "We can't find recipe! Try again with another recipe :D";

  _generateMarkup() {
    return this._data.map((res) => previewView.render(res, false)).join("");
  }
}

export default new ResultsView();
