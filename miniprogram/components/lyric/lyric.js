// components/lyric/lyric.js
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
      this.setData({
        lrc:[...this.parseLrc(lrc)]
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    lrc: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeLyricState() {
      this.triggerEvent('changeLyricState')
    },
    // 解析歌词
    // return {
    //  time,
    //  text
    // }
    parseLrc(lrc) {
      const lrcReg = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g
      const lines = lrc.split('\n')
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
  }
})