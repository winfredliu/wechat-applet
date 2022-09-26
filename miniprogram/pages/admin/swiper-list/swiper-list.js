let app = getApp()
Page({
  data: {
    swiperList: []
  },
  onShow() {
    this.getSwiper()
  },
  getSwiper() {
    app.$api.getSwiper().then(res => {
      if (res.code) {
        this.setData({
          swiperList: res.data
        })
      }
    })
  },
  delSWiperHandle(e) {
    let {
      info: {
        _id,
        swiper_img
      },
      index
    } = e.currentTarget.dataset
    let {
      swiperList
    } = this.data
    wx.showModal({
      title: '提示',
      content: '是否确定删除该数据？',
      success: (res) => {
        if (res.confirm) {
          app.$api.delSwiperAdmin({
            _id,
            swiper_img
          }).then(res => {
            if (res.code) {
              app.$comm.successToShow(res.msg, () => {
                swiperList.splice(index, 1)
                this.setData({
                  swiperList
                })
              })
            }
          })
        }
      }
    })
  },
  toSwiperHandle(e) {
    let {
      info
    } = e.currentTarget.dataset
    info = JSON.stringify(info)
    app.$comm.navigateTo(`/pages/admin/swiper-update/swiper-update?info=${info}&pageType=update`)
  },
  addSwiperHandle() {
    app.$comm.navigateTo(`/pages/admin/swiper-update/swiper-update`)
  }
})