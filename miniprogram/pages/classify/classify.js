let app = getApp()
Page({
  data: {
    hotSearchList: [],
    swiperList: [],
    menuList: [],

    productList: [],
    option: {
      page: 1,
      limit: 6,
      loadend: false,
      loading: false
    }
  },
  onLoad() {
    this.loadIndexHotSearch()
    this.loadIndexSwiper()
    this.loadIndexMenu()
    this.loadIndexHotProduc()
  },
  loadIndexHotSearch() {
    app.$api.getIndexHotSearch().then(res => {
      if (res.code) {
        this.setData({
          hotSearchList: res.data
        })
      }
    })
  },
  loadIndexSwiper() {
    app.$api.getIndexSwiper().then(res => {
      if (res.code) {
        this.setData({
          swiperList: res.data
        })
      }
    })
  },
  loadIndexMenu() {
    app.$api.getIndexMenu().then(res => {
      if (res.code) {
        this.setData({
          menuList: res.data
        })
      }
    })
  },
  loadIndexHotProduc() {
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
    app.$api.getIndexHotProduct({
      page: page,
      limit: limit
    }).then(res => {
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
    })
  },
  onReachBottom() {
    this.loadIndexHotProduc()
  },
  toProductList(e) {
    let info = e.currentTarget.dataset.info
    let val = info.product_type_name
    app.$comm.navigateTo(`/pages/product-list/product-list?product_type_name=${val}`)
  },
  toSeachHandle() {
    app.$comm.navigateTo("/pages/search/search")
  },
  toSwiperDetailHandle(e) {
    let {
      info
    } = e.currentTarget.dataset
    if (info.swiper_page_type == "nothing") {

    } else if (info.swiper_page_type == "product-detail") {
      app.$comm.navigateTo("/pages/product-detail/product-detail?id=" + info.swiper_option)
    } else if (info.swiper_page_type == "classify") {
      app.$comm.navigateTo(`/pages/product-list/product-list?product_type_name=${info.swiper_option}`)
    }
  }
})