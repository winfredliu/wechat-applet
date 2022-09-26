let app = getApp()
Page({
  data: {
    height: 64,
    top: 0,
    scrollH: 0,
    opcity: 0,
    iconOpcity: 0.5,

    productId: 0,
    productInfo: {},
    bannerIndex: 0,

    popupShow: false,
    stockNum: 1,
    cartNum: 0
  },
  onLoad: function (option) {
    this.setData({
      productId: option.id
    })
    this.loadProductDetail()
    this.getCartNum()
    let obj = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollH: res.windowWidth,
          height: res.statusBarHeight + obj.height + (obj.top - res.statusBarHeight) * 2,
          top: obj.top
        })
      }
    })
  },
  loadProductDetail() {
    app.$api.getProductDetail({
      productId: this.data.productId
    }).then(res => {
      if (res.code) {
        this.setData({
          productInfo: res.data
        })
      }
    })
  },
  bannerChange: function (e) {
    this.setData({
      bannerIndex: e.detail.current
    })
  },
  previewImage: function (e) {
    let index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.productInfo.product_img_list[index],
      urls: this.data.productInfo.product_img_list
    })
  },
  back: function () {
    app.$comm.navigateBack()
  },
  showPopup: function () {
    this.setData({
      popupShow: true
    })
  },
  hidePopup: function () {
    this.setData({
      popupShow: false
    })
  },
  change: function (e) {
    this.setData({
      stockNum: e.detail.value
    })
  },
  addCartProduct() {
    let {
      stockNum,
      productId,
      productInfo
    } = this.data

    let cartList = app.$db.get("cartList") || []
    let proIndex = cartList.findIndex(proItem => proItem.productId == productId)
    console.log(productId)
    console.log(productInfo)
    console.log(stockNum)
    if (proIndex == -1) {
      let proInfo = {
        productId: productId,
        product_name: productInfo.product_name,
        product_price: productInfo.product_price,
        product_img_list: productInfo.product_img_list,
        product_count: stockNum,
        product_check: true
      }
      cartList.push(proInfo)
    } else {
      cartList[proIndex].product_count = stockNum
    }
    app.$db.set("cartList", cartList)
    this.getCartNum()
    this.hidePopup()
  },
  toCartHandle() {
    app.$comm.switchTabTo("/pages/cart/cart")
  },
  onPageScroll(e) {
    let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
    let opcity = scroll / this.data.scrollH;
    if (this.data.opcity >= 1 && opcity >= 1) {
      return;
    }
    this.setData({
      opcity: opcity,
      iconOpcity: 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity)
    })
  },
  getCartNum() {
    let cartList = app.$db.get("cartList") || []
    this.setData({
      cartNum: cartList.length
    })
  },
  changeCollecting() {
    if (!app.globalData.isLogin) {
      return app.$comm.errorToShow("请先登录")
    }
    app.$api.updateCollecting({
      productId: this.data.productId
    }).then(res => {
      if (res.code == 1) {
        app.$comm.successToShow("收藏成功")
        let productInfo = this.data.productInfo
        productInfo.product_collection = true
        this.setData({
          productInfo: productInfo
        })
      } else if (res.code == 2) {
        app.$comm.successToShow("取消收藏成功")
        let productInfo = this.data.productInfo
        productInfo.product_collection = false
        this.setData({
          productInfo: productInfo
        })
      }
    })
  },
  nowBuy() {
    let {
      stockNum,
      productId,
      productInfo
    } = this.data
    this.hidePopup()
    if (!stockNum) {
      stockNum = 1
    }
    let allTotalAmount = Number(stockNum) * Number(productInfo.product_price)

    if (!app.globalData.isLogin) {
      return app.$comm.errorToShow("请先登录")
    }
    let productList = [{
      productId: productId,
      product_name: productInfo.product_name,
      product_price: productInfo.product_price,
      product_img_list: productInfo.product_img_list,
      product_count: stockNum,
      product_check: true
    }]
    app.$api.isStockAdequate({
      productList: productList
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
            total: allTotalAmount,
            productList: productList
          })
          app.$comm.navigateTo("/pages/submit-order/submit-order")
        }
      }
    })
  }
})