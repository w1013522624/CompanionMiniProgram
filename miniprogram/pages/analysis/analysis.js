// pages/analysis/analysis.js
const log = console.log.bind(console)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.btnClick()
  },
  btnClick(start = 0) {
    wx.showLoading({
      title: '拼命加载中...',
    })

    wx.cloud.callFunction({
      name: 'send-jieban',
      data: {
        // start,
        // count: 10,
        // $url 路由的名字
        $url: 'list',
      }
    }).then((res) => {
      log('aaaaaaaaaaaaaa')
      this.setData({
        // blog 数据
        sendList: this.data.sendList.concat(res.result)
      })
      log(' this.data.sendList', this.data.sendList)
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }).catch((err) => {
      log('err', err)
      wx.hideLoading()
    })
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

  }
})