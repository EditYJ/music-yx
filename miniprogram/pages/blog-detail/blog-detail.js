// pages/blog-detail/blog-detail.js
import {
  fmtTime
} from '../../api/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {},
    commentList: [],
    blogId: '',
    haveTalk: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      blogId
    } = options
    this.setData({
      blogId
    })
    console.log('进入详情页面，收到参数：', options)
    this.getDetail()
  },

  getDetail() {
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.cloud.callFunction({
      name: "blog",
      data: {
        blogId: this.data.blogId,
        $url: "getBlogById"
      }
    }).then(res => {
      console.log("获取博客详情：", res)
      wx.hideLoading()
      // 格式化时间
      const commentList = res.result.commonts.data.map(item => {
        return {
          ...item,
          createTime: fmtTime(new Date(item.createTime))
        }
      })
      if (commentList.length > 0) {
        this.setData({
          haveTalk: true
        })
      }
      this.setData({
        blog: {
          ...res.result.blogInfo[0]
        },
        commentList
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
  onShareAppMessage: function (e) {
    console.log(e)
    const {blog} = e.target.dataset
    return {
      title: blog.content,
      path: `/pages/blog-detail/blog-detail?blogId=${blog._id}`
    }
  }
})