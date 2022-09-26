// pages/addgonglue/addgonglue.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      writer:"",
      content:"",
      cname:"",
      name:"",
      pic:""
  },
  getwriter(e){
     this.data.writer=e.detail.value
  },
  getcname(e){
    this.data.cname=e.detail.value
  },
  getname(e){
    this.data.name=e.detail.value
  },
  getcontent(e){
    this.data.content=e.detail.value
  },
  addgonglue(){
    if(this.data.cname!=""&&this.data.writer!=""&&this.data.name!=""&&this.data.pic!=""&&this.data.content!=""){
      wx.cloud.callFunction({
        name:'Addgonglue',
        data:{
          writer:this.data.writer,
          cname:this.data.cname,
          name:this.data.name,
          content:this.data.content,
          pic:this.data.pic,
        }
      }).then(res=>{
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1500//持续的时间
        }),
        setTimeout(function () {
          //要延时执行的代码
          wx.navigateTo({
            url: '/pages/gongLueList/gongLueList',
          })
         }, 1500) //延迟时间 这里是1秒
      })
    }
    else{
      wx.showToast({
        title: '有数据未填',
        icon: 'error',
        duration: 1500//持续的时间
      })
    }
  },
  // 点击上传图片 触发函数
changeBigImg(){
  let that = this;
  wx.chooseMedia({
    count: 1,
    mediaType: ['image','video'],
    sourceType: ['album', 'camera'],
    success:res=> {
      // console.log("成功",res);
      that.uploadImage(res.tempFiles[0].tempFilePath);
    }
  })
},
// 上传到云开发的存储中
uploadImage(fileURL) {
  wx.cloud.uploadFile({
    cloudPath:new Date().getTime()+'.png', // 上传至云端的路径
    filePath: fileURL, // 小程序临时文件路径
    success: res => {
      //获取图片的http路径
      this.addImagePath(res.fileID)  // res.fileID 是上传图片的 fileID
    },
    fail: console.error
  })
},

 // 获取图片上传后的https的url路径地址  参数是上传图片的 fileId
  addImagePath(fileId) {
    // console.log(fileId)
    wx.cloud.getTempFileURL({
      fileList: [fileId],
      success: res => {
        this.data.pic=res.fileList[0].tempFileURL;
        // console.log("获取url地址：",this.data.pic);
      },
      fail: console.error
    })
  },
getgongluelist(){
  wx.navigateTo({
    url: '/pages/gongLueList/gongLueList',
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})