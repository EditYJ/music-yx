// components/blogControl/blogControl.js
import {
  getUserInfoState,
  getDefaultTabBarHeight
} from '../../api/utils'

const db = wx.cloud.database()

let talkContent = ""
let userInfo = {}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String
  },

  externalClasses: [
    'iconfont',
    'talkicon',
    'shareicon'
  ],

  /**
   * 组件的初始数据
   */
  data: {
    showPanel: false,
    showTalkTextArea: false,
    bottomDistance: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTalk() {
      getUserInfoState((res) => {
        userInfo = res
        this.setData({
          showTalkTextArea: true
        })
      }, () => {
        this.setData({
          showPanel: true
        })
      })
    },
    handleShare() {
      console.log("点击了分享")
    },
    // 授权成功的回调函数
    onLoginSuccess(event) {
      userInfo = event.detail
      this.setData({
        showPanel: false,
      }, () => {
        this.setData({
          showTalkTextArea: true
        })
      })
    },
    // 授权失败的回调函数
    onLoginFail() {
      wx.showModal({
        title: '需要授权才能发布评论',
      })
    },

    // 处理评论textArea输入数据
    handleInput(e) {
      talkContent = e.detail.value
    },

    // 处理评论textArea 获取的焦点
    handleFocus(e) {
      if (e.detail.height == 0) {
        return
      }
      this.setData({
        bottomDistance: e.detail.height - getDefaultTabBarHeight()
      })
    },
    // 失去焦点
    handleBlur() {
      this.setData({
        bottomDistance: 0
      })
    },
    // 发布按钮
    push() {
      wx.showLoading({
        title: '发布中,请稍后...',
        mask: true
      })
      db.collection('blog-comment').add({
        data: {
          userInfo,
          content: talkContent,
          blogId: this.properties.blogId
        }
      }).then(() => {
        wx.hideLoading({
          complete: (res) => {
            this.setData({
              showTalkTextArea: false
            })
            wx.showToast({
              title: '发布成功！',
            })
          },
        })
      })
    },
    // 取消按钮
    cancel() {
      this.setData({
        showTalkTextArea: false
      })
    }
  }
})