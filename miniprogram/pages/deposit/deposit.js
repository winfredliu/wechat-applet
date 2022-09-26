let app = getApp()
Page({
  data: {
    inputAmount: '',
    beginMoney: 0,
    amountList: [10, 50, 100],
    paytype: 'wxpay'
  },
  onLoad() {
    this.setData({
      beginMoney: app.globalData.userInfo.money
    })
  },
  onKeyInput(e) {
    let value = e.detail.value
    this.setData({
      inputAmount: this.filterNum(value)
    })
  },
  filterNum(i) {
    let num = i.charAt(i.length - 1)
    var reg = new RegExp("^[0-9]*$")
    if (!reg.test(num)) {
      return i.slice(0, -1)
    } else {
      return i
    }
  },
  select(e) {
    let amount = e.target.dataset.amount
    this.setData({
      inputAmount: amount
    })
  },
  choosePay(e){
    let type = e.currentTarget.dataset.type
    this.setData({
      paytype:type
    })
  },
  doDeposit() {
    let {
      inputAmount,
      beginMoney
    } = this.data
    if (parseFloat(inputAmount).toString() == "NaN") {
      return app.$comm.errorToShow("请输入正确金额")
    }
    if (inputAmount <= 0) {
      return app.$comm.errorToShow("请输入大于0的金额")
    }
    app.$api.userRecharge({
      money: inputAmount
    }).then((res) => {
      if (res.code) {
        let userInfo = app.$db.get("userInfo")
        userInfo.money = Number(beginMoney) + Number(inputAmount)
        app.$db.set('userInfo', userInfo)
        app.globalData.userInfo = userInfo
        app.$comm.successToShow("充值成功", () => {
          app.$comm.redirectTo(`/pages/success/success?amount=${inputAmount}`)
        });
      }
    })
  }
})