const Koa = require('koa')
const Router = require('koa-router')
const static = require('koa-static')
const bodyParser = require('koa-bodyparser');
const axios = require('axios')
const app = new Koa()
app.use(bodyParser())
const router = new Router()
app.use(static(__dirname + '/'))
const conf = require('./conf')

const wechat = require('co-wechat')
const WechatAPI = require('co-wechat-api')
const OAuth = require('co-wechat-oauth')


router.all('/wechat', wechat(conf).middleware(
    async message => {
        console.log('wechat..', message)
        return 'Hello World! ' + message.Content
    }
))

const tokenCache = {
    access_token: '',
    updateTime: Date.now(),
    expires_in: 7200
}
// const wxDomain = `https://api.weixin.qq.com`
// router.get('/getToken', async ctx => {
//     console.log('..getToken')
//     const path = `/cgi-bin/token`
//     const params = `?grant_type=client_credential&appid=${conf.appid}&secret=${conf.appsecret}`
//     const url = wxDomain + path + params
//     const res = await axios.get(url)
//     Object.assign(tokenCache, res.data, {
//         updateTime: Date.now()
//     })
//     ctx.body = res.data
// })

// router.get('/getFollowers', async ctx => {
//     const url = `${wxDomain}/cgi-bin/user/get?access_token=${tokenCache.access_token}`
//     const res = await axios.get(url)
//     console.log('getFollowers', res.data)
//     ctx.body = res.data
// })
const { ServerToken, ClientToken } = require('./mongoose')
const api = new WechatAPI(conf.appid, conf.appsecret,
    async function () {
        console.log(1111)
        return await ServerToken.findOne()
    },
    async function (token) {
        console.log(2222, token)
        const res = await ServerToken.updateOne({}, token, { upsert: true })
    }
)

router.get('/getFollowers', async ctx => {
    let res = await api.getFollowers();
    res = await api.batchGetUsers(res.data.openid, 'zh_CN')
    ctx.body = res
})

const oauth = new OAuth(conf.appid, conf.appsecret,
    async function (openid) {
        return await ClientToken.getToken(openid)
    },
    async function (openid, token) {
        return await ClientToken.setToken(openid, token)
    }
)

router.get('/wxAuthorize', async ctx => {
    const state = ctx.query.id
    redirectUrl = ctx.href
    redirectUrl = redirectUrl.replace('wxAuthorize', 'wxCallback')
    const scope = 'snsapi_userinfo' //授权类型
    const url = oauth.getAuthorizeURL(redirectUrl, state, scope)
    console.log('url:', url)
    ctx.redirect(url)

})
router.get('/wxCallback', async ctx => {
    const code = ctx.query.code // 授权码
    console.log('wxCallback.....', code)
    const token = await oauth.getAccessToken(code)
    const accessToken = token.data.access_token
    const openid = token.data.openid
    console.log('accessToken', accessToken)
    console.log('openid', openid)

    ctx.redirect('/?openid=' + openid)
})

router.get('/getUser', async ctx => {
    const openid = ctx.query.openid
    const userInfo = await oauth.getUser(openid)
    ctx.body = userInfo
})

router.get('/getJsConfig',async ctx => {
    console.log('getJSSDK ',ctx.query)
    const res = await api.getJsConfig(ctx.query)
    console.log('res',res)
    ctx.body = res
})




app.use(router.routes()); /*启动路由*/
app.use(router.allowedMethods());
app.listen(3000);


