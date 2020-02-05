// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showPanel: {
      type: Boolean,
      value: false
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
    onGotUserInfo(event) {
      const {
        userInfo
      } = event.detail
      if (userInfo) {
        this.setData({
          showPanel: false
        })
        this.triggerEvent('loginSuccess', userInfo)
      } else {
        this.triggerEvent('loginFail')
      }
    }
  }
})