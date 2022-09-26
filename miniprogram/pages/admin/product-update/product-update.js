let app = getApp()
Page({
  data: {
    classifyList: [],
    classifyIndex: 0,

    product_img_list: [],
    pageType: 'add',

    initData: {
      product_name: "",
      product_type: "",
      product_price: "",
      product_sales: 0,
      product_stock: "",
      product_img_list: [],
      product_time: "",
      _id: ""
    }
  },
  onLoad(options) {
    let {
      info,
      pageType
    } = options
    if (~['update', 'show'].indexOf(pageType)) {
      let {
        initData
      } = this.data
      let productInfo = JSON.parse(info)
      Object.assign(initData, productInfo)
      this.setData({
        initData: initData,
        pageType: pageType
      })
    }
    this.loadClassifyAdmin()
  },
  loadClassifyAdmin() {
    app.$api.getClassifyAdmin().then(res => {
      if (res.code) {
        this.setData({
          classifyList: res.data
        })
      }
    })
  },
  classifyPickerChange(e) {
    this.setData({
      classifyIndex: e.detail.value
    })
  },
  chooseImageHandle(e) {
    this.setData({
      product_img_list: e.detail.imgArr || []
    })
  },
  formSubmit(e) {
    let {
      pageType,
      product_img_list
    } = this.data
    let option = e.detail.value
    option.product_img_list = product_img_list
    option = app.$comm.optionFormat(option, [{
      name: "product_price|product_sales|product_stock",
      rule: "num"
    }])
    if (pageType == 'update') {

    }
    console.log(option)
    let valLoginRes = app.$validate.validate(option, [{
      name: 'product_name',
      type: 'required',
      errmsg: '商品名称不能为空'
    }, {
      name: 'product_type',
      type: 'required',
      errmsg: '商品分类不能为空'
    }, {
      name: 'product_price',
      type: 'integer',
      errmsg: '商品价格不合法'
    }, {
      name: 'product_sales',
      type: 'integer',
      errmsg: '商品销量不合法'
    }, {
      name: 'product_stock',
      type: 'integer',
      errmsg: '商品库存不合法'
    }, {
      name: 'product_img_list',
      type: 'arrlength',
      errmsg: '商品图片不合法'
    }])
    if (!valLoginRes.isOk) {
      app.$comm.errorToShow(valLoginRes.errmsg)
      return false
    }

    if (pageType == 'add') {
      this.addProduct(option)
    } else if (pageType == 'update') {
      this.updateProduct(Object.assign(option, {
        _id: this.data.initData._id
      }))
    }
  },
  addProduct(data) {
    app.$api.addProductAdmin(data).then(res => {
      if (res.code) {
        app.$comm.successToShow("添加成功", () => {
          app.$comm.navigateBack()
        })
      }
    })
  },
  updateProduct(data) {
    app.$api.updateProductAdmin(data).then(res => {
      if (res.code) {
        app.$comm.successToShow("修改成功", () => {
          app.$comm.navigateBack()
        })
      }
    })
  },
  pageBack(){
    app.$comm.navigateBack()
  }
})