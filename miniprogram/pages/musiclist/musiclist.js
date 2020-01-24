// pages/musiclist/musiclist.js
import {
  getCount
} from "../../api/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverImgUrl: '',
    name: '',
    description: '',
    creator: {},
    commentCount: 0,
    shareCount: 0,
    subscribedCount: "0",
    tracks:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.showLoading({
      title: '请稍后',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'playlist/detail',
        playlistId: options.playlistId
      }
    }).then(val => {
      console.log('获取歌单详细信息: ', val)
      const {
        coverImgUrl,
        name,
        description,
        creator,
        commentCount,
        shareCount,
        subscribedCount,
        tracks
      } = val.result.playlist
      this.setData({
        coverImgUrl,
        name,
        description,
        creator,
        commentCount,
        shareCount,
        tracks,
        subscribedCount: getCount(subscribedCount)
      })
      wx.hideLoading()
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