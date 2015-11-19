/*!
 * koa-ejs - index.js
 * Copyright(c) 2014 dead_horse <dead_horse@qq.com>
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 */

var copy = require('copy-to');
var path = require('path');
var fs = require('co-fs');
var ejs = require('ejs');

/**
 * default render options
 * @type {Object}
 */
var defaultSettings = {
  cache: true,
  layout: 'layout',
  viewExt: 'html',
  locals: {},
  debug: false,
  writeResp: true
};

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
      delimiter: settings.delimiter
    });
    if (settings.cache) {
      cache[viewPath] = fn;
    }

    return fn.call(options.scope, options);
  }


  app.context.render = function *(view, _context) {
    var context = {};
    merge(context, this.state);
    merge(context, _context);

    var html = yield *render(view, context);

    var layout = context.layout === false ? false : (context.layout || settings.layout);
    if (layout) {
      // if using layout
      context.body = html;
      html = yield *render(layout, context);
    }

    var writeResp = context.writeResp === false ? false : (context.writeResp || settings.writeResp);
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

/**
 * merge source to target
 *
 * @param {Object} target
 * @param {Object} source
 * @return {Object}
 * @api private
 */
function merge(target, source) {
  for (var key in source) {
    target[key] = source[key];
  }
}
