// pages/demo1/demo1.js
import regeneratorRuntime from '../../utils/runtime.js'
const db = wx.cloud.database()
const log = console.log.bind(console)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [],
    playlist: []
  },
    
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getSwiper()
  },
  _getSwiper() {
    wx.cloud.callFunction({
      name: 'swiper',
      data: {
        count: 10,
        // $url 路由的名字
        $url: 'list',

      }
    }).then((res) => {
      log('res', res.result)
      let as = res.result
      this.setData({
        swiperImgUrls: this.data.swiperImgUrls.concat(as)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})