const {
  listUniq,
  log
} = require('./utils')

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: "test-hyrna"
})

// 云数据库的初始化
const db = cloud.database()
const collec = db.collection('playlist')

// axios
const axios = require('axios')
// 歌单信息
const URL = 'http://musicapi.xiecheng.live/personalized'

// 限制一次数据取出数量
const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async (event, context) => {

  // 先取出集合记录总数
  const countResult = await collec.count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = collec.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 拿到数据库中的歌单
  const cloudPlaylist = (await Promise.all(tasks)).reduce((pre, cur) => [...pre, ...cur.data], [])
  const cloudIds = cloudPlaylist.map(val => val.id)

  // 拿到网络上最新歌单
  const netPlaylist = await axios.get(URL).then(val => val.data.result)

  // 去重
  const {
    keys
  } = listUniq([...cloudPlaylist, ...netPlaylist], "id")

  // 计算需要添加的数据
  const shouldAddIds = keys.filter(id => !cloudIds.includes(Number(id)))
  const shouldAddList = netPlaylist.filter(val => shouldAddIds.includes(`${val.id}`))

  // 循环添加新的歌单数据
  for (let i = 0, len = shouldAddList.length; i < len; i++) {
    try {
      await collec.add({
        data: {
          ...shouldAddList[i],
          createTime: db.serverDate()
        }
      })
    } catch (error) {
      log.error(error)
    }
  }
  log.info(`新增歌单数 ${shouldAddList.length}`)
  return shouldAddList.length;
}