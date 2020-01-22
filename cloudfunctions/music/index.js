// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: "test-hyrna"
})

// 云数据库的初始化
const db = cloud.database()
const collec = db.collection('playlist')

// 云函数入口函数
exports.main = async (event, context) => {
  return await collec
    .skip(event.start)
    .limit(event.count)
    .orderBy("createTime", "desc")
    .get()
}