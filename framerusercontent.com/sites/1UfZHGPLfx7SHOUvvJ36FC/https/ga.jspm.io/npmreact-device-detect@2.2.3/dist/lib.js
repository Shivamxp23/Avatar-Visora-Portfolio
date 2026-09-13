import * as e from "react";
import * as r from "ua-parser-js/dist/ua-parser.min";
var n = "default" in e ? e.default : e;
var t = "default" in r ? r.default : r;
var i = {};
Object.defineProperty(i, "__esModule", { value: true });
function _interopDefault(e) {
  return e && "object" === typeof e && "default" in e ? e.default : e;
}
var a = n;
var o = _interopDefault(a);
var s = t;
var l = new s();
var u = l.getBrowser();
var c = l.getCPU();
var d = l.getDevice();
var v = l.getEngine();
var f = l.getOS();
var m = l.getUA();
var g = function setUa(e) {
  return l.setUA(e);
};
var b = function parseUserAgent(e) {
  if (e) {
    var r = new s(e);
    return {
      UA: r,
      browser: r.getBrowser(),
      cpu: r.getCPU(),
      device: r.getDevice(),
      engine: r.getEngine(),
      os: r.getOS(),
      ua: r.getUA(),
      setUserAgent: function setUserAgent(e) {
        return r.setUA(e);
      },
    };
  }
  console.error("No userAgent string was provided");
};
var p = Object.freeze({
  ClientUAInstance: l,
  browser: u,
  cpu: c,
  device: d,
  engine: v,
  os: f,
  ua: m,
  setUa: g,
  parseUserAgent: b,
});
function ownKeys(e, r) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var t = Object.getOwnPropertySymbols(e);
    r &&
      (t = t.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      }));
    n.push.apply(n, t);
  }
  return n;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var n = null != arguments[r] ? arguments[r] : {};
    r % 2
      ? ownKeys(Object(n), true).forEach(function (r) {
          _defineProperty(e, r, n[r]);
        })
      : Object.getOwnPropertyDescriptors
      ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
      : ownKeys(Object(n)).forEach(function (r) {
          Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
        });
  }
  return e;
}
function _typeof(e) {
  _typeof =
    "function" === typeof Symbol && "symbol" === typeof Symbol.iterator
      ? function (e) {
          return typeof e;
        }
      : function (e) {
          return e &&
            "function" === typeof Symbol &&
            e.constructor === Symbol &&
            e !== Symbol.prototype
            ? "symbol"
            : typeof e;
        };
  return _typeof(e);
}
function _classCallCheck(e, r) {
  if (!(e instanceof r))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var n = 0; n < r.length; n++) {
    var t = r[n];
    t.enumerable = t.enumerable || false;
    t.configurable = true;
    "value" in t && (t.writable = true);
    Object.defineProperty(e, t.key, t);
  }
}
function _createClass(e, r, n) {
  r && _defineProperties(e.prototype, r);
  n && _defineProperties(e, n);
  return e;
}
function _defineProperty(e, r, n) {
  r in e
    ? Object.defineProperty(e, r, {
        value: n,
        enumerable: true,
        configurable: true,
        writable: true,
      })
    : (e[r] = n);
  return e;
}
function _extends() {
  _extends =
    Object.assign ||
    function (e) {
      for (var r = 1; r < arguments.length; r++) {
        var n = arguments[r];
        for (var t in n)
          Object.prototype.hasOwnProperty.call(n, t) && (e[t] = n[t]);
      }
      return e;
    };
  return _extends.apply(this, arguments);
}
function _inherits(e, r) {
  if ("function" !== typeof r && null !== r)
    throw new TypeError("Super expression must either be null or a function");
  e.prototype = Object.create(r && r.prototype, {
    constructor: { value: e, writable: true, configurable: true },
  });
  r && _setPrototypeOf(e, r);
}
function _getPrototypeOf(e) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(e) {
        return e.__proto__ || Object.getPrototypeOf(e);
      };
  return _getPrototypeOf(e);
}
function _setPrototypeOf(e, r) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(e, r) {
      e.__proto__ = r;
      return e;
    };
  return _setPrototypeOf(e, r);
}
function _objectWithoutPropertiesLoose(e, r) {
  if (null == e) return {};
  var n = {};
  var t = Object.keys(e);
  var i, a;
  for (a = 0; a < t.length; a++) {
    i = t[a];
    r.indexOf(i) >= 0 || (n[i] = e[i]);
  }
  return n;
}
function _objectWithoutProperties(e, r) {
  if (null == e) return {};
  var n = _objectWithoutPropertiesLoose(e, r);
  var t, i;
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(e);
    for (i = 0; i < a.length; i++) {
      t = a[i];
      r.indexOf(t) >= 0 ||
        (Object.prototype.propertyIsEnumerable.call(e, t) && (n[t] = e[t]));
    }
  }
  return n;
}
function _assertThisInitialized(e) {
  if (void 0 === e)
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  return e;
}
function _possibleConstructorReturn(e, r) {
  if (r && ("object" === typeof r || "function" === typeof r)) return r;
  if (void 0 !== r)
    throw new TypeError(
      "Derived constructors may only return object or undefined"
    );
  return _assertThisInitialized(e);
}
function _slicedToArray(e, r) {
  return (
    _arrayWithHoles(e) ||
    _iterableToArrayLimit(e, r) ||
    _unsupportedIterableToArray(e, r) ||
    _nonIterableRest()
  );
}
function _arrayWithHoles(e) {
  if (Array.isArray(e)) return e;
}
function _iterableToArrayLimit(e, r) {
  var n =
    null == e
      ? null
      : ("undefined" !== typeof Symbol && e[Symbol.iterator]) ||
        e["@@iterator"];
  if (null != n) {
    var t = [];
    var i = true;
    var a = false;
    var o, s;
    try {
      for (n = n.call(e); !(i = (o = n.next()).done); i = true) {
        t.push(o.value);
        if (r && t.length === r) break;
      }
    } catch (e) {
      a = true;
      s = e;
    } finally {
      try {
        i || null == n.return || n.return();
      } finally {
        if (a) throw s;
      }
    }
    return t;
  }
}
function _unsupportedIterableToArray(e, r) {
  if (e) {
    if ("string" === typeof e) return _arrayLikeToArray(e, r);
    var n = Object.prototype.toString.call(e).slice(8, -1);
    "Object" === n && e.constructor && (n = e.constructor.name);
    return "Map" === n || "Set" === n
      ? Array.from(e)
      : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
      ? _arrayLikeToArray(e, r)
      : void 0;
  }
}
function _arrayLikeToArray(e, r) {
  (null == r || r > e.length) && (r = e.length);
  for (var n = 0, t = new Array(r); n < r; n++) t[n] = e[n];
  return t;
}
function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}
var w = {
  Mobile: "mobile",
  Tablet: "tablet",
  SmartTv: "smarttv",
  Console: "console",
  Wearable: "wearable",
  Embedded: "embedded",
  Browser: void 0,
};
var h = {
  Chrome: "Chrome",
  Firefox: "Firefox",
  Opera: "Opera",
  Yandex: "Yandex",
  Safari: "Safari",
  InternetExplorer: "Internet Explorer",
  Edge: "Edge",
  Chromium: "Chromium",
  Ie: "IE",
  MobileSafari: "Mobile Safari",
  EdgeChromium: "Edge Chromium",
  MIUI: "MIUI Browser",
  SamsungBrowser: "Samsung Browser",
};
var y = {
  IOS: "iOS",
  Android: "Android",
  WindowsPhone: "Windows Phone",
  Windows: "Windows",
  MAC_OS: "Mac OS",
};
var O = {
  isMobile: false,
  isTablet: false,
  isBrowser: false,
  isSmartTV: false,
  isConsole: false,
  isWearable: false,
};
var P = function checkDeviceType(e) {
  switch (e) {
    case w.Mobile:
      return { isMobile: true };
    case w.Tablet:
      return { isTablet: true };
    case w.SmartTv:
      return { isSmartTV: true };
    case w.Console:
      return { isConsole: true };
    case w.Wearable:
      return { isWearable: true };
    case w.Browser:
      return { isBrowser: true };
    case w.Embedded:
      return { isEmbedded: true };
    default:
      return O;
  }
};
var E = function setUserAgent(e) {
  return g(e);
};
var S = function setDefaults(e) {
  var r =
    arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "none";
  return e || r;
};
var V = function getNavigatorInstance() {
  return (
    !("undefined" === typeof window || (!window.navigator && !navigator)) &&
    (window.navigator || navigator)
  );
};
var T = function isIOS13Check(e) {
  var r = V();
  return (
    r &&
    r.platform &&
    (-1 !== r.platform.indexOf(e) ||
      ("MacIntel" === r.platform && r.maxTouchPoints > 1 && !window.MSStream))
  );
};
var _ = function browserPayload(e, r, n, t, i) {
  return {
    isBrowser: e,
    browserMajorVersion: S(r.major),
    browserFullVersion: S(r.version),
    browserName: S(r.name),
    engineName: S(n.name),
    engineVersion: S(n.version),
    osName: S(t.name),
    osVersion: S(t.version),
    userAgent: S(i),
  };
};
var C = function mobilePayload(e, r, n, t) {
  return _objectSpread2({}, e, {
    vendor: S(r.vendor),
    model: S(r.model),
    os: S(n.name),
    osVersion: S(n.version),
    ua: S(t),
  });
};
var W = function smartTvPayload(e, r, n, t) {
  return {
    isSmartTV: e,
    engineName: S(r.name),
    engineVersion: S(r.version),
    osName: S(n.name),
    osVersion: S(n.version),
    userAgent: S(t),
  };
};
var I = function consolePayload(e, r, n, t) {
  return {
    isConsole: e,
    engineName: S(r.name),
    engineVersion: S(r.version),
    osName: S(n.name),
    osVersion: S(n.version),
    userAgent: S(t),
  };
};
var M = function wearablePayload(e, r, n, t) {
  return {
    isWearable: e,
    engineName: S(r.name),
    engineVersion: S(r.version),
    osName: S(n.name),
    osVersion: S(n.version),
    userAgent: S(t),
  };
};
var A = function embeddedPayload(e, r, n, t, i) {
  return {
    isEmbedded: e,
    vendor: S(r.vendor),
    model: S(r.model),
    engineName: S(n.name),
    engineVersion: S(n.version),
    osName: S(t.name),
    osVersion: S(t.version),
    userAgent: S(i),
  };
};
function deviceDetect(e) {
  var r = e ? b(e) : p,
    n = r.device,
    t = r.browser,
    i = r.engine,
    a = r.os,
    o = r.ua;
  var s = P(n.type);
  var l = s.isBrowser,
    u = s.isMobile,
    c = s.isTablet,
    d = s.isSmartTV,
    v = s.isConsole,
    f = s.isWearable,
    m = s.isEmbedded;
  return l
    ? _(l, t, i, a, o)
    : d
    ? W(d, i, a, o)
    : v
    ? I(v, i, a, o)
    : u || c
    ? C(s, n, a, o)
    : f
    ? M(f, i, a, o)
    : m
    ? A(m, n, i, a, o)
    : void 0;
}
var j = function isMobileType(e) {
  var r = e.type;
  return r === w.Mobile;
};
var F = function isTabletType(e) {
  var r = e.type;
  return r === w.Tablet;
};
var B = function isMobileAndTabletType(e) {
  var r = e.type;
  return r === w.Mobile || r === w.Tablet;
};
var U = function isSmartTVType(e) {
  var r = e.type;
  return r === w.SmartTv;
};
var D = function isBrowserType(e) {
  var r = e.type;
  return r === w.Browser;
};
var L = function isWearableType(e) {
  var r = e.type;
  return r === w.Wearable;
};
var N = function isConsoleType(e) {
  var r = e.type;
  return r === w.Console;
};
var x = function isEmbeddedType(e) {
  var r = e.type;
  return r === w.Embedded;
};
var k = function getMobileVendor(e) {
  var r = e.vendor;
  return S(r);
};
var z = function getMobileModel(e) {
  var r = e.model;
  return S(r);
};
var Y = function getDeviceType(e) {
  var r = e.type;
  return S(r, "browser");
};
var H = function isAndroidType(e) {
  var r = e.name;
  return r === y.Android;
};
var R = function isWindowsType(e) {
  var r = e.name;
  return r === y.Windows;
};
var K = function isMacOsType(e) {
  var r = e.name;
  return r === y.MAC_OS;
};
var $ = function isWinPhoneType(e) {
  var r = e.name;
  return r === y.WindowsPhone;
};
var q = function isIOSType(e) {
  var r = e.name;
  return r === y.IOS;
};
var G = function getOsVersion(e) {
  var r = e.version;
  return S(r);
};
var J = function getOsName(e) {
  var r = e.name;
  return S(r);
};
var Q = function isChromeType(e) {
  var r = e.name;
  return r === h.Chrome;
};
var X = function isFirefoxType(e) {
  var r = e.name;
  return r === h.Firefox;
};
var Z = function isChromiumType(e) {
  var r = e.name;
  return r === h.Chromium;
};
var ee = function isEdgeType(e) {
  var r = e.name;
  return r === h.Edge;
};
var re = function isYandexType(e) {
  var r = e.name;
  return r === h.Yandex;
};
var ne = function isSafariType(e) {
  var r = e.name;
  return r === h.Safari || r === h.MobileSafari;
};
var te = function isMobileSafariType(e) {
  var r = e.name;
  return r === h.MobileSafari;
};
var ie = function isOperaType(e) {
  var r = e.name;
  return r === h.Opera;
};
var ae = function isIEType(e) {
  var r = e.name;
  return r === h.InternetExplorer || r === h.Ie;
};
var oe = function isMIUIType(e) {
  var r = e.name;
  return r === h.MIUI;
};
var se = function isSamsungBrowserType(e) {
  var r = e.name;
  return r === h.SamsungBrowser;
};
var le = function getBrowserFullVersion(e) {
  var r = e.version;
  return S(r);
};
var ue = function getBrowserVersion(e) {
  var r = e.major;
  return S(r);
};
var ce = function getBrowserName(e) {
  var r = e.name;
  return S(r);
};
var de = function getEngineName(e) {
  var r = e.name;
  return S(r);
};
var ve = function getEngineVersion(e) {
  var r = e.version;
  return S(r);
};
var fe = function isElectronType() {
  var e = V();
  var r = e && e.userAgent && e.userAgent.toLowerCase();
  return "string" === typeof r && /electron/.test(r);
};
var me = function isEdgeChromiumType(e) {
  return "string" === typeof e && -1 !== e.indexOf("Edg/");
};
var ge = function getIOS13() {
  var e = V();
  return (
    e &&
    (/iPad|iPhone|iPod/.test(e.platform) ||
      ("MacIntel" === e.platform && e.maxTouchPoints > 1)) &&
    !window.MSStream
  );
};
var be = function getIPad13() {
  return T("iPad");
};
var pe = function getIphone13() {
  return T("iPhone");
};
var we = function getIPod13() {
  return T("iPod");
};
var he = function getUseragent(e) {
  return S(e);
};
function buildSelectorsObject(e) {
  var r = e || p,
    n = r.device,
    t = r.browser,
    i = r.os,
    a = r.engine,
    o = r.ua;
  return {
    isSmartTV: U(n),
    isConsole: N(n),
    isWearable: L(n),
    isEmbedded: x(n),
    isMobileSafari: te(t) || be(),
    isChromium: Z(t),
    isMobile: B(n) || be(),
    isMobileOnly: j(n),
    isTablet: F(n) || be(),
    isBrowser: D(n),
    isDesktop: D(n),
    isAndroid: H(i),
    isWinPhone: $(i),
    isIOS: q(i) || be(),
    isChrome: Q(t),
    isFirefox: X(t),
    isSafari: ne(t),
    isOpera: ie(t),
    isIE: ae(t),
    osVersion: G(i),
    osName: J(i),
    fullBrowserVersion: le(t),
    browserVersion: ue(t),
    browserName: ce(t),
    mobileVendor: k(n),
    mobileModel: z(n),
    engineName: de(a),
    engineVersion: ve(a),
    getUA: he(o),
    isEdge: ee(t) || me(o),
    isYandex: re(t),
    deviceType: Y(n),
    isIOS13: ge(),
    isIPad13: be(),
    isIPhone13: pe(),
    isIPod13: we(),
    isElectron: fe(),
    isEdgeChromium: me(o),
    isLegacyEdge: ee(t) && !me(o),
    isWindows: R(i),
    isMacOs: K(i),
    isMIUI: oe(t),
    isSamsungBrowser: se(t),
  };
}
var ye = U(d);
var Oe = N(d);
var Pe = L(d);
var Ee = x(d);
var Se = te(u) || be();
var Ve = Z(u);
var Te = B(d) || be();
var _e = j(d);
var Ce = F(d) || be();
var We = D(d);
var Ie = D(d);
var Me = H(f);
var Ae = $(f);
var je = q(f) || be();
var Fe = Q(u);
var Be = X(u);
var Ue = ne(u);
var De = ie(u);
var Le = ae(u);
var Ne = G(f);
var xe = J(f);
var ke = le(u);
var ze = ue(u);
var Ye = ce(u);
var He = k(d);
var Re = z(d);
var Ke = de(v);
var $e = ve(v);
var qe = he(m);
var Ge = ee(u) || me(m);
var Je = re(u);
var Qe = Y(d);
var Xe = ge();
var Ze = be();
var er = pe();
var rr = we();
var nr = fe();
var tr = me(m);
var ir = ee(u) && !me(m);
var ar = R(f);
var or = K(f);
var sr = oe(u);
var lr = se(u);
var ur = function getSelectorsByUserAgent(e) {
  if (e && "string" === typeof e) {
    var r = b(e),
      n = r.device,
      t = r.browser,
      i = r.os,
      a = r.engine,
      o = r.ua;
    return buildSelectorsObject({
      device: n,
      browser: t,
      os: i,
      engine: a,
      ua: o,
    });
  }
  console.error("No valid user agent string was provided");
};
var cr = function AndroidView(e) {
  var r = e.renderWithFragment,
    n = e.children,
    t = _objectWithoutProperties(e, ["renderWithFragment", "children"]);
  return Me
    ? r
      ? o.createElement(a.Fragment, null, n)
      : o.createElement("div", t, n)
    : null;
};
var dr = function BrowserView(e) {
  var r = e.renderWithFragment,
    n = e.children,
    t = _objectWithoutProperties(e, ["renderWithFragment", "children"]);
  return We
    ? r
      ? o.createElement(a.Fragment, null, n)
      : o.createElement("div", t, n)
    : null;
};
var vr = function IEView(e) {
  var r = e.renderWithFragment,
    n = e.children,
    t = _objectWithoutProperties(e, ["renderWithFragment", "children"]);
  return Le
    ? r
      ? o.createElement(a.Fragment, null, n)
      : o.createElement("div", t, n)
    : null;
};
var fr = function IOSView(e) {
  var r = e.renderWithFragment,
    n = e.children,
    t = _objectWithoutProperties(e, ["renderWithFragment", "children"]);
  return je
    ? r
      ? o.createElement(a.Fragment, null, n)
      : o.createElement("div", t, n)
    : null;
};
var mr = function MobileView(e) {
  var r = e.renderWithFragment,
    n = e.children,
    t = _objectWithoutProperties(e, ["renderWithFragment", "children"]);
  return Te
    ? r
      ? o.createElement(a.Fragment, null, n)
      : o.createElement("div", t, n)
    : null;
};
var gr = function TabletView(e) {
  var r = e.renderWithFragment,
    n = e.children,
    t = _objectWithoutProperties(e, ["renderWithFragment", "children"]);
  return Ce
    ? r
      ? o.createElement(a.Fragment, null, n)
      : o.createElement("div", t, n)
    : null;
};
var br = function WinPhoneView(e) {
  var r = e.renderWithFragment,
    n = e.children,
    t = _objectWithoutProperties(e, ["renderWithFragment", "children"]);
  return Ae
    ? r
      ? o.createElement(a.Fragment, null, n)
      : o.createElement("div", t, n)
    : null;
};
var pr = function MobileOnlyView(e) {
  var r = e.renderWithFragment,
    n = e.children,
    t =
      (e.viewClassName,
      e.style,
      _objectWithoutProperties(e, [
        "renderWithFragment",
        "children",
        "viewClassName",
        "style",
      ]));
  return _e
    ? r
      ? o.createElement(a.Fragment, null, n)
      : o.createElement("div", t, n)
    : null;
};
var wr = function SmartTVView(e) {
  var r = e.renderWithFragment,
    n = e.children,
    t = _objectWithoutProperties(e, ["renderWithFragment", "children"]);
  return ye
    ? r
      ? o.createElement(a.Fragment, null, n)
      : o.createElement("div", t, n)
    : null;
};
var hr = function ConsoleView(e) {
  var r = e.renderWithFragment,
    n = e.children,
    t = _objectWithoutProperties(e, ["renderWithFragment", "children"]);
  return Oe
    ? r
      ? o.createElement(a.Fragment, null, n)
      : o.createElement("div", t, n)
    : null;
};
var yr = function WearableView(e) {
  var r = e.renderWithFragment,
    n = e.children,
    t = _objectWithoutProperties(e, ["renderWithFragment", "children"]);
  return Pe
    ? r
      ? o.createElement(a.Fragment, null, n)
      : o.createElement("div", t, n)
    : null;
};
var Or = function CustomView(e) {
  var r = e.renderWithFragment,
    n = e.children,
    t = (e.viewClassName, e.style, e.condition),
    i = _objectWithoutProperties(e, [
      "renderWithFragment",
      "children",
      "viewClassName",
      "style",
      "condition",
    ]);
  return t
    ? r
      ? o.createElement(a.Fragment, null, n)
      : o.createElement("div", i, n)
    : null;
};
function withOrientationChange(e) {
  return (function (r) {
    _inherits(_class, r);
    function _class(e) {
      var r;
      _classCallCheck(this, _class);
      r = _possibleConstructorReturn(
        this,
        _getPrototypeOf(_class).call(this, e)
      );
      r.isEventListenerAdded = false;
      r.handleOrientationChange = r.handleOrientationChange.bind(
        _assertThisInitialized(r)
      );
      r.onOrientationChange = r.onOrientationChange.bind(
        _assertThisInitialized(r)
      );
      r.onPageLoad = r.onPageLoad.bind(_assertThisInitialized(r));
      r.state = { isLandscape: false, isPortrait: false };
      return r;
    }
    _createClass(_class, [
      {
        key: "handleOrientationChange",
        value: function handleOrientationChange() {
          this.isEventListenerAdded || (this.isEventListenerAdded = true);
          var e = window.innerWidth > window.innerHeight ? 90 : 0;
          this.setState({ isPortrait: 0 === e, isLandscape: 90 === e });
        },
      },
      {
        key: "onOrientationChange",
        value: function onOrientationChange() {
          this.handleOrientationChange();
        },
      },
      {
        key: "onPageLoad",
        value: function onPageLoad() {
          this.handleOrientationChange();
        },
      },
      {
        key: "componentDidMount",
        value: function componentDidMount() {
          if (
            void 0 !==
              ("undefined" === typeof window ? "undefined" : _typeof(window)) &&
            Te
          ) {
            if (this.isEventListenerAdded)
              window.removeEventListener("load", this.onPageLoad, false);
            else {
              this.handleOrientationChange();
              window.addEventListener("load", this.onPageLoad, false);
            }
            window.addEventListener("resize", this.onOrientationChange, false);
          }
        },
      },
      {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          window.removeEventListener("resize", this.onOrientationChange, false);
        },
      },
      {
        key: "render",
        value: function render() {
          return o.createElement(
            e,
            _extends({}, this.props, {
              isLandscape: this.state.isLandscape,
              isPortrait: this.state.isPortrait,
            })
          );
        },
      },
    ]);
    return _class;
  })(o.Component);
}
function useMobileOrientation() {
  var e = a.useState(function () {
      var e = window.innerWidth > window.innerHeight ? 90 : 0;
      return {
        isPortrait: 0 === e,
        isLandscape: 90 === e,
        orientation: 0 === e ? "portrait" : "landscape",
      };
    }),
    r = _slicedToArray(e, 2),
    n = r[0],
    t = r[1];
  var i = a.useCallback(
    function () {
      var e = window.innerWidth > window.innerHeight ? 90 : 0;
      var r = {
        isPortrait: 0 === e,
        isLandscape: 90 === e,
        orientation: 0 === e ? "portrait" : "landscape",
      };
      n.orientation !== r.orientation && t(r);
    },
    [n.orientation]
  );
  a.useEffect(
    function () {
      if (
        void 0 !==
          ("undefined" === typeof window ? "undefined" : _typeof(window)) &&
        Te
      ) {
        i();
        window.addEventListener("load", i, false);
        window.addEventListener("resize", i, false);
      }
      return function () {
        window.removeEventListener("resize", i, false);
        window.removeEventListener("load", i, false);
      };
    },
    [i]
  );
  return n;
}
function useDeviceData(e) {
  var r = e || window.navigator.userAgent;
  return b(r);
}
function useDeviceSelectors(e) {
  var r = e || window.navigator.userAgent;
  var n = useDeviceData(r);
  var t = buildSelectorsObject(n);
  return [t, n];
}
i.AndroidView = cr;
i.BrowserTypes = h;
i.BrowserView = dr;
i.ConsoleView = hr;
i.CustomView = Or;
i.IEView = vr;
i.IOSView = fr;
i.MobileOnlyView = pr;
i.MobileView = mr;
i.OsTypes = y;
i.SmartTVView = wr;
i.TabletView = gr;
i.WearableView = yr;
i.WinPhoneView = br;
i.browserName = Ye;
i.browserVersion = ze;
i.deviceDetect = deviceDetect;
i.deviceType = Qe;
i.engineName = Ke;
i.engineVersion = $e;
i.fullBrowserVersion = ke;
i.getSelectorsByUserAgent = ur;
i.getUA = qe;
i.isAndroid = Me;
i.isBrowser = We;
i.isChrome = Fe;
i.isChromium = Ve;
i.isConsole = Oe;
i.isDesktop = Ie;
i.isEdge = Ge;
i.isEdgeChromium = tr;
i.isElectron = nr;
i.isEmbedded = Ee;
i.isFirefox = Be;
i.isIE = Le;
i.isIOS = je;
i.isIOS13 = Xe;
i.isIPad13 = Ze;
i.isIPhone13 = er;
i.isIPod13 = rr;
i.isLegacyEdge = ir;
i.isMIUI = sr;
i.isMacOs = or;
i.isMobile = Te;
i.isMobileOnly = _e;
i.isMobileSafari = Se;
i.isOpera = De;
i.isSafari = Ue;
i.isSamsungBrowser = lr;
i.isSmartTV = ye;
i.isTablet = Ce;
i.isWearable = Pe;
i.isWinPhone = Ae;
i.isWindows = ar;
i.isYandex = Je;
i.mobileModel = Re;
i.mobileVendor = He;
i.osName = xe;
i.osVersion = Ne;
i.parseUserAgent = b;
i.setUserAgent = E;
i.useDeviceData = useDeviceData;
i.useDeviceSelectors = useDeviceSelectors;
i.useMobileOrientation = useMobileOrientation;
i.withOrientationChange = withOrientationChange;
const Pr = i.__esModule;
const Er = i.AndroidView,
  Sr = i.BrowserTypes,
  Vr = i.BrowserView,
  Tr = i.ConsoleView,
  _r = i.CustomView,
  Cr = i.IEView,
  Wr = i.IOSView,
  Ir = i.MobileOnlyView,
  Mr = i.MobileView,
  Ar = i.OsTypes,
  jr = i.SmartTVView,
  Fr = i.TabletView,
  Br = i.WearableView,
  Ur = i.WinPhoneView,
  Dr = i.browserName,
  Lr = i.browserVersion,
  Nr = i.deviceDetect,
  xr = i.deviceType,
  kr = i.engineName,
  zr = i.engineVersion,
  Yr = i.fullBrowserVersion,
  Hr = i.getSelectorsByUserAgent,
  Rr = i.getUA,
  Kr = i.isAndroid,
  $r = i.isBrowser,
  qr = i.isChrome,
  Gr = i.isChromium,
  Jr = i.isConsole,
  Qr = i.isDesktop,
  Xr = i.isEdge,
  Zr = i.isEdgeChromium,
  en = i.isElectron,
  rn = i.isEmbedded,
  nn = i.isFirefox,
  tn = i.isIE,
  an = i.isIOS,
  on = i.isIOS13,
  sn = i.isIPad13,
  ln = i.isIPhone13,
  un = i.isIPod13,
  cn = i.isLegacyEdge,
  dn = i.isMIUI,
  vn = i.isMacOs,
  fn = i.isMobile,
  mn = i.isMobileOnly,
  gn = i.isMobileSafari,
  bn = i.isOpera,
  pn = i.isSafari,
  wn = i.isSamsungBrowser,
  hn = i.isSmartTV,
  yn = i.isTablet,
  On = i.isWearable,
  Pn = i.isWinPhone,
  En = i.isWindows,
  Sn = i.isYandex,
  Vn = i.mobileModel,
  Tn = i.mobileVendor,
  _n = i.osName,
  Cn = i.osVersion,
  Wn = i.parseUserAgent,
  In = i.setUserAgent,
  Mn = i.useDeviceData,
  An = i.useDeviceSelectors,
  jn = i.useMobileOrientation,
  Fn = i.withOrientationChange;
