Page({

  /**
   * 页面的初始数据
   */
  data: {
    JinDianId: 0,
    details: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("景点id：",options.id)
    this.setData({
      JinDianId: options.id
    })
    this.getJinDianDetail();
  },
  getgonglue(e) {
    wx.navigateTo({
      url: '/pages/gongLueList/gongLueList',
    })
  },
  getticket() {
    wx.navigateTo({
      url: '/pages/ticket/ticket',
    })
  },
  //获取景点详情
  getJinDianDetail() {
    wx.cloud.callFunction({
      name: "GetJinDianDetail",
      data: {
        JinDianId: this.data.JinDianId
      }
    }).then(res => {
      console.log(res);
      this.setData({
        details: res.result.data[0]
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})