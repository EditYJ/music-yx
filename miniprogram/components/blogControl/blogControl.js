// components/blogControl/blogControl.js
import {
  getUserInfoState,
  getDefaultTabBarHeight,
  requestSubMsg,
  fmtTime
} from '../../api/utils'

const db = wx.cloud.database()
const templateId = "2cQTxpd8lCGUnL93U_7HRCKAIyAUNWsICL5SvGqzx84"

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
      // 先请求发送订阅消息权限
      requestSubMsg(templateId).then((canSendMsg) => {
        wx.showLoading({
          title: '发布中,请稍后...',
          mask: true
        })
        db.collection('blog-comment').add({
          data: {
            userInfo,
            content: talkContent,
            blogId: this.properties.blogId,
            createTime: db.serverDate()
          }
        }).then(() => {
          wx.hideLoading()
          this.setData({
            showTalkTextArea: false
          })
          wx.showToast({
            title: '发布成功！',
          })
          if (canSendMsg) {
            // 请求云函数发送订阅消息
            wx.cloud.callFunction({
              name: 'sendSubMessage',
              data: {
                templateId,
                blogId: this.properties.blogId,
                result: '评价成功',
                content: talkContent,
              }
            }).then((res) => {
              console.log('订阅消息云函数调用结果：', res)
            })
          }
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