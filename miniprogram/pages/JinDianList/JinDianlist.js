const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
      jindianList:[],
      page:0,
      limit:4,
      end:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getJinDianList();
  },

  //请求景点列表
  async getJinDianList(){
    const {limit,page}=this.data;
    await app.showLoading();
    wx.cloud.callFunction({
      name:'GetJinDianList', 
      data:{
        limit:limit,
        page:page
      }
    }).then(res=>{
      wx.hideLoading();
      if(res.result.data.length<limit) this.setData({end:true});
      this.setData({
        jindianList:this.data.jindianList.concat(res.result.data)});
    })
  },

  //去往详情页
  toDetail(e){
    //console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: "/pages/JinDianDetails/JinDianDetails?id="+e.currentTarget.dataset.id
    })
  },

  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({page:0,jindianList:[]});
    this.getJinDianList();
    wx.stopPullDownRefresh({
      success:function(){
        wx.hideLoading();
      }
    })
  },

  //上拉触底
  onReachBottom: function () {
    this.setData({
      page:++this.data.page
    })
    this.getJinDianList();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})