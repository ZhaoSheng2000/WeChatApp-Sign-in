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
      attendUsers: event.userId
    })
    .lookup({
      from: 'activity',
      localField: 'activityId',
      foreignField: '_id',
      as: 'attendActivitys',
    })
    .project({
      _id: 0, 
      attendActivitys: 1
    })
    .end()
}