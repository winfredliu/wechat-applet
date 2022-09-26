// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV //云开发环境ID
})
const db=cloud.database();
const _=db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  let {teChanId}=event;
  return await db.collection('TeChanList').where({
    _id:_.eq(teChanId)
  }).get();
}