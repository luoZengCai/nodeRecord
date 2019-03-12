const Koa = require('koa');
const static = require('koa-static');
const app = new Koa();

//引入模板引擎
const hbs = require('koa-hbs');
app.use(hbs.middleware({
    viewPath: __dirname + '/view',//视图根目录
    defaultLayout: 'layout',//默认布局页面
    partialsPath: __dirname + '/view/partials',//注册partial目录
    disableCache: true //开发阶段不缓存
}))

//导入路由文件
const index = require('./routes/index');
const users = require('./routes/users');

//中间件是一个异步函数，对用户请求和响应做预处理

//错误处理中间件
app.use(async (ctx,next) => {
    try {
        await next()
    } catch (error) {
        console.log(error);
        ctx.status = error.statusCode || error.status || 500;
        ctx.body = error
        // ctx.body = error.message
        //全局错误处理
        ctx.app.emit('error',error);
    }
})

//静态文件服务
app.use(static(__dirname + '/public'))
// app.use(async (ctx,next) => {
//     //请求操作
//     await next()
//     //获取相应头，印证执行顺序
//     const rt = ctx.response.get('X-Response-Time');
//     console.log(`输出计时：${ctx.method} ${ctx.url} - ${rt}`);
// })

// app.use(async (ctx,next) =>{
//     const start = Date.now();
//     console.log('开始计时');
//     await next();
//     const ms = Date.now() - start;
//     ctx.set('X-Response-Time',`${ms}ms`);
//     console.log("计时结束");
// })

// app.use(async (ctx,next) =>{
    // throw new Error('未知错误');
    // ctx.throw(401,'未验证')
// })

// app.use(ctx =>{
//     console.log('响应用户请求');
//     ctx.status = 200;
//     ctx.type = "html";
//     ctx.body = "<h1>hello koa</h1>"
// })
app.use(index.routes());
app.use(users.routes());
// 监听全局错误事件
app.on('error',err => {
    console.log('错误监听')
})

app.listen(3000);

