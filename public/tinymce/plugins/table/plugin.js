/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.4.1 (2020-07-08)
 */
;(function(domGlobals) {
  'use strict'

  var global = tinymce.util.Tools.resolve('tinymce.PluginManager')

  var noop = function() {}
  var compose = function(fa, fb) {
    return function() {
      var args = []
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i]
      }
      return fa(fb.apply(null, args))
    }
  }
  var compose1 = function(fbc, fab) {
    return function(a) {
      return fbc(fab(a))
    }
  }
  var constant = function(value) {
    return function() {
      return value
    }
  }
  var identity = function(x) {
    return x
  }
  function curry(fn) {
    var initialArgs = []
    for (var _i = 1; _i < arguments.length; _i++) {
      initialArgs[_i - 1] = arguments[_i]
    }
    return function() {
      var restArgs = []
      for (var _i = 0; _i < arguments.length; _i++) {
        restArgs[_i] = arguments[_i]
      }
      var all = initialArgs.concat(restArgs)
      return fn.apply(null, all)
    }
  }
  var not = function(f) {
    return function(t) {
      return !f(t)
    }
  }
  var die = function(msg) {
    return function() {
      throw new Error(msg)
    }
  }
  var never = constant(false)
  var always = constant(true)

  var none = function() {
    return NONE
  }
  var NONE = (function() {
    var eq = function(o) {
      return o.isNone()
    }
    var call = function(thunk) {
      return thunk()
    }
    var id = function(n) {
      return n
    }
    var me = {
      fold: function(n, _s) {
        return n()
      },
      is: never,
      isSome: never,
      isNone: always,
      getOr: id,
      getOrThunk: call,
      getOrDie: function(msg) {
        throw new Error(msg || 'error: getOrDie called on none.')
      },
      getOrNull: constant(null),
      getOrUndefined: constant(undefined),
      or: id,
      orThunk: call,
      map: none,
      each: noop,
      bind: none,
      exists: never,
      forall: always,
      filter: none,
      equals: eq,
      equals_: eq,
      toArray: function() {
        return []
      },
      toString: constant('none()')
    }
    return me
  })()
  var some = function(a) {
    var constant_a = constant(a)
    var self = function() {
      return me
    }
    var bind = function(f) {
      return f(a)
    }
    var me = {
      fold: function(n, s) {
        return s(a)
      },
      is: function(v) {
        return a === v
      },
      isSome: always,
      isNone: never,
      getOr: constant_a,
      getOrThunk: constant_a,
      getOrDie: constant_a,
      getOrNull: constant_a,
      getOrUndefined: constant_a,
      or: self,
      orThunk: self,
      map: function(f) {
        return some(f(a))
      },
      each: function(f) {
        f(a)
      },
      bind: bind,
      exists: bind,
      forall: bind,
      filter: function(f) {
        return f(a) ? me : NONE
      },
      toArray: function() {
        return [a]
      },
      toString: function() {
        return 'some(' + a + ')'
      },
      equals: function(o) {
        return o.is(a)
      },
      equals_: function(o, elementEq) {
        return o.fold(never, function(b) {
          return elementEq(a, b)
        })
      }
    }
    return me
  }
  var from = function(value) {
    return value === null || value === undefined ? NONE : some(value)
  }
  var Option = {
    some: some,
    none: none,
    from: from
  }

  var typeOf = function(x) {
    var t = typeof x
    if (x === null) {
      return 'null'
    } else if (
      t === 'object' &&
      (Array.prototype.isPrototypeOf(x) ||
        (x.constructor && x.constructor.name === 'Array'))
    ) {
      return 'array'
    } else if (
      t === 'object' &&
      (String.prototype.isPrototypeOf(x) ||
        (x.constructor && x.constructor.name === 'String'))
    ) {
      return 'string'
    } else {
      return t
    }
  }
  var isType = function(type) {
    return function(value) {
      return typeOf(value) === type
    }
  }
  var isSimpleType = function(type) {
    return function(value) {
      return typeof value === type
    }
  }
  var isString = isType('string')
  var isObject = isType('object')
  var isArray = isType('array')
  var isBoolean = isSimpleType('boolean')
  var isNullable = function(a) {
    return a === null || a === undefined
  }
  var isNonNullable = function(a) {
    return !isNullable(a)
  }
  var isFunction = isSimpleType('function')
  var isNumber = isSimpleType('number')

  var nativeSlice = Array.prototype.slice
  var nativeIndexOf = Array.prototype.indexOf
  var nativePush = Array.prototype.push
  var rawIndexOf = function(ts, t) {
    return nativeIndexOf.call(ts, t)
  }
  var contains = function(xs, x) {
    return rawIndexOf(xs, x) > -1
  }
  var exists = function(xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i]
      if (pred(x, i)) {
        return true
      }
    }
    return false
  }
  var range = function(num, f) {
    var r = []
    for (var i = 0; i < num; i++) {
      r.push(f(i))
    }
    return r
  }
  var map = function(xs, f) {
    var len = xs.length
    var r = new Array(len)
    for (var i = 0; i < len; i++) {
      var x = xs[i]
      r[i] = f(x, i)
    }
    return r
  }
  var each = function(xs, f) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i]
      f(x, i)
    }
  }
  var eachr = function(xs, f) {
    for (var i = xs.length - 1; i >= 0; i--) {
      var x = xs[i]
      f(x, i)
    }
  }
  var filter = function(xs, pred) {
    var r = []
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i]
      if (pred(x, i)) {
        r.push(x)
      }
    }
    return r
  }
  var foldr = function(xs, f, acc) {
    eachr(xs, function(x) {
      acc = f(acc, x)
    })
    return acc
  }
  var foldl = function(xs, f, acc) {
    each(xs, function(x) {
      acc = f(acc, x)
    })
    return acc
  }
  var findUntil = function(xs, pred, until) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i]
      if (pred(x, i)) {
        return Option.some(x)
      } else if (until(x, i)) {
        break
      }
    }
    return Option.none()
  }
  var find = function(xs, pred) {
    return findUntil(xs, pred, never)
  }
  var findIndex = function(xs, pred) {
    for (var i = 0, len = xs.length; i < len; i++) {
      var x = xs[i]
      if (pred(x, i)) {
        return Option.some(i)
      }
    }
    return Option.none()
  }
  var flatten = function(xs) {
    var r = []
    for (var i = 0, len = xs.length; i < len; ++i) {
      if (!isArray(xs[i])) {
        throw new Error(
          'Arr.flatten item ' + i + ' was not an array, input: ' + xs
        )
      }
      nativePush.apply(r, xs[i])
    }
    return r
  }
  var bind = function(xs, f) {
    return flatten(map(xs, f))
  }
  var forall = function(xs, pred) {
    for (var i = 0, len = xs.length; i < len; ++i) {
      var x = xs[i]
      if (pred(x, i) !== true) {
        return false
      }
    }
    return true
  }
  var reverse = function(xs) {
    var r = nativeSlice.call(xs, 0)
    r.reverse()
    return r
  }
  var head = function(xs) {
    return xs.length === 0 ? Option.none() : Option.some(xs[0])
  }
  var last = function(xs) {
    return xs.length === 0 ? Option.none() : Option.some(xs[xs.length - 1])
  }
  var findMap = function(arr, f) {
    for (var i = 0; i < arr.length; i++) {
      var r = f(arr[i], i)
      if (r.isSome()) {
        return r
      }
    }
    return Option.none()
  }

  var keys = Object.keys
  var hasOwnProperty = Object.hasOwnProperty
  var each$1 = function(obj, f) {
    var props = keys(obj)
    for (var k = 0, len = props.length; k < len; k++) {
      var i = props[k]
      var x = obj[i]
      f(x, i)
    }
  }
  var map$1 = function(obj, f) {
    return tupleMap(obj, function(x, i) {
      return {
        k: i,
        v: f(x, i)
      }
    })
  }
  var tupleMap = function(obj, f) {
    var r = {}
    each$1(obj, function(x, i) {
      var tuple = f(x, i)
      r[tuple.k] = tuple.v
    })
    return r
  }
  var objAcc = function(r) {
    return function(x, i) {
      r[i] = x
    }
  }
  var internalFilter = function(obj, pred, onTrue, onFalse) {
    var r = {}
    each$1(obj, function(x, i) {
      ;(pred(x, i) ? onTrue : onFalse)(x, i)
    })
    return r
  }
  var filter$1 = function(obj, pred) {
    var t = {}
    internalFilter(obj, pred, objAcc(t), noop)
    return t
  }
  var get = function(obj, key) {
    return has(obj, key) ? Option.from(obj[key]) : Option.none()
  }
  var has = function(obj, key) {
    return hasOwnProperty.call(obj, key)
  }

  var Global =
    typeof domGlobals.window !== 'undefined'
      ? domGlobals.window
      : Function('return this;')()

  var COMMENT = 8
  var DOCUMENT = 9
  var DOCUMENT_FRAGMENT = 11
  var ELEMENT = 1
  var TEXT = 3

  var name = function(element) {
    var r = element.dom().nodeName
    return r.toLowerCase()
  }
  var type = function(element) {
    return element.dom().nodeType
  }
  var isType$1 = function(t) {
    return function(element) {
      return type(element) === t
    }
  }
  var isComment = function(element) {
    return type(element) === COMMENT || name(element) === '#comment'
  }
  var isElement = isType$1(ELEMENT)
  var isText = isType$1(TEXT)
  var isDocument = isType$1(DOCUMENT)
  var isDocumentFragment = isType$1(DOCUMENT_FRAGMENT)

  var rawSet = function(dom, key, value) {
    if (isString(value) || isBoolean(value) || isNumber(value)) {
      dom.setAttribute(key, value + '')
    } else {
      domGlobals.console.error(
        'Invalid call to Attr.set. Key ',
        key,
        ':: Value ',
        value,
        ':: Element ',
        dom
      )
      throw new Error('Attribute value was not simple')
    }
  }
  var set = function(element, key, value) {
    rawSet(element.dom(), key, value)
  }
  var setAll = function(element, attrs) {
    var dom = element.dom()
    each$1(attrs, function(v, k) {
      rawSet(dom, k, v)
    })
  }
  var get$1 = function(element, key) {
    var v = element.dom().getAttribute(key)
    return v === null ? undefined : v
  }
  var getOpt = function(element, key) {
    return Option.from(get$1(element, key))
  }
  var has$1 = function(element, key) {
    var dom = element.dom()
    return dom && dom.hasAttribute ? dom.hasAttribute(key) : false
  }
  var remove = function(element, key) {
    element.dom().removeAttribute(key)
  }
  var clone = function(element) {
    return foldl(
      element.dom().attributes,
      function(acc, attr) {
        acc[attr.name] = attr.value
        return acc
      },
      {}
    )
  }

  var checkRange = function(str, substr, start) {
    return (
      substr === '' ||
      (str.length >= substr.length &&
        str.substr(start, start + substr.length) === substr)
    )
  }
  var contains$1 = function(str, substr) {
    return str.indexOf(substr) !== -1
  }
  var startsWith = function(str, prefix) {
    return checkRange(str, prefix, 0)
  }
  var endsWith = function(str, suffix) {
    return checkRange(str, suffix, str.length - suffix.length)
  }
  var blank = function(r) {
    return function(s) {
      return s.replace(r, '')
    }
  }
  var trim = blank(/^\s+|\s+$/g)
  var isNotEmpty = function(s) {
    return s.length > 0
  }

  var isSupported = function(dom) {
    return dom.style !== undefined && isFunction(dom.style.getPropertyValue)
  }

  var fromHtml = function(html, scope) {
    var doc = scope || domGlobals.document
    var div = doc.createElement('div')
    div.innerHTML = html
    if (!div.hasChildNodes() || div.childNodes.length > 1) {
      domGlobals.console.error('HTML does not have a single root node', html)
      throw new Error('HTML must have a single root node')
    }
    return fromDom(div.childNodes[0])
  }
  var fromTag = function(tag, scope) {
    var doc = scope || domGlobals.document
    var node = doc.createElement(tag)
    return fromDom(node)
  }
  var fromText = function(text, scope) {
    var doc = scope || domGlobals.document
    var node = doc.createTextNode(text)
    return fromDom(node)
  }
  var fromDom = function(node) {
    if (node === null || node === undefined) {
      throw new Error('Node cannot be null or undefined')
    }
    return { dom: constant(node) }
  }
  var fromPoint = function(docElm, x, y) {
    var doc = docElm.dom()
    return Option.from(doc.elementFromPoint(x, y)).map(fromDom)
  }
  var Element = {
    fromHtml: fromHtml,
    fromTag: fromTag,
    fromText: fromText,
    fromDom: fromDom,
    fromPoint: fromPoint
  }

  var compareDocumentPosition = function(a, b, match) {
    return (a.compareDocumentPosition(b) & match) !== 0
  }
  var documentPositionContainedBy = function(a, b) {
    return compareDocumentPosition(
      a,
      b,
      domGlobals.Node.DOCUMENT_POSITION_CONTAINED_BY
    )
  }

  var __assign = function() {
    __assign =
      Object.assign ||
      function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i]
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
      }
    return __assign.apply(this, arguments)
  }

  var cached = function(f) {
    var called = false
    var r
    return function() {
      var args = []
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i]
      }
      if (!called) {
        called = true
        r = f.apply(null, args)
      }
      return r
    }
  }

  var firstMatch = function(regexes, s) {
    for (var i = 0; i < regexes.length; i++) {
      var x = regexes[i]
      if (x.test(s)) {
        return x
      }
    }
    return undefined
  }
  var find$1 = function(regexes, agent) {
    var r = firstMatch(regexes, agent)
    if (!r) {
      return {
        major: 0,
        minor: 0
      }
    }
    var group = function(i) {
      return Number(agent.replace(r, '$' + i))
    }
    return nu(group(1), group(2))
  }
  var detect = function(versionRegexes, agent) {
    var cleanedAgent = String(agent).toLowerCase()
    if (versionRegexes.length === 0) {
      return unknown()
    }
    return find$1(versionRegexes, cleanedAgent)
  }
  var unknown = function() {
    return nu(0, 0)
  }
  var nu = function(major, minor) {
    return {
      major: major,
      minor: minor
    }
  }
  var Version = {
    nu: nu,
    detect: detect,
    unknown: unknown
  }

  var edge = 'Edge'
  var chrome = 'Chrome'
  var ie = 'IE'
  var opera = 'Opera'
  var firefox = 'Firefox'
  var safari = 'Safari'
  var unknown$1 = function() {
    return nu$1({
      current: undefined,
      version: Version.unknown()
    })
  }
  var nu$1 = function(info) {
    var current = info.current
    var version = info.version
    var isBrowser = function(name) {
      return function() {
        return current === name
      }
    }
    return {
      current: current,
      version: version,
      isEdge: isBrowser(edge),
      isChrome: isBrowser(chrome),
      isIE: isBrowser(ie),
      isOpera: isBrowser(opera),
      isFirefox: isBrowser(firefox),
      isSafari: isBrowser(safari)
    }
  }
  var Browser = {
    unknown: unknown$1,
    nu: nu$1,
    edge: constant(edge),
    chrome: constant(chrome),
    ie: constant(ie),
    opera: constant(opera),
    firefox: constant(firefox),
    safari: constant(safari)
  }

  var windows = 'Windows'
  var ios = 'iOS'
  var android = 'Android'
  var linux = 'Linux'
  var osx = 'OSX'
  var solaris = 'Solaris'
  var freebsd = 'FreeBSD'
  var chromeos = 'ChromeOS'
  var unknown$2 = function() {
    return nu$2({
      current: undefined,
      version: Version.unknown()
    })
  }
  var nu$2 = function(info) {
    var current = info.current
    var version = info.version
    var isOS = function(name) {
      return function() {
        return current === name
      }
    }
    return {
      current: current,
      version: version,
      isWindows: isOS(windows),
      isiOS: isOS(ios),
      isAndroid: isOS(android),
      isOSX: isOS(osx),
      isLinux: isOS(linux),
      isSolaris: isOS(solaris),
      isFreeBSD: isOS(freebsd),
      isChromeOS: isOS(chromeos)
    }
  }
  var OperatingSystem = {
    unknown: unknown$2,
    nu: nu$2,
    windows: constant(windows),
    ios: constant(ios),
    android: constant(android),
    linux: constant(linux),
    osx: constant(osx),
    solaris: constant(solaris),
    freebsd: constant(freebsd),
    chromeos: constant(chromeos)
  }

  var DeviceType = function(os, browser, userAgent, mediaMatch) {
    var isiPad = os.isiOS() && /ipad/i.test(userAgent) === true
    var isiPhone = os.isiOS() && !isiPad
    var isMobile = os.isiOS() || os.isAndroid()
    var isTouch = isMobile || mediaMatch('(pointer:coarse)')
    var isTablet =
      isiPad ||
      (!isiPhone && isMobile && mediaMatch('(min-device-width:768px)'))
    var isPhone = isiPhone || (isMobile && !isTablet)
    var iOSwebview =
      browser.isSafari() && os.isiOS() && /safari/i.test(userAgent) === false
    var isDesktop = !isPhone && !isTablet && !iOSwebview
    return {
      isiPad: constant(isiPad),
      isiPhone: constant(isiPhone),
      isTablet: constant(isTablet),
      isPhone: constant(isPhone),
      isTouch: constant(isTouch),
      isAndroid: os.isAndroid,
      isiOS: os.isiOS,
      isWebView: constant(iOSwebview),
      isDesktop: constant(isDesktop)
    }
  }

  var detect$1 = function(candidates, userAgent) {
    var agent = String(userAgent).toLowerCase()
    return find(candidates, function(candidate) {
      return candidate.search(agent)
    })
  }
  var detectBrowser = function(browsers, userAgent) {
    return detect$1(browsers, userAgent).map(function(browser) {
      var version = Version.detect(browser.versionRegexes, userAgent)
      return {
        current: browser.name,
        version: version
      }
    })
  }
  var detectOs = function(oses, userAgent) {
    return detect$1(oses, userAgent).map(function(os) {
      var version = Version.detect(os.versionRegexes, userAgent)
      return {
        current: os.name,
        version: version
      }
    })
  }
  var UaString = {
    detectBrowser: detectBrowser,
    detectOs: detectOs
  }

  var normalVersionRegex = /.*?version\/\ ?([0-9]+)\.([0-9]+).*/
  var checkContains = function(target) {
    return function(uastring) {
      return contains$1(uastring, target)
    }
  }
  var browsers = [
    {
      name: 'Edge',
      versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
      search: function(uastring) {
        return (
          contains$1(uastring, 'edge/') &&
          contains$1(uastring, 'chrome') &&
          contains$1(uastring, 'safari') &&
          contains$1(uastring, 'applewebkit')
        )
      }
    },
    {
      name: 'Chrome',
      versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/, normalVersionRegex],
      search: function(uastring) {
        return (
          contains$1(uastring, 'chrome') && !contains$1(uastring, 'chromeframe')
        )
      }
    },
    {
      name: 'IE',
      versionRegexes: [
        /.*?msie\ ?([0-9]+)\.([0-9]+).*/,
        /.*?rv:([0-9]+)\.([0-9]+).*/
      ],
      search: function(uastring) {
        return contains$1(uastring, 'msie') || contains$1(uastring, 'trident')
      }
    },
    {
      name: 'Opera',
      versionRegexes: [normalVersionRegex, /.*?opera\/([0-9]+)\.([0-9]+).*/],
      search: checkContains('opera')
    },
    {
      name: 'Firefox',
      versionRegexes: [/.*?firefox\/\ ?([0-9]+)\.([0-9]+).*/],
      search: checkContains('firefox')
    },
    {
      name: 'Safari',
      versionRegexes: [normalVersionRegex, /.*?cpu os ([0-9]+)_([0-9]+).*/],
      search: function(uastring) {
        return (
          (contains$1(uastring, 'safari') || contains$1(uastring, 'mobile/')) &&
          contains$1(uastring, 'applewebkit')
        )
      }
    }
  ]
  var oses = [
    {
      name: 'Windows',
      search: checkContains('win'),
      versionRegexes: [/.*?windows\ nt\ ?([0-9]+)\.([0-9]+).*/]
    },
    {
      name: 'iOS',
      search: function(uastring) {
        return contains$1(uastring, 'iphone') || contains$1(uastring, 'ipad')
      },
      versionRegexes: [
        /.*?version\/\ ?([0-9]+)\.([0-9]+).*/,
        /.*cpu os ([0-9]+)_([0-9]+).*/,
        /.*cpu iphone os ([0-9]+)_([0-9]+).*/
      ]
    },
    {
      name: 'Android',
      search: checkContains('android'),
      versionRegexes: [/.*?android\ ?([0-9]+)\.([0-9]+).*/]
    },
    {
      name: 'OSX',
      search: checkContains('mac os x'),
      versionRegexes: [/.*?mac\ os\ x\ ?([0-9]+)_([0-9]+).*/]
    },
    {
      name: 'Linux',
      search: checkContains('linux'),
      versionRegexes: []
    },
    {
      name: 'Solaris',
      search: checkContains('sunos'),
      versionRegexes: []
    },
    {
      name: 'FreeBSD',
      search: checkContains('freebsd'),
      versionRegexes: []
    },
    {
      name: 'ChromeOS',
      search: checkContains('cros'),
      versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/]
    }
  ]
  var PlatformInfo = {
    browsers: constant(browsers),
    oses: constant(oses)
  }

  var detect$2 = function(userAgent, mediaMatch) {
    var browsers = PlatformInfo.browsers()
    var oses = PlatformInfo.oses()
    var browser = UaString.detectBrowser(browsers, userAgent).fold(
      Browser.unknown,
      Browser.nu
    )
    var os = UaString.detectOs(oses, userAgent).fold(
      OperatingSystem.unknown,
      OperatingSystem.nu
    )
    var deviceType = DeviceType(os, browser, userAgent, mediaMatch)
    return {
      browser: browser,
      os: os,
      deviceType: deviceType
    }
  }
  var PlatformDetection = { detect: detect$2 }

  var mediaMatch = function(query) {
    return domGlobals.window.matchMedia(query).matches
  }
  var platform = cached(function() {
    return PlatformDetection.detect(domGlobals.navigator.userAgent, mediaMatch)
  })
  var detect$3 = function() {
    return platform()
  }

  var is = function(element, selector) {
    var dom = element.dom()
    if (dom.nodeType !== ELEMENT) {
      return false
    } else {
      var elem = dom
      if (elem.matches !== undefined) {
        return elem.matches(selector)
      } else if (elem.msMatchesSelector !== undefined) {
        return elem.msMatchesSelector(selector)
      } else if (elem.webkitMatchesSelector !== undefined) {
        return elem.webkitMatchesSelector(selector)
      } else if (elem.mozMatchesSelector !== undefined) {
        return elem.mozMatchesSelector(selector)
      } else {
        throw new Error('Browser lacks native selectors')
      }
    }
  }
  var bypassSelector = function(dom) {
    return (
      (dom.nodeType !== ELEMENT &&
        dom.nodeType !== DOCUMENT &&
        dom.nodeType !== DOCUMENT_FRAGMENT) ||
      dom.childElementCount === 0
    )
  }
  var all = function(selector, scope) {
    var base = scope === undefined ? domGlobals.document : scope.dom()
    return bypassSelector(base)
      ? []
      : map(base.querySelectorAll(selector), Element.fromDom)
  }
  var one = function(selector, scope) {
    var base = scope === undefined ? domGlobals.document : scope.dom()
    return bypassSelector(base)
      ? Option.none()
      : Option.from(base.querySelector(selector)).map(Element.fromDom)
  }

  var eq = function(e1, e2) {
    return e1.dom() === e2.dom()
  }
  var regularContains = function(e1, e2) {
    var d1 = e1.dom()
    var d2 = e2.dom()
    return d1 === d2 ? false : d1.contains(d2)
  }
  var ieContains = function(e1, e2) {
    return documentPositionContainedBy(e1.dom(), e2.dom())
  }
  var contains$2 = function(e1, e2) {
    return detect$3().browser.isIE()
      ? ieContains(e1, e2)
      : regularContains(e1, e2)
  }
  var is$1 = is

  var owner = function(element) {
    return Element.fromDom(element.dom().ownerDocument)
  }
  var documentOrOwner = function(dos) {
    return isDocument(dos) ? dos : owner(dos)
  }
  var defaultView = function(element) {
    return Element.fromDom(element.dom().ownerDocument.defaultView)
  }
  var parent = function(element) {
    return Option.from(element.dom().parentNode).map(Element.fromDom)
  }
  var parents = function(element, isRoot) {
    var stop = isFunction(isRoot) ? isRoot : never
    var dom = element.dom()
    var ret = []
    while (dom.parentNode !== null && dom.parentNode !== undefined) {
      var rawParent = dom.parentNode
      var p = Element.fromDom(rawParent)
      ret.push(p)
      if (stop(p) === true) {
        break
      } else {
        dom = rawParent
      }
    }
    return ret
  }
  var offsetParent = function(element) {
    return Option.from(element.dom().offsetParent).map(Element.fromDom)
  }
  var prevSibling = function(element) {
    return Option.from(element.dom().previousSibling).map(Element.fromDom)
  }
  var nextSibling = function(element) {
    return Option.from(element.dom().nextSibling).map(Element.fromDom)
  }
  var children = function(element) {
    return map(element.dom().childNodes, Element.fromDom)
  }
  var child = function(element, index) {
    var cs = element.dom().childNodes
    return Option.from(cs[index]).map(Element.fromDom)
  }
  var firstChild = function(element) {
    return child(element, 0)
  }

  var isShadowRoot = function(dos) {
    return isDocumentFragment(dos)
  }
  var supported =
    isFunction(domGlobals.Element.prototype.attachShadow) &&
    isFunction(domGlobals.Node.prototype.getRootNode)
  var isSupported$1 = constant(supported)
  var getRootNode = supported
    ? function(e) {
        return Element.fromDom(e.dom().getRootNode())
      }
    : documentOrOwner
  var getShadowRoot = function(e) {
    var r = getRootNode(e)
    return isShadowRoot(r) ? Option.some(r) : Option.none()
  }
  var getShadowHost = function(e) {
    return Element.fromDom(e.dom().host)
  }
  var getOriginalEventTarget = function(event) {
    if (isSupported$1() && isNonNullable(event.target)) {
      var el = Element.fromDom(event.target)
      if (isElement(el) && isOpenShadowHost(Element.fromDom(event.target))) {
        var eventAny = event
        if (eventAny.composed && eventAny.composedPath) {
          var composedPath = eventAny.composedPath()
          if (composedPath) {
            return head(composedPath)
          }
        }
      }
    }
    return Option.from(event.target)
  }
  var isOpenShadowHost = function(element) {
    return isNonNullable(element.dom().shadowRoot)
  }

  var inBody = function(element) {
    var dom = isText(element) ? element.dom().parentNode : element.dom()
    if (dom === undefined || dom === null || dom.ownerDocument === null) {
      return false
    }
    return getShadowRoot(Element.fromDom(dom)).fold(function() {
      return dom.ownerDocument.body.contains(dom)
    }, compose1(inBody, getShadowHost))
  }
  var body = function() {
    return getBody(Element.fromDom(domGlobals.document))
  }
  var getBody = function(doc) {
    var b = doc.dom().body
    if (b === null || b === undefined) {
      throw new Error('Body is not available yet')
    }
    return Element.fromDom(b)
  }

  var internalSet = function(dom, property, value) {
    if (!isString(value)) {
      domGlobals.console.error(
        'Invalid call to CSS.set. Property ',
        property,
        ':: Value ',
        value,
        ':: Element ',
        dom
      )
      throw new Error('CSS value must be a string: ' + value)
    }
    if (isSupported(dom)) {
      dom.style.setProperty(property, value)
    }
  }
  var internalRemove = function(dom, property) {
    if (isSupported(dom)) {
      dom.style.removeProperty(property)
    }
  }
  var set$1 = function(element, property, value) {
    var dom = element.dom()
    internalSet(dom, property, value)
  }
  var setAll$1 = function(element, css) {
    var dom = element.dom()
    each$1(css, function(v, k) {
      internalSet(dom, k, v)
    })
  }
  var get$2 = function(element, property) {
    var dom = element.dom()
    var styles = domGlobals.window.getComputedStyle(dom)
    var r = styles.getPropertyValue(property)
    return r === '' && !inBody(element) ? getUnsafeProperty(dom, property) : r
  }
  var getUnsafeProperty = function(dom, property) {
    return isSupported(dom) ? dom.style.getPropertyValue(property) : ''
  }
  var getRaw = function(element, property) {
    var dom = element.dom()
    var raw = getUnsafeProperty(dom, property)
    return Option.from(raw).filter(function(r) {
      return r.length > 0
    })
  }
  var remove$1 = function(element, property) {
    var dom = element.dom()
    internalRemove(dom, property)
    if (
      getOpt(element, 'style')
        .map(trim)
        .is('')
    ) {
      remove(element, 'style')
    }
  }
  var copy = function(source, target) {
    var sourceDom = source.dom()
    var targetDom = target.dom()
    if (isSupported(sourceDom) && isSupported(targetDom)) {
      targetDom.style.cssText = sourceDom.style.cssText
    }
  }

  var before = function(marker, element) {
    var parent$1 = parent(marker)
    parent$1.each(function(v) {
      v.dom().insertBefore(element.dom(), marker.dom())
    })
  }
  var after = function(marker, element) {
    var sibling = nextSibling(marker)
    sibling.fold(
      function() {
        var parent$1 = parent(marker)
        parent$1.each(function(v) {
          append(v, element)
        })
      },
      function(v) {
        before(v, element)
      }
    )
  }
  var prepend = function(parent, element) {
    var firstChild$1 = firstChild(parent)
    firstChild$1.fold(
      function() {
        append(parent, element)
      },
      function(v) {
        parent.dom().insertBefore(element.dom(), v.dom())
      }
    )
  }
  var append = function(parent, element) {
    parent.dom().appendChild(element.dom())
  }
  var wrap = function(element, wrapper) {
    before(element, wrapper)
    append(wrapper, element)
  }

  var before$1 = function(marker, elements) {
    each(elements, function(x) {
      before(marker, x)
    })
  }
  var after$1 = function(marker, elements) {
    each(elements, function(x, i) {
      var e = i === 0 ? marker : elements[i - 1]
      after(e, x)
    })
  }
  var append$1 = function(parent, elements) {
    each(elements, function(x) {
      append(parent, x)
    })
  }

  var empty = function(element) {
    element.dom().textContent = ''
    each(children(element), function(rogue) {
      remove$2(rogue)
    })
  }
  var remove$2 = function(element) {
    var dom = element.dom()
    if (dom.parentNode !== null) {
      dom.parentNode.removeChild(dom)
    }
  }
  var unwrap = function(wrapper) {
    var children$1 = children(wrapper)
    if (children$1.length > 0) {
      before$1(wrapper, children$1)
    }
    remove$2(wrapper)
  }

  var grid = function(rows, columns) {
    return {
      rows: constant(rows),
      columns: constant(columns)
    }
  }
  var address = function(row, column) {
    return {
      row: constant(row),
      column: constant(column)
    }
  }
  var detail = function(element, rowspan, colspan) {
    return {
      element: constant(element),
      rowspan: constant(rowspan),
      colspan: constant(colspan)
    }
  }
  var detailnew = function(element, rowspan, colspan, isNew) {
    return {
      element: constant(element),
      rowspan: constant(rowspan),
      colspan: constant(colspan),
      isNew: constant(isNew)
    }
  }
  var extended = function(element, rowspan, colspan, row, column) {
    return {
      element: constant(element),
      rowspan: constant(rowspan),
      colspan: constant(colspan),
      row: constant(row),
      column: constant(column)
    }
  }
  var rowdata = function(element, cells, section) {
    return {
      element: constant(element),
      cells: constant(cells),
      section: constant(section)
    }
  }
  var elementnew = function(element, isNew) {
    return {
      element: constant(element),
      isNew: constant(isNew)
    }
  }
  var rowdatanew = function(element, cells, section, isNew) {
    return {
      element: constant(element),
      cells: constant(cells),
      section: constant(section),
      isNew: constant(isNew)
    }
  }
  var rowcells = function(cells, section) {
    return {
      cells: constant(cells),
      section: constant(section)
    }
  }
  var rowdetails = function(details, section) {
    return {
      details: constant(details),
      section: constant(section)
    }
  }
  var bounds = function(startRow, startCol, finishRow, finishCol) {
    return {
      startRow: constant(startRow),
      startCol: constant(startCol),
      finishRow: constant(finishRow),
      finishCol: constant(finishCol)
    }
  }

  var ancestors = function(scope, predicate, isRoot) {
    return filter(parents(scope, isRoot), predicate)
  }
  var children$1 = function(scope, predicate) {
    return filter(children(scope), predicate)
  }
  var descendants = function(scope, predicate) {
    var result = []
    each(children(scope), function(x) {
      if (predicate(x)) {
        result = result.concat([x])
      }
      result = result.concat(descendants(x, predicate))
    })
    return result
  }

  var ancestors$1 = function(scope, selector, isRoot) {
    return ancestors(
      scope,
      function(e) {
        return is(e, selector)
      },
      isRoot
    )
  }
  var children$2 = function(scope, selector) {
    return children$1(scope, function(e) {
      return is(e, selector)
    })
  }
  var descendants$1 = function(scope, selector) {
    return all(selector, scope)
  }

  function ClosestOrAncestor(is, ancestor, scope, a, isRoot) {
    return is(scope, a)
      ? Option.some(scope)
      : isFunction(isRoot) && isRoot(scope)
      ? Option.none()
      : ancestor(scope, a, isRoot)
  }

  var ancestor = function(scope, predicate, isRoot) {
    var element = scope.dom()
    var stop = isFunction(isRoot) ? isRoot : constant(false)
    while (element.parentNode) {
      element = element.parentNode
      var el = Element.fromDom(element)
      if (predicate(el)) {
        return Option.some(el)
      } else if (stop(el)) {
        break
      }
    }
    return Option.none()
  }
  var closest = function(scope, predicate, isRoot) {
    var is = function(s, test) {
      return test(s)
    }
    return ClosestOrAncestor(is, ancestor, scope, predicate, isRoot)
  }
  var child$1 = function(scope, predicate) {
    var pred = function(node) {
      return predicate(Element.fromDom(node))
    }
    var result = find(scope.dom().childNodes, pred)
    return result.map(Element.fromDom)
  }
  var descendant = function(scope, predicate) {
    var descend = function(node) {
      for (var i = 0; i < node.childNodes.length; i++) {
        var child_1 = Element.fromDom(node.childNodes[i])
        if (predicate(child_1)) {
          return Option.some(child_1)
        }
        var res = descend(node.childNodes[i])
        if (res.isSome()) {
          return res
        }
      }
      return Option.none()
    }
    return descend(scope.dom())
  }

  var ancestor$1 = function(scope, selector, isRoot) {
    return ancestor(
      scope,
      function(e) {
        return is(e, selector)
      },
      isRoot
    )
  }
  var child$2 = function(scope, selector) {
    return child$1(scope, function(e) {
      return is(e, selector)
    })
  }
  var descendant$1 = function(scope, selector) {
    return one(selector, scope)
  }
  var closest$1 = function(scope, selector, isRoot) {
    var is$1 = function(element, selector) {
      return is(element, selector)
    }
    return ClosestOrAncestor(is$1, ancestor$1, scope, selector, isRoot)
  }

  var getAttrValue = function(cell, name, fallback) {
    if (fallback === void 0) {
      fallback = 0
    }
    return getOpt(cell, name)
      .map(function(value) {
        return parseInt(value, 10)
      })
      .getOr(fallback)
  }
  var getSpan = function(cell, type) {
    return getAttrValue(cell, type, 1)
  }
  var hasColspan = function(cell) {
    return getSpan(cell, 'colspan') > 1
  }
  var hasRowspan = function(cell) {
    return getSpan(cell, 'rowspan') > 1
  }
  var getCssValue = function(element, property) {
    return parseInt(get$2(element, property), 10)
  }
  var minWidth = constant(10)
  var minHeight = constant(10)

  var firstLayer = function(scope, selector) {
    return filterFirstLayer(scope, selector, constant(true))
  }
  var filterFirstLayer = function(scope, selector, predicate) {
    return bind(children(scope), function(x) {
      return is(x, selector)
        ? predicate(x)
          ? [x]
          : []
        : filterFirstLayer(x, selector, predicate)
    })
  }

  var lookup = function(tags, element, isRoot) {
    if (isRoot === void 0) {
      isRoot = never
    }
    if (isRoot(element)) {
      return Option.none()
    }
    if (contains(tags, name(element))) {
      return Option.some(element)
    }
    var isRootOrUpperTable = function(elm) {
      return is(elm, 'table') || isRoot(elm)
    }
    return ancestor$1(element, tags.join(','), isRootOrUpperTable)
  }
  var cell = function(element, isRoot) {
    return lookup(['td', 'th'], element, isRoot)
  }
  var cells = function(ancestor) {
    return firstLayer(ancestor, 'th,td')
  }
  var table = function(element, isRoot) {
    return closest$1(element, 'table', isRoot)
  }
  var rows = function(ancestor) {
    return firstLayer(ancestor, 'tr')
  }

  var fromTable = function(table) {
    var rows$1 = rows(table)
    return map(rows$1, function(row) {
      var element = row
      var parent$1 = parent(element)
      var parentSection = parent$1
        .map(function(p) {
          var parentName = name(p)
          return parentName === 'tfoot' ||
            parentName === 'thead' ||
            parentName === 'tbody'
            ? parentName
            : 'tbody'
        })
        .getOr('tbody')
      var cells$1 = map(cells(row), function(cell) {
        var rowspan = getAttrValue(cell, 'rowspan', 1)
        var colspan = getAttrValue(cell, 'colspan', 1)
        return detail(cell, rowspan, colspan)
      })
      return rowdata(element, cells$1, parentSection)
    })
  }
  var fromPastedRows = function(rows, example) {
    return map(rows, function(row) {
      var cells$1 = map(cells(row), function(cell) {
        var rowspan = getAttrValue(cell, 'rowspan', 1)
        var colspan = getAttrValue(cell, 'colspan', 1)
        return detail(cell, rowspan, colspan)
      })
      return rowdata(row, cells$1, example.section())
    })
  }

  var key = function(row, column) {
    return row + ',' + column
  }
  var getAt = function(warehouse, row, column) {
    var raw = warehouse.access[key(row, column)]
    return raw !== undefined ? Option.some(raw) : Option.none()
  }
  var findItem = function(warehouse, item, comparator) {
    var filtered = filterItems(warehouse, function(detail) {
      return comparator(item, detail.element())
    })
    return filtered.length > 0 ? Option.some(filtered[0]) : Option.none()
  }
  var filterItems = function(warehouse, predicate) {
    var all = bind(warehouse.all, function(r) {
      return r.cells()
    })
    return filter(all, predicate)
  }
  var generate = function(list) {
    var access = {}
    var cells = []
    var maxRows = list.length
    var maxColumns = 0
    each(list, function(details, r) {
      var currentRow = []
      each(details.cells(), function(detail) {
        var start = 0
        while (access[key(r, start)] !== undefined) {
          start++
        }
        var current = extended(
          detail.element(),
          detail.rowspan(),
          detail.colspan(),
          r,
          start
        )
        for (var i = 0; i < detail.colspan(); i++) {
          for (var j = 0; j < detail.rowspan(); j++) {
            var cr = r + j
            var cc = start + i
            var newpos = key(cr, cc)
            access[newpos] = current
            maxColumns = Math.max(maxColumns, cc + 1)
          }
        }
        currentRow.push(current)
      })
      cells.push(rowdata(details.element(), currentRow, details.section()))
    })
    var grid$1 = grid(maxRows, maxColumns)
    return {
      grid: grid$1,
      access: access,
      all: cells
    }
  }
  var fromTable$1 = function(table) {
    var list = fromTable(table)
    return generate(list)
  }
  var justCells = function(warehouse) {
    var rows = map(warehouse.all, function(w) {
      return w.cells()
    })
    return flatten(rows)
  }
  var Warehouse = {
    fromTable: fromTable$1,
    generate: generate,
    getAt: getAt,
    findItem: findItem,
    filterItems: filterItems,
    justCells: justCells
  }

  var statsStruct = function(minRow, minCol, maxRow, maxCol) {
    return {
      minRow: minRow,
      minCol: minCol,
      maxRow: maxRow,
      maxCol: maxCol
    }
  }
  var findSelectedStats = function(house, isSelected) {
    var totalColumns = house.grid.columns()
    var totalRows = house.grid.rows()
    var minRow = totalRows
    var minCol = totalColumns
    var maxRow = 0
    var maxCol = 0
    each$1(house.access, function(detail) {
      if (isSelected(detail)) {
        var startRow = detail.row()
        var endRow = startRow + detail.rowspan() - 1
        var startCol = detail.column()
        var endCol = startCol + detail.colspan() - 1
        if (startRow < minRow) {
          minRow = startRow
        } else if (endRow > maxRow) {
          maxRow = endRow
        }
        if (startCol < minCol) {
          minCol = startCol
        } else if (endCol > maxCol) {
          maxCol = endCol
        }
      }
    })
    return statsStruct(minRow, minCol, maxRow, maxCol)
  }
  var makeCell = function(list, seenSelected, rowIndex) {
    var row = list[rowIndex].element()
    var td = Element.fromTag('td')
    append(td, Element.fromTag('br'))
    var f = seenSelected ? append : prepend
    f(row, td)
  }
  var fillInGaps = function(list, house, stats, isSelected) {
    var totalColumns = house.grid.columns()
    var totalRows = house.grid.rows()
    for (var i = 0; i < totalRows; i++) {
      var seenSelected = false
      for (var j = 0; j < totalColumns; j++) {
        if (
          !(
            i < stats.minRow ||
            i > stats.maxRow ||
            j < stats.minCol ||
            j > stats.maxCol
          )
        ) {
          var needCell = Warehouse.getAt(house, i, j)
            .filter(isSelected)
            .isNone()
          if (needCell) {
            makeCell(list, seenSelected, i)
          } else {
            seenSelected = true
          }
        }
      }
    }
  }
  var clean = function(table, stats) {
    var emptyRows = filter(firstLayer(table, 'tr'), function(row) {
      return row.dom().childElementCount === 0
    })
    each(emptyRows, remove$2)
    if (stats.minCol === stats.maxCol || stats.minRow === stats.maxRow) {
      each(firstLayer(table, 'th,td'), function(cell) {
        remove(cell, 'rowspan')
        remove(cell, 'colspan')
      })
    }
    remove(table, 'width')
    remove(table, 'height')
    remove$1(table, 'width')
    remove$1(table, 'height')
  }
  var extract = function(table, selectedSelector) {
    var isSelected = function(detail) {
      return is(detail.element(), selectedSelector)
    }
    var list = fromTable(table)
    var house = Warehouse.generate(list)
    var stats = findSelectedStats(house, isSelected)
    var selector =
      'th:not(' + selectedSelector + ')' + ',td:not(' + selectedSelector + ')'
    var unselectedCells = filterFirstLayer(table, 'th,td', function(cell) {
      return is(cell, selector)
    })
    each(unselectedCells, remove$2)
    fillInGaps(list, house, stats, isSelected)
    clean(table, stats)
    return table
  }

  var nbsp = '\xA0'

  function NodeValue(is, name) {
    var get = function(element) {
      if (!is(element)) {
        throw new Error(
          'Can only get ' + name + ' value of a ' + name + ' node'
        )
      }
      return getOption(element).getOr('')
    }
    var getOption = function(element) {
      return is(element) ? Option.from(element.dom().nodeValue) : Option.none()
    }
    var set = function(element, value) {
      if (!is(element)) {
        throw new Error(
          'Can only set raw ' + name + ' value of a ' + name + ' node'
        )
      }
      element.dom().nodeValue = value
    }
    return {
      get: get,
      getOption: getOption,
      set: set
    }
  }

  var api = NodeValue(isText, 'text')
  var get$3 = function(element) {
    return api.get(element)
  }
  var getOption = function(element) {
    return api.getOption(element)
  }
  var set$2 = function(element, value) {
    return api.set(element, value)
  }

  var getEnd = function(element) {
    return name(element) === 'img'
      ? 1
      : getOption(element).fold(
          function() {
            return children(element).length
          },
          function(v) {
            return v.length
          }
        )
  }
  var isTextNodeWithCursorPosition = function(el) {
    return getOption(el)
      .filter(function(text) {
        return text.trim().length !== 0 || text.indexOf(nbsp) > -1
      })
      .isSome()
  }
  var elementsWithCursorPosition = ['img', 'br']
  var isCursorPosition = function(elem) {
    var hasCursorPosition = isTextNodeWithCursorPosition(elem)
    return hasCursorPosition || contains(elementsWithCursorPosition, name(elem))
  }

  var first = function(element) {
    return descendant(element, isCursorPosition)
  }
  var last$1 = function(element) {
    return descendantRtl(element, isCursorPosition)
  }
  var descendantRtl = function(scope, predicate) {
    var descend = function(element) {
      var children$1 = children(element)
      for (var i = children$1.length - 1; i >= 0; i--) {
        var child = children$1[i]
        if (predicate(child)) {
          return Option.some(child)
        }
        var res = descend(child)
        if (res.isSome()) {
          return res
        }
      }
      return Option.none()
    }
    return descend(scope)
  }

  var clone$1 = function(original, isDeep) {
    return Element.fromDom(original.dom().cloneNode(isDeep))
  }
  var shallow = function(original) {
    return clone$1(original, false)
  }
  var deep = function(original) {
    return clone$1(original, true)
  }
  var shallowAs = function(original, tag) {
    var nu = Element.fromTag(tag)
    var attributes = clone(original)
    setAll(nu, attributes)
    return nu
  }
  var copy$1 = function(original, tag) {
    var nu = shallowAs(original, tag)
    var cloneChildren = children(deep(original))
    append$1(nu, cloneChildren)
    return nu
  }

  var createCell = function() {
    var td = Element.fromTag('td')
    append(td, Element.fromTag('br'))
    return td
  }
  var replace = function(cell, tag, attrs) {
    var replica = copy$1(cell, tag)
    each$1(attrs, function(v, k) {
      if (v === null) {
        remove(replica, k)
      } else {
        set(replica, k, v)
      }
    })
    return replica
  }
  var pasteReplace = function(cell) {
    return cell
  }
  var newRow = function(doc) {
    return function() {
      return Element.fromTag('tr', doc.dom())
    }
  }
  var cloneFormats = function(oldCell, newCell, formats) {
    var first$1 = first(oldCell)
    return first$1
      .map(function(firstText) {
        var formatSelector = formats.join(',')
        var parents = ancestors$1(firstText, formatSelector, function(element) {
          return eq(element, oldCell)
        })
        return foldr(
          parents,
          function(last, parent) {
            var clonedFormat = shallow(parent)
            remove(clonedFormat, 'contenteditable')
            append(last, clonedFormat)
            return clonedFormat
          },
          newCell
        )
      })
      .getOr(newCell)
  }
  var cellOperations = function(mutate, doc, formatsToClone) {
    var newCell = function(prev) {
      var docu = owner(prev.element())
      var td = Element.fromTag(name(prev.element()), docu.dom())
      var formats = formatsToClone.getOr([
        'strong',
        'em',
        'b',
        'i',
        'span',
        'font',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'div'
      ])
      var lastNode =
        formats.length > 0 ? cloneFormats(prev.element(), td, formats) : td
      append(lastNode, Element.fromTag('br'))
      copy(prev.element(), td)
      remove$1(td, 'height')
      if (prev.colspan() !== 1) {
        remove$1(prev.element(), 'width')
      }
      mutate(prev.element(), td)
      return td
    }
    return {
      row: newRow(doc),
      cell: newCell,
      replace: replace,
      gap: createCell
    }
  }
  var paste = function(doc) {
    return {
      row: newRow(doc),
      cell: createCell,
      replace: pasteReplace,
      gap: createCell
    }
  }

  var fromHtml$1 = function(html, scope) {
    var doc = scope || domGlobals.document
    var div = doc.createElement('div')
    div.innerHTML = html
    return children(Element.fromDom(div))
  }
  var fromDom$1 = function(nodes) {
    return map(nodes, Element.fromDom)
  }

  var inSelection = function(bounds, detail) {
    var leftEdge = detail.column()
    var rightEdge = detail.column() + detail.colspan() - 1
    var topEdge = detail.row()
    var bottomEdge = detail.row() + detail.rowspan() - 1
    return (
      leftEdge <= bounds.finishCol() &&
      rightEdge >= bounds.startCol() &&
      topEdge <= bounds.finishRow() &&
      bottomEdge >= bounds.startRow()
    )
  }
  var isWithin = function(bounds, detail) {
    return (
      detail.column() >= bounds.startCol() &&
      detail.column() + detail.colspan() - 1 <= bounds.finishCol() &&
      detail.row() >= bounds.startRow() &&
      detail.row() + detail.rowspan() - 1 <= bounds.finishRow()
    )
  }
  var isRectangular = function(warehouse, bounds) {
    var isRect = true
    var detailIsWithin = curry(isWithin, bounds)
    for (var i = bounds.startRow(); i <= bounds.finishRow(); i++) {
      for (var j = bounds.startCol(); j <= bounds.finishCol(); j++) {
        isRect =
          isRect && Warehouse.getAt(warehouse, i, j).exists(detailIsWithin)
      }
    }
    return isRect ? Option.some(bounds) : Option.none()
  }

  var getBounds = function(detailA, detailB) {
    return bounds(
      Math.min(detailA.row(), detailB.row()),
      Math.min(detailA.column(), detailB.column()),
      Math.max(
        detailA.row() + detailA.rowspan() - 1,
        detailB.row() + detailB.rowspan() - 1
      ),
      Math.max(
        detailA.column() + detailA.colspan() - 1,
        detailB.column() + detailB.colspan() - 1
      )
    )
  }
  var getAnyBox = function(warehouse, startCell, finishCell) {
    var startCoords = Warehouse.findItem(warehouse, startCell, eq)
    var finishCoords = Warehouse.findItem(warehouse, finishCell, eq)
    return startCoords.bind(function(sc) {
      return finishCoords.map(function(fc) {
        return getBounds(sc, fc)
      })
    })
  }
  var getBox = function(warehouse, startCell, finishCell) {
    return getAnyBox(warehouse, startCell, finishCell).bind(function(bounds) {
      return isRectangular(warehouse, bounds)
    })
  }

  var moveBy = function(warehouse, cell, row, column) {
    return Warehouse.findItem(warehouse, cell, eq).bind(function(detail) {
      var startRow =
        row > 0 ? detail.row() + detail.rowspan() - 1 : detail.row()
      var startCol =
        column > 0 ? detail.column() + detail.colspan() - 1 : detail.column()
      var dest = Warehouse.getAt(warehouse, startRow + row, startCol + column)
      return dest.map(function(d) {
        return d.element()
      })
    })
  }
  var intercepts = function(warehouse, start, finish) {
    return getAnyBox(warehouse, start, finish).map(function(bounds) {
      var inside = Warehouse.filterItems(warehouse, curry(inSelection, bounds))
      return map(inside, function(detail) {
        return detail.element()
      })
    })
  }
  var parentCell = function(warehouse, innerCell) {
    var isContainedBy = function(c1, c2) {
      return contains$2(c2, c1)
    }
    return Warehouse.findItem(warehouse, innerCell, isContainedBy).map(function(
      detail
    ) {
      return detail.element()
    })
  }

  var moveBy$1 = function(cell, deltaRow, deltaColumn) {
    return table(cell).bind(function(table) {
      var warehouse = getWarehouse(table)
      return moveBy(warehouse, cell, deltaRow, deltaColumn)
    })
  }
  var intercepts$1 = function(table, first, last) {
    var warehouse = getWarehouse(table)
    return intercepts(warehouse, first, last)
  }
  var nestedIntercepts = function(table, first, firstTable, last, lastTable) {
    var warehouse = getWarehouse(table)
    var optStartCell = eq(table, firstTable)
      ? Option.some(first)
      : parentCell(warehouse, first)
    var optLastCell = eq(table, lastTable)
      ? Option.some(last)
      : parentCell(warehouse, last)
    return optStartCell.bind(function(startCell) {
      return optLastCell.bind(function(lastCell) {
        return intercepts(warehouse, startCell, lastCell)
      })
    })
  }
  var getBox$1 = function(table, first, last) {
    var warehouse = getWarehouse(table)
    return getBox(warehouse, first, last)
  }
  var getWarehouse = Warehouse.fromTable

  var TagBoundaries = [
    'body',
    'p',
    'div',
    'article',
    'aside',
    'figcaption',
    'figure',
    'footer',
    'header',
    'nav',
    'section',
    'ol',
    'ul',
    'li',
    'table',
    'thead',
    'tbody',
    'tfoot',
    'caption',
    'tr',
    'td',
    'th',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'pre',
    'address'
  ]

  function DomUniverse() {
    var clone$1 = function(element) {
      return Element.fromDom(element.dom().cloneNode(false))
    }
    var document = function(element) {
      return element.dom().ownerDocument
    }
    var isBoundary = function(element) {
      if (!isElement(element)) {
        return false
      }
      if (name(element) === 'body') {
        return true
      }
      return contains(TagBoundaries, name(element))
    }
    var isEmptyTag = function(element) {
      if (!isElement(element)) {
        return false
      }
      return contains(['br', 'img', 'hr', 'input'], name(element))
    }
    var isNonEditable = function(element) {
      return isElement(element) && get$1(element, 'contenteditable') === 'false'
    }
    var comparePosition = function(element, other) {
      return element.dom().compareDocumentPosition(other.dom())
    }
    var copyAttributesTo = function(source, destination) {
      var as = clone(source)
      setAll(destination, as)
    }
    return {
      up: constant({
        selector: ancestor$1,
        closest: closest$1,
        predicate: ancestor,
        all: parents
      }),
      down: constant({
        selector: descendants$1,
        predicate: descendants
      }),
      styles: constant({
        get: get$2,
        getRaw: getRaw,
        set: set$1,
        remove: remove$1
      }),
      attrs: constant({
        get: get$1,
        set: set,
        remove: remove,
        copyTo: copyAttributesTo
      }),
      insert: constant({
        before: before,
        after: after,
        afterAll: after$1,
        append: append,
        appendAll: append$1,
        prepend: prepend,
        wrap: wrap
      }),
      remove: constant({
        unwrap: unwrap,
        remove: remove$2
      }),
      create: constant({
        nu: Element.fromTag,
        clone: clone$1,
        text: Element.fromText
      }),
      query: constant({
        comparePosition: comparePosition,
        prevSibling: prevSibling,
        nextSibling: nextSibling
      }),
      property: constant({
        children: children,
        name: name,
        parent: parent,
        document: document,
        isText: isText,
        isComment: isComment,
        isElement: isElement,
        getText: get$3,
        setText: set$2,
        isBoundary: isBoundary,
        isEmptyTag: isEmptyTag,
        isNonEditable: isNonEditable
      }),
      eq: eq,
      is: is$1
    }
  }

  var all$1 = function(universe, look, elements, f) {
    var head = elements[0]
    var tail = elements.slice(1)
    return f(universe, look, head, tail)
  }
  var oneAll = function(universe, look, elements) {
    return elements.length > 0
      ? all$1(universe, look, elements, unsafeOne)
      : Option.none()
  }
  var unsafeOne = function(universe, look, head, tail) {
    var start = look(universe, head)
    return foldr(
      tail,
      function(b, a) {
        var current = look(universe, a)
        return commonElement(universe, b, current)
      },
      start
    )
  }
  var commonElement = function(universe, start, end) {
    return start.bind(function(s) {
      return end.filter(curry(universe.eq, s))
    })
  }

  var eq$1 = function(universe, item) {
    return curry(universe.eq, item)
  }
  var ancestors$2 = function(universe, start, end, isRoot) {
    if (isRoot === void 0) {
      isRoot = never
    }
    var ps1 = [start].concat(universe.up().all(start))
    var ps2 = [end].concat(universe.up().all(end))
    var prune = function(path) {
      var index = findIndex(path, isRoot)
      return index.fold(
        function() {
          return path
        },
        function(ind) {
          return path.slice(0, ind + 1)
        }
      )
    }
    var pruned1 = prune(ps1)
    var pruned2 = prune(ps2)
    var shared = find(pruned1, function(x) {
      return exists(pruned2, eq$1(universe, x))
    })
    return {
      firstpath: constant(pruned1),
      secondpath: constant(pruned2),
      shared: constant(shared)
    }
  }

  var sharedOne = oneAll
  var ancestors$3 = ancestors$2

  var universe = DomUniverse()
  var sharedOne$1 = function(look, elements) {
    return sharedOne(
      universe,
      function(_universe, element) {
        return look(element)
      },
      elements
    )
  }
  var ancestors$4 = function(start, finish, isRoot) {
    return ancestors$3(universe, start, finish, isRoot)
  }

  var lookupTable = function(container) {
    return ancestor$1(container, 'table')
  }
  var identify = function(start, finish, isRoot) {
    var getIsRoot = function(rootTable) {
      return function(element) {
        return (
          (isRoot !== undefined && isRoot(element)) || eq(element, rootTable)
        )
      }
    }
    if (eq(start, finish)) {
      return Option.some({
        boxes: Option.some([start]),
        start: start,
        finish: finish
      })
    } else {
      return lookupTable(start).bind(function(startTable) {
        return lookupTable(finish).bind(function(finishTable) {
          if (eq(startTable, finishTable)) {
            return Option.some({
              boxes: intercepts$1(startTable, start, finish),
              start: start,
              finish: finish
            })
          } else if (contains$2(startTable, finishTable)) {
            var ancestorCells = ancestors$1(
              finish,
              'td,th',
              getIsRoot(startTable)
            )
            var finishCell =
              ancestorCells.length > 0
                ? ancestorCells[ancestorCells.length - 1]
                : finish
            return Option.some({
              boxes: nestedIntercepts(
                startTable,
                start,
                startTable,
                finish,
                finishTable
              ),
              start: start,
              finish: finishCell
            })
          } else if (contains$2(finishTable, startTable)) {
            var ancestorCells = ancestors$1(
              start,
              'td,th',
              getIsRoot(finishTable)
            )
            var startCell =
              ancestorCells.length > 0
                ? ancestorCells[ancestorCells.length - 1]
                : start
            return Option.some({
              boxes: nestedIntercepts(
                finishTable,
                start,
                startTable,
                finish,
                finishTable
              ),
              start: start,
              finish: startCell
            })
          } else {
            return ancestors$4(start, finish)
              .shared()
              .bind(function(lca) {
                return closest$1(lca, 'table', isRoot).bind(function(lcaTable) {
                  var finishAncestorCells = ancestors$1(
                    finish,
                    'td,th',
                    getIsRoot(lcaTable)
                  )
                  var finishCell =
                    finishAncestorCells.length > 0
                      ? finishAncestorCells[finishAncestorCells.length - 1]
                      : finish
                  var startAncestorCells = ancestors$1(
                    start,
                    'td,th',
                    getIsRoot(lcaTable)
                  )
                  var startCell =
                    startAncestorCells.length > 0
                      ? startAncestorCells[startAncestorCells.length - 1]
                      : start
                  return Option.some({
                    boxes: nestedIntercepts(
                      lcaTable,
                      start,
                      startTable,
                      finish,
                      finishTable
                    ),
                    start: startCell,
                    finish: finishCell
                  })
                })
              })
          }
        })
      })
    }
  }
  var retrieve = function(container, selector) {
    var sels = descendants$1(container, selector)
    return sels.length > 0 ? Option.some(sels) : Option.none()
  }
  var getLast = function(boxes, lastSelectedSelector) {
    return find(boxes, function(box) {
      return is(box, lastSelectedSelector)
    })
  }
  var getEdges = function(
    container,
    firstSelectedSelector,
    lastSelectedSelector
  ) {
    return descendant$1(container, firstSelectedSelector).bind(function(first) {
      return descendant$1(container, lastSelectedSelector).bind(function(last) {
        return sharedOne$1(lookupTable, [first, last]).map(function(tbl) {
          return {
            first: constant(first),
            last: constant(last),
            table: constant(tbl)
          }
        })
      })
    })
  }
  var expandTo = function(finish, firstSelectedSelector) {
    return ancestor$1(finish, 'table').bind(function(table) {
      return descendant$1(table, firstSelectedSelector).bind(function(start) {
        return identify(start, finish).bind(function(identified) {
          return identified.boxes.map(function(boxes) {
            return {
              boxes: boxes,
              start: identified.start,
              finish: identified.finish
            }
          })
        })
      })
    })
  }
  var shiftSelection = function(
    boxes,
    deltaRow,
    deltaColumn,
    firstSelectedSelector,
    lastSelectedSelector
  ) {
    return getLast(boxes, lastSelectedSelector).bind(function(last) {
      return moveBy$1(last, deltaRow, deltaColumn).bind(function(finish) {
        return expandTo(finish, firstSelectedSelector)
      })
    })
  }

  var retrieve$1 = function(container, selector) {
    return retrieve(container, selector)
  }
  var retrieveBox = function(
    container,
    firstSelectedSelector,
    lastSelectedSelector
  ) {
    return getEdges(
      container,
      firstSelectedSelector,
      lastSelectedSelector
    ).bind(function(edges) {
      var isRoot = function(ancestor) {
        return eq(container, ancestor)
      }
      var firstAncestor = ancestor$1(
        edges.first(),
        'thead,tfoot,tbody,table',
        isRoot
      )
      var lastAncestor = ancestor$1(
        edges.last(),
        'thead,tfoot,tbody,table',
        isRoot
      )
      return firstAncestor.bind(function(fA) {
        return lastAncestor.bind(function(lA) {
          return eq(fA, lA)
            ? getBox$1(edges.table(), edges.first(), edges.last())
            : Option.none()
        })
      })
    })
  }

  var strSelected = 'data-mce-selected'
  var strSelectedSelector = 'td[' + strSelected + '],th[' + strSelected + ']'
  var strAttributeSelector = '[' + strSelected + ']'
  var strFirstSelected = 'data-mce-first-selected'
  var strFirstSelectedSelector =
    'td[' + strFirstSelected + '],th[' + strFirstSelected + ']'
  var strLastSelected = 'data-mce-last-selected'
  var strLastSelectedSelector =
    'td[' + strLastSelected + '],th[' + strLastSelected + ']'
  var selected = strSelected
  var selectedSelector = strSelectedSelector
  var attributeSelector = strAttributeSelector
  var firstSelected = strFirstSelected
  var firstSelectedSelector = strFirstSelectedSelector
  var lastSelected = strLastSelected
  var lastSelectedSelector = strLastSelectedSelector

  var Ephemera = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    selected: selected,
    selectedSelector: selectedSelector,
    attributeSelector: attributeSelector,
    firstSelected: firstSelected,
    firstSelectedSelector: firstSelectedSelector,
    lastSelected: lastSelected,
    lastSelectedSelector: lastSelectedSelector
  })

  var generate$1 = function(cases) {
    if (!isArray(cases)) {
      throw new Error('cases must be an array')
    }
    if (cases.length === 0) {
      throw new Error('there must be at least one case')
    }
    var constructors = []
    var adt = {}
    each(cases, function(acase, count) {
      var keys$1 = keys(acase)
      if (keys$1.length !== 1) {
        throw new Error('one and only one name per case')
      }
      var key = keys$1[0]
      var value = acase[key]
      if (adt[key] !== undefined) {
        throw new Error('duplicate key detected:' + key)
      } else if (key === 'cata') {
        throw new Error('cannot have a case named cata (sorry)')
      } else if (!isArray(value)) {
        throw new Error('case arguments must be an array')
      }
      constructors.push(key)
      adt[key] = function() {
        var argLength = arguments.length
        if (argLength !== value.length) {
          throw new Error(
            'Wrong number of arguments to case ' +
              key +
              '. Expected ' +
              value.length +
              ' (' +
              value +
              '), got ' +
              argLength
          )
        }
        var args = new Array(argLength)
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i]
        }
        var match = function(branches) {
          var branchKeys = keys(branches)
          if (constructors.length !== branchKeys.length) {
            throw new Error(
              'Wrong number of arguments to match. Expected: ' +
                constructors.join(',') +
                '\nActual: ' +
                branchKeys.join(',')
            )
          }
          var allReqd = forall(constructors, function(reqKey) {
            return contains(branchKeys, reqKey)
          })
          if (!allReqd) {
            throw new Error(
              'Not all branches were specified when using match. Specified: ' +
                branchKeys.join(', ') +
                '\nRequired: ' +
                constructors.join(', ')
            )
          }
          return branches[key].apply(null, args)
        }
        return {
          fold: function() {
            if (arguments.length !== cases.length) {
              throw new Error(
                'Wrong number of arguments to fold. Expected ' +
                  cases.length +
                  ', got ' +
                  arguments.length
              )
            }
            var target = arguments[count]
            return target.apply(null, args)
          },
          match: match,
          log: function(label) {
            domGlobals.console.log(label, {
              constructors: constructors,
              constructor: key,
              params: args
            })
          }
        }
      }
    })
    return adt
  }
  var Adt = { generate: generate$1 }

  var type$1 = Adt.generate([
    { none: [] },
    { multiple: ['elements'] },
    { single: ['selection'] }
  ])
  var cata = function(subject, onNone, onMultiple, onSingle) {
    return subject.fold(onNone, onMultiple, onSingle)
  }
  var none$1 = type$1.none
  var multiple = type$1.multiple
  var single = type$1.single

  var selection = function(cell, selections) {
    return cata(selections.get(), constant([]), identity, constant([cell]))
  }
  var unmergable = function(cell, selections) {
    var hasSpan = function(elem) {
      return (
        (has$1(elem, 'rowspan') && parseInt(get$1(elem, 'rowspan'), 10) > 1) ||
        (has$1(elem, 'colspan') && parseInt(get$1(elem, 'colspan'), 10) > 1)
      )
    }
    var candidates = selection(cell, selections)
    return candidates.length > 0 && forall(candidates, hasSpan)
      ? Option.some(candidates)
      : Option.none()
  }
  var mergable = function(table, selections) {
    return cata(
      selections.get(),
      Option.none,
      function(cells, _env) {
        if (cells.length === 0) {
          return Option.none()
        }
        return retrieveBox(
          table,
          firstSelectedSelector,
          lastSelectedSelector
        ).bind(function(bounds) {
          return cells.length > 1
            ? Option.some({
                bounds: constant(bounds),
                cells: constant(cells)
              })
            : Option.none()
        })
      },
      Option.none
    )
  }

  var noMenu = function(cell) {
    return {
      element: constant(cell),
      mergable: Option.none,
      unmergable: Option.none,
      selection: constant([cell])
    }
  }
  var forMenu = function(selections, table, cell) {
    return {
      element: constant(cell),
      mergable: constant(mergable(table, selections)),
      unmergable: constant(unmergable(cell, selections)),
      selection: constant(selection(cell, selections))
    }
  }
  var paste$1 = function(element, clipboard, generators) {
    return {
      element: constant(element),
      clipboard: constant(clipboard),
      generators: constant(generators)
    }
  }
  var pasteRows = function(selections, cell, clipboard, generators) {
    return {
      selection: constant(selection(cell, selections)),
      clipboard: constant(clipboard),
      generators: constant(generators)
    }
  }

  var extractSelected = function(cells) {
    return table(cells[0])
      .map(deep)
      .map(function(replica) {
        return [extract(replica, attributeSelector)]
      })
  }
  var serializeElements = function(editor, elements) {
    return map(elements, function(elm) {
      return editor.selection.serializer.serialize(elm.dom(), {})
    }).join('')
  }
  var getTextContent = function(elements) {
    return map(elements, function(element) {
      return element.dom().innerText
    }).join('')
  }
  var registerEvents = function(editor, selections, actions, cellSelection) {
    editor.on('BeforeGetContent', function(e) {
      var multiCellContext = function(cells) {
        e.preventDefault()
        extractSelected(cells).each(function(elements) {
          e.content =
            e.format === 'text'
              ? getTextContent(elements)
              : serializeElements(editor, elements)
        })
      }
      if (e.selection === true) {
        cata(selections.get(), noop, multiCellContext, noop)
      }
    })
    editor.on('BeforeSetContent', function(e) {
      if (e.selection === true && e.paste === true) {
        var cellOpt = Option.from(
          editor.dom.getParent(editor.selection.getStart(), 'th,td')
        )
        cellOpt.each(function(domCell) {
          var cell = Element.fromDom(domCell)
          table(cell).each(function(table) {
            var elements = filter(fromHtml$1(e.content), function(content) {
              return name(content) !== 'meta'
            })
            var isTable = function(elm) {
              return name(elm) === 'table'
            }
            if (elements.length === 1 && isTable(elements[0])) {
              e.preventDefault()
              var doc = Element.fromDom(editor.getDoc())
              var generators = paste(doc)
              var targets = paste$1(cell, elements[0], generators)
              actions.pasteCells(table, targets).each(function(rng) {
                editor.selection.setRng(rng)
                editor.focus()
                cellSelection.clear(table)
              })
            }
          })
        })
      }
    })
  }

  var r = function(left, top) {
    var translate = function(x, y) {
      return r(left + x, top + y)
    }
    return {
      left: constant(left),
      top: constant(top),
      translate: translate
    }
  }
  var Position = r

  var boxPosition = function(dom) {
    var box = dom.getBoundingClientRect()
    return Position(box.left, box.top)
  }
  var firstDefinedOrZero = function(a, b) {
    if (a !== undefined) {
      return a
    } else {
      return b !== undefined ? b : 0
    }
  }
  var absolute = function(element) {
    var doc = element.dom().ownerDocument
    var body = doc.body
    var win = doc.defaultView
    var html = doc.documentElement
    if (body === element.dom()) {
      return Position(body.offsetLeft, body.offsetTop)
    }
    var scrollTop = firstDefinedOrZero(win.pageYOffset, html.scrollTop)
    var scrollLeft = firstDefinedOrZero(win.pageXOffset, html.scrollLeft)
    var clientTop = firstDefinedOrZero(html.clientTop, body.clientTop)
    var clientLeft = firstDefinedOrZero(html.clientLeft, body.clientLeft)
    return viewport(element).translate(
      scrollLeft - clientLeft,
      scrollTop - clientTop
    )
  }
  var viewport = function(element) {
    var dom = element.dom()
    var doc = dom.ownerDocument
    var body = doc.body
    if (body === dom) {
      return Position(body.offsetLeft, body.offsetTop)
    }
    if (!inBody(element)) {
      return Position(0, 0)
    }
    return boxPosition(dom)
  }

  var only = function(element) {
    var parent = Option.from(element.dom().documentElement)
      .map(Element.fromDom)
      .getOr(element)
    return {
      parent: constant(parent),
      view: constant(element),
      origin: constant(Position(0, 0))
    }
  }
  var detached = function(editable, chrome) {
    var origin = function() {
      return absolute(chrome)
    }
    return {
      parent: constant(chrome),
      view: constant(editable),
      origin: origin
    }
  }
  var body$1 = function(editable, chrome) {
    return {
      parent: constant(chrome),
      view: constant(editable),
      origin: constant(Position(0, 0))
    }
  }
  var ResizeWire = {
    only: only,
    detached: detached,
    body: body$1
  }

  function Dimension(name, getOffset) {
    var set = function(element, h) {
      if (!isNumber(h) && !h.match(/^[0-9]+$/)) {
        throw new Error(
          name + '.set accepts only positive integer values. Value was ' + h
        )
      }
      var dom = element.dom()
      if (isSupported(dom)) {
        dom.style[name] = h + 'px'
      }
    }
    var get = function(element) {
      var r = getOffset(element)
      if (r <= 0 || r === null) {
        var css = get$2(element, name)
        return parseFloat(css) || 0
      }
      return r
    }
    var getOuter = get
    var aggregate = function(element, properties) {
      return foldl(
        properties,
        function(acc, property) {
          var val = get$2(element, property)
          var value = val === undefined ? 0 : parseInt(val, 10)
          return isNaN(value) ? acc : acc + value
        },
        0
      )
    }
    var max = function(element, value, properties) {
      var cumulativeInclusions = aggregate(element, properties)
      var absoluteMax =
        value > cumulativeInclusions ? value - cumulativeInclusions : 0
      return absoluteMax
    }
    return {
      set: set,
      get: get,
      getOuter: getOuter,
      aggregate: aggregate,
      max: max
    }
  }

  var api$1 = Dimension('height', function(element) {
    var dom = element.dom()
    return inBody(element)
      ? dom.getBoundingClientRect().height
      : dom.offsetHeight
  })
  var get$4 = function(element) {
    return api$1.get(element)
  }
  var getOuter = function(element) {
    return api$1.getOuter(element)
  }

  var api$2 = Dimension('width', function(element) {
    return element.dom().offsetWidth
  })
  var get$5 = function(element) {
    return api$2.get(element)
  }
  var getOuter$1 = function(element) {
    return api$2.getOuter(element)
  }

  var rowInfo = function(row, y) {
    return {
      row: row,
      y: y
    }
  }
  var colInfo = function(col, x) {
    return {
      col: col,
      x: x
    }
  }
  var rtlEdge = function(cell) {
    var pos = absolute(cell)
    return pos.left() + getOuter$1(cell)
  }
  var ltrEdge = function(cell) {
    return absolute(cell).left()
  }
  var getLeftEdge = function(index, cell) {
    return colInfo(index, ltrEdge(cell))
  }
  var getRightEdge = function(index, cell) {
    return colInfo(index, rtlEdge(cell))
  }
  var getTop = function(cell) {
    return absolute(cell).top()
  }
  var getTopEdge = function(index, cell) {
    return rowInfo(index, getTop(cell))
  }
  var getBottomEdge = function(index, cell) {
    return rowInfo(index, getTop(cell) + getOuter(cell))
  }
  var findPositions = function(getInnerEdge, getOuterEdge, array) {
    if (array.length === 0) {
      return []
    }
    var lines = map(array.slice(1), function(cellOption, index) {
      return cellOption.map(function(cell) {
        return getInnerEdge(index, cell)
      })
    })
    var lastLine = array[array.length - 1].map(function(cell) {
      return getOuterEdge(array.length - 1, cell)
    })
    return lines.concat([lastLine])
  }
  var negate = function(step) {
    return -step
  }
  var height = {
    delta: identity,
    positions: function(optElements) {
      return findPositions(getTopEdge, getBottomEdge, optElements)
    },
    edge: getTop
  }
  var ltr = {
    delta: identity,
    edge: ltrEdge,
    positions: function(optElements) {
      return findPositions(getLeftEdge, getRightEdge, optElements)
    }
  }
  var rtl = {
    delta: negate,
    edge: rtlEdge,
    positions: function(optElements) {
      return findPositions(getRightEdge, getLeftEdge, optElements)
    }
  }

  var columns = function(warehouse) {
    var grid = warehouse.grid
    var cols = range(grid.columns(), identity)
    var rowsArr = range(grid.rows(), identity)
    return map(cols, function(col) {
      var getBlock = function() {
        return bind(rowsArr, function(r) {
          return Warehouse.getAt(warehouse, r, col)
            .filter(function(detail) {
              return detail.column() === col
            })
            .fold(constant([]), function(detail) {
              return [detail]
            })
        })
      }
      var isSingle = function(detail) {
        return detail.colspan() === 1
      }
      var getFallback = function() {
        return Warehouse.getAt(warehouse, 0, col)
      }
      return decide(getBlock, isSingle, getFallback)
    })
  }
  var decide = function(getBlock, isSingle, getFallback) {
    var inBlock = getBlock()
    var singleInBlock = find(inBlock, isSingle)
    var detailOption = singleInBlock.orThunk(function() {
      return Option.from(inBlock[0]).orThunk(getFallback)
    })
    return detailOption.map(function(detail) {
      return detail.element()
    })
  }
  var rows$1 = function(warehouse) {
    var grid = warehouse.grid
    var rowsArr = range(grid.rows(), identity)
    var cols = range(grid.columns(), identity)
    return map(rowsArr, function(row) {
      var getBlock = function() {
        return bind(cols, function(c) {
          return Warehouse.getAt(warehouse, row, c)
            .filter(function(detail) {
              return detail.row() === row
            })
            .fold(constant([]), function(detail) {
              return [detail]
            })
        })
      }
      var isSingle = function(detail) {
        return detail.rowspan() === 1
      }
      var getFallback = function() {
        return Warehouse.getAt(warehouse, row, 0)
      }
      return decide(getBlock, isSingle, getFallback)
    })
  }

  var deduce = function(xs, index) {
    if (index < 0 || index >= xs.length - 1) {
      return Option.none()
    }
    var current = xs[index].fold(
      function() {
        var rest = reverse(xs.slice(0, index))
        return findMap(rest, function(a, i) {
          return a.map(function(aa) {
            return {
              value: aa,
              delta: i + 1
            }
          })
        })
      },
      function(c) {
        return Option.some({
          value: c,
          delta: 0
        })
      }
    )
    var next = xs[index + 1].fold(
      function() {
        var rest = xs.slice(index + 1)
        return findMap(rest, function(a, i) {
          return a.map(function(aa) {
            return {
              value: aa,
              delta: i + 1
            }
          })
        })
      },
      function(n) {
        return Option.some({
          value: n,
          delta: 1
        })
      }
    )
    return current.bind(function(c) {
      return next.map(function(n) {
        var extras = n.delta + c.delta
        return Math.abs(n.value - c.value) / extras
      })
    })
  }

  var needManualCalc = function() {
    var browser = detect$3().browser
    return browser.isIE() || browser.isEdge()
  }
  var toNumber = function(px, fallback) {
    var num = parseFloat(px)
    return isNaN(num) ? fallback : num
  }
  var getProp = function(elm, name, fallback) {
    return toNumber(get$2(elm, name), fallback)
  }
  var getCalculatedHeight = function(cell) {
    var height = cell.dom().getBoundingClientRect().height
    var boxSizing = get$2(cell, 'box-sizing')
    if (boxSizing === 'border-box') {
      return height
    } else {
      var paddingTop = getProp(cell, 'padding-top', 0)
      var paddingBottom = getProp(cell, 'padding-bottom', 0)
      var borderTop = getProp(cell, 'border-top-width', 0)
      var borderBottom = getProp(cell, 'border-bottom-width', 0)
      var borders = borderTop + borderBottom
      return height - paddingTop - paddingBottom - borders
    }
  }
  var getCalculatedWidth = function(cell) {
    var width = cell.dom().getBoundingClientRect().width
    var boxSizing = get$2(cell, 'box-sizing')
    if (boxSizing === 'border-box') {
      return width
    } else {
      var paddingLeft = getProp(cell, 'padding-left', 0)
      var paddingRight = getProp(cell, 'padding-right', 0)
      var borderLeft = getProp(cell, 'border-left-width', 0)
      var borderRight = getProp(cell, 'border-right-width', 0)
      var borders = borderLeft + borderRight
      return width - paddingLeft - paddingRight - borders
    }
  }
  var getHeight = function(cell) {
    return needManualCalc()
      ? getCalculatedHeight(cell)
      : getProp(cell, 'height', get$4(cell))
  }
  var getWidth = function(cell) {
    return needManualCalc()
      ? getCalculatedWidth(cell)
      : getProp(cell, 'width', get$5(cell))
  }

  var rGenericSizeRegex = /(\d+(\.\d+)?)(\w|%)*/
  var rPercentageBasedSizeRegex = /(\d+(\.\d+)?)%/
  var rPixelBasedSizeRegex = /(\d+(\.\d+)?)px|em/
  var getPercentSize = function(elm, getter) {
    var relativeParent = offsetParent(elm).getOr(getBody(owner(elm)))
    return (getter(elm) / getter(relativeParent)) * 100
  }
  var setPixelWidth = function(cell, amount) {
    set$1(cell, 'width', amount + 'px')
  }
  var setPercentageWidth = function(cell, amount) {
    set$1(cell, 'width', amount + '%')
  }
  var setHeight = function(cell, amount) {
    set$1(cell, 'height', amount + 'px')
  }
  var getHeightValue = function(cell) {
    return getRaw(cell, 'height').getOrThunk(function() {
      return getHeight(cell) + 'px'
    })
  }
  var convert = function(cell, number, getter, setter) {
    var newSize = table(cell)
      .map(function(table) {
        var total = getter(table)
        return Math.floor((number / 100) * total)
      })
      .getOr(number)
    setter(cell, newSize)
    return newSize
  }
  var normalizePixelSize = function(value, cell, getter, setter) {
    var number = parseInt(value, 10)
    return endsWith(value, '%') && name(cell) !== 'table'
      ? convert(cell, number, getter, setter)
      : number
  }
  var getTotalHeight = function(cell) {
    var value = getHeightValue(cell)
    if (!value) {
      return get$4(cell)
    }
    return normalizePixelSize(value, cell, get$4, setHeight)
  }
  var get$6 = function(cell, type, f) {
    var v = f(cell)
    var span = getSpan(cell, type)
    return v / span
  }
  var getRawWidth = function(element) {
    var cssWidth = getRaw(element, 'width')
    return cssWidth.fold(
      function() {
        return Option.from(get$1(element, 'width'))
      },
      function(width) {
        return Option.some(width)
      }
    )
  }
  var normalizePercentageWidth = function(cellWidth, tableSize) {
    return (cellWidth / tableSize.pixelWidth()) * 100
  }
  var choosePercentageSize = function(element, width, tableSize) {
    var percentMatch = rPercentageBasedSizeRegex.exec(width)
    if (percentMatch !== null) {
      return parseFloat(percentMatch[1])
    } else {
      var intWidth = getWidth(element)
      return normalizePercentageWidth(intWidth, tableSize)
    }
  }
  var getPercentageWidth = function(cell, tableSize) {
    var width = getRawWidth(cell)
    return width.fold(
      function() {
        var intWidth = get$5(cell)
        return normalizePercentageWidth(intWidth, tableSize)
      },
      function(w) {
        return choosePercentageSize(cell, w, tableSize)
      }
    )
  }
  var normalizePixelWidth = function(cellWidth, tableSize) {
    return (cellWidth / 100) * tableSize.pixelWidth()
  }
  var choosePixelSize = function(element, width, tableSize) {
    var pixelMatch = rPixelBasedSizeRegex.exec(width)
    if (pixelMatch !== null) {
      return parseInt(pixelMatch[1], 10)
    }
    var percentMatch = rPercentageBasedSizeRegex.exec(width)
    if (percentMatch !== null) {
      var floatWidth = parseFloat(percentMatch[1])
      return normalizePixelWidth(floatWidth, tableSize)
    }
    return getWidth(element)
  }
  var getPixelWidth = function(cell, tableSize) {
    var width = getRawWidth(cell)
    return width.fold(
      function() {
        return getWidth(cell)
      },
      function(w) {
        return choosePixelSize(cell, w, tableSize)
      }
    )
  }
  var getHeight$1 = function(cell) {
    return get$6(cell, 'rowspan', getTotalHeight)
  }
  var getGenericWidth = function(cell) {
    var width = getRawWidth(cell)
    return width.bind(function(w) {
      var match = rGenericSizeRegex.exec(w)
      if (match !== null) {
        return Option.some({
          width: constant(parseFloat(match[1])),
          unit: constant(match[3])
        })
      } else {
        return Option.none()
      }
    })
  }
  var setGenericWidth = function(cell, amount, unit) {
    set$1(cell, 'width', amount + unit)
  }
  var getPixelTableWidth = function(table) {
    return get$5(table) + 'px'
  }
  var getPercentTableWidth = function(table) {
    return getPercentSize(table, get$5) + '%'
  }
  var isPercentSizing = function(table) {
    return getRawWidth(table).exists(function(size) {
      return rPercentageBasedSizeRegex.test(size)
    })
  }
  var isPixelSizing = function(table) {
    return getRawWidth(table).exists(function(size) {
      return rPixelBasedSizeRegex.test(size)
    })
  }
  var isNoneSizing = function(table) {
    return getRawWidth(table).isNone()
  }
  var percentageBasedSizeRegex = constant(rPercentageBasedSizeRegex)
  var pixelBasedSizeRegex = constant(rPixelBasedSizeRegex)

  var getRaw$1 = function(cell, property, getter) {
    return getRaw(cell, property).fold(
      function() {
        return getter(cell) + 'px'
      },
      function(raw) {
        return raw
      }
    )
  }
  var getRawW = function(cell, tableSize) {
    return getRaw$1(cell, 'width', function(e) {
      return getPixelWidth(e, tableSize)
    })
  }
  var getRawH = function(cell) {
    return getRaw$1(cell, 'height', getHeight$1)
  }
  var getWidthFrom = function(
    warehouse,
    direction,
    getWidth,
    fallback,
    tableSize
  ) {
    var columns$1 = columns(warehouse)
    var backups = map(columns$1, function(cellOption) {
      return cellOption.map(direction.edge)
    })
    return map(columns$1, function(cellOption, c) {
      var columnCell = cellOption.filter(not(hasColspan))
      return columnCell.fold(
        function() {
          var deduced = deduce(backups, c)
          return fallback(deduced)
        },
        function(cell) {
          return getWidth(cell, tableSize)
        }
      )
    })
  }
  var getDeduced = function(deduced) {
    return deduced
      .map(function(d) {
        return d + 'px'
      })
      .getOr('')
  }
  var getRawWidths = function(warehouse, direction, tableSize) {
    return getWidthFrom(warehouse, direction, getRawW, getDeduced, tableSize)
  }
  var getPercentageWidths = function(warehouse, direction, tableSize) {
    return getWidthFrom(
      warehouse,
      direction,
      getPercentageWidth,
      function(deduced) {
        return deduced.fold(
          function() {
            return tableSize.minCellWidth()
          },
          function(cellWidth) {
            return (cellWidth / tableSize.pixelWidth()) * 100
          }
        )
      },
      tableSize
    )
  }
  var getPixelWidths = function(warehouse, direction, tableSize) {
    return getWidthFrom(
      warehouse,
      direction,
      getPixelWidth,
      function(deduced) {
        return deduced.getOrThunk(tableSize.minCellWidth)
      },
      tableSize
    )
  }
  var getHeightFrom = function(warehouse, direction, getHeight, fallback) {
    var rows = rows$1(warehouse)
    var backups = map(rows, function(cellOption) {
      return cellOption.map(direction.edge)
    })
    return map(rows, function(cellOption, c) {
      var rowCell = cellOption.filter(not(hasRowspan))
      return rowCell.fold(
        function() {
          var deduced = deduce(backups, c)
          return fallback(deduced)
        },
        function(cell) {
          return getHeight(cell)
        }
      )
    })
  }
  var getPixelHeights = function(warehouse, direction) {
    return getHeightFrom(warehouse, direction, getHeight$1, function(deduced) {
      return deduced.getOrThunk(minHeight)
    })
  }
  var getRawHeights = function(warehouse, direction) {
    return getHeightFrom(warehouse, direction, getRawH, getDeduced)
  }

  var adt = Adt.generate([
    { invalid: ['raw'] },
    { pixels: ['value'] },
    { percent: ['value'] }
  ])
  var validateFor = function(suffix, type, value) {
    var rawAmount = value.substring(0, value.length - suffix.length)
    var amount = parseFloat(rawAmount)
    return rawAmount === amount.toString() ? type(amount) : adt.invalid(value)
  }
  var from$1 = function(value) {
    if (endsWith(value, '%')) {
      return validateFor('%', adt.percent, value)
    }
    if (endsWith(value, 'px')) {
      return validateFor('px', adt.pixels, value)
    }
    return adt.invalid(value)
  }
  var Size = __assign(__assign({}, adt), { from: from$1 })

  var redistributeToPercent = function(widths, totalWidth) {
    return map(widths, function(w) {
      var colType = Size.from(w)
      return colType.fold(
        function() {
          return w
        },
        function(px) {
          var ratio = (px / totalWidth) * 100
          return ratio + '%'
        },
        function(pc) {
          return pc + '%'
        }
      )
    })
  }
  var redistributeToPx = function(widths, totalWidth, newTotalWidth) {
    var scale = newTotalWidth / totalWidth
    return map(widths, function(w) {
      var colType = Size.from(w)
      return colType.fold(
        function() {
          return w
        },
        function(px) {
          return px * scale + 'px'
        },
        function(pc) {
          return (pc / 100) * newTotalWidth + 'px'
        }
      )
    })
  }
  var redistributeEmpty = function(newWidthType, columns) {
    var f = newWidthType.fold(
      function() {
        return constant('')
      },
      function(px) {
        var num = px / columns
        return constant(num + 'px')
      },
      function(pc) {
        var num = pc / columns
        return constant(num + 'px')
      }
    )
    return range(columns, f)
  }
  var redistributeValues = function(newWidthType, widths, totalWidth) {
    return newWidthType.fold(
      function() {
        return widths
      },
      function(px) {
        return redistributeToPx(widths, totalWidth, px)
      },
      function(_pc) {
        return redistributeToPercent(widths, totalWidth)
      }
    )
  }
  var redistribute = function(widths, totalWidth, newWidth) {
    var newType = Size.from(newWidth)
    var floats = forall(widths, function(s) {
      return s === '0px'
    })
      ? redistributeEmpty(newType, widths.length)
      : redistributeValues(newType, widths, totalWidth)
    return normalize(floats)
  }
  var sum = function(values, fallback) {
    if (values.length === 0) {
      return fallback
    }
    return foldr(
      values,
      function(rest, v) {
        return Size.from(v).fold(constant(0), identity, identity) + rest
      },
      0
    )
  }
  var roundDown = function(num, unit) {
    var floored = Math.floor(num)
    return {
      value: floored + unit,
      remainder: num - floored
    }
  }
  var add = function(value, amount) {
    return Size.from(value).fold(
      constant(value),
      function(px) {
        return px + amount + 'px'
      },
      function(pc) {
        return pc + amount + '%'
      }
    )
  }
  var normalize = function(values) {
    if (values.length === 0) {
      return values
    }
    var scan = foldr(
      values,
      function(rest, value) {
        var info = Size.from(value).fold(
          function() {
            return {
              value: value,
              remainder: 0
            }
          },
          function(num) {
            return roundDown(num, 'px')
          },
          function(num) {
            return {
              value: num + '%',
              remainder: 0
            }
          }
        )
        return {
          output: [info.value].concat(rest.output),
          remainder: rest.remainder + info.remainder
        }
      },
      {
        output: [],
        remainder: 0
      }
    )
    var r = scan.output
    return r
      .slice(0, r.length - 1)
      .concat([add(r[r.length - 1], Math.round(scan.remainder))])
  }
  var validate = Size.from

  var redistributeToW = function(newWidths, cells, unit) {
    each(cells, function(cell) {
      var widths = newWidths.slice(
        cell.column(),
        cell.colspan() + cell.column()
      )
      var w = sum(widths, minWidth())
      set$1(cell.element(), 'width', w + unit)
    })
  }
  var redistributeToH = function(newHeights, rows, cells, unit) {
    each(cells, function(cell) {
      var heights = newHeights.slice(cell.row(), cell.rowspan() + cell.row())
      var h = sum(heights, minHeight())
      set$1(cell.element(), 'height', h + unit)
    })
    each(rows, function(row, i) {
      set$1(row.element(), 'height', newHeights[i])
    })
  }
  var getUnit = function(newSize) {
    return validate(newSize).fold(constant('px'), constant('px'), constant('%'))
  }
  var redistribute$1 = function(
    table,
    optWidth,
    optHeight,
    direction,
    tableSize
  ) {
    var warehouse = Warehouse.fromTable(table)
    var rows = warehouse.all
    var cells = Warehouse.justCells(warehouse)
    optWidth.each(function(newWidth) {
      // var wUnit = getUnit(newWidth)
      // var totalWidth = get$5(table)
      // var oldWidths = getRawWidths(warehouse, direction, tableSize)
      // var nuWidths = redistribute(oldWidths, totalWidth, newWidth)
      // redistributeToW(nuWidths, cells, wUnit)
      set$1(table, 'width', newWidth)
    })
    optHeight.each(function(newHeight) {
      var hUnit = getUnit(newHeight)
      var totalHeight = get$4(table)
      var oldHeights = getRawHeights(warehouse, height)
      var nuHeights = redistribute(oldHeights, totalHeight, newHeight)
      redistributeToH(nuHeights, rows, cells, hUnit)
      set$1(table, 'height', newHeight)
    })
  }
  var isPercentSizing$1 = isPercentSizing
  var isPixelSizing$1 = isPixelSizing
  var isNoneSizing$1 = isNoneSizing
  var getPercentTableWidth$1 = getPercentTableWidth

  var ResizeDirection = {
    ltr: ltr,
    rtl: rtl
  }

  var TableDirection = function(directionAt) {
    var auto = function(table) {
      return directionAt(table).isRtl()
        ? ResizeDirection.rtl
        : ResizeDirection.ltr
    }
    var delta = function(amount, table) {
      return auto(table).delta(amount, table)
    }
    var positions = function(cols, table) {
      return auto(table).positions(cols, table)
    }
    var edge = function(cell) {
      return auto(cell).edge(cell)
    }
    return {
      delta: delta,
      edge: edge,
      positions: positions
    }
  }

  var Immutable = function() {
    var fields = []
    for (var _i = 0; _i < arguments.length; _i++) {
      fields[_i] = arguments[_i]
    }
    return function() {
      var values = []
      for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i]
      }
      if (fields.length !== values.length) {
        throw new Error(
          'Wrong number of arguments to struct. Expected "[' +
            fields.length +
            ']", got ' +
            values.length +
            ' arguments'
        )
      }
      var struct = {}
      each(fields, function(name, i) {
        struct[name] = constant(values[i])
      })
      return struct
    }
  }

  var Event = function(fields) {
    var struct = Immutable.apply(null, fields)
    var handlers = []
    var bind = function(handler) {
      if (handler === undefined) {
        throw new Error('Event bind error: undefined handler')
      }
      handlers.push(handler)
    }
    var unbind = function(handler) {
      handlers = filter(handlers, function(h) {
        return h !== handler
      })
    }
    var trigger = function() {
      var args = []
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i]
      }
      var event = struct.apply(null, args)
      each(handlers, function(handler) {
        handler(event)
      })
    }
    return {
      bind: bind,
      unbind: unbind,
      trigger: trigger
    }
  }

  var create = function(typeDefs) {
    var registry = map$1(typeDefs, function(event) {
      return {
        bind: event.bind,
        unbind: event.unbind
      }
    })
    var trigger = map$1(typeDefs, function(event) {
      return event.trigger
    })
    return {
      registry: registry,
      trigger: trigger
    }
  }

  var adt$1 = Adt.generate([
    { none: [] },
    { only: ['index'] },
    {
      left: ['index', 'next']
    },
    {
      middle: ['prev', 'index', 'next']
    },
    {
      right: ['prev', 'index']
    }
  ])
  var ColumnContext = __assign({}, adt$1)

  var neighbours = function(input, index) {
    if (input.length === 0) {
      return ColumnContext.none()
    }
    if (input.length === 1) {
      return ColumnContext.only(0)
    }
    if (index === 0) {
      return ColumnContext.left(0, 1)
    }
    if (index === input.length - 1) {
      return ColumnContext.right(index - 1, index)
    }
    if (index > 0 && index < input.length - 1) {
      return ColumnContext.middle(index - 1, index, index + 1)
    }
    return ColumnContext.none()
  }
  var deermine = function (input, column, step, tableSize) {
    var result = input.slice(0)
    var context = neighbours(input, column)
    var zero = function (array) {
      return map(array, constant(0))
    }
    var onNone = constant(zero(result))
    var onOnly = function (index) {
      return tableSize.singleColumnWidth(result[index], step)
    }
    var onChange = function (index, next) {
      
    }
  }
  var determine = function(input, column, step, tableSize) {
    var result = input.slice(0)
    var context = neighbours(input, column)
    var zero = function(array) {
      return map(array, constant(0))
    }
    var onNone = constant(zero(result))
    var onOnly = function(index) {
      return tableSize.singleColumnWidth(result[index], step)
    }
    var onChange = function(index, next) {
      if (step >= 0) {
        var newNext = Math.max(tableSize.minCellWidth(), result[next] - step)
        return zero(result.slice(0, index))
          .concat([step, newNext - result[next]])
          .concat(zero(result.slice(next + 1)))
      } else {
        var newThis = Math.max(tableSize.minCellWidth(), result[index] + step)
        var diffx = result[index] - newThis
        return zero(result.slice(0, index))
          .concat([newThis - result[index], diffx])
          .concat(zero(result.slice(next + 1)))
      }
    }
    var onLeft = onChange
    var onMiddle = function(_prev, index, next) {
      return onChange(index, next)
    }
    var onRight = function(_prev, index) {
      if (step >= 0) {
        return zero(result.slice(0, index)).concat([step])
      } else {
        var size = Math.max(tableSize.minCellWidth(), result[index] + step)
        return zero(result.slice(0, index)).concat([size - result[index]])
      }
    }
    return context.fold(onNone, onOnly, onLeft, onMiddle, onRight)
  }

  var total = function(start, end, measures) {
    var r = 0
    for (var i = start; i < end; i++) {
      r += measures[i] !== undefined ? measures[i] : 0
    }
    return r
  }
  var recalculateWidth = function(warehouse, widths) {
    var all = Warehouse.justCells(warehouse)
    return map(all, function(cell) {
      var width = total(cell.column(), cell.column() + cell.colspan(), widths)
      return {
        element: cell.element(),
        width: width,
        colspan: cell.colspan()
      }
    })
  }
  var recalculateHeight = function(warehouse, heights) {
    var all = Warehouse.justCells(warehouse)
    return map(all, function(cell) {
      var height = total(cell.row(), cell.row() + cell.rowspan(), heights)
      return {
        element: cell.element,
        height: constant(height),
        rowspan: cell.rowspan
      }
    })
  }
  var matchRowHeight = function(warehouse, heights) {
    return map(warehouse.all, function(row, i) {
      return {
        element: row.element,
        height: constant(heights[i])
      }
    })
  }

  var sumUp = function(newSize) {
    return foldr(
      newSize,
      function(b, a) {
        return b + a
      },
      0
    )
  }
  var adjustWidth = function (table, delta, index, direction, tableSize) {
    var step = tableSize.getCellDelta(delta)
    var warehouse = Warehouse.fromTable(table)
    var widths = tableSize.getWidths(warehouse, direction, tableSize)
    var deltas = determine(widths, index, step, tableSize)
    var newWidths = map(deltas, function(dx, i) {
      return dx + widths[i]
    })
    var deltas$1 = deltas.map(m => {
      return m.toFixed(7)
    })
    var currentIdx = deltas$1.indexOf(step.toFixed(7))
    var newSizes = recalculateWidth(warehouse, newWidths)
    each(newSizes, function(cell,idx) {
      // console.log(cell.width)
      if (currentIdx === idx) tableSize.setElementWidth(cell.element, cell.width)
    })
    if (index === warehouse.grid.columns() - 1) {
      tableSize.adjustTableWidth(step)
    }
  }
  var adjustHeight = function(table, delta, index, direction) {
    var warehouse = Warehouse.fromTable(table)
    var heights = getPixelHeights(warehouse, direction)
    var newHeights = map(heights, function(dy, i) {
      return index === i ? Math.max(delta + dy, minHeight()) : dy
    })
    var newCellSizes = recalculateHeight(warehouse, newHeights)
    var newRowSizes = matchRowHeight(warehouse, newHeights)
    each(newRowSizes, function(row) {
      setHeight(row.element(), row.height())
    })
    each(newCellSizes, function(cell) {
      setHeight(cell.element(), cell.height())
    })
    var total = sumUp(newHeights)
    setHeight(table, total)
  }
  var adjustWidthTo = function(table, list, direction, tableSize) {
    var warehouse = Warehouse.generate(list)
    var widths = tableSize.getWidths(warehouse, direction, tableSize)
    var newSizes = recalculateWidth(warehouse, widths)
    each(newSizes, function(cell) {
      tableSize.setElementWidth(cell.element, cell.width)
    })
  }

  var mkEvent = function(target, x, y, stop, prevent, kill, raw) {
    return {
      target: constant(target),
      x: constant(x),
      y: constant(y),
      stop: stop,
      prevent: prevent,
      kill: kill,
      raw: constant(raw)
    }
  }
  var fromRawEvent = function(rawEvent) {
    var target = Element.fromDom(
      getOriginalEventTarget(rawEvent).getOr(rawEvent.target)
    )
    var stop = function() {
      return rawEvent.stopPropagation()
    }
    var prevent = function() {
      return rawEvent.preventDefault()
    }
    var kill = compose(prevent, stop)
    return mkEvent(
      target,
      rawEvent.clientX,
      rawEvent.clientY,
      stop,
      prevent,
      kill,
      rawEvent
    )
  }
  var handle = function(filter, handler) {
    return function(rawEvent) {
      if (filter(rawEvent)) {
        handler(fromRawEvent(rawEvent))
      }
    }
  }
  var binder = function(element, event, filter, handler, useCapture) {
    var wrapped = handle(filter, handler)
    element.dom().addEventListener(event, wrapped, useCapture)
    return { unbind: curry(unbind, element, event, wrapped, useCapture) }
  }
  var bind$1 = function(element, event, filter, handler) {
    return binder(element, event, filter, handler, false)
  }
  var unbind = function(element, event, handler, useCapture) {
    element.dom().removeEventListener(event, handler, useCapture)
  }

  var filter$2 = constant(true)
  var bind$2 = function(element, event, handler) {
    return bind$1(element, event, filter$2, handler)
  }
  var fromRawEvent$1 = fromRawEvent

  var read = function(element, attr) {
    var value = get$1(element, attr)
    return value === undefined || value === '' ? [] : value.split(' ')
  }
  var add$1 = function(element, attr, id) {
    var old = read(element, attr)
    var nu = old.concat([id])
    set(element, attr, nu.join(' '))
    return true
  }
  var remove$3 = function(element, attr, id) {
    var nu = filter(read(element, attr), function(v) {
      return v !== id
    })
    if (nu.length > 0) {
      set(element, attr, nu.join(' '))
    } else {
      remove(element, attr)
    }
    return false
  }

  var supports = function(element) {
    return element.dom().classList !== undefined
  }
  var get$7 = function(element) {
    return read(element, 'class')
  }
  var add$2 = function(element, clazz) {
    return add$1(element, 'class', clazz)
  }
  var remove$4 = function(element, clazz) {
    return remove$3(element, 'class', clazz)
  }

  var add$3 = function(element, clazz) {
    if (supports(element)) {
      element.dom().classList.add(clazz)
    } else {
      add$2(element, clazz)
    }
  }
  var cleanClass = function(element) {
    var classList = supports(element) ? element.dom().classList : get$7(element)
    if (classList.length === 0) {
      remove(element, 'class')
    }
  }
  var remove$5 = function(element, clazz) {
    if (supports(element)) {
      var classList = element.dom().classList
      classList.remove(clazz)
    } else {
      remove$4(element, clazz)
    }
    cleanClass(element)
  }
  var has$2 = function(element, clazz) {
    return supports(element) && element.dom().classList.contains(clazz)
  }

  var css = function(namespace) {
    var dashNamespace = namespace.replace(/\./g, '-')
    var resolve = function(str) {
      return dashNamespace + '-' + str
    }
    return { resolve: resolve }
  }

  var styles = css('ephox-dragster')
  var resolve = styles.resolve

  var Blocker = function(options) {
    var settings = __assign({ layerClass: resolve('blocker') }, options)
    var div = Element.fromTag('div')
    set(div, 'role', 'presentation')
    setAll$1(div, {
      position: 'fixed',
      left: '0px',
      top: '0px',
      width: '100%',
      height: '100%'
    })
    add$3(div, resolve('blocker'))
    add$3(div, settings.layerClass)
    var element = function() {
      return div
    }
    var destroy = function() {
      remove$2(div)
    }
    return {
      element: element,
      destroy: destroy
    }
  }

  var sort = function(arr) {
    return arr.slice(0).sort()
  }
  var reqMessage = function(required, keys) {
    throw new Error(
      'All required keys (' +
        sort(required).join(', ') +
        ') were not specified. Specified keys were: ' +
        sort(keys).join(', ') +
        '.'
    )
  }
  var unsuppMessage = function(unsupported) {
    throw new Error(
      'Unsupported keys for object: ' + sort(unsupported).join(', ')
    )
  }
  var validateStrArr = function(label, array) {
    if (!isArray(array)) {
      throw new Error(
        'The ' + label + ' fields must be an array. Was: ' + array + '.'
      )
    }
    each(array, function(a) {
      if (!isString(a)) {
        throw new Error(
          'The value ' + a + ' in the ' + label + ' fields was not a string.'
        )
      }
    })
  }
  var invalidTypeMessage = function(incorrect, type) {
    throw new Error(
      'All values need to be of type: ' +
        type +
        '. Keys (' +
        sort(incorrect).join(', ') +
        ') were not.'
    )
  }
  var checkDupes = function(everything) {
    var sorted = sort(everything)
    var dupe = find(sorted, function(s, i) {
      return i < sorted.length - 1 && s === sorted[i + 1]
    })
    dupe.each(function(d) {
      throw new Error(
        'The field: ' +
          d +
          ' occurs more than once in the combined fields: [' +
          sorted.join(', ') +
          '].'
      )
    })
  }

  var base = function(handleUnsupported, required) {
    return baseWith(handleUnsupported, required, {
      validate: isFunction,
      label: 'function'
    })
  }
  var baseWith = function(handleUnsupported, required, pred) {
    if (required.length === 0) {
      throw new Error('You must specify at least one required field.')
    }
    validateStrArr('required', required)
    checkDupes(required)
    return function(obj) {
      var keys$1 = keys(obj)
      var allReqd = forall(required, function(req) {
        return contains(keys$1, req)
      })
      if (!allReqd) {
        reqMessage(required, keys$1)
      }
      handleUnsupported(required, keys$1)
      var invalidKeys = filter(required, function(key) {
        return !pred.validate(obj[key], key)
      })
      if (invalidKeys.length > 0) {
        invalidTypeMessage(invalidKeys, pred.label)
      }
      return obj
    }
  }
  var handleExact = function(required, keys) {
    var unsupported = filter(keys, function(key) {
      return !contains(required, key)
    })
    if (unsupported.length > 0) {
      unsuppMessage(unsupported)
    }
  }
  var exactly = function(required) {
    return base(handleExact, required)
  }

  var DragMode = exactly(['compare', 'extract', 'mutate', 'sink'])
  var DragSink = exactly(['element', 'start', 'stop', 'destroy'])
  var DragApi = exactly(['forceDrop', 'drop', 'move', 'delayDrop'])

  var compare = function(old, nu) {
    return Position(nu.left() - old.left(), nu.top() - old.top())
  }
  var extract$1 = function(event) {
    return Option.some(Position(event.x(), event.y()))
  }
  var mutate = function(mutation, info) {
    mutation.mutate(info.left(), info.top())
  }
  var sink = function(dragApi, settings) {
    var blocker = Blocker(settings)
    var mdown = bind$2(blocker.element(), 'mousedown', dragApi.forceDrop)
    var mup = bind$2(blocker.element(), 'mouseup', dragApi.drop)
    var mmove = bind$2(blocker.element(), 'mousemove', dragApi.move)
    var mout = bind$2(blocker.element(), 'mouseout', dragApi.delayDrop)
    var destroy = function() {
      blocker.destroy()
      mup.unbind()
      mmove.unbind()
      mout.unbind()
      mdown.unbind()
    }
    var start = function(parent) {
      append(parent, blocker.element())
    }
    var stop = function() {
      remove$2(blocker.element())
    }
    return DragSink({
      element: blocker.element,
      start: start,
      stop: stop,
      destroy: destroy
    })
  }
  var MouseDrag = DragMode({
    compare: compare,
    extract: extract$1,
    sink: sink,
    mutate: mutate
  })

  var last$2 = function(fn, rate) {
    var timer = null
    var cancel = function() {
      if (timer !== null) {
        domGlobals.clearTimeout(timer)
        timer = null
      }
    }
    var throttle = function() {
      var args = []
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i]
      }
      if (timer !== null) {
        domGlobals.clearTimeout(timer)
      }
      timer = domGlobals.setTimeout(function() {
        fn.apply(null, args)
        timer = null
      }, rate)
    }
    return {
      cancel: cancel,
      throttle: throttle
    }
  }

  function InDrag() {
    var previous = Option.none()
    var reset = function() {
      previous = Option.none()
    }
    var update = function(mode, nu) {
      var result = previous.map(function(old) {
        return mode.compare(old, nu)
      })
      previous = Option.some(nu)
      return result
    }
    var onEvent = function(event, mode) {
      var dataOption = mode.extract(event)
      dataOption.each(function(data) {
        var offset = update(mode, data)
        offset.each(function(d) {
          events.trigger.move(d)
        })
      })
    }
    var events = create({ move: Event(['info']) })
    return {
      onEvent: onEvent,
      reset: reset,
      events: events.registry
    }
  }

  function NoDrag() {
    return {
      onEvent: noop,
      reset: noop
    }
  }

  function Movement() {
    var noDragState = NoDrag()
    var inDragState = InDrag()
    var dragState = noDragState
    var on = function() {
      dragState.reset()
      dragState = inDragState
    }
    var off = function() {
      dragState.reset()
      dragState = noDragState
    }
    var onEvent = function(event, mode) {
      dragState.onEvent(event, mode)
    }
    var isOn = function() {
      return dragState === inDragState
    }
    return {
      on: on,
      off: off,
      isOn: isOn,
      onEvent: onEvent,
      events: inDragState.events
    }
  }

  var setup = function(mutation, mode, settings) {
    var active = false
    var events = create({
      start: Event([]),
      stop: Event([])
    })
    var movement = Movement()
    var drop = function() {
      sink.stop()
      if (movement.isOn()) {
        movement.off()
        events.trigger.stop()
      }
    }
    var throttledDrop = last$2(drop, 200)
    var go = function(parent) {
      sink.start(parent)
      movement.on()
      events.trigger.start()
    }
    var mousemove = function(event) {
      throttledDrop.cancel()
      movement.onEvent(event, mode)
    }
    movement.events.move.bind(function(event) {
      mode.mutate(mutation, event.info())
    })
    var on = function() {
      active = true
    }
    var off = function() {
      active = false
    }
    var runIfActive = function(f) {
      return function() {
        var args = []
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        if (active) {
          f.apply(null, args)
        }
      }
    }
    var sink = mode.sink(
      DragApi({
        forceDrop: drop,
        drop: runIfActive(drop),
        move: runIfActive(mousemove),
        delayDrop: runIfActive(throttledDrop.throttle)
      }),
      settings
    )
    var destroy = function() {
      sink.destroy()
    }
    return {
      element: sink.element,
      go: go,
      on: on,
      off: off,
      destroy: destroy,
      events: events.registry
    }
  }

  var transform = function(mutation, settings) {
    if (settings === void 0) {
      settings = {}
    }
    var mode = settings.mode !== undefined ? settings.mode : MouseDrag
    return setup(mutation, mode, settings)
  }

  var isContentEditableTrue = function(elm) {
    return get$1(elm, 'contenteditable') === 'true'
  }
  var findClosestContentEditable = function(target, isRoot) {
    return closest$1(target, '[contenteditable]', isRoot)
  }

  var styles$1 = css('ephox-snooker')
  var resolve$1 = styles$1.resolve

  var Mutation = function() {
    var events = create({
      drag: Event(['xDelta', 'yDelta'])
    })
    var mutate = function(x, y) {
      events.trigger.drag(x, y)
    }
    return {
      mutate: mutate,
      events: events.registry
    }
  }

  var BarMutation = function() {
    var events = create({
      drag: Event(['xDelta', 'yDelta', 'target'])
    })
    var target = Option.none()
    var delegate = Mutation()
    delegate.events.drag.bind(function(event) {
      target.each(function(t) {
        events.trigger.drag(event.xDelta(), event.yDelta(), t)
      })
    })
    var assign = function(t) {
      target = Option.some(t)
    }
    var get = function() {
      return target
    }
    return {
      assign: assign,
      get: get,
      mutate: delegate.mutate,
      events: events.registry
    }
  }

  var col = function(column, x, y, w, h) {
    var bar = Element.fromTag('div')
    setAll$1(bar, {
      position: 'absolute',
      left: x - w / 2 + 'px',
      top: y + 'px',
      height: h + 'px',
      width: w + 'px'
    })
    setAll(bar, {
      'data-column': column,
      role: 'presentation'
    })
    return bar
  }
  var row = function(r, x, y, w, h) {
    var bar = Element.fromTag('div')
    setAll$1(bar, {
      position: 'absolute',
      left: x + 'px',
      top: y - h / 2 + 'px',
      height: h + 'px',
      width: w + 'px'
    })
    setAll(bar, {
      'data-row': r,
      role: 'presentation'
    })
    return bar
  }

  var resizeBar = resolve$1('resizer-bar')
  var resizeRowBar = resolve$1('resizer-rows')
  var resizeColBar = resolve$1('resizer-cols')
  var BAR_THICKNESS = 7
  var destroy = function(wire) {
    var previous = descendants$1(wire.parent(), '.' + resizeBar)
    each(previous, remove$2)
  }
  var drawBar = function(wire, positions, create) {
    var origin = wire.origin()
    each(positions, function(cpOption) {
      cpOption.each(function(cp) {
        var bar = create(origin, cp)
        add$3(bar, resizeBar)
        append(wire.parent(), bar)
      })
    })
  }
  var refreshCol = function(wire, colPositions, position, tableHeight) {
    drawBar(wire, colPositions, function(origin, cp) {
      var colBar = col(
        cp.col,
        cp.x - origin.left(),
        position.top() - origin.top(),
        BAR_THICKNESS,
        tableHeight
      )
      add$3(colBar, resizeColBar)
      return colBar
    })
  }
  var refreshRow = function(wire, rowPositions, position, tableWidth) {
    drawBar(wire, rowPositions, function(origin, cp) {
      var rowBar = row(
        cp.row,
        position.left() - origin.left(),
        cp.y - origin.top(),
        tableWidth,
        BAR_THICKNESS
      )
      add$3(rowBar, resizeRowBar)
      return rowBar
    })
  }
  var refreshGrid = function(wire, table, rows, cols, hdirection, vdirection) {
    var position = absolute(table)
    var rowPositions = rows.length > 0 ? hdirection.positions(rows, table) : []
    refreshRow(wire, rowPositions, position, getOuter$1(table))
    var colPositions = cols.length > 0 ? vdirection.positions(cols, table) : []
    refreshCol(wire, colPositions, position, getOuter(table))
  }
  var refresh = function(wire, table, hdirection, vdirection) {
    destroy(wire)
    var warehouse = Warehouse.fromTable(table)
    var rows = rows$1(warehouse)
    var cols = columns(warehouse)
    refreshGrid(wire, table, rows, cols, hdirection, vdirection)
  }
  var each$2 = function(wire, f) {
    var bars = descendants$1(wire.parent(), '.' + resizeBar)
    each(bars, f)
  }
  var hide = function(wire) {
    each$2(wire, function(bar) {
      set$1(bar, 'display', 'none')
    })
  }
  var show = function(wire) {
    each$2(wire, function(bar) {
      set$1(bar, 'display', 'block')
    })
  }
  var isRowBar = function(element) {
    return has$2(element, resizeRowBar)
  }
  var isColBar = function(element) {
    return has$2(element, resizeColBar)
  }

  var resizeBarDragging = resolve$1('resizer-bar-dragging')
  var BarManager = function(wire, direction, hdirection) {
    var mutation = BarMutation()
    var resizing = transform(mutation, {})
    var hoverTable = Option.none()
    var getResizer = function(element, type) {
      return Option.from(get$1(element, type))
    }
    mutation.events.drag.bind(function(event) {
      getResizer(event.target(), 'data-row').each(function(_dataRow) {
        var currentRow = getCssValue(event.target(), 'top')
        set$1(event.target(), 'top', currentRow + event.yDelta() + 'px')
      })
      getResizer(event.target(), 'data-column').each(function(_dataCol) {
        var currentCol = getCssValue(event.target(), 'left')
        set$1(event.target(), 'left', currentCol + event.xDelta() + 'px')
      })
    })
    var getDelta = function(target, dir) {
      var newX = getCssValue(target, dir)
      var oldX = getAttrValue(target, 'data-initial-' + dir, 0)
      return newX - oldX
    }
    resizing.events.stop.bind(function() {
      mutation.get().each(function(target) {
        hoverTable.each(function(table) {
          getResizer(target, 'data-row').each(function(row) {
            var delta = getDelta(target, 'top')
            remove(target, 'data-initial-top')
            events.trigger.adjustHeight(table, delta, parseInt(row, 10))
          })
          getResizer(target, 'data-column').each(function(column) {
            var delta = getDelta(target, 'left')
            remove(target, 'data-initial-left')
            events.trigger.adjustWidth(table, delta, parseInt(column, 10))
          })
          refresh(wire, table, hdirection, direction)
        })
      })
    })
    var handler = function(target, dir) {
      events.trigger.startAdjust()
      mutation.assign(target)
      set(target, 'data-initial-' + dir, getCssValue(target, dir))
      add$3(target, resizeBarDragging)
      set$1(target, 'opacity', '0.2')
      resizing.go(wire.parent())
    }
    var mousedown = bind$2(wire.parent(), 'mousedown', function(event) {
      if (isRowBar(event.target())) {
        handler(event.target(), 'top')
      }
      if (isColBar(event.target())) {
        handler(event.target(), 'left')
      }
    })
    var isRoot = function(e) {
      return eq(e, wire.view())
    }
    var findClosestEditableTable = function(target) {
      return closest$1(target, 'table', isRoot).filter(function(table) {
        return findClosestContentEditable(table, isRoot).exists(
          isContentEditableTrue
        )
      })
    }
    var mouseover = bind$2(wire.view(), 'mouseover', function(event) {
      findClosestEditableTable(event.target()).fold(
        function() {
          if (inBody(event.target())) {
            destroy(wire)
          }
        },
        function(table) {
          hoverTable = Option.some(table)
          refresh(wire, table, hdirection, direction)
        }
      )
    })
    var destroy$1 = function() {
      mousedown.unbind()
      mouseover.unbind()
      resizing.destroy()
      destroy(wire)
    }
    var refresh$1 = function(tbl) {
      refresh(wire, tbl, hdirection, direction)
    }
    var events = create({
      adjustHeight: Event(['table', 'delta', 'row']),
      adjustWidth: Event(['table', 'delta', 'column']),
      startAdjust: Event([])
    })
    return {
      destroy: destroy$1,
      refresh: refresh$1,
      on: resizing.on,
      off: resizing.off,
      hideBars: curry(hide, wire),
      showBars: curry(show, wire),
      events: events.registry
    }
  }

  var create$1 = function(wire, vdirection, lazySizing) {
    var hdirection = height
    var manager = BarManager(wire, vdirection, hdirection)
    var events = create({
      beforeResize: Event(['table']),
      afterResize: Event(['table']),
      startDrag: Event([])
    })
    manager.events.adjustHeight.bind(function(event) {
      var table = event.table()
      events.trigger.beforeResize(table)
      var delta = hdirection.delta(event.delta(), table)
      adjustHeight(table, delta, event.row(), hdirection)
      events.trigger.afterResize(table)
    })
    manager.events.startAdjust.bind(function(_event) {
      events.trigger.startDrag()
    })
    manager.events.adjustWidth.bind(function(event) {
      var table = event.table()
      events.trigger.beforeResize(table)
      var delta = vdirection.delta(event.delta(), table)
      var tableSize = lazySizing(table)
      adjustWidth(table, delta, event.column(), vdirection, tableSize)
      events.trigger.afterResize(table)
    })
    return {
      on: manager.on,
      off: manager.off,
      hideBars: manager.hideBars,
      showBars: manager.showBars,
      destroy: manager.destroy,
      events: events.registry
    }
  }
  var TableResize = { create: create$1 }

  var fireNewRow = function(editor, row) {
    return editor.fire('newrow', { node: row })
  }
  var fireNewCell = function(editor, cell) {
    return editor.fire('newcell', { node: cell })
  }
  var fireObjectResizeStart = function(editor, target, width, height) {
    editor.fire('ObjectResizeStart', {
      target: target,
      width: width,
      height: height
    })
  }
  var fireObjectResized = function(editor, target, width, height) {
    editor.fire('ObjectResized', {
      target: target,
      width: width,
      height: height
    })
  }
  var fireTableSelectionChange = function(
    editor,
    cells,
    start,
    finish,
    otherCells
  ) {
    editor.fire('TableSelectionChange', {
      cells: cells,
      start: start,
      finish: finish,
      otherCells: otherCells
    })
  }
  var fireTableSelectionClear = function(editor) {
    editor.fire('TableSelectionClear')
  }

  var defaultTableToolbar =
    'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol'
  var defaultStyles = {
    'border-collapse': 'collapse',
    width: '100%'
  }
  var determineDefaultStyles = function(editor) {
    if (isPixelsForced(editor)) {
      var editorWidth = editor.getBody().offsetWidth
      return __assign(__assign({}, defaultStyles), {
        width: editorWidth + 'px'
      })
    } else if (isResponsiveForced(editor)) {
      return filter$1(defaultStyles, function(_value, key) {
        return key !== 'width'
      })
    } else {
      return defaultStyles
    }
  }
  var defaultAttributes = { border: '1' }
  var getTableSizingMode = function(editor) {
    return editor.getParam('table_sizing_mode', 'auto')
  }
  var getTableResponseWidth = function(editor) {
    return editor.getParam('table_responsive_width')
  }
  var getDefaultAttributes = function(editor) {
    return editor.getParam(
      'table_default_attributes',
      defaultAttributes,
      'object'
    )
  }
  var getDefaultStyles = function(editor) {
    return editor.getParam(
      'table_default_styles',
      determineDefaultStyles(editor),
      'object'
    )
  }
  var hasTableResizeBars = function(editor) {
    return editor.getParam('table_resize_bars', true, 'boolean')
  }
  var hasTabNavigation = function(editor) {
    return editor.getParam('table_tab_navigation', true, 'boolean')
  }
  var hasAdvancedCellTab = function(editor) {
    return editor.getParam('table_cell_advtab', true, 'boolean')
  }
  var hasAdvancedRowTab = function(editor) {
    return editor.getParam('table_row_advtab', true, 'boolean')
  }
  var hasAdvancedTableTab = function(editor) {
    return editor.getParam('table_advtab', true, 'boolean')
  }
  var hasAppearanceOptions = function(editor) {
    return editor.getParam('table_appearance_options', true, 'boolean')
  }
  var hasTableGrid = function(editor) {
    return editor.getParam('table_grid', true, 'boolean')
  }
  var shouldStyleWithCss = function(editor) {
    return editor.getParam('table_style_by_css', false, 'boolean')
  }
  var getCellClassList = function(editor) {
    return editor.getParam('table_cell_class_list', [], 'array')
  }
  var getRowClassList = function(editor) {
    return editor.getParam('table_row_class_list', [], 'array')
  }
  var getTableClassList = function(editor) {
    return editor.getParam('table_class_list', [], 'array')
  }
  var isPercentagesForced = function(editor) {
    return (
      getTableSizingMode(editor) === 'relative' ||
      getTableResponseWidth(editor) === true
    )
  }
  var isPixelsForced = function(editor) {
    return (
      getTableSizingMode(editor) === 'fixed' ||
      getTableResponseWidth(editor) === false
    )
  }
  var isResponsiveForced = function(editor) {
    return getTableSizingMode(editor) === 'responsive'
  }
  var getToolbar = function(editor) {
    return editor.getParam('table_toolbar', defaultTableToolbar)
  }
  var getTableHeaderType = function(editor) {
    var defaultValue = 'section'
    var value = editor.getParam('table_header_type', defaultValue, 'string')
    var validValues = ['section', 'cells', 'sectionCells', 'auto']
    if (!contains(validValues, value)) {
      return defaultValue
    } else {
      return value
    }
  }
  var getCloneElements = function(editor) {
    var cloneElements = editor.getParam('table_clone_elements')
    if (isString(cloneElements)) {
      return Option.some(cloneElements.split(/[ ,]/))
    } else if (Array.isArray(cloneElements)) {
      return Option.some(cloneElements)
    } else {
      return Option.none()
    }
  }
  var hasObjectResizing = function(editor) {
    var objectResizing = editor.getParam('object_resizing', true)
    return isString(objectResizing)
      ? objectResizing === 'table'
      : objectResizing
  }

  var getNodeName = function(elm) {
    return elm.nodeName.toLowerCase()
  }
  var getBody$1 = function(editor) {
    return Element.fromDom(editor.getBody())
  }
  var getPixelWidth$1 = function(elm) {
    return elm.getBoundingClientRect().width
  }
  var getPixelHeight = function(elm) {
    return elm.getBoundingClientRect().height
  }
  var getIsRoot = function(editor) {
    return function(element) {
      return eq(element, getBody$1(editor))
    }
  }
  var removePxSuffix = function(size) {
    return size ? size.replace(/px$/, '') : ''
  }
  var addPxSuffix = function(size) {
    return /^\d+(\.\d+)?$/.test(size) ? size + 'px' : size
  }
  var removeDataStyle = function(table) {
    remove(table, 'data-mce-style')
    each(cells(table), function(cell) {
      return remove(cell, 'data-mce-style')
    })
  }
  var getRawWidth$1 = function(editor, elm) {
    var raw =
      editor.dom.getStyle(elm, 'width') || editor.dom.getAttrib(elm, 'width')
    return Option.from(raw).filter(isNotEmpty)
  }
  var isPercentage = function(value) {
    return /^(\d+(\.\d+)?)%$/.test(value)
  }

  var getDirection = function(element) {
    return get$2(element, 'direction') === 'rtl' ? 'rtl' : 'ltr'
  }

  var ltr$1 = { isRtl: constant(false) }
  var rtl$1 = { isRtl: constant(true) }
  var directionAt = function(element) {
    var dir = getDirection(element)
    return dir === 'rtl' ? rtl$1 : ltr$1
  }

  var Cell = function(initial) {
    var value = initial
    var get = function() {
      return value
    }
    var set = function(v) {
      value = v
    }
    return {
      get: get,
      set: set
    }
  }

  var noneSize = function(table) {
    var getWidth = function() {
      return get$5(table)
    }
    var zero = constant(0)
    return {
      width: getWidth,
      pixelWidth: getWidth,
      getWidths: getPixelWidths,
      getCellDelta: zero,
      singleColumnWidth: constant([0]),
      minCellWidth: zero,
      setElementWidth: noop,
      adjustTableWidth: noop,
      label: 'none'
    }
  }
  var percentageSize = function(initialWidth, table) {
    var floatWidth = Cell(parseFloat(initialWidth))
    var pixelWidth = Cell(get$5(table))
    var getCellDelta = function(delta) {
      return (delta / pixelWidth.get()) * 100
    }
    var singleColumnWidth = function(w, _delta) {
      return [100 - w]
    }
    var minCellWidth = function() {
      return (minWidth() / pixelWidth.get()) * 100
    }
    var adjustTableWidth = function(delta) {
      var currentWidth = floatWidth.get()
      var change = (delta / 100) * currentWidth
      var newWidth = currentWidth + change
      setPercentageWidth(table, newWidth)
      floatWidth.set(newWidth)
      pixelWidth.set(get$5(table))
    }
    return {
      width: floatWidth.get,
      pixelWidth: pixelWidth.get,
      getWidths: getPercentageWidths,
      getCellDelta: getCellDelta,
      singleColumnWidth: singleColumnWidth,
      minCellWidth: minCellWidth,
      setElementWidth: setPercentageWidth,
      adjustTableWidth: adjustTableWidth,
      label: 'percent'
    }
  }
  var pixelSize = function(initialWidth, table) {
    var width = Cell(initialWidth)
    var getWidth = width.get
    var getCellDelta = identity
    var singleColumnWidth = function(w, delta) {
      var newNext = Math.max(minWidth(), w + delta)
      return [newNext - w]
    }
    var adjustTableWidth = function(delta) {
      var newWidth = getWidth() + delta
      setPixelWidth(table, newWidth)
      width.set(newWidth)
    }
    return {
      width: getWidth,
      pixelWidth: getWidth,
      getWidths: getPixelWidths,
      getCellDelta: getCellDelta,
      singleColumnWidth: singleColumnWidth,
      minCellWidth: minWidth,
      setElementWidth: setPixelWidth,
      adjustTableWidth: adjustTableWidth,
      label: 'pixel'
    }
  }
  var chooseSize = function(element, width) {
    var percentMatch = percentageBasedSizeRegex().exec(width)
    if (percentMatch !== null) {
      return percentageSize(percentMatch[1], element)
    }
    var pixelMatch = pixelBasedSizeRegex().exec(width)
    if (pixelMatch !== null) {
      var intWidth = parseInt(pixelMatch[1], 10)
      return pixelSize(intWidth, element)
    }
    var fallbackWidth = get$5(element)
    return pixelSize(fallbackWidth, element)
  }
  var getTableSize = function(table) {
    var width = getRawWidth(table)
    return width.fold(
      function() {
        return noneSize(table)
      },
      function(w) {
        return chooseSize(table, w)
      }
    )
  }
  var TableSize = {
    getTableSize: getTableSize,
    pixelSize: pixelSize,
    percentageSize: percentageSize,
    noneSize: noneSize
  }

  var get$8 = function(editor, table) {
    if (isPercentagesForced(editor)) {
      var width = getRawWidth$1(editor, table.dom())
        .filter(isPercentage)
        .getOrThunk(function() {
          return getPercentTableWidth$1(table)
        })
      return TableSize.percentageSize(width, table)
    } else if (isPixelsForced(editor)) {
      return TableSize.pixelSize(get$5(table), table)
    } else {
      return TableSize.getTableSize(table)
    }
  }

  var cleanupLegacyAttributes = function(element) {
    remove(element, 'width')
  }
  var convertToPercentSize = function(table, direction, tableSize) {
    var newWidth = getPercentTableWidth(table)
    redistribute$1(
      table,
      Option.some(newWidth),
      Option.none(),
      direction,
      tableSize
    )
    cleanupLegacyAttributes(table)
  }
  var convertToPixelSize = function(table, direction, tableSize) {
    var newWidth = getPixelTableWidth(table)
    redistribute$1(
      table,
      Option.some(newWidth),
      Option.none(),
      direction,
      tableSize
    )
    cleanupLegacyAttributes(table)
  }
  var convertToNoneSize = function(table) {
    remove$1(table, 'width')
    each(cells(table), function(cell) {
      remove$1(cell, 'width')
      cleanupLegacyAttributes(cell)
    })
    cleanupLegacyAttributes(table)
  }

  var enforcePercentage = function(editor, table) {
    var direction = TableDirection(directionAt)
    var tableSizing = get$8(editor, table)
    convertToPercentSize(table, direction, tableSizing)
  }
  var enforcePixels = function(editor, table) {
    var direction = TableDirection(directionAt)
    var tableSizing = get$8(editor, table)
    convertToPixelSize(table, direction, tableSizing)
  }
  var enforceNone = convertToNoneSize
  var syncPixels = function(table) {
    each(cells(table), function(cell) {
      var computedWidth = get$2(cell, 'width')
      set$1(cell, 'width', computedWidth)
      remove(cell, 'width')
    })
  }

  var createContainer = function() {
    var container = Element.fromTag('div')
    setAll$1(container, {
      position: 'static',
      height: '0',
      width: '0',
      padding: '0',
      margin: '0',
      border: '0'
    })
    append(body(), container)
    return container
  }
  var get$9 = function(editor, _container) {
    return editor.inline
      ? ResizeWire.body(getBody$1(editor), createContainer())
      : ResizeWire.only(Element.fromDom(editor.getDoc()))
  }
  var remove$6 = function(editor, wire) {
    if (editor.inline) {
      remove$2(wire.parent())
    }
  }

  var getResizeHandler = function(editor) {
    var selectionRng = Option.none()
    var resize = Option.none()
    var wire = Option.none()
    var startW
    var startRawW
    var isTable = function(elm) {
      return elm.nodeName === 'TABLE'
    }
    var lazyResize = function() {
      return resize
    }
    var lazyWire = function() {
      return wire.getOr(ResizeWire.only(Element.fromDom(editor.getBody())))
    }
    var destroy = function() {
      resize.each(function(sz) {
        sz.destroy()
      })
      wire.each(function(w) {
        remove$6(editor, w)
      })
    }
    editor.on('init', function() {
      var direction = TableDirection(directionAt)
      var rawWire = get$9(editor)
      wire = Option.some(rawWire)
      if (hasObjectResizing(editor) && hasTableResizeBars(editor)) {
        var lazySizing = function(table) {
          return get$8(editor, table)
        }
        var sz = TableResize.create(rawWire, direction, lazySizing)
        sz.on()
        sz.events.startDrag.bind(function(_event) {
          selectionRng = Option.some(editor.selection.getRng())
        })
        sz.events.beforeResize.bind(function(event) {
          var rawTable = event.table().dom()
          fireObjectResizeStart(
            editor,
            rawTable,
            getPixelWidth$1(rawTable),
            getPixelHeight(rawTable)
          )
        })
        sz.events.afterResize.bind(function(event) {
          var table = event.table()
          var rawTable = table.dom()
          removeDataStyle(table)
          selectionRng.each(function(rng) {
            editor.selection.setRng(rng)
            editor.focus()
          })
          fireObjectResized(
            editor,
            rawTable,
            getPixelWidth$1(rawTable),
            getPixelHeight(rawTable)
          )
          editor.undoManager.add()
        })
        resize = Option.some(sz)
      }
    })
    editor.on('ObjectResizeStart', function(e) {
      var targetElm = e.target
      if (isTable(targetElm)) {
        var table = Element.fromDom(targetElm)
        if (!isPixelSizing$1(table) && isPixelsForced(editor)) {
          enforcePixels(editor, table)
        } else if (!isPercentSizing$1(table) && isPercentagesForced(editor)) {
          enforcePercentage(editor, table)
        }
        startW = e.width
        startRawW = getRawWidth$1(editor, targetElm).getOr('')
      }
    })
    editor.on('ObjectResized', function(e) {
      var targetElm = e.target
      if (isTable(targetElm)) {
        var table = Element.fromDom(targetElm)
        if (
          startRawW === '' ||
          (!isPercentage(startRawW) && isResponsiveForced(editor))
        ) {
          enforcePercentage(editor, table)
        } else if (isPercentage(startRawW)) {
          var percentW = parseFloat(startRawW.replace('%', ''))
          var targetPercentW = (e.width * percentW) / startW
          set$1(table, 'width', targetPercentW + '%')
        } else {
          syncPixels(table)
        }
        removeDataStyle(table)
      }
    })
    editor.on('SwitchMode', function() {
      lazyResize().each(function(resize) {
        if (editor.mode.isReadOnly()) {
          resize.hideBars()
        } else {
          resize.showBars()
        }
      })
    })
    return {
      lazyResize: lazyResize,
      lazyWire: lazyWire,
      destroy: destroy
    }
  }

  var point = function(element, offset) {
    return {
      element: constant(element),
      offset: constant(offset)
    }
  }

  var scan = function(universe, element, direction) {
    if (
      (universe.property().isText(element) &&
        universe
          .property()
          .getText(element)
          .trim().length === 0) ||
      universe.property().isComment(element)
    ) {
      return direction(element).bind(function(elem) {
        return scan(universe, elem, direction).orThunk(function() {
          return Option.some(elem)
        })
      })
    } else {
      return Option.none()
    }
  }
  var toEnd = function(universe, element) {
    if (universe.property().isText(element)) {
      return universe.property().getText(element).length
    }
    var children = universe.property().children(element)
    return children.length
  }
  var freefallRtl = function(universe, element) {
    var candidate = scan(universe, element, universe.query().prevSibling).getOr(
      element
    )
    if (universe.property().isText(candidate)) {
      return point(candidate, toEnd(universe, candidate))
    }
    var children = universe.property().children(candidate)
    return children.length > 0
      ? freefallRtl(universe, children[children.length - 1])
      : point(candidate, toEnd(universe, candidate))
  }

  var freefallRtl$1 = freefallRtl

  var universe$1 = DomUniverse()
  var freefallRtl$2 = function(element) {
    return freefallRtl$1(universe$1, element)
  }

  var halve = function(main, other) {
    var width = getGenericWidth(main)
    width.each(function(w) {
      var newWidth = w.width() / 2
      setGenericWidth(main, newWidth, w.unit())
      setGenericWidth(other, newWidth, w.unit())
    })
  }

  var getGridSize = function(table) {
    var warehouse = Warehouse.fromTable(table)
    return warehouse.grid
  }

  var cat = function(arr) {
    var r = []
    var push = function(x) {
      r.push(x)
    }
    for (var i = 0; i < arr.length; i++) {
      arr[i].each(push)
    }
    return r
  }
  var lift2 = function(oa, ob, f) {
    return oa.isSome() && ob.isSome()
      ? Option.some(f(oa.getOrDie(), ob.getOrDie()))
      : Option.none()
  }

  var setIfNot = function(element, property, value, ignore) {
    if (value === ignore) {
      remove(element, property)
    } else {
      set(element, property, value)
    }
  }
  var render = function(table, grid) {
    var newRows = []
    var newCells = []
    var insertThead = last(children$2(table, 'caption,colgroup')).fold(
      function() {
        return curry(prepend, table)
      },
      function(c) {
        return curry(after, c)
      }
    )
    var renderSection = function(gridSection, sectionName) {
      var section = child$2(table, sectionName).getOrThunk(function() {
        var tb = Element.fromTag(sectionName, owner(table).dom())
        sectionName === 'thead' ? insertThead(tb) : append(table, tb)
        return tb
      })
      empty(section)
      var rows = map(gridSection, function(row) {
        if (row.isNew()) {
          newRows.push(row.element())
        }
        var tr = row.element()
        empty(tr)
        each(row.cells(), function(cell) {
          if (cell.isNew()) {
            newCells.push(cell.element())
          }
          setIfNot(cell.element(), 'colspan', cell.colspan(), 1)
          setIfNot(cell.element(), 'rowspan', cell.rowspan(), 1)
          append(tr, cell.element())
        })
        return tr
      })
      append$1(section, rows)
    }
    var removeSection = function(sectionName) {
      child$2(table, sectionName).each(remove$2)
    }
    var renderOrRemoveSection = function(gridSection, sectionName) {
      if (gridSection.length > 0) {
        renderSection(gridSection, sectionName)
      } else {
        removeSection(sectionName)
      }
    }
    var headSection = []
    var bodySection = []
    var footSection = []
    each(grid, function(row) {
      switch (row.section()) {
        case 'thead':
          headSection.push(row)
          break
        case 'tbody':
          bodySection.push(row)
          break
        case 'tfoot':
          footSection.push(row)
          break
      }
    })
    renderOrRemoveSection(headSection, 'thead')
    renderOrRemoveSection(bodySection, 'tbody')
    renderOrRemoveSection(footSection, 'tfoot')
    return {
      newRows: newRows,
      newCells: newCells
    }
  }
  var copy$2 = function(grid) {
    return map(grid, function(row) {
      var tr = shallow(row.element())
      each(row.cells(), function(cell) {
        var clonedCell = deep(cell.element())
        setIfNot(clonedCell, 'colspan', cell.colspan(), 1)
        setIfNot(clonedCell, 'rowspan', cell.rowspan(), 1)
        append(tr, clonedCell)
      })
      return tr
    })
  }

  var addCell = function(gridRow, index, cell) {
    var cells = gridRow.cells()
    var before = cells.slice(0, index)
    var after = cells.slice(index)
    var newCells = before.concat([cell]).concat(after)
    return setCells(gridRow, newCells)
  }
  var mutateCell = function(gridRow, index, cell) {
    var cells = gridRow.cells()
    cells[index] = cell
  }
  var setCells = function(gridRow, cells) {
    return rowcells(cells, gridRow.section())
  }
  var mapCells = function(gridRow, f) {
    var cells = gridRow.cells()
    var r = map(cells, f)
    return rowcells(r, gridRow.section())
  }
  var getCell = function(gridRow, index) {
    return gridRow.cells()[index]
  }
  var getCellElement = function(gridRow, index) {
    return getCell(gridRow, index).element()
  }
  var cellLength = function(gridRow) {
    return gridRow.cells().length
  }

  var getColumn = function(grid, index) {
    return map(grid, function(row) {
      return getCell(row, index)
    })
  }
  var getRow = function(grid, index) {
    return grid[index]
  }
  var findDiff = function(xs, comp) {
    if (xs.length === 0) {
      return 0
    }
    var first = xs[0]
    var index = findIndex(xs, function(x) {
      return !comp(first.element(), x.element())
    })
    return index.fold(
      function() {
        return xs.length
      },
      function(ind) {
        return ind
      }
    )
  }
  var subgrid = function(grid, row, column, comparator) {
    var restOfRow = getRow(grid, row)
      .cells()
      .slice(column)
    var endColIndex = findDiff(restOfRow, comparator)
    var restOfColumn = getColumn(grid, column).slice(row)
    var endRowIndex = findDiff(restOfColumn, comparator)
    return {
      colspan: endColIndex,
      rowspan: endRowIndex
    }
  }

  var toDetails = function(grid, comparator) {
    var seen = map(grid, function(row) {
      return map(row.cells(), function() {
        return false
      })
    })
    var updateSeen = function(ri, ci, rowspan, colspan) {
      for (var r = ri; r < ri + rowspan; r++) {
        for (var c = ci; c < ci + colspan; c++) {
          seen[r][c] = true
        }
      }
    }
    return map(grid, function(row, ri) {
      var details = bind(row.cells(), function(cell, ci) {
        if (seen[ri][ci] === false) {
          var result = subgrid(grid, ri, ci, comparator)
          updateSeen(ri, ci, result.rowspan, result.colspan)
          return [
            detailnew(
              cell.element(),
              result.rowspan,
              result.colspan,
              cell.isNew()
            )
          ]
        } else {
          return []
        }
      })
      return rowdetails(details, row.section())
    })
  }
  var toGrid = function(warehouse, generators, isNew) {
    var grid = []
    for (var i = 0; i < warehouse.grid.rows(); i++) {
      var rowCells = []
      for (var j = 0; j < warehouse.grid.columns(); j++) {
        var element = Warehouse.getAt(warehouse, i, j)
          .map(function(item) {
            return elementnew(item.element(), isNew)
          })
          .getOrThunk(function() {
            return elementnew(generators.gap(), true)
          })
        rowCells.push(element)
      }
      var row = rowcells(rowCells, warehouse.all[i].section())
      grid.push(row)
    }
    return grid
  }

  var fromWarehouse = function(warehouse, generators) {
    return toGrid(warehouse, generators, false)
  }
  var deriveRows = function(rendered, generators) {
    var findRow = function(details) {
      var rowOfCells = findMap(details, function(detail) {
        return parent(detail.element()).map(function(row) {
          var isNew = parent(row).isNone()
          return elementnew(row, isNew)
        })
      })
      return rowOfCells.getOrThunk(function() {
        return elementnew(generators.row(), true)
      })
    }
    return map(rendered, function(details) {
      var row = findRow(details.details())
      return rowdatanew(
        row.element(),
        details.details(),
        details.section(),
        row.isNew()
      )
    })
  }
  var toDetailList = function(grid, generators) {
    var rendered = toDetails(grid, eq)
    return deriveRows(rendered, generators)
  }
  var findInWarehouse = function(warehouse, element) {
    return findMap(warehouse.all, function(r) {
      return find(r.cells(), function(e) {
        return eq(element, e.element())
      })
    })
  }
  var run = function(operation, extract, adjustment, postAction, genWrappers) {
    return function(wire, table, target, generators, direction, sizing) {
      var warehouse = Warehouse.fromTable(table)
      var output = extract(warehouse, target).map(function(info) {
        var model = fromWarehouse(warehouse, generators)
        var result = operation(model, info, eq, genWrappers(generators))
        var grid = toDetailList(result.grid(), generators)
        return {
          grid: constant(grid),
          cursor: result.cursor
        }
      })
      return output.fold(
        function() {
          return Option.none()
        },
        function(out) {
          var newElements = render(table, out.grid())
          var tableSizing = Option.from(sizing).getOrThunk(function() {
            return TableSize.getTableSize(table)
          })
          adjustment(table, out.grid(), direction, tableSizing)
          postAction(table)
          refresh(wire, table, height, direction)
          return Option.some({
            cursor: out.cursor,
            newRows: constant(newElements.newRows),
            newCells: constant(newElements.newCells)
          })
        }
      )
    }
  }
  var onCell = function(warehouse, target) {
    return cell(target.element()).bind(function(cell) {
      return findInWarehouse(warehouse, cell)
    })
  }
  var onPaste = function(warehouse, target) {
    return cell(target.element()).bind(function(cell) {
      return findInWarehouse(warehouse, cell).map(function(details) {
        var value = __assign(__assign({}, details), {
          generators: target.generators,
          clipboard: target.clipboard
        })
        return value
      })
    })
  }
  var onPasteByEditor = function(warehouse, target) {
    var details = map(target.selection(), function(cell$1) {
      return cell(cell$1).bind(function(lc) {
        return findInWarehouse(warehouse, lc)
      })
    })
    var cells = cat(details)
    return cells.length > 0
      ? Option.some({
          cells: cells,
          generators: target.generators,
          clipboard: target.clipboard
        })
      : Option.none()
  }
  var onMergable = function(_warehouse, target) {
    return target.mergable()
  }
  var onUnmergable = function(_warehouse, target) {
    return target.unmergable()
  }
  var onCells = function(warehouse, target) {
    var details = map(target.selection(), function(cell$1) {
      return cell(cell$1).bind(function(lc) {
        return findInWarehouse(warehouse, lc)
      })
    })
    var cells = cat(details)
    return cells.length > 0 ? Option.some(cells) : Option.none()
  }

  var merge = function(grid, bounds, comparator, substitution) {
    if (grid.length === 0) {
      return grid
    }
    for (var i = bounds.startRow(); i <= bounds.finishRow(); i++) {
      for (var j = bounds.startCol(); j <= bounds.finishCol(); j++) {
        mutateCell(grid[i], j, elementnew(substitution(), false))
      }
    }
    return grid
  }
  var unmerge = function(grid, target, comparator, substitution) {
    var first = true
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < cellLength(grid[0]); j++) {
        var current = getCellElement(grid[i], j)
        var isToReplace = comparator(current, target)
        if (isToReplace === true && first === false) {
          mutateCell(grid[i], j, elementnew(substitution(), true))
        } else if (isToReplace === true) {
          first = false
        }
      }
    }
    return grid
  }
  var uniqueCells = function(row, comparator) {
    return foldl(
      row,
      function(rest, cell) {
        return exists(rest, function(currentCell) {
          return comparator(currentCell.element(), cell.element())
        })
          ? rest
          : rest.concat([cell])
      },
      []
    )
  }
  var splitCols = function(grid, index, comparator, substitution) {
    if (index > 0 && index < grid[0].cells().length) {
      each(grid, function(row) {
        var prevCell = row.cells()[index - 1]
        var current = row.cells()[index]
        var isToReplace = comparator(current.element(), prevCell.element())
        if (isToReplace) {
          mutateCell(row, index, elementnew(substitution(), true))
        }
      })
    }
    return grid
  }
  var splitRows = function(grid, index, comparator, substitution) {
    if (index > 0 && index < grid.length) {
      var rowPrevCells = grid[index - 1].cells()
      var cells = uniqueCells(rowPrevCells, comparator)
      each(cells, function(cell) {
        var replacement = Option.none()
        var _loop_1 = function(i) {
          var _loop_2 = function(j) {
            var current = grid[i].cells()[j]
            var isToReplace = comparator(current.element(), cell.element())
            if (isToReplace) {
              if (replacement.isNone()) {
                replacement = Option.some(substitution())
              }
              replacement.each(function(sub) {
                mutateCell(grid[i], j, elementnew(sub, true))
              })
            }
          }
          for (var j = 0; j < cellLength(grid[0]); j++) {
            _loop_2(j)
          }
        }
        for (var i = index; i < grid.length; i++) {
          _loop_1(i)
        }
      })
    }
    return grid
  }

  var value = function(o) {
    var is = function(v) {
      return o === v
    }
    var or = function(_opt) {
      return value(o)
    }
    var orThunk = function(_f) {
      return value(o)
    }
    var map = function(f) {
      return value(f(o))
    }
    var mapError = function(_f) {
      return value(o)
    }
    var each = function(f) {
      f(o)
    }
    var bind = function(f) {
      return f(o)
    }
    var fold = function(_, onValue) {
      return onValue(o)
    }
    var exists = function(f) {
      return f(o)
    }
    var forall = function(f) {
      return f(o)
    }
    var toOption = function() {
      return Option.some(o)
    }
    return {
      is: is,
      isValue: always,
      isError: never,
      getOr: constant(o),
      getOrThunk: constant(o),
      getOrDie: constant(o),
      or: or,
      orThunk: orThunk,
      fold: fold,
      map: map,
      mapError: mapError,
      each: each,
      bind: bind,
      exists: exists,
      forall: forall,
      toOption: toOption
    }
  }
  var error = function(message) {
    var getOrThunk = function(f) {
      return f()
    }
    var getOrDie = function() {
      return die(String(message))()
    }
    var or = function(opt) {
      return opt
    }
    var orThunk = function(f) {
      return f()
    }
    var map = function(_f) {
      return error(message)
    }
    var mapError = function(f) {
      return error(f(message))
    }
    var bind = function(_f) {
      return error(message)
    }
    var fold = function(onError, _) {
      return onError(message)
    }
    return {
      is: never,
      isValue: never,
      isError: always,
      getOr: identity,
      getOrThunk: getOrThunk,
      getOrDie: getOrDie,
      or: or,
      orThunk: orThunk,
      fold: fold,
      map: map,
      mapError: mapError,
      each: noop,
      bind: bind,
      exists: never,
      forall: always,
      toOption: Option.none
    }
  }
  var fromOption = function(opt, err) {
    return opt.fold(function() {
      return error(err)
    }, value)
  }
  var Result = {
    value: value,
    error: error,
    fromOption: fromOption
  }

  var measure = function(startAddress, gridA, gridB) {
    if (
      startAddress.row() >= gridA.length ||
      startAddress.column() > cellLength(gridA[0])
    ) {
      return Result.error(
        'invalid start address out of table bounds, row: ' +
          startAddress.row() +
          ', column: ' +
          startAddress.column()
      )
    }
    var rowRemainder = gridA.slice(startAddress.row())
    var colRemainder = rowRemainder[0].cells().slice(startAddress.column())
    var colRequired = cellLength(gridB[0])
    var rowRequired = gridB.length
    return Result.value({
      rowDelta: rowRemainder.length - rowRequired,
      colDelta: colRemainder.length - colRequired
    })
  }
  var measureWidth = function(gridA, gridB) {
    var colLengthA = cellLength(gridA[0])
    var colLengthB = cellLength(gridB[0])
    return {
      rowDelta: 0,
      colDelta: colLengthA - colLengthB
    }
  }
  var measureHeight = function(gridA, gridB) {
    var rowLengthA = gridA.length
    var rowLengthB = gridB.length
    return {
      rowDelta: rowLengthA - rowLengthB,
      colDelta: 0
    }
  }
  var fill = function(cells, generator) {
    return map(cells, function() {
      return elementnew(generator.cell(), true)
    })
  }
  var rowFill = function(grid, amount, generator) {
    return grid.concat(
      range(amount, function() {
        return setCells(
          grid[grid.length - 1],
          fill(grid[grid.length - 1].cells(), generator)
        )
      })
    )
  }
  var colFill = function(grid, amount, generator) {
    return map(grid, function(row) {
      return setCells(
        row,
        row.cells().concat(fill(range(amount, identity), generator))
      )
    })
  }
  var tailor = function(gridA, delta, generator) {
    var fillCols = delta.colDelta < 0 ? colFill : identity
    var fillRows = delta.rowDelta < 0 ? rowFill : identity
    var modifiedCols = fillCols(gridA, Math.abs(delta.colDelta), generator)
    return fillRows(modifiedCols, Math.abs(delta.rowDelta), generator)
  }

  var isSpanning = function(grid, row, col, comparator) {
    var candidate = getCell(grid[row], col)
    var matching = curry(comparator, candidate.element())
    var currentRow = grid[row]
    return (
      grid.length > 1 &&
      cellLength(currentRow) > 1 &&
      ((col > 0 && matching(getCellElement(currentRow, col - 1))) ||
        (col < currentRow.cells().length - 1 &&
          matching(getCellElement(currentRow, col + 1))) ||
        (row > 0 && matching(getCellElement(grid[row - 1], col))) ||
        (row < grid.length - 1 && matching(getCellElement(grid[row + 1], col))))
    )
  }
  var mergeTables = function(
    startAddress,
    gridA,
    gridB,
    generator,
    comparator
  ) {
    var startRow = startAddress.row()
    var startCol = startAddress.column()
    var mergeHeight = gridB.length
    var mergeWidth = cellLength(gridB[0])
    var endRow = startRow + mergeHeight
    var endCol = startCol + mergeWidth
    for (var r = startRow; r < endRow; r++) {
      for (var c = startCol; c < endCol; c++) {
        if (isSpanning(gridA, r, c, comparator)) {
          unmerge(
            gridA,
            getCellElement(gridA[r], c),
            comparator,
            generator.cell
          )
        }
        var newCell = getCellElement(gridB[r - startRow], c - startCol)
        var replacement = generator.replace(newCell)
        mutateCell(gridA[r], c, elementnew(replacement, true))
      }
    }
    return gridA
  }
  var merge$1 = function(startAddress, gridA, gridB, generator, comparator) {
    var result = measure(startAddress, gridA, gridB)
    return result.map(function(delta) {
      var fittedGrid = tailor(gridA, delta, generator)
      return mergeTables(startAddress, fittedGrid, gridB, generator, comparator)
    })
  }
  var insertCols = function(index, gridA, gridB, generator, comparator) {
    splitCols(gridA, index, comparator, generator.cell)
    var delta = measureHeight(gridB, gridA)
    var fittedNewGrid = tailor(gridB, delta, generator)
    var secondDelta = measureHeight(gridA, fittedNewGrid)
    var fittedOldGrid = tailor(gridA, secondDelta, generator)
    return map(fittedOldGrid, function(gridRow, i) {
      var newCells = gridRow
        .cells()
        .slice(0, index)
        .concat(fittedNewGrid[i].cells())
        .concat(gridRow.cells().slice(index, gridRow.cells().length))
      return setCells(gridRow, newCells)
    })
  }
  var insertRows = function(index, gridA, gridB, generator, comparator) {
    splitRows(gridA, index, comparator, generator.cell)
    var delta = measureWidth(gridB, gridA)
    var fittedNewGrid = tailor(gridB, delta, generator)
    var secondDelta = measureWidth(gridA, fittedNewGrid)
    var fittedOldGrid = tailor(gridA, secondDelta, generator)
    return fittedOldGrid
      .slice(0, index)
      .concat(fittedNewGrid)
      .concat(fittedOldGrid.slice(index, fittedOldGrid.length))
  }

  var insertRowAt = function(grid, index, example, comparator, substitution) {
    var before = grid.slice(0, index)
    var after = grid.slice(index)
    var between = mapCells(grid[example], function(ex, c) {
      var withinSpan =
        index > 0 &&
        index < grid.length &&
        comparator(
          getCellElement(grid[index - 1], c),
          getCellElement(grid[index], c)
        )
      var ret = withinSpan
        ? getCell(grid[index], c)
        : elementnew(substitution(ex.element(), comparator), true)
      return ret
    })
    return before.concat([between]).concat(after)
  }
  var insertColumnAt = function(
    grid,
    index,
    example,
    comparator,
    substitution
  ) {
    return map(grid, function(row) {
      var withinSpan =
        index > 0 &&
        index < cellLength(row) &&
        comparator(getCellElement(row, index - 1), getCellElement(row, index))
      var sub = withinSpan
        ? getCell(row, index)
        : elementnew(
            substitution(getCellElement(row, example), comparator),
            true
          )
      return addCell(row, index, sub)
    })
  }
  var deleteColumnsAt = function(grid, start, finish) {
    var rows = map(grid, function(row) {
      var cells = row
        .cells()
        .slice(0, start)
        .concat(row.cells().slice(finish + 1))
      return rowcells(cells, row.section())
    })
    return filter(rows, function(row) {
      return row.cells().length > 0
    })
  }
  var deleteRowsAt = function(grid, start, finish) {
    return grid.slice(0, start).concat(grid.slice(finish + 1))
  }

  var replaceIn = function(grid, targets, comparator, substitution) {
    var isTarget = function(cell) {
      return exists(targets, function(target) {
        return comparator(cell.element(), target.element())
      })
    }
    return map(grid, function(row) {
      return mapCells(row, function(cell) {
        return isTarget(cell)
          ? elementnew(substitution(cell.element(), comparator), true)
          : cell
      })
    })
  }
  var notStartRow = function(grid, rowIndex, colIndex, comparator) {
    return (
      getCellElement(grid[rowIndex], colIndex) !== undefined &&
      rowIndex > 0 &&
      comparator(
        getCellElement(grid[rowIndex - 1], colIndex),
        getCellElement(grid[rowIndex], colIndex)
      )
    )
  }
  var notStartColumn = function(row, index, comparator) {
    return (
      index > 0 &&
      comparator(getCellElement(row, index - 1), getCellElement(row, index))
    )
  }
  var replaceColumn = function(grid, index, comparator, substitution) {
    var targets = bind(grid, function(row, i) {
      var alreadyAdded =
        notStartRow(grid, i, index, comparator) ||
        notStartColumn(row, index, comparator)
      return alreadyAdded ? [] : [getCell(row, index)]
    })
    return replaceIn(grid, targets, comparator, substitution)
  }
  var replaceRow = function(grid, index, comparator, substitution) {
    var targetRow = grid[index]
    var targets = bind(targetRow.cells(), function(item, i) {
      var alreadyAdded =
        notStartRow(grid, index, i, comparator) ||
        notStartColumn(targetRow, i, comparator)
      return alreadyAdded ? [] : [item]
    })
    return replaceIn(grid, targets, comparator, substitution)
  }

  var verifyGenerators = exactly(['cell', 'row', 'replace', 'gap'])
  var elementToData = function(element) {
    var colspan = getAttrValue(element, 'colspan', 1)
    var rowspan = getAttrValue(element, 'rowspan', 1)
    return {
      element: constant(element),
      colspan: constant(colspan),
      rowspan: constant(rowspan)
    }
  }
  var modification = function(generators, toData) {
    if (toData === void 0) {
      toData = elementToData
    }
    verifyGenerators(generators)
    var position = Cell(Option.none())
    var nu = function(data) {
      return generators.cell(data)
    }
    var nuFrom = function(element) {
      var data = toData(element)
      return nu(data)
    }
    var add = function(element) {
      var replacement = nuFrom(element)
      if (position.get().isNone()) {
        position.set(Option.some(replacement))
      }
      recent = Option.some({
        item: element,
        replacement: replacement
      })
      return replacement
    }
    var recent = Option.none()
    var getOrInit = function(element, comparator) {
      return recent.fold(
        function() {
          return add(element)
        },
        function(p) {
          return comparator(element, p.item) ? p.replacement : add(element)
        }
      )
    }
    return {
      getOrInit: getOrInit,
      cursor: position.get
    }
  }
  var transform$1 = function(scope, tag) {
    return function(generators) {
      var position = Cell(Option.none())
      verifyGenerators(generators)
      var list = []
      var find$1 = function(element, comparator) {
        return find(list, function(x) {
          return comparator(x.item, element)
        })
      }
      var makeNew = function(element) {
        var attrs = { scope: scope }
        var cell = generators.replace(element, tag, attrs)
        list.push({
          item: element,
          sub: cell
        })
        if (position.get().isNone()) {
          position.set(Option.some(cell))
        }
        return cell
      }
      var replaceOrInit = function(element, comparator) {
        return find$1(element, comparator).fold(
          function() {
            return makeNew(element)
          },
          function(p) {
            return comparator(element, p.item) ? p.sub : makeNew(element)
          }
        )
      }
      return {
        replaceOrInit: replaceOrInit,
        cursor: position.get
      }
    }
  }
  var merging = function(generators) {
    verifyGenerators(generators)
    var position = Cell(Option.none())
    var combine = function(cell) {
      if (position.get().isNone()) {
        position.set(Option.some(cell))
      }
      return function() {
        var raw = generators.cell({
          element: constant(cell),
          colspan: constant(1),
          rowspan: constant(1)
        })
        remove$1(raw, 'width')
        remove$1(cell, 'width')
        return raw
      }
    }
    return {
      combine: combine,
      cursor: position.get
    }
  }
  var Generators = {
    modification: modification,
    transform: transform$1,
    merging: merging
  }

  var blockList = [
    'body',
    'p',
    'div',
    'article',
    'aside',
    'figcaption',
    'figure',
    'footer',
    'header',
    'nav',
    'section',
    'ol',
    'ul',
    'table',
    'thead',
    'tfoot',
    'tbody',
    'caption',
    'tr',
    'td',
    'th',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'pre',
    'address'
  ]
  var isList = function(universe, item) {
    var tagName = universe.property().name(item)
    return contains(['ol', 'ul'], tagName)
  }
  var isBlock = function(universe, item) {
    var tagName = universe.property().name(item)
    return contains(blockList, tagName)
  }
  var isEmptyTag = function(universe, item) {
    return contains(
      ['br', 'img', 'hr', 'input'],
      universe.property().name(item)
    )
  }

  var universe$2 = DomUniverse()
  var isBlock$1 = function(element) {
    return isBlock(universe$2, element)
  }
  var isList$1 = function(element) {
    return isList(universe$2, element)
  }
  var isEmptyTag$1 = function(element) {
    return isEmptyTag(universe$2, element)
  }

  var merge$2 = function(cells) {
    var isBr = function(el) {
      return name(el) === 'br'
    }
    var advancedBr = function(children) {
      return forall(children, function(c) {
        return isBr(c) || (isText(c) && get$3(c).trim().length === 0)
      })
    }
    var isListItem = function(el) {
      return name(el) === 'li' || ancestor(el, isList$1).isSome()
    }
    var siblingIsBlock = function(el) {
      return nextSibling(el)
        .map(function(rightSibling) {
          if (isBlock$1(rightSibling)) {
            return true
          }
          if (isEmptyTag$1(rightSibling)) {
            return name(rightSibling) === 'img' ? false : true
          }
          return false
        })
        .getOr(false)
    }
    var markCell = function(cell) {
      return last$1(cell)
        .bind(function(rightEdge) {
          var rightSiblingIsBlock = siblingIsBlock(rightEdge)
          return parent(rightEdge).map(function(parent) {
            return rightSiblingIsBlock === true ||
              isListItem(parent) ||
              isBr(rightEdge) ||
              (isBlock$1(parent) && !eq(cell, parent))
              ? []
              : [Element.fromTag('br')]
          })
        })
        .getOr([])
    }
    var markContent = function() {
      var content = bind(cells, function(cell) {
        var children$1 = children(cell)
        return advancedBr(children$1) ? [] : children$1.concat(markCell(cell))
      })
      return content.length === 0 ? [Element.fromTag('br')] : content
    }
    var contents = markContent()
    empty(cells[0])
    append$1(cells[0], contents)
  }

  var prune = function(table) {
    var cells$1 = cells(table)
    if (cells$1.length === 0) {
      remove$2(table)
    }
  }
  var outcome = function(grid, cursor) {
    return {
      grid: constant(grid),
      cursor: constant(cursor)
    }
  }
  var elementFromGrid = function(grid, row, column) {
    return findIn(grid, row, column).orThunk(function() {
      return findIn(grid, 0, 0)
    })
  }
  var findIn = function(grid, row, column) {
    return Option.from(grid[row]).bind(function(r) {
      return Option.from(r.cells()[column]).bind(function(c) {
        return Option.from(c.element())
      })
    })
  }
  var bundle = function(grid, row, column) {
    return outcome(grid, findIn(grid, row, column))
  }
  var uniqueRows = function(details) {
    return foldl(
      details,
      function(rest, detail) {
        return exists(rest, function(currentDetail) {
          return currentDetail.row() === detail.row()
        })
          ? rest
          : rest.concat([detail])
      },
      []
    ).sort(function(detailA, detailB) {
      return detailA.row() - detailB.row()
    })
  }
  var uniqueColumns = function(details) {
    return foldl(
      details,
      function(rest, detail) {
        return exists(rest, function(currentDetail) {
          return currentDetail.column() === detail.column()
        })
          ? rest
          : rest.concat([detail])
      },
      []
    ).sort(function(detailA, detailB) {
      return detailA.column() - detailB.column()
    })
  }
  var opInsertRowsBefore = function(grid, details, comparator, genWrappers) {
    var example = details[0].row()
    var targetIndex = details[0].row()
    var rows = uniqueRows(details)
    var newGrid = foldl(
      rows,
      function(newG, _row) {
        return insertRowAt(
          newG,
          targetIndex,
          example,
          comparator,
          genWrappers.getOrInit
        )
      },
      grid
    )
    return bundle(newGrid, targetIndex, details[0].column())
  }
  var opInsertRowsAfter = function(grid, details, comparator, genWrappers) {
    var rows = uniqueRows(details)
    var example = rows[rows.length - 1].row()
    var targetIndex =
      rows[rows.length - 1].row() + rows[rows.length - 1].rowspan()
    var newGrid = foldl(
      rows,
      function(newG, _row) {
        return insertRowAt(
          newG,
          targetIndex,
          example,
          comparator,
          genWrappers.getOrInit
        )
      },
      grid
    )
    return bundle(newGrid, targetIndex, details[0].column())
  }
  var opInsertColumnsBefore = function(grid, details, comparator, genWrappers) {
    var columns = uniqueColumns(details)
    var example = columns[0].column()
    var targetIndex = columns[0].column()
    var newGrid = foldl(
      columns,
      function(newG, _row) {
        return insertColumnAt(
          newG,
          targetIndex,
          example,
          comparator,
          genWrappers.getOrInit
        )
      },
      grid
    )
    return bundle(newGrid, details[0].row(), targetIndex)
  }
  var opInsertColumnsAfter = function(grid, details, comparator, genWrappers) {
    var example = details[details.length - 1].column()
    var targetIndex =
      details[details.length - 1].column() +
      details[details.length - 1].colspan()
    var columns = uniqueColumns(details)
    var newGrid = foldl(
      columns,
      function(newG, _row) {
        return insertColumnAt(
          newG,
          targetIndex,
          example,
          comparator,
          genWrappers.getOrInit
        )
      },
      grid
    )
    return bundle(newGrid, details[0].row(), targetIndex)
  }
  var opMakeRowHeader = function(grid, detail, comparator, genWrappers) {
    var newGrid = replaceRow(
      grid,
      detail.row(),
      comparator,
      genWrappers.replaceOrInit
    )
    return bundle(newGrid, detail.row(), detail.column())
  }
  var opMakeColumnHeader = function(grid, detail, comparator, genWrappers) {
    var newGrid = replaceColumn(
      grid,
      detail.column(),
      comparator,
      genWrappers.replaceOrInit
    )
    return bundle(newGrid, detail.row(), detail.column())
  }
  var opUnmakeRowHeader = function(grid, detail, comparator, genWrappers) {
    var newGrid = replaceRow(
      grid,
      detail.row(),
      comparator,
      genWrappers.replaceOrInit
    )
    return bundle(newGrid, detail.row(), detail.column())
  }
  var opUnmakeColumnHeader = function(grid, detail, comparator, genWrappers) {
    var newGrid = replaceColumn(
      grid,
      detail.column(),
      comparator,
      genWrappers.replaceOrInit
    )
    return bundle(newGrid, detail.row(), detail.column())
  }
  var opEraseColumns = function(grid, details, _comparator, _genWrappers) {
    var columns = uniqueColumns(details)
    var newGrid = deleteColumnsAt(
      grid,
      columns[0].column(),
      columns[columns.length - 1].column()
    )
    var cursor = elementFromGrid(newGrid, details[0].row(), details[0].column())
    return outcome(newGrid, cursor)
  }
  var opEraseRows = function(grid, details, _comparator, _genWrappers) {
    var rows = uniqueRows(details)
    var newGrid = deleteRowsAt(grid, rows[0].row(), rows[rows.length - 1].row())
    var cursor = elementFromGrid(newGrid, details[0].row(), details[0].column())
    return outcome(newGrid, cursor)
  }
  var opMergeCells = function(grid, mergable, comparator, _genWrappers) {
    var cells = mergable.cells()
    merge$2(cells)
    var newGrid = merge(grid, mergable.bounds(), comparator, constant(cells[0]))
    return outcome(newGrid, Option.from(cells[0]))
  }
  var opUnmergeCells = function(grid, unmergable, comparator, genWrappers) {
    var newGrid = foldr(
      unmergable,
      function(b, cell) {
        return unmerge(b, cell, comparator, genWrappers.combine(cell))
      },
      grid
    )
    return outcome(newGrid, Option.from(unmergable[0]))
  }
  var opPasteCells = function(grid, pasteDetails, comparator, _genWrappers) {
    var gridify = function(table, generators) {
      var wh = Warehouse.fromTable(table)
      return toGrid(wh, generators, true)
    }
    var gridB = gridify(pasteDetails.clipboard(), pasteDetails.generators())
    var startAddress = address(pasteDetails.row(), pasteDetails.column())
    var mergedGrid = merge$1(
      startAddress,
      grid,
      gridB,
      pasteDetails.generators(),
      comparator
    )
    return mergedGrid.fold(
      function() {
        return outcome(grid, Option.some(pasteDetails.element()))
      },
      function(nuGrid) {
        var cursor = elementFromGrid(
          nuGrid,
          pasteDetails.row(),
          pasteDetails.column()
        )
        return outcome(nuGrid, cursor)
      }
    )
  }
  var gridifyRows = function(rows, generators, example) {
    var pasteDetails = fromPastedRows(rows, example)
    var wh = Warehouse.generate(pasteDetails)
    return toGrid(wh, generators, true)
  }
  var opPasteColsBefore = function(
    grid,
    pasteDetails,
    comparator,
    _genWrappers
  ) {
    var example = grid[pasteDetails.cells[0].row()]
    var index = pasteDetails.cells[0].column()
    var gridB = gridifyRows(
      pasteDetails.clipboard(),
      pasteDetails.generators(),
      example
    )
    var mergedGrid = insertCols(
      index,
      grid,
      gridB,
      pasteDetails.generators(),
      comparator
    )
    var cursor = elementFromGrid(
      mergedGrid,
      pasteDetails.cells[0].row(),
      pasteDetails.cells[0].column()
    )
    return outcome(mergedGrid, cursor)
  }
  var opPasteColsAfter = function(
    grid,
    pasteDetails,
    comparator,
    _genWrappers
  ) {
    var example = grid[pasteDetails.cells[0].row()]
    var index =
      pasteDetails.cells[pasteDetails.cells.length - 1].column() +
      pasteDetails.cells[pasteDetails.cells.length - 1].colspan()
    var gridB = gridifyRows(
      pasteDetails.clipboard(),
      pasteDetails.generators(),
      example
    )
    var mergedGrid = insertCols(
      index,
      grid,
      gridB,
      pasteDetails.generators(),
      comparator
    )
    var cursor = elementFromGrid(
      mergedGrid,
      pasteDetails.cells[0].row(),
      pasteDetails.cells[0].column()
    )
    return outcome(mergedGrid, cursor)
  }
  var opPasteRowsBefore = function(
    grid,
    pasteDetails,
    comparator,
    _genWrappers
  ) {
    var example = grid[pasteDetails.cells[0].row()]
    var index = pasteDetails.cells[0].row()
    var gridB = gridifyRows(
      pasteDetails.clipboard(),
      pasteDetails.generators(),
      example
    )
    var mergedGrid = insertRows(
      index,
      grid,
      gridB,
      pasteDetails.generators(),
      comparator
    )
    var cursor = elementFromGrid(
      mergedGrid,
      pasteDetails.cells[0].row(),
      pasteDetails.cells[0].column()
    )
    return outcome(mergedGrid, cursor)
  }
  var opPasteRowsAfter = function(
    grid,
    pasteDetails,
    comparator,
    _genWrappers
  ) {
    var example = grid[pasteDetails.cells[0].row()]
    var index =
      pasteDetails.cells[pasteDetails.cells.length - 1].row() +
      pasteDetails.cells[pasteDetails.cells.length - 1].rowspan()
    var gridB = gridifyRows(
      pasteDetails.clipboard(),
      pasteDetails.generators(),
      example
    )
    var mergedGrid = insertRows(
      index,
      grid,
      gridB,
      pasteDetails.generators(),
      comparator
    )
    var cursor = elementFromGrid(
      mergedGrid,
      pasteDetails.cells[0].row(),
      pasteDetails.cells[0].column()
    )
    return outcome(mergedGrid, cursor)
  }
  var opGetColumnType = function(table, target) {
    var house = Warehouse.fromTable(table)
    var details = onCells(house, target)
    return details
      .bind(function(selectedCells) {
        var lastSelectedCell = selectedCells[selectedCells.length - 1]
        var minColRange = selectedCells[0].column()
        var maxColRange = lastSelectedCell.column() + lastSelectedCell.colspan()
        var selectedColumnCells = flatten(
          map(house.all, function(row) {
            return filter(row.cells(), function(cell) {
              return cell.column() >= minColRange && cell.column() < maxColRange
            })
          })
        )
        return getCellsType(selectedColumnCells, function(cell) {
          return name(cell.element()) === 'th'
        })
      })
      .getOr('')
  }
  var getCellsType = function(cells, headerPred) {
    var headerCells = filter(cells, headerPred)
    if (headerCells.length === 0) {
      return Option.some('td')
    } else if (headerCells.length === cells.length) {
      return Option.some('th')
    } else {
      return Option.none()
    }
  }
  var resize = adjustWidthTo
  var insertRowsBefore = run(
    opInsertRowsBefore,
    onCells,
    noop,
    noop,
    Generators.modification
  )
  var insertRowsAfter = run(
    opInsertRowsAfter,
    onCells,
    noop,
    noop,
    Generators.modification
  )
  var insertColumnsBefore = run(
    opInsertColumnsBefore,
    onCells,
    resize,
    noop,
    Generators.modification
  )
  var insertColumnsAfter = run(
    opInsertColumnsAfter,
    onCells,
    resize,
    noop,
    Generators.modification
  )
  var eraseColumns = run(
    opEraseColumns,
    onCells,
    resize,
    prune,
    Generators.modification
  )
  var eraseRows = run(
    opEraseRows,
    onCells,
    noop,
    prune,
    Generators.modification
  )
  var makeColumnHeader = run(
    opMakeColumnHeader,
    onCell,
    noop,
    noop,
    Generators.transform('row', 'th')
  )
  var unmakeColumnHeader = run(
    opUnmakeColumnHeader,
    onCell,
    noop,
    noop,
    Generators.transform(null, 'td')
  )
  var makeRowHeader = run(
    opMakeRowHeader,
    onCell,
    noop,
    noop,
    Generators.transform('col', 'th')
  )
  var unmakeRowHeader = run(
    opUnmakeRowHeader,
    onCell,
    noop,
    noop,
    Generators.transform(null, 'td')
  )
  var mergeCells = run(opMergeCells, onMergable, noop, noop, Generators.merging)
  var unmergeCells = run(
    opUnmergeCells,
    onUnmergable,
    resize,
    noop,
    Generators.merging
  )
  var pasteCells = run(
    opPasteCells,
    onPaste,
    resize,
    noop,
    Generators.modification
  )
  var pasteColsBefore = run(
    opPasteColsBefore,
    onPasteByEditor,
    noop,
    noop,
    Generators.modification
  )
  var pasteColsAfter = run(
    opPasteColsAfter,
    onPasteByEditor,
    noop,
    noop,
    Generators.modification
  )
  var pasteRowsBefore = run(
    opPasteRowsBefore,
    onPasteByEditor,
    noop,
    noop,
    Generators.modification
  )
  var pasteRowsAfter = run(
    opPasteRowsAfter,
    onPasteByEditor,
    noop,
    noop,
    Generators.modification
  )
  var getColumnType = opGetColumnType

  var getSection = function(elm) {
    return getNodeName(elm.parentNode)
  }
  var mapSectionNameToType = function(section) {
    if (section === 'thead') {
      return 'header'
    } else if (section === 'tfoot') {
      return 'footer'
    } else {
      return 'body'
    }
  }
  var detectHeaderRow = function(editor, elm) {
    var isThead = getSection(elm) === 'thead'
    var areAllCellsThs = !exists(elm.cells, function(c) {
      return getNodeName(c) !== 'th'
    })
    return isThead || areAllCellsThs
      ? Option.some({
          thead: isThead,
          ths: areAllCellsThs
        })
      : Option.none()
  }
  var getRowType = function(editor, elm) {
    return mapSectionNameToType(
      detectHeaderRow(editor, elm).fold(
        function() {
          return getSection(elm)
        },
        function(_rowConfig) {
          return 'thead'
        }
      )
    )
  }
  var switchRowSection = function(dom, rowElm, newSectionName) {
    var tableElm = dom.getParent(rowElm, 'table')
    var oldSectionElm = rowElm.parentNode
    var oldSectionName = getNodeName(oldSectionElm)
    if (newSectionName !== oldSectionName) {
      var sectionElm_1 = dom.select(newSectionName, tableElm)[0]
      if (!sectionElm_1) {
        sectionElm_1 = dom.create(newSectionName)
        var firstTableChild_1 = tableElm.firstChild
        if (newSectionName === 'thead') {
          last(children$2(Element.fromDom(tableElm), 'caption,colgroup')).fold(
            function() {
              return tableElm.insertBefore(sectionElm_1, firstTableChild_1)
            },
            function(c) {
              return dom.insertAfter(sectionElm_1, c.dom())
            }
          )
        } else {
          tableElm.appendChild(sectionElm_1)
        }
      }
      if (
        newSectionName === 'tbody' &&
        oldSectionName === 'thead' &&
        sectionElm_1.firstChild
      ) {
        sectionElm_1.insertBefore(rowElm, sectionElm_1.firstChild)
      } else {
        sectionElm_1.appendChild(rowElm)
      }
      if (!oldSectionElm.hasChildNodes()) {
        dom.remove(oldSectionElm)
      }
    }
  }
  var switchCellType = function(dom, cells, newCellType, scope) {
    return each(cells, function(c) {
      var newCell =
        getNodeName(c) !== newCellType ? dom.rename(c, newCellType) : c
      dom.setAttrib(newCell, 'scope', scope)
    })
  }
  var switchSectionType = function(editor, rowElm, newType) {
    var determineHeaderRowType = function() {
      var allTableRows = table(Element.fromDom(rowElm.cells[0]))
        .map(function(table) {
          return rows(table)
        })
        .getOr([])
      return findMap(allTableRows, function(row) {
        return detectHeaderRow(editor, row.dom())
      })
        .map(function(detectedType) {
          if (detectedType.thead && detectedType.ths) {
            return 'sectionCells'
          } else {
            return detectedType.thead ? 'section' : 'cells'
          }
        })
        .getOr('section')
    }
    var dom = editor.dom
    if (newType === 'header') {
      var headerRowTypeSetting = getTableHeaderType(editor)
      var headerRowType =
        headerRowTypeSetting === 'auto'
          ? determineHeaderRowType()
          : headerRowTypeSetting
      switchCellType(
        dom,
        rowElm.cells,
        headerRowType === 'section' ? 'td' : 'th',
        'col'
      )
      switchRowSection(
        dom,
        rowElm,
        headerRowType === 'cells' ? 'tbody' : 'thead'
      )
    } else {
      switchCellType(dom, rowElm.cells, 'td', null)
      switchRowSection(dom, rowElm, newType === 'footer' ? 'tfoot' : 'tbody')
    }
  }

  var Selections = function(editor) {
    var get = function() {
      var body = getBody$1(editor)
      return retrieve$1(body, selectedSelector).fold(
        function() {
          if (editor.selection.getStart() === undefined) {
            return none$1()
          } else {
            return single(editor.selection)
          }
        },
        function(cells) {
          return multiple(cells)
        }
      )
    }
    return { get: get }
  }

  var getSelectionStartFromSelector = function(selector) {
    return function(editor) {
      return Option.from(
        editor.dom.getParent(editor.selection.getStart(), selector)
      ).map(function(n) {
        return Element.fromDom(n)
      })
    }
  }
  var getSelectionStartCell = getSelectionStartFromSelector('th,td')
  var getSelectionStartCellOrCaption = getSelectionStartFromSelector(
    'th,td,caption'
  )
  var getCellsFromSelection = function(editor) {
    return getSelectionStartCell(editor)
      .map(function(cell) {
        return selection(cell, Selections(editor))
      })
      .map(function(cells) {
        return map(cells, function(cell) {
          return cell.dom()
        })
      })
      .getOr([])
  }
  var getRowsFromSelection = function(editor) {
    var cellOpt = getSelectionStartCell(editor)
    var rowsOpt = cellOpt
      .bind(function(cell) {
        return table(cell)
      })
      .map(function(table) {
        return rows(table)
      })
      .map(function(rows) {
        return map(rows, function(row) {
          return row.dom()
        })
      })
    return lift2(cellOpt, rowsOpt, function(cell, rows) {
      return filter(rows, function(row) {
        return exists(row.cells, function(rowCell) {
          return (
            editor.dom.getAttrib(rowCell, selected) === '1' ||
            rowCell === cell.dom()
          )
        })
      })
    }).getOr([])
  }

  var TableActions = function(editor, lazyWire) {
    var isTableBody = function(editor) {
      return name(getBody$1(editor)) === 'table'
    }
    var lastRowGuard = function(table) {
      return isTableBody(editor) === false || getGridSize(table).rows() > 1
    }
    var lastColumnGuard = function(table) {
      return isTableBody(editor) === false || getGridSize(table).columns() > 1
    }
    var cloneFormats = getCloneElements(editor)
    var execute = function(operation, guard, mutate, lazyWire) {
      return function(table, target) {
        removeDataStyle(table)
        var wire = lazyWire()
        var doc = Element.fromDom(editor.getDoc())
        var direction = TableDirection(directionAt)
        var generators = cellOperations(mutate, doc, cloneFormats)
        var sizing = get$8(editor, table)
        return guard(table)
          ? operation(wire, table, target, generators, direction, sizing).bind(
              function(result) {
                each(result.newRows(), function(row) {
                  fireNewRow(editor, row.dom())
                })
                each(result.newCells(), function(cell) {
                  fireNewCell(editor, cell.dom())
                })
                return result.cursor().map(function(cell) {
                  var des = freefallRtl$2(cell)
                  var rng = editor.dom.createRng()
                  rng.setStart(des.element().dom(), des.offset())
                  rng.setEnd(des.element().dom(), des.offset())
                  return rng
                })
              }
            )
          : Option.none()
      }
    }
    var deleteRow = execute(eraseRows, lastRowGuard, noop, lazyWire)
    var deleteColumn = execute(eraseColumns, lastColumnGuard, noop, lazyWire)
    var insertRowsBefore$1 = execute(insertRowsBefore, always, noop, lazyWire)
    var insertRowsAfter$1 = execute(insertRowsAfter, always, noop, lazyWire)
    var insertColumnsBefore$1 = execute(
      insertColumnsBefore,
      always,
      halve,
      lazyWire
    )
    var insertColumnsAfter$1 = execute(
      insertColumnsAfter,
      always,
      halve,
      lazyWire
    )
    var mergeCells$1 = execute(mergeCells, always, noop, lazyWire)
    var unmergeCells$1 = execute(unmergeCells, always, noop, lazyWire)
    var pasteColsBefore$1 = execute(pasteColsBefore, always, noop, lazyWire)
    var pasteColsAfter$1 = execute(pasteColsAfter, always, noop, lazyWire)
    var pasteRowsBefore$1 = execute(pasteRowsBefore, always, noop, lazyWire)
    var pasteRowsAfter$1 = execute(pasteRowsAfter, always, noop, lazyWire)
    var pasteCells$1 = execute(pasteCells, always, noop, lazyWire)
    var extractType = function(args, validTypes) {
      return get(args, 'type').filter(function(type) {
        return contains(validTypes, type)
      })
    }
    var setTableCellType = function(editor, args) {
      return extractType(args, ['td', 'th']).each(function(type) {
        switchCellType(editor.dom, getCellsFromSelection(editor), type, null)
      })
    }
    var setTableRowType = function(editor, args) {
      return extractType(args, ['header', 'body', 'footer']).each(function(
        type
      ) {
        map(getRowsFromSelection(editor), function(row) {
          return switchSectionType(editor, row, type)
        })
      })
    }
    var makeColumnHeader$1 = execute(makeColumnHeader, always, noop, lazyWire)
    var unmakeColumnHeader$1 = execute(
      unmakeColumnHeader,
      always,
      noop,
      lazyWire
    )
    var getTableRowType = function(editor) {
      var rows = getRowsFromSelection(editor)
      if (rows.length > 0) {
        var rowTypes = map(rows, function(r) {
          return getRowType(editor, r)
        })
        var hasHeader = contains(rowTypes, 'header')
        var hasFooter = contains(rowTypes, 'footer')
        if (!hasHeader && !hasFooter) {
          return 'body'
        } else {
          var hasBody = contains(rowTypes, 'body')
          if (hasHeader && !hasBody && !hasFooter) {
            return 'header'
          } else if (!hasHeader && !hasBody && hasFooter) {
            return 'footer'
          } else {
            return ''
          }
        }
      }
    }
    var getTableCellType = function(editor) {
      return getCellsType(getCellsFromSelection(editor), function(cell) {
        return getNodeName(cell) === 'th'
      }).getOr('')
    }
    var getTableColType = getColumnType
    return {
      deleteRow: deleteRow,
      deleteColumn: deleteColumn,
      insertRowsBefore: insertRowsBefore$1,
      insertRowsAfter: insertRowsAfter$1,
      insertColumnsBefore: insertColumnsBefore$1,
      insertColumnsAfter: insertColumnsAfter$1,
      mergeCells: mergeCells$1,
      unmergeCells: unmergeCells$1,
      pasteColsBefore: pasteColsBefore$1,
      pasteColsAfter: pasteColsAfter$1,
      pasteRowsBefore: pasteRowsBefore$1,
      pasteRowsAfter: pasteRowsAfter$1,
      pasteCells: pasteCells$1,
      setTableCellType: setTableCellType,
      setTableRowType: setTableRowType,
      makeColumnHeader: makeColumnHeader$1,
      unmakeColumnHeader: unmakeColumnHeader$1,
      getTableRowType: getTableRowType,
      getTableCellType: getTableCellType,
      getTableColType: getTableColType
    }
  }

  var DefaultRenderOptions = {
    styles: {
      'border-collapse': 'collapse',
      width: '100%'
    },
    attributes: { border: '1' }
  }
  var tableHeaderCell = function() {
    return Element.fromTag('th')
  }
  var tableCell = function() {
    return Element.fromTag('td')
  }
  var createRow = function(columns, rowHeaders, columnHeaders, rowIndex) {
    var tr = Element.fromTag('tr')
    for (var j = 0; j < columns; j++) {
      var td =
        rowIndex < rowHeaders || j < columnHeaders
          ? tableHeaderCell()
          : tableCell()
      if (j < columnHeaders) {
        set(td, 'scope', 'row')
      }
      if (rowIndex < rowHeaders) {
        set(td, 'scope', 'col')
      }
      append(td, Element.fromTag('br'))
      append(tr, td)
    }
    return tr
  }
  var createRows = function(rows, columns, rowHeaders, columnHeaders) {
    return range(rows, function(r) {
      return createRow(columns, rowHeaders, columnHeaders, r)
    })
  }
  var render$1 = function(
    rows,
    columns,
    rowHeaders,
    columnHeaders,
    headerType,
    renderOpts
  ) {
    if (renderOpts === void 0) {
      renderOpts = DefaultRenderOptions
    }
    var table = Element.fromTag('table')
    var rowHeadersGoInThead = headerType !== 'cells'
    setAll$1(table, renderOpts.styles)
    setAll(table, renderOpts.attributes)
    var actualRowHeaders = Math.min(rows, rowHeaders)
    if (rowHeadersGoInThead && rowHeaders > 0) {
      var thead = Element.fromTag('thead')
      append(table, thead)
      var theadRowHeaders = headerType === 'sectionCells' ? actualRowHeaders : 0
      var theadRows = createRows(
        rowHeaders,
        columns,
        theadRowHeaders,
        columnHeaders
      )
      append$1(thead, theadRows)
    }
    var tbody = Element.fromTag('tbody')
    append(table, tbody)
    var numRows = rowHeadersGoInThead ? rows - actualRowHeaders : rows
    var numRowHeaders = rowHeadersGoInThead ? 0 : rowHeaders
    var tbodyRows = createRows(numRows, columns, numRowHeaders, columnHeaders)
    append$1(tbody, tbodyRows)
    return table
  }

  var get$a = function(element) {
    return element.dom().innerHTML
  }
  var getOuter$2 = function(element) {
    var container = Element.fromTag('div')
    var clone = Element.fromDom(element.dom().cloneNode(true))
    append(container, clone)
    return get$a(container)
  }

  var placeCaretInCell = function(editor, cell) {
    editor.selection.select(cell.dom(), true)
    editor.selection.collapse(true)
  }
  var selectFirstCellInTable = function(editor, tableElm) {
    descendant$1(tableElm, 'td,th').each(curry(placeCaretInCell, editor))
  }
  var fireEvents = function(editor, table) {
    each(descendants$1(table, 'tr'), function(row) {
      fireNewRow(editor, row.dom())
      each(descendants$1(row, 'th,td'), function(cell) {
        fireNewCell(editor, cell.dom())
      })
    })
  }
  var isPercentage$1 = function(width) {
    return isString(width) && width.indexOf('%') !== -1
  }
  var insert = function(editor, columns, rows, colHeaders, rowHeaders) {
    var defaultStyles = getDefaultStyles(editor)
    var options = {
      styles: defaultStyles,
      attributes: getDefaultAttributes(editor)
    }
    var table = render$1(
      rows,
      columns,
      rowHeaders,
      colHeaders,
      getTableHeaderType(editor),
      options
    )
    set(table, 'data-mce-id', '__mce')
    var html = getOuter$2(table)
    editor.insertContent(html)
    return descendant$1(getBody$1(editor), 'table[data-mce-id="__mce"]')
      .map(function(table) {
        if (isPixelsForced(editor)) {
          enforcePixels(editor, table)
        } else if (isResponsiveForced(editor)) {
          enforceNone(table)
        } else if (
          isPercentagesForced(editor) ||
          isPercentage$1(defaultStyles.width)
        ) {
          enforcePercentage(editor, table)
        }
        removeDataStyle(table)
        remove(table, 'data-mce-id')
        fireEvents(editor, table)
        selectFirstCellInTable(editor, table)
        return table.dom()
      })
      .getOr(null)
  }
  var insertTableWithDataValidation = function(
    editor,
    rows,
    columns,
    options,
    errorMsg
  ) {
    if (options === void 0) {
      options = {}
    }
    var checkInput = function(val) {
      return isNumber(val) && val > 0
    }
    if (checkInput(rows) && checkInput(columns)) {
      var headerRows = options.headerRows || 0
      var headerColumns = options.headerColumns || 0
      return insert(editor, columns, rows, headerColumns, headerRows)
    } else {
      console.error(errorMsg)
      return null
    }
  }

  var getClipboardElements = function(getClipboard) {
    return function() {
      return getClipboard().fold(
        function() {
          return []
        },
        function(elems) {
          return map(elems, function(e) {
            return e.dom()
          })
        }
      )
    }
  }
  var setClipboardElements = function(setClipboard) {
    return function(elems) {
      var elmsOpt =
        elems.length > 0 ? Option.some(fromDom$1(elems)) : Option.none()
      setClipboard(elmsOpt)
    }
  }
  var getApi = function(editor, clipboard, resizeHandler, selectionTargets) {
    return {
      insertTable: function(columns, rows, options) {
        if (options === void 0) {
          options = {}
        }
        return insertTableWithDataValidation(
          editor,
          rows,
          columns,
          options,
          'Invalid values for insertTable - rows and columns values are required to insert a table.'
        )
      },
      setClipboardRows: setClipboardElements(clipboard.setRows),
      getClipboardRows: getClipboardElements(clipboard.getRows),
      setClipboardCols: setClipboardElements(clipboard.setColumns),
      getClipboardCols: getClipboardElements(clipboard.getColumns),
      resizeHandler: resizeHandler,
      selectionTargets: selectionTargets
    }
  }

  var constrainSpan = function(element, property, value) {
    var currentColspan = getSpan(element, property)
    if (value === 1 || currentColspan <= 1) {
      remove(element, property)
    } else {
      set(element, property, Math.min(value, currentColspan))
    }
  }
  var copyCols = function(table, target) {
    var house = Warehouse.fromTable(table)
    var details = onCells(house, target)
    return details.map(function(selectedCells) {
      var lastSelectedCell = selectedCells[selectedCells.length - 1]
      var minColRange = selectedCells[0].column()
      var maxColRange = lastSelectedCell.column() + lastSelectedCell.colspan()
      return map(house.all, function(row) {
        var cellsToCopy = filter(row.cells(), function(cell) {
          return cell.column() >= minColRange && cell.column() < maxColRange
        })
        var copiedCells = map(cellsToCopy, function(cell) {
          var clonedCell = deep(cell.element())
          constrainSpan(clonedCell, 'colspan', maxColRange - minColRange)
          return clonedCell
        })
        var fakeTR = Element.fromTag('tr')
        append$1(fakeTR, copiedCells)
        return fakeTR
      })
    })
  }

  var copyRows = function(table, target, generators) {
    var house = Warehouse.fromTable(table)
    var details = onCells(house, target)
    return details.map(function(selectedCells) {
      var grid = toGrid(house, generators, false)
      var slicedGrid = grid.slice(
        selectedCells[0].row(),
        selectedCells[selectedCells.length - 1].row() +
          selectedCells[selectedCells.length - 1].rowspan()
      )
      var slicedDetails = toDetailList(slicedGrid, generators)
      return copy$2(slicedDetails)
    })
  }

  var global$1 = tinymce.util.Tools.resolve('tinymce.util.Tools')

  var getTDTHOverallStyle = function(dom, elm, name) {
    var cells = dom.select('td,th', elm)
    var firstChildStyle
    var checkChildren = function(firstChildStyle, elms) {
      for (var i = 0; i < elms.length; i++) {
        var currentStyle = dom.getStyle(elms[i], name)
        if (typeof firstChildStyle === 'undefined') {
          firstChildStyle = currentStyle
        }
        if (firstChildStyle !== currentStyle) {
          return ''
        }
      }
      return firstChildStyle
    }
    return checkChildren(firstChildStyle, cells)
  }
  var applyAlign = function(editor, elm, name) {
    if (name) {
      editor.formatter.apply('align' + name, {}, elm)
    }
  }
  var applyVAlign = function(editor, elm, name) {
    if (name) {
      editor.formatter.apply('valign' + name, {}, elm)
    }
  }
  var unApplyAlign = function(editor, elm) {
    global$1.each('left center right'.split(' '), function(name) {
      editor.formatter.remove('align' + name, {}, elm)
    })
  }
  var unApplyVAlign = function(editor, elm) {
    global$1.each('top middle bottom'.split(' '), function(name) {
      editor.formatter.remove('valign' + name, {}, elm)
    })
  }

  var buildListItems = function(inputList, startItems) {
    var appendItems = function(values, acc) {
      return acc.concat(
        map(values, function(item) {
          return {
            text: item.text || item.title,
            value: item.value
          }
        })
      )
    }
    return appendItems(inputList, startItems || [])
  }
  var rgbToHex = function(dom) {
    return function(value) {
      return startsWith(value, 'rgb') ? dom.toHex(value) : value
    }
  }
  var extractAdvancedStyles = function(dom, elm) {
    var element = Element.fromDom(elm)
    return {
      borderwidth: getRaw(element, 'border-width').getOr(''),
      borderstyle: getRaw(element, 'border-style').getOr(''),
      bordercolor: getRaw(element, 'border-color')
        .map(rgbToHex(dom))
        .getOr(''),
      backgroundcolor: getRaw(element, 'background-color')
        .map(rgbToHex(dom))
        .getOr('')
    }
  }
  var getSharedValues = function(data) {
    var baseData = data[0]
    var comparisonData = data.slice(1)
    each(comparisonData, function(items) {
      each(keys(baseData), function(key) {
        each$1(items, function(itemValue, itemKey) {
          var comparisonValue = baseData[key]
          if (comparisonValue !== '' && key === itemKey) {
            if (comparisonValue !== itemValue) {
              baseData[key] = ''
            }
          }
        })
      })
    })
    return baseData
  }
  var getAdvancedTab = function(dialogName) {
    var advTabItems = [
      {
        name: 'borderstyle',
        type: 'selectbox',
        label: 'Border style',
        items: [
          {
            text: 'Select...',
            value: ''
          },
          {
            text: 'Solid',
            value: 'solid'
          },
          {
            text: 'Dotted',
            value: 'dotted'
          },
          {
            text: 'Dashed',
            value: 'dashed'
          },
          {
            text: 'Double',
            value: 'double'
          },
          {
            text: 'Groove',
            value: 'groove'
          },
          {
            text: 'Ridge',
            value: 'ridge'
          },
          {
            text: 'Inset',
            value: 'inset'
          },
          {
            text: 'Outset',
            value: 'outset'
          },
          {
            text: 'None',
            value: 'none'
          },
          {
            text: 'Hidden',
            value: 'hidden'
          }
        ]
      },
      {
        name: 'bordercolor',
        type: 'colorinput',
        label: 'Border color'
      },
      {
        name: 'backgroundcolor',
        type: 'colorinput',
        label: 'Background color'
      }
    ]
    var borderWidth = {
      name: 'borderwidth',
      type: 'input',
      label: 'Border width'
    }
    var items =
      dialogName === 'cell' ? [borderWidth].concat(advTabItems) : advTabItems
    return {
      title: 'Advanced',
      name: 'advanced',
      items: items
    }
  }
  var getAlignment = function(formats, formatName, editor, elm) {
    return find(formats, function(name) {
      return editor.formatter.matchNode(elm, formatName + name)
    }).getOr('')
  }
  var getHAlignment = curry(getAlignment, ['left', 'center', 'right'], 'align')
  var getVAlignment = curry(getAlignment, ['top', 'middle', 'bottom'], 'valign')
  var extractDataFromSettings = function(editor, hasAdvTableTab) {
    var style = getDefaultStyles(editor)
    var attrs = getDefaultAttributes(editor)
    var extractAdvancedStyleData = function(dom) {
      return {
        borderstyle: get(style, 'border-style').getOr(''),
        bordercolor: rgbToHex(dom)(get(style, 'border-color').getOr('')),
        backgroundcolor: rgbToHex(dom)(get(style, 'background-color').getOr(''))
      }
    }
    var defaultData = {
      height: '',
      width: '100%',
      cellspacing: '',
      cellpadding: '',
      caption: false,
      class: '',
      align: '',
      border: ''
    }
    var getBorder = function() {
      var borderWidth = style['border-width']
      if (shouldStyleWithCss(editor) && borderWidth) {
        return { border: borderWidth }
      }
      return get(attrs, 'border').fold(
        function() {
          return {}
        },
        function(border) {
          return { border: border }
        }
      )
    }
    var advStyle = hasAdvTableTab ? extractAdvancedStyleData(editor.dom) : {}
    var getCellPaddingCellSpacing = function() {
      var spacing = get(style, 'border-spacing')
        .or(get(attrs, 'cellspacing'))
        .fold(
          function() {
            return {}
          },
          function(cellspacing) {
            return { cellspacing: cellspacing }
          }
        )
      var padding = get(style, 'border-padding')
        .or(get(attrs, 'cellpadding'))
        .fold(
          function() {
            return {}
          },
          function(cellpadding) {
            return { cellpadding: cellpadding }
          }
        )
      return __assign(__assign({}, spacing), padding)
    }
    var data = __assign(
      __assign(
        __assign(
          __assign(__assign(__assign({}, defaultData), style), attrs),
          advStyle
        ),
        getBorder()
      ),
      getCellPaddingCellSpacing()
    )
    return data
  }
  var extractDataFromTableElement = function(editor, elm, hasAdvTableTab) {
    var getBorder = function(dom, elm) {
      var optBorderWidth = getRaw(Element.fromDom(elm), 'border-width')
      if (shouldStyleWithCss(editor) && optBorderWidth.isSome()) {
        return optBorderWidth.getOr('')
      }
      return (
        dom.getAttrib(elm, 'border') ||
        getTDTHOverallStyle(editor.dom, elm, 'border-width') ||
        getTDTHOverallStyle(editor.dom, elm, 'border')
      )
    }
    var dom = editor.dom
    return __assign(
      {
        width: dom.getStyle(elm, 'width') || dom.getAttrib(elm, 'width'),
        height: dom.getStyle(elm, 'height') || dom.getAttrib(elm, 'height'),
        cellspacing:
          dom.getStyle(elm, 'border-spacing') ||
          dom.getAttrib(elm, 'cellspacing'),
        cellpadding:
          dom.getAttrib(elm, 'cellpadding') ||
          getTDTHOverallStyle(editor.dom, elm, 'padding'),
        border: getBorder(dom, elm),
        caption: !!dom.select('caption', elm)[0],
        class: dom.getAttrib(elm, 'class', ''),
        align: getHAlignment(editor, elm)
      },
      hasAdvTableTab ? extractAdvancedStyles(dom, elm) : {}
    )
  }
  var extractDataFromRowElement = function(editor, elm, hasAdvancedRowTab) {
    var dom = editor.dom
    return __assign(
      {
        height: dom.getStyle(elm, 'height') || dom.getAttrib(elm, 'height'),
        scope: dom.getAttrib(elm, 'scope'),
        class: dom.getAttrib(elm, 'class', ''),
        type: getRowType(editor, elm),
        align: getHAlignment(editor, elm)
      },
      hasAdvancedRowTab ? extractAdvancedStyles(dom, elm) : {}
    )
  }
  var extractDataFromCellElement = function(editor, elm, hasAdvancedCellTab) {
    var dom = editor.dom
    return __assign(
      {
        width: dom.getStyle(elm, 'width') || dom.getAttrib(elm, 'width'),
        height: dom.getStyle(elm, 'height') || dom.getAttrib(elm, 'height'),
        scope: dom.getAttrib(elm, 'scope'),
        celltype: getNodeName(elm),
        class: dom.getAttrib(elm, 'class', ''),
        halign: getHAlignment(editor, elm),
        valign: getVAlignment(editor, elm)
      },
      hasAdvancedCellTab ? extractAdvancedStyles(dom, elm) : {}
    )
  }

  var getClassList = function(editor) {
    var classes = buildListItems(getCellClassList(editor))
    if (classes.length > 0) {
      return Option.some({
        name: 'class',
        type: 'selectbox',
        label: 'Class',
        items: classes
      })
    }
    return Option.none()
  }
  var children$3 = [
    {
      name: 'width',
      type: 'input',
      label: 'Width'
    },
    {
      name: 'height',
      type: 'input',
      label: 'Height'
    },
    {
      name: 'celltype',
      type: 'selectbox',
      label: 'Cell type',
      items: [
        {
          text: 'Cell',
          value: 'td'
        },
        {
          text: 'Header cell',
          value: 'th'
        }
      ]
    },
    {
      name: 'scope',
      type: 'selectbox',
      label: 'Scope',
      items: [
        {
          text: 'None',
          value: ''
        },
        {
          text: 'Row',
          value: 'row'
        },
        {
          text: 'Column',
          value: 'col'
        },
        {
          text: 'Row group',
          value: 'rowgroup'
        },
        {
          text: 'Column group',
          value: 'colgroup'
        }
      ]
    },
    {
      name: 'halign',
      type: 'selectbox',
      label: 'H Align',
      items: [
        {
          text: 'None',
          value: ''
        },
        {
          text: 'Left',
          value: 'left'
        },
        {
          text: 'Center',
          value: 'center'
        },
        {
          text: 'Right',
          value: 'right'
        }
      ]
    },
    {
      name: 'valign',
      type: 'selectbox',
      label: 'V Align',
      items: [
        {
          text: 'None',
          value: ''
        },
        {
          text: 'Top',
          value: 'top'
        },
        {
          text: 'Middle',
          value: 'middle'
        },
        {
          text: 'Bottom',
          value: 'bottom'
        }
      ]
    }
  ]
  var getItems = function(editor) {
    return getClassList(editor).fold(
      function() {
        return children$3
      },
      function(classlist) {
        return children$3.concat(classlist)
      }
    )
  }

  var modifiers = function(testTruthy) {
    return function(editor, node) {
      var dom = editor.dom
      var setAttrib = function(attr, value) {
        if (!testTruthy || value) {
          dom.setAttrib(node, attr, value)
        }
      }
      var setStyle = function(prop, value) {
        if (!testTruthy || value) {
          dom.setStyle(node, prop, value)
        }
      }
      var setFormat = function(formatName, value) {
        if (!testTruthy || value) {
          if (value === '') {
            editor.formatter.remove(formatName, { value: null }, node, true)
          } else {
            editor.formatter.apply(formatName, { value: value }, node)
          }
        }
      }
      return {
        setAttrib: setAttrib,
        setStyle: setStyle,
        setFormat: setFormat
      }
    }
  }
  var DomModifier = {
    normal: modifiers(false),
    ifTruthy: modifiers(true)
  }

  var updateSimpleProps = function(modifier, data) {
    modifier.setAttrib('scope', data.scope)
    modifier.setAttrib('class', data.class)
    modifier.setStyle('width', addPxSuffix(data.width))
    modifier.setStyle('height', addPxSuffix(data.height))
  }
  var updateAdvancedProps = function(modifier, data) {
    modifier.setFormat('tablecellbackgroundcolor', data.backgroundcolor)
    modifier.setFormat('tablecellbordercolor', data.bordercolor)
    modifier.setFormat('tablecellborderstyle', data.borderstyle)
    modifier.setFormat('tablecellborderwidth', addPxSuffix(data.borderwidth))
  }
  var applyCellData = function(editor, cells, data) {
    var dom = editor.dom
    var isSingleCell = cells.length === 1
    each(cells, function(cell) {
      var cellElm =
        data.celltype && getNodeName(cell) !== data.celltype
          ? dom.rename(cell, data.celltype)
          : cell
      var modifier = isSingleCell
        ? DomModifier.normal(editor, cellElm)
        : DomModifier.ifTruthy(editor, cellElm)
      updateSimpleProps(modifier, data)
      if (hasAdvancedCellTab(editor)) {
        updateAdvancedProps(modifier, data)
      }
      if (isSingleCell) {
        unApplyAlign(editor, cellElm)
        unApplyVAlign(editor, cellElm)
      }
      if (data.halign) {
        applyAlign(editor, cellElm, data.halign)
      }
      if (data.valign) {
        applyVAlign(editor, cellElm, data.valign)
      }
    })
  }
  var onSubmitCellForm = function(editor, cells, api) {
    var data = api.getData()
    api.close()
    editor.undoManager.transact(function() {
      applyCellData(editor, cells, data)
      editor.focus()
    })
  }
  var open = function(editor) {
    var cells = getCellsFromSelection(editor)
    if (cells.length === 0) {
      return
    }
    var cellsData = map(cells, function(cellElm) {
      return extractDataFromCellElement(
        editor,
        cellElm,
        hasAdvancedCellTab(editor)
      )
    })
    var data = getSharedValues(cellsData)
    var dialogTabPanel = {
      type: 'tabpanel',
      tabs: [
        {
          title: 'General',
          name: 'general',
          items: getItems(editor)
        },
        getAdvancedTab('cell')
      ]
    }
    var dialogPanel = {
      type: 'panel',
      items: [
        {
          type: 'grid',
          columns: 2,
          items: getItems(editor)
        }
      ]
    }
    editor.windowManager.open({
      title: 'Cell Properties',
      size: 'normal',
      body: hasAdvancedCellTab(editor) ? dialogTabPanel : dialogPanel,
      buttons: [
        {
          type: 'cancel',
          name: 'cancel',
          text: 'Cancel'
        },
        {
          type: 'submit',
          name: 'save',
          text: 'Save',
          primary: true
        }
      ],
      initialData: data,
      onSubmit: curry(onSubmitCellForm, editor, cells)
    })
  }

  var getClassList$1 = function(editor) {
    var classes = buildListItems(getRowClassList(editor))
    if (classes.length > 0) {
      return Option.some({
        name: 'class',
        type: 'selectbox',
        label: 'Class',
        items: classes
      })
    }
    return Option.none()
  }
  var formChildren = [
    {
      type: 'selectbox',
      name: 'type',
      label: 'Row type',
      items: [
        {
          text: 'Header',
          value: 'header'
        },
        {
          text: 'Body',
          value: 'body'
        },
        {
          text: 'Footer',
          value: 'footer'
        }
      ]
    },
    {
      type: 'selectbox',
      name: 'align',
      label: 'Alignment',
      items: [
        {
          text: 'None',
          value: ''
        },
        {
          text: 'Left',
          value: 'left'
        },
        {
          text: 'Center',
          value: 'center'
        },
        {
          text: 'Right',
          value: 'right'
        }
      ]
    },
    {
      label: 'Height',
      name: 'height',
      type: 'input'
    }
  ]
  var getItems$1 = function(editor) {
    return getClassList$1(editor).fold(
      function() {
        return formChildren
      },
      function(classes) {
        return formChildren.concat(classes)
      }
    )
  }

  var updateSimpleProps$1 = function(modifier, data) {
    modifier.setAttrib('scope', data.scope)
    modifier.setAttrib('class', data.class)
    modifier.setStyle('height', addPxSuffix(data.height))
  }
  var updateAdvancedProps$1 = function(modifier, data) {
    modifier.setStyle('background-color', data.backgroundcolor)
    modifier.setStyle('border-color', data.bordercolor)
    modifier.setStyle('border-style', data.borderstyle)
  }
  var applyRowData = function(editor, rows, oldData, data) {
    var isSingleRow = rows.length === 1
    each(rows, function(rowElm) {
      if (data.type !== getNodeName(rowElm.parentNode)) {
        switchSectionType(editor, rowElm, data.type)
      }
      var modifier = isSingleRow
        ? DomModifier.normal(editor, rowElm)
        : DomModifier.ifTruthy(editor, rowElm)
      updateSimpleProps$1(modifier, data)
      if (hasAdvancedRowTab(editor)) {
        updateAdvancedProps$1(modifier, data)
      }
      if (data.align !== oldData.align) {
        unApplyAlign(editor, rowElm)
        applyAlign(editor, rowElm, data.align)
      }
    })
  }
  var onSubmitRowForm = function(editor, rows, oldData, api) {
    var data = api.getData()
    api.close()
    editor.undoManager.transact(function() {
      applyRowData(editor, rows, oldData, data)
      editor.focus()
    })
  }
  var open$1 = function(editor) {
    var rows = getRowsFromSelection(editor)
    if (rows.length === 0) {
      return
    }
    var rowsData = map(rows, function(rowElm) {
      return extractDataFromRowElement(
        editor,
        rowElm,
        hasAdvancedRowTab(editor)
      )
    })
    var data = getSharedValues(rowsData)
    var dialogTabPanel = {
      type: 'tabpanel',
      tabs: [
        {
          title: 'General',
          name: 'general',
          items: getItems$1(editor)
        },
        getAdvancedTab('row')
      ]
    }
    var dialogPanel = {
      type: 'panel',
      items: [
        {
          type: 'grid',
          columns: 2,
          items: getItems$1(editor)
        }
      ]
    }
    editor.windowManager.open({
      title: 'Row Properties',
      size: 'normal',
      body: hasAdvancedRowTab(editor) ? dialogTabPanel : dialogPanel,
      buttons: [
        {
          type: 'cancel',
          name: 'cancel',
          text: 'Cancel'
        },
        {
          type: 'submit',
          name: 'save',
          text: 'Save',
          primary: true
        }
      ],
      initialData: data,
      onSubmit: curry(onSubmitRowForm, editor, rows, data)
    })
  }

  var global$2 = tinymce.util.Tools.resolve('tinymce.Env')

  var getItems$2 = function(editor, classes, insertNewTable) {
    var rowColCountItems = !insertNewTable
      ? []
      : [
          {
            type: 'input',
            name: 'cols',
            label: 'Cols',
            inputMode: 'numeric'
          },
          {
            type: 'input',
            name: 'rows',
            label: 'Rows',
            inputMode: 'numeric'
          }
        ]
    var alwaysItems = [
      {
        type: 'input',
        name: 'width',
        label: 'Width'
      },
      {
        type: 'input',
        name: 'height',
        label: 'Height'
      }
    ]
    var appearanceItems = hasAppearanceOptions(editor)
      ? [
          {
            type: 'input',
            name: 'cellspacing',
            label: 'Cell spacing',
            inputMode: 'numeric'
          },
          {
            type: 'input',
            name: 'cellpadding',
            label: 'Cell padding',
            inputMode: 'numeric'
          },
          {
            type: 'input',
            name: 'border',
            label: 'Border width'
          },
          {
            type: 'label',
            label: 'Caption',
            items: [
              {
                type: 'checkbox',
                name: 'caption',
                label: 'Show caption'
              }
            ]
          }
        ]
      : []
    var alignmentItem = [
      {
        type: 'selectbox',
        name: 'align',
        label: 'Alignment',
        items: [
          {
            text: 'None',
            value: ''
          },
          {
            text: 'Left',
            value: 'left'
          },
          {
            text: 'Center',
            value: 'center'
          },
          {
            text: 'Right',
            value: 'right'
          }
        ]
      }
    ]
    var classListItem =
      classes.length > 0
        ? [
            {
              type: 'selectbox',
              name: 'class',
              label: 'Class',
              items: classes
            }
          ]
        : []
    return rowColCountItems
      .concat(alwaysItems)
      .concat(appearanceItems)
      .concat(alignmentItem)
      .concat(classListItem)
  }

  var styleTDTH = function(dom, elm, name, value) {
    if (elm.tagName === 'TD' || elm.tagName === 'TH') {
      if (isString(name)) {
        dom.setStyle(elm, name, value)
      } else {
        dom.setStyle(elm, name)
      }
    } else {
      if (elm.children) {
        for (var i = 0; i < elm.children.length; i++) {
          styleTDTH(dom, elm.children[i], name, value)
        }
      }
    }
  }
  var applyDataToElement = function(editor, tableElm, data) {
    var dom = editor.dom
    var attrs = {}
    var styles = {}
    attrs.class = data.class
    styles.height = addPxSuffix(data.height)
    if (dom.getAttrib(tableElm, 'width') && !shouldStyleWithCss(editor)) {
      attrs.width = removePxSuffix(data.width)
    } else {
      styles.width = addPxSuffix(data.width)
    }
    if (shouldStyleWithCss(editor)) {
      styles['border-width'] = addPxSuffix(data.border)
      styles['border-spacing'] = addPxSuffix(data.cellspacing)
    } else {
      attrs.border = data.border
      attrs.cellpadding = data.cellpadding
      attrs.cellspacing = data.cellspacing
    }
    if (shouldStyleWithCss(editor) && tableElm.children) {
      for (var i = 0; i < tableElm.children.length; i++) {
        styleTDTH(dom, tableElm.children[i], {
          'border-width': addPxSuffix(data.border),
          padding: addPxSuffix(data.cellpadding)
        })
        if (hasAdvancedTableTab(editor)) {
          styleTDTH(dom, tableElm.children[i], {
            'border-color': data.bordercolor
          })
        }
      }
    }
    if (hasAdvancedTableTab(editor)) {
      styles['background-color'] = data.backgroundcolor
      styles['border-color'] = data.bordercolor
      styles['border-style'] = data.borderstyle
    }
    attrs.style = dom.serializeStyle(
      __assign(__assign({}, getDefaultStyles(editor)), styles)
    )
    dom.setAttribs(
      tableElm,
      __assign(__assign({}, getDefaultAttributes(editor)), attrs)
    )
  }
  var onSubmitTableForm = function(editor, tableElm, api) {
    var dom = editor.dom
    var captionElm
    var data = api.getData()
    api.close()
    if (data.class === '') {
      delete data.class
    }
    editor.undoManager.transact(function() {
      if (!tableElm) {
        var cols = parseInt(data.cols, 10) || 1
        var rows = parseInt(data.rows, 10) || 1
        tableElm = insert(editor, cols, rows, 0, 0)
      }
      applyDataToElement(editor, tableElm, data)
      captionElm = dom.select('caption', tableElm)[0]
      if (captionElm && !data.caption) {
        dom.remove(captionElm)
      }
      if (!captionElm && data.caption) {
        captionElm = dom.create('caption')
        captionElm.innerHTML = !global$2.ie ? '<br data-mce-bogus="1"/>' : nbsp
        tableElm.insertBefore(captionElm, tableElm.firstChild)
      }
      if (data.align === '') {
        unApplyAlign(editor, tableElm)
      } else {
        applyAlign(editor, tableElm, data.align)
      }
      editor.focus()
      editor.addVisual()
    })
  }
  var open$2 = function(editor, insertNewTable) {
    var dom = editor.dom
    var tableElm
    var data = extractDataFromSettings(editor, hasAdvancedTableTab(editor))
    if (insertNewTable === false) {
      tableElm = dom.getParent(editor.selection.getStart(), 'table')
      if (tableElm) {
        data = extractDataFromTableElement(
          editor,
          tableElm,
          hasAdvancedTableTab(editor)
        )
      } else {
        if (hasAdvancedTableTab(editor)) {
          data.borderstyle = ''
          data.bordercolor = ''
          data.backgroundcolor = ''
        }
      }
    } else {
      data.cols = '1'
      data.rows = '1'
      if (hasAdvancedTableTab(editor)) {
        data.borderstyle = ''
        data.bordercolor = ''
        data.backgroundcolor = ''
      }
    }
    var classes = buildListItems(getTableClassList(editor))
    if (classes.length > 0) {
      if (data.class) {
        data.class = data.class.replace(/\s*mce\-item\-table\s*/g, '')
      }
    }
    var generalPanel = {
      type: 'grid',
      columns: 2,
      items: getItems$2(editor, classes, insertNewTable)
    }
    var nonAdvancedForm = function() {
      return {
        type: 'panel',
        items: [generalPanel]
      }
    }
    var advancedForm = function() {
      return {
        type: 'tabpanel',
        tabs: [
          {
            title: 'General',
            name: 'general',
            items: [generalPanel]
          },
          getAdvancedTab('table')
        ]
      }
    }
    var dialogBody = hasAdvancedTableTab(editor)
      ? advancedForm()
      : nonAdvancedForm()
    editor.windowManager.open({
      title: 'Table Properties',
      size: 'normal',
      body: dialogBody,
      onSubmit: curry(onSubmitTableForm, editor, tableElm),
      buttons: [
        {
          type: 'cancel',
          name: 'cancel',
          text: 'Cancel'
        },
        {
          type: 'submit',
          name: 'save',
          text: 'Save',
          primary: true
        }
      ],
      initialData: data
    })
  }

  var registerCommands = function(
    editor,
    actions,
    cellSelection,
    selections,
    clipboard
  ) {
    var isRoot = getIsRoot(editor)
    var eraseTable = function() {
      return getSelectionStartCellOrCaption(editor).each(function(
        cellOrCaption
      ) {
        table(cellOrCaption, isRoot)
          .filter(not(isRoot))
          .each(function(table) {
            var cursor = Element.fromText('')
            after(table, cursor)
            remove$2(table)
            if (editor.dom.isEmpty(editor.getBody())) {
              editor.setContent('')
              editor.selection.setCursorLocation()
            } else {
              var rng = editor.dom.createRng()
              rng.setStart(cursor.dom(), 0)
              rng.setEnd(cursor.dom(), 0)
              editor.selection.setRng(rng)
              editor.nodeChanged()
            }
          })
      })
    }
    var setSizingMode = function(sizing) {
      return getSelectionStartCellOrCaption(editor).each(function(
        cellOrCaption
      ) {
        var isForcedSizing =
          isResponsiveForced(editor) ||
          isPixelsForced(editor) ||
          isPercentagesForced(editor)
        if (!isForcedSizing) {
          table(cellOrCaption, isRoot).each(function(table) {
            if (sizing === 'relative' && !isPercentSizing$1(table)) {
              enforcePercentage(editor, table)
            } else if (sizing === 'fixed' && !isPixelSizing$1(table)) {
              enforcePixels(editor, table)
            } else if (sizing === 'responsive' && !isNoneSizing$1(table)) {
              enforceNone(table)
            }
            removeDataStyle(table)
          })
        }
      })
    }
    var getTableFromCell = function(cell) {
      return table(cell, isRoot)
    }
    var actOnSelection = function(execute) {
      return getSelectionStartCell(editor).each(function(cell) {
        getTableFromCell(cell).each(function(table) {
          var targets = forMenu(selections, table, cell)
          execute(table, targets).each(function(rng) {
            editor.selection.setRng(rng)
            editor.focus()
            cellSelection.clear(table)
            removeDataStyle(table)
          })
        })
      })
    }
    var copyRowSelection = function() {
      return getSelectionStartCell(editor).map(function(cell) {
        return getTableFromCell(cell).bind(function(table) {
          var targets = forMenu(selections, table, cell)
          var generators = cellOperations(
            noop,
            Element.fromDom(editor.getDoc()),
            Option.none()
          )
          return copyRows(table, targets, generators)
        })
      })
    }
    var copyColSelection = function() {
      return getSelectionStartCell(editor).map(function(cell) {
        return getTableFromCell(cell).bind(function(table) {
          var targets = forMenu(selections, table, cell)
          return copyCols(table, targets)
        })
      })
    }
    var pasteOnSelection = function(execute, getRows) {
      return getRows().each(function(rows) {
        var clonedRows = map(rows, function(row) {
          return deep(row)
        })
        getSelectionStartCell(editor).each(function(cell) {
          return getTableFromCell(cell).each(function(table) {
            var generators = paste(Element.fromDom(editor.getDoc()))
            var targets = pasteRows(selections, cell, clonedRows, generators)
            execute(table, targets).each(function(rng) {
              editor.selection.setRng(rng)
              editor.focus()
              cellSelection.clear(table)
            })
          })
        })
      })
    }
    each$1(
      {
        mceTableSplitCells: function() {
          return actOnSelection(actions.unmergeCells)
        },
        mceTableMergeCells: function() {
          return actOnSelection(actions.mergeCells)
        },
        mceTableInsertRowBefore: function() {
          return actOnSelection(actions.insertRowsBefore)
        },
        mceTableInsertRowAfter: function() {
          return actOnSelection(actions.insertRowsAfter)
        },
        mceTableInsertColBefore: function() {
          return actOnSelection(actions.insertColumnsBefore)
        },
        mceTableInsertColAfter: function() {
          return actOnSelection(actions.insertColumnsAfter)
        },
        mceTableDeleteCol: function() {
          return actOnSelection(actions.deleteColumn)
        },
        mceTableDeleteRow: function() {
          return actOnSelection(actions.deleteRow)
        },
        mceTableCutCol: function(_grid) {
          return copyColSelection().each(function(selection) {
            clipboard.setColumns(selection)
            actOnSelection(actions.deleteColumn)
          })
        },
        mceTableCutRow: function(_grid) {
          return copyRowSelection().each(function(selection) {
            clipboard.setRows(selection)
            actOnSelection(actions.deleteRow)
          })
        },
        mceTableCopyCol: function(_grid) {
          return copyColSelection().each(function(selection) {
            return clipboard.setColumns(selection)
          })
        },
        mceTableCopyRow: function(_grid) {
          return copyRowSelection().each(function(selection) {
            return clipboard.setRows(selection)
          })
        },
        mceTablePasteColBefore: function(_grid) {
          return pasteOnSelection(actions.pasteColsBefore, clipboard.getColumns)
        },
        mceTablePasteColAfter: function(_grid) {
          return pasteOnSelection(actions.pasteColsAfter, clipboard.getColumns)
        },
        mceTablePasteRowBefore: function(_grid) {
          return pasteOnSelection(actions.pasteRowsBefore, clipboard.getRows)
        },
        mceTablePasteRowAfter: function(_grid) {
          return pasteOnSelection(actions.pasteRowsAfter, clipboard.getRows)
        },
        mceTableDelete: eraseTable,
        mceTableSizingMode: function(ui, sizing) {
          return setSizingMode(sizing)
        }
      },
      function(func, name) {
        return editor.addCommand(name, func)
      }
    )
    each$1(
      {
        mceTableCellType: function(_ui, args) {
          return actions.setTableCellType(editor, args)
        },
        mceTableRowType: function(_ui, args) {
          return actions.setTableRowType(editor, args)
        }
      },
      function(func, name) {
        return editor.addCommand(name, func)
      }
    )
    editor.addCommand('mceTableColType', function(_ui, args) {
      return get(args, 'type').each(function(type) {
        return actOnSelection(
          type === 'th' ? actions.makeColumnHeader : actions.unmakeColumnHeader
        )
      })
    })
    each$1(
      {
        mceTableProps: curry(open$2, editor, false),
        mceTableRowProps: curry(open$1, editor),
        mceTableCellProps: curry(open, editor)
      },
      function(func, name) {
        return editor.addCommand(name, function() {
          return func()
        })
      }
    )
    editor.addCommand('mceInsertTable', function(_ui, args) {
      if (isObject(args) && keys(args).length > 0) {
        insertTableWithDataValidation(
          editor,
          args.rows,
          args.columns,
          args.options,
          'Invalid values for mceInsertTable - rows and columns values are required to insert a table.'
        )
      } else {
        open$2(editor, true)
      }
    })
    editor.addCommand('mceTableApplyCellStyle', function(_ui, args) {
      if (!isObject(args)) {
        return
      }
      var cells = getCellsFromSelection(editor)
      if (cells.length === 0) {
        return
      }
      each$1(args, function(value, style) {
        var formatName = 'tablecell' + style.toLowerCase().replace('-', '')
        if (editor.formatter.has(formatName) && isString(value)) {
          each(cells, function(cell) {
            DomModifier.normal(editor, cell).setFormat(formatName, value)
          })
        }
      })
    })
  }

  var registerQueryCommands = function(editor, actions, selections) {
    var isRoot = getIsRoot(editor)
    var getTableFromCell = function(cell) {
      return table(cell, isRoot)
    }
    each$1(
      {
        mceTableRowType: function() {
          return actions.getTableRowType(editor)
        },
        mceTableCellType: function() {
          return actions.getTableCellType(editor)
        },
        mceTableColType: function() {
          return getSelectionStartCell(editor)
            .bind(function(cell) {
              return getTableFromCell(cell).map(function(table) {
                var targets = forMenu(selections, table, cell)
                return actions.getTableColType(table, targets)
              })
            })
            .getOr('')
        }
      },
      function(func, name) {
        return editor.addQueryValueHandler(name, func)
      }
    )
  }

  var Clipboard = function() {
    var rows = Cell(Option.none())
    var cols = Cell(Option.none())
    var clearClipboard = function(clipboard) {
      clipboard.set(Option.none())
    }
    return {
      getRows: rows.get,
      setRows: function(r) {
        rows.set(r)
        clearClipboard(cols)
      },
      clearRows: function() {
        return clearClipboard(rows)
      },
      getColumns: cols.get,
      setColumns: function(c) {
        cols.set(c)
        clearClipboard(rows)
      },
      clearColumns: function() {
        return clearClipboard(cols)
      }
    }
  }

  var adt$2 = Adt.generate([
    { none: ['current'] },
    { first: ['current'] },
    {
      middle: ['current', 'target']
    },
    { last: ['current'] }
  ])
  var none$2 = function(current) {
    if (current === void 0) {
      current = undefined
    }
    return adt$2.none(current)
  }
  var CellLocation = __assign(__assign({}, adt$2), { none: none$2 })

  var detect$4 = function(current, isRoot) {
    return table(current, isRoot).bind(function(table) {
      var all = cells(table)
      var index = findIndex(all, function(x) {
        return eq(current, x)
      })
      return index.map(function(index) {
        return {
          index: index,
          all: all
        }
      })
    })
  }
  var next = function(current, isRoot) {
    var detection = detect$4(current, isRoot)
    return detection.fold(
      function() {
        return CellLocation.none(current)
      },
      function(info) {
        return info.index + 1 < info.all.length
          ? CellLocation.middle(current, info.all[info.index + 1])
          : CellLocation.last(current)
      }
    )
  }
  var prev = function(current, isRoot) {
    var detection = detect$4(current, isRoot)
    return detection.fold(
      function() {
        return CellLocation.none()
      },
      function(info) {
        return info.index - 1 >= 0
          ? CellLocation.middle(current, info.all[info.index - 1])
          : CellLocation.first(current)
      }
    )
  }

  var create$2 = function(start, soffset, finish, foffset) {
    return {
      start: constant(start),
      soffset: constant(soffset),
      finish: constant(finish),
      foffset: constant(foffset)
    }
  }
  var SimRange = { create: create$2 }

  var adt$3 = Adt.generate([
    { before: ['element'] },
    {
      on: ['element', 'offset']
    },
    { after: ['element'] }
  ])
  var cata$1 = function(subject, onBefore, onOn, onAfter) {
    return subject.fold(onBefore, onOn, onAfter)
  }
  var getStart = function(situ) {
    return situ.fold(identity, identity, identity)
  }
  var before$2 = adt$3.before
  var on = adt$3.on
  var after$2 = adt$3.after
  var Situ = {
    before: before$2,
    on: on,
    after: after$2,
    cata: cata$1,
    getStart: getStart
  }

  var adt$4 = Adt.generate([
    { domRange: ['rng'] },
    {
      relative: ['startSitu', 'finishSitu']
    },
    {
      exact: ['start', 'soffset', 'finish', 'foffset']
    }
  ])
  var exactFromRange = function(simRange) {
    return adt$4.exact(
      simRange.start(),
      simRange.soffset(),
      simRange.finish(),
      simRange.foffset()
    )
  }
  var getStart$1 = function(selection) {
    return selection.match({
      domRange: function(rng) {
        return Element.fromDom(rng.startContainer)
      },
      relative: function(startSitu, _finishSitu) {
        return Situ.getStart(startSitu)
      },
      exact: function(start, _soffset, _finish, _foffset) {
        return start
      }
    })
  }
  var domRange = adt$4.domRange
  var relative = adt$4.relative
  var exact = adt$4.exact
  var getWin = function(selection) {
    var start = getStart$1(selection)
    return defaultView(start)
  }
  var range$1 = SimRange.create
  var Selection = {
    domRange: domRange,
    relative: relative,
    exact: exact,
    exactFromRange: exactFromRange,
    getWin: getWin,
    range: range$1
  }

  var selectNodeContents = function(win, element) {
    var rng = win.document.createRange()
    selectNodeContentsUsing(rng, element)
    return rng
  }
  var selectNodeContentsUsing = function(rng, element) {
    return rng.selectNodeContents(element.dom())
  }
  var setStart = function(rng, situ) {
    situ.fold(
      function(e) {
        rng.setStartBefore(e.dom())
      },
      function(e, o) {
        rng.setStart(e.dom(), o)
      },
      function(e) {
        rng.setStartAfter(e.dom())
      }
    )
  }
  var setFinish = function(rng, situ) {
    situ.fold(
      function(e) {
        rng.setEndBefore(e.dom())
      },
      function(e, o) {
        rng.setEnd(e.dom(), o)
      },
      function(e) {
        rng.setEndAfter(e.dom())
      }
    )
  }
  var relativeToNative = function(win, startSitu, finishSitu) {
    var range = win.document.createRange()
    setStart(range, startSitu)
    setFinish(range, finishSitu)
    return range
  }
  var exactToNative = function(win, start, soffset, finish, foffset) {
    var rng = win.document.createRange()
    rng.setStart(start.dom(), soffset)
    rng.setEnd(finish.dom(), foffset)
    return rng
  }
  var toRect = function(rect) {
    return {
      left: constant(rect.left),
      top: constant(rect.top),
      right: constant(rect.right),
      bottom: constant(rect.bottom),
      width: constant(rect.width),
      height: constant(rect.height)
    }
  }
  var getFirstRect = function(rng) {
    var rects = rng.getClientRects()
    var rect = rects.length > 0 ? rects[0] : rng.getBoundingClientRect()
    return rect.width > 0 || rect.height > 0
      ? Option.some(rect).map(toRect)
      : Option.none()
  }

  var adt$5 = Adt.generate([
    {
      ltr: ['start', 'soffset', 'finish', 'foffset']
    },
    {
      rtl: ['start', 'soffset', 'finish', 'foffset']
    }
  ])
  var fromRange = function(win, type, range) {
    return type(
      Element.fromDom(range.startContainer),
      range.startOffset,
      Element.fromDom(range.endContainer),
      range.endOffset
    )
  }
  var getRanges = function(win, selection) {
    return selection.match({
      domRange: function(rng) {
        return {
          ltr: constant(rng),
          rtl: Option.none
        }
      },
      relative: function(startSitu, finishSitu) {
        return {
          ltr: cached(function() {
            return relativeToNative(win, startSitu, finishSitu)
          }),
          rtl: cached(function() {
            return Option.some(relativeToNative(win, finishSitu, startSitu))
          })
        }
      },
      exact: function(start, soffset, finish, foffset) {
        return {
          ltr: cached(function() {
            return exactToNative(win, start, soffset, finish, foffset)
          }),
          rtl: cached(function() {
            return Option.some(
              exactToNative(win, finish, foffset, start, soffset)
            )
          })
        }
      }
    })
  }
  var doDiagnose = function(win, ranges) {
    var rng = ranges.ltr()
    if (rng.collapsed) {
      var reversed = ranges.rtl().filter(function(rev) {
        return rev.collapsed === false
      })
      return reversed
        .map(function(rev) {
          return adt$5.rtl(
            Element.fromDom(rev.endContainer),
            rev.endOffset,
            Element.fromDom(rev.startContainer),
            rev.startOffset
          )
        })
        .getOrThunk(function() {
          return fromRange(win, adt$5.ltr, rng)
        })
    } else {
      return fromRange(win, adt$5.ltr, rng)
    }
  }
  var diagnose = function(win, selection) {
    var ranges = getRanges(win, selection)
    return doDiagnose(win, ranges)
  }
  var asLtrRange = function(win, selection) {
    var diagnosis = diagnose(win, selection)
    return diagnosis.match({
      ltr: function(start, soffset, finish, foffset) {
        var rng = win.document.createRange()
        rng.setStart(start.dom(), soffset)
        rng.setEnd(finish.dom(), foffset)
        return rng
      },
      rtl: function(start, soffset, finish, foffset) {
        var rng = win.document.createRange()
        rng.setStart(finish.dom(), foffset)
        rng.setEnd(start.dom(), soffset)
        return rng
      }
    })
  }
  var ltr$2 = adt$5.ltr
  var rtl$2 = adt$5.rtl

  var searchForPoint = function(rectForOffset, x, y, maxX, length) {
    if (length === 0) {
      return 0
    } else if (x === maxX) {
      return length - 1
    }
    var xDelta = maxX
    for (var i = 1; i < length; i++) {
      var rect = rectForOffset(i)
      var curDeltaX = Math.abs(x - rect.left)
      if (y <= rect.bottom) {
        if (y < rect.top || curDeltaX > xDelta) {
          return i - 1
        } else {
          xDelta = curDeltaX
        }
      }
    }
    return 0
  }
  var inRect = function(rect, x, y) {
    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    )
  }

  var locateOffset = function(doc, textnode, x, y, rect) {
    var rangeForOffset = function(o) {
      var r = doc.dom().createRange()
      r.setStart(textnode.dom(), o)
      r.collapse(true)
      return r
    }
    var rectForOffset = function(o) {
      var r = rangeForOffset(o)
      return r.getBoundingClientRect()
    }
    var length = get$3(textnode).length
    var offset = searchForPoint(rectForOffset, x, y, rect.right, length)
    return rangeForOffset(offset)
  }
  var locate = function(doc, node, x, y) {
    var r = doc.dom().createRange()
    r.selectNode(node.dom())
    var rects = r.getClientRects()
    var foundRect = findMap(rects, function(rect) {
      return inRect(rect, x, y) ? Option.some(rect) : Option.none()
    })
    return foundRect.map(function(rect) {
      return locateOffset(doc, node, x, y, rect)
    })
  }

  var searchInChildren = function(doc, node, x, y) {
    var r = doc.dom().createRange()
    var nodes = children(node)
    return findMap(nodes, function(n) {
      r.selectNode(n.dom())
      return inRect(r.getBoundingClientRect(), x, y)
        ? locateNode(doc, n, x, y)
        : Option.none()
    })
  }
  var locateNode = function(doc, node, x, y) {
    return isText(node)
      ? locate(doc, node, x, y)
      : searchInChildren(doc, node, x, y)
  }
  var locate$1 = function(doc, node, x, y) {
    var r = doc.dom().createRange()
    r.selectNode(node.dom())
    var rect = r.getBoundingClientRect()
    var boundedX = Math.max(rect.left, Math.min(rect.right, x))
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y))
    return locateNode(doc, node, boundedX, boundedY)
  }

  var COLLAPSE_TO_LEFT = true
  var COLLAPSE_TO_RIGHT = false
  var getCollapseDirection = function(rect, x) {
    return x - rect.left < rect.right - x ? COLLAPSE_TO_LEFT : COLLAPSE_TO_RIGHT
  }
  var createCollapsedNode = function(doc, target, collapseDirection) {
    var r = doc.dom().createRange()
    r.selectNode(target.dom())
    r.collapse(collapseDirection)
    return r
  }
  var locateInElement = function(doc, node, x) {
    var cursorRange = doc.dom().createRange()
    cursorRange.selectNode(node.dom())
    var rect = cursorRange.getBoundingClientRect()
    var collapseDirection = getCollapseDirection(rect, x)
    var f = collapseDirection === COLLAPSE_TO_LEFT ? first : last$1
    return f(node).map(function(target) {
      return createCollapsedNode(doc, target, collapseDirection)
    })
  }
  var locateInEmpty = function(doc, node, x) {
    var rect = node.dom().getBoundingClientRect()
    var collapseDirection = getCollapseDirection(rect, x)
    return Option.some(createCollapsedNode(doc, node, collapseDirection))
  }
  var search = function(doc, node, x) {
    var f = children(node).length === 0 ? locateInEmpty : locateInElement
    return f(doc, node, x)
  }

  var caretPositionFromPoint = function(doc, x, y) {
    return Option.from(doc.dom().caretPositionFromPoint(x, y)).bind(function(
      pos
    ) {
      if (pos.offsetNode === null) {
        return Option.none()
      }
      var r = doc.dom().createRange()
      r.setStart(pos.offsetNode, pos.offset)
      r.collapse()
      return Option.some(r)
    })
  }
  var caretRangeFromPoint = function(doc, x, y) {
    return Option.from(doc.dom().caretRangeFromPoint(x, y))
  }
  var searchTextNodes = function(doc, node, x, y) {
    var r = doc.dom().createRange()
    r.selectNode(node.dom())
    var rect = r.getBoundingClientRect()
    var boundedX = Math.max(rect.left, Math.min(rect.right, x))
    var boundedY = Math.max(rect.top, Math.min(rect.bottom, y))
    return locate$1(doc, node, boundedX, boundedY)
  }
  var searchFromPoint = function(doc, x, y) {
    return Element.fromPoint(doc, x, y).bind(function(elem) {
      var fallback = function() {
        return search(doc, elem, x)
      }
      return children(elem).length === 0
        ? fallback()
        : searchTextNodes(doc, elem, x, y).orThunk(fallback)
    })
  }
  var availableSearch = document.caretPositionFromPoint
    ? caretPositionFromPoint
    : document.caretRangeFromPoint
    ? caretRangeFromPoint
    : searchFromPoint
  var fromPoint$1 = function(win, x, y) {
    var doc = Element.fromDom(win.document)
    return availableSearch(doc, x, y).map(function(rng) {
      return SimRange.create(
        Element.fromDom(rng.startContainer),
        rng.startOffset,
        Element.fromDom(rng.endContainer),
        rng.endOffset
      )
    })
  }

  var beforeSpecial = function(element, offset) {
    var name$1 = name(element)
    if ('input' === name$1) {
      return Situ.after(element)
    } else if (!contains(['br', 'img'], name$1)) {
      return Situ.on(element, offset)
    } else {
      return offset === 0 ? Situ.before(element) : Situ.after(element)
    }
  }
  var preprocessRelative = function(startSitu, finishSitu) {
    var start = startSitu.fold(Situ.before, beforeSpecial, Situ.after)
    var finish = finishSitu.fold(Situ.before, beforeSpecial, Situ.after)
    return Selection.relative(start, finish)
  }
  var preprocessExact = function(start, soffset, finish, foffset) {
    var startSitu = beforeSpecial(start, soffset)
    var finishSitu = beforeSpecial(finish, foffset)
    return Selection.relative(startSitu, finishSitu)
  }
  var preprocess = function(selection) {
    return selection.match({
      domRange: function(rng) {
        var start = Element.fromDom(rng.startContainer)
        var finish = Element.fromDom(rng.endContainer)
        return preprocessExact(start, rng.startOffset, finish, rng.endOffset)
      },
      relative: preprocessRelative,
      exact: preprocessExact
    })
  }

  var makeRange = function(start, soffset, finish, foffset) {
    var doc = owner(start)
    var rng = doc.dom().createRange()
    rng.setStart(start.dom(), soffset)
    rng.setEnd(finish.dom(), foffset)
    return rng
  }
  var after$3 = function(start, soffset, finish, foffset) {
    var r = makeRange(start, soffset, finish, foffset)
    var same = eq(start, finish) && soffset === foffset
    return r.collapsed && !same
  }

  var doSetNativeRange = function(win, rng) {
    Option.from(win.getSelection()).each(function(selection) {
      selection.removeAllRanges()
      selection.addRange(rng)
    })
  }
  var doSetRange = function(win, start, soffset, finish, foffset) {
    var rng = exactToNative(win, start, soffset, finish, foffset)
    doSetNativeRange(win, rng)
  }
  var setLegacyRtlRange = function(
    win,
    selection,
    start,
    soffset,
    finish,
    foffset
  ) {
    selection.collapse(start.dom(), soffset)
    selection.extend(finish.dom(), foffset)
  }
  var setRangeFromRelative = function(win, relative) {
    return diagnose(win, relative).match({
      ltr: function(start, soffset, finish, foffset) {
        doSetRange(win, start, soffset, finish, foffset)
      },
      rtl: function(start, soffset, finish, foffset) {
        var selection = win.getSelection()
        if (selection.setBaseAndExtent) {
          selection.setBaseAndExtent(
            start.dom(),
            soffset,
            finish.dom(),
            foffset
          )
        } else if (selection.extend) {
          try {
            setLegacyRtlRange(win, selection, start, soffset, finish, foffset)
          } catch (e) {
            doSetRange(win, finish, foffset, start, soffset)
          }
        } else {
          doSetRange(win, finish, foffset, start, soffset)
        }
      }
    })
  }
  var setExact = function(win, start, soffset, finish, foffset) {
    var relative = preprocessExact(start, soffset, finish, foffset)
    setRangeFromRelative(win, relative)
  }
  var setRelative = function(win, startSitu, finishSitu) {
    var relative = preprocessRelative(startSitu, finishSitu)
    setRangeFromRelative(win, relative)
  }
  var toNative = function(selection) {
    var win = Selection.getWin(selection).dom()
    var getDomRange = function(start, soffset, finish, foffset) {
      return exactToNative(win, start, soffset, finish, foffset)
    }
    var filtered = preprocess(selection)
    return diagnose(win, filtered).match({
      ltr: getDomRange,
      rtl: getDomRange
    })
  }
  var readRange = function(selection) {
    if (selection.rangeCount > 0) {
      var firstRng = selection.getRangeAt(0)
      var lastRng = selection.getRangeAt(selection.rangeCount - 1)
      return Option.some(
        SimRange.create(
          Element.fromDom(firstRng.startContainer),
          firstRng.startOffset,
          Element.fromDom(lastRng.endContainer),
          lastRng.endOffset
        )
      )
    } else {
      return Option.none()
    }
  }
  var doGetExact = function(selection) {
    var anchor = Element.fromDom(selection.anchorNode)
    var focus = Element.fromDom(selection.focusNode)
    return after$3(anchor, selection.anchorOffset, focus, selection.focusOffset)
      ? Option.some(
          SimRange.create(
            anchor,
            selection.anchorOffset,
            focus,
            selection.focusOffset
          )
        )
      : readRange(selection)
  }
  var setToElement = function(win, element) {
    var rng = selectNodeContents(win, element)
    doSetNativeRange(win, rng)
  }
  var getExact = function(win) {
    return Option.from(win.getSelection())
      .filter(function(sel) {
        return sel.rangeCount > 0
      })
      .bind(doGetExact)
  }
  var get$b = function(win) {
    return getExact(win).map(function(range) {
      return Selection.exact(
        range.start(),
        range.soffset(),
        range.finish(),
        range.foffset()
      )
    })
  }
  var getFirstRect$1 = function(win, selection) {
    var rng = asLtrRange(win, selection)
    return getFirstRect(rng)
  }
  var getAtPoint = function(win, x, y) {
    return fromPoint$1(win, x, y)
  }
  var clear = function(win) {
    var selection = win.getSelection()
    selection.removeAllRanges()
  }

  var global$3 = tinymce.util.Tools.resolve('tinymce.util.VK')

  var forward = function(editor, isRoot, cell, lazyWire) {
    return go(editor, isRoot, next(cell), lazyWire)
  }
  var backward = function(editor, isRoot, cell, lazyWire) {
    return go(editor, isRoot, prev(cell), lazyWire)
  }
  var getCellFirstCursorPosition = function(editor, cell) {
    var selection = Selection.exact(cell, 0, cell, 0)
    return toNative(selection)
  }
  var getNewRowCursorPosition = function(editor, table) {
    var rows = descendants$1(table, 'tr')
    return last(rows).bind(function(last) {
      return descendant$1(last, 'td,th').map(function(first) {
        return getCellFirstCursorPosition(editor, first)
      })
    })
  }
  var go = function(editor, isRoot, cell, actions, _lazyWire) {
    return cell.fold(
      Option.none,
      Option.none,
      function(current, next) {
        return first(next).map(function(cell) {
          return getCellFirstCursorPosition(editor, cell)
        })
      },
      function(current) {
        return table(current, isRoot).bind(function(table) {
          var targets = noMenu(current)
          editor.undoManager.transact(function() {
            actions.insertRowsAfter(table, targets)
          })
          return getNewRowCursorPosition(editor, table)
        })
      }
    )
  }
  var rootElements = ['table', 'li', 'dl']
  var handle$1 = function(event, editor, actions, lazyWire) {
    if (event.keyCode === global$3.TAB) {
      var body_1 = getBody$1(editor)
      var isRoot_1 = function(element) {
        var name$1 = name(element)
        return eq(element, body_1) || contains(rootElements, name$1)
      }
      var rng = editor.selection.getRng()
      if (rng.collapsed) {
        var start = Element.fromDom(rng.startContainer)
        cell(start, isRoot_1).each(function(cell) {
          event.preventDefault()
          var navigation = event.shiftKey ? backward : forward
          var rng = navigation(editor, isRoot_1, cell, actions, lazyWire)
          rng.each(function(range) {
            editor.selection.setRng(range)
          })
        })
      }
    }
  }

  var create$3 = function(selection, kill) {
    return {
      selection: constant(selection),
      kill: constant(kill)
    }
  }
  var Response = { create: create$3 }

  var create$4 = function(start, soffset, finish, foffset) {
    return {
      start: constant(Situ.on(start, soffset)),
      finish: constant(Situ.on(finish, foffset))
    }
  }
  var Situs = { create: create$4 }

  var convertToRange = function(win, selection) {
    var rng = asLtrRange(win, selection)
    return SimRange.create(
      Element.fromDom(rng.startContainer),
      rng.startOffset,
      Element.fromDom(rng.endContainer),
      rng.endOffset
    )
  }
  var makeSitus = Situs.create

  var sync = function(
    container,
    isRoot,
    start,
    soffset,
    finish,
    foffset,
    selectRange
  ) {
    if (!(eq(start, finish) && soffset === foffset)) {
      return closest$1(start, 'td,th', isRoot).bind(function(s) {
        return closest$1(finish, 'td,th', isRoot).bind(function(f) {
          return detect$5(container, isRoot, s, f, selectRange)
        })
      })
    } else {
      return Option.none()
    }
  }
  var detect$5 = function(container, isRoot, start, finish, selectRange) {
    if (!eq(start, finish)) {
      return identify(start, finish, isRoot).bind(function(cellSel) {
        var boxes = cellSel.boxes.getOr([])
        if (boxes.length > 0) {
          selectRange(container, boxes, cellSel.start, cellSel.finish)
          return Option.some(
            Response.create(
              Option.some(makeSitus(start, 0, start, getEnd(start))),
              true
            )
          )
        } else {
          return Option.none()
        }
      })
    } else {
      return Option.none()
    }
  }
  var update = function(rows, columns, container, selected, annotations) {
    var updateSelection = function(newSels) {
      annotations.clearBeforeUpdate(container)
      annotations.selectRange(
        container,
        newSels.boxes,
        newSels.start,
        newSels.finish
      )
      return newSels.boxes
    }
    return shiftSelection(
      selected,
      rows,
      columns,
      annotations.firstSelectedSelector,
      annotations.lastSelectedSelector
    ).map(updateSelection)
  }

  var traverse = function(item, mode) {
    return {
      item: constant(item),
      mode: constant(mode)
    }
  }
  var backtrack = function(universe, item, _direction, transition) {
    if (transition === void 0) {
      transition = sidestep
    }
    return universe
      .property()
      .parent(item)
      .map(function(p) {
        return traverse(p, transition)
      })
  }
  var sidestep = function(universe, item, direction, transition) {
    if (transition === void 0) {
      transition = advance
    }
    return direction.sibling(universe, item).map(function(p) {
      return traverse(p, transition)
    })
  }
  var advance = function(universe, item, direction, transition) {
    if (transition === void 0) {
      transition = advance
    }
    var children = universe.property().children(item)
    var result = direction.first(children)
    return result.map(function(r) {
      return traverse(r, transition)
    })
  }
  var successors = [
    {
      current: backtrack,
      next: sidestep,
      fallback: Option.none()
    },
    {
      current: sidestep,
      next: advance,
      fallback: Option.some(backtrack)
    },
    {
      current: advance,
      next: advance,
      fallback: Option.some(sidestep)
    }
  ]
  var go$1 = function(universe, item, mode, direction, rules) {
    if (rules === void 0) {
      rules = successors
    }
    var ruleOpt = find(rules, function(succ) {
      return succ.current === mode
    })
    return ruleOpt.bind(function(rule) {
      return rule
        .current(universe, item, direction, rule.next)
        .orThunk(function() {
          return rule.fallback.bind(function(fb) {
            return go$1(universe, item, fb, direction)
          })
        })
    })
  }

  var left = function() {
    var sibling = function(universe, item) {
      return universe.query().prevSibling(item)
    }
    var first = function(children) {
      return children.length > 0
        ? Option.some(children[children.length - 1])
        : Option.none()
    }
    return {
      sibling: sibling,
      first: first
    }
  }
  var right = function() {
    var sibling = function(universe, item) {
      return universe.query().nextSibling(item)
    }
    var first = function(children) {
      return children.length > 0 ? Option.some(children[0]) : Option.none()
    }
    return {
      sibling: sibling,
      first: first
    }
  }
  var Walkers = {
    left: left,
    right: right
  }

  var hone = function(universe, item, predicate, mode, direction, isRoot) {
    var next = go$1(universe, item, mode, direction)
    return next.bind(function(n) {
      if (isRoot(n.item())) {
        return Option.none()
      } else {
        return predicate(n.item())
          ? Option.some(n.item())
          : hone(universe, n.item(), predicate, n.mode(), direction, isRoot)
      }
    })
  }
  var left$1 = function(universe, item, predicate, isRoot) {
    return hone(universe, item, predicate, sidestep, Walkers.left(), isRoot)
  }
  var right$1 = function(universe, item, predicate, isRoot) {
    return hone(universe, item, predicate, sidestep, Walkers.right(), isRoot)
  }

  var isLeaf = function(universe) {
    return function(element) {
      return universe.property().children(element).length === 0
    }
  }
  var before$3 = function(universe, item, isRoot) {
    return seekLeft(universe, item, isLeaf(universe), isRoot)
  }
  var after$4 = function(universe, item, isRoot) {
    return seekRight(universe, item, isLeaf(universe), isRoot)
  }
  var seekLeft = left$1
  var seekRight = right$1

  var universe$3 = DomUniverse()
  var before$4 = function(element, isRoot) {
    return before$3(universe$3, element, isRoot)
  }
  var after$5 = function(element, isRoot) {
    return after$4(universe$3, element, isRoot)
  }
  var seekLeft$1 = function(element, predicate, isRoot) {
    return seekLeft(universe$3, element, predicate, isRoot)
  }
  var seekRight$1 = function(element, predicate, isRoot) {
    return seekRight(universe$3, element, predicate, isRoot)
  }

  var ancestor$2 = function(scope, predicate, isRoot) {
    return ancestor(scope, predicate, isRoot).isSome()
  }

  var adt$6 = Adt.generate([
    { none: ['message'] },
    { success: [] },
    { failedUp: ['cell'] },
    { failedDown: ['cell'] }
  ])
  var isOverlapping = function(bridge, before, after) {
    var beforeBounds = bridge.getRect(before)
    var afterBounds = bridge.getRect(after)
    return (
      afterBounds.right > beforeBounds.left &&
      afterBounds.left < beforeBounds.right
    )
  }
  var isRow = function(elem) {
    return closest$1(elem, 'tr')
  }
  var verify = function(
    bridge,
    before,
    beforeOffset,
    after,
    afterOffset,
    failure,
    isRoot
  ) {
    return closest$1(after, 'td,th', isRoot)
      .bind(function(afterCell) {
        return closest$1(before, 'td,th', isRoot).map(function(beforeCell) {
          if (!eq(afterCell, beforeCell)) {
            return sharedOne$1(isRow, [afterCell, beforeCell]).fold(
              function() {
                return isOverlapping(bridge, beforeCell, afterCell)
                  ? adt$6.success()
                  : failure(beforeCell)
              },
              function(_sharedRow) {
                return failure(beforeCell)
              }
            )
          } else {
            return eq(after, afterCell) && getEnd(afterCell) === afterOffset
              ? failure(beforeCell)
              : adt$6.none('in same cell')
          }
        })
      })
      .getOr(adt$6.none('default'))
  }
  var cata$2 = function(subject, onNone, onSuccess, onFailedUp, onFailedDown) {
    return subject.fold(onNone, onSuccess, onFailedUp, onFailedDown)
  }
  var BeforeAfter = __assign(__assign({}, adt$6), {
    verify: verify,
    cata: cata$2
  })

  var inParent = function(parent, children, element, index) {
    return {
      parent: constant(parent),
      children: constant(children),
      element: constant(element),
      index: constant(index)
    }
  }
  var indexInParent = function(element) {
    return parent(element).bind(function(parent) {
      var children$1 = children(parent)
      return indexOf(children$1, element).map(function(index) {
        return inParent(parent, children$1, element, index)
      })
    })
  }
  var indexOf = function(elements, element) {
    return findIndex(elements, curry(eq, element))
  }

  var isBr = function(elem) {
    return name(elem) === 'br'
  }
  var gatherer = function(cand, gather, isRoot) {
    return gather(cand, isRoot).bind(function(target) {
      return isText(target) && get$3(target).trim().length === 0
        ? gatherer(target, gather, isRoot)
        : Option.some(target)
    })
  }
  var handleBr = function(isRoot, element, direction) {
    return direction
      .traverse(element)
      .orThunk(function() {
        return gatherer(element, direction.gather, isRoot)
      })
      .map(direction.relative)
  }
  var findBr = function(element, offset) {
    return child(element, offset)
      .filter(isBr)
      .orThunk(function() {
        return child(element, offset - 1).filter(isBr)
      })
  }
  var handleParent = function(isRoot, element, offset, direction) {
    return findBr(element, offset).bind(function(br) {
      return direction.traverse(br).fold(
        function() {
          return gatherer(br, direction.gather, isRoot).map(direction.relative)
        },
        function(adjacent) {
          return indexInParent(adjacent).map(function(info) {
            return Situ.on(info.parent(), info.index())
          })
        }
      )
    })
  }
  var tryBr = function(isRoot, element, offset, direction) {
    var target = isBr(element)
      ? handleBr(isRoot, element, direction)
      : handleParent(isRoot, element, offset, direction)
    return target.map(function(tgt) {
      return {
        start: constant(tgt),
        finish: constant(tgt)
      }
    })
  }
  var process = function(analysis) {
    return BeforeAfter.cata(
      analysis,
      function(_message) {
        return Option.none()
      },
      function() {
        return Option.none()
      },
      function(cell) {
        return Option.some(point(cell, 0))
      },
      function(cell) {
        return Option.some(point(cell, getEnd(cell)))
      }
    )
  }

  var moveDown = function(caret, amount) {
    return {
      left: caret.left,
      top: caret.top + amount,
      right: caret.right,
      bottom: caret.bottom + amount
    }
  }
  var moveUp = function(caret, amount) {
    return {
      left: caret.left,
      top: caret.top - amount,
      right: caret.right,
      bottom: caret.bottom - amount
    }
  }
  var translate = function(caret, xDelta, yDelta) {
    return {
      left: caret.left + xDelta,
      top: caret.top + yDelta,
      right: caret.right + xDelta,
      bottom: caret.bottom + yDelta
    }
  }
  var getTop$1 = function(caret) {
    return caret.top
  }
  var getBottom = function(caret) {
    return caret.bottom
  }

  var getPartialBox = function(bridge, element, offset) {
    if (offset >= 0 && offset < getEnd(element)) {
      return bridge.getRangedRect(element, offset, element, offset + 1)
    } else if (offset > 0) {
      return bridge.getRangedRect(element, offset - 1, element, offset)
    }
    return Option.none()
  }
  var toCaret = function(rect) {
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom
    }
  }
  var getElemBox = function(bridge, element) {
    return Option.some(bridge.getRect(element))
  }
  var getBoxAt = function(bridge, element, offset) {
    if (isElement(element)) {
      return getElemBox(bridge, element).map(toCaret)
    } else if (isText(element)) {
      return getPartialBox(bridge, element, offset).map(toCaret)
    } else {
      return Option.none()
    }
  }
  var getEntireBox = function(bridge, element) {
    if (isElement(element)) {
      return getElemBox(bridge, element).map(toCaret)
    } else if (isText(element)) {
      return bridge
        .getRangedRect(element, 0, element, getEnd(element))
        .map(toCaret)
    } else {
      return Option.none()
    }
  }

  var JUMP_SIZE = 5
  var NUM_RETRIES = 100
  var adt$7 = Adt.generate([{ none: [] }, { retry: ['caret'] }])
  var isOutside = function(caret, box) {
    return (
      caret.left < box.left ||
      Math.abs(box.right - caret.left) < 1 ||
      caret.left > box.right
    )
  }
  var inOutsideBlock = function(bridge, element, caret) {
    return closest(element, isBlock$1).fold(constant(false), function(cell) {
      return getEntireBox(bridge, cell).exists(function(box) {
        return isOutside(caret, box)
      })
    })
  }
  var adjustDown = function(bridge, element, guessBox, original, caret) {
    var lowerCaret = moveDown(caret, JUMP_SIZE)
    if (Math.abs(guessBox.bottom - original.bottom) < 1) {
      return adt$7.retry(lowerCaret)
    } else if (guessBox.top > caret.bottom) {
      return adt$7.retry(lowerCaret)
    } else if (guessBox.top === caret.bottom) {
      return adt$7.retry(moveDown(caret, 1))
    } else {
      return inOutsideBlock(bridge, element, caret)
        ? adt$7.retry(translate(lowerCaret, JUMP_SIZE, 0))
        : adt$7.none()
    }
  }
  var adjustUp = function(bridge, element, guessBox, original, caret) {
    var higherCaret = moveUp(caret, JUMP_SIZE)
    if (Math.abs(guessBox.top - original.top) < 1) {
      return adt$7.retry(higherCaret)
    } else if (guessBox.bottom < caret.top) {
      return adt$7.retry(higherCaret)
    } else if (guessBox.bottom === caret.top) {
      return adt$7.retry(moveUp(caret, 1))
    } else {
      return inOutsideBlock(bridge, element, caret)
        ? adt$7.retry(translate(higherCaret, JUMP_SIZE, 0))
        : adt$7.none()
    }
  }
  var upMovement = {
    point: getTop$1,
    adjuster: adjustUp,
    move: moveUp,
    gather: before$4
  }
  var downMovement = {
    point: getBottom,
    adjuster: adjustDown,
    move: moveDown,
    gather: after$5
  }
  var isAtTable = function(bridge, x, y) {
    return bridge
      .elementFromPoint(x, y)
      .filter(function(elm) {
        return name(elm) === 'table'
      })
      .isSome()
  }
  var adjustForTable = function(bridge, movement, original, caret, numRetries) {
    return adjustTil(
      bridge,
      movement,
      original,
      movement.move(caret, JUMP_SIZE),
      numRetries
    )
  }
  var adjustTil = function(bridge, movement, original, caret, numRetries) {
    if (numRetries === 0) {
      return Option.some(caret)
    }
    if (isAtTable(bridge, caret.left, movement.point(caret))) {
      return adjustForTable(bridge, movement, original, caret, numRetries - 1)
    }
    return bridge
      .situsFromPoint(caret.left, movement.point(caret))
      .bind(function(guess) {
        return guess.start().fold(
          Option.none,
          function(element) {
            return getEntireBox(bridge, element)
              .bind(function(guessBox) {
                return movement
                  .adjuster(bridge, element, guessBox, original, caret)
                  .fold(Option.none, function(newCaret) {
                    return adjustTil(
                      bridge,
                      movement,
                      original,
                      newCaret,
                      numRetries - 1
                    )
                  })
              })
              .orThunk(function() {
                return Option.some(caret)
              })
          },
          Option.none
        )
      })
  }
  var ieTryDown = function(bridge, caret) {
    return bridge.situsFromPoint(caret.left, caret.bottom + JUMP_SIZE)
  }
  var ieTryUp = function(bridge, caret) {
    return bridge.situsFromPoint(caret.left, caret.top - JUMP_SIZE)
  }
  var checkScroll = function(movement, adjusted, bridge) {
    if (movement.point(adjusted) > bridge.getInnerHeight()) {
      return Option.some(movement.point(adjusted) - bridge.getInnerHeight())
    } else if (movement.point(adjusted) < 0) {
      return Option.some(-movement.point(adjusted))
    } else {
      return Option.none()
    }
  }
  var retry = function(movement, bridge, caret) {
    var moved = movement.move(caret, JUMP_SIZE)
    var adjusted = adjustTil(bridge, movement, caret, moved, NUM_RETRIES).getOr(
      moved
    )
    return checkScroll(movement, adjusted, bridge).fold(
      function() {
        return bridge.situsFromPoint(adjusted.left, movement.point(adjusted))
      },
      function(delta) {
        bridge.scrollBy(0, delta)
        return bridge.situsFromPoint(
          adjusted.left,
          movement.point(adjusted) - delta
        )
      }
    )
  }
  var Retries = {
    tryUp: curry(retry, upMovement),
    tryDown: curry(retry, downMovement),
    ieTryUp: ieTryUp,
    ieTryDown: ieTryDown,
    getJumpSize: constant(JUMP_SIZE)
  }

  var MAX_RETRIES = 20
  var findSpot = function(bridge, isRoot, direction) {
    return bridge.getSelection().bind(function(sel) {
      return tryBr(isRoot, sel.finish(), sel.foffset(), direction).fold(
        function() {
          return Option.some(point(sel.finish(), sel.foffset()))
        },
        function(brNeighbour) {
          var range = bridge.fromSitus(brNeighbour)
          var analysis = BeforeAfter.verify(
            bridge,
            sel.finish(),
            sel.foffset(),
            range.finish(),
            range.foffset(),
            direction.failure,
            isRoot
          )
          return process(analysis)
        }
      )
    })
  }
  var scan$1 = function(
    bridge,
    isRoot,
    element,
    offset,
    direction,
    numRetries
  ) {
    if (numRetries === 0) {
      return Option.none()
    }
    return tryCursor(bridge, isRoot, element, offset, direction).bind(function(
      situs
    ) {
      var range = bridge.fromSitus(situs)
      var analysis = BeforeAfter.verify(
        bridge,
        element,
        offset,
        range.finish(),
        range.foffset(),
        direction.failure,
        isRoot
      )
      return BeforeAfter.cata(
        analysis,
        function() {
          return Option.none()
        },
        function() {
          return Option.some(situs)
        },
        function(cell) {
          if (eq(element, cell) && offset === 0) {
            return tryAgain(bridge, element, offset, moveUp, direction)
          } else {
            return scan$1(bridge, isRoot, cell, 0, direction, numRetries - 1)
          }
        },
        function(cell) {
          if (eq(element, cell) && offset === getEnd(cell)) {
            return tryAgain(bridge, element, offset, moveDown, direction)
          } else {
            return scan$1(
              bridge,
              isRoot,
              cell,
              getEnd(cell),
              direction,
              numRetries - 1
            )
          }
        }
      )
    })
  }
  var tryAgain = function(bridge, element, offset, move, direction) {
    return getBoxAt(bridge, element, offset).bind(function(box) {
      return tryAt(bridge, direction, move(box, Retries.getJumpSize()))
    })
  }
  var tryAt = function(bridge, direction, box) {
    var browser = detect$3().browser
    if (
      browser.isChrome() ||
      browser.isSafari() ||
      browser.isFirefox() ||
      browser.isEdge()
    ) {
      return direction.otherRetry(bridge, box)
    } else if (browser.isIE()) {
      return direction.ieRetry(bridge, box)
    } else {
      return Option.none()
    }
  }
  var tryCursor = function(bridge, isRoot, element, offset, direction) {
    return getBoxAt(bridge, element, offset).bind(function(box) {
      return tryAt(bridge, direction, box)
    })
  }
  var handle$2 = function(bridge, isRoot, direction) {
    return findSpot(bridge, isRoot, direction).bind(function(spot) {
      return scan$1(
        bridge,
        isRoot,
        spot.element(),
        spot.offset(),
        direction,
        MAX_RETRIES
      ).map(bridge.fromSitus)
    })
  }

  var inSameTable = function(elem, table) {
    return ancestor$2(elem, function(e) {
      return parent(e).exists(function(p) {
        return eq(p, table)
      })
    })
  }
  var simulate = function(bridge, isRoot, direction, initial, anchor) {
    return closest$1(initial, 'td,th', isRoot).bind(function(start) {
      return closest$1(start, 'table', isRoot).bind(function(table) {
        if (!inSameTable(anchor, table)) {
          return Option.none()
        }
        return handle$2(bridge, isRoot, direction).bind(function(range) {
          return closest$1(range.finish(), 'td,th', isRoot).map(function(
            finish
          ) {
            return {
              start: constant(start),
              finish: constant(finish),
              range: constant(range)
            }
          })
        })
      })
    })
  }
  var navigate = function(
    bridge,
    isRoot,
    direction,
    initial,
    anchor,
    precheck
  ) {
    if (detect$3().browser.isIE()) {
      return Option.none()
    } else {
      return precheck(initial, isRoot).orThunk(function() {
        return simulate(bridge, isRoot, direction, initial, anchor).map(
          function(info) {
            var range = info.range()
            return Response.create(
              Option.some(
                makeSitus(
                  range.start(),
                  range.soffset(),
                  range.finish(),
                  range.foffset()
                )
              ),
              true
            )
          }
        )
      })
    }
  }
  var firstUpCheck = function(initial, isRoot) {
    return closest$1(initial, 'tr', isRoot).bind(function(startRow) {
      return closest$1(startRow, 'table', isRoot).bind(function(table) {
        var rows = descendants$1(table, 'tr')
        if (eq(startRow, rows[0])) {
          return seekLeft$1(
            table,
            function(element) {
              return last$1(element).isSome()
            },
            isRoot
          ).map(function(last) {
            var lastOffset = getEnd(last)
            return Response.create(
              Option.some(makeSitus(last, lastOffset, last, lastOffset)),
              true
            )
          })
        } else {
          return Option.none()
        }
      })
    })
  }
  var lastDownCheck = function(initial, isRoot) {
    return closest$1(initial, 'tr', isRoot).bind(function(startRow) {
      return closest$1(startRow, 'table', isRoot).bind(function(table) {
        var rows = descendants$1(table, 'tr')
        if (eq(startRow, rows[rows.length - 1])) {
          return seekRight$1(
            table,
            function(element) {
              return first(element).isSome()
            },
            isRoot
          ).map(function(first) {
            return Response.create(
              Option.some(makeSitus(first, 0, first, 0)),
              true
            )
          })
        } else {
          return Option.none()
        }
      })
    })
  }
  var select = function(
    bridge,
    container,
    isRoot,
    direction,
    initial,
    anchor,
    selectRange
  ) {
    return simulate(bridge, isRoot, direction, initial, anchor).bind(function(
      info
    ) {
      return detect$5(
        container,
        isRoot,
        info.start(),
        info.finish(),
        selectRange
      )
    })
  }

  var findCell = function(target, isRoot) {
    return closest$1(target, 'td,th', isRoot)
  }
  function MouseSelection(bridge, container, isRoot, annotations) {
    var cursor = Option.none()
    var clearState = function() {
      cursor = Option.none()
    }
    var mousedown = function(event) {
      annotations.clear(container)
      cursor = findCell(event.target(), isRoot)
    }
    var mouseover = function(event) {
      cursor.each(function(start) {
        annotations.clearBeforeUpdate(container)
        findCell(event.target(), isRoot).each(function(finish) {
          identify(start, finish, isRoot).each(function(cellSel) {
            var boxes = cellSel.boxes.getOr([])
            if (
              boxes.length > 1 ||
              (boxes.length === 1 && !eq(start, finish))
            ) {
              annotations.selectRange(
                container,
                boxes,
                cellSel.start,
                cellSel.finish
              )
              bridge.selectContents(finish)
            }
          })
        })
      })
    }
    var mouseup = function(_event) {
      cursor.each(clearState)
    }
    return {
      mousedown: mousedown,
      mouseover: mouseover,
      mouseup: mouseup
    }
  }

  var down = {
    traverse: nextSibling,
    gather: after$5,
    relative: Situ.before,
    otherRetry: Retries.tryDown,
    ieRetry: Retries.ieTryDown,
    failure: BeforeAfter.failedDown
  }
  var up = {
    traverse: prevSibling,
    gather: before$4,
    relative: Situ.before,
    otherRetry: Retries.tryUp,
    ieRetry: Retries.ieTryUp,
    failure: BeforeAfter.failedUp
  }

  var isKey = function(key) {
    return function(keycode) {
      return keycode === key
    }
  }
  var isUp = isKey(38)
  var isDown = isKey(40)
  var isNavigation = function(keycode) {
    return keycode >= 37 && keycode <= 40
  }
  var ltr$3 = {
    isBackward: isKey(37),
    isForward: isKey(39)
  }
  var rtl$3 = {
    isBackward: isKey(39),
    isForward: isKey(37)
  }

  var toRaw = function(sr) {
    return {
      left: sr.left(),
      top: sr.top(),
      right: sr.right(),
      bottom: sr.bottom(),
      width: sr.width(),
      height: sr.height()
    }
  }
  var Rect = { toRaw: toRaw }

  var get$c = function(_DOC) {
    var doc = _DOC !== undefined ? _DOC.dom() : domGlobals.document
    var x = doc.body.scrollLeft || doc.documentElement.scrollLeft
    var y = doc.body.scrollTop || doc.documentElement.scrollTop
    return Position(x, y)
  }
  var by = function(x, y, _DOC) {
    var doc = _DOC !== undefined ? _DOC.dom() : domGlobals.document
    var win = doc.defaultView
    win.scrollBy(x, y)
  }

  var WindowBridge = function(win) {
    var elementFromPoint = function(x, y) {
      return Element.fromPoint(Element.fromDom(win.document), x, y)
    }
    var getRect = function(element) {
      return element.dom().getBoundingClientRect()
    }
    var getRangedRect = function(start, soffset, finish, foffset) {
      var sel = Selection.exact(start, soffset, finish, foffset)
      return getFirstRect$1(win, sel).map(Rect.toRaw)
    }
    var getSelection = function() {
      return get$b(win).map(function(exactAdt) {
        return convertToRange(win, exactAdt)
      })
    }
    var fromSitus = function(situs) {
      var relative = Selection.relative(situs.start(), situs.finish())
      return convertToRange(win, relative)
    }
    var situsFromPoint = function(x, y) {
      return getAtPoint(win, x, y).map(function(exact) {
        return Situs.create(
          exact.start(),
          exact.soffset(),
          exact.finish(),
          exact.foffset()
        )
      })
    }
    var clearSelection = function() {
      clear(win)
    }
    var collapseSelection = function(toStart) {
      if (toStart === void 0) {
        toStart = false
      }
      get$b(win).each(function(sel) {
        return sel.fold(
          function(rng) {
            return rng.collapse(toStart)
          },
          function(startSitu, finishSitu) {
            var situ = toStart ? startSitu : finishSitu
            setRelative(win, situ, situ)
          },
          function(start, soffset, finish, foffset) {
            var node = toStart ? start : finish
            var offset = toStart ? soffset : foffset
            setExact(win, node, offset, node, offset)
          }
        )
      })
    }
    var selectContents = function(element) {
      setToElement(win, element)
    }
    var setSelection = function(sel) {
      setExact(win, sel.start(), sel.soffset(), sel.finish(), sel.foffset())
    }
    var setRelativeSelection = function(start, finish) {
      setRelative(win, start, finish)
    }
    var getInnerHeight = function() {
      return win.innerHeight
    }
    var getScrollY = function() {
      var pos = get$c(Element.fromDom(win.document))
      return pos.top()
    }
    var scrollBy = function(x, y) {
      by(x, y, Element.fromDom(win.document))
    }
    return {
      elementFromPoint: elementFromPoint,
      getRect: getRect,
      getRangedRect: getRangedRect,
      getSelection: getSelection,
      fromSitus: fromSitus,
      situsFromPoint: situsFromPoint,
      clearSelection: clearSelection,
      collapseSelection: collapseSelection,
      setSelection: setSelection,
      setRelativeSelection: setRelativeSelection,
      selectContents: selectContents,
      getInnerHeight: getInnerHeight,
      getScrollY: getScrollY,
      scrollBy: scrollBy
    }
  }

  var rc = function(rows, cols) {
    return {
      rows: rows,
      cols: cols
    }
  }
  var mouse = function(win, container, isRoot, annotations) {
    var bridge = WindowBridge(win)
    var handlers = MouseSelection(bridge, container, isRoot, annotations)
    return {
      mousedown: handlers.mousedown,
      mouseover: handlers.mouseover,
      mouseup: handlers.mouseup
    }
  }
  var keyboard = function(win, container, isRoot, annotations) {
    var bridge = WindowBridge(win)
    var clearToNavigate = function() {
      annotations.clear(container)
      return Option.none()
    }
    var keydown = function(event, start, soffset, finish, foffset, direction) {
      var realEvent = event.raw()
      var keycode = realEvent.which
      var shiftKey = realEvent.shiftKey === true
      var handler = retrieve(container, annotations.selectedSelector).fold(
        function() {
          if (isDown(keycode) && shiftKey) {
            return curry(
              select,
              bridge,
              container,
              isRoot,
              down,
              finish,
              start,
              annotations.selectRange
            )
          } else if (isUp(keycode) && shiftKey) {
            return curry(
              select,
              bridge,
              container,
              isRoot,
              up,
              finish,
              start,
              annotations.selectRange
            )
          } else if (isDown(keycode)) {
            return curry(
              navigate,
              bridge,
              isRoot,
              down,
              finish,
              start,
              lastDownCheck
            )
          } else if (isUp(keycode)) {
            return curry(
              navigate,
              bridge,
              isRoot,
              up,
              finish,
              start,
              firstUpCheck
            )
          } else {
            return Option.none
          }
        },
        function(selected) {
          var update$1 = function(attempts) {
            return function() {
              var navigation = findMap(attempts, function(delta) {
                return update(
                  delta.rows,
                  delta.cols,
                  container,
                  selected,
                  annotations
                )
              })
              return navigation.fold(
                function() {
                  return getEdges(
                    container,
                    annotations.firstSelectedSelector,
                    annotations.lastSelectedSelector
                  ).map(function(edges) {
                    var relative =
                      isDown(keycode) || direction.isForward(keycode)
                        ? Situ.after
                        : Situ.before
                    bridge.setRelativeSelection(
                      Situ.on(edges.first(), 0),
                      relative(edges.table())
                    )
                    annotations.clear(container)
                    return Response.create(Option.none(), true)
                  })
                },
                function(_) {
                  return Option.some(Response.create(Option.none(), true))
                }
              )
            }
          }
          if (isDown(keycode) && shiftKey) {
            return update$1([rc(+1, 0)])
          } else if (isUp(keycode) && shiftKey) {
            return update$1([rc(-1, 0)])
          } else if (direction.isBackward(keycode) && shiftKey) {
            return update$1([rc(0, -1), rc(-1, 0)])
          } else if (direction.isForward(keycode) && shiftKey) {
            return update$1([rc(0, +1), rc(+1, 0)])
          } else if (isNavigation(keycode) && shiftKey === false) {
            return clearToNavigate
          } else {
            return Option.none
          }
        }
      )
      return handler()
    }
    var keyup = function(event, start, soffset, finish, foffset) {
      return retrieve(container, annotations.selectedSelector).fold(function() {
        var realEvent = event.raw()
        var keycode = realEvent.which
        var shiftKey = realEvent.shiftKey === true
        if (shiftKey === false) {
          return Option.none()
        }
        if (isNavigation(keycode)) {
          return sync(
            container,
            isRoot,
            start,
            soffset,
            finish,
            foffset,
            annotations.selectRange
          )
        } else {
          return Option.none()
        }
      }, Option.none)
    }
    return {
      keydown: keydown,
      keyup: keyup
    }
  }
  var external = function(win, container, isRoot, annotations) {
    var bridge = WindowBridge(win)
    return function(start, finish) {
      annotations.clearBeforeUpdate(container)
      identify(start, finish, isRoot).each(function(cellSel) {
        var boxes = cellSel.boxes.getOr([])
        annotations.selectRange(container, boxes, cellSel.start, cellSel.finish)
        bridge.selectContents(finish)
        bridge.collapseSelection()
      })
    }
  }

  var remove$7 = function(element, classes) {
    each(classes, function(x) {
      remove$5(element, x)
    })
  }

  var addClass = function(clazz) {
    return function(element) {
      add$3(element, clazz)
    }
  }
  var removeClasses = function(classes) {
    return function(element) {
      remove$7(element, classes)
    }
  }

  var byClass = function(ephemera) {
    var addSelectionClass = addClass(ephemera.selected)
    var removeSelectionClasses = removeClasses([
      ephemera.selected,
      ephemera.lastSelected,
      ephemera.firstSelected
    ])
    var clear = function(container) {
      var sels = descendants$1(container, ephemera.selectedSelector)
      each(sels, removeSelectionClasses)
    }
    var selectRange = function(container, cells, start, finish) {
      clear(container)
      each(cells, addSelectionClass)
      add$3(start, ephemera.firstSelected)
      add$3(finish, ephemera.lastSelected)
    }
    return {
      clearBeforeUpdate: clear,
      clear: clear,
      selectRange: selectRange,
      selectedSelector: ephemera.selectedSelector,
      firstSelectedSelector: ephemera.firstSelectedSelector,
      lastSelectedSelector: ephemera.lastSelectedSelector
    }
  }
  var byAttr = function(ephemera, onSelection, onClear) {
    var removeSelectionAttributes = function(element) {
      remove(element, ephemera.selected)
      remove(element, ephemera.firstSelected)
      remove(element, ephemera.lastSelected)
    }
    var addSelectionAttribute = function(element) {
      set(element, ephemera.selected, '1')
    }
    var clear = function(container) {
      clearBeforeUpdate(container)
      onClear()
    }
    var clearBeforeUpdate = function(container) {
      var sels = descendants$1(container, ephemera.selectedSelector)
      each(sels, removeSelectionAttributes)
    }
    var selectRange = function(container, cells, start, finish) {
      clear(container)
      each(cells, addSelectionAttribute)
      set(start, ephemera.firstSelected, '1')
      set(finish, ephemera.lastSelected, '1')
      onSelection(cells, start, finish)
    }
    return {
      clearBeforeUpdate: clearBeforeUpdate,
      clear: clear,
      selectRange: selectRange,
      selectedSelector: ephemera.selectedSelector,
      firstSelectedSelector: ephemera.firstSelectedSelector,
      lastSelectedSelector: ephemera.lastSelectedSelector
    }
  }
  var SelectionAnnotation = {
    byClass: byClass,
    byAttr: byAttr
  }

  var getUpOrLeftCells = function(grid, selectedCells, generators) {
    var upGrid = grid.slice(
      0,
      selectedCells[selectedCells.length - 1].row() + 1
    )
    var upDetails = toDetailList(upGrid, generators)
    return bind(upDetails, function(detail) {
      var slicedCells = detail
        .cells()
        .slice(0, selectedCells[selectedCells.length - 1].column() + 1)
      return map(slicedCells, function(cell) {
        return cell.element()
      })
    })
  }
  var getDownOrRightCells = function(grid, selectedCells, generators) {
    var downGrid = grid.slice(
      selectedCells[0].row() + selectedCells[0].rowspan() - 1,
      grid.length
    )
    var downDetails = toDetailList(downGrid, generators)
    return bind(downDetails, function(detail) {
      var slicedCells = detail
        .cells()
        .slice(
          selectedCells[0].column() + selectedCells[0].colspan() - 1,
          +detail.cells().length
        )
      return map(slicedCells, function(cell) {
        return cell.element()
      })
    })
  }
  var getOtherCells = function(table, target, generators) {
    var house = Warehouse.fromTable(table)
    var details = onCells(house, target)
    return details.map(function(selectedCells) {
      var grid = toGrid(house, generators, false)
      var upOrLeftCells = getUpOrLeftCells(grid, selectedCells, generators)
      var downOrRightCells = getDownOrRightCells(
        grid,
        selectedCells,
        generators
      )
      return {
        upOrLeftCells: upOrLeftCells,
        downOrRightCells: downOrRightCells
      }
    })
  }

  var hasInternalTarget = function(e) {
    return (
      has$2(Element.fromDom(e.target), 'ephox-snooker-resizer-bar') === false
    )
  }
  function CellSelection(editor, lazyResize, selectionTargets) {
    var onSelection = function(cells, start, finish) {
      selectionTargets.targets().each(function(targets) {
        var tableOpt = table(start)
        tableOpt.each(function(table) {
          var cloneFormats = getCloneElements(editor)
          var generators = cellOperations(
            noop,
            Element.fromDom(editor.getDoc()),
            cloneFormats
          )
          var otherCells = getOtherCells(table, targets, generators)
          fireTableSelectionChange(editor, cells, start, finish, otherCells)
        })
      })
    }
    var onClear = function() {
      return fireTableSelectionClear(editor)
    }
    var annotations = SelectionAnnotation.byAttr(Ephemera, onSelection, onClear)
    editor.on('init', function(_e) {
      var win = editor.getWin()
      var body = getBody$1(editor)
      var isRoot = getIsRoot(editor)
      var syncSelection = function() {
        var sel = editor.selection
        var start = Element.fromDom(sel.getStart())
        var end = Element.fromDom(sel.getEnd())
        var shared = sharedOne$1(table, [start, end])
        shared.fold(function() {
          return annotations.clear(body)
        }, noop)
      }
      var mouseHandlers = mouse(win, body, isRoot, annotations)
      var keyHandlers = keyboard(win, body, isRoot, annotations)
      var external$1 = external(win, body, isRoot, annotations)
      var hasShiftKey = function(event) {
        return event.raw().shiftKey === true
      }
      editor.on('TableSelectorChange', function(e) {
        return external$1(e.start, e.finish)
      })
      var handleResponse = function(event, response) {
        if (!hasShiftKey(event)) {
          return
        }
        if (response.kill()) {
          event.kill()
        }
        response.selection().each(function(ns) {
          var relative = Selection.relative(ns.start(), ns.finish())
          var rng = asLtrRange(win, relative)
          editor.selection.setRng(rng)
        })
      }
      var keyup = function(event) {
        var wrappedEvent = fromRawEvent$1(event)
        if (
          wrappedEvent.raw().shiftKey &&
          isNavigation(wrappedEvent.raw().which)
        ) {
          var rng = editor.selection.getRng()
          var start = Element.fromDom(rng.startContainer)
          var end = Element.fromDom(rng.endContainer)
          keyHandlers
            .keyup(wrappedEvent, start, rng.startOffset, end, rng.endOffset)
            .each(function(response) {
              handleResponse(wrappedEvent, response)
            })
        }
      }
      var keydown = function(event) {
        var wrappedEvent = fromRawEvent$1(event)
        lazyResize().each(function(resize) {
          return resize.hideBars()
        })
        var rng = editor.selection.getRng()
        var startContainer = Element.fromDom(editor.selection.getStart())
        var start = Element.fromDom(rng.startContainer)
        var end = Element.fromDom(rng.endContainer)
        var direction = directionAt(startContainer).isRtl() ? rtl$3 : ltr$3
        keyHandlers
          .keydown(
            wrappedEvent,
            start,
            rng.startOffset,
            end,
            rng.endOffset,
            direction
          )
          .each(function(response) {
            handleResponse(wrappedEvent, response)
          })
        lazyResize().each(function(resize) {
          return resize.showBars()
        })
      }
      var isLeftMouse = function(raw) {
        return raw.button === 0
      }
      var isLeftButtonPressed = function(raw) {
        if (raw.buttons === undefined) {
          return true
        }
        if (global$2.browser.isEdge() && raw.buttons === 0) {
          return true
        }
        return (raw.buttons & 1) !== 0
      }
      var mouseDown = function(e) {
        if (isLeftMouse(e) && hasInternalTarget(e)) {
          mouseHandlers.mousedown(fromRawEvent$1(e))
        }
      }
      var mouseOver = function(e) {
        if (isLeftButtonPressed(e) && hasInternalTarget(e)) {
          mouseHandlers.mouseover(fromRawEvent$1(e))
        }
      }
      var mouseUp = function(e) {
        if (isLeftMouse(e) && hasInternalTarget(e)) {
          mouseHandlers.mouseup(fromRawEvent$1(e))
        }
      }
      var getDoubleTap = function() {
        var lastTarget = Cell(Element.fromDom(body))
        var lastTimeStamp = Cell(0)
        var touchEnd = function(t) {
          var target = Element.fromDom(t.target)
          if (name(target) === 'td' || name(target) === 'th') {
            var lT = lastTarget.get()
            var lTS = lastTimeStamp.get()
            if (eq(lT, target) && t.timeStamp - lTS < 300) {
              t.preventDefault()
              external$1(target, target)
            }
          }
          lastTarget.set(target)
          lastTimeStamp.set(t.timeStamp)
        }
        return { touchEnd: touchEnd }
      }
      var doubleTap = getDoubleTap()
      editor.on('mousedown', mouseDown)
      editor.on('mouseover', mouseOver)
      editor.on('mouseup', mouseUp)
      editor.on('touchend', doubleTap.touchEnd)
      editor.on('keyup', keyup)
      editor.on('keydown', keydown)
      editor.on('NodeChange', syncSelection)
    })
    return { clear: annotations.clear }
  }

  var getSelectionTargets = function(editor, selections) {
    var targets = Cell(Option.none())
    var changeHandlers = Cell([])
    var findTargets = function() {
      return getSelectionStartCellOrCaption(editor).bind(function(
        cellOrCaption
      ) {
        var table$1 = table(cellOrCaption)
        var isCaption = function(elem) {
          return name(elem) === 'caption'
        }
        return table$1.map(function(table) {
          if (isCaption(cellOrCaption)) {
            return noMenu(cellOrCaption)
          } else {
            return forMenu(selections, table, cellOrCaption)
          }
        })
      })
    }
    var resetTargets = function() {
      targets.set(cached(findTargets)())
      each(changeHandlers.get(), function(handler) {
        return handler()
      })
    }
    var onSetup = function(api, isDisabled) {
      var handler = function() {
        return targets.get().fold(
          function() {
            api.setDisabled(true)
          },
          function(targets) {
            api.setDisabled(isDisabled(targets))
          }
        )
      }
      handler()
      changeHandlers.set(changeHandlers.get().concat([handler]))
      return function() {
        changeHandlers.set(
          filter(changeHandlers.get(), function(h) {
            return h !== handler
          })
        )
      }
    }
    var onSetupTable = function(api) {
      return onSetup(api, function(_) {
        return false
      })
    }
    var onSetupCellOrRow = function(api) {
      return onSetup(api, function(targets) {
        return name(targets.element()) === 'caption'
      })
    }
    var onSetupPasteable = function(getClipboardData) {
      return function(api) {
        return onSetup(api, function(targets) {
          return (
            name(targets.element()) === 'caption' || getClipboardData().isNone()
          )
        })
      }
    }
    var onSetupMergeable = function(api) {
      return onSetup(api, function(targets) {
        return targets.mergable().isNone()
      })
    }
    var onSetupUnmergeable = function(api) {
      return onSetup(api, function(targets) {
        return targets.unmergable().isNone()
      })
    }
    editor.on('NodeChange ExecCommand TableSelectorChange', resetTargets)
    return {
      onSetupTable: onSetupTable,
      onSetupCellOrRow: onSetupCellOrRow,
      onSetupPasteable: onSetupPasteable,
      onSetupMergeable: onSetupMergeable,
      onSetupUnmergeable: onSetupUnmergeable,
      resetTargets: resetTargets,
      targets: function() {
        return targets.get()
      }
    }
  }

  var addButtons = function(editor, selectionTargets, clipboard) {
    editor.ui.registry.addMenuButton('table', {
      tooltip: 'Table',
      icon: 'table',
      fetch: function(callback) {
        return callback(
          'inserttable | cell row column | advtablesort | tableprops deletetable'
        )
      }
    })
    var cmd = function(command) {
      return function() {
        return editor.execCommand(command)
      }
    }
    editor.ui.registry.addButton('tableprops', {
      tooltip: 'Table properties',
      onAction: cmd('mceTableProps'),
      icon: 'table',
      onSetup: selectionTargets.onSetupTable
    })
    editor.ui.registry.addButton('tabledelete', {
      tooltip: 'Delete table',
      onAction: cmd('mceTableDelete'),
      icon: 'table-delete-table',
      onSetup: selectionTargets.onSetupTable
    })
    editor.ui.registry.addButton('tablecellprops', {
      tooltip: 'Cell properties',
      onAction: cmd('mceTableCellProps'),
      icon: 'table-cell-properties',
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addButton('tablemergecells', {
      tooltip: 'Merge cells',
      onAction: cmd('mceTableMergeCells'),
      icon: 'table-merge-cells',
      onSetup: selectionTargets.onSetupMergeable
    })
    editor.ui.registry.addButton('tablesplitcells', {
      tooltip: 'Split cell',
      onAction: cmd('mceTableSplitCells'),
      icon: 'table-split-cells',
      onSetup: selectionTargets.onSetupUnmergeable
    })
    editor.ui.registry.addButton('tableinsertrowbefore', {
      tooltip: 'Insert row before',
      onAction: cmd('mceTableInsertRowBefore'),
      icon: 'table-insert-row-above',
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addButton('tableinsertrowafter', {
      tooltip: 'Insert row after',
      onAction: cmd('mceTableInsertRowAfter'),
      icon: 'table-insert-row-after',
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addButton('tabledeleterow', {
      tooltip: 'Delete row',
      onAction: cmd('mceTableDeleteRow'),
      icon: 'table-delete-row',
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addButton('tablerowprops', {
      tooltip: 'Row properties',
      onAction: cmd('mceTableRowProps'),
      icon: 'table-row-properties',
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addButton('tableinsertcolbefore', {
      tooltip: 'Insert column before',
      onAction: cmd('mceTableInsertColBefore'),
      icon: 'table-insert-column-before',
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addButton('tableinsertcolafter', {
      tooltip: 'Insert column after',
      onAction: cmd('mceTableInsertColAfter'),
      icon: 'table-insert-column-after',
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addButton('tabledeletecol', {
      tooltip: 'Delete column',
      onAction: cmd('mceTableDeleteCol'),
      icon: 'table-delete-column',
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addButton('tablecutrow', {
      tooltip: 'Cut row',
      icon: 'cut-row',
      onAction: cmd('mceTableCutRow'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addButton('tablecopyrow', {
      tooltip: 'Copy row',
      icon: 'duplicate-row',
      onAction: cmd('mceTableCopyRow'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addButton('tablepasterowbefore', {
      tooltip: 'Paste row before',
      icon: 'paste-row-before',
      onAction: cmd('mceTablePasteRowBefore'),
      onSetup: selectionTargets.onSetupPasteable(clipboard.getRows)
    })
    editor.ui.registry.addButton('tablepasterowafter', {
      tooltip: 'Paste row after',
      icon: 'paste-row-after',
      onAction: cmd('mceTablePasteRowAfter'),
      onSetup: selectionTargets.onSetupPasteable(clipboard.getRows)
    })
    editor.ui.registry.addButton('tablecutcol', {
      tooltip: 'Cut column',
      icon: 'cut-column',
      onAction: cmd('mceTableCutCol'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addButton('tablecopycol', {
      tooltip: 'Copy column',
      icon: 'duplicate-column',
      onAction: cmd('mceTableCopyCol'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addButton('tablepastecolbefore', {
      tooltip: 'Paste column before',
      icon: 'paste-column-before',
      onAction: cmd('mceTablePasteColBefore'),
      onSetup: selectionTargets.onSetupPasteable(clipboard.getColumns)
    })
    editor.ui.registry.addButton('tablepastecolafter', {
      tooltip: 'Paste column after',
      icon: 'paste-column-after',
      onAction: cmd('mceTablePasteColAfter'),
      onSetup: selectionTargets.onSetupPasteable(clipboard.getColumns)
    })
    editor.ui.registry.addButton('tableinsertdialog', {
      tooltip: 'Insert table',
      onAction: cmd('mceInsertTable'),
      icon: 'table'
    })
  }
  var addToolbars = function(editor) {
    var isTable = function(table) {
      return editor.dom.is(table, 'table') && editor.getBody().contains(table)
    }
    var toolbar = getToolbar(editor)
    if (toolbar.length > 0) {
      editor.ui.registry.addContextToolbar('table', {
        predicate: isTable,
        items: toolbar,
        scope: 'node',
        position: 'node'
      })
    }
  }

  var addMenuItems = function(editor, selectionTargets, clipboard) {
    var cmd = function(command) {
      return function() {
        return editor.execCommand(command)
      }
    }
    var insertTableAction = function(_a) {
      var numRows = _a.numRows,
        numColumns = _a.numColumns
      editor.undoManager.transact(function() {
        insert(editor, numColumns, numRows, 0, 0)
      })
      editor.addVisual()
    }
    var tableProperties = {
      text: 'Table properties',
      onSetup: selectionTargets.onSetupTable,
      onAction: cmd('mceTableProps')
    }
    var deleteTable = {
      text: 'Delete table',
      icon: 'table-delete-table',
      onSetup: selectionTargets.onSetupTable,
      onAction: cmd('mceTableDelete')
    }
    editor.ui.registry.addMenuItem('tableinsertrowbefore', {
      text: 'Insert row before',
      icon: 'table-insert-row-above',
      onAction: cmd('mceTableInsertRowBefore'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addMenuItem('tableinsertrowafter', {
      text: 'Insert row after',
      icon: 'table-insert-row-after',
      onAction: cmd('mceTableInsertRowAfter'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addMenuItem('tabledeleterow', {
      text: 'Delete row',
      icon: 'table-delete-row',
      onAction: cmd('mceTableDeleteRow'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addMenuItem('tablerowprops', {
      text: 'Row properties',
      icon: 'table-row-properties',
      onAction: cmd('mceTableRowProps'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addMenuItem('tablecutrow', {
      text: 'Cut row',
      icon: 'cut-row',
      onAction: cmd('mceTableCutRow'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addMenuItem('tablecopyrow', {
      text: 'Copy row',
      icon: 'duplicate-row',
      onAction: cmd('mceTableCopyRow'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addMenuItem('tablepasterowbefore', {
      text: 'Paste row before',
      icon: 'paste-row-before',
      onAction: cmd('mceTablePasteRowBefore'),
      onSetup: selectionTargets.onSetupPasteable(clipboard.getRows)
    })
    editor.ui.registry.addMenuItem('tablepasterowafter', {
      text: 'Paste row after',
      icon: 'paste-row-after',
      onAction: cmd('mceTablePasteRowAfter'),
      onSetup: selectionTargets.onSetupPasteable(clipboard.getRows)
    })
    var row = {
      type: 'nestedmenuitem',
      text: 'Row',
      getSubmenuItems: function() {
        return 'tableinsertrowbefore tableinsertrowafter tabledeleterow tablerowprops | tablecutrow tablecopyrow tablepasterowbefore tablepasterowafter'
      }
    }
    editor.ui.registry.addMenuItem('tableinsertcolumnbefore', {
      text: 'Insert column before',
      icon: 'table-insert-column-before',
      onAction: cmd('mceTableInsertColBefore'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addMenuItem('tableinsertcolumnafter', {
      text: 'Insert column after',
      icon: 'table-insert-column-after',
      onAction: cmd('mceTableInsertColAfter'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addMenuItem('tabledeletecolumn', {
      text: 'Delete column',
      icon: 'table-delete-column',
      onAction: cmd('mceTableDeleteCol'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addMenuItem('tablecutcolumn', {
      text: 'Cut column',
      icon: 'cut-column',
      onAction: cmd('mceTableCutCol'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addMenuItem('tablecopycolumn', {
      text: 'Copy column',
      icon: 'duplicate-column',
      onAction: cmd('mceTableCopyCol'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addMenuItem('tablepastecolumnbefore', {
      text: 'Paste column before',
      icon: 'paste-column-before',
      onAction: cmd('mceTablePasteColBefore'),
      onSetup: selectionTargets.onSetupPasteable(clipboard.getColumns)
    })
    editor.ui.registry.addMenuItem('tablepastecolumnafter', {
      text: 'Paste column after',
      icon: 'paste-column-after',
      onAction: cmd('mceTablePasteColAfter'),
      onSetup: selectionTargets.onSetupPasteable(clipboard.getColumns)
    })
    var column = {
      type: 'nestedmenuitem',
      text: 'Column',
      getSubmenuItems: function() {
        return 'tableinsertcolumnbefore tableinsertcolumnafter tabledeletecolumn'
      }
    }
    editor.ui.registry.addMenuItem('tablecellprops', {
      text: 'Cell properties',
      icon: 'table-cell-properties',
      onAction: cmd('mceTableCellProps'),
      onSetup: selectionTargets.onSetupCellOrRow
    })
    editor.ui.registry.addMenuItem('tablemergecells', {
      text: 'Merge cells',
      icon: 'table-merge-cells',
      onAction: cmd('mceTableMergeCells'),
      onSetup: selectionTargets.onSetupMergeable
    })
    editor.ui.registry.addMenuItem('tablesplitcells', {
      text: 'Split cell',
      icon: 'table-split-cells',
      onAction: cmd('mceTableSplitCells'),
      onSetup: selectionTargets.onSetupUnmergeable
    })
    var cell = {
      type: 'nestedmenuitem',
      text: 'Cell',
      getSubmenuItems: function() {
        return 'tablecellprops tablemergecells tablesplitcells'
      }
    }
    if (hasTableGrid(editor) === false) {
      editor.ui.registry.addMenuItem('inserttable', {
        text: 'Table',
        icon: 'table',
        onAction: cmd('mceInsertTable')
      })
    } else {
      editor.ui.registry.addNestedMenuItem('inserttable', {
        text: 'Table',
        icon: 'table',
        getSubmenuItems: function() {
          return [
            {
              type: 'fancymenuitem',
              fancytype: 'inserttable',
              onAction: insertTableAction
            }
          ]
        }
      })
    }
    editor.ui.registry.addMenuItem('inserttabledialog', {
      text: 'Insert table',
      icon: 'table',
      onAction: cmd('mceInsertTable')
    })
    editor.ui.registry.addMenuItem('tableprops', tableProperties)
    editor.ui.registry.addMenuItem('deletetable', deleteTable)
    editor.ui.registry.addNestedMenuItem('row', row)
    editor.ui.registry.addNestedMenuItem('column', column)
    editor.ui.registry.addNestedMenuItem('cell', cell)
    editor.ui.registry.addContextMenu('table', {
      update: function() {
        selectionTargets.resetTargets()
        return selectionTargets.targets().fold(
          function() {
            return ''
          },
          function(targets) {
            if (name(targets.element()) === 'caption') {
              return 'tableprops deletetable'
            } else {
              return 'cell row column | advtablesort | tableprops deletetable'
            }
          }
        )
      }
    })
  }

  var cellFormats = {
    tablecellbackgroundcolor: {
      selector: 'td,th',
      styles: { backgroundColor: '%value' },
      remove_similar: true
    },
    tablecellbordercolor: {
      selector: 'td,th',
      styles: { borderColor: '%value' },
      remove_similar: true
    },
    tablecellborderstyle: {
      selector: 'td,th',
      styles: { borderStyle: '%value' },
      remove_similar: true
    },
    tablecellborderwidth: {
      selector: 'td,th',
      styles: { borderWidth: '%value' },
      remove_similar: true
    }
  }
  var registerFormats = function(editor) {
    editor.formatter.register(cellFormats)
  }

  function Plugin(editor) {
    var selections = Selections(editor)
    var selectionTargets = getSelectionTargets(editor, selections)
    var resizeHandler = getResizeHandler(editor)
    var cellSelection = CellSelection(
      editor,
      resizeHandler.lazyResize,
      selectionTargets
    )
    var actions = TableActions(editor, resizeHandler.lazyWire)
    var clipboard = Clipboard()
    registerCommands(editor, actions, cellSelection, selections, clipboard)
    registerQueryCommands(editor, actions, selections)
    registerEvents(editor, selections, actions, cellSelection)
    addMenuItems(editor, selectionTargets, clipboard)
    addButtons(editor, selectionTargets, clipboard)
    addToolbars(editor)
    editor.on('PreInit', function() {
      editor.serializer.addTempAttr(firstSelected)
      editor.serializer.addTempAttr(lastSelected)
      registerFormats(editor)
    })
    if (hasTabNavigation(editor)) {
      editor.on('keydown', function(e) {
        handle$1(e, editor, actions, resizeHandler.lazyWire)
      })
    }
    editor.on('remove', function() {
      resizeHandler.destroy()
    })
    return getApi(editor, clipboard, resizeHandler, selectionTargets)
  }
  function Plugin$1() {
    global.add('table', Plugin)
  }

  Plugin$1()
})(window)
