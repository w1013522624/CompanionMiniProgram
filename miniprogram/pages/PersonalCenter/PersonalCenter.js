// pages/profile/profile.js
const log = console.log.bind(console)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否登录
    log('个人', options)
    // this._power()
  },
  // --------------------------------------------------------
  // 注册登录
  regestered() {
    // 判断用户是否授权
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              log('存在登录:', res)
              this.onLoginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else {
          this.setData({
            modalShow: true,
          })
        }
      }
    })
  },
  onLoginSuccess(event) {
    console.log('授权登录成功! event:', event)
    const detail = event.detail
    wx.navigateTo({
      url: `../registered/registered?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`
    })
  },
  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },



  // -------------------------------------------
  onTapQrCode() {
    wx.showLoading({
      title: '生成中...',
    })
    wx.cloud.callFunction({
      name: 'getQrCode'
    }).then((res) => {
      console.log(res)
      const fileId = res.result
      wx.previewImage({
        urls: [fileId],
        current: fileId
      })
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