// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 引入并加载 tcb-router 模块
const TcbRouter = require('tcb-router')

// 初始化数据库
const db = cloud.database()

const blogCollection = db.collection('test1')

const MAX_LIMIT = 100

// 云函数入口函数
exports.main = async(event, context) => {
  // 创建一个 TcbRouter
  const app = new TcbRouter({
    event
  })

  // 博客列表
  app.router('list', async(ctx, next) => {
    // 以 createTime 字段进行排序, 逆序排序 desc
    let blogList = await blogCollection
      // .skip(event.start)
      // .limit(event.count)
      .orderBy('createTime', 'desc').get()
      .then((res) => {
        return res.data
      })
    ctx.body = blogList
  })


  return app.serve()
}