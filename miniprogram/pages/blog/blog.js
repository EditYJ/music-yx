// pages/blog/blog.js
let keywords = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPanel: false,
    blogList: [],
    showTip: true
  },
  onSearch(e) {
    this.setData({
      blogList: []
    })
    keywords = e.detail.keywords
    this.loadingBlogList()
  },

  // 发布
  publishThink() {
    wx.getSetting({
      success: (res) => {
        console.log('获取授权情况: ', res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              console.log('获取用户信息: ', res)
              this.onLoginSuccess({
                detail: res.userInfo
              })
            },
          })
        } else {
          this.setData({
            showPanel: true
          })
        }
      }
    })
  },
  // 授权成功的回调函数
  onLoginSuccess(event) {
    const {
      nickName,
      avatarUrl
    } = event.detail

    wx.navigateTo({
      url: `/pages/blog-edit/blog-edit?nickName=${nickName}&avatarUrl=${avatarUrl}`,
    })

  },
  // 授权失败的回调函数
  onLoginFail() {
    wx.showModal({
      title: '需要授权才能发布评论',
    })
  },
  // 获取博客列表
  loadingBlogList(start = 0) {
    wx.showLoading({
      title: '请稍后...',
    })
    if (start == 0) {
      this.setData({
        showTip: true
      })
    }

    wx.cloud.callFunction({
      name: "blog",
      data: {
        start,
        keywords,
        count: 10,
        $url: "getList"
      }
    }).then(res => {
      console.log("博客列表", res)
      this.setData({
        blogList: [...this.data.blogList, ...res.result]
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
      if (res.result.length <= 0) {
        this.setData({
          showTip: false
        })
      }
    })
  },
  enterDetail(e) {
    const ds = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/blog-detail/blog-detail?blogId=${ds.blogId}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadingBlogList(0)
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
    this.setData({
      blogList: []
    })
    this.loadingBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.showTip == true) {
      this.loadingBlogList(this.data.blogList.length)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})