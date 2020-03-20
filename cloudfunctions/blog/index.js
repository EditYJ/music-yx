const TcbRouter = require('tcb-router')

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: "test-hyrna"
})

// 云数据库的初始化
const db = cloud.database()
const collec = db.collection('blog')

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router("getList", async (ctx, next) => {
    ctx.body = await collec
      .skip(event.start)
      .limit(event.count)
      .orderBy("createTime", "desc")
      .get()
      .then(res => res.data)
  })

  // 通过id查询单个博客信息
  app.router("getBlogById", async (ctx, next) => {
    ctx.body = await collec.where({
      _id: event.blogId
    }).get().then(res => res.data)
  })



  return app.serve()
}