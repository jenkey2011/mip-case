!function(){var t=function(t){var e={};function i(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}return i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(n,r,function(e){return t[e]}.bind(null,r));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/",i(i.s=124)}([function(t,e){t.exports=__mipComponentsWebpackHelpers__["vue-loader/lib/runtime/componentNormalizer"]},function(t,e){var i=t.exports={version:"2.5.7"};"number"==typeof __e&&(__e=i)},function(t,e){var i=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=i)},function(t,e){t.exports=__mipComponentsWebpackHelpers__["css-loader/lib/css-base"]},function(t,e){t.exports=__mipComponentsWebpackHelpers__["vue-style-loader/lib/addStylesClient"]},function(t,e,i){t.exports=!i(7)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e){var i={}.hasOwnProperty;t.exports=function(t,e){return i.call(t,e)}},,function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e,i){var n=i(33),r=i(10);t.exports=function(t){return n(r(t))}},function(t,e){var i=Math.ceil,n=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?n:i)(t)}},,,function(t,e,i){var n=i(21),r=i(28);t.exports=i(5)?function(t,e,i){return n.f(t,e,r(1,i))}:function(t,e,i){return t[e]=i,t}},,,function(t,e,i){var n=i(6);t.exports=function(t){if(!n(t))throw TypeError(t+" is not an object!");return t}},,function(t,e,i){var n=i(23)("keys"),r=i(25);t.exports=function(t){return n[t]||(n[t]=r(t))}},function(t,e,i){var n=i(18),r=i(40),o=i(41),s=Object.defineProperty;e.f=i(5)?Object.defineProperty:function(t,e,i){if(n(t),e=o(e,!0),n(i),r)try{return s(t,e,i)}catch(t){}if("get"in i||"set"in i)throw TypeError("Accessors not supported!");return"value"in i&&(t[e]=i.value),t}},function(t,e){var i={}.toString;t.exports=function(t){return i.call(t).slice(8,-1)}},function(t,e,i){var n=i(1),r=i(2),o=r["__core-js_shared__"]||(r["__core-js_shared__"]={});(t.exports=function(t,e){return o[t]||(o[t]=void 0!==e?e:{})})("versions",[]).push({version:n.version,mode:i(24)?"pure":"global",copyright:"© 2018 Denis Pushkarev (zloirock.ru)"})},function(t,e){t.exports=!0},function(t,e){var i=0,n=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++i+n).toString(36))}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e,i){var n=i(6),r=i(2).document,o=n(r)&&n(r.createElement);t.exports=function(t){return o?r.createElement(t):{}}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},,function(t,e,i){var n=i(10);t.exports=function(t){return Object(n(t))}},function(t,e,i){var n=i(32),r=i(26);t.exports=Object.keys||function(t){return n(t,r)}},function(t,e,i){var n=i(8),r=i(11),o=i(34)(!1),s=i(20)("IE_PROTO");t.exports=function(t,e){var i,a=r(t),u=0,l=[];for(i in a)i!=s&&n(a,i)&&l.push(i);for(;e.length>u;)n(a,i=e[u++])&&(~o(l,i)||l.push(i));return l}},function(t,e,i){var n=i(22);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==n(t)?t.split(""):Object(t)}},function(t,e,i){var n=i(11),r=i(35),o=i(36);t.exports=function(t){return function(e,i,s){var a,u=n(e),l=r(u.length),p=o(s,l);if(t&&i!=i){for(;l>p;)if((a=u[p++])!=a)return!0}else for(;l>p;p++)if((t||p in u)&&u[p]===i)return t||p||0;return!t&&-1}}},function(t,e,i){var n=i(12),r=Math.min;t.exports=function(t){return t>0?r(n(t),9007199254740991):0}},function(t,e,i){var n=i(12),r=Math.max,o=Math.min;t.exports=function(t,e){return(t=n(t))<0?r(t+e,0):o(t,e)}},function(t,e,i){var n=i(2),r=i(1),o=i(38),s=i(15),a=i(8),u=function(t,e,i){var l,p,c,f=t&u.F,d=t&u.G,h=t&u.S,m=t&u.P,v=t&u.B,g=t&u.W,y=d?r:r[e]||(r[e]={}),x=y.prototype,b=d?n:h?n[e]:(n[e]||{}).prototype;for(l in d&&(i=e),i)(p=!f&&b&&void 0!==b[l])&&a(y,l)||(c=p?b[l]:i[l],y[l]=d&&"function"!=typeof b[l]?i[l]:v&&p?o(c,n):g&&b[l]==c?function(t){var e=function(e,i,n){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,i)}return new t(e,i,n)}return t.apply(this,arguments)};return e.prototype=t.prototype,e}(c):m&&"function"==typeof c?o(Function.call,c):c,m&&((y.virtual||(y.virtual={}))[l]=c,t&u.R&&x&&!x[l]&&s(x,l,c)))};u.F=1,u.G=2,u.S=4,u.P=8,u.B=16,u.W=32,u.U=64,u.R=128,t.exports=u},function(t,e,i){var n=i(39);t.exports=function(t,e,i){if(n(t),void 0===e)return t;switch(i){case 1:return function(i){return t.call(e,i)};case 2:return function(i,n){return t.call(e,i,n)};case 3:return function(i,n,r){return t.call(e,i,n,r)}}return function(){return t.apply(e,arguments)}}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e,i){t.exports=!i(5)&&!i(7)(function(){return 7!=Object.defineProperty(i(27)("div"),"a",{get:function(){return 7}}).a})},function(t,e,i){var n=i(6);t.exports=function(t,e){if(!n(t))return t;var i,r;if(e&&"function"==typeof(i=t.toString)&&!n(r=i.call(t)))return r;if("function"==typeof(i=t.valueOf)&&!n(r=i.call(t)))return r;if(!e&&"function"==typeof(i=t.toString)&&!n(r=i.call(t)))return r;throw TypeError("Can't convert object to primitive value")}},,,function(t,e,i){var n=i(23)("wks"),r=i(25),o=i(2).Symbol,s="function"==typeof o;(t.exports=function(t){return n[t]||(n[t]=s&&o[t]||(s?o:r)("Symbol."+t))}).store=n},,,,function(t,e){t.exports=__mipComponentsWebpackHelpers__["babel-runtime/helpers/toConsumableArray"]},,,,function(t,e){t.exports={}},,,,,,,function(t,e,i){var n=i(118);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);(0,i(4).default)("68cd3a1e",n,!1,{})},,,,,,,,function(t,e,i){"use strict";var n=i(24),r=i(37),o=i(106),s=i(15),a=i(52),u=i(107),l=i(68),p=i(111),c=i(44)("iterator"),f=!([].keys&&"next"in[].keys()),d=function(){return this};t.exports=function(t,e,i,h,m,v,g){u(i,e,h);var y,x,b,S=function(t){if(!f&&t in T)return T[t];switch(t){case"keys":case"values":return function(){return new i(this,t)}}return function(){return new i(this,t)}},w=e+" Iterator",_="values"==m,k=!1,T=t.prototype,P=T[c]||T["@@iterator"]||m&&T[m],V=P||S(m),O=m?_?S("entries"):V:void 0,C="Array"==e&&T.entries||P;if(C&&(b=p(C.call(new t)))!==Object.prototype&&b.next&&(l(b,w,!0),n||"function"==typeof b[c]||s(b,c,d)),_&&P&&"values"!==P.name&&(k=!0,V=function(){return P.call(this)}),n&&!g||!f&&!k&&T[c]||s(T,c,V),a[e]=V,a[w]=d,m)if(y={values:_?V:S("values"),keys:v?V:S("keys"),entries:O},g)for(x in y)x in T||o(T,x,y[x]);else r(r.P+r.F*(f||k),e,y);return y}},function(t,e,i){var n=i(21).f,r=i(8),o=i(44)("toStringTag");t.exports=function(t,e,i){t&&!r(t=i?t:t.prototype,o)&&n(t,o,{configurable:!0,value:e})}},,,,,function(t,e,i){t.exports={default:i(101),__esModule:!0}},,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,e,i){i(102),i(112),t.exports=i(114)},function(t,e,i){i(103);for(var n=i(2),r=i(15),o=i(52),s=i(44)("toStringTag"),a="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),u=0;u<a.length;u++){var l=a[u],p=n[l],c=p&&p.prototype;c&&!c[s]&&r(c,s,l),o[l]=o.Array}},function(t,e,i){"use strict";var n=i(104),r=i(105),o=i(52),s=i(11);t.exports=i(67)(Array,"Array",function(t,e){this._t=s(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,i=this._i++;return!t||i>=t.length?(this._t=void 0,r(1)):r(0,"keys"==e?i:"values"==e?t[i]:[i,t[i]])},"values"),o.Arguments=o.Array,n("keys"),n("values"),n("entries")},function(t,e){t.exports=function(){}},function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},function(t,e,i){t.exports=i(15)},function(t,e,i){"use strict";var n=i(108),r=i(28),o=i(68),s={};i(15)(s,i(44)("iterator"),function(){return this}),t.exports=function(t,e,i){t.prototype=n(s,{next:r(1,i)}),o(t,e+" Iterator")}},function(t,e,i){var n=i(18),r=i(109),o=i(26),s=i(20)("IE_PROTO"),a=function(){},u=function(){var t,e=i(27)("iframe"),n=o.length;for(e.style.display="none",i(110).appendChild(e),e.src="javascript:",(t=e.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),u=t.F;n--;)delete u.prototype[o[n]];return u()};t.exports=Object.create||function(t,e){var i;return null!==t?(a.prototype=n(t),i=new a,a.prototype=null,i[s]=t):i=u(),void 0===e?i:r(i,e)}},function(t,e,i){var n=i(21),r=i(18),o=i(31);t.exports=i(5)?Object.defineProperties:function(t,e){r(t);for(var i,s=o(e),a=s.length,u=0;a>u;)n.f(t,i=s[u++],e[i]);return t}},function(t,e,i){var n=i(2).document;t.exports=n&&n.documentElement},function(t,e,i){var n=i(8),r=i(30),o=i(20)("IE_PROTO"),s=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=r(t),n(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?s:null}},function(t,e,i){"use strict";var n=i(113)(!0);i(67)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,i=this._i;return i>=e.length?{value:void 0,done:!0}:(t=n(e,i),this._i+=t.length,{value:t,done:!1})})},function(t,e,i){var n=i(12),r=i(10);t.exports=function(t){return function(e,i){var o,s,a=String(r(e)),u=n(i),l=a.length;return u<0||u>=l?t?"":void 0:(o=a.charCodeAt(u))<55296||o>56319||u+1===l||(s=a.charCodeAt(u+1))<56320||s>57343?t?a.charAt(u):o:t?a.slice(u,u+2):s-56320+(o-55296<<10)+65536}}},function(t,e,i){var n=i(18),r=i(115);t.exports=i(1).getIterator=function(t){var e=r(t);if("function"!=typeof e)throw TypeError(t+" is not iterable!");return n(e.call(t))}},function(t,e,i){var n=i(116),r=i(44)("iterator"),o=i(52);t.exports=i(1).getIteratorMethod=function(t){if(void 0!=t)return t[r]||t["@@iterator"]||o[n(t)]}},function(t,e,i){var n=i(22),r=i(44)("toStringTag"),o="Arguments"==n(function(){return arguments}());t.exports=function(t){var e,i,s;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(i=function(t,e){try{return t[e]}catch(t){}}(e=Object(t),r))?i:o?n(e):"Object"==(s=n(e))&&"function"==typeof e.callee?"Arguments":s}},function(t,e,i){"use strict";var n=i(59);i.n(n).a},function(t,e,i){(t.exports=i(3)(!1)).push([t.i,"\n.mip-slider[data-v-0f50036c] {\n  position: relative;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n.mip-slider.mip-slider-disabled[data-v-0f50036c] {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.mip-slider.mip-slider-disabled .mip-slider-dot[data-v-0f50036c] {\n  cursor: not-allowed;\n}\n.mip-slider .mip-slider-container[data-v-0f50036c] {\n  position: relative;\n  display: block;\n  border-radius: 15px;\n  background-color: #ccc;\n}\n.mip-slider .mip-slider-process[data-v-0f50036c] {\n  position: absolute;\n  border-radius: 15px;\n  background-color: #38f;\n  -webkit-transition: all 0s;\n  transition: all 0s;\n  z-index: 1;\n}\n.mip-slider .mip-slider-process.mip-slider-process-dragable[data-v-0f50036c] {\n  cursor: pointer;\n  z-index: 3;\n}\n.mip-slider.mip-slider-horizontal .mip-slider-process[data-v-0f50036c] {\n  width: 0;\n  height: 100%;\n  top: 0;\n  left: 0;\n}\n.mip-slider.mip-slider-horizontal .mip-slider-dot[data-v-0f50036c] {\n  left: 0;\n}\n.mip-slider.mip-slider-vertical .mip-slider-process[data-v-0f50036c] {\n  width: 100%;\n  height: 0;\n  bottom: 0;\n  left: 0;\n}\n.mip-slider.mip-slider-vertical .mip-slider-dot[data-v-0f50036c] {\n  bottom: 0;\n}\n.mip-slider .mip-slider-dot[data-v-0f50036c] {\n  position: absolute;\n  border-radius: 50%;\n  background-color: #fff;\n  -webkit-box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);\n          box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 0.32);\n  -webkit-transition: all 0s;\n  transition: all 0s;\n  cursor: pointer;\n  z-index: 9;\n}\n.mip-slider .mip-slider-dot.mip-slider-dot-dragging[data-v-0f50036c] {\n  z-index: 5;\n}\n.mip-slider .mip-slider-tip-wrap[data-v-0f50036c] {\n  position: absolute;\n  z-index: 9;\n  display: block;\n  font-size: 14px;\n  white-space: nowrap;\n  padding: 2px 5px;\n  min-width: 20px;\n  text-align: center;\n  color: #fff;\n  border-radius: 5px;\n  background: #000;\n  opacity: 0.5;\n}\n.mip-slider .mip-slider-tip-wrap.hideV[data-v-0f50036c] {\n  visibility: hidden;\n}\n.mip-slider .mip-slider-tip-wrap[data-v-0f50036c]::after {\n  content: '';\n  position: absolute;\n  display: block;\n  width: 0;\n  height: 0;\n  border-style: solid;\n}\n.mip-slider .mip-slider-tip-wrap.mip-slider-tip-top[data-v-0f50036c] {\n  top: -9px;\n  left: 50%;\n  -webkit-transform: translate(-50%, -100%);\n      -ms-transform: translate(-50%, -100%);\n          transform: translate(-50%, -100%);\n}\n.mip-slider .mip-slider-tip-wrap.mip-slider-tip-top[data-v-0f50036c]::after {\n  left: 50%;\n  top: 100%;\n  margin-left: -4px;\n  border-width: 6px 4px 0 4px;\n  border-color: #000 transparent transparent transparent;\n}\n.mip-slider .mip-slider-tip-wrap.mip-slider-tip-bottom[data-v-0f50036c] {\n  bottom: -9px;\n  left: 50%;\n  -webkit-transform: translate(-50%, 100%);\n      -ms-transform: translate(-50%, 100%);\n          transform: translate(-50%, 100%);\n}\n.mip-slider .mip-slider-tip-wrap.mip-slider-tip-bottom[data-v-0f50036c]::after {\n  left: 50%;\n  bottom: 100%;\n  margin-left: -4px;\n  border-width: 0 4px 6px 4px;\n  border-color: transparent transparent #000 transparent;\n}\n.mip-slider .mip-slider-tip-wrap.mip-slider-tip-left[data-v-0f50036c] {\n  top: 50%;\n  left: -9px;\n  -webkit-transform: translate(-100%, -50%);\n      -ms-transform: translate(-100%, -50%);\n          transform: translate(-100%, -50%);\n}\n.mip-slider .mip-slider-tip-wrap.mip-slider-tip-left[data-v-0f50036c]::after {\n  left: 100%;\n  top: 50%;\n  margin-top: -4px;\n  border-width: 4px 0 4px 6px;\n  border-color: transparent transparent transparent #000;\n}\n.mip-slider .mip-slider-tip-wrap.mip-slider-tip-right[data-v-0f50036c] {\n  top: 50%;\n  right: -9px;\n  -webkit-transform: translate(100%, -50%);\n      -ms-transform: translate(100%, -50%);\n          transform: translate(100%, -50%);\n}\n.mip-slider .mip-slider-tip-wrap.mip-slider-tip-right[data-v-0f50036c]::after {\n  right: 100%;\n  top: 50%;\n  margin-top: -4px;\n  border-width: 4px 6px 4px 0;\n  border-color: transparent #000 transparent transparent;\n}\n.mip-slider .mip-slider-range[data-v-0f50036c] {\n  clip: rect(1px, 1px, 1px, 1px);\n  height: 1px;\n  width: 1px;\n  overflow: hidden;\n  position: absolute !important;\n}\n",""])},,,,,,function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{ref:"wrap",class:["mip-slider",t.flowDirection,t.disabledClass,t.stateClass],style:t.wrapStyles,on:{click:function(e){return e.stopPropagation(),t.wrapClick(e)}}},[i("div",{ref:"sliderBar",staticClass:"mip-slider-container",style:[t.elemStyles]},[[i("div",{directives:[{name:"show",rawName:"v-show",value:!t.isSingle,expression:"!isSingle"}],key:"dot0",ref:"dot0",class:[t.tipStatus,"mip-slider-dot"],style:[t.dotStyles,t.customDot],on:{touchstart:function(e){e.stopPropagation(),t.moveStart(e,0)}}},[i("div",{ref:"tip0",class:["mip-slider-tip-"+t.tipDirection,"mip-slider-tip-wrap",{hideV:t.hideV}]},[i("span",{staticClass:"mip-slider-tip"},[t._v(t._s(t.val[0])+"\n          ")])])]),t._v(" "),i("div",{key:"dot1",ref:"dot1",class:[t.tipStatus,"mip-slider-dot"],style:[t.dotStyles,t.customDot],on:{touchstart:function(e){e.stopPropagation(),t.moveStart(e,1)}}},[i("div",{ref:"tip1",class:["mip-slider-tip-"+t.tipDirection,"mip-slider-tip-wrap",{hideV:t.hideV}]},[i("span",{staticClass:"mip-slider-tip"},[t._v(t._s(t.val[1]))])])])],t._v(" "),i("div",{ref:"process",class:["mip-slider-process",{"mip-slider-process-dragable":t.fixRange}],style:t.processStyle,on:{touchstart:function(e){e.stopPropagation(),t.moveStart(e,0,!0)}}},[i("div",{ref:"mergedtip",staticClass:"mip-merged-tip",class:["mip-slider-tip-"+t.tipDirection,"mip-slider-tip-wrap",{hideV:!t.hideV}],style:t.tipMergedPosition},[i("span",{staticClass:"mip-slider-tip"},[t._v("\n          "+t._s(t.val[0]+" - "+t.val[1])+"\n        ")])])]),t._v(" "),i("input",{directives:[{name:"model",rawName:"v-model",value:t.val,expression:"val"}],staticClass:"mip-slider-range",attrs:{min:t.min,max:t.max,type:"range"},domProps:{value:t.val},on:{__r:function(e){t.val=e.target.value}}})],2)])};n._withStripped=!0;var r=i(73),o=i.n(r),s=i(48),a=i.n(s),u=MIP.util.rect,l=MIP.viewport,p={props:{width:{type:[Number,String],default:"auto"},height:{type:[Number,String],default:6},dotSize:{type:Number,default:16},min:{type:Number,default:0},max:{type:Number,default:100},step:{type:Number,default:1},disabled:{type:Boolean,default:!1},tip:{type:[String,Boolean],default:"always"},direction:{type:String,default:"horizontal"},clickable:{type:Boolean,default:!0},speed:{type:Number,default:.2},range:{type:[String,Number,Array],default:0},fixRange:{type:Boolean,default:!1},tipDir:{type:String,default:""},dotColor:{type:String,default:""},processBgColor:{type:[Array,Object],default:function(){return null}},barBgColor:{type:[Array,Object],default:function(){return null}}},data:function(){return{canMove:!1,focusFlag:!1,processDragging:!1,processSign:null,size:0,offset:0,focusSlider:0,currentValue:[0,0],currentSlider:0,hideV:0,legalDir:["left","right","top","bottom"],processStyle:{}}},computed:{isSingle:function(){return Array.isArray(this.range)?0:1},value:function(){return Array.isArray(this.range)?this.range:[0,this.range]},flowDirection:function(){return"mip-slider-"+this.direction},tipMergedPosition:function(){var t=this.tipDirection,e=this.isVertial,i=this.dotSize,n=this.width,r=this.height,o=e?n/2-9:r/2-9,s={};return s[t]=i/-2+o+"px",s},tipDirection:function(){var t=this.isVertial,e=this.tipDir;return this.legalDir.find(function(t){return e===t})||(t?"left":"top")},tipStatus:function(){return"hover"===this.tip&&this.canMove?"mip-slider-always":this.tip?"mip-slider-"+this.tip:""},tipClass:function(){return["mip-slider-tip-"+this.tipDirection,"mip-slider-tip"]},disabledClass:function(){return this.disabled?"mip-slider-disabled":""},stateClass:function(){return{"mip-slider-state-process-drag":this.processDragging,"mip-slider-state-drag":this.canMove&&!this.processDragging,"mip-slider-state-focus":this.focusFlag}},slider:function(){return[this.$refs.dot0,this.$refs.dot1]},val:{get:function(){return this.currentValue},set:function(t){this.currentValue=t}},multiple:function(){var t=(""+this.step).split(".")[1];return t?Math.pow(10,t.length):1},gap:function(){var t=this.min,e=this.max;return this.size/((e-t)/this.step)},position:function(){var t=this.currentValue,e=this.min,i=this.step,n=this.gap;return[(t[0]-e)/i*n,(t[1]-e)/i*n]},limit:function(){var t=this.position,e=this.size;return[[0,t[1]],[t[0],e]]},valueLimit:function(){var t=this.min,e=this.max,i=this.currentValue;return[[t,i[1]],[i[0],e]]},anotherSlider:function(){return 0===this.currentSlider?1:0},isVertial:function(){return"vertical"===this.direction},wrapStyles:function(){var t=this.isVertial,e=this.width,i=this.height,n=this.dotSize;return t?{height:"number"==typeof i?i+"px":i,padding:n/2+"px"}:{width:"number"==typeof e?e+"px":e,padding:n/2+"px"}},elemStyles:function(){var t=this.isVertial,e=this.width,i=this.height;return t?{width:e+"px",height:"100%"}:{height:i+"px"}},dotStyles:function(){var t=this.isVertial,e=this.dotSize,i=this.width,n=this.height;return t?{width:e+"px",height:e+"px",left:-(e-i)/2+"px"}:{width:e+"px",height:e+"px",top:-(e-n)/2+"px"}}},mounted:function(){var t=this;this.$nextTick(function(){t.getStaticData(),t.setValue(t.limitValue(t.value),0),t.setCustomStyle(),t.bindEvents()})},methods:{bindEvents:function(){document.addEventListener("touchmove",this.moving,{passive:!1}),document.addEventListener("touchend",this.moveEnd,{passive:!1}),window.addEventListener("resize",this.refresh),this.$refs.dot0.addEventListener("transitionend",this.tipHit),this.$refs.dot1.addEventListener("transitionend",this.tipHit)},moveStart:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,i=arguments[2],n=this.canMove,r=this.setTransitionTime,o=this.disabled,s=this.fixRange,a=this.isSingle,u=this.position,l=this.getPos;if(n||r(0),o)return!1;if(this.currentSlider=e,i){if(!s||a)return!1;this.processDragging=!0,this.processSign={pos:u,start:l(t.targetTouches&&t.targetTouches[0]?t.targetTouches[0]:t)}}else this.focusFlag=!0,this.focusSlider=e;this.canMove=!0,this.$emit("dragStart",this)},moving:function(t){t.preventDefault();var e=this.canMove,i=this.processDragging,n=this.getPos,r=this.processSign,o=this.setValueOnPos;if(!e)return!1;var s=t.targetTouches&&t.targetTouches[0]?t.targetTouches[0]:t;i?(this.currentSlider=0,o(r.pos[0]+n(s)-r.start,!0),this.currentSlider=1,o(r.pos[1]+n(s)-r.start,!0)):o(n(s),!0),this.tipHit()},moveEnd:function(){var t=this;if(!this.canMove)return!1;this.$emit("dragEnd",this.currentValue),this.canMove=!1,setTimeout(function(){t.processDragging=!1},0),this.setPosition()},setPosition:function(t){var e=this.canMove,i=this.position,n=this.currentSlider,r=this.setTransform,o=this.setTransitionTime;e||o(void 0===t?this.speed:t),r(i[0],1===n),r(i[1],0===n)},setValueOnPos:function(t,e){var i=this.limit,n=this.currentSlider,r=this.gap,o=this.valueLimit,s=this.setTransform,a=this.getValueByIndex,u=this.setCurrentValue,l=i[n],p=o[n],c=1===n;t>=l[0]&&t<=l[1]?(s(t),u(a(Math.round(t/r)),e)):t<l[0]?(s(l[0]),u(p[0]),c&&(this.focusSlider=0,this.currentSlider=0)):(s(l[1]),u(p[1]),c||(this.focusSlider=1,this.currentSlider=1))},getPos:function(t){var e=this.isVertial,i=this.size,n=this.offset;return e?i-(t.pageY-n):t.clientX-n},wrapClick:function(t){var e=this.disabled,i=this.clickable,n=this.processDragging,r=this.position,o=this.setValueOnPos,s=this.isSingle;if(e||!i||n)return!1;var a=t.targetTouches&&t.targetTouches[0]?t.targetTouches[0]:t,u=this.getPos(a);this.currentSlider=s?1:u>(r[1]-r[0])/2+r[0]?1:0,o(u)},setCurrentValue:function(t,e,i){var n=this.min,r=this.max,o=this.anotherSlider,s=this.currentSlider,a=i?o:s;if(t<n||t>r)return!1;this.currentValue.splice(a,1,t),e||this.setPosition()},getValueByIndex:function(t){var e=this.step,i=this.multiple;return(e*i*t+this.min*i)/i},setValue:function(t,e){var i=this.limitValue,n=this.setPosition,r=this.$nextTick;this.val=[].concat(a()(i(t))),r(function(){return n(e)})},setTransform:function(t,e){var i=this.anotherSlider,n=this.currentSlider,r=this.dotSize,o=this.isVertial,s=this.position,a=this.slider,u=e?i:n,l=o?r/2-t:t-r/2,p=o?"translateY("+l+"px)":"translateX("+l+"px)",c=a[u];c.style.transform=p,c.style.WebkitTransform=p;var f=(0===u?s[1]-t:t-s[0])+"px",d=(0===u?t:s[0])+"px";this.processStyle=o?{height:f,bottom:d}:{width:f,left:d}},setTransitionTime:function(t){var e=this.$refs.process,i=!0,n=!1,r=void 0;try{for(var s,a=o()(this.slider);!(i=(s=a.next()).done);i=!0){var u=s.value;u.style.transitionDuration=t+"s",u.style.WebkitTransitionDuration=t+"s"}}catch(t){n=!0,r=t}finally{try{!i&&a.return&&a.return()}finally{if(n)throw r}}e.style.transitionDuration=t+"s",e.style.WebkitTransitionDuration=t+"s"},limitValue:function(t){var e=this.min,i=this.max;return t.map(function(t){return function(t){return t<e?e:t>i?i:t}(t)})},getStaticData:function(){var t=u.getElementRect(this.$refs.sliderBar);this.size=this.isVertial?t.height:t.width,this.offset=this.isVertial?t.top+l.getScrollTop():t.left},setCustomStyle:function(){var t=this.dotColor;(0,this.checkColor)(t)&&(this.customDot={"backgroud-color":t})},refresh:function(){this.getStaticData(),this.setPosition()},tipHit:function(){var t=u.getElementRect(this.$refs.tip0),e=u.getElementRect(this.$refs.tip1),i=!this.isVertial&&t.right>e.left,n=this.isVertial&&e.top+e.height>t.top;this.hideV=i||n?1:0},checkColor:function(t){return"#"===t.charAt(0)?(t=t.substring(1),[3,4,6,8].indexOf(t.length)>-1&&!isNaN(parseInt(t,16))):/^(rgb|hsl)a?\((\d+%?(deg|rad|grad|turn)?[,\s]+){2,3}[\s/]*[\d.]+%?\)$/i.test(t)}}},c=(i(117),i(0)),f=i.n(c)()(p,n,[],!1,null,"0f50036c",null);e.default=f.exports}]);t=t.default||t,MIP["function"==typeof t?"registerCustomElement":"registerVueCustomElement"]("mip-slider",t)}();