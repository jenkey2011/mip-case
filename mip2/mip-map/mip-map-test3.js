require.config({
  paths: {
    mipComponentsWepackHelpers: "https://c.mipcdn.com/static/v2/mip-components-webpack-helpers"
  }
}), require(["mipComponentsWepackHelpers"], function (t) {
  var e = function (t) {
    var e = {};

    function n(r) {
      if (e[r]) return e[r].exports;
      var o = e[r] = {
        i: r,
        l: !1,
        exports: {}
      };
      return t[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }
    return n.m = t, n.c = e, n.d = function (t, e, r) {
      n.o(t, e) || Object.defineProperty(t, e, {
        enumerable: !0,
        get: r
      })
    }, n.r = function (t) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(t, "__esModule", {
        value: !0
      })
    }, n.t = function (t, e) {
      if (1 & e && (t = n(t)), 8 & e) return t;
      if (4 & e && "object" == typeof t && t && t.__esModule) return t;
      var r = Object.create(null);
      if (n.r(r), Object.defineProperty(r, "default", {
          enumerable: !0,
          value: t
        }), 2 & e && "string" != typeof t)
        for (var o in t) n.d(r, o, function (e) {
          return t[e]
        }.bind(null, o));
      return r
    }, n.n = function (t) {
      var e = t && t.__esModule ? function () {
        return t.default
      } : function () {
        return t
      };
      return n.d(e, "a", e), e
    }, n.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e)
    }, n.p = "/", n(n.s = 69)
  }({
    0: function (e, n) {
      e.exports = t["vue-loader/lib/runtime/componentNormalizer"]
    },
    2: function (e, n) {
      e.exports = t["vue-style-loader/lib/addStylesClient"]
    },
    3: function (e, n) {
      e.exports = t["css-loader/lib/css-base"]
    },
    46: function (t, e, n) {
      var r = n(93);
      "string" == typeof r && (r = [
        [t.i, r, ""]
      ]), r.locals && (t.exports = r.locals), (0, n(2).default)("24b1168a", r, !1, {})
    },
    69: function (t, e, n) {
      "use strict";
      n.r(e);
      var r = function () {
        var t = this.$createElement,
          e = this._self._c || t;
        return e("div", {
          staticClass: "wrapper"
        }, [e("p", [this._v(this._s(this.title))]), this._v(" "), this._t("default")], 2)
      };
      r._withStripped = !0;
      var o = {
          data: function () {
            return {
              title: ""
            }
          },
          mounted: function () {
            var t = this;
            console.log("This is my first custom component !"), this.$on("con", function (e) {
              console.log(e);
              var n = e.address,
                r = e.point;
              t.title = "\n        地址：" + n.city + " " + n.province + " " + n.district + " " + n.street + "\n        =======\n        经纬度：" + r.lat + "," + r.lng + "\n      "
            }), this.$on("fail", function (e) {
              console.log(e)
              t.title = "请开启定位权限！"
            })
          },
          methods: {
            con: function (t) {
              console.log(t)
            }
          }
        },
        i = (n(94), n(0)),
        s = n.n(i)()(o, r, [], !1, null, "4b07acce", null);
      e.default = s.exports
    },
    93: function (t, e, n) {
      (t.exports = n(3)(!1)).push([t.i, "\n.wrapper[data-v-4b07acce] {\n  margin: 0 auto;\n  text-align: center;\n}\n", ""])
    },
    94: function (t, e, n) {
      "use strict";
      var r = n(46);
      n.n(r).a
    }
  });
  e = e.default || e, MIP["function" == typeof e ? "registerCustomElement" : "registerVueCustomElement"]("mip-map-test", e)
});