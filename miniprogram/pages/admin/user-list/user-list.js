const app = getApp();
Page({
  data: {
    tableColumns: [{
      title: "姓名",
      key: "nickName",
    }, {
      title: "头像",
      key: "avatarUrl",
      type: 'img',
      imgWidth: '50px',
      imgHeight: '50px'
    }, {
      title: "性别",
      key: "gender",
      render: function (val) {
        return app.$comm.isgender(val)
      }
    }, {
      title: "余额",
      key: "money"
    }, {
      title: "权限",
      key: "isAdmin",
      render: function (val) {
        return val ? '管理员' : '用户'
      }
    }],
    dataList: [],
    page: 1,
    limit: 10,
    isLoad: true,


    showModal: false,
    userMoney: '',
    userId: ''
  },
  onLoad() {
    this.initComponent();
  },
  initComponent() {
    this.getList();
  },
  getList() {
    const {
      page,
      limit,
      dataList,
      isLoad
    } = this.data;
    if (!isLoad) {
      return;
    }
    app.$api.getUserlist({
      page: page,
      limit: limit
    }).then(res => {
      let result = res.data
      if (res.code) {
        this.setData({
          dataList: dataList.concat(result)
        })
        if (result.length < limit) {
          this.setData({
            isLoad: false
          })
        }
        this.setData({
          page: page + 1
        })
      }
    })
  },
  handleClickItem(e) {
    const {
      index
    } = e.detail.value;
    let {
      dataList
    } = this.data
    let dataItem = dataList[index]
    let menuList = ['设为管理员', '修改余额']
    if (dataItem.isAdmin) {
      menuList[0] = '撤销管理员'
    }
    wx.showActionSheet({
      itemList: menuList,
      success: (res) => {
        let tapIndex = res.tapIndex
        if (tapIndex == 0) {
          this.updateAdmin(index)
        } else if (tapIndex == 1) {
          this.showModalHandle(index)
        }
      }
    })
  },
  updateAdmin(index) {
    let {
      dataList
    } = this.data
    let dataItem = dataList[index]
    if (dataItem.isAdmin) {
      app.$api.cancelAdmin({
        userId: dataItem._id
      }).then(res => {
        if (res.code) {
          dataItem.isAdmin = false
          app.$comm.successToShow(res.msg)
          this.setData({
            dataList: dataList
          })
        }
      })
    } else {
      app.$api.setAdmin({
        userId: dataItem._id
      }).then(res => {
        if (res.code) {
          dataItem.isAdmin = true
          app.$comm.successToShow(res.msg)
          this.setData({
            dataList: dataList
          })
        }
      })
    }
  },
  showModalHandle(index) {
    let {
      dataList
    } = this.data
    let dataItem = dataList[index]
    this.setData({
      showModal: true,
      userId: dataItem._id,
      userMoney: dataItem.money
    })
  },
  userMoneyInputHandle(e) {
    let {
      value
    } = e.detail
    this.setData({
      userMoney: value
    })
  },
  hideModalHandle() {
    this.setData({
      showModal: false
    })
  },
  userMoneyClickHandle() {
    let {
      userMoney,
      userId,
      dataList
    } = this.data
    if (!app.$validate.isInteger(userMoney)) {
      return app.$comm.errorToShow("请输入合理余额格式")
    }
    app.$api.updateUserMoney({
      userId,
      userMoney
    }).then(res => {
      if (res.code) {
        dataList.find(item => item._id == userId).money = userMoney
        this.hideModalHandle()
        this.setData({
          dataList
        })
      }
    })
  }
});