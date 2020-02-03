// pages/player/player.js

// 全局唯一音频播放管理对象
const backgroundAudioManager = wx.getBackgroundAudioManager()
// 当前播放列表
let currectPlayList = []
// 当前播放音乐
let currectPlayIndex = -1

// 得到全局对象
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    picUrl: "",
    name: "",
    ar: [],
    lyric: "",
    idHiddenLyric: true,
    isSame: false
  },

  // 获取系统状态栏高度信息
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

  backPrePage() {
    wx.navigateBack()
  },
  changeLyricState() {
    this.setData({
      idHiddenLyric: !this.data.idHiddenLyric
    })
  },

  // 获取音乐详细信息，并播放音乐
  loadingMusicDetail(musicId) {
    // 判断是否是同一首音乐
    if (musicId == app.getCurrentMusicId()) {
      this.setData({
        isSame: true
      })
    } else {
      this.setData({
        isSame: false
      })
    }

    if (!this.data.isSame) {
      backgroundAudioManager.stop()
    }
    wx.showLoading({
      title: '请稍等...',
    })

    const {
      name,
      al,
      ar
    } = currectPlayList[currectPlayIndex]

    // 更改对应界面数据
    this.setData({
      name,
      ar,
      picUrl: al.picUrl,
      isPlay: !backgroundAudioManager.paused,
    })

    // 设置标题栏
    wx.setNavigationBarTitle({
      title: name
    })

    // 保存当前播放的歌曲id 到全局app对象
    app.setCurrentMusicId(musicId)

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
              this.playNext()
            }, 3000)
          }
        })
      } else {
        if (!this.data.isSame) {
          // 获取成功后传输数据到音频管理器播放相应的音乐
          backgroundAudioManager.src = url // 设置歌曲URL
          backgroundAudioManager.title = name // 设置歌曲名
          backgroundAudioManager.coverImgUrl = al.picUrl // 封面
        }
        this.getLyric(musicId)
        wx.hideLoading()
      }
    })
  },

  // 获取歌词
  getLyric(musicId) {
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'music/lyric'
      }
    }).then(val => {
      // console.log('获取歌词成功: ', val)
      let lyric = "暂无歌词"
      if (val.result.lrc) {
        lyric = val.result.lrc.lyric
      }
      this.setData({
        lyric
      })
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

  //得到当前播放时间
  getCurrentTime(event) {
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },



  // 添加监听事件/监听音乐播放状态/根据音乐播放状态更改页面按钮图标状态
  musicOnPlay() {
    this.setData({
      isPlay: !backgroundAudioManager.paused
    })
  },
  musicOnPause() {
    this.setData({
      isPlay: !backgroundAudioManager.paused
    })
  },
  musicOnStop() {
    this.setData({
      isPlay: false
    })
  },
  musicOnEnded() {
    this.playNext()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("播放器页面接收到参数: ", options)
    this.attached()
    const {
      id,
      index,
    } = options

    // 获取内部缓存的当前歌单列表
    currectPlayList = wx.getStorageSync('currentMusicList')
    currectPlayIndex = index

    // 播放当前id的音乐
    this.loadingMusicDetail(id)
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