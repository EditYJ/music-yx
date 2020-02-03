// components/topBar/topBar.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    /**
     * 自定义返回事件处理
     * customBackReturn="{{true}}" bind:customBackReturn="customBackReturn"
     */
    customBackReturn: {
      type: Boolean,
      value: false
    }
  },

  lifetimes: {
    ready() {
      this.attached()
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
    attached() {
      wx.getSystemInfo({
        success: res => {
          var isIos = res.system.indexOf('iOS') > -1;
          this.setData({
            statusHeight: res.statusBarHeight,
            navHeight: isIos ? 44 : 48
          })
        }
      })
    },
    backClick() {
      if (this.data.customBackReturn) {
        this.triggerEvent("customBackReturn")
      } else {
        if (getCurrentPages().length == 1) {
          wx.switchTab({
            url: '/pages/index/index',
          })
        } else {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    },
  },
})