export {
  Er as AndroidView,
  Sr as BrowserTypes,
  Vr as BrowserView,
  Tr as ConsoleView,
  _r as CustomView,
  Cr as IEView,
  Wr as IOSView,
  Ir as MobileOnlyView,
  Mr as MobileView,
  Ar as OsTypes,
  jr as SmartTVView,
  Fr as TabletView,
  Br as WearableView,
  Ur as WinPhoneView,
  Pr as __esModule,
  Dr as browserName,
  Lr as browserVersion,
  i as default,
  Nr as deviceDetect,
  xr as deviceType,
  kr as engineName,
  zr as engineVersion,
  Yr as fullBrowserVersion,
  Hr as getSelectorsByUserAgent,
  Rr as getUA,
  Kr as isAndroid,
  $r as isBrowser,
  qr as isChrome,
  Gr as isChromium,
  Jr as isConsole,
  Qr as isDesktop,
  Xr as isEdge,
  Zr as isEdgeChromium,
  en as isElectron,
  rn as isEmbedded,
  nn as isFirefox,
  tn as isIE,
  an as isIOS,
  on as isIOS13,
  sn as isIPad13,
  ln as isIPhone13,
  un as isIPod13,
  cn as isLegacyEdge,
  dn as isMIUI,
  vn as isMacOs,
  fn as isMobile,
  mn as isMobileOnly,
  gn as isMobileSafari,
  bn as isOpera,
  pn as isSafari,
  wn as isSamsungBrowser,
  hn as isSmartTV,
  yn as isTablet,
  On as isWearable,
  Pn as isWinPhone,
  En as isWindows,
  Sn as isYandex,
  Vn as mobileModel,
  Tn as mobileVendor,
  _n as osName,
  Cn as osVersion,
  Wn as parseUserAgent,
  In as setUserAgent,
  Mn as useDeviceData,
  An as useDeviceSelectors,
  jn as useMobileOrientation,
  Fn as withOrientationChange,
};

//# sourceMappingURL=lib.js.map
