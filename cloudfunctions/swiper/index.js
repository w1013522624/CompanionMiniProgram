// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 引入并加载 tcb-router 模块
const TcbRouter = require('tcb-router')

// 初始化数据库
const db = cloud.database()

const swiperCollection = db.collection('swiper')


// 云函数入口函数
exports.main = async(event, context) => {
  // 创建一个 TcbRouter
  const app = new TcbRouter({
    event
  })

  app.router('list', async (ctx, next) => {
    let swiperList = await swiperCollection.get()
      .then((res) => {
        return res.data
      })
    ctx.body = swiperList
  })
  

  return app.serve()
}