class FixHeader {
  header = null
  headerTop = null
  headerSlider = null
  body = null
  headerTopValue = null
  
  sliderMaxHeight = 560
  sliderMinHeight = null
  headerTopHeight = null
  diff = null
  fired = false
  
  constructor() {
    this.headerTop = document.querySelector(".r-header-top")
    this.headerSlider = document.querySelector(".r-header__slider")
    
    if (this.headerTop && this.headerSlider) this.init()
  }
  
  scrollHandler() {
    const bodyRect = this.body.getBoundingClientRect()
    const headerTopRect = this.headerTop.getBoundingClientRect()
    const headerSliderRect = this.headerSlider.getBoundingClientRect()
    const headerTopHeight = headerTopRect.height
    const headerRect = this.header.getBoundingClientRect()
    const isFixed = this.header.classList.contains("r-header--fix")
    const _this = this
    if (headerRect.bottom < -40) {
      this.headerFixed.classList.add("active")
    } else {
      this.headerFixed.classList.remove("active")
    }
    // if (!isFixed && window.scrollY > 0 && !this.fired) {
    //   this.header.classList.add("r-header--fix")
    //   this.body.classList.add("r-header--fix")
    //   this.fired = true
    // } else {
    //   if (bodyRect.y === 0) {
    //     this.header.classList.remove("r-header--fix")
    //     this.body.classList.remove("r-header--fix")
    //     this.fired = false
    //   }
    // }
  }
  
  addHandlers() {
    window.addEventListener("scroll", this.scrollHandlerBind)
    window.addEventListener("resize", this.setScrollValuesBind)
  }
  
  setScrollValues() {
    this.sliderMaxHeight = +getComputedStyle(document.querySelector("[data-r=redesign]"))
      .getPropertyValue("--child-list-top-padding")
      .replace(/\D/g, "");
  }
  
  init() {
    this.body = document.querySelector("body")
    this.header = document.querySelector(".r-header:not(.r-header--fix)")
    this.headerFixed = document.querySelector(".r-header.r-header--fix")
    this.sliderMinHeight = Math.max(this.headerTop.clientHeight, this.headerTop.scrollHeight)
    this.headerTopValue = +getComputedStyle(document.querySelector("[data-r=redesign]"))
      .getPropertyValue("--child-list-top-padding")
      .replace(/\D/g, "");
    
    this.sliderMinHeight = this.headerTop.getBoundingClientRect().height
    this.diff = Math.abs(this.body.getBoundingClientRect().y - this.header.getBoundingClientRect().y)
    this.setScrollValues()
    this.scrollHandlerBind = this.scrollHandler.bind(this)
    this.setScrollValuesBind = this.setScrollValues.bind(this)
    this.addHandlers()
    this.scrollHandler()
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".r-parent")
  const parentItems = document.querySelectorAll(".r-parent > li")
  const menuRect = menu.getBoundingClientRect()
  let filterLinks = null
  let nameSpaces = null
  let filterFunctionBind = null
  const burgers = document.querySelectorAll(".r-header-burger")
  document.querySelector(".r-header-mobile").classList.add("r-header-mobile-first")
  const newVar = [...document.querySelectorAll(".r-parent .separator")]
  newVar.at(-1).classList.add("separator-last")
  
  let isMobile = window.innerWidth <= 1000
  
  function burgerHandler({target}) {
    const wrapper = target.closest(".r-header__footer")
    wrapper.classList.toggle("r-show-mobile-menu")
  }
  
  function setIsMobile() {
    isMobile = window.innerWidth <= 1000
  }
  
  function filterHandler(lists, brandWrapper, event) {
    event.preventDefault()
    const target = event.target
    let value = target.closest("[data-namespace]")?.getAttribute("data-namespace")
    if (!value) value = target.closest("[data-letter]")?.getAttribute("data-letter")
    if (value) {
      let dataFilter = {
        type: target.closest("[data-namespace]") ? "data-target-namespace" : "data-target-letter",
        value
      }
      const isAll = target.closest("[data-namespace=all]")
      lists = brandWrapper.querySelectorAll(`[${dataFilter.type}]`)
      if (dataFilter.type === "data-target-namespace") {
        nameSpaces.forEach(nameSpace => {
          const nameSpaceValue = nameSpace.querySelector("[data-namespace]")?.getAttribute("data-namespace")
          if (nameSpaceValue) {
            if (nameSpaceValue === dataFilter.value) {
              nameSpace.classList.add("current-filter-namespace")
            } else {
              nameSpace.classList.remove("current-filter-namespace")
            }
          }
        })
      }
      lists.forEach(list => {
        if (isAll) {
          list.style.display = "";
        } else {
          const listAttribute = list.getAttribute(dataFilter.type)
          if (listAttribute === dataFilter.value) {
            list.style.display = "";
          } else {
            list.style.display = "none";
          }
        }
      })
    }
  }
  
  for (let item of parentItems) {
    if (item.classList.contains("separator")) continue
    item.addEventListener("mouseenter", () => {
      if (isMobile) return
      const rChild = item.querySelector(".r-child")
      if (rChild) {
        const itemRect = item.getBoundingClientRect()
        const absoluteLeft = itemRect.x - menuRect.x
        const place = itemRect.x + item.clientWidth - menuRect.x
        const brandWrapper = rChild.closest(".brands-list-wrapper")
        const rChildItems = rChild.querySelectorAll("&>li")
        
        if (brandWrapper) {
          brandWrapper.style.left = `${menuRect.x * -1}px`
          let lists = brandWrapper.querySelectorAll("[data-target-namespace]")
          if (!filterLinks) filterLinks = brandWrapper.querySelectorAll("[data-namespace], [data-letter]")
          if (!nameSpaces) nameSpaces = brandWrapper.querySelectorAll(".filter-namespace")
          nameSpaces.forEach(nameSpace => {
            nameSpace.classList.remove("current-filter-namespace")
          })
          
          lists.forEach(list => {
            list.style.display = "";
          })
          
          
          filterLinks.forEach(link => {
            if (!filterFunctionBind) filterFunctionBind = filterHandler.bind(null, lists, brandWrapper)
            link.removeEventListener("click", filterFunctionBind)
            link.addEventListener("click", filterFunctionBind)
          })
          
          
        } else {
          if (rChild.clientWidth > place) {
            rChild.style.left = "0px"
          }
        }
        
        const heights = [...rChildItems].map(item => item.clientHeight)
        const lastList = [...rChildItems].at(-1)
        const lastListRect = lastList.getBoundingClientRect()
        let maxListHeight = Math.max.apply(null, heights);
        if (lastListRect.left + lastListRect.width + 60 > window.innerWidth) {
          console.log("here")
          maxListHeight *= 2.5
        }
        const paddingValue = +getComputedStyle(document.querySelector("[data-r=redesign]"))
          .getPropertyValue("--child-list-top-padding")
          .replace(/\D/g, "");
        rChild.style.height = `${maxListHeight + (paddingValue || 0) * 2}px`
      }
    })
  }
  if (burgers.length) {
    burgers.forEach(burger => {
      burger.addEventListener("click", burgerHandler)
    })
  }
  window.addEventListener("resize", setIsMobile)
  
  new FixHeader()
  
})