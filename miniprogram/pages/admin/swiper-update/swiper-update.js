let app = getApp()
Page({
  data: {
    option: {
      swiper_img: '',
      swiper_weight: 0,
      swiper_page_type: "nothing",
      swiper_option: ""
    },
    typePickerList: [{
        key: "nothing",
        value: "无跳转",
        list: [{
          key: "",
          value: "无目标"
        }]
      },
      {
        key: "product-detail",
        value: "跳转商品",
        list: []
      },
      {
        key: "classify",
        value: "跳转商品分类",
        list: []
      }
    ],
    typeIndex: 0,
    optionIndex: 0,

    pageType: 'add'
  },
  onLoad(options) {
    let {
      info
    } = options
    if (info) {
      let swoperInfo = JSON.parse(info)
      this.setData({
        option: swoperInfo,
        pageType: 'update'
      })
    }
    this.loadSwiperLinkOption()
  },
  loadSwiperLinkOption() {
    app.$api.getSwiperLinkOption().then(res => {
      if (res.code) {
        this.setData({
          "typePickerList[1].list": res.data.productOption || [],
          "typePickerList[2].list": res.data.typeOption || []
        })
        if (this.data.pageType == 'update') {
          let typeIndex = this.data.typePickerList.findIndex((typeItem => typeItem.key == this.data.option.swiper_page_type))
          let optionIndex = this.data.typePickerList[typeIndex].list.findIndex(optionItem => optionItem.key == this.data.option.swiper_option)
          this.setData({
            typeIndex,
            optionIndex
          })

        }
      }
    })
  },
  chooseImageHandle(e) {
    this.setData({
      "option.swiper_img": e.detail.imgArr[0] || ''
    })
  },
  changeWeightHandle(e) {
    this.setData({
      "option.swiper_weight": e.detail.value || 0
    })
  },
  typePickerChange(e) {
    let val = e.detail.value
    this.setData({
      typeIndex: val,
      optionIndex: 0
    })
  },
  optionPickerChange(e) {
    let val = e.detail.value
    this.setData({
      optionIndex: val
    })
  },
  swipwerHandle() {
    let {
      option,
      typePickerList,
      typeIndex,
      optionIndex
    } = this.data
    option.swiper_page_type = typePickerList[typeIndex].key
    option.swiper_option = typePickerList[typeIndex].list[optionIndex].key
    let valLoginRes = app.$validate.validate(option, [{
      name: 'swiper_img',
      type: 'required',
      errmsg: '图片不能为空'
    }])
    if (!valLoginRes.isOk) {
      app.$comm.errorToShow(valLoginRes.errmsg)
      return false
    }
    if (this.data.pageType == 'update') {
      app.$api.updateSwiperAdmin({
        ...option
      }).then(res => {
        if (res.code) {
          app.$comm.successToShow("修改成功", () => {
            app.$comm.navigateBack()
          })
        }
      })
    } else {
      app.$api.addSwiperAdmin({
        ...option
      }).then(res => {
        if (res.code) {
          app.$comm.successToShow("添加成功", () => {
            app.$comm.navigateBack()
          })
        }
      })
    }
  }
})