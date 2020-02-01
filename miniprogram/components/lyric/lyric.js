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
      console.log(lrc)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeLyricState() {
      this.triggerEvent('changeLyricState')
    }
  }
})