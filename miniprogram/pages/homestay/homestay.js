// pages/ticket/ticket.js
let util = require("../../utils");
let app = getApp()
Page({
  data: {
    homestay: [],
    page: 0,
    limit: 4,
    end: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHomeStay()
  },
  showThis() {
    wx.navigateTo({
      url: '/package_panorama/pages/photo/photo'
    });
  },
  addtocar() {
    let cartList = app.$db.get("cartList") || []
    let proInfo = {}

    proInfo = {
      productId: "b69f67c062bd19e709467bd03602ab39",
      product_name: "民宿",
      product_price: 10,
      product_img_list: ["cloud://cloud1-6gyj8u4g9601f3a9.636c-cloud1-6gyj8u4g9601f3a9-1312002734/product/1656560101837.jpeg"],
      product_count: 1,
      product_check: true
    }
    cartList.push(proInfo)
    app.$db.set("cartList", cartList)
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '温馨提示',
      content: '预订成功，可在购物车页面查看和修改。'
    })
  },
  orderThis() {
    wx.showToast({
      title: '预订成功!',
      icon: "success"
    })
  },
  getHomeStay() {
    const {
      limit,
      page
    } = this.data;
    wx.cloud.callFunction({
      name: "GetHomeStay",
      data: {
        limit: limit,
        page: page
      }
    }).then(res => {
      this.setData({
        homestay: this.data.homestay.concat(res.result.data)
      });
      console.log(this.data.ticketList)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})