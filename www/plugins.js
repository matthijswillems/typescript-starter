// @ts-nocheck
/* eslint-disable */

/**
 * Lemonpi Boilerplate for plugin management in creative libraries
 * This implementation is 'borrowed' from Lemonpi studio
 * @owner: Bram Korsten
 * @date: September 12 2022
 */

// List of all the installed plugins.
// This is managed by the boilerplate extension.
// DO NOT MODIFY
var pluginSource = [
  /* @plugins */
  {
    name: "ghg",
    init: function () {
      return (function (r) {
        function t() {
          window.addEventListener("message", function (e) {
            var n;
            e.data &&
              "LP_EXEC_SCRIPT_RESPONSE" === e.data.name &&
              (((n = document.createElement("script")).text = e.data.script), document.body.appendChild(n));
          });
        }
        function c(e) {
          if (i && window.lemonpi.context) {
            var n = e.replace(/\$\{/, "").replace(/\}/, "").trim();
            return i[n];
          }
          return e;
        }
        function d() {
          if (w) return !0;
          if (m && void 0 !== r.looping) return r.looping;
          if (f) return !1;
          var e = parseInt(c("${SELLER_MEMBER_ID}"), 10) || 1;
          return 0 < e && 181 !== e && 280 !== e;
        }
        function s(e) {
          var n, t;
          void 0 !== window.lemonpi &&
            ((n = document.querySelector("#creative_container")),
            ((t = e).referer = c("${REFERER_URL_ENC}")),
            (t.creativeIsVisible = !!(n.offsetWidth || n.offsetHeight || n.getClientRects().length)),
            window.postMessage(t, "*"),
            window.parent.postMessage(t, "*"));
        }
        function l() {
          var n;
          e &&
            (n = setInterval(function () {
              var t, o, e;
              0 !== window.clickTag1.length &&
                (clearInterval(n),
                2 < (e = window.clickTag1.split("__AN_MACROS__")).length &&
                  (e.pop(),
                  e.shift(),
                  (t = e.map(function (e) {
                    var n = e.split(":");
                    return { macro: n[0], value: n[1] || "0" };
                  })),
                  "undefined" != typeof lemonpi &&
                    void 0 !== lemonpi.context &&
                    ((o = window.open),
                    (window.open = function (e) {
                      for (var n = e.split("3D__AN_MACROS__")[0] + "3D" + ("h" + e.split("__AN_MACROS__h")[1]); 0 < t.length; )
                        n = (n = n.replace("(%253A" + t[0].macro + "%253A)", t[0].value)).replace("(%3A" + t[0].macro + "%3A)", t[0].value);
                      o.call(window, n);
                    }))));
            }, 100));
        }
        function p() {
          document.hidden || "function" != typeof window.onPageVisible
            ? document.hidden && "function" == typeof window.onPageHidden && window.onPageHidden()
            : window.onPageVisible();
        }
        function o() {
          s({ name: "LEMONPI_CREATIVE_WILL_LOAD" });
        }
        var u = void 0,
          w = !1,
          m = "4005" === window.location.port,
          f = m || -1 < window.location.hostname.indexOf("lemonpi.io") || /lemonpi-prod-templates\.s3\.amazonaws\.com/.test(window.location.host),
          e = "string" == typeof clickTag1,
          i = void 0;
        return {
          creativeWillLoad: function (n) {
            window.lemonpi.context
              ? window.lemonpi.context.subscribe(function (e) {
                  (i = e.appnexus), t(), o(), n();
                })
              : (t(), o(), n()),
              window.lemonpi.config && window.lemonpi.config.subscribe(s);
          },
          creativeDidRender: function () {
            var e, n, t, o, i, a;
            (-1 < window.location.href.indexOf("inapptesting=1") || (!f && void 0 !== window.screenad && !window.screenad.isPreviewer)) &&
              (console.log = function (e) {
                s({ name: "LEMONPI_LOG", message: e });
              }),
              !m &&
                window.Raven &&
                "function" == typeof window.Raven.config &&
                window.Raven.config("https://87dc5e0450d3461f83c185097b7db5cf@sentry.io/75086").install(),
              (function () {
                window.addEventListener("message", function (e) {
                  e.data &&
                    "LP_IS_IN_APP" === e.data.name &&
                    (window.open = function (e) {
                      var n = { name: "LP_MRAID_CLICK", url: e };
                      window.parent.postMessage(n, "*"), window.postMessage(n, "*");
                    });
                });
                var e = { name: "LP_REQUEST_IN_APP" };
                window.parent.postMessage(e, "*"), window.postMessage(e, "*");
              })(),
              l(),
              (e = document.querySelector("head")),
              ((n = document.createElement("style")).type = "text/css"),
              n.appendChild(
                document.createTextNode(
                  ""
                )
              ),
              e.appendChild(n),
              document.getElementById("creative_container").addEventListener("mouseenter", function () {
                u = setTimeout(function () {
                  w = !0;
                }, 1e3);
              }),
              document.getElementById("creative_container").addEventListener("mouseleave", function () {
                clearTimeout(u);
              }),
              (t = setInterval(function () {
                var e = void 0,
                  n = Math.abs(parseInt(r.loopstopDelay, 10)),
                  e = isNaN(n) || 0 === n ? 15 : n;
                "function" != typeof window.onLoopStop ||
                  (d() && !window.screenad) ||
                  (clearInterval(t),
                  TweenMax.delayedCall(e, function () {
                    window.onLoopStop();
                  }));
              }, 100)),
              setTimeout(function () {
                return clearInterval(t);
              }, 500),
              (o = document.querySelector('meta[name="ad.size"]').content.match(/\d+/g)),
              (i = { "336x280": 0.8928571429, "1272x328": 0.7625786164 }[o[0] + "x" + o[1]]),
              m &&
                r.previewScalifier &&
                i &&
                window.addEventListener("message", function (e) {
                  var n;
                  e.data &&
                    "LEMONPI_CREATIVE_RENDERED" === e.data.name &&
                    (((n = document.querySelector("#creative_container")).style.transformOrigin = "0 0"),
                    (n.style.webkitTransformOrigin = "0 0"),
                    (n.style.transform = "scale(" + i + ")"),
                    (n.style.webkitTransform = "scale(" + i + ")"));
                }),
              void 0 !== document.hidden && document.addEventListener("visibilitychange", p, !1),
              (a = lemonpi.click),
              (window.lemonpi.click = function (e, n, t) {
                s({ name: "LP_CLICK" }), a(e, n, t);
              }),
              f &&
                // $.getScript("https://s3.eu-central-1.amazonaws.com/ghg-tools/ghg-banner-basics-debugger/debugger-v2.js", function () {
                //   var e, n;
                //   m &&
                //     ((e = window.location.href.replace("concept.html", "script.js")),
                //     (n = new XMLHttpRequest()).addEventListener("load", function (e) {
                //       var n = e.currentTarget.responseText.match(/function executeScript\(plugins\) {[^]+?(?=\/\/ All the Creative's plugins.)/g);
                //       (n = n ? n[0] : "").match(/https?/gi) &&
                //         window.drawWarning("error", "Found one or more hardcoded URL's in your creative, please move them to a placeholder.");
                //     }),
                //     n.open("get", e, !0),
                //     n.send());
                // }),
                setTimeout(function () {
                  var e = {
                    name: "LEMONPI_CREATIVE_RENDERED",
                    supplyType: c("${SUPPLY_TYPE}"),
                    mraidVersion: "undefined" != typeof mraid ? window.mraid.getVersion() : "n/a",
                    appId: c("${EXT_APP_ID}"),
                  };
                  s(Object.assign(e));
                }, 1);
          },
          pluginApi: {
            getAppNexusMacro: c,
            getAllowLooping: d,
            getUserInteracted: function () {
              return w;
            },
            addMacrosToUrl: function (e) {
              var n = e;
              return (n = (n = (n = (n = n.replace("${CREATIVE_ID}", c("${CREATIVE_ID}"))).replace("${USER_ID}", c("${USER_ID}"))).replace(
                "${AUCTION_ID}",
                c("${AUCTION_ID}")
              )).replace("${CREATIVE_SIZE}", c("${CREATIVE_SIZE}")));
            },
            isInLemonpiStudio: m,
            isInAnyLemonpiEnvironment: f,
            getResizedImageUrl: function (e, n, t, o, i) {
              var a = "https://image.lemonpi.io/img/http://res.cloudinary.com/" + e + "/image/fetch/",
                r = "c_scale";
              return (
                t && (r += ",w_" + Math.round(parseFloat(t))),
                o && (r += ",h_" + Math.round(parseFloat(o))),
                i && (r += "/q_" + i),
                a + r + "/" + n.replace(/^(https?:)?\/\/image\.lemonpi\.io\/img\//i, "")
              );
            },
          },
        };
      })({ looping: false, previewScalifier: false, loopstopDelay: "15" });
    },
  },

  /* @plugins-end */
];

// Setup all the handlers for different callbacks within the plugins
var creativeWillLoadHandlers = [];
var creativeDidLoadHandlers = [];
var creativeWillRenderHandlers = [];
var creativeDidRenderHandlers = [];
var creativeWillOpenClickUrlHandlers = [];
var creativeDidOpenClickUrlHandlers = [];
var layerWillRenderHandlers = {};
var layerDidRenderHandlers = {};

// initialize all registered plugins, Collect all their callbacks and hooks
// In this implementation, all plugins are kicked off before the dynamic data is loaded
var pluginApis = {};
var plugins = {};
for (var i = 0; i < pluginSource.length; i++) {
  var plugin = pluginSource[i];
  var instance = plugin.init() || {};

  instance.creativeWillLoad && creativeWillLoadHandlers.push(instance.creativeWillLoad);
  instance.creativeDidLoad && creativeDidLoadHandlers.push(instance.creativeDidLoad);
  instance.creativeWillRender && creativeWillRenderHandlers.push(instance.creativeWillRender);
  instance.creativeDidRender && creativeDidRenderHandlers.push(instance.creativeDidRender);
  instance.creativeWillOpenClickUrl && creativeWillOpenClickUrlHandlers.push(instance.creativeWillOpenClickUrl);
  instance.creativeDidOpenClickUrl && creativeDidOpenClickUrlHandlers.push(instance.creativeDidOpenClickUrl);
  instance.layerWillRender && addLayerHandlers(plugin.name, instance.layerWillRender, layerWillRenderHandlers);
  instance.layerDidRender && addLayerHandlers(plugin.name, instance.layerDidRender, layerDidRenderHandlers);

  plugins[plugin.name] = instance.pluginApi || {};
}

// Start loading plugins (allowing plugins to load async data)
var pluginsLoading = 0;
var pluginsLoadingDone = function () {};
for (var i = 0; i < creativeWillLoadHandlers.length; i++) {
  var creativeWillLoadHandler = creativeWillLoadHandlers[i];
  if (creativeWillLoadHandler.length > 0) {
    pluginsLoading++;
    creativeWillLoadHandler(function () {
      pluginsLoading--;
      if (pluginsLoading === 0) {
        pluginsLoadingDone();
      }
    });
  } else {
    creativeWillLoadHandler();
  }
}

// Utility function that calls the callback as soon as all plugins are done loading
function awaitPlugins(callback) {
  if (pluginsLoading === 0) {
    callback();
    return;
  }

  pluginsLoadingDone = function () {
    callback();
  };
}

// Utility function to add keyed handlers (used for behaviours)
function addLayerHandlers(name, handlers, target) {
  for (var key in handlers) {
    if (handlers.hasOwnProperty(key)) {
      var newKey = name + "." + key;
      target[newKey] = handlers[key];
    }
  }
}

// Utility function that calls all passed layer handlers
function callLayerHandlers(handlers) {
  for (var key in handlers) {
    if (handlers.hasOwnProperty(key)) {
      var elements = document.querySelectorAll("[data-studio-behaviour='" + key + "']");

      for (var i = 0; i < elements.length; i++) {
        handlers[key](elements[i]);
      }
    }
  }
}

var content = {};

// Wait for all plugins to be done loading
awaitPlugins(function () {
  // Notify plugins that the Creative is done loading
  for (var i = 0; i < creativeDidLoadHandlers.length; i++) {
    creativeDidLoadHandlers[i]();
  }

  // Notify plugins that the Creative will start rendering
  for (var i = 0; i < creativeWillRenderHandlers.length; i++) {
    creativeWillRenderHandlers[i]();
  }

  // Notify plugins that layers will start rendering
  callLayerHandlers(layerWillRenderHandlers);

  var started = false;

  pluginApis = plugins; // Support older versions

  lemonpi.subscribe(function (cont) {
    if (started) {
      return;
    }
    started = true;

    content = cont;

    // Render (show) the Creative
    document.querySelector("#creative_container").style.display = "";

    // Notify plugins that layers are done rendering
    callLayerHandlers(layerDidRenderHandlers);

    // Notify plugins that the Creative is done rendering
    for (var i = 0; i < creativeDidRenderHandlers.length; i++) {
      creativeDidRenderHandlers[i]();
    }

    // Eval the user script, pass in the plugin APIs.
    // Evalled on the next animation frame to ensure the
    // repaint caused by making the '#creative_container' visible
    // has finished.
    window.requestAnimationFrame(function () {
      var initInterval = setInterval(function () {
        if (typeof initCreative === "function") {
          clearInterval(initInterval);
          initCreative(content);
        }
      }, 10);
    });
  });
});
