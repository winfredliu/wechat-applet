const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router');
const {
  pick,
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

  //获取用户列表
  app.router('getUserlist', async (ctx, next) => {
    let {
      page,
      limit
    } = event
    let user = db.collection('user')
    let {
      data
    } = await user.skip((page - 1) * limit)
      .limit(limit).get()
    ctx.body = {
      code: 1,
      data: data,
      msg: "获取成功"
    }
  })

  //撤销管理员
  app.router('cancelAdmin', async (ctx, next) => {
    let {
      userId
    } = event
    let user = db.collection('user')

    await user.where({
      _id: userId
    }).update({
      data: {
        isAdmin: false
      }
    })

    ctx.body = {
      code: 1,
      msg: "修改成功",
      data: ''
    }
  })

  //设置管理员
  app.router('setAdmin', async (ctx, next) => {
    let {
      userId
    } = event
    let user = db.collection('user')

    await user.where({
      _id: userId
    }).update({
      data: {
        isAdmin: true
      }
    })

    ctx.body = {
      code: 1,
      msg: "修改成功",
      data: ''
    }
  })

  //修改用户余额
  app.router('updateUserMoney', async (ctx, next) => {
    let {
      userId,
      userMoney
    } = event
    let user = db.collection('user')

    await user.where({
      _id: userId
    }).update({
      data: {
        money: Number(userMoney)
      }
    })

    ctx.body = {
      code: 1,
      msg: "修改成功",
      data: ''
    }
  })

  //获取轮播图
  app.router('getSwiper', async (ctx, next) => {
    let swiper = db.collection('swiper')
    let product = db.collection('product')
    let productType = db.collection('productType')
    let {
      data
    } = await swiper.orderBy('swiper_weight', 'desc').get()

    await Promise.all(data.map(async item => {
      if (item.swiper_page_type == 'nothing') {
        item.swiper_page_type_text = '无跳转'
        item.swiper_option_text = '无目标'
      } else if (item.swiper_page_type == 'product-detail') {
        item.swiper_page_type_text = '跳转商品'
        let {
          data
        } = await product.doc(item.swiper_option).get()
        item.swiper_option_text = data.product_name
      } else if (item.swiper_page_type == 'classify') {
        item.swiper_page_type_text = '跳转商品分类'
        let {
          data
        } = await productType.doc(item.swiper_option).get()
        item.swiper_option_text = data.product_type_name
      }
    }))

    ctx.body = {
      code: 1,
      data,
      msg: "获取成功"
    }
  })

  //获取轮播图跳转选择项
  app.router('getSwiperLinkOption', async (ctx, next) => {
    let productType = db.collection('productType')
    let product = db.collection('product')
    let typeInfo = await productType.field({
      product_type_name: true
    }).get()
    let typeData = typeInfo.data
    let productInfo = await product.field({
      product_name: true
    }).get()
    let productData = productInfo.data
    productData = productData.map(productItem => ({
      key: productItem._id,
      value: productItem.product_name
    }))
    typeData = typeData.map(typeItem => ({
      key: typeItem._id,
      value: typeItem.product_type_name
    }))
    ctx.body = {
      code: 1,
      data: {
        typeOption: typeData,
        productOption: productData
      },
      msg: "获取成功"
    }
  })

  //添加轮播图
  app.router('addSwiperAdmin', async (ctx, next) => {
    let {
      swiper_img,
      swiper_weight,
      swiper_page_type,
      swiper_option
    } = event
    let swiper = db.collection('swiper')

    await swiper.add({
      data: {
        swiper_img,
        swiper_weight,
        swiper_page_type,
        swiper_option
      }
    })

    ctx.body = {
      code: 1,
      data: {},
      msg: "添加成功"
    }
  })

  //删除轮播图
  app.router('delSwiperAdmin', async (ctx, next) => {
    let {
      _id
    } = event
    let swiper = db.collection('swiper')

    let {
      data: {
        swiper_img
      }
    } = await swiper.doc(_id).get()
    await cloud.deleteFile({
      fileList: [swiper_img]
    })

    await swiper.where({
      _id
    }).remove()

    ctx.body = {
      code: 1,
      data: {},
      msg: "删除成功"
    }
  })

  //修改轮播图
  app.router('updateSwiperAdmin', async (ctx, next) => {
    let {
      _id,
      swiper_img,
      swiper_weight,
      swiper_page_type,
      swiper_option
    } = event
    let swiper = db.collection('swiper')

    let {
      data
    } = await swiper.doc(_id).get()
    if (swiper_img !== data.swiper_img) {
      await cloud.deleteFile({
        fileList: [data.swiper_img]
      })
    }

    await swiper.where({
      _id
    }).update({
      data: {
        swiper_img,
        swiper_weight,
        swiper_page_type,
        swiper_option
      }
    })

    ctx.body = {
      code: 1,
      data: {},
      msg: "修改成功"
    }
  })

  //获取商品列表
  app.router('getProductlistAdmin', async (ctx, next) => {
    let {
      page,
      limit
    } = event
    let product = db.collection('product')
    let num = (page - 1) * limit;
    let pageSize = limit
    let {
      data
    } = await product.skip(num).limit(pageSize).get()

    ctx.body = {
      code: 1,
      data,
      msg: "获取成功"
    }
  })

  //获取商品分类
  app.router('getClassifyAdmin', async (ctx, next) => {
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

  //添加商品
  app.router('addProductAdmin', async (ctx, next) => {
    let addData = pick(event, ['product_name', 'product_type', 'product_price', 'product_sales', 'product_stock', 'product_img_list'])
    let product = db.collection('product')
    await product.add({
      data: {
        ...addData,
        product_time: new Date()
      }
    })
    ctx.body = {
      code: 1,
      data: '',
      msg: "添加成功"
    }
  })

  //删除商品
  app.router('delProductAdmin', async (ctx, next) => {
    let {
      _id
    } = event
    let product = db.collection('product')

    let {
      data: {
        product_img_list
      }
    } = await product.doc(_id).get()
    await cloud.deleteFile({
      fileList: product_img_list
    })

    await product.where({
      _id
    }).remove()

    ctx.body = {
      code: 1,
      data: {},
      msg: "删除成功"
    }
  })

  //修改商品
  app.router('updateProductAdmin', async (ctx, next) => {
    let {
      _id
    } = event
    let updateData = pick(event, ['product_name', 'product_type', 'product_price', 'product_sales', 'product_stock', 'product_img_list'])
    let product = db.collection('product')

    let {
      data
    } = await product.doc(_id).get()
    let delImgList = []
    data.product_img_list.forEach(imgItem => {
      if (updateData.product_img_list.indexOf(imgItem) == -1) {
        delImgList.push(imgItem)
      }
    })

    if (delImgList.length) {
      await cloud.deleteFile({
        fileList: delImgList
      })
    }

    await product.where({
      _id
    }).update({
      data: {
        ...updateData
      }
    })
    ctx.body = {
      code: 1,
      data: {},
      msg: "修改成功"
    }
  })

  //获取用户反馈列表
  app.router('getFeedbacklistAdmin', async (ctx, next) => {
    let {
      page,
      limit
    } = event

    let feedback = db.collection('feedback')

    let {
      list
    } = await feedback.aggregate()
      .lookup({
        from: "user",
        localField: 'OPENID',
        foreignField: 'OPENID',
        as: 'userInfo'
      })
      .unwind('$userInfo')
      .project({
        content: true,
        time: true,
        isRead: true,
        nickName: "$userInfo.nickName",
        avatarUrl: "$userInfo.avatarUrl",
        gender: "$userInfo.gender",
        money: "$userInfo.money",
        userId: "$userInfo._id"
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .end()
    ctx.body = {
      code: 1,
      data: FormatData(list, {
        time: "date"
      }),
      msg: "获取成功"
    }
  })

  //获取订单
  app.router('getOrderlistAdmin', async (ctx, next) => {
    let {
      page,
      limit
    } = event

    let order = db.collection('order')

    let {
      list
    } = await order.aggregate()
      .lookup({
        from: "user",
        localField: 'OPENID',
        foreignField: 'OPENID',
        as: 'userInfo'
      })
      .addFields({
        userInfo: $.arrayElemAt(['$userInfo', 0])
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .end()

    ctx.body = {
      code: 1,
      data: FormatData(list, {
        orderTime: 'date'
      }),
      msg: "获取成功"
    }
  })

  //订单发货
  app.router('updateDeliverGoods', async (ctx, next) => {
    let {
      _id
    } = event

    let order = db.collection('order')

    await order.where({
      _id
    }).update({
      data: {
        state: STATE_TWO
      }
    })

    ctx.body = {
      code: 1,
      data: '',
      msg: "发货成功"
    }
  })

  //订单退货
  app.router('updateReturnGoods', async (ctx, next) => {
    let {
      _id
    } = event

    let order = db.collection('order')
    let product = db.collection('product')
    let user = db.collection('user')

    let {
      data: {
        productList,
        total
      }
    } = await order.doc(_id).get()
    //恢复库存和销售
    await Promise.all(productList.map(async (proItem) => {
      await product.where({
        _id: proItem.productId
      }).update({
        data: {
          product_stock: _.inc(Number(proItem.product_count)),
          product_sales: _.inc(-Number(proItem.product_count))
        }
      })
    }))
    //恢复用户余额
    await user.where({
      OPENID: OPENID
    }).update({
      data: {
        money: _.inc(Number(total))
      }
    })

    await order.where({
      _id
    }).update({
      data: {
        state: STATE_FOUR
      }
    })

    ctx.body = {
      code: 1,
      data: '',
      msg: "退货成功"
    }
  })

  //删除订单
  app.router('delOrderAdmin', async (ctx, next) => {
    let {
      _id
    } = event

    let order = db.collection('order')
    let product = db.collection('product')
    let user = db.collection('user')

    let {
      data: {
        productList,
        total,
        state
      }
    } = await order.doc(_id).get()

    if (state != STATE_FOUR) {
      //恢复库存和销售
      await Promise.all(productList.map(async (proItem) => {
        await product.where({
          _id: proItem.productId
        }).update({
          data: {
            product_stock: _.inc(Number(proItem.product_count)),
            product_sales: _.inc(-Number(proItem.product_count))
          }
        })
      }))
      //恢复用户余额
      await user.where({
        OPENID: OPENID
      }).update({
        data: {
          money: _.inc(Number(total))
        }
      })
    }

    await order.where({
      _id
    }).remove()

    ctx.body = {
      code: 1,
      data: '',
      msg: "删除单据成功"
    }
  })

  //已读反馈
  app.router('updataFeedbackReadAdmin', async (ctx, next) => {
    let {
      _id
    } = event
    let feedback = db.collection('feedback')

    await feedback.where({
      _id: _id
    }).update({
      data: {
        isRead: true
      }
    })

    ctx.body = {
      code: 1,
      msg: "修改成功",
      data: ''
    }
  })

  //获取商品分类
  app.router('getTypelistAdmin', async (ctx, next) => {
    let {
      page,
      limit
    } = event
    let productType = db.collection('productType')

    let num = (page - 1) * limit;
    let pageSize = limit

    let {
      data
    } = await productType.skip(num).limit(pageSize).get()
    ctx.body = {
      code: 1,
      data,
      msg: "获取成功"
    }
  })

  //删除分类
  app.router('delTypeAdmin', async (ctx, next) => {
    let {
      _id,
      product_type_name
    } = event
    let productType = db.collection('productType')

    let product = db.collection('product')
    let {
      total
    } = await product.where({
      product_type: product_type_name
    }).count()
    if (total) {
      return ctx.body = {
        code: 0,
        data: {},
        msg: "删除失败，有商品属于该分类！！"
      }
    } else {
      let {
        data: {
          product_type_icon
        }
      } = await productType.doc(_id).get()
      await cloud.deleteFile({
        fileList: [product_type_icon]
      })

      await productType.where({
        _id
      }).remove()

      ctx.body = {
        code: 1,
        data: {},
        msg: "删除成功"
      }
    }
  })

  //增加分类
  app.router('addTypeAdmin', async (ctx, next) => {
    let addData = pick(event, ['product_type_name', 'product_type_icon'])
    let productType = db.collection('productType')
    await productType.add({
      data: {
        ...addData
      }
    })
    ctx.body = {
      code: 1,
      data: '',
      msg: "添加成功"
    }
  })

  //修改分类
  app.router('updateTypeAdmin', async (ctx, next) => {
    let {
      _id
    } = event
    let updateData = pick(event, ['product_type_name', 'product_type_icon'])
    let productType = db.collection('productType')

    let {
      data
    } = await productType.doc(_id).get()
    if (updateData.product_type_icon !== data.product_type_icon) {
      await cloud.deleteFile({
        fileList: [data.product_type_icon]
      })
    }

    await productType.where({
      _id
    }).update({
      data: {
        ...updateData
      }
    })

    ctx.body = {
      code: 1,
      data: {},
      msg: "修改成功"
    }

  })

  return app.serve();
}