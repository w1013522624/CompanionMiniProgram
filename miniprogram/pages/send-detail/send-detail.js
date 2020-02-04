// pages/jieban-comment/jieban-comment.js
import formatTime from '../../utils/formatTime.js'
const log = console.log.bind(console)
// 数据库初始化操作
const db = wx.cloud.database()
let yonghu = ''
let head = ''
let renShu = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {},
    commentList: [],
    blogId: '',
    judge1: false,
    addUser: {},
    userList: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    log('blogId: ', options)
    this.setData({
      blogId: options.blogId,
      masterId: options.blogId,
    })
    this._getBlogDetail()
    this._ourPeople()
  },
  
  _getBlogDetail() {
    // 加载博客
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    wx.cloud.callFunction({
      name: 'send-jieban',
      data: {
        blogId: this.data.blogId,
        $url: 'detail'
      }
    }).then((res) => {
      // log('res.detail: ', res.result)
      let commentList = res.result.commentList.data
      log('commentList: ', commentList)
      for (let i = 0, len = commentList.length; i < len; i++) {
        commentList[i].createTime = formatTime(new Date(commentList[i].createTime))
      }
      wx.hideLoading()
      this.setData({
        blog: res.result.detail[0],
        commentList: commentList,
      })
      log('博客详情信息!!!', this.data.blog)
    }).catch((err) => {
      log(err)
    })
  },
  
  _ourPeople(start = 0) {
    // 加入的结伴者的个人信息
    wx.cloud.callFunction({
      name: 'JiebanUser',
      data: {
        blogId: this.data.blogId,
        start,
        count: 10,
        $url: 'list'
      }
    }).then((res) => {
      this.data.userList = res.result
      log('加入的信息', this.data.userList)
    })
  },
  
  judgePower() {
    let that = this
    // 判断是否授权
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              let a = res.userInfo
              log('已授权 想加入结伴者的个人信息:', a)
              yonghu = a
              that.judgeInSheet()
            }
          })
        }
      }
    })
  },

  judgeInSheet() {
    let that = this
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
        log('存在数据表中 √')
        that.judgeOwner()
      } else {
        wx.showModal({
          title: '未注册, 请注册后重试!',
        })
        return
      }
    })
  },
  
  judgeOwner() {
    let that = this
    // 判断是否为自己发布的结伴信息
    // 查询发布结伴表 send-jieban(inDatabase) 云函数
    // 博客 _id, 我的 _openid, 如果返回有结果 就不允许加入结伴
    wx.cloud.callFunction({
      name: 'send-jieban',
      data: {
        // 博客的 id
        blogId: this.data.blog._id,
        // blogTime: this.data.blog.createTime,
        // $url 路由的名字
        $url: 'inDatabase',
      }
    }).then((res) => {
      let a = res.result
      // log('在里面码? 有数据就证明是自己发的博客', res.result)
      if (a != '') {
        wx.hideLoading()
        wx.showModal({
          title: '不能加入自己的结伴!',
          content: '',
        })
        return
      } else {
        that.judgeJoined()
      }
    })

  },

  judgeJoined() {
    let that = this
    // 判断是否已经加入这个结伴
    // 查询结伴加入表 看自己的 _openid 是否在里面呢
    // 如果是 就提示已经加入结伴了, 否就加入结伴表 提示加入成功!
    wx.cloud.callFunction({
      name: 'JiebanUser',
      data: {
        // 博客的 id
        blogId: this.data.blog._id,
        head: this.data.blog.head,
        name: yonghu.nickName,
        // blogTime: this.data.blog.createTime,
        // $url 路由的名字
        $url: 'inDatabase',
      }
    }).then((res) => {
      let a = res.result
      log('n--- 有数据就证明是自己发的博客', res.result)
      if (a != '') {
        wx.hideLoading()
        wx.showModal({
          title: '已经加入,请勿重复加入!',
          content: '',
        })
        return
      } 
      else {
        that._judgeFull()
      }
    })


  },

  joinUs(event) {
    // 加入结伴
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    this.judgePower()
    // // log('event', event.target)
    // // 使用 promise
    // let p1 = new Promise((resolve, reject) => {
    //   // 判断是否授权
    //   this.judgePower()
    //   resolve()
    // })
    // let p2 = new Promise((resolve, reject) => {
    //   // 判断是否注册
    //   this.judgeInSheet()
    //   resolve()
    // })
    // let p3 = new Promise((resolve, reject) => {
    //   // 判断是否为自己发布的结伴信息
    //   this.judgeOwner()
    //   log('不是自己的结伴啦')
    //   resolve()
    // })
    // let p4 = new Promise((resolve, reject) => {
    //   // 判断是否已经加入这个结伴
    //   this.judgeJoined()
    //   resolve()
    // })
    // let p5 = new Promise((resolve, reject) => {
    //   // 判断这条结伴信息是否已满
    //   this._judgeFull()
    //   resolve()
    // })

    // Promise.all([p1, p2, p3, p4, p5]).then((res) => {
    //   log('可以加入结伴啦~')
    //   this._saveUserDatabase()
    //   wx.hideLoading()
    // }).catch((err) => {
    //   log('fail', err)
    // })
  },
  
  _judgeFull(start = 0) {
    // 判断这条博客有无人加入
    let that = this
    log('开始判断数据库是否已满了e~~~, 先不判断~~~')
    wx.cloud.callFunction({
      name: 'JiebanUser',
      data: {
        blogId: this.data.blogId,
        start,
        count: 10,
        // $url 路由的名字
        $url: 'list',
      }
    }).then((res) => {
      log('res12312: ', res)
      let lenJoin = res.result.length
      log('长度: ', lenJoin)
      // if 长度小于 结伴人数 加入数据库
      renShu = this.data.blog.renShu
      if(lenJoin >= renShu - 1) {
        wx.showModal({
          title: '人数满啦~',
          content: '',
        })
        wx.hideLoading()
        log('人数已满!')
        return        
      } else {
        log('_judgeFull finish, 可以加入结伴啦!!!!')
        that._saveUserDatabase()
      }
      
    })
  },

  _saveUserDatabase() {
    // 存入jieban-user数据库
    log('开始存啦~~')
    let blog = this.data.blog
    let blogId = blog._id
    let head = blog.head
    let renShu = blog.renShu
    log('blog~~', blog)
    // ------------------------------
    db.collection('send-user').add({
      // 需要插入的数据
      data: {
        // 扩展运算符，取到 yonghu 里的每一个属性
        ...yonghu,
        blogId,
        // 当前输入的标题
        head,
        renShu,
        // 获取服务端时间
        createTime: db.serverDate(),
      }
    }).then((res) => {
      log('成功!', res)
      wx.hideLoading()
      wx.showToast({
        title: '加入成功!',
      })
    }).catch((err) => {
      wx.hideLoading()
      wx.showToast({
        title: '加入失败！',
      })
      log('err', err)
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
    const blog = this.data.blog
    return {
      title: blog.content,
      path: `/pages/jieban-detail/jieban-detail?blogId=${blog._id}`
    }
  }
})