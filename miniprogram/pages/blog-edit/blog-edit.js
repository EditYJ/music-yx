// pages/blog-edit/blog-edit.js
const MAX_WORDS_LENGTH = 140
const MAX_IMG_NUM = 9

const db = wx.cloud.database()

// 输入的内容
let content = ""
let userInfo = {}
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
    userInfo = options
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
    content = e.detail.value
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
  },
  // 发布
  pushContent() {
    if (content.trim() == '') {
      wx.showModal({
        title: '内容为空',
        content: '请输入内容,再继续发布'
      })
      return
    }
    wx.showLoading({
      title: '发布中...',
    })
    const promiseArr = this.data.images.map(item => {
      return new Promise((resolve, reject) => {
        const suffix = /\.\w+$/.exec(item.path)
        wx.cloud.uploadFile({
          cloudPath: `blog/${Date.now()}-${Math.random()*100000}${suffix}`,
          filePath: item.path,
          success: (res) => {
            resolve(res)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    })

    Promise.all(promiseArr).then(arr => {
      const imgIds = arr.map(item => {
        return item.fileID
      })
      db.collection('blog').add({
        data: {
          userInfo,
          content,
          imgIds,
          createTime: db.serverDate()
        }
      }).then(() => {
        wx.hideLoading({
          complete: () => {
            wx.showToast({
              title: '发布成功',
            })
          },
        })

        // 回到博客列表界面/并刷新
        wx.navigateBack({
          complete: (res) => {},
        })
      })
    }).catch(err => {
      wx.hideLoading({
        complete: () => {
          wx.showToast({
            title: '发布失败，请重试',
          })
        },
      })
    })
  }
})