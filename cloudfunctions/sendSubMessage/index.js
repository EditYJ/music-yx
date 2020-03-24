// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      templateId: event.templateId,
      miniprogramState: 'developer',
      touser: wxContext.OPENID,
      page: `pages/blog-detail/blog-detail?blogId=${event.blogId}`,
      lang: 'zh_CN',
      data: {
        phrase2: {
          value: event.result
        },
        thing3: {
          value: event.content
        }
      }
    })
    return result
  } catch (err) {
    return err
  }
}