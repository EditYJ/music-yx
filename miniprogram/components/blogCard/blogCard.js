// components/blogCard/blogCard.js
import {
  fmtTime
} from '../../api/utils'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },
  observers: {
    ['blog.createTime'](val) {
      if (val) {
        this.setData({
          createTime: fmtTime(new Date(val))
        })
      }
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    createTime: '',
    total: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handlePreView(e) {
      const ds = e.target.dataset
      wx.previewImage({
        urls: ds.imglist,
        current: ds.img
      })
    }
    
  }
})