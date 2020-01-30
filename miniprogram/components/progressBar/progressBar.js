// components/progressBar/progressBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    currectTime: '00:00',
    totalTime: '00:00',
    moveDis: 0,
    process: 0,
  },

  lifetimes:{
    ready(){
      this.getMoveDis()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 查询节点信息
    getMoveDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((exec) => {
        console.log(exec)
      })
    }
  }
})