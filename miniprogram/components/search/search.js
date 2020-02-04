// components/search/search.js
const log = console.log.bind(console)
let keyword = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '请输入关键字...'
    }
  },
  // externalClasses: [
  //   'iconfont',
  //   'icon-sousuo',
  // ],
  // options: {
  //   styleIsolation: 'apply-shared'
  // },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event) {
      keyword = event.detail.value
    },
    onSearch() {
      // log(keyword)
      // blog
      this.triggerEvent('search', {
        keyword
      })
    },
  }
})