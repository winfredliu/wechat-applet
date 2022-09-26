let app = getApp()
Page({
  data: {
    tableColumns: [{
        title: "名称",
        key: "userInfo",
        render: ({
          nickName
        }) => nickName,
        width: "60px"
      },
      {
        title: "总金额",
        key: "total"
      },
      {
        title: "时间",
        key: "orderTime",
        width: "130px"
      },
      {
        title: "状态",
        key: "state",
        render: (val) => app.$config.orderState.find(item => val === item.state).name
      }
    ],
    dataList: [],
    page: 1,
    limit: 10,
    isLoad: true
  },
  onShow() {
    this.initComponent();
  },
  initComponent() {
    this.setData({
      dataList: [],
      page: 1,
      limit: 10,
      isLoad: true
    })
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
    app.$api.getOrderlistAdmin({
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
    let menuList = ['查看订单', '数据删除']
    wx.showActionSheet({
      itemList: menuList,
      success: (res) => {
        if (res.tapIndex == 0) {
          this.updateOrderHandle(index)
        } else if (res.tapIndex == 1) {
          this.delOrderHandle(index)
        }
      }
    })
  },
  updateOrderHandle(index) {
    let {
      dataList
    } = this.data
    let info = dataList[index]
    info = JSON.stringify(info)
    app.$comm.navigateTo(`/pages/admin/order-update/order-update?info=${info}&pageType=update`)
  },
  delOrderHandle(index) {
    let {
      dataList
    } = this.data
    let info = dataList[index]
    wx.showModal({
      title: '警告',
      content: '不建议删除订单',
      success: (res) => {
        if (res.confirm) {
          app.$api.delOrderAdmin({
            _id: info._id
          }).then(res => {
            if (res.code) {
              app.$comm.successToShow(res.msg, () => {
                dataList.splice(index, 1)
                this.setData({
                  dataList
                })
              })
            }
          })
        }
      }
    })
  }
})