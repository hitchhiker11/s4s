class Modal {
  modalOpen = null;
  bodyNode = document.querySelector("body");
  modal = null;
  
  
  constructor(type) {
    switch (type) {
      case "feedback":
        this.modalOpen = document.querySelectorAll(".k1-modal-open-feedback");
        this.modal = document.querySelector(".k1-modal.k1-modal-feedback");
        break;
    }
    this.init();
  }
  
  showModal(e) {
    e.preventDefault();
    this.modal.classList.add("k1-opened");
    this.modal.addEventListener("click", this.closeModalBind);
    window.addEventListener("keyup", this.closeModalBind);
    this.setModalCardScroll();
  }
  
  closeModalHandler({key, keyCode, code, target, type}) {
    if (type === "keyup") {
      if (key === "Escape" || code === "Escape" || keyCode === 27) {
        this.closeModal();
      }
    }
    if (type === "click") {
      if (target.closest(".k1-modal__close") || !target.closest(".k1-modal__body")) {
        this.closeModal();
      }
    }
  }
  
  closeModal() {
    this.modal.classList.remove('k1-opened');
    this.bodyNode.classList.remove("no-scroll");
    this.modal.removeEventListener("click", this.closeModalBind);
    window.removeEventListener("keyup", this.closeModalBind);
  }
  
  addListeners() {
    if (this.modalOpen.length) {
      for (let button of this.modalOpen) {
        button.removeEventListener("click", this.showModalBind);
        button.addEventListener("click", this.showModalBind);
      }
    } else {
      this.modalOpen.removeEventListener("click", this.showModalBind);
      this.modalOpen.addEventListener("click", this.showModalBind);
    }
    window.removeEventListener("resize", this.setModalCardScrollBind);
    window.addEventListener("resize", this.setModalCardScrollBind);
  }
  
  setModalCardScroll() {
    if (!this.modal.classList.contains("k1-opened")) return;
    const modalBody = this.modal.querySelector(".k1-modal__body");
    const styles = getComputedStyle(this.modal);
    const paddingTop =
      +styles
        .getPropertyValue("padding-top")
        .replace(/\D/g, "");
    const paddingBottom =
      +styles
        .getPropertyValue("padding-bottom")
        .replace(/\D/g, "");
    const modalHeight = Math.max(modalBody.clientHeight, modalBody.scrollHeight) + paddingBottom + paddingTop;
    
    if (modalHeight > window.innerHeight) {
      this.modal.classList.add("k1-modal-scroll");
    } else {
      this.modal.classList.remove("k1-modal-scroll");
    }
  }
  
  init() {
    if (this.modalOpen && this.modal) {
      if (this.modal.classList.contains("k1-opened")) {
        this.closeModal();
      }
      this.closeModalBind = this.closeModalHandler.bind(this);
      this.showModalBind = this.showModal.bind(this);
      this.setModalCardScrollBind = this.setModalCardScroll.bind(this);
      this.addListeners();
      
    }
  }
}