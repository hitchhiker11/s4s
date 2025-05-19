class K1Form {
  form = null;
  sendURL = null;
  successMessage = "Спасибо, ваща заявка отправлена";
  
  constructor() {
    this.form = document.querySelector(".k1-form form");
    this.sendURL = "/ajax/k1Form.php";
    this.sendFormBind = this.sendForm.bind(this);
    if (this.form) {
      new PhoneMask({});
      this.addHandlers();
    }
  }
  
  sendForm(event) {
    event.preventDefault();
    this.form.pageURL.value = location.origin + location.pathname;
    fetch(this.sendURL, {
      method: "POST",
      body: new FormData(this.form)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          for (let code of data.codes) {
            switch (code) {
              case 101:
                this.form.email.classList.add("k1-error");
                this.form.email.addEventListener("input", function (event) {
                  event.target.classList.remove("k1-error");
                }, {once: true});
                break;
              case 102:
                this.form.phone.classList.add("k1-error");
                this.form.phone.addEventListener("input", function (event) {
                  event.target.classList.remove("k1-error");
                }, {once: true});
                break;
              case 103:
                this.form.name.classList.add("k1-error");
                this.form.name.addEventListener("input", function (event) {
                  event.target.classList.remove("k1-error");
                }, {once: true});
                break;
            }
          }
          
        } else {
          this.form.after(this.successMessage);
          this.form.closest(".k1-form").classList.add("k1-success-send-form");
          this.form.remove();
        }
      })
  }
  
  addHandlers() {
    this.form.addEventListener("submit", this.sendFormBind);
  }
  
}


function toggleActiveIncrementButton(node, enable = true) {
  const button = node.querySelector(".k-element-count .k-count-plus")
  if (enable) button.classList.remove("disabled")
  else button.classList.add("disabled")
}

function incrementQuantity({target}) {
  const wrapper = target.closest("[data-k-id]")
  const id = wrapper?.getAttribute("data-k-id")
  if (!id) return
  const max = wrapper?.getAttribute("data-k-max")
  const input = wrapper.querySelector("input.k-count-val")
  let newValue = +input.value + 1
  if (newValue > max) newValue = max
  toggleActiveIncrementButton(wrapper, newValue < max)
  input.value = newValue
  input.dispatchEvent(new Event("input"))
}

function decrementQuantity({target}) {
  const wrapper = target.closest("[data-k-id]")
  const id = wrapper?.getAttribute("data-k-id")
  if (!id) return
  const input = wrapper.querySelector("input.k-count-val")
  const max = wrapper?.getAttribute("data-k-max")
  let newValue = +input.value - 1
  if (newValue < 0) {
    
    newValue = 0
  }
  toggleActiveIncrementButton(wrapper, newValue < max)
  input.value = newValue
  input.dispatchEvent(new Event("input"))
}

