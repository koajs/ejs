# @koa/ejs

> Koa ejs view render middleware. support all feature of [ejs](https://github.com/mde/ejs).

[![Build Status](https://secure.travis-ci.org/koajs/ejs.svg)](http://travis-ci.org/koajs/ejs)

[![NPM](https://nodei.co/npm/@koa/ejs.png?downloads=true)](https://nodei.co/npm/@koa/ejs/)

## Usage

### Example

```js
const Koa = require("koa");
const render = require("@koa/ejs");
const path = require("path");

const app = new Koa();
render(app, {
  root: path.join(__dirname, "view"),
  layout: "template",
  viewExt: "html",
  cache: false,
  debug: true,
});

app.use(async function (ctx) {
  await ctx.render("user");
});

app.listen(7001);
```

Or you can checkout the [example](https://github.com/koajs/ejs/tree/master/example).

### Settings

- root: view root directory.
- fs: file system module with same Node.js fs interface (default `Node.js fs module`).
- layout: global layout file, default is `layout`, set `false` to disable layout.
- viewExt: view file extension (default `html`).
- cache: cache compiled templates (default `true`).
- debug: debug flag (default `false`).
- delimiter: character to use with angle brackets for open / close (default `%`).
- async: When true, EJS will use an async function for rendering. Depends on async/await support in the JS runtime.
- outputFunctionName: Set to a string (e.g., 'echo' or 'print') for a function to print output inside scriptlet tags.

### Layouts

`@koa/ejs` supports layouts. The default layout file is `layout`. If you want to change default layout file, use `settings.layout`. Also you can specify layout by `options.layout` in `await ctx.render`.
Also you can set `layout = false` to disable the layout.

```
<html>
  <head>
    <title>koa ejs</title>
  </head>
  <body>
    <h3>koa ejs</h3>
    <%- body %>
  </body>
</html>
```

### Include

Supports ejs includes.

```
<div>
  <%- include ('user.html') -%>
</div>
```

### State

Support [`ctx.state` in koa](https://github.com/koajs/koa/blob/master/docs/api/context.md#ctxstate).


### TypeScript

If you're project based on TypeScript, we recommend using [`@types/koa-ejs`](https://www.npmjs.com/package/@types/koa-ejs) until we start supporting it in the upcoming releases.

## Licences

[(The MIT License)](LICENSE)
