// components/bottomModel/bottomModel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showPanel:{
      type: Boolean,
      value: false
    }
  },

  options: {
    styleIsolation: "apply-shared"
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    closePanel(){
      this.setData({
        showPanel: false
      })
    }
  }
})