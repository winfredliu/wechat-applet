// pages/guideList/guideList.js
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    guideList:[],
    limit:4,
    page:0,
    end:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGuideList();
  },

  //请求导游列表
  async getGuideList(){
    let {limit,page}=this.data;
    await app.showLoading();
    wx.cloud.callFunction({
      name:"GetGuideList",
      data:{limit,page}
    }).then(res=>{
      //console.log(res);
      wx.hideLoading();
      if(res.result.data.length<limit) this.setData({end:true});
      this.setData({guideList:this.data.guideList.concat(res.result.data)});
    })
  },

   //下拉刷新
  onPullDownRefresh: function () {
    this.setData({page:0,guideList:[]});
    this.getGuideList();
    wx.stopPullDownRefresh({
      success:function(){
        wx.hideLoading();
      }
    })
  },

  //上拉触底
  onReachBottom: function () {
    //console.log("上拉")
    this.setData({
     page:++this.data.page
    })
    this.getGuideList();
  },
  //模态框显示
  showModal(e) {
    wx.showModal({
      title: '确定预约吗？',
      // content: '这是一个模态弹窗',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          let cartList = app.$db.get("cartList") || []
          let proInfo = {}
      
          proInfo = {
            productId: "6d85a2b962bd19ac0daf59d36d3b5a63",
            product_name: "导游",
            product_price: 50,
            product_img_list: ["cloud://cloud1-6gyj8u4g9601f3a9.636c-cloud1-6gyj8u4g9601f3a9-1312002734/product/1656560042506.jpeg"],
            product_count: 1,
            product_check: true
          }
          cartList.push(proInfo)
          app.$db.set("cartList", cartList)
          wx.showModal({
            cancelColor: 'cancelColor',
            title: '温馨提示',
            content: '预约成功，可在购物车页面查看和修改。'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})