(window.MIP = window.MIP || []).push({
    name: "mip-chuangyejia-tabs", func: function () {// ======================
        // mip-chuangyejia-tabs/iscroll.js
        // ======================


        /**
         * @file mip-chuangyejia-nav 组件
         * @author wangqizheng
         */
        (function (window, document, Math) {
            var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame;
            window.msRequestAnimationFrame || function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
            var utils = function () {
                var me = {};
                var elementStyle = document.createElement('div').style;
                var vendor = function () {
                    var vendors = [
                        't',
                        'webkitT',
                        'MozT',
                        'msT',
                        'OT'
                    ];
                    var transform;
                    var i = 0;
                    var l = vendors.length;
                    for (; i < l; i++) {
                        transform = vendors[i] + 'ransform';
                        if (transform in elementStyle) {
                            return vendors[i].substr(0, vendors[i].length - 1);
                        }
                    }
                    return false;
                }();
                function prefixStyle (style) {
                    if (vendor === false) {
                        return false;
                    }
                    if (vendor === '') {
                        return style;
                    }
                    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
                }
                me.getTime = Date.now || function getTime () {
                    return new Date().getTime();
                };
                me.extend = function (target, obj) {
                    for (var i in obj) {
                        target[i] = obj[i];
                    }
                };
                me.addEvent = function (el, type, fn, capture) {
                    el.addEventListener(type, fn, !!capture);
                };
                me.removeEvent = function (el, type, fn, capture) {
                    el.removeEventListener(type, fn, !!capture);
                };
                me.prefixPointerEvent = function (pointerEvent) {
                    var msp = 'MSPointer' + pointerEvent.charAt(7).toUpperCase() + pointerEvent.substr(8);
                    return window.MSPointerEvent ? msp : pointerEvent;
                };
                me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
                    var distance = current - start;
                    var speed = Math.abs(distance) / time;
                    var destination;
                    var duration;
                    deceleration = deceleration === undefined ? 0.0006 : deceleration;
                    destination = current + speed * speed / (2 * deceleration) * (distance < 0 ? -1 : 1);
                    duration = speed / deceleration;
                    if (destination < lowerMargin) {
                        destination = wrapperSize ? lowerMargin - wrapperSize / 2.5 * (speed / 8) : lowerMargin;
                        distance = Math.abs(destination - current);
                        duration = distance / speed;
                    } else if (destination > 0) {
                        destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
                        distance = Math.abs(current) + destination;
                        duration = distance / speed;
                    }
                    return {
                        destination: Math.round(destination),
                        duration: duration
                    };
                };
                var transform = prefixStyle('transform');
                me.extend(me, {
                    hasTransform: transform !== false,
                    hasPerspective: prefixStyle('perspective') in elementStyle,
                    hasTouch: 'ontouchstart' in window,
                    hasPointer: !!(window.PointerEvent || window.MSPointerEvent),
                    // IE10 is prefixed
                    hasTransition: prefixStyle('transition') in elementStyle
                });
                me.isBadAndroid = function () {
                    var appVersion = window.navigator.appVersion;
                    // Android browser is not a chrome browser.
                    if (/Android/.test(appVersion) && !/Chrome\/\d/.test(appVersion)) {
                        var safariVersion = appVersion.match(/Safari\/(\d+.\d)/);
                        if (safariVersion && typeof safariVersion === 'object' && safariVersion.length >= 2) {
                            return parseFloat(safariVersion[1]) < 535.19;
                        }
                    }
                }();
                me.extend(me.style = {}, {
                    transform: transform,
                    transitionTimingFunction: prefixStyle('transitionTimingFunction'),
                    transitionDuration: prefixStyle('transitionDuration'),
                    transitionDelay: prefixStyle('transitionDelay'),
                    transformOrigin: prefixStyle('transformOrigin')
                });
                me.hasClass = function (e, c) {
                    var re = new RegExp('(^|\\s)' + c + '(\\s|$)');
                    return re.test(e.className);
                };
                me.addClass = function (e, c) {
                    if (me.hasClass(e, c)) {
                        return;
                    }
                    var newclass = e.className.split(' ');
                    newclass.push(c);
                    e.className = newclass.join(' ');
                };
                me.removeClass = function (e, c) {
                    if (!me.hasClass(e, c)) {
                        return;
                    }
                    var re = new RegExp('(^|\\s)' + c + '(\\s|$)', 'g');
                    e.className = e.className.replace(re, ' ');
                };
                me.offset = function (el) {
                    var left = -el.offsetLeft;
                    var top = -el.offsetTop;
                    // jshint -W084
                    while (el = el.offsetParent) {
                        left -= el.offsetLeft;
                        top -= el.offsetTop;
                    }
                    // jshint +W084
                    return {
                        left: left,
                        top: top
                    };
                };
                me.preventDefaultException = function (el, exceptions) {
                    for (var i in exceptions) {
                        if (exceptions[i].test(el[i])) {
                            return true;
                        }
                    }
                    return false;
                };
                me.extend(me.eventType = {}, {
                    touchstart: 1,
                    touchmove: 1,
                    touchend: 1,
                    mousedown: 2,
                    mousemove: 2,
                    mouseup: 2,
                    pointerdown: 3,
                    pointermove: 3,
                    pointerup: 3,
                    MSPointerDown: 3,
                    MSPointerMove: 3,
                    MSPointerUp: 3
                });
                me.extend(me.ease = {}, {
                    quadratic: {
                        style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        fn: function (k) {
                            return k * (2 - k);
                        }
                    },
                    circular: {
                        style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
                        // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
                        fn: function (k) {
                            return Math.sqrt(1 - --k * k);
                        }
                    },
                    back: {
                        style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        fn: function (k) {
                            var b = 4;
                            return (k = k - 1) * k * ((b + 1) * k + b) + 1;
                        }
                    },
                    bounce: {
                        style: '',
                        fn: function (k) {
                            if ((k /= 1) < 1 / 2.75) {
                                return 7.5625 * k * k;
                            } else if (k < 2 / 2.75) {
                                return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
                            } else if (k < 2.5 / 2.75) {
                                return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
                            } else {
                                return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
                            }
                        }
                    },
                    elastic: {
                        style: '',
                        fn: function (k) {
                            var f = 0.22;
                            var e = 0.4;
                            if (k === 0) {
                                return 0;
                            }
                            if (k === 1) {
                                return 1;
                            }
                            return e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1;
                        }
                    }
                });
                me.tap = function (e, eventName) {
                    var ev = document.createEvent('Event');
                    ev.initEvent(eventName, true, true);
                    ev.pageX = e.pageX;
                    ev.pageY = e.pageY;
                    e.target.dispatchEvent(ev);
                };
                me.click = function (e) {
                    var target = e.target;
                    var ev;
                    if (!/(SELECT|INPUT|TEXTAREA)/i.test(target.tagName)) {
                        ev = document.createEvent('MouseEvents');
                        ev.initMouseEvent('click', true, true, e.view, 1, target.screenX, target.screenY, target.clientX, target.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
                        ev.constructed = true;
                        target.dispatchEvent(ev);
                    }
                };
                return me;
            }();
            function IScroll (el, options) {
                this.wrapper = typeof el === 'string' ? document.querySelector(el) : el;
                this.scroller = this.wrapper.children[0];
                this.scrollerStyle = this.scroller.style;
                // cache style for better performance
                this.options = {
                    resizeScrollbars: true,
                    mouseWheelSpeed: 20,
                    snapThreshold: 0.334,
                    // INSERT POINT: OPTIONS
                    disablePointer: !utils.hasPointer,
                    disableTouch: utils.hasPointer || !utils.hasTouch,
                    disableMouse: utils.hasPointer || utils.hasTouch,
                    startX: 0,
                    startY: 0,
                    scrollY: true,
                    directionLockThreshold: 5,
                    momentum: true,
                    bounce: true,
                    bounceTime: 600,
                    bounceEasing: '',
                    preventDefault: true,
                    preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },
                    HWCompositing: true,
                    useTransition: true,
                    useTransform: true,
                    bindToWrapper: typeof window.onmousedown === 'undefined'
                };
                for (var i in options) {
                    this.options[i] = options[i];
                }
                // Normalize options
                this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';
                this.options.useTransition = utils.hasTransition && this.options.useTransition;
                this.options.useTransform = utils.hasTransform && this.options.useTransform;
                var overtical = this.options.eventPassthrough;
                this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : overtical;
                this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;
                // If you want eventPassthrough I have to lock one of the axes
                this.options.scrollY = this.options.eventPassthrough === 'vertical' ? false : this.options.scrollY;
                this.options.scrollX = this.options.eventPassthrough === 'horizontal' ? false : this.options.scrollX;
                // With eventPassthrough we also need lockDirection mechanism
                this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
                this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;
                var bou = utils.ease[this.options.bounceEasing] || utils.ease.circular;
                this.options.bounceEasing = typeof this.options.bounceEasing === 'string' ? bou : this.options.bounceEasing;
                this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;
                if (this.options.tap === true) {
                    this.options.tap = 'tap';
                }
                if (this.options.shrinkScrollbars === 'scale') {
                    this.options.useTransition = false;
                }
                this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;
                // INSERT POINT: NORMALIZATION
                // Some defaults
                this.x = 0;
                this.y = 0;
                this.directionX = 0;
                this.directionY = 0;
                this._events = {};
                // INSERT POINT: DEFAULTS
                this.scrollinit();
                this.refresh();
                this.scrollTo(this.options.startX, this.options.startY);
                this.enable();
            }
            IScroll.prototype = {
                version: '5.2.0',
                scrollinit: function () {
                    this.initEvents();
                    if (this.options.scrollbars || this.options.indicators) {
                        this.initIndicators();
                    }
                    if (this.options.mouseWheel) {
                        this.initWheel();
                    }
                    if (this.options.snap) {
                        this.initSnap();
                    }
                    if (this.options.keyBindings) {
                        this.initKeys();
                    }    // INSERT POINT: scrollinit
                },
                destroy: function () {
                    this.initEvents(true);
                    clearTimeout(this.resizeTimeout);
                    this.resizeTimeout = null;
                    this.execEvent('destroy');
                },
                transitionEnd: function (e) {
                    if (e.target !== this.scroller || !this.isInTransition) {
                        return;
                    }
                    this.transitionTime();
                    if (!this.resetPosition(this.options.bounceTime)) {
                        this.isInTransition = false;
                        this.execEvent('scrollEnd');
                    }
                },
                start: function (e) {
                    // React to left mouse button only
                    if (utils.eventType[e.type] !== 1) {
                        // for button property
                        // http://unixpapa.com/js/mouse.html
                        var button;
                        if (!e.which) {
                            button = e.button < 2 ? 0 : e.button === 4 ? 1 : 2;
                        } else {
                            button = e.button;
                        }
                        if (button !== 0) {
                            return;
                        }
                    }
                    if (!this.enabled || this.initiated && utils.eventType[e.type] !== this.initiated) {
                        return;
                    }
                    var oecx = !utils.preventDefaultException(e.target, this.options.preventDefaultException);
                    if (this.options.preventDefault && !utils.isBadAndroid && oecx) {
                        e.preventDefault();
                    }
                    var point = e.touches ? e.touches[0] : e;
                    var pos;
                    this.initiated = utils.eventType[e.type];
                    this.moved = false;
                    this.distX = 0;
                    this.distY = 0;
                    this.directionX = 0;
                    this.directionY = 0;
                    this.directionLocked = 0;
                    this.startTime = utils.getTime();
                    if (this.options.useTransition && this.isInTransition) {
                        this.transitionTime();
                        this.isInTransition = false;
                        pos = this.getComputedPosition();
                        this.translate(Math.round(pos.x), Math.round(pos.y));
                        this.execEvent('scrollEnd');
                    } else if (!this.options.useTransition && this.isAnimating) {
                        this.isAnimating = false;
                        this.execEvent('scrollEnd');
                    }
                    this.startX = this.x;
                    this.startY = this.y;
                    this.absStartX = this.x;
                    this.absStartY = this.y;
                    this.pointX = point.pageX;
                    this.pointY = point.pageY;
                    this.execEvent('beforeScrollStart');
                },
                move: function (e) {
                    if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                        return;
                    }
                    if (this.options.preventDefault) {
                        // increases performance on Android? TODO: check!
                        e.preventDefault();
                    }
                    var point = e.touches ? e.touches[0] : e;
                    var deltaX = point.pageX - this.pointX;
                    var deltaY = point.pageY - this.pointY;
                    var timestamp = utils.getTime();
                    var newX;
                    var newY;
                    var absDistX;
                    var absDistY;
                    this.pointX = point.pageX;
                    this.pointY = point.pageY;
                    this.distX += deltaX;
                    this.distY += deltaY;
                    absDistX = Math.abs(this.distX);
                    absDistY = Math.abs(this.distY);
                    // We need to move at least 10 pixels for the scrolling to initiate
                    if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
                        return;
                    }
                    // If you are scrolling in one direction lock the other
                    if (!this.directionLocked && !this.options.freeScroll) {
                        if (absDistX > absDistY + this.options.directionLockThreshold) {
                            this.directionLocked = 'h';    // lock horizontally
                        } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
                            this.directionLocked = 'v';    // lock vertically
                        } else {
                            this.directionLocked = 'n';    // no lock
                        }
                    }
                    if (this.directionLocked === 'h') {
                        if (this.options.eventPassthrough === 'vertical') {
                            e.preventDefault();
                        } else if (this.options.eventPassthrough === 'horizontal') {
                            this.initiated = false;
                            return;
                        }
                        deltaY = 0;
                    } else if (this.directionLocked === 'v') {
                        if (this.options.eventPassthrough === 'horizontal') {
                            e.preventDefault();
                        } else if (this.options.eventPassthrough === 'vertical') {
                            this.initiated = false;
                            return;
                        }
                        deltaX = 0;
                    }
                    deltaX = this.hasHorizontalScroll ? deltaX : 0;
                    deltaY = this.hasVerticalScroll ? deltaY : 0;
                    newX = this.x + deltaX;
                    newY = this.y + deltaY;
                    // Slow down if outside of the boundaries
                    if (newX > 0 || newX < this.maxScrollX) {
                        newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
                    }
                    if (newY > 0 || newY < this.maxScrollY) {
                        newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
                    }
                    this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
                    this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;
                    if (!this.moved) {
                        this.execEvent('scrollStart');
                    }
                    this.moved = true;
                    this.translate(newX, newY);
                    if (timestamp - this.startTime > 300) {
                        this.startTime = timestamp;
                        this.startX = this.x;
                        this.startY = this.y;
                    }
                },
                end: function (e) {
                    if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                        return;
                    }
                    var deert = !utils.preventDefaultException(e.target, this.options.preventDefaultException);
                    if (this.options.preventDefault && deert) {
                        e.preventDefault();
                    }
                    var point = e.changedTouches ? e.changedTouches[0] : e;
                    var momentumX;
                    var momentumY;
                    var duration = utils.getTime() - this.startTime;
                    var newX = Math.round(this.x);
                    var newY = Math.round(this.y);
                    var distanceX = Math.abs(newX - this.startX);
                    var distanceY = Math.abs(newY - this.startY);
                    var time = 0;
                    var easing = '';
                    this.isInTransition = 0;
                    this.initiated = 0;
                    this.endTime = utils.getTime();
                    // reset if we are outside of the boundaries
                    if (this.resetPosition(this.options.bounceTime)) {
                        return;
                    }
                    this.scrollTo(newX, newY);
                    // ensures that the last position is rounded
                    // we scrolled less than 10 pixels
                    if (!this.moved) {
                        if (this.options.tap) {
                            utils.tap(e, this.options.tap);
                        }
                        if (this.options.click) {
                            utils.click(e);
                        }
                        this.execEvent('scrollCancel');
                        return;
                    }
                    if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
                        this.execEvent('flick');
                        return;
                    }
                    // start momentum animation if needed
                    if (this.options.momentum && duration < 300) {
                        var topI = this.options.bounce ? this.wrapperWidth : 0;
                        var thisOp = this.options.deceleration;
                        var topT = utils.momentum(this.x, this.startX, duration, this.maxScrollX, topI, thisOp);
                        momentumX = this.hasHorizontalScroll ? topT : {
                            destination: newX,
                            duration: 0
                        };
                        var downi = this.options.deceleration;
                        var downp = this.options.bounce ? this.wrapperHeight : 0;
                        var downt = utils.momentum(this.y, this.startY, duration, this.maxScrollY, downp, downi);
                        momentumY = this.hasVerticalScroll ? downt : {
                            destination: newY,
                            duration: 0
                        };
                        newX = momentumX.destination;
                        newY = momentumY.destination;
                        time = Math.max(momentumX.duration, momentumY.duration);
                        this.isInTransition = 1;
                    }
                    if (this.options.snap) {
                        var snap = this.nearestSnap(newX, newY);
                        this.currentPage = snap;
                        time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(newX - snap.x), 1000), Math.min(Math.abs(newY - snap.y), 1000)), 300);
                        newX = snap.x;
                        newY = snap.y;
                        this.directionX = 0;
                        this.directionY = 0;
                        easing = this.options.bounceEasing;
                    }
                    // INSERT POINT: end
                    if (newX !== this.x || newY !== this.y) {
                        // change easing function when scroller goes out of the boundaries
                        if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                            easing = utils.ease.quadratic;
                        }
                        this.scrollTo(newX, newY, time, easing);
                        return;
                    }
                    this.execEvent('scrollEnd');
                },
                resize: function () {
                    var that = this;
                    clearTimeout(this.resizeTimeout);
                    this.resizeTimeout = setTimeout(function () {
                        that.refresh();
                    }, this.options.resizePolling);
                },
                resetPosition: function (time) {
                    var x = this.x;
                    var y = this.y;
                    time = time || 0;
                    if (!this.hasHorizontalScroll || this.x > 0) {
                        x = 0;
                    } else if (this.x < this.maxScrollX) {
                        x = this.maxScrollX;
                    }
                    if (!this.hasVerticalScroll || this.y > 0) {
                        y = 0;
                    } else if (this.y < this.maxScrollY) {
                        y = this.maxScrollY;
                    }
                    if (x === this.x && y === this.y) {
                        return false;
                    }
                    this.scrollTo(x, y, time, this.options.bounceEasing);
                    return true;
                },
                disable: function () {
                    this.enabled = false;
                },
                enable: function () {
                    this.enabled = true;
                },
                refresh: function () {
                    var rf = this.wrapper.offsetHeight;
                    // Force reflow
                    this.wrapperWidth = this.wrapper.clientWidth;
                    this.wrapperHeight = this.wrapper.clientHeight;
                    this.scrollerWidth = this.scroller.offsetWidth;
                    this.scrollerHeight = this.scroller.offsetHeight;
                    this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
                    this.maxScrollY = this.wrapperHeight - this.scrollerHeight;
                    this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
                    this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;
                    if (!this.hasHorizontalScroll) {
                        this.maxScrollX = 0;
                        this.scrollerWidth = this.wrapperWidth;
                    }
                    if (!this.hasVerticalScroll) {
                        this.maxScrollY = 0;
                        this.scrollerHeight = this.wrapperHeight;
                    }
                    this.endTime = 0;
                    this.directionX = 0;
                    this.directionY = 0;
                    this.wrapperOffset = utils.offset(this.wrapper);
                    this.execEvent('refresh');
                    this.resetPosition();    // INSERT POINT: _refresh
                },
                on: function (type, fn) {
                    if (!this._events[type]) {
                        this._events[type] = [];
                    }
                    this._events[type].push(fn);
                },
                off: function (type, fn) {
                    if (!this._events[type]) {
                        return;
                    }
                    var index = this._events[type].indexOf(fn);
                    if (index > -1) {
                        this._events[type].splice(index, 1);
                    }
                },
                execEvent: function (type) {
                    if (!this._events[type]) {
                        return;
                    }
                    var i = 0;
                    var l = this._events[type].length;
                    if (!l) {
                        return;
                    }
                    for (; i < l; i++) {
                        this._events[type][i].apply(this, [].slice.call(arguments, 1));
                    }
                },
                scrollBy: function (x, y, time, easing) {
                    x = this.x + x;
                    y = this.y + y;
                    time = time || 0;
                    this.scrollTo(x, y, time, easing);
                },
                scrollTo: function (x, y, time, easing) {
                    easing = easing || utils.ease.circular;
                    this.isInTransition = this.options.useTransition && time > 0;
                    var transitionType = this.options.useTransition && easing.style;
                    if (!time || transitionType) {
                        if (transitionType) {
                            this.transitionTimingFunction(easing.style);
                            this.transitionTime(time);
                        }
                        this.translate(x, y);
                    } else {
                        this.sanimate(x, y, time, easing.fn);
                    }
                },
                scrollToElement: function (el, time, offsetX, offsetY, easing) {
                    el = el.nodeType ? el : this.scroller.querySelector(el);
                    if (!el) {
                        return;
                    }
                    var pos = utils.offset(el);
                    pos.left -= this.wrapperOffset.left;
                    pos.top -= this.wrapperOffset.top;
                    // if offsetX/Y are true we center the element to the screen
                    if (offsetX === true) {
                        offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
                    }
                    if (offsetY === true) {
                        offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
                    }
                    pos.left -= offsetX || 0;
                    pos.top -= offsetY || 0;
                    pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
                    pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;
                    var mmtl = Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top));
                    time = time === undefined || time === null || time === 'auto' ? mmtl : time;
                    this.scrollTo(pos.left, pos.top, time, easing);
                },
                transitionTime: function (time) {
                    time = time || 0;
                    var durationProp = utils.style.transitionDuration;
                    this.scrollerStyle[durationProp] = time + 'ms';
                    if (!time && utils.isBadAndroid) {
                        this.scrollerStyle[durationProp] = '0.0001ms';
                        // remove 0.0001ms
                        var self = this;
                        rAF(function () {
                            if (self.scrollerStyle[durationProp] === '0.0001ms') {
                                self.scrollerStyle[durationProp] = '0s';
                            }
                        });
                    }
                    if (this.indicators) {
                        for (var i = this.indicators.length; i--;) {
                            this.indicators[i].transitionTime(time);
                        }
                    }    // INSERT POINT: transitionTime
                },
                transitionTimingFunction: function (easing) {
                    this.scrollerStyle[utils.style.transitionTimingFunction] = easing;
                    if (this.indicators) {
                        for (var i = this.indicators.length; i--;) {
                            this.indicators[i].transitionTimingFunction(easing);
                        }
                    }    // INSERT POINT: transitionTimingFunction
                },
                translate: function (x, y) {
                    if (this.options.useTransform) {
                        this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;
                    } else {
                        x = Math.round(x);
                        y = Math.round(y);
                        this.scrollerStyle.left = x + 'px';
                        this.scrollerStyle.top = y + 'px';
                    }
                    this.x = x;
                    this.y = y;
                    if (this.indicators) {
                        for (var i = this.indicators.length; i--;) {
                            this.indicators[i].updatePosition();
                        }
                    }    // INSERT POINT: translate
                },
                initEvents: function (remove) {
                    var eventType = remove ? utils.removeEvent : utils.addEvent;
                    var target = this.options.bindToWrapper ? this.wrapper : window;
                    eventType(window, 'orientationchange', this);
                    eventType(window, 'resize', this);
                    if (this.options.click) {
                        eventType(this.wrapper, 'click', this, true);
                    }
                    if (!this.options.disableMouse) {
                        eventType(this.wrapper, 'mousedown', this);
                        eventType(target, 'mousemove', this);
                        eventType(target, 'mousecancel', this);
                        eventType(target, 'mouseup', this);
                    }
                    if (utils.hasPointer && !this.options.disablePointer) {
                        eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
                        eventType(target, utils.prefixPointerEvent('pointermove'), this);
                        eventType(target, utils.prefixPointerEvent('pointercancel'), this);
                        eventType(target, utils.prefixPointerEvent('pointerup'), this);
                    }
                    if (utils.hasTouch && !this.options.disableTouch) {
                        eventType(this.wrapper, 'touchstart', this);
                        eventType(target, 'touchmove', this);
                        eventType(target, 'touchcancel', this);
                        eventType(target, 'touchend', this);
                    }
                    eventType(this.scroller, 'transitionend', this);
                    eventType(this.scroller, 'webkitTransitionEnd', this);
                    eventType(this.scroller, 'oTransitionEnd', this);
                    eventType(this.scroller, 'MSTransitionEnd', this);
                },
                getComputedPosition: function () {
                    var matrix = window.getComputedStyle(this.scroller, null);
                    var x;
                    var y;
                    if (this.options.useTransform) {
                        matrix = matrix[utils.style.transform].split(')')[0].split(', ');
                        x = +(matrix[12] || matrix[4]);
                        y = +(matrix[13] || matrix[5]);
                    } else {
                        x = +matrix.left.replace(/[^-\d.]/g, '');
                        y = +matrix.top.replace(/[^-\d.]/g, '');
                    }
                    return {
                        x: x,
                        y: y
                    };
                },
                initIndicators: function () {
                    var interactive = this.options.interactiveScrollbars;
                    var customStyle = typeof this.options.scrollbars !== 'string';
                    var indicators = [];
                    var indicator;
                    var that = this;
                    this.indicators = [];
                    if (this.options.scrollbars) {
                        // Vertical scrollbar
                        if (this.options.scrollY) {
                            indicator = {
                                el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
                                interactive: interactive,
                                defaultScrollbars: true,
                                customStyle: customStyle,
                                resize: this.options.resizeScrollbars,
                                shrink: this.options.shrinkScrollbars,
                                fade: this.options.fadeScrollbars,
                                listenX: false
                            };
                            this.wrapper.appendChild(indicator.el);
                            indicators.push(indicator);
                        }
                        // Horizontal scrollbar
                        if (this.options.scrollX) {
                            indicator = {
                                el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
                                interactive: interactive,
                                defaultScrollbars: true,
                                customStyle: customStyle,
                                resize: this.options.resizeScrollbars,
                                shrink: this.options.shrinkScrollbars,
                                fade: this.options.fadeScrollbars,
                                listenY: false
                            };
                            this.wrapper.appendChild(indicator.el);
                            indicators.push(indicator);
                        }
                    }
                    if (this.options.indicators) {
                        // TODO: check concat compatibility
                        indicators = indicators.concat(this.options.indicators);
                    }
                    for (var i = indicators.length; i--;) {
                        this.indicators.push(new Indicator(this, indicators[i]));
                    }
                    // TODO: check if we can use array.map (wide compatibility and performance issues)
                    function indicatorsMap (fn) {
                        if (that.indicators) {
                            for (var i = that.indicators.length; i--;) {
                                fn.call(that.indicators[i]);
                            }
                        }
                    }
                    if (this.options.fadeScrollbars) {
                        this.on('scrollEnd', function () {
                            indicatorsMap(function () {
                                this.fade();
                            });
                        });
                        this.on('scrollCancel', function () {
                            indicatorsMap(function () {
                                this.fade();
                            });
                        });
                        this.on('scrollStart', function () {
                            indicatorsMap(function () {
                                this.fade(1);
                            });
                        });
                        this.on('beforeScrollStart', function () {
                            indicatorsMap(function () {
                                this.fade(1, true);
                            });
                        });
                    }
                    this.on('refresh', function () {
                        indicatorsMap(function () {
                            this.refresh();
                        });
                    });
                    this.on('destroy', function () {
                        indicatorsMap(function () {
                            this.destroy();
                        });
                        delete this.indicators;
                    });
                },
                initWheel: function () {
                    utils.addEvent(this.wrapper, 'wheel', this);
                    utils.addEvent(this.wrapper, 'mousewheel', this);
                    utils.addEvent(this.wrapper, 'DOMMouseScroll', this);
                    this.on('destroy', function () {
                        clearTimeout(this.wheelTimeout);
                        this.wheelTimeout = null;
                        utils.removeEvent(this.wrapper, 'wheel', this);
                        utils.removeEvent(this.wrapper, 'mousewheel', this);
                        utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
                    });
                },
                wheel: function (e) {
                    if (!this.enabled) {
                        return;
                    }
                    e.preventDefault();
                    var wheelDeltaX;
                    var wheelDeltaY;
                    var newX;
                    var newY;
                    var that = this;
                    if (this.wheelTimeout === undefined) {
                        that.execEvent('scrollStart');
                    }
                    // Execute the scrollEnd event after 400ms the wheel stopped scrolling
                    clearTimeout(this.wheelTimeout);
                    this.wheelTimeout = setTimeout(function () {
                        if (!that.options.snap) {
                            that.execEvent('scrollEnd');
                        }
                        that.wheelTimeout = undefined;
                    }, 400);
                    if ('deltaX' in e) {
                        if (e.deltaMode === 1) {
                            wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
                            wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed;
                        } else {
                            wheelDeltaX = -e.deltaX;
                            wheelDeltaY = -e.deltaY;
                        }
                    } else if ('wheelDeltaX' in e) {
                        wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
                        wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
                    } else if ('wheelDelta' in e) {
                        wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
                    } else if ('detail' in e) {
                        wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
                    } else {
                        return;
                    }
                    wheelDeltaX *= this.options.invertWheelDirection;
                    wheelDeltaY *= this.options.invertWheelDirection;
                    if (!this.hasVerticalScroll) {
                        wheelDeltaX = wheelDeltaY;
                        wheelDeltaY = 0;
                    }
                    if (this.options.snap) {
                        newX = this.currentPage.pageX;
                        newY = this.currentPage.pageY;
                        if (wheelDeltaX > 0) {
                            newX--;
                        } else if (wheelDeltaX < 0) {
                            newX++;
                        }
                        if (wheelDeltaY > 0) {
                            newY--;
                        } else if (wheelDeltaY < 0) {
                            newY++;
                        }
                        this.goToPage(newX, newY);
                        return;
                    }
                    newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
                    newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);
                    this.directionX = wheelDeltaX > 0 ? -1 : wheelDeltaX < 0 ? 1 : 0;
                    this.directionY = wheelDeltaY > 0 ? -1 : wheelDeltaY < 0 ? 1 : 0;
                    if (newX > 0) {
                        newX = 0;
                    } else if (newX < this.maxScrollX) {
                        newX = this.maxScrollX;
                    }
                    if (newY > 0) {
                        newY = 0;
                    } else if (newY < this.maxScrollY) {
                        newY = this.maxScrollY;
                    }
                    this.scrollTo(newX, newY, 0);    // INSERT POINT: wheel
                },
                initSnap: function () {
                    this.currentPage = {};
                    if (typeof this.options.snap === 'string') {
                        this.options.snap = this.scroller.querySelectorAll(this.options.snap);
                    }
                    this.on('refresh', function () {
                        var i = 0;
                        var l;
                        var m = 0;
                        var n;
                        var cx;
                        var cy;
                        var x = 0;
                        var y;
                        var stepX = this.options.snapStepX || this.wrapperWidth;
                        var stepY = this.options.snapStepY || this.wrapperHeight;
                        var el;
                        this.pages = [];
                        if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
                            return;
                        }
                        if (this.options.snap === true) {
                            cx = Math.round(stepX / 2);
                            cy = Math.round(stepY / 2);
                            while (x > -this.scrollerWidth) {
                                this.pages[i] = [];
                                l = 0;
                                y = 0;
                                while (y > -this.scrollerHeight) {
                                    this.pages[i][l] = {
                                        x: Math.max(x, this.maxScrollX),
                                        y: Math.max(y, this.maxScrollY),
                                        width: stepX,
                                        height: stepY,
                                        cx: x - cx,
                                        cy: y - cy
                                    };
                                    y -= stepY;
                                    l++;
                                }
                                x -= stepX;
                                i++;
                            }
                        } else {
                            el = this.options.snap;
                            l = el.length;
                            n = -1;
                            for (; i < l; i++) {
                                if (i === 0 || el[i].offsetLeft <= el[i - 1].offsetLeft) {
                                    m = 0;
                                    n++;
                                }
                                if (!this.pages[m]) {
                                    this.pages[m] = [];
                                }
                                x = Math.max(-el[i].offsetLeft, this.maxScrollX);
                                y = Math.max(-el[i].offsetTop, this.maxScrollY);
                                cx = x - Math.round(el[i].offsetWidth / 2);
                                cy = y - Math.round(el[i].offsetHeight / 2);
                                this.pages[m][n] = {
                                    x: x,
                                    y: y,
                                    width: el[i].offsetWidth,
                                    height: el[i].offsetHeight,
                                    cx: cx,
                                    cy: cy
                                };
                                if (x > this.maxScrollX) {
                                    m++;
                                }
                            }
                        }
                        this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);
                        // Update snap threshold if needed
                        if (this.options.snapThreshold % 1 === 0) {
                            this.snapThresholdX = this.options.snapThreshold;
                            this.snapThresholdY = this.options.snapThreshold;
                        } else {
                            var cpw = this.pages[this.currentPage.pageX][this.currentPage.pageY].width;
                            this.snapThresholdX = Math.round(cpw * this.options.snapThreshold);
                            var cpd = this.pages[this.currentPage.pageX][this.currentPage.pageY].height;
                            this.snapThresholdY = Math.round(cpd * this.options.snapThreshold);
                        }
                    });
                    this.on('flick', function () {
                        var time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(this.x - this.startX), 1000), Math.min(Math.abs(this.y - this.startY), 1000)), 300);
                        this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, time);
                    });
                },
                nearestSnap: function (x, y) {
                    if (!this.pages.length) {
                        return {
                            x: 0,
                            y: 0,
                            pageX: 0,
                            pageY: 0
                        };
                    }
                    var i = 0;
                    var l = this.pages.length;
                    var m = 0;
                    // Check if we exceeded the snap threshold
                    if (Math.abs(x - this.absStartX) < this.snapThresholdX && Math.abs(y - this.absStartY) < this.snapThresholdY) {
                        return this.currentPage;
                    }
                    if (x > 0) {
                        x = 0;
                    } else if (x < this.maxScrollX) {
                        x = this.maxScrollX;
                    }
                    if (y > 0) {
                        y = 0;
                    } else if (y < this.maxScrollY) {
                        y = this.maxScrollY;
                    }
                    for (; i < l; i++) {
                        if (x >= this.pages[i][0].cx) {
                            x = this.pages[i][0].x;
                            break;
                        }
                    }
                    l = this.pages[i].length;
                    for (; m < l; m++) {
                        if (y >= this.pages[0][m].cy) {
                            y = this.pages[0][m].y;
                            break;
                        }
                    }
                    if (i === this.currentPage.pageX) {
                        i += this.directionX;
                        if (i < 0) {
                            i = 0;
                        } else if (i >= this.pages.length) {
                            i = this.pages.length - 1;
                        }
                        x = this.pages[i][0].x;
                    }
                    if (m === this.currentPage.pageY) {
                        m += this.directionY;
                        if (m < 0) {
                            m = 0;
                        } else if (m >= this.pages[0].length) {
                            m = this.pages[0].length - 1;
                        }
                        y = this.pages[0][m].y;
                    }
                    return {
                        x: x,
                        y: y,
                        pageX: i,
                        pageY: m
                    };
                },
                goToPage: function (x, y, time, easing) {
                    easing = easing || this.options.bounceEasing;
                    if (x >= this.pages.length) {
                        x = this.pages.length - 1;
                    } else if (x < 0) {
                        x = 0;
                    }
                    if (y >= this.pages[x].length) {
                        y = this.pages[x].length - 1;
                    } else if (y < 0) {
                        y = 0;
                    }
                    var posX = this.pages[x][y].x;
                    var posY = this.pages[x][y].y;
                    time = time === undefined ? this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(posX - this.x), 1000), Math.min(Math.abs(posY - this.y), 1000)), 300) : time;
                    this.currentPage = {
                        x: posX,
                        y: posY,
                        pageX: x,
                        pageY: y
                    };
                    this.scrollTo(posX, posY, time, easing);
                },
                next: function (time, easing) {
                    var x = this.currentPage.pageX;
                    var y = this.currentPage.pageY;
                    x++;
                    if (x >= this.pages.length && this.hasVerticalScroll) {
                        x = 0;
                        y++;
                    }
                    this.goToPage(x, y, time, easing);
                },
                prev: function (time, easing) {
                    var x = this.currentPage.pageX;
                    var y = this.currentPage.pageY;
                    x--;
                    if (x < 0 && this.hasVerticalScroll) {
                        x = 0;
                        y--;
                    }
                    this.goToPage(x, y, time, easing);
                },
                initKeys: function (e) {
                    // default key bindings
                    var keys = {
                        pageUp: 33,
                        pageDown: 34,
                        end: 35,
                        home: 36,
                        left: 37,
                        up: 38,
                        right: 39,
                        down: 40
                    };
                    var i;
                    // if you give me characters I give you keycode
                    if (typeof this.options.keyBindings === 'object') {
                        for (i in this.options.keyBindings) {
                            if (typeof this.options.keyBindings[i] === 'string') {
                                this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
                            }
                        }
                    } else {
                        this.options.keyBindings = {};
                    }
                    for (i in keys) {
                        this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
                    }
                    utils.addEvent(window, 'keydown', this);
                    this.on('destroy', function () {
                        utils.removeEvent(window, 'keydown', this);
                    });
                },
                skey: function (e) {
                    if (!this.enabled) {
                        return;
                    }
                    var snap = this.options.snap;
                    var newX = snap ? this.currentPage.pageX : this.x;
                    var newY = snap ? this.currentPage.pageY : this.y;
                    var now = utils.getTime();
                    var prevTime = this.keyTime || 0;
                    var acceleration = 0.25;
                    var pos;
                    if (this.options.useTransition && this.isInTransition) {
                        pos = this.getComputedPosition();
                        this.translate(Math.round(pos.x), Math.round(pos.y));
                        this.isInTransition = false;
                    }
                    this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;
                    switch (e.keyCode) {
                        case this.options.keyBindings.pageUp:
                            if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                                newX += snap ? 1 : this.wrapperWidth;
                            } else {
                                newY += snap ? 1 : this.wrapperHeight;
                            }
                            break;
                        case this.options.keyBindings.pageDown:
                            if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                                newX -= snap ? 1 : this.wrapperWidth;
                            } else {
                                newY -= snap ? 1 : this.wrapperHeight;
                            }
                            break;
                        case this.options.keyBindings.end:
                            newX = snap ? this.pages.length - 1 : this.maxScrollX;
                            newY = snap ? this.pages[0].length - 1 : this.maxScrollY;
                            break;
                        case this.options.keyBindings.home:
                            newX = 0;
                            newY = 0;
                            break;
                        case this.options.keyBindings.left:
                            newX += snap ? -1 : 5 + this.keyAcceleration >> 0;
                            break;
                        case this.options.keyBindings.up:
                            newY += snap ? 1 : 5 + this.keyAcceleration >> 0;
                            break;
                        case this.options.keyBindings.right:
                            newX -= snap ? -1 : 5 + this.keyAcceleration >> 0;
                            break;
                        case this.options.keyBindings.down:
                            newY -= snap ? 1 : 5 + this.keyAcceleration >> 0;
                            break;
                        default:
                            return;
                    }
                    if (snap) {
                        this.goToPage(newX, newY);
                        return;
                    }
                    if (newX > 0) {
                        newX = 0;
                        this.keyAcceleration = 0;
                    } else if (newX < this.maxScrollX) {
                        newX = this.maxScrollX;
                        this.keyAcceleration = 0;
                    }
                    if (newY > 0) {
                        newY = 0;
                        this.keyAcceleration = 0;
                    } else if (newY < this.maxScrollY) {
                        newY = this.maxScrollY;
                        this.keyAcceleration = 0;
                    }
                    this.scrollTo(newX, newY, 0);
                    this.keyTime = now;
                },
                sanimate: function (destX, destY, duration, easingFn) {
                    var that = this;
                    var startX = this.x;
                    var startY = this.y;
                    var startTime = utils.getTime();
                    var destTime = startTime + duration;
                    function step () {
                        var now = utils.getTime();
                        var newX;
                        var newY;
                        var easing;
                        if (now >= destTime) {
                            that.isAnimating = false;
                            that.translate(destX, destY);
                            if (!that.resetPosition(that.options.bounceTime)) {
                                that.execEvent('scrollEnd');
                            }
                            return;
                        }
                        now = (now - startTime) / duration;
                        easing = easingFn(now);
                        newX = (destX - startX) * easing + startX;
                        newY = (destY - startY) * easing + startY;
                        that.translate(newX, newY);
                        if (that.isAnimating) {
                            rAF(step);
                        }
                    }
                    this.isAnimating = true;
                    step();
                },
                handleEvent: function (e) {
                    switch (e.type) {
                        case 'touchstart':
                        case 'pointerdown':
                        case 'MSPointerDown':
                        case 'mousedown':
                            this.start(e);
                            break;
                        case 'touchmove':
                        case 'pointermove':
                        case 'MSPointerMove':
                        case 'mousemove':
                            this.move(e);
                            break;
                        case 'touchend':
                        case 'pointerup':
                        case 'MSPointerUp':
                        case 'mouseup':
                        case 'touchcancel':
                        case 'pointercancel':
                        case 'MSPointerCancel':
                        case 'mousecancel':
                            this.end(e);
                            break;
                        case 'orientationchange':
                        case 'resize':
                            this.resize();
                            break;
                        case 'transitionend':
                        case 'webkitTransitionEnd':
                        case 'oTransitionEnd':
                        case 'MSTransitionEnd':
                            this.transitionEnd(e);
                            break;
                        case 'wheel':
                        case 'DOMMouseScroll':
                        case 'mousewheel':
                            this.wheel(e);
                            break;
                        case 'keydown':
                            this.skey(e);
                            break;
                        case 'click':
                            if (this.enabled && !e.constructed) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            break;
                    }
                }
            };
            function createDefaultScrollbar (direction, interactive, type) {
                var scrollbar = document.createElement('div');
                var indicator = document.createElement('div');
                if (type === true) {
                    scrollbar.style.cssText = 'position:absolute;z-index:9999';
                    var styleStr = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;' + 'box-sizing:border-box;position:absolute;' + 'background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
                    indicator.style.cssText = styleStr;
                }
                indicator.className = 'iScrollIndicator';
                if (direction === 'h') {
                    if (type === true) {
                        scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
                        indicator.style.height = '100%';
                    }
                    scrollbar.className = 'iScrollHorizontalScrollbar';
                } else {
                    if (type === true) {
                        scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
                        indicator.style.width = '100%';
                    }
                    scrollbar.className = 'iScrollVerticalScrollbar';
                }
                scrollbar.style.cssText += ';overflow:hidden';
                if (!interactive) {
                    scrollbar.style.pointerEvents = 'none';
                }
                scrollbar.appendChild(indicator);
                return scrollbar;
            }
            function Indicator (scroller, options) {
                this.wrapper = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
                this.wrapperStyle = this.wrapper.style;
                this.indicator = this.wrapper.children[0];
                this.indicatorStyle = this.indicator.style;
                this.scroller = scroller;
                this.options = {
                    listenX: true,
                    listenY: true,
                    interactive: false,
                    resize: true,
                    defaultScrollbars: false,
                    shrink: false,
                    fade: false,
                    speedRatioX: 0,
                    speedRatioY: 0
                };
                for (var i in options) {
                    this.options[i] = options[i];
                }
                this.sizeRatioX = 1;
                this.sizeRatioY = 1;
                this.maxPosX = 0;
                this.maxPosY = 0;
                if (this.options.interactive) {
                    if (!this.options.disableTouch) {
                        utils.addEvent(this.indicator, 'touchstart', this);
                        utils.addEvent(window, 'touchend', this);
                    }
                    if (!this.options.disablePointer) {
                        utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                        utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
                    }
                    if (!this.options.disableMouse) {
                        utils.addEvent(this.indicator, 'mousedown', this);
                        utils.addEvent(window, 'mouseup', this);
                    }
                }
                if (this.options.fade) {
                    this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
                    var durationProp = utils.style.transitionDuration;
                    this.wrapperStyle[durationProp] = utils.isBadAndroid ? '0.0001ms' : '0ms';
                    // remove 0.0001ms
                    var self = this;
                    if (utils.isBadAndroid) {
                        rAF(function () {
                            if (self.wrapperStyle[durationProp] === '0.0001ms') {
                                self.wrapperStyle[durationProp] = '0s';
                            }
                        });
                    }
                    this.wrapperStyle.opacity = '0';
                }
            }
            Indicator.prototype = {
                handleEvent: function (e) {
                    switch (e.type) {
                        case 'touchstart':
                        case 'pointerdown':
                        case 'MSPointerDown':
                        case 'mousedown':
                            this.start(e);
                            break;
                        case 'touchmove':
                        case 'pointermove':
                        case 'MSPointerMove':
                        case 'mousemove':
                            this.move(e);
                            break;
                        case 'touchend':
                        case 'pointerup':
                        case 'MSPointerUp':
                        case 'mouseup':
                        case 'touchcancel':
                        case 'pointercancel':
                        case 'MSPointerCancel':
                        case 'mousecancel':
                            this.end(e);
                            break;
                    }
                },
                destroy: function () {
                    if (this.options.fadeScrollbars) {
                        clearTimeout(this.fadeTimeout);
                        this.fadeTimeout = null;
                    }
                    if (this.options.interactive) {
                        utils.removeEvent(this.indicator, 'touchstart', this);
                        utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                        utils.removeEvent(this.indicator, 'mousedown', this);
                        utils.removeEvent(window, 'touchmove', this);
                        utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
                        utils.removeEvent(window, 'mousemove', this);
                        utils.removeEvent(window, 'touchend', this);
                        utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
                        utils.removeEvent(window, 'mouseup', this);
                    }
                    if (this.options.defaultScrollbars) {
                        this.wrapper.parentNode.removeChild(this.wrapper);
                    }
                },
                start: function (e) {
                    var point = e.touches ? e.touches[0] : e;
                    e.preventDefault();
                    e.stopPropagation();
                    this.transitionTime();
                    this.initiated = true;
                    this.moved = false;
                    this.lastPointX = point.pageX;
                    this.lastPointY = point.pageY;
                    this.startTime = utils.getTime();
                    if (!this.options.disableTouch) {
                        utils.addEvent(window, 'touchmove', this);
                    }
                    if (!this.options.disablePointer) {
                        utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
                    }
                    if (!this.options.disableMouse) {
                        utils.addEvent(window, 'mousemove', this);
                    }
                    this.scroller.execEvent('beforeScrollStart');
                },
                move: function (e) {
                    var point = e.touches ? e.touches[0] : e;
                    var deltaX;
                    var deltaY;
                    var newX;
                    var newY;
                    var timestamp = utils.getTime();
                    if (!this.moved) {
                        this.scroller.execEvent('scrollStart');
                    }
                    this.moved = true;
                    deltaX = point.pageX - this.lastPointX;
                    this.lastPointX = point.pageX;
                    deltaY = point.pageY - this.lastPointY;
                    this.lastPointY = point.pageY;
                    newX = this.x + deltaX;
                    newY = this.y + deltaY;
                    this.spos(newX, newY);
                    // INSERT POINT: indicator.move
                    e.preventDefault();
                    e.stopPropagation();
                },
                end: function (e) {
                    if (!this.initiated) {
                        return;
                    }
                    this.initiated = false;
                    e.preventDefault();
                    e.stopPropagation();
                    utils.removeEvent(window, 'touchmove', this);
                    utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
                    utils.removeEvent(window, 'mousemove', this);
                    if (this.scroller.options.snap) {
                        var snap = this.scroller.nearestSnap(this.scroller.x, this.scroller.y);
                        var time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(this.scroller.x - snap.x), 1000), Math.min(Math.abs(this.scroller.y - snap.y), 1000)), 300);
                        if (this.scroller.x !== snap.x || this.scroller.y !== snap.y) {
                            this.scroller.directionX = 0;
                            this.scroller.directionY = 0;
                            this.scroller.currentPage = snap;
                            this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
                        }
                    }
                    if (this.moved) {
                        this.scroller.execEvent('scrollEnd');
                    }
                },
                transitionTime: function (time) {
                    time = time || 0;
                    var durationProp = utils.style.transitionDuration;
                    this.indicatorStyle[durationProp] = time + 'ms';
                    if (!time && utils.isBadAndroid) {
                        this.indicatorStyle[durationProp] = '0.0001ms';
                        // remove 0.0001ms
                        var self = this;
                        rAF(function () {
                            if (self.indicatorStyle[durationProp] === '0.0001ms') {
                                self.indicatorStyle[durationProp] = '0s';
                            }
                        });
                    }
                },
                transitionTimingFunction: function (easing) {
                    this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
                },
                refresh: function () {
                    this.transitionTime();
                    if (this.options.listenX && !this.options.listenY) {
                        this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
                    } else if (this.options.listenY && !this.options.listenX) {
                        this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
                    } else {
                        var leftI = this.scroller.hasHorizontalScroll;
                        this.indicatorStyle.display = leftI || this.scroller.hasVerticalScroll ? 'block' : 'none';
                    }
                    if (this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll) {
                        utils.addClass(this.wrapper, 'iScrollBothScrollbars');
                        utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');
                        if (this.options.defaultScrollbars && this.options.customStyle) {
                            if (this.options.listenX) {
                                this.wrapper.style.right = '8px';
                            } else {
                                this.wrapper.style.bottom = '8px';
                            }
                        }
                    } else {
                        utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
                        utils.addClass(this.wrapper, 'iScrollLoneScrollbar');
                        if (this.options.defaultScrollbars && this.options.customStyle) {
                            if (this.options.listenX) {
                                this.wrapper.style.right = '2px';
                            } else {
                                this.wrapper.style.bottom = '2px';
                            }
                        }
                    }
                    var r = this.wrapper.offsetHeight;
                    // force refresh
                    if (this.options.listenX) {
                        this.wrapperWidth = this.wrapper.clientWidth;
                        if (this.options.resize) {
                            var wrapperWidth = this.wrapperWidth * this.wrapperWidth;
                            var wrapperSr = this.scroller.scrollerWidth;
                            var wrapperSt = this.wrapperWidth;
                            this.indicatorWidth = Math.max(Math.round(wrapperWidth / (wrapperSr || wrapperSt || 1)), 8);
                            this.indicatorStyle.width = this.indicatorWidth + 'px';
                        } else {
                            this.indicatorWidth = this.indicator.clientWidth;
                        }
                        this.maxPosX = this.wrapperWidth - this.indicatorWidth;
                        if (this.options.shrink === 'clip') {
                            this.minBoundaryX = -this.indicatorWidth + 8;
                            this.maxBoundaryX = this.wrapperWidth - 8;
                        } else {
                            this.minBoundaryX = 0;
                            this.maxBoundaryX = this.maxPosX;
                        }
                        var scmax = this.scroller.maxScrollX;
                        this.sizeRatioX = this.options.speedRatioX || scmax && this.maxPosX / this.scroller.maxScrollX;
                    }
                    if (this.options.listenY) {
                        this.wrapperHeight = this.wrapper.clientHeight;
                        if (this.options.resize) {
                            var wtw = this.wrapperHeight * this.wrapperHeight;
                            var tss = this.scroller.scrollerHeight;
                            this.indicatorHeight = Math.max(Math.round(wtw / (tss || this.wrapperHeight || 1)), 8);
                            this.indicatorStyle.height = this.indicatorHeight + 'px';
                        } else {
                            this.indicatorHeight = this.indicator.clientHeight;
                        }
                        this.maxPosY = this.wrapperHeight - this.indicatorHeight;
                        if (this.options.shrink === 'clip') {
                            this.minBoundaryY = -this.indicatorHeight + 8;
                            this.maxBoundaryY = this.wrapperHeight - 8;
                        } else {
                            this.minBoundaryY = 0;
                            this.maxBoundaryY = this.maxPosY;
                        }
                        var tos = this.options.speedRatioY;
                        this.maxPosY = this.wrapperHeight - this.indicatorHeight;
                        this.sizeRatioY = tos || this.scroller.maxScrollY && this.maxPosY / this.scroller.maxScrollY;
                    }
                    this.updatePosition();
                },
                updatePosition: function () {
                    var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0;
                    var y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;
                    if (!this.options.ignoreBoundaries) {
                        if (x < this.minBoundaryX) {
                            if (this.options.shrink === 'scale') {
                                this.width = Math.max(this.indicatorWidth + x, 8);
                                this.indicatorStyle.width = this.width + 'px';
                            }
                            x = this.minBoundaryX;
                        } else if (x > this.maxBoundaryX) {
                            if (this.options.shrink === 'scale') {
                                this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
                                this.indicatorStyle.width = this.width + 'px';
                                x = this.maxPosX + this.indicatorWidth - this.width;
                            } else {
                                x = this.maxBoundaryX;
                            }
                        } else if (this.options.shrink === 'scale' && this.width !== this.indicatorWidth) {
                            this.width = this.indicatorWidth;
                            this.indicatorStyle.width = this.width + 'px';
                        }
                        if (y < this.minBoundaryY) {
                            if (this.options.shrink === 'scale') {
                                this.height = Math.max(this.indicatorHeight + y * 3, 8);
                                this.indicatorStyle.height = this.height + 'px';
                            }
                            y = this.minBoundaryY;
                        } else if (y > this.maxBoundaryY) {
                            if (this.options.shrink === 'scale') {
                                this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
                                this.indicatorStyle.height = this.height + 'px';
                                y = this.maxPosY + this.indicatorHeight - this.height;
                            } else {
                                y = this.maxBoundaryY;
                            }
                        } else if (this.options.shrink === 'scale' && this.height !== this.indicatorHeight) {
                            this.height = this.indicatorHeight;
                            this.indicatorStyle.height = this.height + 'px';
                        }
                    }
                    this.x = x;
                    this.y = y;
                    if (this.scroller.options.useTransform) {
                        var sstyl = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
                        this.indicatorStyle[utils.style.transform] = sstyl;
                    } else {
                        this.indicatorStyle.left = x + 'px';
                        this.indicatorStyle.top = y + 'px';
                    }
                },
                spos: function (x, y) {
                    if (x < 0) {
                        x = 0;
                    } else if (x > this.maxPosX) {
                        x = this.maxPosX;
                    }
                    if (y < 0) {
                        y = 0;
                    } else if (y > this.maxPosY) {
                        y = this.maxPosY;
                    }
                    x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
                    y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;
                    this.scroller.scrollTo(x, y);
                },
                fade: function (val, hold) {
                    if (hold && !this.visible) {
                        return;
                    }
                    clearTimeout(this.fadeTimeout);
                    this.fadeTimeout = null;
                    var time = val ? 250 : 500;
                    var delay = val ? 0 : 300;
                    val = val ? '1' : '0';
                    this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';
                    this.fadeTimeout = null;    // this.fadeTimeout = setTimeout((function (val) {
                    //     this.wrapperStyle.opacity = val;
                    //     this.visible = +val;
                    // }).bind(this, val), delay);
                }
            };
            IScroll.utils = utils;
            if (typeof module !== 'undefined' && module.exports) {
                module.exports = IScroll;
            } else if (typeof define === 'function' && define.amd) {
                define('mip-chuangyejia-tabs/iscroll', [], function () {
                    return IScroll;
                });
            } else {
                window.IScroll = IScroll;
            }
        }(window, document, Math));

        // ======================
        // mip-chuangyejia-tabs/mip-chuangyejia-tabs.js
        // ======================


        /**
         * @file mip-chuangyejia-nav 组件
         * @author wangqizheng
         */
        define('mip-chuangyejia-tabs/mip-chuangyejia-tabs', [
            'require',
            'customElement',
            './iscroll',
            'viewport',
            'viewer',
            'util'
        ], function (require) {
            'use strict';
            var customElement = require('customElement').create();
            var Iscroll = require('./iscroll');
            var viewport = require('viewport');
            var viewer = require('viewer');
            var util = require('util');
            var rect = util.rect;
            var naboo = util.naboo;
            var tools = {
                query: function (selector, el) {
                    var doc = el ? el : document;
                    return doc.querySelector(selector);
                },
                queryAll: function (selector, el) {
                    var doc = el ? el : document;
                    return doc.querySelectorAll(selector);
                },
                addClass: function (el, className) {
                    el.classList.add(className);
                },
                removeClass: function (el, className) {
                    el.classList.remove(className);
                },
                appendTo: function (el, node) {
                    if (!this.isNodeList(node)) {
                        return;
                    }
                    for (var i = 0; i < node.length; i++) {
                        el.appendChild(node[i]);
                    }
                },
                cloneTo: function (el, node) {
                    if (!this.isNodeList(node)) {
                        return;
                    }
                    for (var i = 0; i < node.length; i++) {
                        var nodeItem = node[i].cloneNode(true);
                        el.appendChild(nodeItem);
                    }
                },
                createTagWithClass: function (className, tagName) {
                    tagName = tagName || 'div';
                    var tag = document.createElement(tagName);
                    tag.className = className || '';
                    return tag;
                },
                isNodeList: function (nodes) {
                    var stringRepr = Object.prototype.toString.call(nodes);
                    return typeof nodes === 'object' && /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) && typeof nodes.length === 'number' && (nodes.length === 0 || typeof nodes[0] === 'object' && nodes[0].nodeType > 0);
                }
            };
            /**
             * 第一次进入可视区回调，只会执行一次
             */
            customElement.prototype.firstInviewCallback = function () {
                // 初始化外层容器
                var self = this;
                var tabs = self.element;
                var navWrapper = tools.query('.tabs-nav-wrapper', tabs);
                var tabNav = tools.query('.tabs-nav', navWrapper);
                var contentWrapper = tools.query('.tabs-content-wrapper', tabs);
                var navItem = tools.queryAll('.tabs-slide', tabNav);
                var contentItem = tools.queryAll('.tabs-slide', contentWrapper);
                var body = document.body;
                var initHeight = Math.floor(rect.getElementRect(body).height);
                // 初始化展开
                var tabNavArrow = tools.createTagWithClass('tab-nav-arrow');
                var navContent = tools.createTagWithClass('nav-content');
                var navMark = tools.createTagWithClass('nav-mark');
                var navArrow = tools.createTagWithClass('nav-arrow');
                tabNavArrow.appendChild(navArrow);
                tabs.appendChild(navMark);
                tabNavArrow.appendChild(navContent);
                tools.cloneTo(navContent, navItem);
                navWrapper.appendChild(tabNavArrow);
                var navContentItem = tools.queryAll('.tabs-slide', navContent);
                // 初始化滑块
                var tabLine = tools.createTagWithClass('tab-line');
                tabNav.appendChild(tabLine);
                // 拦截默认滑动
                tabNav.addEventListener('touchmove', function (e) {
                    e.preventDefault();
                }, false);
                // 给item绑定index
                var arrNav = Array.prototype.slice.call(navItem);
                // 初始宽高 好多重复代码啊，后面抽象出来吧
                var wrapperWidth = Math.floor(rect.getElementRect(contentWrapper).width);
                var cols = parseInt(tabs.getAttribute('tabs-col'), 10);
                var changeTop = parseInt(tabs.getAttribute('tabs-change-top'), 10);
                var perNavWidth = wrapperWidth / cols;
                var navWidth = perNavWidth * navItem.length + 30;
                tools.query('.tabs-nav', navWrapper).style.width = navWidth + 'px';
                for (var i = 0; i < navItem.length; i++) {
                    navItem[i].style.width = perNavWidth + 'px';
                    navContentItem[i].style.width = perNavWidth + 'px';
                }
                var contSlideArr = [];
                for (var n = 0; n < navItem.length; n++) {
                    contSlideArr[n] = initHeight;
                }
                // var contSlideArr = tools.fill(navItem.length, initHeight);
                util.css(tabLine, {
                    width: perNavWidth / 5,
                    marginLeft: 2 * (perNavWidth / 5)
                });
                var perContentWidth = Math.floor(rect.getElementRect(contentWrapper).width);
                var contentWidth = perContentWidth * navItem.length;
                var tabsContent = tools.query('.tabs-content', contentWrapper);
                tabsContent.style.width = contentWidth + 'px';
                var contLen = contentItem.length;
                for (var i = 0; i < contLen; i++) {
                    contentItem[i].style.width = perContentWidth + 'px';
                }
                var tabData = {
                    currentPage: 0,
                    activePageClass: 'active',
                    visitedPageClass: 'visited'
                };
                // 初始化 iscroll
                setTimeout(function () {
                    var navScroll = null;
                    setTimeout(function () {
                        navScroll = new Iscroll(navWrapper, {
                            scrollX: true,
                            scrollY: false,
                            snap: '.tabs-slide',
                            snapSpeed: 400,
                            deceleration: 9,
                            tap: true
                        });
                    }, 100);
                    // 第一个tab加active
                    tools.addClass(navItem[0], 'active');
                    tools.addClass(navContentItem[0], 'active');
                    contentItem[0].style.height = 'auto';
                    // 展开初始化
                    navContent.style.width = wrapperWidth + 'px';
                    var arrCon = Array.prototype.slice.call(navContentItem);
                    tabNav.addEventListener('tap', updateTab, false);
                    navContent.addEventListener('tap', updateTab2, false);
                    navMark.addEventListener('click', toggle, false);
                    navArrow.addEventListener('tap', toggle, false);
                    // 切换展开与关闭
                    function toggle () {
                        if (!tabNavArrow.classList.contains('active')) {
                            navActiveClass('add');
                        } else {
                            navActiveClass('remove');
                        }
                    }
                    // 点击nav 更新视图
                    function updateTab (e) {
                        navActiveClass('remove');
                        var el = e.target;
                        if (!el.classList.contains('tabs-slide')) {
                            return;
                        }
                        var currentPage = arrNav.indexOf(el);
                        addActiveClass(currentPage);
                    }
                    // 点击展开 更新视图
                    function updateTab2 (e) {
                        navActiveClass('remove');
                        var el = e.target;
                        if (!el.classList.contains('tabs-slide')) {
                            return;
                        }
                        var currentPage = arrCon.indexOf(el);
                        addActiveClass(currentPage);
                    }
                    // 展开时增减class
                    function navActiveClass (str) {
                        if (str === 'add') {
                            tools.addClass(tabNavArrow, 'active');
                            tools.addClass(navMark, 'active');
                            tools.addClass(body, 'no-scroll');
                        } else if (str === 'remove') {
                            tools.removeClass(tabNavArrow, 'active');
                            tools.removeClass(navMark, 'active');
                            tools.removeClass(body, 'no-scroll');
                        }
                    }
                    // 增减 active class
                    function addActiveClass (index) {
                        var nowPage = index;
                        var oldPage = tabData.currentPage;
                        if (nowPage === oldPage) {
                            return;
                        }
                        moveNav(oldPage, nowPage);
                    }
                    // 统一处理 class 并移动 tab
                    function resolveClass (prev, current) {
                        tools.removeClass(navItem[prev], tabData.activePageClass);
                        tools.removeClass(navContentItem[prev], tabData.activePageClass);
                        tools.removeClass(contentItem[prev], tabData.activePageClass);
                        tools.addClass(navItem[current], tabData.activePageClass);
                        tools.addClass(navContentItem[current], tabData.activePageClass);
                        tools.addClass(contentItem[current], tabData.activePageClass);
                    }
                    // 移动 nav
                    function moveNav (prev, current) {
                        resolveClass(prev, current);
                        tabData.currentPage = current;
                        var currentIndex = current - 2;
                        navScroll.goToPage(currentIndex, 0, 300);
                        viewport.setScrollTop(changeTop);
                        var lineX = current * perNavWidth;
                        tabLine.style.transform = 'translateX(' + lineX + 'px)';
                        contSlideArr[prev] = Math.floor(rect.getElementRect(body).height);
                        setHeight(contSlideArr[current]);
                        util.css(contentItem[current], {
                            height: 'auto',
                            overflow: 'visible'
                        });
                        setTimeout(function () {
                            viewport.trigger('refresh');
                            viewport.trigger('changed');
                            viewport.trigger('scroll');
                        }, 300);
                        var posX = current * perContentWidth * -1 + 'px';
                        tabsContent.style.transform = 'translate3d(' + posX + ', 0, 0)';
                    }
                    function setHeight (nowHeight) {
                        for (var i = 0; i < contLen; i++) {
                            util.css(contentItem[i], {
                                height: 0,
                                overflow: 'hidden'
                            });
                        }
                    }
                }, 20);
            };
            return customElement;
        }), define('mip-chuangyejia-tabs', ['mip-chuangyejia-tabs/mip-chuangyejia-tabs'], function (main) {
            return main;
        });

        // =============
        // bootstrap
        // =============
        (function () {
            function registerComponent (mip, component) {
                mip.registerMipElement("mip-chuangyejia-tabs", component, "mip-chuangyejia-tabs .tabs-nav-wrapper,mip-chuangyejia-tabs .tabs-content-wrapper{overflow-x:hidden;width:100%}mip-chuangyejia-tabs .tabs-nav-wrapper .tabs-content,mip-chuangyejia-tabs .tabs-content-wrapper .tabs-content,mip-chuangyejia-tabs .tabs-nav-wrapper .tabs-nav,mip-chuangyejia-tabs .tabs-content-wrapper .tabs-nav{position:relative;z-index:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-sizing:content-box;box-sizing:content-box;width:100%;height:100%;-webkit-transition-property:-webkit-transform;-o-transition-property:transform;transition-property:-webkit-transform;transition-property:transform;transition-property:transform,-webkit-transform}mip-chuangyejia-tabs .tabs-nav-wrapper .tabs-content .tabs-slide,mip-chuangyejia-tabs .tabs-content-wrapper .tabs-content .tabs-slide,mip-chuangyejia-tabs .tabs-nav-wrapper .tabs-nav .tabs-slide,mip-chuangyejia-tabs .tabs-content-wrapper .tabs-nav .tabs-slide{position:relative;box-sizing:border-box;width:80px;text-align:center;-webkit-transition-property:-webkit-transform;-o-transition-property:transform;transition-property:-webkit-transform;transition-property:transform;transition-property:transform,-webkit-transform;-ms-flex-negative:0;-webkit-flex-shrink:0;flex-shrink:0;display:inline-block}mip-chuangyejia-tabs .tabs-nav-wrapper .tabs-nav{z-index:9}mip-chuangyejia-tabs .tabs-nav-wrapper .tabs-nav .tab-line{position:absolute;bottom:0;left:0;height:2px;background:#ff0000;transition:transform .3s}mip-chuangyejia-tabs .tabs-nav-wrapper .tabs-slide.active{color:#ff0000}mip-chuangyejia-tabs .tabs-nav-wrapper .tab-nav-arrow{position:absolute;z-index:9;top:0;right:0;display:block;box-sizing:border-box;width:50px;height:30px;padding-left:30px;background-image:linear-gradient(to right, transparent, #fff 35%)}mip-chuangyejia-tabs .tabs-nav-wrapper .tab-nav-arrow.active .nav-arrow{z-index:-9;opacity:0;transform:rotate(-540deg)}mip-chuangyejia-tabs .tabs-nav-wrapper .tab-nav-arrow.active .nav-mark{display:block;opacity:1}mip-chuangyejia-tabs .tabs-nav-wrapper .tab-nav-arrow.active .nav-content{z-index:9;height:auto;transform:scaleY(1)}mip-chuangyejia-tabs .tabs-nav-wrapper .tab-nav-arrow.active .nav-content::after{z-index:2;top:100%}mip-chuangyejia-tabs .tabs-nav-wrapper .tab-nav-arrow .nav-arrow{position:absolute;z-index:11;top:0;right:5px;width:20px;height:30px;background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAARCAYAAADKZhx3AAAAAXNSR0IArs4c6QAAAitJREFUSA21lbtuGkEUhrOgXEokupWgAOw4IhYOvAAFimU7Fzc0Nov8DvED0Cd+Ahchglx3Aad0Kl6Alg4JiQIkJIRoKAKs/9+ZY43BBhuTkZaZ85/LN2dmAeMRRjgc/ogp6PP5MrVa7S+1VY9EIvG43+8XUbfVaDSODUA/ua77gSDDMH4Dnl41XEFtcN4rzokHC5MGBx3Ylc3Af8rDPxXUEaiqaHoCgUAWhiMIBXei0egT0ZadWQONEPpOq+GQ6W02m5NYLFYZDAYv4IyqgOej0WjLNM1St9sda0l3XhI6HA7Z0BUUV2kHg8GDarU68rKSBt+AqcNfLQNX0BJqvWV9DkB/odNDQmnzji8HhXg8foCAn6JhfoNdl+9z7ApaZq7UYU3WFij1y44loF6vu6lUqtLpdNahvVT6+ng8Tvj9/lKv15t77JFI5CmuqIK8PakJ6A9AM7ZtX8u9Bmawgp8BvgZzUxXgOj4PTiheojKeXZXD4/0OqDUNpX8GTFHg7XY7AlOHs3NnunMFrehQ5H3DVyl7E5SMqzumoQ8mMBHaV9FReAfPGUGiJZPJZ9ToE40586CMM7TgG5fpdNqLX7I8nBkJwBGe4w3dp91qtQjdFh/mIqBHt3UqcQvBDMzlcp5CoZAHwJJEzH/U+rVo2FDBsqwjxE9Eu22+E5jJCv4ZcB7/zLgPdCZ5kUA4/lTyoVDI1R9oX+hblP8g/zScG/nvUNmxgp8Ceros9AJUyCgOTBapMgAAAABJRU5ErkJggg==\");background-repeat:no-repeat;background-position:right center;background-size:contain;transition:.3s;transform:rotate(0deg)}mip-chuangyejia-tabs .tabs-nav-wrapper .tab-nav-arrow .nav-content{position:absolute;z-index:-99;top:0;right:0;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-sizing:content-box;box-sizing:content-box;width:100%;background:#fff;transition:transform .2s;-webkit-transition-property:-webkit-transform;-o-transition-property:transform;transition-property:-webkit-transform;transition-property:transform;transition-property:transform,-webkit-transform;transform:scaleY(0);transform-origin:top center;flex-wrap:wrap;justify-content:flex-start}mip-chuangyejia-tabs .tabs-nav-wrapper .tab-nav-arrow .nav-content::after{content:\"\";position:absolute;z-index:-9;top:0;left:50%;display:block;width:40px;height:30px;margin-top:20px;border-radius:15px;background-color:#fff;background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAARCAYAAADKZhx3AAAABGdBTUEAALGPC/xhBQAAAlFJREFUSA21lcuOEkEUhrvFC+xI2JHAgotGiWkjL8CCRCeZmFFpdZzJjG/Axgdg7yO4kBEYExkyd28rXgASSGAFCYHEkJAQwgZQsP0P1pmUdDMOqJ0UVfWfqv+rU11dKMoSTyKRuOT3+19TofYSFotPEdCkz+czqACe/O/wWagE31kUbrtozmScSqXeGIaxbTFHK5fLvng8fpjP5w2LuEm6EFhAk4BuSQ5f0K6j+IW2EFyVjCybuq7bCoVCEsFNHqCq6mePx7NG/VardYAF3eMY6nQ4HH6RzWYnkmZqngsW0B3M2uCZgH5CWavVaiPSIpGIHfB9wO/zGNQZwLfPg88FC+hbmDxnQwA/ojxkKOuBQOAawARfYQ31LuBb8+CW75igxWIxhcky9AOgj2ahBOp2uxOXy7WH5l2UIGl4brfb7WA0Gj2oVqumA2cCC2gaq1//NV9RAJwL5TECnkN/Fn7dCv7brSOgGUCfsSHqU7vdbtpeKX7WpN2gsTSHRfLC7mXImzWqz94xDsllHBKCPpEGnDgcjseVSuWbpP2xGQqFrg4GA8p+lQdj197jS9jAdz4mbboKAd2dgR4DGlsUSqadTmfidrtz4/H4Dro3SMMT6vf7NzVN2280Gj9UgjabzXcIxKZh/GB1R9gyfRkoe1BNmQ+HwywSeiDpe16vd92GJw3xKQcAPXQ6nXqpVPrO2rI1ZY77PDcajTR4cOa3kHmQDtdXNmYobqq/hrIneSGRGHmzRszp4cJf2yt0vBiw+S+hEkjBZXKl1+vR7rbq9frLn6KDJj5DqQNzAAAAAElFTkSuQmCC\");background-repeat:no-repeat;background-position:center center;background-size:60% auto;transition:top .2s;transform:translateX(-50%)}mip-chuangyejia-tabs .tabs-nav-wrapper .tab-nav-arrow .nav-content .tabs-slide{width:25%;height:30px;text-align:center;background:#fff}mip-chuangyejia-tabs .tabs-nav-wrapper{height:30px}mip-chuangyejia-tabs .tabs-nav-wrapper .tabs-slide{height:30px}mip-chuangyejia-tabs .tabs-content-wrapper{overflow:visible}mip-chuangyejia-tabs .tabs-content-wrapper .tabs-content{transition:all .3s}mip-chuangyejia-tabs .tabs-content-wrapper .tabs-slide{overflow-x:hidden}mip-chuangyejia-tabs .tabs-content-wrapper .tabs-slide.active{overflow:auto}mip-chuangyejia-tabs .nav-mark{position:fixed;z-index:8;top:0;left:0;display:none;width:100%;height:100%;opacity:0;background:rgba(0,0,0,0.5);transition:all .2s}mip-chuangyejia-tabs .nav-mark.active{display:block;opacity:1}");
            }
            if (window.MIP) {
                require(["mip-chuangyejia-tabs"], function (component) {
                    registerComponent(window.MIP, component);
                });
            }
            else {
                require(["mip", "mip-chuangyejia-tabs"], registerComponent);
            }
        })();

    }
});