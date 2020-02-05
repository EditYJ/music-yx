// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPanel: false
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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