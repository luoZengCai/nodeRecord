const Koa = require('koa');
const static = require('koa-static');
const bodyparser = require('koa-bodyparser')
const Router = require("koa-router");
const app = new Koa();
//注册bodyparser
app.use(bodyparser());
const router = new Router();

const wechat = require('co-wechat');
const config = require('./config');
router.all('/wechat', wechat(config).middleware(
    async message => {
        console.log('wechat...',message);
        return 'hello' + message.Content
    }
))
//错误处理中间件
app.use(async (ctx,next) => {
    try {
        await next()
    } catch (error) {
        // 系统日志
        console.log(error);
        if (error.expose) {
            ctx.body = error.message;
        } else {
            ctx.body = error.stack;
        }
        //全局错误处理
        ctx.app.emit('error',error);
    }
})

//静态文件服务
app.use(static(__dirname + '/'))
app.use(router.routes());
app.use(router.allowedMethods());
// 监听全局错误事件
app.on('error',err => {
    // console.log('错误监听')
})

app.listen(3000);

