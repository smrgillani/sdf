(function () {
  var e,
    o,
    n,
    t,
    r,
    i,
    s,
    a,
    l,
    d,
    c,
    p;
  null == window.Dropbox && (window.Dropbox = {}),
  null == Dropbox.baseUrl && (Dropbox.baseUrl = "https://www.dropbox.com"),
  null == Dropbox.blockBaseUrl && (Dropbox.blockBaseUrl = "https://dl-web.dropbox.com"),
  Dropbox.addListener = function (e, o, n) {
    e.addEventListener
      ? e.addEventListener(o, n, !1)
      : e.attachEvent("on" + o, function (e) {
        return e.preventDefault = function () {
          return this.returnValue = !1
        },
        n(e)
      })
  },
  Dropbox.removeListener = function (e, o, n) {
    e.removeEventListener
      ? e.removeEventListener(o, n, !1)
      : e.detachEvent("on" + o, n)
  },
  e = function (e, o, n) {
    var t;
    return t = e.indexOf("?") === -1
      ? "?"
      : "&",
    "" + e + t + o + "=" + n
  },
  o = function (o) {
    var n;
    return n = encodeURIComponent(Dropbox.VERSION),
    e(o, "version", n)
  },
  n = function (n, t) {
    var r,
      i,
      s,
      a,
      l,
      d,
      c,
      p,
      u,
      f,
      b,
      m,
      x;
    return f = encodeURIComponent(window.location.protocol + "//" + window.location.host),
    r = encodeURIComponent(Dropbox.appKey),
    p = encodeURIComponent(n.linkType || ""),
    m = encodeURIComponent(n._trigger || "js"),
    u = Boolean(n.multiselect),
    s = encodeURIComponent((null != (b = n.extensions) && "function" == typeof b.join
      ? b.join(" ")
      : void 0) || ""),
    l = Boolean(n.folderselect),
    d = encodeURIComponent(n.initial_mode || "recent"),
    t = Boolean(t),
    x = Dropbox.baseUrl + "/chooser?origin=" + f + "&app_key=" + r + "&link_type=" + p + "&trigger=" + m + "&multiselect=" + u + "&extensions=" + s + "&folderselect=" + l + "&initial_mode=" + d + "&iframe=" + t,
    null != n.initial_path && (c = encodeURIComponent(n.initial_path), x = e(x, "initial_path", c)),
    null != n.fields && (a = encodeURIComponent("function" == typeof(i = n.fields).join
      ? i.join(" ")
      : void 0), x = e(x, "fields", a)),
    o(x)
  },
  p = function () {
    var e,
      n,
      t;
    return n = encodeURIComponent(window.location.protocol + "//" + window.location.host),
    e = encodeURIComponent(Dropbox.appKey),
    t = Dropbox.baseUrl + "/saver?origin=" + n + "&app_key=" + e,
    o(t)
  },
  l = 1,
  i = function (e, n) {
    var t,
      r,
      i,
      s;
    if (t = encodeURIComponent(Dropbox.appKey), s = Dropbox.baseUrl + "/dropins/job_status?job=" + n + "&app_key=" + t, s = o(s), i = function (o) {
      var n;
      "COMPLETE" === o.status
        ? ("function" == typeof e.progress && e.progress(1), "function" == typeof e.success && e.success())
        : "PENDING" === (n = o.status) || "DOWNLOADING" === n
          ? (null != o.progress && "function" == typeof e.progress && e.progress(o.progress / 100), setTimeout(r, 1500))
          : "FAILED" === o.status && "function" == typeof e.error && e.error(o.error)
    },
    "withCredentials" in new XMLHttpRequest) 
      r = function () {
        var o;
        return o = new XMLHttpRequest,
        o.onload = function () {
          return i(JSON.parse(o.responseText))
        },
        o.onerror = function () {
          return "function" == typeof e.error
            ? e.error()
            : void 0
        },
        o.open("GET", s, !0),
        o.send()
      };
    else if (Dropbox.disableJSONP) {
      if ("undefined" == typeof XDomainRequest || null === XDomainRequest || "https:" !== document.location.protocol) 
        throw new Error("Unable to find suitable means of cross domain communication");
      r = function () {
        var o;
        return o = new XDomainRequest,
        o.onload = function () {
          return i(JSON.parse(o.responseText))
        },
        o.onerror = function () {
          return "function" == typeof e.error
            ? e.error()
            : void 0
        },
        o.open("get", s),
        o.send()
      }
    } else 
      r = function () {
        var o,
          n,
          t;
        return o = "DropboxJsonpCallback" + l++,
        n = !1,
        window[o] = function (e) {
          return n = !0,
          i(e)
        },
        t = document.createElement("script"),
        t.src = s + "&callback=" + o,
        t.onreadystatechange = function () {
          var o;
          if ("loaded" === t.readyState) 
            return n || "function" == typeof e.error && e.error(),
            null != (o = t.parentNode)
              ? o.removeChild(t)
              : void 0
          },
        document
          .getElementsByTagName("head")[0]
          .appendChild(t)
      };
    return "function" == typeof e.progress && e.progress(0),
    r()
  },
  d = {},
  s = function (e, o, n) {
    var t,
      s,
      l,
      c,
      p,
      u,
      f;
    switch (s = JSON.parse(e.data), l = void 0 !== a && null !== a && n._popup
      ? a.contentWindow
      : e.source, s.method) {
      case "origin_request":
        e
          .source
          .postMessage(JSON.stringify({method: "origin"}), Dropbox.baseUrl);
        break;
      case "ready":
        null != n.files && (n._fetch_url_on_save
          ? (f = (function () {
            var e,
              o,
              t,
              r;
            for (t = n.files, r = [], e = 0, o = t.length; e < o; e++) 
              p = t[e],
              r.push({filename: p.filename});
            return r
          })(),
          u = JSON.stringify({method: "files_with_callback", params: f}))
          : u = JSON.stringify({method: "files", params: n.files}), l.postMessage(u, Dropbox.baseUrl), null != n._ews_auth_token && (c = JSON.stringify({
          method: "ews_auth_token",
          params: {
            ews_auth_token: n._ews_auth_token
          }
        }), l.postMessage(c, Dropbox.baseUrl))),
        "function" == typeof n.ready && n.ready();
        break;
      case "files_selected":
      case "files_saved":
        "function" == typeof o && o(),
        "function" == typeof n.success && n.success(s.params, d);
        break;
      case "mode_changed":
        d = {
          mode: s.params
        };
        break;
      case "path_changed":
        d.file_id = s.params;
        break;
      case "progress":
        "function" == typeof n.progress && n.progress(s.params);
        break;
      case "close_dialog":
        "function" == typeof o && o(),
        "function" == typeof n.cancel && n.cancel(d);
        break;
      case "web_session_error":
        "function" == typeof o && o(),
        "function" == typeof n.webSessionFailure && n.webSessionFailure();
        break;
      case "web_session_unlinked":
        "function" == typeof o && o(),
        "function" == typeof n.webSessionUnlinked && n.webSessionUnlinked();
        break;
      case "resize":
        "function" == typeof n.resize && n.resize(s.params);
        break;
      case "error":
        "function" == typeof o && o(),
        "function" == typeof n.error && n.error(s.params);
        break;
      case "job_id":
        "function" == typeof o && o(),
        i(n, s.params);
        break;
      case "save_callback":
        t = function (e) {
          if (null == e) 
            throw new Error("Please supply {urls: [...]} to success callback");
          if (null != e.url && null != e.urls) 
            throw new Error("Do not pass both url and urls to the save callback");
          if (null != e.url && (e.urls = [e.url]), null == e.urls) 
            throw new Error("Please supply {urls: [...]} to success callback");
          s = {
            method: "continue_saving",
            params: {
              download_urls: e.urls
            }
          },
          l.postMessage(JSON.stringify(s), Dropbox.baseUrl)
        },
        r(n, s.params, t);
        break;
      case "_debug_log":
        "undefined" != typeof console && null !== console && console.log(s.params.msg)
    }
  },
  r = function (e, o, n) {
    var t;
    e._fetch_url_on_save && (t = e.fetch_urls_fn, "function" != typeof t && "function" == typeof e.error && e.error("Something went wrong, file url callback not provided."), t(n, o))
  },
  a = null,
  t = function () {
    /\bTrident\b/.test(navigator.userAgent) && null != document.body && null == a && (a = document.createElement("iframe"), a.setAttribute("id", "dropbox_xcomm"), a.setAttribute("src", Dropbox.baseUrl + "/static/api/1/xcomm.html"), a.style.display = "none", document.body.appendChild(a))
  },
  Dropbox.createChooserWidget = function (e) {
    var o;
    return o = g(n(e, !0)),
    o._handler = function (n) {
      n.source === o.contentWindow && n.origin === Dropbox.baseUrl && s(n, null, e)
    },
    Dropbox.addListener(window, "message", o._handler),
    o
  },
  Dropbox.cleanupWidget = function (e) {
    if (!e._handler) 
      throw new Error("Invalid widget!");
    Dropbox.removeListener(window, "message", e._handler),
    delete e._handler
  },
  c = function (e, o) {
    var n,
      t;
    return n = (window.screenX || window.screenLeft) + ((window.outerWidth || document.documentElement.offsetWidth) - e) / 2,
    t = (window.screenY || window.screenTop) + ((window.outerHeight || document.documentElement.offsetHeight) - o) / 2,
    "width=" + e + ",height=" + o + ",left=" + n + ",top=" + t
  };
  var u,
    f,
    b,
    m,
    x,
    h,
    g,
    w,
    y,
    v,
    _,
    k,
    D,
    E,
    S,
    C,
    N,
    U,
    L = [].slice,
    O = [].indexOf || function (e) {
      for (var o = 0, n = this.length; o < n; o++) 
        if (o in this && this[o] === e) 
          return o;
    return -1
    };
  if (Dropbox._dropinsjs_loaded) 
    return void("undefined" != typeof console && null !== console && "function" == typeof console.warn && console.warn("dropins.js included more than once"));
  Dropbox._dropinsjs_loaded = !0,
  null == Dropbox.appKey && (Dropbox.appKey = "jad00kntg41me93", m = function (e) {
    return e
  },
  u = "https://www.dropbox.com/developers/dropins/chooser/js",
  b = [
    "text", "documents", "images", "video", "audio"
  ],
  Dropbox.init = function (e) {
    e.appKey = "jad00kntg41me93";
    null != e.translation_function && (m = e.translation_function),
    null != e.appKey && (Dropbox.appKey = e.appKey)
  },
  g = function (e) {
    var o;
    return o = document.createElement("iframe"),
    o.src = e,
    o.style.display = "block",
    o.style.backgroundColor = "white",
    o.style.border = "none",
    o
  },
  S = function (e) {
    var o,
      n,
      t,
      r,
      i,
      s,
      a,
      l,
      d;
    if ("string" == typeof e[0]) 
      d = e.shift(),
      n = "string" == typeof e[0]
        ? e.shift()
        : _(d),
      s = e.shift() || {}
    ,
    s.files = [
      {
        url: d,
        filename: n
      }
    ];
    else {
      if (s = e.shift(), null == s) 
        throw new Error("Missing arguments. See documentation.");
      if ((null == (a = s.files) || !a.length) && "function" != typeof s.files) 
        throw new Error("Missing files. See documentation.");
      if (null != s.fetch_urls_fn) {
        if ("function" != typeof s.fetch_urls_fn) 
          throw new Error("fetch_urls_fn must be a function if supplied.  See documentation.");
        s._fetch_url_on_save = !0
      }
      for (l = s.files, t = r = 0, i = l.length; r < i; t = ++r) {
        if (o = l[t], "function" == typeof o.url && (s._fetch_url_on_save = !0, s.fetch_urls_fn = o.url, o.url = null, t > 0)) 
          throw new Error("Old style url as callback is only supported for single files.");
        o.filename || (o.filename = _(o.url))
      }
    }
    return s
  },
  Dropbox.save = function () {
    var e,
      o,
      n,
      t,
      r,
      i,
      s;
    if (e = 1 <= arguments.length
      ? L.call(arguments, 0)
      : [], i = S(e), !Dropbox.isBrowserSupported()) 
      return void alert(m("Your browser does not support the Dropbox Saver"));
    if (i._popup = !0, "object" != typeof i.files || !i.files.length) 
      throw new Error("The object passed in must have a 'files' property that contains a list of object" +
          "s. See documentation.");
    if (i.iframe && !i.windowName) 
      throw new Error("Dropbox.save does not yet support creating its own iframe. windowName must be pr" +
          "ovided when the iframe option is present.");
    for (s = i.files, t = 0, r = s.length; t < r; t++) 
      if (n = s[t], i._fetch_url_on_save) {
        if (i.fetch_urls_fn) {
          if (null != n.url) 
            throw new Error("You passed in a 'fetch_urls_fn' option to specify the file URLs.  Don't include " +
                "individual URLs in each file objects.")
            } else if ("function" != typeof n.url) 
          throw new Error("File urls should be all urls, or a single file with function. See documentation.")
      }
    else if ("string" != typeof n.url) 
      throw new Error("File urls to download incorrectly configured. Each file must have a url. See doc" +
          "umentation.");
    return o = c(352, 237),
    E(p(), o, i)
  },
  E = function (e, o, n) {
    var t,
      r,
      i,
      l,
      c,
      p;
    if (i = function () {
      t.closed || (t.close(), t.postMessage(JSON.stringify({method: "close"}), Dropbox.baseUrl)),
      Dropbox.removeListener(window, "message", l),
      clearInterval(p)
    },
    l = function (e) {
      e.source !== t && e.source !== (void 0 !== a && null !== a
        ? a.contentWindow
        : void 0) || s(e, i, n)
    },
    c = function () {
      (function () {
        try {
          return t.closed
        } catch (e) {}
      })() && (i(), "function" == typeof n.cancel && n.cancel(d))
    },
    r = n.iframe
      ? ""
      : o + ",resizable,scrollbars",
    t = window.open(e, n.windowName || "dropbox", r),
    !t) 
      throw new Error("Failed to open/load the window. Dropbox.choose and Dropbox.save should only be c" +
          "alled from within a user-triggered event handler such as a tap or click event.");
    return t.focus(),
    p = setInterval(c, 100),
    Dropbox.addListener(window, "message", l),
    t
  },
  U = function (e) {
    var o,
      n,
      t,
      r,
      i;
    if (null == e.success && "undefined" != typeof console && null !== console && "function" == typeof console.warn && console.warn("You must provide a success callback to the Chooser to see the files that the use" +
        "r selects"), n = function () {
      return "undefined" != typeof console && null !== console && "function" == typeof console.warn && console.warn("The provided list of extensions or file types is not valid. See Chooser document" +
          "ation: " + u),
      "undefined" != typeof console && null !== console && "function" == typeof console.warn && console.warn("Available file types are: " + b.join(", ")),
      delete e.extensions
    },
    null != e.extensions && null != Array.isArray) 
      if (Array.isArray(e.extensions)) 
        for (i = e.extensions, t = 0, r = i.length; t < r; t++) 
          o = i[t],
          !o.match(/^\.[\.\w$#&+@!()\-'`_~]+$/) && O.call(b, o) < 0 && n();
  else 
      n();
    return e
  },
  x = function (e) {
    var o,
      t,
      r,
      i,
      a,
      l;
    if (!Dropbox.isBrowserSupported()) 
      return void alert(m("Your browser does not support the Dropbox Chooser"));
    l = 640,
    r = 552,
    e.iframe && !e.windowName
      ? (a = g(n(e, !0)), a.style.width = l + "px", a.style.height = r + "px", a.style.margin = "125px auto 0 auto", a.style.border = "1px solid #ACACAC", a.style.boxShadow = "rgba(0, 0, 0, .2) 0px 4px 16px", i = document.createElement("div"), i.style.position = "fixed", i.style.left = i.style.right = i.style.top = i.style.bottom = "0", i.style.zIndex = "1000", i.style.backgroundColor = "rgba(160, 160, 160, 0.2)", i.appendChild(a), document.body.appendChild(i), t = function (o) {
        o.source === a.contentWindow && s(o, function () {
          document
            .body
            .removeChild(i),
          Dropbox.removeListener(window, "message", t)
        }, e)
      },
      Dropbox.addListener(window, "message", t))
      : (o = c(l, r), E(n(e, e.iframe), o, e))
  },
  Dropbox.choose = function (e) {
    null == e && (e = {}),
    e = U(e),
    x(e)
  },
  Dropbox.isBrowserSupported = function () {
    var e;
    return e = k(),
    Dropbox.isBrowserSupported = function () {
      return e
    },
    e
  },
  k = function () {
    var e,
      o,
      n,
      t;
    for (t = [
      /IEMobile\/(7|8|9|10)\./, /BB10;/, /CriOS/
    ], o = 0, n = t.length; o < n; o++) 
      if (e = t[o], e.test(navigator.userAgent)) 
        return !1;
  return "undefined" != typeof JSON && null !== JSON && null != window.postMessage && null != window.addEventListener
  },
  v = function (e) {
    return e
      .replace(/\/+$/g, "")
      .split("/")
      .pop()
  },
  _ = function (e) {
    var o;
    return o = document.createElement("a"),
    o.href = e,
    v(o.pathname)
  },
  h = function (e, o) {
    var n;
    return null != o
      ? o.innerHTML = ""
      : (o = document.createElement("a"), o.href = "#"),
    o.className += " dropbox-dropin-btn",
    Dropbox.isBrowserSupported()
      ? o.className += " dropbox-dropin-default"
      : o.className += " dropbox-dropin-disabled",
    n = document.createElement("span"),
    n.className = "dropin-btn-status",
    o.appendChild(n),
    e = document.createTextNode(e),
    o.appendChild(e),
    o
  },
  Dropbox.createChooseButton = function (e) {
    var o;
    return null == e && (e = {}),
    e = U(e),
    o = h(m("Choose from Dropbox")),
    Dropbox.addListener(o, "click", function (n) {
      n.preventDefault(),
      x({
        success: function (n, t) {
          o.className = "dropbox-dropin-btn dropbox-dropin-success",
          "function" == typeof e.success && e.success(n, t)
        },
        cancel: e.cancel,
        linkType: e.linkType,
        multiselect: e.multiselect,
        folderselect: e.folderselect,
        extensions: e.extensions,
        iframe: e.iframe,
        _trigger: "button"
      })
    }),
    o
  },
  Dropbox.createSaveButton = function () {
    var e,
      o,
      n;
    return e = 1 <= arguments.length
      ? L.call(arguments, 0)
      : [],
    n = S(e),
    o = e.shift(),
    o = h(m("Save to Dropbox"), o),
    Dropbox.addListener(o, "click", function (e) {
      var t;
      if (e.preventDefault(), o.className.indexOf("dropbox-dropin-error") >= 0 || o.className.indexOf("dropbox-dropin-default") >= 0 || o.className.indexOf("dropbox-dropin-disabled") >= 0) {
        if (t = ("function" == typeof n.files
          ? n.files()
          : void 0) || n.files, !(null != t
          ? t.length
          : void 0)) 
          return o.className = "dropbox-dropin-btn dropbox-dropin-error",
          void("function" == typeof n.error && n.error("Missing files"));
        Dropbox.save({
          files: t,
          success: function () {
            o.className = "dropbox-dropin-btn dropbox-dropin-success",
            "function" == typeof n.success && n.success()
          },
          progress: function (e) {
            o.className = "dropbox-dropin-btn dropbox-dropin-progress",
            "function" == typeof n.progress && n.progress(e)
          },
          cancel: function () {
            "function" == typeof n.cancel && n.cancel()
          },
          error: function (e) {
            o.className = "dropbox-dropin-btn dropbox-dropin-error",
            "function" == typeof n.error && n.error(e)
          }
        })
      }
    }),
    o
  },
  D = function (e, o) {
    return "background: " + e + ";\nbackground: -moz-linear-gradient(top, " + e + " 0%, " + o + " 100%);\nbackground: -webkit-linear-gradient(top, " + e + " 0%, " + o + " 100%);\nbackground: linear-gradient(to bottom, " + e + " 0%, " + o + " 100%);\nfilter: progid:DXImageTransform.Microsoft.gradient(startColorstr='" + e + "', endColorstr='" + o + "',GradientType=0);"
  },
  w = document.createElement("style"),
  w.type = "text/css",
  y = '@-webkit-keyframes rotate {\n  from  { -webkit-transform: rotate(0deg); }\n  to ' +
      '  { -webkit-transform: rotate(360deg); }\n}\n\n@keyframes rotate {\n  from  { tr' +
      'ansform: rotate(0deg); }\n  to   { transform: rotate(360deg); }\n}\n\n.dropbox-d' +
      'ropin-btn, .dropbox-dropin-btn:link, .dropbox-dropin-btn:hover {\n  display: inl' +
      'ine-block;\n  height: 14px;\n  font-family: "Lucida Grande", "Segoe UI", "Tahoma' +
      '", "Helvetica Neue", "Helvetica", sans-serif;\n  font-size: 11px;\n  font-weight' +
      ': 600;\n  color: #636363;\n  text-decoration: none;\n  padding: 1px 7px 5px 3px;' +
      '\n  border: 1px solid #ebebeb;\n  border-radius: 2px;\n  border-bottom-color: #d' +
      '4d4d4;\n  ' + D("#fcfcfc", "#f5f5f5") + "\n}\n\n.dropbox-dropin-default:hover, .dropbox-dropin-error:hover {\n  border-co" +
      "lor: #dedede;\n  border-bottom-color: #cacaca;\n  " + D("#fdfdfd", "#f5f5f5") + "\n}\n\n.dropbox-dropin-default:active, .dropbox-dropin-error:active {\n  border-" +
      "color: #d1d1d1;\n  box-shadow: inset 0 1px 1px rgba(0,0,0,0.1);\n}\n\n.dropbox-d" +
      "ropin-btn .dropin-btn-status {\n  display: inline-block;\n  width: 15px;\n  heig" +
      "ht: 14px;\n  vertical-align: bottom;\n  margin: 0 5px 0 2px;\n  background: tran" +
      "sparent url('" + Dropbox.baseUrl + "/static/images/widgets/dbx-saver-status.png') no-repeat;\n  position: relative;" +
      "\n  top: 2px;\n}\n\n.dropbox-dropin-default .dropin-btn-status {\n  background-p" +
      "osition: 0px 0px;\n}\n\n.dropbox-dropin-progress .dropin-btn-status {\n  width: " +
      "18px;\n  margin: 0 4px 0 0;\n  background: url('" + Dropbox.baseUrl + "/static/images/widgets/dbx-progress.png') no-repeat center center;\n  -webkit-an" +
      "imation-name: rotate;\n  -webkit-animation-duration: 1.7s;\n  -webkit-animation-" +
      "iteration-count: infinite;\n  -webkit-animation-timing-function: linear;\n  anim" +
      "ation-name: rotate;\n  animation-duration: 1.7s;\n  animation-iteration-count: i" +
      "nfinite;\n  animation-timing-function: linear;\n}\n\n.dropbox-dropin-success .dr" +
      "opin-btn-status {\n  background-position: -15px 0px;\n}\n\n.dropbox-dropin-disab" +
      "led {\n  background: #e0e0e0;\n  border: 1px #dadada solid;\n  border-bottom: 1p" +
      "x solid #ccc;\n  box-shadow: none;\n}\n\n.dropbox-dropin-disabled .dropin-btn-st" +
      "atus {\n  background-position: -30px 0px;\n}\n\n.dropbox-dropin-error .dropin-bt" +
      "n-status {\n  background-position: -45px 0px;\n}\n\n@media only screen and (-web" +
      "kit-min-device-pixel-ratio: 1.4) {\n  .dropbox-dropin-btn .dropin-btn-status {\n" +
      "    background-image: url('" + Dropbox.baseUrl + "/static/images/widgets/dbx-saver-status-2x.png');\n    background-size: 60px 14p" +
      "x;\n    -webkit-background-size: 60px 14px;\n  }\n\n  .dropbox-dropin-progress ." +
      "dropin-btn-status {\n    background: url('" + Dropbox.baseUrl + "/static/images/widgets/dbx-progress-2x.png') no-repeat center center;\n    backg" +
      "round-size: 20px 20px;\n    -webkit-background-size: 20px 20px;\n  }\n}\n\n.drop" +
      "box-saver:hover, .dropbox-chooser:hover {\n  text-decoration: none;\n  cursor: p" +
      "ointer;\n}\n\n.dropbox-chooser, .dropbox-dropin-btn {\n  line-height: 11px !impo" +
      "rtant;\n  text-decoration: none !important;\n  box-sizing: content-box !importan" +
      "t;\n  -webkit-box-sizing: content-box !important;\n  -moz-box-sizing: content-bo" +
      "x !important;\n}\n",
  w.styleSheet
    ? w.styleSheet.cssText = y
    : w.textContent = y,
  document.getElementsByTagName("head")[0].appendChild(w),
  setTimeout(t, 0),
  f = function () {
    document.removeEventListener
      ? document.removeEventListener("DOMContentLoaded", f, !1)
      : document.detachEvent && document.detachEvent("onreadystatechange", f),
    t(),
    I()
  },
  "interactive" === (N = document.readyState) || "complete" === N
    ? setTimeout(f, 0)
    : document.addEventListener
      ? document.addEventListener("DOMContentLoaded", f, !1)
      : document.attachEvent("onreadystatechange", f))
  var I,
    O = [].indexOf || function (e) {
      for (var o = 0, n = this.length; o < n; o++) 
        if (o in this && this[o] === e) 
          return o;
    return -1
    };
  Dropbox.VERSION = "2",
  I = function () {
    var e,
      o,
      n,
      t;
    for (t = document.getElementsByTagName("a"), o = 0, n = t.length; o < n; o++) 
      e = t[o],
      O.call((e.getAttribute("class") || "").split(" "), "dropbox-saver") >= 0 && (function (e) {
        Dropbox.createSaveButton({
          files: function () {
            return [
              {
                url: e.getAttribute("data-url") || e.href,
                filename: e.getAttribute("data-filename") || v(e.pathname)
              }
            ]
          }
        }, e)
      })(e)
  }
}).call(this);
