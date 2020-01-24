const TcbRouter = require('tcb-router')
const axios = require('axios')

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: "test-hyrna"
})

// 云数据库的初始化
const db = cloud.database()
const collec = db.collection('playlist')

const URL = 'http://www.edityj.top:3000/playlist/detail'
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  // 从云数据库获取歌单
  app.router('playlist', async (ctx, next) => {
    ctx.body = await collec
      .skip(event.start)
      .limit(event.count)
      .orderBy("createTime", "desc")
      .get()
  })

  // 根据歌单id获取对应歌单下的所有歌曲
  app.router('playlist/detail', async (ctx, next) => {
    ctx.body = await axios
      .get(`${URL}?id=${event.playlistId}`)
      .then(val => val.data)
  })

  return app.serve()
}