/*!
 * koa-ejs - index.js
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
var is = require('is-type-of');
var copy = require('copy-to');

/**
 * default render options
 * @type {Object}
 */
var defaultSettings = {
  cache: true,
  layout: 'layout',
  viewExt: 'html',
  open: '<%',
  close: '%>',
  filters: {},
  locals: {},
  debug: false,
  writeResp: true
};

/**
 * merge object source into object target
 * only if target[prop] not exist
 * @param {Object} target
 * @param {Object} source
 * @param {Object} ctx
 */
function *merge(target, source, ctx) {
  for (var prop in source) {
    if (prop in target) {
      continue;
    }
    var val = source[prop];
    if (is.generator(val) || is.generatorFunction(val)) {
      target[prop] = yield *val.call(ctx);
      continue;
    }
    if (is.function (val)) {
      target[prop] = val.call(ctx);
      continue;
    }
    target[prop] = val;
  }
}

/**
 * set app.context.render
 *
 * usage:
 * ```
 * yield *this.render('user', {name: 'dead_horse'});
 * ```
 * @param {Application} app koa application instance
 * @param {Object} settings user settings
 */
exports = module.exports = function (app, settings) {
  if (app.context.render) {
    return;
  }

  if (!settings || !settings.root) {
    throw new Error('settings.root required');
  }

  settings.root = path.resolve(process.cwd(), settings.root);

  /**
  * cache the generate package
  * @type {Object}
  */
  var cache = Object.create(null);

  copy(defaultSettings).to(settings);

  settings.viewExt = settings.viewExt
    ? '.' + settings.viewExt.replace(/^\./, '')
    : '';

  // ejs global options
  // WARNING: if use koa-ejs in multi server
  // filters will regist in one ejs instance
  for (var name in settings.filters) {
    ejs.filters[name] = settings.filters[name];
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
      return cache[viewPath].call(options.scope, options);
    }

    var tpl = yield fs.readFile(viewPath, 'utf8');
    var fn = ejs.compile(tpl, {
      filename: viewPath,
      _with: settings._with,
      compileDebug: settings.debug,
      open: settings.open,
      close: settings.close
    });
    if (settings.cache) {
      cache[viewPath] = fn;
    }

    return fn.call(options.scope, options);
  }


  app.context.render = function *(view, options) {
    // merge global locals to options
    options = options || {};

    // support generator locals
    yield *merge(options, settings.locals, this);

    var html = yield *render(view, options);

    var layout = options.layout === false ? false : (options.layout || settings.layout);
    if (layout) {
      // if using layout
      options.body = html;
      html = yield *render(layout, options);
    }

    var writeResp = options.writeResp === false ? false : (options.writeResp || settings.writeResp);
    if (writeResp) {
      //normal operation
      this.type = 'html';
      this.body = html;
    }else{
      //only return the html
      return html;
    }
  };
};

/**
 * Expose ejs
 */

exports.ejs = ejs;
