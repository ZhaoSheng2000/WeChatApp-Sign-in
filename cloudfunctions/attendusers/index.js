// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: 'yunrun-m932d'
})
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('activityUser').aggregate()
    .match({
      activityId:event.activityId
    })
    .lookup({
      from: 'userinfo',
      localField: 'attendUsers',
      foreignField: '_openid',
      as: 'attendList',
    })
    .project({
      attendList:1,
      _id:0
    })
    .end()
}