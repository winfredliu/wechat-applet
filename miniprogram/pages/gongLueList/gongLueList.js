const app=getApp();

Page({
 data: {
  list:[],
  limit:100000000,
  page:0,
  end:false,
  jindianlist:[],
  page:0,
  end:false,
  TabCur:"长峪城村"
 },

 onLoad() {
  this.getList();
  this.getjindianlist();
 },

 //请求所有攻略
 async getList(){
   let {limit,page}=this.data;
   await app.showLoading();
   wx.cloud.callFunction({
     name:"GetGongLueList",
     data:{limit,page}
   }).then(res=>{
     //console.log(res);
     wx.hideLoading();
     if(res.result.data.length<limit) this.setData({end:true});
     this.setData({list:this.data.list.concat(res.result.data)});
     
   })
 },
//请求景点名字
 async getjindianlist(){
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
      jindianlist:res.result.data});
  })
},
tabSelect(e) {
  this.setData({
    TabCur: e.currentTarget.dataset.name,
  })
 
},
getaddgonglue(){
  wx.navigateTo({
    url: '/pages/addgonglue/addgonglue',
  })
},

 //下拉刷新
 onPullDownRefresh: function () {
  this.setData({page:0,list:[]});
  this.getList();
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
  this.getList();
},

//跳转到详情页
 goDetails(e){
   //console.log(e.currentTarget.dataset.id);
   wx.navigateTo({
    url: "/pages/gongLueDetails/gongLueDetails?id="+e.currentTarget.dataset.id
  })
 },
 getindex(){
  wx.navigateTo({
    url: '/pages/index/index',
  })
}
})