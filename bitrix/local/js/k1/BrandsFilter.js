class BrandsFilter {
  filterBar = {
    // letters:
  }
  headWrapper
  headLinks
  headNamespaces
  
  brandsWrapper
  brandsBlocks
  constructor() {
    this.headWrapper = document.querySelector(".brands-filter-wrapper")
    this.brandsWrapper = document.querySelector(".brands-list")
    this.headLinks = this.headWrapper?.querySelectorAll("a")
    this.headNamespaces = this.headWrapper?.querySelectorAll(".filter-namespace")
    this.brandsBlocks = this.brandsWrapper?.querySelectorAll(".brands-block")
    if (this.headLinks.length) this.init()
  }
  addHandlers() {
    for (let link of this.headLinks) {
      if (link.closest("[data-letter]")) link.addEventListener("click", this.applyFilterBind)
      if (link.closest("[data-namespace]")) link.addEventListener("click", this.applyNamespaceBind)
    }
  }
  applyFilter({target}, namespace = "") {
    
    if (namespace.length) {
      if (namespace === "all") {
        for (let block of this.brandsBlocks) {
          block.style.display = ""
        }
      } else {
        for (let block of this.brandsBlocks) {
          const attribute = block.getAttribute("data-namespace-target")
          if (attribute === namespace) {
            block.style.display = ""
          } else {
            block.style.display = "none"
          }
        }
      }
      return
    }
    const letter = target.closest("[data-letter]").getAttribute("data-letter")
    for (let block of this.brandsBlocks) {
      const letterValue = block.getAttribute("data-target-letter")
      if (letter === letterValue) {
        block.style.display = ""
      } else {
        block.style.display = "none"
      }
    }
  }
  applyNamespace({target}) {
    const namespace = target.closest("[data-namespace]").getAttribute("data-namespace")
    for (let namespaceBlock of (this.headNamespaces)) {
      if (target.closest("[data-namespace=all]")) {
        this.applyFilter({target: null}, "all")
        namespaceBlock.classList.remove("current-filter-namespace")
      } else {
        const nameSpaceValue = namespaceBlock.querySelector("[data-namespace]")?.getAttribute("data-namespace")
        if (nameSpaceValue === namespace) {
          namespaceBlock.classList.add("current-filter-namespace")
          this.applyFilter({target: null}, namespace)
        } else {
          namespaceBlock.classList.remove("current-filter-namespace")
        }
      }
    }
    // for(let block of this.brandsBlocks) {
    //   const attribute = block.getAttribute("data-namespace-target")
    //   if (namespace === attribute) {
    //     block.classList.add("current-filter-namespace")
    //   } else {
    //     block.classList.remove("current-filter-namespace")
    //   }
    // }
  }
  init() {
    this.applyFilterBind = this.applyFilter.bind(this)
    this.applyNamespaceBind = this.applyNamespace.bind(this)
    this.addHandlers()
  }
}