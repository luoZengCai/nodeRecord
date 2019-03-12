const Router = require("koa-router");
const router = new Router();
router.get("/",async ctx => {
    // ctx.body = "index";
    await ctx.render('index');
})
module.exports = router;