// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 引入并加载 tcb-router 模块
const TcbRouter = require('tcb-router')

// 初始化数据库
const db = cloud.database()

const userCollection = db.collection('send-user')


// 云函数入口函数
exports.main = async(event, context) => {
  // 创建一个 TcbRouter
  const app = new TcbRouter({
    event
  })

  app.router('list', async(ctx, next) => {
    let blogId = event.blogId
    // 以 createTime 字段进行排序, 逆序排序 desc
    let userList = await userCollection.where({
        blogId: blogId
      })
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc').get()
      .then((res) => {
        return res.data
      })
    ctx.body = userList
  })

  app.router('being', async(ctx, next) => {
    let blogId = event.blogId
    let nickName = event.nickName

    // 以 createTime 字段进行排序, 逆序排序 desc
    let userList = await userCollection.where({
        blogId: blogId,
        nickName: nickName
      })
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc').get()
      .then((res) => {
        return res.data
      })
    ctx.body = userList
  })

  const wxContext = cloud.getWXContext()
  app.router('inDatabase', async (ctx, next) => {
    let blogId = event.blogId
    let name = event.nickName
    let headName = event.head

    ctx.body = await userCollection.where({
      _openid: wxContext.OPENID,
      blogId: blogId,
      nickName: name,
      head: headName,
    }).orderBy('createTime', 'desc').get()
      .then((res) => {
        return res.data
      })
  })


  return app.serve()
}