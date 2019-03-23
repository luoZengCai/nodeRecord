const Koa = require('koa');
const app = new Koa();

const log4js = require('log4js');
const logger = log4js.getLogger('cheese')

app.use(async (ctx,next) =>{
    logger.info('app call...')
    Math.random() > 0.9 ? aaa() : '2';
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = `<h2>hello cluster</h2>`
})
app.on('error',(err,ctx) =>{
    logger.error(err)
})
if (!module.parent){
    app.listen(3000);
    console.log('开启');
}else{
    module.exports = app
}