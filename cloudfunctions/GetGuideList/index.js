// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV //云开发环境ID
})
const db=cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  let {limit,page}=event;
  return await db.collection("GuideList").skip(page*limit).limit(limit).get()
}


