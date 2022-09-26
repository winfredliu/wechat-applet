let app = getApp()
Page({
  data: {
    height: 64,
    top: 0,
    scrollH: 0,
    opcity: 0,

    tabs: [{
      name: "待发货",
      iconName: "icon-fahuo",
      state: 1
    }, {
      name: "待收货",
      iconName: "icon-daishouhuo",
      state: 2
    }, {
      name: "待退款",
      iconName: "icon-ccgl-tuihuosunyi-8",
      state: 3,
    }],
    isLogin: app.globalData.isLogin,
    userInfo: app.globalData.userInfo
  },
  onLoad: function () {
    this.initUserInfo()
    let obj = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.statusBarHeight + obj.height + (obj.top - res.statusBarHeight) * 2,
          top: obj.top,
          scrollH: res.windowWidth * 0.6
        })
      }
    })
  },
  initUserInfo() {
    let {
      isLogin,
      userInfo
    } = app.globalData
    this.setData({
      userInfo: userInfo,
      isLogin: isLogin
    })
  },
  userLogin() {
    wx[wx.getUserProfile ? 'getUserProfile' : 'getUserInfo']({
      desc: '用于完善会员资料',
      success: (e) => {
        if (e.userInfo) {
          let userInfo = e.userInfo
          app.$api.userLogin({
            userInfo: {
              nickName: userInfo.nickName,
              gender: userInfo.gender,
              avatarUrl: userInfo.avatarUrl
            }
          }).then(res => {
            if (res.code) {
              this.setData({
                userInfo: res.data,
                isLogin: true
              })
              app.$db.set('userInfo', res.data)
              app.$lUtil.setExpiresTime()
              app.globalData.userInfo = res.data
              app.globalData.isLogin = true
              app.$comm.successToShow("登录成功", () => {
                app.$comm.switchTabTo("/pages/index/index")
              })
            }
          })
        } else {
          errorShowModal()
        }
      },
      fail: (err) => {
        errorShowModal()
      }
    })

    function errorShowModal() {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {}
        }
      });
    }
  },
  toDepositHandle() {
    app.$comm.navigateTo("/pages/deposit/deposit")
  },
  toCollectionHandle() {
    app.$comm.navigateTo("/pages/my-collection/my-collection")
  },
  toAddressHandle() {
    app.$comm.navigateTo("/pages/address/address?type=show")
  },
  toFeedbackHandle() {
    app.$comm.navigateTo("/pages/feedback/feedback")
  },
  logout() {
    wx.showModal({
      title: '提示',
      content: '是否确定退出登录？',
      success: (res) => {
        if (res.confirm) {
          app.$db.del("userInfo")
          app.globalData.userInfo = {}
          app.globalData.isLogin = false
          this.setData({
            isLogin: app.globalData.isLogin,
            userInfo: app.globalData.userInfo
          })
          app.$comm.successToShow("退出登录成功", () => {
            app.$comm.reLaunch("/pages/index/index")
          })
        }
      }
    })
  },
  toOrderType(e) {
    let state = e.currentTarget.dataset.state
    app.$comm.navigateTo(`/pages/my-order/my-order?state=${state}`)
  },
  toAdminPageHandle() {
    app.$comm.navigateTo('/pages/admin/login/login')
    // app.$comm.navigateTo(`/pages/admin/menu/menu`)
  },
  onPageScroll(e) {
    let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
    let opcity = scroll / this.data.scrollH;
    if (this.data.opcity >= 1 && opcity >= 1) {
      return;
    }
    this.setData({
      opcity: opcity
    })
  }
})