// components/progressBar/progressBar.js
import {
  transformSec,
  addZero
} from '../../api/utils'

let moveAreaWidth = 0
let moveItemWidth = 0
let currectPlayTime = -1
let movePercent = 0 // 拖动事件记录拖动长度比率
const backgroundAudioManager = wx.getBackgroundAudioManager()

// 异步获取当前播放歌曲总时间
const getTotalTime = () => {
  const promise = new Promise((resolve, reject) => {
    if (!backgroundAudioManager.duration) {
      setTimeout(() => {
        resolve(backgroundAudioManager.duration)
      }, 1000);
    } else {
      resolve(backgroundAudioManager.duration)
    }
  })
  return promise
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    currectTime: '00:00',
    totalTime: '00:00',
    moveDis: 0,
    process: 0,
  },

  lifetimes: {
    ready() {
      this.getMoveDis()
      this.bindBGMEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 查询节点信息
    getMoveDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((exec) => {
        moveAreaWidth = exec[0].width
        moveItemWidth = exec[1].width
        console.log(moveAreaWidth, moveItemWidth)
      })
    },
    // 监听音频管理器回调事件
    bindBGMEvent() {
      backgroundAudioManager.onCanplay(() => {
        this.setTotalTime()
      })
      backgroundAudioManager.onTimeUpdate(() => {
        const {
          currentTime,
          duration
        } = backgroundAudioManager
        const playPercent = currentTime / duration
        const moveDis = moveAreaWidth * playPercent

        const floorNumber = Math.floor(currentTime)
        // 去抖，防止频繁调用setData
        if (floorNumber !== currectPlayTime) {
          this.setCurrentTime(currentTime)
          this.setData({
            moveDis,
            process: playPercent * 100
          })
          currectPlayTime = floorNumber
        }
      })
    },
    // 设置总时间
    setTotalTime() {
      getTotalTime().then(val => {
        const timeObj = transformSec(val)
        const totalTime = `${addZero(timeObj.min)}:${addZero(timeObj.sec)}`
        this.setData({
          totalTime
        })
      })
    },
    // 设置当前播放的时间
    setCurrentTime(currentTime) {
      const timeObj = transformSec(currentTime)
      const currectTime = `${addZero(timeObj.min)}:${addZero(timeObj.sec)}`
      this.setData({
        currectTime
      })
    },

    // 拖动监听事件
    movableChange(e) {
      if (e.detail.source === "touch") {
        movePercent = e.detail.x / moveAreaWidth
      }
    },

    // 拖动完成监听事件
    touchEnd(e) {
      this.setData({
        process: movePercent * 100
      })
      backgroundAudioManager.seek(backgroundAudioManager.duration * movePercent)
      movePercent = 0
    }
  }
})