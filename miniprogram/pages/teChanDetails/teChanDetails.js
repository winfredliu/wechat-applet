// pages/teChanDetails/teChanDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teChanId:"",
    details:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    this.setData({
      teChanId:options.id
    })
    this.getTechanDetail();
  },

   //获取特产详情
   getTechanDetail(){
    wx.cloud.callFunction({
      name:"GetTechanById",
      data:{
       teChanId:this.data.teChanId
      }
    }).then(res=>{
      //console.log(res);
      this.setData({
        details:res.result.data[0]
      })
    })
  },
  
  //点击图片放大
  previewImg: function (e) {
    wx.previewImage({
       current: e.currentTarget.dataset.imgurl, //当前图片地址
       urls: this.data.details.dpics, //所有要预览的图片的地址集合 数组形式
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