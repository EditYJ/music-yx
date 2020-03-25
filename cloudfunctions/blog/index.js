const TcbRouter = require('tcb-router')

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: "test-hyrna"
})

// 云数据库的初始化
const db = cloud.database()
const blogCollec = db.collection('blog')
const talkCollec = db.collection('blog-comment')

// 限制一次数据取出数量
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  // 查询博客列表 支持模糊查询
  app.router("getList", async (ctx, next) => {
    const keywords = event.keywords
    const rule = {}
    if (keywords.trim() != '') {
      rule.content = db.RegExp({
        regexp: keywords,
        options: 'i'
      })
    }

    ctx.body = await blogCollec
      .where(rule)
      .skip(event.start)
      .limit(event.count)
      .orderBy("createTime", "desc")
      .get()
      .then(res => res.data)
  })

  // 通过id查询单个博客信息和评论
  app.router("getBlogById", async (ctx, next) => {
    // 单个博客信息
    const blogInfo = await blogCollec.where({
      _id: event.blogId
    }).get().then(res => res.data)

    // 此博客的所有评论 //
    // 筛选器
    const allTalkWhere = talkCollec.where({
      blogId: event.blogId
    })
    // 总条数
    const {
      total
    } = await allTalkWhere.count()
    const getTimes = Math.ceil(total / MAX_LIMIT)

    const tasks = []
    for (let i = 0; i < getTimes; i++) {
      const promise = allTalkWhere
        .skip(i * MAX_LIMIT)
        .limit(MAX_LIMIT)
        .orderBy("createTime", "desc")
        .get()
      tasks.push(promise)
    }
    let commonts = {
      data: []
    }
    if (tasks.length > 0) {
      commonts = (await Promise.all(tasks)).reduce((pre, cur) => {
        return pre.data.concat(cur.data)
      })
    }

    ctx.body = {
      blogInfo,
      commonts,
      total
    }
  })

  app.router("getBlogByOpenId", async (ctx, next) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    const {
      data
    } = await blogCollec.where({
      _openid: openid
    }).orderBy('createTime', "desc").get()

    ctx.body = data
  })

  return app.serve()
}