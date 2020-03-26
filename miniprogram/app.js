//app.js
App({
  onLaunch: function () {
    this.checkAppUpdate()
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'test-hyrna',
        traceUser: true,
      })
    }
    this.getOpenId()

    this.globalData = {
      currentMusicId: -1,
      openId: -1
    }
  },

  setCurrentMusicId(musicId) {
    this.globalData.currentMusicId = musicId
  },
  getCurrentMusicId() {
    return this.globalData.currentMusicId
  },

  // 获取用户openid
  getOpenId() {
    wx.cloud.callFunction({
      name: 'login',
    }).then(res => {
      const {
        openid
      } = res.result
      this.globalData.openId = openid
      if (wx.getStorageSync(openid) == '') {
        wx.setStorageSync(openid, [])
      }
    })
  },

  // 检查更新函数
  checkAppUpdate() {
    const updateManager = wx.getUpdateManager()

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  }
})