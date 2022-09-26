const app = getApp();
Page({
  data: {
    tableColumns: [{
      title: "分类名称",
      key: "product_type_name",
    }, {
      title: "分类图片",
      key: "product_type_icon",
      type: 'img',
      imgWidth: '50px',
      imgHeight: '50px'
    }],
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
    app.$api.getTypelistAdmin({
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
    let menuList = ['数据修改', '数据删除']
    wx.showActionSheet({
      itemList: menuList,
      success: (res) => {
        let tapIndex = res.tapIndex
        if (tapIndex == 0) {
          this.updateHandle(index)
        } else if (tapIndex == 1) {
          this.delTypeHandle(index)
        }
      }
    })
  },
  delTypeHandle(index) {
    let {
      dataList
    } = this.data
    let info = dataList[index]
    wx.showModal({
      title: '提示',
      content: '是否确定删除该数据？',
      success: (res) => {
        if (res.confirm) {
          app.$api.delTypeAdmin({
            _id: info._id,
            product_type_name: info.product_type_name
          }).then(res => {
            if (res.code) {
              app.$comm.successToShow(res.msg, () => {
                dataList.splice(index, 1)
                this.setData({
                  dataList
                })
              })
            } else {
              app.$comm.errorToShow(res.msg)
            }
          })
        }
      }
    })
  },
  updateHandle(index) {
    let {
      dataList
    } = this.data
    let info = dataList[index]
    info = JSON.stringify(info)
    app.$comm.navigateTo(`/pages/admin/type-update/type-update?info=${info}&pageType=update`)
  },
  addHandle() {
    app.$comm.navigateTo(`/pages/admin/type-update/type-update`)
  }
});