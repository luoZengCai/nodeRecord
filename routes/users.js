const Router = require("koa-router");
const router = new Router({prefix:"/users"});

router.get("/",ctx => {
    ctx.body = "users";
})

router.post("/login",ctx => {
    //拿出请求参数
    const body = ctx.request.body
    console.log(body);
    

    //登录成功
    ctx.session.userinfo = body.username;

    ctx.body = {
        ok: 1,
        message: '登录成功'
    };
})

router.post("/logout",ctx => {
    delete ctx.session.userinfo
    ctx.body = {
        ok: 1,
        message: '退出成功'
    };
})

const auth = require('../middleware/auth')
router.get("/getUser",auth,ctx => {
    ctx.body = {
        ok: 1,
        message: '获取数据成功',
        userinfo: ctx.session.userinfo
    };
})
//jsonwebtoken令牌生成模块
const jwt = require("jsonwebtoken");
//koa的jwt中间件,作用是认证令牌合法性
const jwtAuth = require("koa-jwt");
const secret = "it's a secret";
router.post('/login-token',async ctx =>{
    const {body} = ctx.request;
    const userinfo = body.username;

    //省略登陆逻辑
    ctx.body = {
        message:'登录成功',
        user: userinfo,
        //使用jwt模块签名一个令牌
        token:jwt.sign({//签名只是防篡改
            data:userinfo,//由于签名不是加密，令牌中不要存放敏感数据
            exp: Math.floor(Date.now() / 1000) + 60 *60//过期时间
        },secret)
    }
})

router.get("/getUser-token",
    jwtAuth({secret}),//对传入令牌进行校验
    async ctx =>{
        console.log(ctx.state);
        ctx.body = {
            message: "获取数据成功",
            userinfo: ctx.state.user.data
        }
})


// oauth
// 1. 需要去授权方申请开放登录
// const config = {
//     client_id: "a141111525bac2f1edf2",
//     client_secret: "8e37306c1451e60412754ace80edee4ca937564a"
// };
const config = {
    client_id: "Iv1.37abe12e0cc9a8d0",
    client_secret: "8e37306c1451e2a5afa1cd03a953307b34df02cb8f73d78461a8660412754ace80edee4ca937564a"
};
const axios = require("axios");
const querystring = require("querystring");

router.get("/login-github", async ctx => {
    //重定向到认证接口,并配置参数
    const path = `https://github.com/login/oauth/authorize?client_id=${
        config.client_id
    }`;
    //转发到授权服务器
    ctx.redirect(path);
});
  
router.get("/oauth/github/callback", async ctx => {
    const code = ctx.query.code;
    const params = {
        client_id: config.client_id,
        client_secret: config.client_secret,
        code: code
    };
    let res = await axios.post(
        "https://github.com/login/oauth/access_token",
        params
    );
    console.log(res.data);

    const access_token = querystring.parse(res.data).access_token;
    res = await axios.get(
        "https://api.github.com/user?access_token=" + access_token
    );
    console.log("userAccess:", res.data);

    // 接下来：可以签发token，也可以存放信息值session

    ctx.redirect("/hello.html");
});
  
module.exports = router;