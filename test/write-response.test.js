/*!
 * koa-ejs - test/koa-ejs.test.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var render = require('..');
var request = require('supertest');
var koa = require('koa');

describe('test/write-response.test.js', function () {
  describe('writeResp option', function () {
    it('should return html with default configuration and writeResp option = false', function(done) {
      var app = koa();
      render(app, {
        root: 'example/view',
        layout: 'template.oc',
        viewExt: 'html',
        delimiter: '?'
      });

      app.use(function *(next) {
        var html = yield this.render('user.oc', {
          user: {name: 'Zed Gu'},
          writeResp:false
        });

        this.type = 'html';
        this.body = html;
      });

      request(app.callback())
      .get('/')
      .expect('content-type', 'text/html; charset=utf-8')
      .expect(/Zed Gu/)
      .expect(200, done)

    });

    it('should return html with configuration writeResp = false', function(done) {
      var app = koa();
      render(app, {
        root: 'example/view',
        layout: 'template.oc',
        viewExt: 'html',
        delimiter: '?',
        writeResp:false
      });

      app.use(function *(next) {
        var html = yield this.render('user.oc', {
          user: {name: 'Zed Gu'}
        });
        
        this.type = 'html';
        this.body = html;
      });

      request(app.callback())
      .get('/')
      .expect('content-type', 'text/html; charset=utf-8')
      .expect(/Zed Gu/)
      .expect(200, done)

    });
  });
});
