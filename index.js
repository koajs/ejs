/*!
 * @koa/ejs
 *
 * Copyright(c) 2017      dead_horse    <dead_horse@qq.com>
 * Copyright(c) 2021-2022 3imed-jaberi  <imed-jaberi@outlook.com>
 * MIT Licensed
 */

'use strict'

/**
 * Module dependencies.
 */

const ejs = require('ejs')
const path = require('path')
const debug = require('debug')('@koa/ejs')

/**
 * Temp assigned for override later
 */
const parentResolveInclude = ejs.resolveInclude

/**
 * default render options
 * @type {Object}
 */
const defaultSettings = {
  cache: true,
  layout: 'layout',
  viewExt: 'html',
  locals: {},
  compileDebug: false,
  debug: false,
  writeResp: true,
  async: false
}

exports = module.exports = koaEjs

/**
 * set app.context.render
 *
 * usage:
 * ```
 * await ctx.render('user', {name: 'dead_horse'});
 * ```
 * @param {Application} app koa application instance
 * @param {Object} settings user settings
 */
function koaEjs (app, settings) {
  if (app.context.render) return
  if (!settings || !settings.root) throw new Error('settings.root required')
  settings.root = path.resolve(process.cwd(), settings.root)
  // cache the generate package
  const cache = {}
  settings = { ...defaultSettings, ...settings }
  settings.viewExt = settings.viewExt ? '.' + settings.viewExt.replace(/^\./, '') : ''
  settings.fs = settings.fs || require('fs/promises')

  // override `ejs` node_module `resolveInclude` function
  ejs.resolveInclude = function (name, filename, isDir) {
    if (!path.extname(name)) name += settings.viewExt
    return parentResolveInclude(name, filename, isDir)
  }

  /**
   * generate html with view name and options
   *
   * @param {String} view
   * @param {Object} options
   * @return {String} html
   */
  async function render (view, options) {
    view += settings.viewExt
    const viewPath = path.join(settings.root, view)
    debug(`render: ${viewPath}`)
    // get from cache
    if (settings.cache && cache[viewPath]) return cache[viewPath].call(options.scope, options)

    const tpl = await settings.fs.readFile(viewPath, 'utf8')

    const fn = ejs.compile(tpl, {
      filename: viewPath,
      _with: settings._with,
      compileDebug: settings.debug && settings.compileDebug,
      debug: settings.debug,
      delimiter: settings.delimiter,
      cache: settings.cache,
      async: settings.async,
      outputFunctionName: settings.outputFunctionName
    })

    if (settings.cache) cache[viewPath] = fn

    return fn.call(options.scope, options)
  }

  app.context.render = async function (view, _context) {
    const ctx = this
    const context = { ...ctx.state, ..._context }
    let html = await render(view, context)

    const layout = context.layout === false ? false : (context.layout || settings.layout)
    if (layout) {
      // if using layout
      context.body = html
      html = await render(layout, context)
    }

    const writeResp = context.writeResp === false ? false : (context.writeResp || settings.writeResp)
    if (writeResp) {
      // normal operation
      ctx.type = 'html'
      ctx.body = html
    }

    // only return the html
    return html
  }
};

/**
 * Expose ejs
 */

exports.ejs = ejs
