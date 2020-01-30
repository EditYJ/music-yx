// pages/player/player.js

// 全局唯一音频播放管理对象
const backgroundAudioManager = wx.getBackgroundAudioManager()
// 当前播放列表
let currectPlayList = []
// 当前播放音乐
let currectPlayIndex = -1

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    picUrl: "",
    name: ""
  },

  // 获取音乐详细信息，并播放音乐
  loadingMusicDetail(musicId) {
    backgroundAudioManager.stop()
    wx.showLoading({
      title: '请稍等...',
    })

    const {
      name,
      al
    } = currectPlayList[currectPlayIndex]

    // 更改对应界面数据
    this.setData({
      name,
      picUrl: al.picUrl,
      isPlay: !backgroundAudioManager.paused
    })

    wx.setNavigationBarTitle({
      title: name
    })

    // 调用云函数 获取歌曲URL
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'music/detail',
        musicId: musicId
      }
    }).then(val => {
      console.log("歌曲信息获取成功: ", val)
      const {
        url
      } = val.result.data[0]

      if (!url) {
        wx.hideLoading()
        wx.showToast({
          title: '此为网易云会员特权音乐，无法播放！',
          icon: "none",
          duration: 5000,
          complete: () => {
            setTimeout(() => {
              wx.navigateBack()
            }, 5000)
          }
        })
      } else {
        // 获取成功后传输数据到音频管理器播放相应的音乐
        backgroundAudioManager.src = url // 设置歌曲URL
        backgroundAudioManager.title = name // 设置歌曲名
        backgroundAudioManager.coverImgUrl = al.picUrl // 封面
      }
      wx.hideLoading()
    })
  },

  // 暂停和播放按钮的监听事件，用于更改音乐播放状态
  changePlayState() {
    console.log("更改音乐播放状态")
    const currentState = backgroundAudioManager.paused
    if (currentState) {
      backgroundAudioManager.play()
    } else {
      backgroundAudioManager.pause()
    }
  },

  // 播放上一首
  playPre() {
    currectPlayIndex--
    if (currectPlayIndex < 0) {
      currectPlayIndex = currectPlayList.length - 1
    }
    this.loadingMusicDetail(currectPlayList[currectPlayIndex].id)
  },

  // 播放下一首
  playNext() {
    currectPlayIndex++
    if (currectPlayIndex == currectPlayList.length) {
      currectPlayIndex = 0
    }
    this.loadingMusicDetail(currectPlayList[currectPlayIndex].id)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("播放器页面接收到参数: ", options)
    const {
      id,
      index,
    } = options

    // 获取内部缓存的当前歌单列表
    currectPlayList = wx.getStorageSync('currentMusicList')
    currectPlayIndex = index

    // 播放当前id的音乐
    this.loadingMusicDetail(id)

    // 添加监听事件/监听音乐播放状态/根据音乐播放状态更改页面按钮图标状态
    backgroundAudioManager.onPlay(() => {
      this.setData({
        isPlay: !backgroundAudioManager.paused
      })
    })
    backgroundAudioManager.onPause(() => {
      this.setData({
        isPlay: !backgroundAudioManager.paused
      })
    })

    backgroundAudioManager.onStop(() => {
      console.log("音乐停止啦")
      this.setData({
        isPlay: false
      })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})