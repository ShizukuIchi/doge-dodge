const path = require('path')
const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();
const port = process.env.PORT || 3000

app.use(serve(path.resolve(__dirname, '.')))

app.listen(port);

console.log(`listening on port ${port}`)