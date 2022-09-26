let app = getApp()
Page({
  data: {
    addressId: '',
    isUpdate: false,
    addressData: {
      address_name: '',
      address_tel: '',
      address_province: '',
      address_city: '',
      address_district: '',
      address_info: '',
      address_default: ''
    }
  },
  onLoad(options) {
    let {
      info
    } = options
    if (info) {
      info = JSON.parse(info)
      let {
        _id,
        OPENID,
        ...addressData
      } = info
      this.setData({
        addressId: _id,
        isUpdate: true,
        addressData: addressData
      })
    }
  },
  wechatAddress() {
    const modal = {
      title: '授权',
      content: '需要您授权使用获取收货地址',
      confirmText: '设置'
    }
    app.$comm.setScope('scope.address', modal).then((res) => {
      this.weChatAdd()
    })
  },
  weChatAdd() {
    wx.chooseAddress({
      success: res => {
        const {
          userName,
          telNumber,
          provinceName,
          cityName,
          countyName,
          detailInfo
        } = res
        const addressData = {
          address_name: userName,
          address_tel: telNumber,
          address_province: provinceName,
          address_city: cityName,
          address_district: countyName,
          address_info: detailInfo,
          address_default: false
        }
        this.setData({
          addressData
        })
      }
    })
  },
  addressPickerChange(e) {
    let {
      value
    } = e.detail
    let [address_province, address_city, address_district] = value
    this.setData({
      "addressData.address_province": address_province,
      "addressData.address_city": address_city,
      "addressData.address_district": address_district,
    })
  },
  saveAddressHandle(e) {
    let {
      address_default,
      address_info,
      address_name,
      address_tel
    } = e.detail.value
    let addressData = this.data.addressData
    Object.assign(addressData, {
      address_default,
      address_info,
      address_name,
      address_tel
    })
    this.setData({
      addressData
    })
    let valLoginRes = app.$validate.validate(addressData, [{
      name: 'address_name',
      type: 'required',
      errmsg: '收货人不能为空'
    }, {
      name: 'address_tel',
      required: 'required',
      errmsg: '请输入的手机号码'
    }, {
      name: 'address_province',
      type: "required",
      errmsg: '请选择所在城市'
    }, {
      name: 'address_info',
      type: "required",
      errmsg: '请输入详细收货地址'
    }])
    if (!valLoginRes.isOk) {
      app.$comm.errorToShow(valLoginRes.errmsg)
      return false
    }
    if (this.data.isUpdate) {
      this.updateAddress()
    } else {
      this.addAddress()
    }
  },
  addAddress() {
    let addressData = this.data.addressData
    app.$api.addUserAddress(addressData).then(res => {
      if (res.code) {
        app.$comm.successToShow("添加成功", () => {
          app.$comm.navigateBack()
        })
      }
    })
  },
  updateAddress() {
    let {
      addressData,
      addressId
    } = this.data
    app.$api.updateUserAddress({
      addressId,
      ...addressData
    }).then(res => {
      if (res.code) {
        app.$comm.successToShow("修改成功", () => {
          app.$comm.navigateBack()
        })
      }
    })
  }
})