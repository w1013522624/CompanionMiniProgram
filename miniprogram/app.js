//app.js
// import DATracker from './utils/DATracker'
// DATracker.init('wxab9070e72a4ed7cb')
App({
  onLaunch: function(options) {
    console.log('onLaunch 执行1')
    // console.log(options)
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // 此处请填入环境 ID, 环境 ID 可打开云控制台查看
        env: 'friendship-w7v6t',
        traceUser: true,
      })
    }
    
    // this.getOpenid()

    this.globalData = {
      // playingMusicId: -1,
      // openid: -1,
    }
  },

  // onShow(options) {
  //   console.log('onShow 执行')
  //   console.log(options)
  // },

  // getOpenid() {
  //   wx.cloud.callFunction({
  //     name: 'login'
  //   }).then((res) => {
  //     const openid = res.result.openid
  //     this.globalData.openid = openid
  //     if (wx.getStorageSync(openid) == '') {
  //       wx.setStorageSync(openid, [])
  //     }
  //   })
  // },

  // checkUpate() {
  //   const updateManager = wx.getUpdateManager()
  //   // 检测版本更新
  //   updateManager.onCheckForUpdate((res) => {
  //     if (res.hasUpdate) {
  //       updateManager.onUpdateReady(() => {
  //         wx.showModal({
  //           title: '更新提示',
  //           content: '新版本已经准备好，是否重启应用',
  //           success(res) {
  //             if (res.confirm) {
  //               updateManager.applyUpdate()
  //             }
  //           }
  //         })
  //       })
  //     }
  //   })
  // },
})