/*!
 * koa-ejs - example/app.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var koa = require('koa');
var render = require('..');
var path = require('path');

var app = koa();

render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true
});

app.use(function* (next) {
  this.state = this.state || {};
  this.state.now = new Date();
  this.state.ip = this.ip;
  this.state.version = '2.0.0';
  yield next;
});

app.use(function *() {
  var users = [{name: 'Dead Horse'}, {name: 'Jack'}, {name: 'Tom'}];
  yield this.render('content', {
    users: users
  });
});

if (process.env.NODE_ENV === 'test') {
  module.exports = app.callback();
} else {
  app.listen(7001);
  console.log('open http://localhost:7001')
}

app.on('error', function (err) {
  console.log(err.stack)
})
