// pages/index/index.js
var that

const db = wx.cloud.database()
const _ = db.command
const index = db.collection('foodlist')
const well = db.collection('FoodWell')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:''
  },

  search: function (value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([{
          text: '搜索结果',
          value: 1
        }, {
          text: '搜索结果2',
          value: 2
        }])
      }, 200)
    })
  },

  selectResult: function (e) {
    console.log('select result', e.detail)
  },

  searchClick:function(e){
    console.log(e)
  },

  // 餐厅类型
  hot:function(){
    wx.navigateTo({
      url: '../foodhot/foodhot',
    })
  },

  new:function(){
    wx.navigateTo({
      url: '../new/new',
    })
  },

  chinese:function(){
    wx.navigateTo({
      url: '../dishes/dishes',
    })
  },

  west:function(){
    wx.navigateTo({
      url: '../snack/snack',
    })
  },

  self:function(){
    wx.navigateTo({
      url: '../foodself/foodself',
    })
  },

  FoodCollect:function(){
    wx.navigateTo({
      url: '../FoodCollect/FoodCollect',
    })
  },

  comment:function(){
    wx.navigateTo({
      url: '../comment/comment',
    })
  },


  myfoodorder:function(){
    wx.navigateTo({
      url: '../my-foodorder/my-foodorder',
    })
  },

  // 餐厅类型

  nav_to:function(e){
    console.log(e)
     const _id = e.currentTarget.dataset.id
     wx.navigateTo({
       url: '../detail-template/detail-template?index=index&id=' + _id,
     })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.setData({
      search: this.search.bind(this)
    })
    index.get().then(res =>{
      that.setData({
        item:res.data
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
    index.get().then(res =>{
      that.setData({
        item:res.data
      })
    })
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