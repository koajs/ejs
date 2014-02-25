/*!
 * koa-render - index.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var ejs = require('ejs');
var fs = require('co-fs');

/**
 * default render options
 * @type {Object}
 */
var settings = {
  cache: true,
  layout: 'layout.html',
  viewExt: '',
  open: '<%',
  close: '%>',
  filters: {},
  locals: {},
  debug: false
};

/**
 * merge object source into object target
 * only if target[prop] not exist
 * @param {Object} target
 * @param {Object} source
 * @param {Object} ctx
 */
function merge(target, source, ctx) {
  for (var prop in source) {
    if (prop in target) {
      continue;
    }
    target[prop] = typeof source[prop] === 'function'
    ? source[prop].call(ctx)
    : source[prop];
  }
}

/**
 * cache the generate package
 * @type {Object}
 */
var cache = {};

/**
 * response the html to browser
 * @param {Object} ctx
 * @param {String} html
 */
function response(ctx, html) {
  ctx.type = 'text/html';
  ctx.charset = 'utf-8';
  ctx.length = html.length;
  ctx.body = html;
}

/**
 * generate html with ejs function and options
 * @param {Function} fn ejs compiled function
 * @param {Object} options
 * @return {String}
 */
function renderTpl(fn, options) {
  return options.scope
  ? fn.call(options.scope, options)
  : fn(options);
}

/**
 * generate html with view name and options
 * @param {String} view
 * @param {Object} options
 * @return {String} html
 */
function *render(view, options) {
  view += settings.viewExt;
  var viewPath = path.join(settings.root, view);

  // get from cache
  if (settings.cache && cache[viewPath]) {
    var fn = cache[viewPath];
    return renderTpl(fn, options);
  }

  var tpl = yield fs.readFile(viewPath, 'utf8');
  var fn = ejs.compile(tpl, {
    filename: viewPath,
    _with: settings._with,
    compileDebug: settings.debug
  });
  if (settings.cache) {
    cache[viewPath] = fn;
  }

  return _renderTpl(fn, options);
}

/**
 * set app.context.render
 *
 * usage:
 * ```
 * yield this.render('user', {name: 'dead_horse'});
 * ```
 * @param {Application} app koa application instance
 * @param {Object} options user settings
 */
module.exports = function (app, options) {
  if (!options || !options.root) {
    throw new Error('options.root required');
  }
  for (var prop in options) {
    settings[prop] = options[prop];
  }

  settings.viewExt = settings.viewExt
  ? '.' + settings.viewExt.replace(/^\./, '')
  : '';

  // ejs global options
  ejs.open = settings.open;
  ejs.close = settings.close;
  for (var name in settings.filters) {
    ejs.filters[name] = settings.filters[name];
  }

  app.context.render = function *(view, options) {
    // merge global locals to options
    merge(options, settings.locals, this);
    var html = yield render(view, options);

    var layout = options.layout || settings.layout;
    if (layout) {
      // if using layout
      options.body = html;
      html = yield render(layout, options);
    }
    response(this, html);
  };
};
