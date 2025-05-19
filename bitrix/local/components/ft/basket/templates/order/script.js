class KBasket {
  nodes = {}
  products = []
  basketTotal = {}
  
  quantityVariables = {
    step: 1,
    min: 1
  }
  
  timeout = null
  basketNode = null
  basketEmpty = null
  totalNode = null
  entityName = "data-k-entity"
  
  constructor(params) {
    this.nodes = params.nodes
    this.products = params.products
    this.basketTotal = params.basketTotal
    this.basketNode = document.querySelector(`[${this.entityName}=${this.nodes.basketWrapper}]`)
    this.basketEmpty = document.querySelector(`[${this.entityName}=${this.nodes.basketEmpty}]`)
    this.totalNode = document.querySelector(`[${this.entityName}=${this.nodes.basketTotal}]`)
    if (!this.basketNode) return
    this.init()
  }
  
  reDrawProductRaws() {
    const productNode = document.querySelector(`[${this.entityName}=${this.nodes.productWrapper}]`)
    const products = []
    BX.cleanNode(productNode)
    for (let product of this.products) {
      products.push(this.getProductRow(product))
    }
    BX.adjust(productNode, {
      children: products
    })
    console.log(productNode)
    
    this.basketNode.dispatchEvent(new Event("reDrawEnd"))
  }
  
  drawTotalBlock() {
    if (this.totalNode) {
      BX.adjust(this.totalNode, {
        children: [
          this.getBasketTotalNode()
        ]
      })
    }
  }
  
  getProductRow(data) {
    return BX.create("TR", {
      props: {
        className: "product-element parent-preload-circleG-wrap clearfix k1-test",
      },
      attrs: {
        "data-k-id": data.PRODUCT_ID
      },
      children: [
        this.getProductInfo(data),
        this.getProductCountNode(data),
        this.getProductPriceNode(data.PRICES.TOTAL_PRICE_FORMATTED),
        this.getProductRemoveNode()
      ]
    })
  }
  
  getProductInfo(data) {
    const productNameChildren = []
    let skuString = ""
    productNameChildren.push(
      BX.create("DIV", {
        props: {
          className: "main bold parent_link_style"
        },
        children: [
          BX.create("SPAN", {
            text: data.NAME,
          }),
          BX.create("A", {
            attrs: {
              target: "_blank",
              href: data.DETAIL_PAGE_URL
            },
            props: {
              className: "link_style"
            }
          })
        ]
      })
    )
    if (data.ARTICLE_ && data.ARTICLE_.length) {
      productNameChildren.push(
        BX.create("DIV", {
          props: {
            className: "other"
          },
          text: data.ARTICLE_
        })
      );
    }
    if (data.SKU_PROPS?.length) {
      for (let prop of data.SKU_PROPS) {
        if (prop.VALUE) skuString += `${prop.TITLE}: ${prop.VALUE} <br>`
      }
    }
    productNameChildren.push(
      BX.create("DIV", {
        props: {
          className: "name_offers"
        },
        html: skuString
      })
    )
    console.log(data)
    return BX.create("TD", {
      props: {
        className: "td-lvl-1 product-info col-sm-6 col-xs-12"
      },
      children: [
        BX.create("TABLE", {
          children: [
            BX.create("TBODY", {
              children: [
                BX.create("TR", {
                  children: [
                    BX.create("TD", {
                      props: {
                        className: "img parent_link_style"
                      },
                      children: [
                        BX.create("IMG", {
                          props: {
                            className: ""
                          },
                          attrs: {
                            alt: data.name,
                            src: data.PREVIEW_PICTURE || data.DETAIL_PICTURE
                          }
                        }),
                        BX.create("A", {
                          props: {
                            className: "link_style"
                          },
                          attrs: {
                            target: "_blank",
                            href: data.DETAIL_PAGE_URL
                          }
                        })
                      ]
                    }),
                    BX.create("TD", {
                      props: {
                        className: "name"
                      },
                      children: productNameChildren
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    })
  }
  
  getProductCountNode(data) {
    return BX.create("TD", {
      props: {
        className: "td-lvl-1 counter col-lg-2 col-md-2 col-sm-2 col-xs-12"
      },
      children: [
        BX.create("DIV", {
          props: {
            className: "count-cart parent-calccart has-max-count"
          },
          attrs: {
            "data-cart-step": this.quantityVariables.step,
            "data-cart-min": this.quantityVariables.min,
            "data-cart-max": data.QUANTITY.MAX
          },
          children: [
            BX.create("DIV", {
              text: `В наличие ${data.QUANTITY.MAX} шт.`
            }),
            BX.create("TABLE", {
              children: [
                BX.create("TBODY", {
                  children: [
                    BX.create("TR", {
                      children: [
                        BX.create("TD", {
                          props: {
                            className: "left minus k-count-minus"
                          },
                          events: {
                            click: BX.proxy(this.decrementQuantity, this)
                          },
                          children: [
                            BX.create("DIV", {})
                          ]
                        }),
                        BX.create("TD", {
                          props: {
                            className: "center"
                          },
                          children: [
                            BX.create("input", {
                              props: {
                                className: "k-count-val"
                              },
                              attrs: {
                                name: "count-cart",
                                type: "text",
                                value: data.QUANTITY.TOTAL
                              },
                              events: {
                                input: BX.proxy(this.changeQuantity, this)
                              }
                            })
                          ]
                        }),
                        BX.create("TD", {
                          props: {
                            className: "right plus k-count-plus"
                          },
                          events: {
                            click: BX.proxy(this.incrementQuantity, this)
                          },
                          children: [
                            BX.create("DIV", {})
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        }),
        BX.create("DIV", {
          props: {
            className: "price-unit"
          },
          text: data.PRICES.PRICE_FORMATTED
        })
      ]
    })
  }
  
  getProductPriceNode(priceFormatted) {
    return BX.create("TD", {
      props: {
        className: "td-lvl-1 price col-sm-3 col-xs-12",
      },
      children: [
        BX.create("DIV", {
          props: {
            className: "price-one bold parent-preload-circleG"
          },
          children: [
            BX.create("DIV", {
              props: {
                className: "circleG-opacity",
              },
              text: priceFormatted
            }),
            BX.create("DIV", {
              props: {
                className: "circleG-wrap small"
              },
              children: [
                BX.create("DIV", {
                  props: {
                    className: "circleG circleG_1"
                  }
                }),
                BX.create("DIV", {
                  props: {
                    className: "circleG circleG_2"
                  }
                }),
                BX.create("DIV", {
                  props: {
                    className: "circleG circleG_3"
                  }
                })
              ]
            })
          ]
        })
      ]
    })
  }
  
  getProductRemoveNode() {
    return BX.create("TD", {
      props: {
        className: "td-lvl-1 remove-wrap col-lg-1 col-md-1 col-sm-1 col-xs-12",
        attrs: {
          "data-k-entity": this.nodes.remove
        }
      },
      children: [
        BX.create("DIV", {
          children: [
            BX.create("A", {
              props: {
                className: "remove k-remove-basket"
              },
              events: {
                click: BX.proxy(this.removeProduct, this)
              }
            })
          ]
        })
      ]
    })
  }
  
  getBasketTotalNode() {
    return BX.create("DIV", {
      props: {
        className: "total-price-area-style"
      },
      children: [
        BX.create("TABLE", {
          props: {
            className: "tpas mobile-break"
          },
          children: [
            BX.create("TR", {
              children: [
                BX.create("TD", {
                  props: {
                    className: "tpas-left"
                  },
                  children: [
                    BX.create("DIV", {
                      props: {
                        className: "tpas-left-inner"
                      }
                    })
                  ]
                }),
                BX.create("TD", {
                  props: {
                    className: "tpas-right"
                  },
                  children: [
                    BX.create("DIV", {
                      props: {
                        className: "tpas-right-inner"
                      },
                      children: [
                        BX.create("DIV", {
                          props: {
                            className: "area_for_total"
                          },
                          children: [
                            BX.create("DIV", {
                              props: {
                                className: "total"
                              },
                              children: [
                                BX.create("DIV", {
                                  props: {
                                    className: "desc-top"
                                  },
                                  text: "Итого"
                                }),
                                BX.create("DIV", {
                                  props: {
                                    className: "total-price bold parent-preload-circleG total-parent-preload-circleG"
                                  },
                                  children: [
                                    BX.create("DIV", {
                                      props: {
                                        className: "circleG-opacity"
                                      },
                                      attrs: {
                                        "data-k-entity": this.nodes.basketTotalPrice
                                      }
                                    }),
                                    BX.create("DIV", {
                                      props: {
                                        className: "circleG-wrap"
                                      },
                                      children: [
                                        BX.create("DIV", {
                                          props: {
                                            className: "circleG circleG_1"
                                          },
                                        }),
                                        BX.create("DIV", {
                                          props: {
                                            className: "circleG circleG_2"
                                          },
                                        }),
                                        BX.create("DIV", {
                                          props: {
                                            className: "circleG circleG_3"
                                          },
                                        }),
                                      ]
                                    }),
                                  ]
                                }),
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
      // children: [
      //   BX.create("DIV", {
      //     props: {
      //       className: "area_for_total"
      //     },
      //     children: [
      //       BX.create("DIV", {
      //         props: {
      //           className: "total"
      //         },
      //         children: [
      //           BX.create("DIV", {
      //             props: {
      //               className: "desc-top"
      //             },
      //             text: "Итого"
      //           }),
      //           BX.create("DIV", {
      //             props: {
      //               className: "total-price bold parent-preload-circleG total-parent-preload-circleG"
      //             },
      //             children: [
      //               BX.create("DIV", {
      //                 props: {
      //                   className: "circleG-opacity"
      //                 },
      //                 attrs: {
      //                   "data-k-entity": this.nodes.basketTotalPrice
      //                 }
      //               }),
      //               BX.create("DIV", {
      //                 props: {
      //                   className: "circleG-wrap"
      //                 },
      //                 children: [
      //                   BX.create("DIV", {
      //                     props: {
      //                       className: "circleG circleG_1"
      //                     },
      //                   }),
      //                   BX.create("DIV", {
      //                     props: {
      //                       className: "circleG circleG_2"
      //                     },
      //                   }),
      //                   BX.create("DIV", {
      //                     props: {
      //                       className: "circleG circleG_3"
      //                     },
      //                   }),
      //                 ]
      //               }),
      //             ]
      //           }),
      //         ]
      //       })
      //     ]
      //   }),
      //   BX.create("DIV", {
      //     props: {
      //       className: "buttons"
      //     },
      //     children: [
      //       BX.create("A", {
      //         props: {
      //           className: "first-b main-color button-def elips shine big"
      //         },
      //         attrs: {
      //           href: "/cart/"
      //         },
      //         text: "Оформить заказ"
      //       })
      //     ]
      //   }),
      //   BX.create("DIV", {
      //     props: {
      //       className: "clear"
      //     },
      //     children: [
      //       BX.create("A", {
      //         props: {
      //           className: "clear-cart action-clear-cart"
      //         },
      //         attrs: {
      //           href: "javascript:void(0)"
      //         },
      //         events: {
      //           click: BX.proxy(this.removeAllProduct, this)
      //         },
      //         text: "Очистить корзину"
      //       })
      //     ]
      //   })
      // ]
    })
   
  }
  
  incrementQuantity({target}) {
    const id = this.getProductID(target)
    const product = this.getProduct(id)
    let quantity = ++product.QUANTITY.TOTAL
    if (+quantity > +product.QUANTITY.MAX) {
      product.QUANTITY.TOTAL = product.QUANTITY.MAX
      this.recalculatePrices(product)
      this.reDrawProductRaws()
      return
    }
    this.changeQuantityRequest({
      id,
      quantity
    })
  }
  
  decrementQuantity({target}) {
    const id = this.getProductID(target)
    const product = this.getProduct(id)
    let quantity = --product.QUANTITY.TOTAL
    if (+quantity < 1) {
      product.QUANTITY.TOTAL = 1
      this.reDrawProductRaws()
      this.recalculatePrices(product)
      return
    }
    this.changeQuantityRequest({
      id,
      quantity
    })
  }
  
  changeQuantity({target}) {
    const id = this.getProductID(target)
    const product = this.getProduct(id)
    let needRequest = true
    let quantity = target.value
    if (+quantity < 1) {
      quantity = 1
      needRequest = false
    }
    if (+quantity > +product.QUANTITY.MAX) {
      quantity = product.QUANTITY.MAX
      needRequest = false
    }
    if (!needRequest) {
      product.QUANTITY.TOTAL = quantity
      this.recalculatePrices(product)
      this.reDrawProductRaws()
    } else {
      if (this.timeout) clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.changeQuantityRequest({
          id,
          quantity
        })
      }, 400)
    }
  }
  
  changeQuantityRequest(data) {
    const response = BX.ajax.runComponentAction("ft:basket", "changeProductQuantity", {
      mode: 'class',
      data: {
        params: JSON.stringify(data),
        sessid: BX.message('bitrix_sessid')
      }
    });
    response.then(({data}) => {
      const result = JSON.parse(data)
      this.nodes = result.nodes
      this.products = result.products
      this.basketTotal = result.basketTotal
      this.reDrawProductRaws()
      BX.onCustomEvent(this.basketNode, "reCalculate")
    })
  }
  recalculatePrices(product) {
    const quantity = +product.QUANTITY.TOTAL
    product.PRICES.TOTAL_PRICE = +product.PRICES.PRICE * quantity
    product.PRICES.TOTAL_PRICE_FORMATTED = `${product.PRICES.TOTAL_PRICE.toLocaleString()} ₽`
    let totalPrice = 0;
    for(let productItem of this.products) {
      totalPrice += +productItem.PRICES.TOTAL_PRICE
    }
    this.basketTotal = {
      PRICE: totalPrice,
      PRICE_FORMATTED: `${totalPrice.toLocaleString()} ₽`
    }
    console.log("event")
    BX.onCustomEvent(this.basketNode, "reCalculate")
    // this.basketNode.dispatchEvent(new Event("reCalculate"))
  }
  changeTotalPrice() {
    const priceNode = this.getEntityNode(this.nodes.basketTotalPrice)
    priceNode.textContent = this.basketTotal.PRICE_FORMATTED
  }
  getProductID(node) {
    return node.closest("[data-k-id]")?.getAttribute("data-k-id") || false
  }
  
  getProduct(id) {
    return this.products.filter(product => +product.PRODUCT_ID === +id)[0]
  }
  
  getEntityNode(entity) {
    return this.basketNode.querySelector(`[${this.entityName}=${entity}]`)
  }
  
  removeProduct({target}) {
    const id = this.getProductID(target)
    const response = BX.ajax.runComponentAction("ft:basket", "removeProduct", {
      mode: 'class',
      data: {
        id,
        sessid: BX.message('bitrix_sessid')
      }
    });
    response.then(({data}) => {
      const result = JSON.parse(data)
      this.nodes = result.nodes
      this.products = result.products
      this.basketTotal = result.basketTotal
      if (this.basketTotal.EMPTY === true) {
        this.showEmptyBasket()
      }
      this.reDrawProductRaws()
      BX.onCustomEvent(this.basketNode, "reCalculate")
    })
  }
  
  removeAllProduct() {
    const response = BX.ajax.runComponentAction("ft:basket", "removeAllProduct", {
      mode: 'class',
      data: {
        sessid: BX.message('bitrix_sessid')
      }
    });
    response.then(({data}) => {
      const result = JSON.parse(data)
      this.nodes = result.nodes
      this.products = result.products
      this.basketTotal = result.basketTotal
      this.showEmptyBasket()
    })
  }
  
  showEmptyBasket() {
    this.basketNode.style.display = "none"
    this.basketEmpty.style.display = "block"
    const cartWrapper = this.basketEmpty.closest(".form-cart-wrap-inner")
    console.log(this.basketEmpty.closest(".form-cart-wrap-inner"))
    if (cartWrapper) {
      cartWrapper.style.cssText = "overflow: initial; box-shadow: none;"
    }
    const titleNode = document.querySelector(".k1-main-title h1")
    if (titleNode) titleNode.textContent = "Увы, в вашей корзине пусто :("
  }
  
  
  init() {
    if (this.basketTotal.EMPTY) {
      this.showEmptyBasket()
      return;
    }
    this.reDrawProductRaws()
    this.drawTotalBlock()
    this.changeTotalPrice()
    BX.addCustomEvent(this.basketNode, "reCalculate", BX.delegate(this.changeTotalPrice, this))
    BX.addCustomEvent(
      "OnBasketChange",
      BX.delegate(function() {
        this.reDrawProductRaws()
        this.drawTotalBlock()
        this.changeTotalPrice()
      }, this)
    );
  }
}