/*!
 * koa-ejs - test/koa-ejs.test.js
 * Copyright(c) 2017 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

const render = require('..');
const request = require('supertest');
const Koa = require('koa');

describe('test/write-response.test.js', function () {
  describe('writeResp option', function () {
    it('should return html with default configuration and writeResp option = false', function (done) {
      const app = new Koa();
      render(app, {
        root: 'example/view',
        layout: 'template.oc',
        viewExt: 'html',
        delimiter: '?'
      });

      app.use(async function (ctx, next) {
        const html = await ctx.render('user.oc', {
          user: { name: 'Zed Gu' },
          writeResp: false
        });

        ctx.type = 'html';
        ctx.body = html;
      });

      request(app.callback())
        .get('/')
        .expect(200)
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/Zed Gu/, done);
    });

    it('should return html with configuration writeResp = false', function (done) {
      const app = new Koa();
      render(app, {
        root: 'example/view',
        layout: 'template.oc',
        viewExt: 'html',
        delimiter: '?',
        writeResp: false
      });

      app.use(async function (ctx) {
      const html = await ctx.render('user.oc', {
        user: { name: 'Zed Gu' }
      });

      ctx.type = 'html';
      ctx.body = html;
      });

      request(app.callback())
        .get('/')
        .expect(200)
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/Zed Gu/, done);
    });
  });
});
