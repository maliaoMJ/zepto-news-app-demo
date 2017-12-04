const express = require('express')
const request = require('request')
const app = new express()
app.use(express.static('public'))
app.get('/', (req, res, next) => {
  res.json(req.headers)
})
app.get('/api/news', (req, res, next) => {
  request.get('https://news-at.zhihu.com/api/4/news/latest', (error, response,body) => {
    if (error) {
      console.log('proxy is error!' + error)
    }
    res.send(body)
  })
})
app.get('/api/image/',(req, res, next) => {
	request.get({url:req.query.img,headers:{referer:'https://news-at.zhihu.com/'}}).pipe(res)
})
app.listen(3000, () => {
  console.log('this server is start at port 3000')
})
module.exports = app
