let app = getApp()
Page({
  data: {
    pageType: 'add',

    orderData: {}
  },
  onLoad(options) {
    let {
      info,
      pageType
    } = options
    if (~['update', 'show'].indexOf(pageType)) {
      let {
        orderData
      } = this.data
      let productInfo = JSON.parse(info)
      Object.assign(orderData, productInfo)
      this.setData({
        orderData: orderData,
        pageType: pageType
      })
    }
  },
  deliverGoodsHandle() {
    app.$api.updateDeliverGoods({
      _id: this.data.orderData._id
    }).then(res => {
      if (res.code) {
        app.$comm.successToShow(res.msg, () => {
          app.$comm.navigateBack()
        })
      }
    })
  },
  returnGoodsHandle() {
    app.$api.updateReturnGoods({
      _id: this.data.orderData._id
    }).then(res => {
      if (res.code) {
        app.$comm.successToShow(res.msg, () => {
          app.$comm.navigateBack()
        })
      }
    })
  }
})