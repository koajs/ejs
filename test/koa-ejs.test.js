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

describe('test/koa-ejs.test.js', function () {
  describe('init()', function () {
    var app = koa();
    it('should throw error if no root', function () {
      (function () {
        render(app);
      }).should.throw('settings.root required');
      (function () {
        render(app, {});
      }).should.throw('settings.root required');
    });

    it('should init ok', function () {
      render(app, {
        root: __dirname,
        filters: {
          format: function () {}
        },
        open: '{{',
        close: '}}'
      });
      render.ejs.filters.should.have.property('format');
      app.context.render.should.be.Function;
    });
  });

  describe('server', function () {
    var app = require('../example/app');
    it('should render page ok', function (done) {
      request(app)
      .get('/')
      .expect('content-type', 'text/html; charset=utf-8')
      .expect(/<title>koa ejs<\/title>/)
      .expect(/server time is: /)
      .expect(/Dead Horse, Jack, Tom/)
      .expect(/dead horse/)
      .expect(200, done);
    });
  });
});
