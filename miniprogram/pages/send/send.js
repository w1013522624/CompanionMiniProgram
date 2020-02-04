// pages/send/send.js
const log = console.log.bind(console)
// 搜索关键字
let keyword = ''
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 控制底部弹出层是否显示
    modalShow: false,
    sendList: [],
  },
  externalClasses: [
    'iconfont',
    'icon-fabu',
  ],
  goComment(event) {
    wx.navigateTo({
      url: '../../pages/send-detail/send-detail?blogId=' + event.target.dataset.blogid,
    })
    // log(event)
  },


  // 发布功能
  onPublished() {
    // 判断用户是否授权
    wx.getSetting({
      success: (res) => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              // console.log(res)
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


  judgeInSheet(detail) {
    // 判断是否在注册的用户表中
    wx.cloud.callFunction({
      name: 'registered',
      data: {
        // $url 路由的名字
        $url: 'checkSave',
      }
    }).then((res) => {
      log('是否存在数据表中 res', res)
      if (res.result != '') {
        log('存在数据表中')
        wx: wx.navigateTo({
          url: `../send-fabu/send-fabu?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`
        })
      } else {
        wx.navigateTo({
          url: `../registered/registered?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`
        })
      }

    })
  },

  onLoginSuccess(event) {
    // 授权成功
    const detail = event.detail

    // 判断是否在注册的用户表中
    this.judgeInSheet(detail)


  },

  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('happy: ', options)
    // 加载 send 数据
    this._loadSendList()
  },
  onSearch(event) {
    this.setData({
      sendList: [],
    })
    keyword = event.detail.keyword
    this._searchList(0)
  },
  // 搜索 数据
  _searchList(start = 0) {
    wx.showLoading({
      title: '拼命加载中...',
    })
    wx.cloud.callFunction({
      name: 'send-jieban',
      data: {
        keyword,
        start,
        count: 10,
        // $url 路由的名字
        $url: 'search',

      }
    }).then((res) => {
      this.setData({
        // blog 数据
        sendList: this.data.sendList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },

  // send 数据
  _loadSendList(start = 0) {
    wx.showLoading({
      title: '拼命加载中...',
    })
    wx.cloud.callFunction({
      name: 'send-jieban',
      data: {
        start,
        count: 10,
        // $url 路由的名字
        $url: 'list',
      }
    }).then((res) => {
      // log('res:-------', res)
      this.setData({
        // blog 数据
        sendList: this.data.sendList.concat(res.result)
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
    this.data.sendList = []
    this._loadSendList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let n = this.data.sendList.length
    this._loadSendList(n)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(event) {

  }
})