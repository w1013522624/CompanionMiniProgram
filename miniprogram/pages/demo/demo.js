Page({
  data: {
    date: '2016-09-01',
    time: '12:01',
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部'
  },
  
  bindDateChange: function (e) {
    console.log('3 日期选择器', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('4 时间选择器', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    console.log('5 省市选择器', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  }
})