let app = getApp()
Page({
  data: {
    cartList: [],
    actions: [{
      name: '删除',
      color: '#fff',
      fontsize: 28,
      width: 64,
      background: '#F82400'
    }],
    isEdit: false,
    isCheckAll: false,
    allTotalNumber: 0,
    allTotalAmount: 0
  },
  onShow() {
    let cartList = app.$db.get("cartList") || []
    this.setData({
      cartList: cartList
    })
    this.cartChangeHandle()
  },
  changeNum(e) {
    let {
      index,
      value
    } = e.detail
    this.changeCart(index, {
      product_count: value
    })
  },
  handlerButton(e) {
    let {
      index,
      item
    } = e.detail;
    if (index === 0) {
      this.delCart(item.productId)
    }
  },
  changeCart(productId, options) {
    let cartList = this.data.cartList
    let proItem = cartList.find(proItem => proItem.productId == productId)
    if (proItem) {
      Object.assign(proItem, options)
    }
    this.setData({
      cartList
    })
    this.cartChangeHandle()
  },
  delCart(productId) {
    let cartList = this.data.cartList
    let proIndex = cartList.findIndex(proItem => proItem.productId == productId)
    cartList.splice(proIndex, 1)
    this.setData({
      cartList
    })
    this.cartChangeHandle()
  },
  editGoods() {
    this.setData({
      isEdit: !this.data.isEdit
    })
  },
  productCheckHandle(e) {
    let productId = e.currentTarget.dataset.id
    let product_check = this.data.cartList.find(pro => pro.productId == productId).product_check
    this.changeCart(productId, {
      product_check: !product_check
    })
  },
  checkAll() {
    let {
      isCheckAll,
      cartList
    } = this.data
    if (!cartList.length) {
      return app.$comm.errorToShow("购物车为空")
    }
    if (isCheckAll) {
      cartList.forEach(pro => pro.product_check = false)
    } else {
      cartList.forEach(pro => pro.product_check = true)
    }
    this.setData({
      cartList
    })
    this.cartChangeHandle()
  },
  delAllCheck() {
    let {
      cartList
    } = this.data
    cartList = cartList.reduce((pre, cur) => {
      if (!cur.product_check) {
        pre.push(cur)
      }
      return pre
    }, [])
    this.setData({
      cartList
    })
    this.cartChangeHandle()
  },
  cartChangeHandle() {
    this.checkAllHandle()
    this.allTotalAmountHandle()
    this.allTotalNumberHandle()
    app.$db.set("cartList", this.data.cartList)
  },
  checkAllHandle() {
    let {
      cartList
    } = this.data
    let isCheckAll = false
    if (cartList.length) {
      isCheckAll = cartList.every(pro => pro.product_check)
    }
    this.setData({
      isCheckAll
    })
  },
  allTotalAmountHandle() {
    let {
      cartList
    } = this.data
    let allTotalAmount = cartList.reduce((pre, cur) => {
      if (cur.product_check) {
        pre += cur.product_price * cur.product_count
      }
      return pre
    }, 0)
    this.setData({
      allTotalAmount
    })
  },
  allTotalNumberHandle() {
    let {
      cartList
    } = this.data
    let allTotalNumber = cartList.reduce((pre, cur) => {
      pre++
      return pre
    }, 0)
    this.setData({
      allTotalNumber
    })
  },
  orderSubmit() {
    let {
      cartList
    } = this.data
    if (!app.globalData.isLogin) {
      return app.$comm.errorToShow("请先登录")
    }
    let checkList = cartList.filter(pro => pro.product_check) || []

    if (!checkList.length) {
      return app.$comm.errorToShow("请先选择商品")
    }

    app.$api.isStockAdequate({
      productList: checkList
    }).then(res => {
      let {
        code
      } = res
      if (code) {
        if (code == 2) {
          return app.$comm.errorToShow("商品库存不足")
        }
        if (code == 1) {
          app.$db.set("orderInfo", {
            total: this.data.allTotalAmount,
            productList: checkList
          })
          app.$comm.navigateTo("/pages/submit-order/submit-order")
        }
      }
    })
  }
})