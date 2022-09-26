let app = getApp()
Page({
  data: {
    addressData: null,
    productList: [],
    allTotalAmount: 0,
    remarks: '',
    insufficient: true
  },
  onLoad() {
    let orderInfo = app.$db.get("orderInfo")
    this.setData({
      productList: orderInfo.productList,
      allTotalAmount: orderInfo.total
    })
    app.$db.del("orderInfo")
    this.loadUserAddressDefault()
  },
  onShow() {
    this.setData({
      beginMoney: app.globalData.userInfo.money
    })
    this.isInsufficient()
  },
  loadUserAddressDefault() {
    app.$api.getUserAddressDefault().then(res => {
      if (res.code) {
        this.setData({
          addressData: res.data[0]
        })
      }
    })
  },
  chooseAddress() {
    app.$comm.navigateTo("/pages/address/address", {
      choose: (e) => {
        let {
          data
        } = e
        this.setData({
          addressData: data
        })
      }
    })
  },
  allTotalAmountHandle() {
    let {
      productList
    } = this.data
    let allTotalAmount = productList.reduce((pre, cur) => {
      if (cur.product_check) {
        pre += cur.product_price * cur.product_count
      }
      return pre
    }, 0)
    this.setData({
      allTotalAmount
    })
  },
  remarksInputHandle(e) {
    let value = e.detail.value
    this.setData({
      remarks: value
    })
  },
  isInsufficient() {
    let {
      allTotalAmount,
      beginMoney
    } = this.data
    let insufficient = true
    if (beginMoney >= allTotalAmount) {
      insufficient = false
    }
    this.setData({
      insufficient
    })
  },
  toDepositHandle() {
    app.$comm.navigateTo("/pages/deposit/deposit")
  },
  btnPayHandle() {
    let {
      addressData,
      insufficient,
      productList,
      allTotalAmount,
      remarks
    } = this.data
    if (!addressData) {
      return app.$comm.errorToShow("请选择收货地址")
    }
    if (insufficient) {
      return app.$comm.errorToShow("余额不足，请先充值！")
    }
    app.$api.orderPay({
      addressData,
      productList,
      allTotalAmount,
      remarks
    }).then(res => {
      let {
        code,
        msg
      } = res
      if (code) {
        if (code == 1) {
          let userInfo = app.$db.get("userInfo")
          userInfo.money = Number(userInfo.money) - Number(allTotalAmount)
          app.$db.set('userInfo', userInfo)
          app.globalData.userInfo = userInfo
          app.$db.set('cartList', [])
          app.$comm.successToShow("购买成功", () => {
            app.$comm.redirectTo(`/pages/success/success?amount=${allTotalAmount}`)
          });
        } else if (code == 2) {
          return app.$comm.errorToShow(msg)
        } else if (code == 3) {
          return app.$comm.errorToShow(msg)
        }
      }
    })
  }
})