class Order {
  orderForm = document.querySelector("form#order-form")
  sendRequestBind = this.sendRequest.bind(this)
  constructor() {
    this.init()

  }
  async init() {

    this.addHandlers()
  }

  addHandlers() {
    this.orderForm.addEventListener("submit", this.sendRequestBind)
  }
  sendRequest(event) {
    event.preventDefault()
    let error = 0;
    const target = event.target
    const _this = this
    const fd = new FormData(target)
    const errorNodes = target.querySelectorAll(".k1-error-node")
    errorNodes.forEach(errorNode => errorNode.remove())
    let data = {};
    for (let pair of fd.entries()) {
      data[pair[0]] = pair[1]
    }
    $(".form-order input[type='email'], .form-order input[type='text'], .form-order input[type='password'], .form-order textarea").each(
      function(key, value) {
        if ($(this).hasClass("email") && $(this).val().length > 0) {
          if (!(
            /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
          ).test($(this).val())) {
            $(this).parent("div.input").addClass("has-error");
            error = 1;
          }
        }
        if ($(this).hasClass("require")) {
          if ($(this).val().trim().length <= 0){
            $(this).val("");
            $(this).parent("div.input").addClass("has-error");
            error = 1;
          }
        }
      }
    );
    if (error < 1) {
      const response = BX.ajax.runComponentAction("ft:order", "createOrder", {
        mode: 'class',
        data: {
          params: JSON.stringify({data}),
          sessid: BX.message('bitrix_sessid')
        }
      });
      response.then(({data}) => {
        // if (data.error) {
        //   _this.setErrors(data.errorList)
        // }
        if (data.empty) {
          location.reload()
          return
        }
        if (data.id) {
          location.href = `/cart/?order_id=${data.id}`
        }
      })
    }
  }

}