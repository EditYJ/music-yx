// components/lyric/lyric.js
let pxToRpx = 1
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    idHiddenLyric: Boolean,
    lyric: String
  },

  observers: {
    lyric(lrc) {
      // console.log(lrc)
      this.setData({
        lrc: [...this.parseLrc(lrc)]
      })
    }
  },

  lifetimes: {
    ready() {
      wx.getSystemInfo({
        success: (res) => {
          pxToRpx = res.screenWidth / 750
        },
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrc: [{}],
    currentLine: 0,
    scrollY: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeLyricState() {
      this.triggerEvent('changeLyricState')
    },
    // 解析歌词
    parseLrc(lrc) {
      if (!lrc || lrc === "暂无歌词") {
        return [{
          time: 0,
          text: "暂无歌词"
        }]
      } else {
        const lrcReg = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g
        const lines = lrc.split('\n')
        lines.pop() // 取出末尾一个空项
        const parsedLrc = lines.map(line => {
          const lineDetail = line.split(lrcReg)
          const time = parseInt(lineDetail[1]) * 60 + parseInt(lineDetail[2]) + parseInt(lineDetail[3]) / 1000
          return {
            time,
            text: lineDetail[4]
          }
        })
        return parsedLrc
      }
    },
    // 更新歌词进度
    update(currentTime) {
      const lrc = this.data.lrc
      // console.log('更新歌词进度', currentTime,lrc)
      if (currentTime > lrc[lrc.length - 1].time && this.data.currentLine != -1) {
        this.setData({
          currentLine: -1,
          scrollY: 64 * pxToRpx * lrc.length
        })
      }
      for (let i = 0; i < lrc.length; i++) {
        if (currentTime <= lrc[i].time) {
          const index = i - 1
          this.setData({
            currentLine: index,
            scrollY: 64 * pxToRpx * index
          })
          break
        }
      }
    }
  }
})