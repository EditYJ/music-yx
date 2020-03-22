// components/search/search.js
let keywords = ""
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '请输入内容...'
    }
  },

  externalClasses: [
    'iconfont-class',
    'search-icon'
  ],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(e) {
      keywords = e.detail.value
    },
    search() {
      this.triggerEvent("search", { keywords })
    }
  }
})