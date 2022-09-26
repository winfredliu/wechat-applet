/**
 * 用户页面接口
 */
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router');
var dayjs = require('dayjs');
const {
  isGender,
  FormatData
} = require('./comm/util');
const [
  STATE_ONE, //待发货
  STATE_TWO, //待收货
  STATE_THREE, //待退货
  STATE_FOUR, //退货
  STATE_FIVE //已收货
] = [1, 2, 3, 4, 5]
cloud.init({
  env: "cloud1-6gyj8u4g9601f3a9"
})
let db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let {
    APPID,
    OPENID
  } = wxContext
  const app = new TcbRouter({
    event
  })
  let {
    isLogin = false
  } = event

  //主页热门推荐商品
  app.router('getIndexHotProduct', async (ctx, next) => {
    let {
      page,
      limit
    } = event
    let product = db.collection('product')
    let num = (page - 1) * limit;
    let pageSize = limit
    let {
      data
    } = await product.orderBy('product_sales', 'desc').skip(num).limit(pageSize).get()
    ctx.body = {
      code: 1,
      data,
      msg: "获取成功"
    }
  })

  //主页热门搜索
  app.router('getIndexHotSearch', async (ctx, next) => {
    let hotSearch = db.collection('hotSearch')
    let {
      data
    } = await hotSearch.orderBy('hot_search_num', 'desc').limit(6).get()
    ctx.body = {
      code: 1,
      data,
      msg: "获取成功"
    }
  })

  //主页轮播图
  app.router('getIndexSwiper', async (ctx, next) => {
    let swiper = db.collection('swiper')
    let productType = db.collection('productType')
    let {
      data
    } = await swiper.orderBy('swiper_weight', 'desc').get()
    await Promise.all(data.map(async item => {
      if (item.swiper_page_type == 'classify') {
        let {
          data
        } = await productType.doc(item.swiper_option).get()
        item.swiper_option = data.product_type_name
      }
    }))
    ctx.body = {
      code: 1,
      data,
      msg: "获取成功"
    }
  })

  //主页商品分类菜单
  app.router('getIndexMenu', async (ctx, next) => {
    let productType = db.collection('productType')
    let {
      data
    } = await productType.limit(8).get()
    ctx.body = {
      code: 1,
      data,
      msg: "获取成功"
    }
  })

  //搜索页面获取热门搜索
  app.router('getSearchHotSearch', async (ctx, next) => {
    let hotSearch = db.collection('hotSearch')
    let {
      data
    } = await hotSearch.orderBy('hot_search_num', 'desc').limit(10).get()
    ctx.body = {
      code: 1,
      data,
      msg: "获取成功"
    }
  })

  //搜索页面添加搜索
  app.router('addSearchHot', async (ctx, next) => {
    let {
      hot_search_text,
    } = event
    let hotSearch = db.collection('hotSearch')
    let {
      total
    } = await hotSearch.where({
      hot_search_text: hot_search_text
    }).count()
    if (total) {
      await hotSearch.where({
          hot_search_text: hot_search_text
        })
        .update({
          data: {
            hot_num: _.inc(1)
          }
        })
    } else {
      await hotSearch.add({
        data: {
          hot_search_text: hot_search_text,
          hot_search_time: new Date(),
          hot_num: 1
        }
      })
    }

    ctx.body = {
      code: 1,
      data: {},
      msg: "添加成功"
    }
  })

  //商品筛选页面获取商品
  app.router('getLikeProductList', async (ctx, next) => {
    let {
      page,
      limit,
      priceLike = '',
      salesLike = false,
      searchKey = '',
      product_type_name = ''
    } = event
    let product = db.collection('product')
    let num = (page - 1) * limit;
    let pageSize = limit

    let result = product
    if (priceLike == 'asc') {
      result = result.orderBy('product_price', 'asc')
    } else if (priceLike == 'desc') {
      result = result.orderBy('product_price', 'desc')
    }
    if (salesLike) {
      result = result.orderBy('product_sales', 'desc')
    }
    if (searchKey) {
      result = result.where({
        product_name: db.RegExp({
          regexp: searchKey,
          options: 'i'
        })
      })
    }
    if (product_type_name) {
      result = result.where({
        product_type: product_type_name
      })
    }
    let {
      data
    } = await result.skip(num).limit(pageSize).get()

    ctx.body = {
      code: 1,
      data,
      msg: "获取成功"
    }
  })

  //分类页面获取分类
  app.router('getClassifyMenu', async (ctx, next) => {
    let productType = db.collection('productType')
    let {
      data
    } = await productType.get()
    ctx.body = {
      code: 1,
      data,
      msg: "获取成功"
    }
  })

  //分类页面分类下的商品
  app.router('getClassifProduct', async (ctx, next) => {
    let {
      page,
      limit,
      product_type
    } = event
    let product = db.collection('product')
    let num = (page - 1) * limit;
    let pageSize = limit
    let {
      data
    } = await product.where({
      product_type: product_type
    }).skip(num).limit(pageSize).get()
    ctx.body = {
      code: 1,
      data,
      msg: "获取成功"
    }
  })

  //商品详情页面获取商品详情  
  app.router("getProductDetail", async (ctx, next) => {
    let {
      productId
    } = event
    let product = db.collection('product')
    let collection = db.collection('collection')
    let {
      data
    } = await product.doc(productId).get()

    //判断是否收藏
    data.product_collection = false
    if (isLogin) {
      let {
        total
      } = await collection.where({
        OPENID: OPENID,
        productId: productId
      }).count()
      if (total) {
        data.product_collection = true
      }
    }

    //判断是否新品
    data.product_new = false
    if (dayjs().subtract(2, 'day').isBefore(dayjs(data.product_time))) {
      data.product_new = true
    }

    ctx.body = {
      code: 1,
      msg: "获取成功",
      data: FormatData(data, {
        product_time: "date"
      })
    }
  })

  //商品详情页面改变收藏状态
  app.router("updateCollecting", async (ctx, next) => {
    let {
      productId
    } = event
    let collection = db.collection('collection')
    let {
      total
    } = await collection.where({
      OPENID: OPENID,
      productId: productId
    }).count()
    if (total) {
      await collection.where({
        OPENID: OPENID,
        productId: productId
      }).remove()
      ctx.body = {
        code: 2,
        data: "取消点赞成功"
      }
    } else {
      await collection.add({
        data: {
          OPENID: OPENID,
          productId: productId
        }
      })
      ctx.body = {
        code: 1,
        data: "点赞成功"
      }
    }
  })

  //用户页面登录
  app.router('userLogin', async (ctx, next) => {
    let {
      userInfo
    } = event
    let user = db.collection('user')
    let {
      total
    } = await user.where({
      OPENID: OPENID
    }).count()
    userInfo.gender = isGender(userInfo.gender)
    if (total) {
      await user.where({
          OPENID: OPENID
        })
        .update({
          data: userInfo
        })
    } else {
      await user.add({
        data: {
          nickName: userInfo.nickName,
          gender: userInfo.gender,
          avatarUrl: userInfo.avatarUrl,
          OPENID: OPENID,
          money: 0,
          isAdmin: false
        }
      })
    }
    let {
      data
    } = await user.where({
      OPENID: OPENID
    }).get()
    ctx.body = {
      code: 1,
      msg: "添加成功",
      data: data[0]
    }
  })

  //获取用户地址
  app.router('getUserAddress', async (ctx, next) => {
    let address = db.collection('address')

    let {
      data
    } = await address.where({
      OPENID
    }).get()

    ctx.body = {
      code: 1,
      data,
      msg: "获取成功"
    }
  })

  //获取用户默认地址
  app.router('getUserAddressDefault', async (ctx, next) => {
    let address = db.collection('address')

    let {
      data
    } = await address.where({
      OPENID: OPENID,
      address_default: true
    }).get()

    ctx.body = {
      code: 1,
      data: data,
      msg: "获取成功"
    }
  })

  //添加用户地址
  app.router('addUserAddress', async (ctx, next) => {
    let {
      address_name,
      address_tel,
      address_province,
      address_city,
      address_district,
      address_info,
      address_default
    } = event
    let address = db.collection('address')

    if (address_default) {
      await address.where({
        OPENID: OPENID
      }).update({
        data: {
          address_default: false
        }
      })
    }

    await address.add({
      data: {
        OPENID: OPENID,
        address_name,
        address_tel,
        address_province,
        address_city,
        address_district,
        address_info,
        address_default
      }
    })

    ctx.body = {
      code: 1,
      data: {},
      msg: "添加成功"
    }
  })

  //修改用户地址
  app.router("updateUserAddress", async (ctx, next) => {
    let {
      address_name,
      address_tel,
      address_province,
      address_city,
      address_district,
      address_info,
      address_default,
      addressId
    } = event
    let address = db.collection('address')

    if (address_default) {
      await address.where({
        OPENID: OPENID
      }).update({
        data: {
          address_default: false
        }
      })
    }

    await address.where({
      OPENID: OPENID,
      _id: addressId
    }).update({
      data: {
        address_name,
        address_tel,
        address_province,
        address_city,
        address_district,
        address_info,
        address_default,
      }
    })
    ctx.body = {
      code: 1,
      msg: "修改成功",
      data: ''
    }
  })

  //用户删除地址
  app.router('delUserAddress', async (ctx, next) => {
    let {
      addressId
    } = event
    let address = db.collection('address')

    await address.where({
      OPENID: OPENID,
      _id: addressId
    }).remove()

    ctx.body = {
      code: 1,
      msg: "删除成功",
      data: ''
    }
  })

  //修改用户默认地址
  app.router("updateAddressDefault", async (ctx, next) => {
    let {
      addressId
    } = event
    let address = db.collection('address')

    await address.where({
      OPENID: OPENID
    }).update({
      data: {
        address_default: false
      }
    })

    await address.where({
      OPENID: OPENID,
      _id: addressId
    }).update({
      data: {
        address_default: true
      }
    })

    ctx.body = {
      code: 1,
      msg: "修改成功",
      data: ''
    }
  })

  //用户充值
  app.router("userRecharge", async (ctx, next) => {
    let {
      money
    } = event
    let user = db.collection('user')

    await user.where({
      OPENID: OPENID
    }).update({
      data: {
        money: _.inc(Number(money))
      }
    })
    ctx.body = {
      code: 1,
      msg: "充值成功",
      data: ''
    }
  })

  //检测库存
  app.router("isStockAdequate", async (ctx, next) => {
    let {
      productList
    } = event
    let product = db.collection('product')
    await Promise.all(productList.map(proItem => new Promise(async (resolve, reject) => {
        let {
          total
        } = await product.where({
          _id: proItem.productId,
          product_stock: _.gte(Number(proItem.product_count))
        }).count()
        if (total) {
          resolve(proItem)
        } else {
          reject(proItem)
        }
      })))
      .then(() => {
        ctx.body = {
          code: 1,
          msg: "商品充足",
          data: []
        }
      })
      .catch((adequateList) => {
        ctx.body = {
          code: 2,
          msg: "商品库存不足",
          data: adequateList
        }
      })
  })

  //用户购买
  app.router("orderPay", async (ctx, next) => {
    let {
      addressData,
      productList,
      allTotalAmount,
      remarks
    } = event
    let order = db.collection('order')
    let product = db.collection('product')
    let user = db.collection('user')

    //判断库存
    let adequateInfo = await Promise.all(productList.map(async (proItem) => {
      let {
        data
      } = await product.doc(proItem.productId).get()
      let reInfo = {
        product_name: data.product_name
      }
      if (data.product_stock >= proItem.product_count) {
        return Object.assign(reInfo, {
          flog: true
        })
      } else {
        return Object.assign(reInfo, {
          flog: false
        })
      }
    }))
    let adequateList = adequateInfo.filter(productItem => !productItem.flog) || []
    if (adequateList.length) {
      return ctx.body = {
        code: 2,
        msg: "商品库存不足",
        data: adequateList
      }
    }

    //判断余额
    let {
      total
    } = await user.where({
      OPENID: OPENID,
      money: _.gte(Number(allTotalAmount))
    }).count()
    if (!total) {
      return ctx.body = {
        code: 3,
        msg: "用户余额不足"
      }
    }

    await user.where({
      OPENID: OPENID
    }).update({
      data: {
        money: _.inc(-Number(allTotalAmount))
      }
    })

    await Promise.all(productList.map(async (proItem) => {
      await product.where({
        _id: proItem.productId
      }).update({
        data: {
          product_stock: _.inc(-Number(proItem.product_count)),
          product_sales: _.inc(Number(proItem.product_count))
        }
      })
    }))

    await order.add({
      data: {
        OPENID: OPENID,
        addressData: addressData,
        productList: productList,
        total: allTotalAmount,
        remarks: remarks,
        orderTime: new Date(),
        orderId: Number(Math.random().toString().substr(3, 2) + Date.now()).toString(10),
        state: 1
      }
    })

    ctx.body = {
      code: 1,
      msg: "购买成功",
      data: ''
    }
  })

  //添加反馈
  app.router('addFeedback', async (ctx, next) => {
    let {
      content
    } = event
    let feedback = db.collection('feedback')
    await feedback.add({
      data: {
        content,
        isRead: false,
        time: db.serverDate(),
        OPENID
      }
    })
    ctx.body = {
      code: 1,
      data: "添加成功"
    }
  })

  //获取用户收藏的商品
  app.router('getProductListByCollection', async (ctx, next) => {
    let {
      page,
      limit
    } = event
    let collection = db.collection('collection')

    let {
      list
    } = await collection.aggregate()
      .lookup({
        from: "product",
        localField: 'productId',
        foreignField: '_id',
        as: 'uapproval'
      }).match({
        OPENID: OPENID
      }).replaceRoot({
        newRoot: $.arrayElemAt(['$uapproval', 0])
      }).skip((page - 1) * limit)
      .limit(limit).end()

    ctx.body = {
      code: 1,
      data: list,
      msg: "获取成功"
    }
  })

  //根据订单状态获取订单
  app.router('getOrderListCompleted', async (ctx, next) => {
    let {
      state
    } = event
    let order = db.collection('order')

    let likeWhere = {
      OPENID
    }
    if (state !== -1) {
      likeWhere.state = state
    }

    let {
      data
    } = await order.where(likeWhere).get()

    ctx.body = {
      code: 1,
      data: FormatData(data, {
        orderTime: 'date'
      }),
      msg: "获取成功"
    }
  })

  //用户退货
  app.router('userReturnGoods', async (ctx, next) => {
    let {
      _id,
      OPENID
    } = event

    let order = db.collection('order')

    await order.where({
      _id,
      OPENID
    }).update({
      data: {
        state: STATE_THREE
      }
    })

    ctx.body = {
      code: 1,
      data: '',
      msg: "已提交退货请求"
    }
  })

  return app.serve();
}