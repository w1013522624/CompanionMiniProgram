// miniprogram/pages/jieban/jieban.js
import regeneratorRuntime from '../../utils/runtime.js'
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
    blogList: [],
    swiperImgUrls: [
      { _id: "a1945dbb-a0e8-43d0-9650-23168334012a", fileid: "cloud://friendship-w7v6t.6672-friendship-w7v6t-1300264992/swiper/2.png" },
    ],
  },
  externalClasses: [
    'iconfont',
    'icon-fabu',
  ],
  openPlan() {
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

  onLoginSuccess(event) {
    // console.log(event)
    const detail = event.detail
    wx: wx.navigateTo({
      url: `../pages/send-fabu/send-fabu?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`
    })
  },

  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },
  // 发布功能
  onPublish() {
    // 判断用户是否授权
    wx.getSetting({
      success: (res) => {
        // console.log(res)
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

  onLoginSuccess(event) {
    // console.log(event)
    const detail = event.detail
    wx: wx.navigateTo({
      url: `../jieban-fabu/jieban-fabu?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`
    })
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
  onLoad: function (options) {
    console.log('sss', options.scene)

    // 加载 blog 数据
    this._loadBlogList()
    // this._getSwiper()
  },
  

  // 关键字搜索
  onSearch(event) {
    // console.log(event.detail.keyword)
    this.setData({
      blogList: [],
    })
    keyword = event.detail.keyword
    this._searchList(0)
  },
  // 搜索
  _searchList(start = 0) {
    wx.showLoading({
      title: '拼命加载中...',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        keyword,
        start,
        count: 10,
        // $url 路由的名字
        $url: 'search',

      }
    }).then((res) => {
      console.log('res 搜索', res)
      this.setData({
        // blog 数据
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },

  // blog 数据
  _loadBlogList(start = 0) {
    wx.showLoading({
      title: '拼命加载中...',
    })
    wx.cloud.callFunction({
      name: 'gethelp',
      data: {
        start,
        count: 10,
        // $url 路由的名字
        $url: 'list',

      }
    }).then((res) => {
      console.log('res Help 列表', res)
      this.setData({
        // blog 数据
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },

  goComment(event) {
    wx.navigateTo({
      url: '../../pages/jieban-comment/jieban-comment?blogId=' + event.target.dataset.blogid,
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
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    console.log(event)
    let blogObj = event.target.dataset.blog
    return {
      title: blogObj.content,
      path: `/pages/jieban-comment/jieban-comment?blogId=${blogObj._id}`,
      // imageUrl: ''
    }
  }
})