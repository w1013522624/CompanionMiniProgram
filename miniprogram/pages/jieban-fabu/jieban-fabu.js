// 最大输入文字的个数
const MAX_WORDS_NUM = 140
// 最大上传图片的数量
const MAX_IMG_NUM = 9
const log = console.log.bind(console)
// 数据库初始化操作
const db = wx.cloud.database()
// 当前输入的文字内容
let content = ''
// 表示对象 存入用户头像等信息
let userInfo = {}
let address = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 输入的文字个数
    wordsNum: 0,
    footerBottom: 0,
    images: [],
    selectPhoto: true, //添加图片的元素是否显示
  },
  getLocation() {
    let that = this
    wx.chooseLocation({
      success: (res) => {
        log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          jingwei: "经纬度：" + longitude + ", " + latitude,
          address: res.address,
          name: "  地名：" + res.name
        })
        address = this.data.address
      }
    })
  },
  onInput(event) {
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum: wordsNum
    })
    // 当前输入的文字内容
    content = event.detail.value
  },

  // 获取焦点
  onFocus(event) {
    // 模拟器获取的键盘高度为 0
    // console.log(event)
    this.setData({
      footerBottom: event.detail.height
    })
  },
  // 失去焦点
  onBlur(event) {
    // console.log(event)
    this.setData({
      footerBottom: 0
    })
  },

  onChooseImage() {
    // 还能再选几张图片
    let max = MAX_IMG_NUM - this.data.images.length
    // console.log('max', max)
    wx.chooseImage({
      count: max,
      // 图片类型 初始值, 压缩后的
      sizeType: ['original', 'compressed'],
      // 源头类型 手机相册, 相机拍照
      sourceType: ['album', 'camera'],
      // 成功以后
      success: (res) => {
        console.log(res)
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        // 还能再选几张图片
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      },
    })
  },

  // 删除点击图片
  onDelImg(event) {
    this.data.images.splice(event.target.dataset.index, 1)
    // console.log(a)
    this.setData({
      images: this.data.images
    })
    if (this.data.images.length == MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true,
      })
    }
  },
  // 图片预览
  onPreviewImage(event) {
    // 2/9
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc,
    })
  },

  send() {
    // 2、数据 -> 云数据库
    // 数据库：内容、图片fileID、openid(小程序唯一标识)、昵称、头像、时间
    // 1、图片 -> 云存储 5g空间, 云存储会返回图片的 fileID 云文件ID

    // trim() 去掉前后的空格
    if (content.trim() === '') {
      // 给个提示
      wx.showModal({
        title: '请输入内容...',
        content: '',
      })
      return
    } else if (address === '') {
      wx.showModal({
        title: '请获取地址...',
        content: '',
      })
      return
    }

    // 等待界面
    wx.showLoading({
      title: '发布中...',
      // 蒙板 遮住信息, 禁止用户点击
      mask: true,
    })

    // 存入数组 保存每一个 promise 对象
    let promiseArr = []
    // file ID 是多个, 存入 fileIds 中
    const fileIds = []

    // 图片上传 一张一张上传
    for (let i = 0, len = this.data.images.length; i < len; i++) {
      // 上传图片 是 异步操作
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]

        // 获取图片的扩展名 正则表达式
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          // 云端 path
          cloudPath: 'send-jieban/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
          filePath: item,
          success: (res) => {
            // 上传成功 打印出返回值
            // console.log('res:', res)
            console.log(res.fileID)
            // 在 fileIds 中追加新的 fileID 的值
            // fileIds = fileIds.concat(res.fileID)
            fileIds.push(res.fileID)
            resolve()
          },
          fail: (err) => {
            console.log(err)
            reject()
          }
        })
      })
      promiseArr.push(p)
    }
    // 存入到云数据库中
    Promise.all(promiseArr).then((res) => {
      // 向 'blog' 这个集合插入数据
      db.collection('blog').add({
        // 需要插入的数据
        data: {
          // 扩展运算符，取到 userInfo 里的每一个属性
          ...userInfo,
          // 当前输入的文字内容
          content,
          address: this.data.address,
          // 图片
          img: fileIds,
          // 获取服务端时间
          createTime: db.serverDate(),
        }
      }).then((res) => {
        // 隐藏等待界面
        wx.hideLoading()
        wx.showToast({
          title: '发布成功！',
        })

        // 返回 blog 页面, 并且刷新
        wx.navigateBack()
        const pages = getCurrentPages()
        // console.log(pages)
        // 取到上一个页面
        const prePage = pages[pages.length - 2]
        prePage.onPullDownRefresh()

      }).catch((err) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布失败！',
        })
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    // 用户信息
    userInfo = options
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