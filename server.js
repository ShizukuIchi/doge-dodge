const path = require('path')
const serve = require('koa-static');
const Koa = require('koa');
const compress = require('koa-compress')
const app = new Koa();
const port = process.env.PORT || 3000

const options = { threshold: 2048 };
app.use(compress(options));

app.use(async (ctx, next) => {
  await next();
  if (ctx.url === '/') 
    console.log(`Knock knock! ${new Date}`);
  else if (ctx.path === '/score')
    console.log(`Someone submit new score: ${ctx.request.query.score}`)
});

app.use(serve('.'))
app.use(serve('src'))
app.use(serve('assets'))
app.listen(port);

console.log(`listening on port ${port}`)