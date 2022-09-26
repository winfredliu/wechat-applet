// pages/ticket/ticket.js
let util = require("../../utils");
let app = getApp()
Page({
  data: {
    TabCur: 0,
    navs: ["门票", "观光车", "索道", "环山"],
    ticketList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTicketList(0)
  },

  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
    this.getTicketList(this.data.TabCur)
  },

  getTicketList(type) {
    wx.cloud.callFunction({
      name: "GetTicket",
      data: {
        type
      }
    }).then(res => {
      res.result.data.forEach(item => {
        item.price = util.formatNumber(item.price);
      });
      //console.log(res);
      this.setData({
        ticketList: res.result.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  addtocar(e) {
    let tmpType=e.currentTarget.dataset.tmptype
    console.log(e.currentTarget.dataset)
    let cartList = app.$db.get("cartList") || []
    let proInfo={}
    if(tmpType==0){
      proInfo = {
        productId: "ca780ad562bd1949094572f37f8e7eae",
        product_name: "门票",
        product_price: 10,
        product_img_list: ["cloud://cloud1-6gyj8u4g9601f3a9.636c-cloud1-6gyj8u4g9601f3a9-1312002734/product/1656559943825.jpeg"],
        product_count: 1,
        product_check: true
      }
    }else if(tmpType==1){
      proInfo = {
        productId: "16db756f62bd213e09229c9d63965ad0",
        product_name: "观光车",
        product_price: 10,
        product_img_list: ["cloud://cloud1-6gyj8u4g9601f3a9.636c-cloud1-6gyj8u4g9601f3a9-1312002734/product/1656561980786.jpeg"],
        product_count: 1,
        product_check: true
      }
    }else if(tmpType==2){
      proInfo = {
        productId: "16db756f62bd218c0922a2990957c15b",
        product_name: "索道",
        product_price: 20,
        product_img_list: ["cloud://cloud1-6gyj8u4g9601f3a9.636c-cloud1-6gyj8u4g9601f3a9-1312002734/product/1656562059231.jpeg"],
        product_count: 1,
        product_check: true
      }
    }else if(tmpType==3){
      proInfo = {
        productId: "6842667962bd21da078109fc02d29769",
        product_name: "环山",
        product_price: 20,
        product_img_list: ["cloud://cloud1-6gyj8u4g9601f3a9.636c-cloud1-6gyj8u4g9601f3a9-1312002734/product/1656562117070.jpeg"],
        product_count: 1,
        product_check: true
      }
    }
    cartList.push(proInfo)
    app.$db.set("cartList", cartList)
    wx.showModal({
      cancelColor: 'cancelColor',
      title:'温馨提示',
      content:'预订成功，可在购物车页面查看和修改。'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})