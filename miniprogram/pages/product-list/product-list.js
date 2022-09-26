let app = getApp()
Page({
  data: {
    searchKey: "",
    width: 200,
    height: 64,
    inputTop: 0,
    arrowTop: 0,
    dropScreenH: 0,

    tabIndex: 0,
    isList: false,
    selectedName: "综合",
    selectH: 0,
    dropdownList: [{
      name: "综合",
      selected: true
    }, {
      name: "价格升序",
      selected: false
    }, {
      name: "价格降序",
      selected: false
    }],
    productList: [],
    option: {
      page: 1,
      limit: 6,
      loadend: false,
      loading: false
    }
  },
  onLoad: function (option) {
    let obj = wx.getMenuButtonBoundingClientRect();
    this.setData({
      searchKey: option.searchKey || "",
      product_type_name: option.product_type_name || ''
    }, () => {
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            height: res.statusBarHeight + obj.height + (obj.top - res.statusBarHeight) * 2,
            inputTop: obj.top + 1,
            arrowTop: obj.top,
            width: obj.left,
            dropScreenH: this.data.height * 750 / res.windowWidth + 90,
          })
        }
      })
    });
    this.loadLikeProductList()
  },
  screen: function (e) {
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      this.showDropdownList();
    } else if (index == 1) {
      if (index != this.data.tabIndex) {
        this.setData({
          tabIndex: 1
        })
        this.inintload()
      }
    } else if (index == 2) {
      this.setData({
        isList: !this.data.isList
      })
    }
  },
  back: function () {
    wx.navigateBack()
  },
  showDropdownList: function () {
    this.setData({
      selectH: 246
    })
  },
  hideDropdownList: function () {
    this.setData({
      selectH: 0
    })
  },
  dropdownItem: function (e) {
    let index = e.currentTarget.dataset.index;
    let arr = this.data.dropdownList;
    let tabIndex = this.data.tabIndex
    if (tabIndex == 0 && arr[index].selected) {
      this.hideDropdownList()
      return
    }
    for (let i = 0; i < arr.length; i++) {
      if (i === index) {
        arr[i].selected = true;
      } else {
        arr[i].selected = false;
      }
    }
    this.setData({
      tabIndex: 0,
      dropdownList: arr,
      selectedName: index == 0 ? '综合' : '价格'
    })
    this.hideDropdownList()
    this.inintload()
  },
  inintload() {
    this.setData({
      productList: [],
      option: {
        page: 1,
        limit: 6,
        loadend: false,
        loading: false
      }
    })
    this.loadLikeProductList()
  },
  loadLikeProductList() {
    let {
      page,
      limit,
      loadend
    } = this.data.option
    if (loadend) {
      return
    }
    this.setData({
      "option.loading": true
    })
    let {
      tabIndex,
      searchKey,
      product_type_name
    } = this.data
    let option = {
      page: page,
      limit: limit,
      searchKey: searchKey || ''
    }
    let condition = {
      priceLike: '',
      salesLike: false,
      product_type_name: product_type_name
    }
    if (tabIndex == 0) {
      let downIndex = this.data.dropdownList.findIndex(item => item.selected)
      if (downIndex == 0) {} else if (downIndex == 1) {
        condition.priceLike = "asc"
      } else if (downIndex == 2) {
        condition.priceLike = "desc"
      }
    } else if (tabIndex == 1) {
      condition.salesLike = true
    }
    this.setData({
      "option.loading": true
    })
    app.$api.getLikeProductList(Object.assign(option, condition)).then(res => {
      let {
        productList
      } = this.data
      if (res.code) {
        let proList = res.data
        if (productList.length > 0) {
          this.setData({
            productList: productList.concat(proList)
          })
        } else {
          this.setData({
            productList: proList
          })
        }

        if (proList.length < limit) {
          this.setData({
            "option.loadend": true
          })
        }

        this.setData({
          "option.page": ++page,
          "option.loading": false
        })
      }
    })

  },
  onReachBottom() {
    this.loadLikeProductList()
  },
  toSeachHandle() {
    app.$comm.navigateBack()
  }
})