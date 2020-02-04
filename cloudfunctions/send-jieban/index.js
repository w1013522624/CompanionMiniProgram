// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')
// 初始化数据库
const db = cloud.database()

const sendCollection = db.collection('send-jieban')

const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('search', async(ctx, next) => {
    const keyword = event.keyword
    let w = {}
    if (keyword.trim() != '') {
      w = {
        content: db.RegExp({
          regexp: keyword,
          options: 'i',
        })
      }
    }
    let sendList = await sendCollection.where(w)
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc').get()
      .then((res) => {
        return res.data
      })
    ctx.body = sendList
  })

  app.router('list', async (ctx, next) => {
    let sendList = await sendCollection
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc').get()
      .then((res) => {
        return res.data
      })
    ctx.body = sendList
  })

  app.router('detail', async(ctx, next) => {
    let blogId = event.blogId
    // 详情查询
    let detail = await sendCollection.where({
      _id: blogId
    }).get().then((res) => {
      return res.data
    })
    // 评论查询
    const countResult = await sendCollection.count()
    const total = countResult.total
    let commentList = {
      data: []
    }
    if (total > 0) {
      // Math.ceil 向上取整
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      const tasks = []
      for (let i = 0; i < batchTimes; i++) {
        // 数据库名称 blog-comment
        let promise = db.collection('send-comment').skip(i * MAX_LIMIT)
          .limit(MAX_LIMIT).where({
            blogId
          }).orderBy('createTime', 'desc').get()
        tasks.push(promise)
      }
      if (tasks.length > 0) {
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }
    ctx.body = {
      detail,
      commentList,
    }

  })

  // skip 分页查询 limit 每次查询多少条
  const wxContext = cloud.getWXContext()
  app.router('getListByOpenid', async(ctx, next) => {
    ctx.body = await sendCollection.where({
        _openid: wxContext.OPENID
      }).skip(event.start).limit(event.count)
      .orderBy('createTime', 'desc').get()
      .then((res) => {
        return res.data
      })
  })


  // 查询是否在数据库中
  // const wxContext = cloud.getWXContext() 上面已经定义过了
  app.router('inDatabase', async (ctx, next) => {
    let blogId = event.blogId
    let sendList = await sendCollection.where({
        _openid: wxContext.OPENID,
        _id: blogId,
      }).orderBy('createTime', 'desc').get()
      .then((res) => {
        return res.data
      })
    ctx.body = sendList
  })


  return app.serve()
}