function toggleSections(event) {
  event.preventDefault()
  if (window.innerWidth > 600) return false
  const {target} = event
  const wrapper = target.closest("div")
  const button = target.closest("button")
  const listWrapper = wrapper.querySelector(".r-catalog-top__list-wrapper")
  const list = listWrapper.querySelector(".r-catalog-top__list")
  const listHeight = Math.max(list.scrollHeight, list.clientHeight)
  listWrapper.classList.toggle("opened")
  const flag = listWrapper.classList.contains("opened")
  if (flag) {
    listWrapper.style.maxHeight = `${listHeight}px`
    button.textContent = "Скрыть категории"
  } else {
    listWrapper.style.maxHeight = `0px`
    button.textContent = "Показать категории"
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const categoriesButtons = document.querySelectorAll(".k1-search-panel__categories-text")
  const toggleSectionsButton = document.querySelector("[data-k-js=toggle-sections]")
  // const checkBoxesWrapper = document.querySelector(".k1-search-checkboxes")
  const showText = "Категории 🡩"
  const hideText = "Категории 🡫"
  
  function showCheckBoxes(target) {
    const wrap = target.closest(".k1-search-panel__categories")
    const checkBoxesWrapper = wrap.querySelector(".k1-search-checkboxes")
    checkBoxesWrapper.style.display = "flex"
    target.textContent = showText
    setTimeout(function () {
      window.addEventListener("click", windowClickHandler)
    }, 1)
    //
  }
  
  function hideCheckboxes(target) {
    const wrap = target.closest(".k1-search-panel__categories")
    if (wrap) {
      const checkBoxesWrapper = wrap.querySelector(".k1-search-checkboxes")
      checkBoxesWrapper.style.display = "none"
      target.textContent = hideText
      target.classList.remove("k1-show")
      window.removeEventListener("click", windowClickHandler)
    } else {
      categoriesButtons.forEach(categoriesButton => {
        const wrap = categoriesButton.closest(".k1-search-panel__categories")
        const checkBoxesWrapper = wrap.querySelector(".k1-search-checkboxes")
        checkBoxesWrapper.style.display = "none"
        categoriesButton.textContent = hideText
        categoriesButton.classList.remove("k1-show")
        window.removeEventListener("click", windowClickHandler)
      })
    }
  }
  
  function windowClickHandler({target}) {
    if (!target.closest(".k1-search-checkboxes")) {
      hideCheckboxes(target)
    }
  }
  
  function categoriesButtonClickHandler({target}) {
    target.classList.toggle("k1-show")
    if (target.classList.contains("k1-show"))
      showCheckBoxes(target)
    else
      hideCheckboxes(target)
  }
  
  if (categoriesButtons.length) {
    categoriesButtons.forEach(categoriesButton => {
      categoriesButton.removeEventListener("click", categoriesButtonClickHandler)
      categoriesButton.addEventListener("click", categoriesButtonClickHandler)
    })
    
  }
  
  function initHeaderSlider() {
    const headerSliderNode = document.querySelector(".r-header__slider")
    if (headerSliderNode) {
      new Swiper(headerSliderNode, {
        slidesPerView: 1,
        loop: true,
        pagination: {
          el: '.r-header__slider-pagination',
          clickable: true
        },
      })
    }
  }
  
  initHeaderSlider()
  
  
  const incrementButtons = document.querySelectorAll(".k-element-count .k-count-plus")
  const decrementButtons = document.querySelectorAll(".k-element-count .k-count-minus")
  incrementButtons.forEach(button => {
    button.addEventListener("click", incrementQuantity)
  })
  
  decrementButtons.forEach(button => {
    button.addEventListener("click", decrementQuantity)
  })
  BX.addCustomEvent('kChangeBasketQuantity', function ({data}) {
    if (!data.items) return
    const items = JSON.parse(data.items)
    if (items) {
      items.forEach(item => {
        const id = item.ID
        const elementCount = document.querySelector(`.k-element-count[data-k-id="${id}"]`)
        if (elementCount) {
          elementCount.querySelector("input.k-count-val").value = item.QUANTITY.TOTAL
          const max = +elementCount.getAttribute("data-k-max")
          toggleActiveIncrementButton(elementCount, +item.QUANTITY.TOTAL < max)
        }
      })
    }
  })
  BX.addCustomEvent("kDeleteBasket", params => {
    let items = params.data.items
    if (items) {
      items = JSON.parse(items)
      items.forEach(item => {
        const elementCount = document.querySelector(`.k-element-count[data-k-id="${item.ID}"]`)
        if (elementCount) {
          BX.onCustomEvent("kDeleteBasketItem", {item: item.ID})
          
          // elementCount.querySelector("input.k-count-val").value = item.QUANTITY.TOTAL
        }
      })
    }
  })
  
  if (toggleSectionsButton) {
    toggleSectionsButton.addEventListener("click", toggleSections)
    window.addEventListener("resize", function() {
      const listWrapper = document.querySelector(".r-catalog-top__list-wrapper")
      if (listWrapper) {
        listWrapper.style.maxHeight = ""
      }
    })
  }
})

// window.addEventListener("load", () => {
// new K1Form();
// })




