const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardCur: 0,
    swiperList: [],
    iconList: [{
      id:0,
      icon: 'cardboardfill',
      color: 'red',
      name: '民宿'
    }, {
      id:1,
      icon: 'recordfill',
      color: 'orange',
      name: '景点'
    }, {
      id:2,
      icon: 'explorefill',
      color: 'yellow',
      name: '攻略'
    }, {
      id:3,
      icon: 'camerafill',
      color: 'olive',
      name: '导游'
    }, {
      id:4,
      icon: 'discover',
      color: 'cyan',
      name: '导航'
    }, {
      id:5,
      icon: 'clothesfill',
      color: 'blue',
      name: '特产'
    },{
      id:6,
      icon: 'card',
      color: 'purple',
      name: '门票'
    },{
      id:7,
      icon: 'noticefill',
      color: 'green',
      name: '美食'
    }],
    gridCol:4,
    jindianList:[],
    page:0,
    limit:4
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwiperList();
    this.getJinDianList();
  },

  //请求轮播图
  getSwiperList(){
    wx.cloud.callFunction({
      name:"GetSwiperList" 
    }).then(res=>{
      this.setData({
        swiperList:res.result.data
      })
    })
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
      //console.log(res);
      wx.hideLoading();
      this.setData({jindianList:res.result.data});
    })
  },

  //导航栏跳转
  goNav(e){
    console.log(123456)
    //console.log(e.target.dataset.idx);
    switch(e.currentTarget.dataset.idx){
      case 0:app.$comm.navigateTo('/pages/homestay/homestay'); break;
      case 1:app.$comm.navigateTo('/pages/JinDianList/JinDianlist'); break;
      case 2:app.$comm.navigateTo('/pages/gongLueList/gongLueList');break;
      case 3:app.$comm.navigateTo('/pages/guideList/guideList');break;
      case 4:this.goToAddress();break;
      case 5:app.$comm.navigateTo( '/pages/techan/techan');break;
      case 6:app.$comm.navigateTo('/pages/ticket/ticket');break;
      case 7:app.$comm.navigateTo('/pages/foodlist/foodlist');break;
    }
  },
  //地址
  goToAddress() {
    wx.openLocation({
      latitude: 30.55747, //维度
      longitude: 103.99797, //经度
      name: "四川大学", //目的地定位名称
      scale: 15, //缩放比例
      address: "四川大学江安校区" //导航详细地址
    })
  },
  getdetail(e){
    wx.navigateTo({
      url: "/pages/JinDianDetails/JinDianDetails?id="+e.currentTarget.dataset.id
    })
  },
  //跳转列表页
  goList(){
    wx.navigateTo({url: '/pages/JinDianList/JinDianlist'})
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