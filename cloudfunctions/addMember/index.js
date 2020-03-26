// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: 'yunrun-m932d'
})
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  var id = event.id
  var openid = event.openid
  return await db.collection("activityUser").where({
    activityId: id
  }).update({
    data:{
      attendUsers: _.push([openid])
    }
  })
}