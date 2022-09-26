const app = getApp()
let aname = ""
let password = ""
var keyword = ''

Page({
  data: {
    inputType: "password",
    showEye: true
  },
  onLoad() {},
  //管理员登陆相关
  getName: function (e) {
    aname = e.detail.value
  },
  showE() {
    if (this.data.showEye == true) {
      this.setData({
        inputType: 'text'
      })
    }
    if (this.data.showEye == false) {
      this.setData({
        inputType: 'password'
      })
    }
    this.setData({
      showEye: !this.data.showEye
    })
  },

  getPassWord: function (e) {
    password = e.detail.value
  },
  formSubmit: function () {
    if (aname == '' || aname == undefined) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none'
      })
      return;
    }
    if (password == '' || password == undefined) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }
    if (aname == "admin" && password == '123456') {
      app.$comm.navigateTo(`/pages/admin/menu/menu`)
    } else {
      wx.showToast({
        title: '账号或密码错误',
        icon: 'none'
      })
      return;
    }
  }
})