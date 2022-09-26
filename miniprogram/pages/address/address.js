let app = getApp()
Page({
  data: {
    addressList: [],
    actions: [{
      name: '删除',
      color: '#fff',
      width: 54,
      background: '#F82400'
    }, {
      name: '修改',
      color: '#fff',
      width: 54,
      background: '#ff7900'
    }, {
      name: '默认',
      width: 54,
      color: '#fff',
      background: '#FFC600'
    }],
    type: "choose"
  },
  onLoad(options) {
    let {
      type
    } = options
    if (type) {
      this.setData({
        type
      })
    }
  },
  onShow: function () {
    this.loadUserAddress()
  },
  loadUserAddress() {
    app.$api.getUserAddress().then(res => {
      if (res.code) {
        this.setData({
          addressList: res.data
        })
      }
    })
  },
  toAddAddress() {
    app.$comm.navigateTo("/pages/edit-address/edit-address")
  },
  addressClickHandle(e) {
    let {
      index,
      item
    } = e.detail;

    switch (index) {
      case 0:
        this.delAddress(item)
        break;
      case 1:
        this.toEditAddress(item)
        break;
      case 2:
        this.setAddressDefault(item)
        break;
    }
  },
  toEditAddress(info) {
    info = JSON.stringify(info)
    app.$comm.navigateTo(`/pages/edit-address/edit-address?info=${info}`)
  },
  delAddress(info) {
    let {
      addressList
    } = this.data
    wx.showModal({
      title: '删除提示',
      content: '你将删除这个收货地址',
      success: (res) => {
        if (res.confirm) {
          app.$api.delUserAddress({
            addressId: info._id
          }).then(res => {
            if (res.code) {
              app.$comm.successToShow("删除地址成功", () => {
                let addressIndex = addressList.findIndex(addressItem => addressItem._id == info._id)
                addressList.splice(addressIndex, 1)
                this.setData({
                  addressList: addressList
                })
              })
            }
          })
        }
      }
    });
  },
  setAddressDefault(info) {
    if (info.address_default) {
      return
    }
    app.$api.updateAddressDefault({
      addressId: info._id
    }).then(res => {
      if (res.code) {
        app.$comm.successToShow("设置默认成功", () => {
          addressList.forEach(addressItem => addressItem.address_default = false)
          let addressInfo = addressList.find(addressItem => addressItem._id == info._id)
          addressInfo.address_default = true
          this.setData({
            addressList: addressList
          })
        })
      }
    })
  },
  chooseAddress(e) {
    let {
      type
    } = this.data
    let {
      item
    } = e.currentTarget.dataset
    if (type == 'choose') {
      let eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('choose', {
        data: item
      });
      app.$comm.navigateBack()
    }
  }
})