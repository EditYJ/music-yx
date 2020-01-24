// components/playlist/playlist.js
import {
  getCount
} from '../../api/utils'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listItem: {
      type: Object,
      default: {}
    }

  },
  observers: {
    ['listItem.playCount'](val) {
      this.setData({
        playCount: this.getCount(val)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playCount: "0"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getCount,
    goToMusicList() {
      wx.navigateTo({
        url: `/pages/musiclist/musiclist?playlistId=${this.properties.listItem.id}`,
      })
    }
  }
})