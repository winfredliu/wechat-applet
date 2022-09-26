let app = getApp()
Page({
  data: {
    productList: [],
    option: {
      page: 1,
      limit: 6,
      loadend: false,
      loading: false
    }
  },
  onLoad() {
    this.lodProductListByCollection()
  },
  lodProductListByCollection() {
    let {
      page,
      limit,
      loadend
    } = this.data.option
    if (loadend) {
      return
    }
    this.setData({
      "option.loading": true
    })
    app.$api.getProductListByCollection({
      page: page,
      limit: limit
    }).then(res => {
      if (res.code) {
        let {
          productList
        } = this.data
        if (res.code) {
          let proList = res.data
          if (productList.length > 0) {
            this.setData({
              productList: productList.concat(proList)
            })
          } else {
            this.setData({
              productList: proList
            })
          }

          if (proList.length < limit) {
            this.setData({
              "option.loadend": true
            })
          }

          this.setData({
            "option.page": ++page,
            "option.loading": false
          })
        }
      }
    })
  }
})