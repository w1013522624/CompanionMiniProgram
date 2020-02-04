const log = console.log.bind(console)
// 数据库初始化操作
const db = wx.cloud.database()
let userInfo = {}
let studentName = ''
let studentGrade = ''
let studentId = ''
let studentPassword = ''
let b1 = 0
let b2 = 0
let b3 = 0
Page({
  data: {
    modalShow: Boolean,
    list1: ['主三', '主五', '公一', '主一'],
    list2: ['4', '5', '6', '7'],
    list3: ['小蓝', '小翠', '小绿', '小黄'],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    log('options', options)
    userInfo = options
    this.setData({
      nickName: options.nickName
    })
  },

  getName(event) {
    studentName = event.detail.value
    log('姓名: ', studentName)
  },
  getGrade(event) {
    studentGrade = event.detail.value
    log('年级: ', studentGrade)
  },
  getStudentId(event) {
    studentId = event.detail.value
    log('学号: ', studentId)
  },
  getPassword(event) {
    studentPassword = event.detail.value
    log('密码: ', studentPassword)
  },

  bindSeclectUser1(e) {
    let a = e.detail.value
    b1 = parseInt(e.detail.value)
    console.log('图书馆在哪儿: ', a, typeof a)
    this.setData({
      ans1: this.data.list1[b1]
    })
  },
  bindSeclectUser2(e) {
    let a = e.detail.value
    b2 = parseInt(e.detail.value)
    console.log('主楼几栋: ', a, typeof a)
    this.setData({
      ans2: this.data.list2[b2]
    })
  },
  bindSeclectUser3(e) {
    let a = e.detail.value
    b3 = parseInt(e.detail.value)
    console.log('自行车: ', a, typeof a)
    this.setData({
      ans3: this.data.list3[b3]
    })
  },
  judgeInput() {
    let that = this
    // 判断是否输入学号密码
    if (studentName.trim() === '') {
      // 给个提示
      wx.showModal({
        title: '请输入姓名...',
      })
      return
    } else if (studentGrade.trim() === '') {
      wx.showModal({
        title: '请输入年级...',
      })
      return
    } else if (studentId.trim() === '') {
      wx.showModal({
        title: '请输入学号...',
      })
      return
    } else if (studentPassword.trim() === '') {
      wx.showModal({
        title: '请输入教务系统密码...',
      })
      return
    } else {
      that.judgeQuestion()
    }
  },

  judgeQuestion() {
    let that = this
    // 判断题目是否答对
    if (b1 != 0 || b2 != 1 || b3 != 2) {
      wx.showModal({
        title: '题目回答错误!',
        content: '请更加了解学校再注册',
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000);
    } else {
      log('题目答对了 加入数据库')
      // that.judgeRepeatRegester()
      // 添加数据到数据库
      that.addToDatabase()
    }
  },

  judgeRepeatRegester() {
    let that = this
    // 是否重复注册
    // 检查同一个小程序 openId 是否注册过
    wx.cloud.callFunction({
      name: 'registered',
      data: {
        // $url 路由的名字
        $url: 'checkSave',
      }
    }).then((res) => {
      log('是否重复注册', res.result)
      if (res.result == '') {
        log('没有注册!')
        // 判断是否输入学号密码
        that.judgeInput()
      } else if (res.result != '') {
        wx.showToast({
          title: '已注册...',
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
        return
      }
    })

  },

  addToDatabase() {
    // 添加入数据库
    db.collection('registered').add({
      // 需要插入的数据
      data: {
        // 扩展运算符，取到 userInfo 里的每一个属性
        ...userInfo,
        // 姓名 年级 学号 密码
        studentName,
        studentGrade,
        studentId,
        studentPassword,
        // 获取服务端时间
        createTime: db.serverDate(),
      }
    }).then((res) => {
      log('注册成功! 返回res', res)
      wx.showToast({
        title: '注册成功!',
        mask: true,
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 2000);
    })
  },
  // 注册用户
  regester() {
    // 是否重复注册 如果没有 就添加入数据库
    this.judgeRepeatRegester()
    
    
    // 判断是否输入学号密码
    // this.judgeInput()

    // 判断题目是否答对
    // this.judgeQuestion()

    // 是否重复注册 如果没有 就添加入数据库
    // this.judgeRepeatRegester()

    // let p1 = new Promise((resolve, reject) => {
    //   // 判断是否输入学号密码
    //   this.judgeInput()
    //   resolve()
    // })
    // let p2 = new Promise((resolve, reject) => {
    //   // 判断题目是否答对
    //   this.judgeQuestion()
    //   resolve()
    // })

    // Promise.all([p1, p2]).then((res) => {
    //   // 是否重复注册 如果没有 就添加入数据库
    //   this.judgeRepeatRegester()
    //   wx.hideLoading()
    // }).catch((err) => {
    //   log('fail', err)
    // })
    
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