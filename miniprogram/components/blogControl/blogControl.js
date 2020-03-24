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
    blogId: String,
    blog: Object,
    showNum: {
      type: Boolean,
      value: false
    },
    typeBottom: {
      type: Number,
      value: 1
    }
  },

  externalClasses: [
    'iconfont',
    'talkicon',
    'shareicon'
  ],
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      this.getDetail(this.properties.blogId)
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showPanel: false,
    showTalkTextArea: false,
    bottomDistance: 0,
    total: 0,
    bottomDistance: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 查询评论数量
    getDetail(blogId) {
      wx.cloud.callFunction({
        name: "blog",
        data: {
          blogId,
          $url: "getBlogById"
        }
      }).then(res => {
        this.setData({
          total: res.result.total
        })
      })
    },
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
      console.log(e.detail.height)
      if (e.detail.height == 0) {
        return
      } else if (this.properties.typeBottom == 2) {
        this.setData({
          bottomDistance: e.detail.height - 300
        })
      } else {
        this.setData({
          bottomDistance: e.detail.height - getDefaultTabBarHeight()
        })
      }

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
          this.triggerEvent('reflash', '')
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