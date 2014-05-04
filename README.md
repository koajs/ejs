koa-ejs
=========

[![Build Status](https://secure.travis-ci.org/koajs/ejs.svg)](http://travis-ci.org/koajs/ejs)

Koa ejs view render middleware. support all feature of [ejs](https://github.com/visionmedia/ejs).

[![NPM](https://nodei.co/npm/koa-ejs.png?downloads=true)](https://nodei.co/npm/koa-ejs/)

## Usage

### Example

```js
var koa = require('koa');
var render = require('koa-ejs');

var app = koa();
render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true,
  locals: locals,
  filters: filters
});

app.use(function *() {
  yield this.render('user');
});

app.listen(7001);
```

Or you can checkout the [example](https://github.com/dead-horse/koa-ejs/tree/master/example).

### settings

* root: view root directory.
* layout: global layout file, default is `layout`, set `false` to disable layout.
* viewExt: view file extension, default is `html`.
* cache: cache compiled function flag.
* debug: debug flag.
* locals: global locals, can be function type, `this` in the function is koa's ctx.
* filters: ejs custom filters.
* open: open flog.
* close: close floag.

### Layouts

`koa-ejs` support layout. default layout file is `layout`, if you want to change default layout file, use `settings.layout`. Also you can specify layout by `options.layout` in `yield this.render`.
Also you can set `layout = false;` to close layout.

```
<html>
  <head>
    <title>koa ejs</title>
  </head>
  <h3>koa ejs</h3>
  <body>
    <%- body %>
  </body>
</html>
```

### Inlcude

support ejs default include.

```
<div>
  <% include user.html %>
</div>
```

### Filters

support ejs filters.

```
<p><%=: users | map : 'name' | join %></p>
```

you can custom filters pass by `settings.filters'

### Locals

pass gobal locals by `settings.locals`, locals can be functions to get dynamic values.
locals also can be `generatorFunction` or `generator`, so you can do some async invoke in locals.

```
var locals = {
  version: '0.0.1',
  now: function () {
    return new Date();
  },
  ip: function *() {  // generatorFunction
    yield wait(10);
    return this.ip; // use this like in koa middleware
  }
};
```

## Licences
(The MIT License)

Copyright (c) 2014 dead-horse and other contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
