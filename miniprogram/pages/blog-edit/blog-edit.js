// pages/blog-edit/blog-edit.js
const MAX_WORDS_LENGTH = 140
const MAX_IMG_NUM = 9
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    bottom: 0,
    images: [],
    isFullImg: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('博客编辑页面接收参数:', options)
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

  },

  //////////////
  // 处理输入事件
  handleInput(e) {
    let length = e.detail.value.length
    if (length >= MAX_WORDS_LENGTH) {
      length = `最大字数为${MAX_WORDS_LENGTH}`
    }
    this.setData({
      wordsNum: length
    })
  },
  // 处理获取焦点事件
  handleFocus(e) {
    this.setData({
      bottom: e.detail.height
    })
  },
  // 处理失去焦点事件
  handleBlur(e) {
    this.setData({
      bottom: 0
    })
  },
  // 选择图片
  handleChooseImg() {
    const max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      complete: (res) => {
        this.setData({
          images: [...this.data.images, ...res.tempFiles],
        })
        this.setData({
          isFullImg: MAX_IMG_NUM - this.data.images.length <= 0 ? true : false
        })
      },
    })
  },
  // 删除当前图片
  handleImgDel(e) {
    const currectIndex = e.target.dataset.index
    this.data.images.splice(currectIndex, 1)
    this.setData({
      images: this.data.images,
      isFullImg: MAX_IMG_NUM - this.data.images.length <= 0 ? true : false
    })
  },
  // 预览当前图片
  handlePreView(e) {
    wx.previewImage({
      urls: this.data.images.map(val => {
        return val.path
      }),
      current: e.target.dataset.imageUrl
    })
  }
})