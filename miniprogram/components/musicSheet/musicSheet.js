// components/musicSheet/musicSheet.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData: {
      type: Array,
      default: []
    },
    collectNum: {
      type: String,
      default: "0"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    currectMusicId: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClickMusicContent(event) {
      const {
        musicId,
        musicIndex
      } = event.currentTarget.dataset
      this.setData({
        currectMusicId: musicId
      })
      wx.navigateTo({
        url: `/pages/player/player?id=${musicId}&index=${musicIndex}`,
      })
    }
  },
})