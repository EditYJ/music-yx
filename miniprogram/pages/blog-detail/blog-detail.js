// pages/blog-detail/blog-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      blogId
    } = options
    console.log('进入详情页面，收到参数：', options)
    this.getDetail(blogId)
  },

  getDetail(blogId) {
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.cloud.callFunction({
      name: "blog",
      data: {
        blogId,
        $url: "getBlogById"
      }
    }).then(res => {
      console.log("获取博客详情：", res)
      wx.hideLoading()
      this.setData({
        blog: {
          ...res.result.blogInfo[0]
        }
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