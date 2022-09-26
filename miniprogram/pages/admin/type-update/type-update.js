let app = getApp()
Page({
  data: {
    pageType: 'add',

    option: {
      product_type_name: '',
      product_type_icon: ''
    }
  },
  onLoad(options) {
    let {
      info
    } = options
    if (info) {
      let {
        option
      } = this.data
      let typeInfo = JSON.parse(info)
      Object.assign(option, typeInfo)
      this.setData({
        option: option,
        pageType: 'update'
      })
    }
  },
  chooseImageHandle(e) {
    this.setData({
      "option.product_type_icon": e.detail.imgArr[0] || ''
    })
  },
  changeNameHandle(e) {
    let val = e.detail.value
    this.setData({
      "option.product_type_name": val
    })
  },
  typeHandle() {
    let {
      option,
      pageType
    } = this.data
    let valLoginRes = app.$validate.validate(option, [{
      name: 'product_type_icon',
      type: 'required',
      errmsg: '图片不能为空'
    }, {
      name: 'product_type_name',
      type: 'required',
      errmsg: '名称不能为空'
    }])
    if (!valLoginRes.isOk) {
      app.$comm.errorToShow(valLoginRes.errmsg)
      return false
    }
    if (pageType == 'update') {
      this.updateType(option)
    } else if (pageType == 'add') {
      this.addType(option)
    }
  },
  addType(data) {
    app.$api.addTypeAdmin({
      ...data
    }).then(res => {
      if (res.code) {
        app.$comm.successToShow(res.msg, () => {
          app.$comm.navigateBack()
        })
      }
    })
  },
  updateType(data) {
    app.$api.updateTypeAdmin({
      ...data
    }).then(res => {
      if (res.code) {
        app.$comm.successToShow(res.msg, () => {
          app.$comm.navigateBack()
        })
      }
    })
  }
})