let app=getApp()
Page({
  data: {
    amount: 0
  },
  onLoad(options) {
    let amount = parseFloat(options.amount).toFixed(2);
    this.setData({
      amount
    })
  },
  back() {
    app.$comm.navigateBack()
  }
})