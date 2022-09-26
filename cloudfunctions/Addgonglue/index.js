// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV //云开发环境ID
})

// 云函数入口函数
exports.main = async (event, context) => {
 
  return cloud.database().collection('GongLueList')
  .add({
    data:{
      writer:event.writer,
      cname:event.cname,
      name:event.name,
      content:event.content,
      pic:event.pic
    }
  })
}