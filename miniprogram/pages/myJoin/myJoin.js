// pages/jieban-history/jieban-history.js
const MAX_LIMIT = 10
const db = wx.cloud.database()
const log = console.log.bind(console)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getListByMiniprogram()
  },

  _getListByCloudFn() {
    let a = this.data.blogList.length
    log('aaa', a)
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'send-user',
      data: {
        $url: 'getListByOpenid',
        start: this.data.blogList.length,
        count: MAX_LIMIT,
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })

      wx.hideLoading()
    }).catch((err) => {
      wx.hideLoading()
      wx.showToast({
        title: '到底了!',
      })
    })
  },

  _getListByMiniprogram() {
    wx.showLoading({
      title: '加载中',
    })
    db.collection('send-user').skip(this.data.blogList.length)
      .limit(MAX_LIMIT)
      .orderBy('createTime', 'desc').get()
      .then((res) => {
        console.log('----_getListByMiniprogram-----', res)
        let _bloglist = res.data
        for (let i = 0, len = _bloglist.length; i < len; i++) {
          _bloglist[i].createTime = _bloglist[i].createTime.toString()
        }
        this.setData({
          blogList: this.data.blogList.concat(_bloglist)
        })

        wx.hideLoading()
      })
  },
  goComment(event) {
    wx.navigateTo({
      url: `../jieban-comment/jieban-comment?bligId=${event.target.dataset.blogid}`,
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
    this._getListByCloudFn()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    const blog = event.target.dataset.blog
    return {
      title: blog.content,
      path: `/pages/jieban-comment/jieban-comment?blogId=${blog._id}`
    }
  }
})