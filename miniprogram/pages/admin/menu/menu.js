let app = getApp()
Page({
  data: {
    menuList: [{
        icon: 'people-fill',
        name: '用户管理',
        url: "/pages/admin/user-list/user-list"
      }, {
        icon: 'pic-fill',
        name: '轮播图管理',
        url: "/pages/admin/swiper-list/swiper-list"
      },
      {
        icon: 'bag-fill',
        name: '商品管理',
        url: "/pages/admin/product-list/product-list"
      },
      {
        icon: 'send',
        name: '分类管理',
        url: "/pages/admin/type-list/type-list"
      },
      {
        icon: 'cart-fill',
        name: '订单管理',
        url: "/pages/admin/order-list/order-list"
      },
      {
        icon: 'community-fill',
        name: '用户反馈',
        url: "/pages/admin/feedback-list/feedback-list"
      }
    ]
  },
  itemClickHandle(e) {
    let url = e.currentTarget.dataset.url
    app.$comm.navigateTo(url)
  }
})