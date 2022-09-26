let app = getApp()
Page({
  data: {
    tabs: [{
      name: "全部",
      state: -1,
      isLoad: false
    }, {
      name: "待发货",
      state: 1,
      isLoad: false
    }, {
      name: "待收货",
      state: 2,
      isLoad: false
    }, {
      name: "待退款",
      state: 3,
      isLoad: false
    }],
    currentTab: 0,
    orderList: [],
    orderListData: Array(4).fill([])
  },
  onLoad: function (options) {
    let tbIndex = parseInt(options.state) || -1
    if (tbIndex === -1) {
      tbIndex = 0
    }
    let currentTab = tbIndex;
    let orderList = this.data.orderListData[tbIndex];
    this.setData({
      currentTab,
      orderList
    })
    this.loadOrderList()
  },
  changeTabHandle(e) {
    let currentTab = e.detail.index
    this.setData({
      currentTab: currentTab,
      orderList: this.data.orderListData[currentTab]
    })
    this.loadOrderList()
  },
  loadOrderList() {
    let {
      orderListData,
      currentTab,
      tabs
    } = this.data
    if (orderListData[currentTab].length > 0 || tabs[currentTab].isLoad) {
      return;
    }
    app.$api.getOrderListCompleted({
      state: tabs[currentTab].state
    }).then(res => {
      if (res.code) {
        orderListData[currentTab].push(...res.data)
        tabs[currentTab].isLoad = true
        this.setData({
          orderListData,
          orderList: orderListData[currentTab]
        })
      }
    })
  },
  againPayHandle(e) {
    let {
      productList
    } = e.detail.data
    let allTotalAmount = productList.reduce((pre, cur) => {
      if (cur.product_check) {
        pre += cur.product_price * cur.product_count
      }
      return pre
    }, 0)

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
  },
  initData(){
    this.setData({
      orderList: [],
      orderListData: Array(4).fill([])
    })
    this.loadOrderList()
  },
  returnGoodsHandle(e) {
    let {
      _id
    } = e.detail.data
    app.$api.userReturnGoods({
      _id
    }).then(res => {
      if (res.code) {
        app.$comm.successToShow(res.msg, () => {
          this.initData()
        })
      }
    })
  }
})