class CatalogSearch {
  constructor() {
    this.form = document.querySelector(".k1-catalog-search-form-js");

    if (this.form) {
      this.query = "";
      this.init();
    }

  }
  getFormAction() {
    this.query = this.form.querySelector("input[name=q]")?.value;
    const subcategories = [...this.form.querySelectorAll("input[type=checkbox][name=tag]")];
    let tags =
      subcategories
        .filter(input => input.checked)
        .map(input => input.value.trim())
        .join(";");
    return `/search/catalog/?q=${this.query}&tag=${tags}`;
  }
  submitHandler(event) {
    event.preventDefault();
    let action = this.getFormAction();
    this.form.action = action;
    console.log(action);
    window.location.href=action;
  }
  addHandlers() {
    this.form.addEventListener("submit", this.submitHandlerBind);
  }
  init() {
    this.submitHandlerBind = this.submitHandler.bind(this);
    this.addHandlers();
  }
}

class K1FormHandler {
  form = null;
  fileInput = null;
  fileInputs = null;
  constructor() {
    this.form = document.querySelector(".k1-form form[name=FEEDBACK_FORM]");
    if (this.form) {
      this.init();
    }
  }
  
  handlerFileInput({target}) {
    const {files} = target;
    if (files.length) {
      let str = "";
      const prevElement = target.previousElementSibling;
      for (let a of files) {
        str += `<span class="k1-form-file-fake">${a.name}</span><br />`;
      }
      prevElement.innerHTML = "";
      prevElement.insertAdjacentHTML("afterbegin", str);
    }
  }
  addHandlers() {
    if (this.fileInput) {
      this.fileInput.addEventListener("change", this.handlerFileInputBind);
    }
    if (this.fileInputs && this.fileInputs.length) {
      for (let input of this.fileInputs)
        input.addEventListener("change", this.handlerFileInputBind);
    }
  }
  init() {
    // this.fileInput = this.form.querySelector("input[type=file]");
    this.fileInputs = this.form.querySelectorAll("input[type=file]");
    this.handlerFileInputBind = this.handlerFileInput.bind(this);
    this.addHandlers();
  }
}


window.addEventListener("DOMContentLoaded", () => {
  // new CatalogSearch();
  // function filterHandler(lists, brandWrapper, event) {
  //   event.preventDefault()
  //   const target = event.target
  //   let value = target.closest("[data-namespace]")?.getAttribute("data-namespace")
  //   if (!value) value = target.closest("[data-letter]")?.getAttribute("data-letter")
  //   if (value) {
  //     let dataFilter = {
  //       type: target.closest("[data-namespace]") ? "data-target-namespace" : "data-target-letter",
  //       value
  //     }
  //     const isAll = target.closest("[data-namespace=all]")
  //     lists = brandWrapper.querySelectorAll(`[${dataFilter.type}]`)
  //     if (dataFilter.type === "data-target-namespace") {
  //       nameSpaces.forEach(nameSpace => {
  //         const nameSpaceValue = nameSpace.querySelector("[data-namespace]")?.getAttribute("data-namespace")
  //         if (nameSpaceValue) {
  //           if (nameSpaceValue === dataFilter.value) {
  //             nameSpace.classList.add("current-filter-namespace")
  //           } else {
  //             nameSpace.classList.remove("current-filter-namespace")
  //           }
  //         }
  //       })
  //     }
  //     lists.forEach(list => {
  //       if (isAll) {
  //         list.style.display = "";
  //       } else {
  //         const listAttribute = list.getAttribute(dataFilter.type)
  //         if (listAttribute === dataFilter.value) {
  //           list.style.display = "";
  //         } else {
  //           list.style.display = "none";
  //         }
  //       }
  //     })
  //   }
  // }
})
