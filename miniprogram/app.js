// app.js
import * as Comm from './util/comm.js';
import * as Api from './util/api.js';
import * as Db from './util/db.js';
import Validate from './util/validate.js';
import lUtil from './util/loginUtil.js';
import * as Config from './util/config';

let userInfo = Db.get("userInfo") || {}
let isLogin = JSON.stringify(userInfo) != "{}"
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-6gyj8u4g9601f3a9',
        traceUser: true,
      })
    }
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        this.globalData.Customwidth = e.windowWidth
      }
    })
    this.globalData.userInfo=userInfo
    this.globalData.isLogin=isLogin

    //判断登录过期
    if (!lUtil.checkExpiresTime()) {
      setTimeout(() => {
        this.globalData.userInfo = {}
        this.globalData.isLogin = false
        this.$db.del("userInfo")
      }, 1500)
      wx.showModal({
        title: '提示',
        content: '登录超时，请重新授权登录！',
        showCancel: false,
        confirmText: '确定',
        success: () => {
          this.$comm.reLaunch("/pages/user/user")
        }
      });
    }

  },

  

  
  //显示loading
  showLoading(){
    return new Promise((resolve,reject)=>{
      wx.showLoading({
        title: '加载中',
        mask:true,
        success(res) {resolve(res)},
        fail(err) {reject(err)}
      })
    })
  },
  globalData:{},
  $comm: Comm,
  $api: Api,
  $db: Db,
  $validate: Validate,
  $lUtil: lUtil,
  $config:Config
});
