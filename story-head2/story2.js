(window.MIP = window.MIP || []).push({
  name: "mip-story", func: function () {// ======================
    // mip-story/audio.js
    // ======================


    /**
     * @file mip-story 组件
     * @author
     */
    define('mip-story/audio', [
      'require',
      'util'
    ], function (require) {
      'use strict';
      var util = require('util');
      function Audio () {
      }
      Audio.prototype.build = function (ele, audioSrc) {
        if (audioSrc) {
          var audioEl = document.createElement('audio');
          audioEl.setAttribute('src', audioSrc);
          audioEl.setAttribute('preload', 'auto');
          audioEl.setAttribute('loop', '');
          audioEl.setAttribute('autoplay', '');
          // audioEl.setAttribute('muted', '');
          util.css(audioEl, { display: 'hidden' });
          ele.appendChild(audioEl);
          return audioEl;
        }
      };
      return Audio;
    });

    // ======================
    // mip-story/animation-util.js
    // ======================


    /**
     *  @file 一些用户动画处理的工具函数
     */
    define('mip-story/animation-util', ['require'], function (require) {
      function timeStrFormat (time) {
        var match;
        var num;
        var units;
        if (!time) {
          return 0;
        }
        // 兼容线上传纯数字的情况；
        time = /^[0-9]*$/.test(+time) ? time + 'ms' : time;
        match = time.toLowerCase().match(/^([0-9\.]+)\s*(s|ms)$/);
        if (!match) {
          return 0;
        }
        num = match[1];
        units = match[2];
        if (match && match.length === 3 && (units === 's' || units === 'ms')) {
          return units === 's' ? parseFloat(num) * 1000 : parseInt(num, 10);
        }
      }
      return { timeStrFormat: timeStrFormat };
    });

    // ======================
    // mip-story/animate-preset.js
    // ======================


    /**
     * @file 动画逻辑处理
     * @author xiongwenjie@baidu.com
     * @description 这里是一些预置的动画函数和逻辑
     */
    define('mip-story/animate-preset', ['require'], function (require) {
      'use strict';
      var animatesPresets = {
        'fade-in': {
          duration: 500,
          easing: 'ease-in',
          delay: 0,
          keyframes: [
            { opacity: 0 },
            { opacity: 1 }
          ]
        },
        'fly-in-top': {
          duration: 500,
          easing: 'ease-in',
          delay: 0,
          keyframes: function (offset) {
            var offsetY = -(offset.top + offset.height);
            return [
              { transform: 'translate3d(0, ' + offsetY + 'px, 0)' },
              { transform: 'translate3d(0, 0, 0)' }
            ];
          }
        },
        'fly-in-bottom': {
          duration: 500,
          easing: 'ease-in',
          delay: 0,
          keyframes: function (offset) {
            var offsetY = offset.pageHeight - offset.top;
            return [
              { transform: 'translate3d(0, ' + offsetY + 'px, 0)' },
              { transform: 'translate3d(0, 0, 0)' }
            ];
          }
        },
        'fly-in-left': {
          duration: 500,
          delay: 0,
          easing: 'ease-in',
          keyframes: function (offset) {
            var offsetX = -(offset.left + offset.width);
            return [
              { transform: 'translate3d(' + offsetX + 'px, 0, 0)' },
              { transform: 'translate3d(0, 0, 0)' }
            ];
          }
        },
        'fly-in-right': {
          duration: 500,
          delay: 0,
          easing: 'ease-in',
          keyframes: function (offset) {
            var offsetX = offset.pageWidth - offset.left;
            return [
              { transform: 'translate3d(' + offsetX + 'px, 0, 0)' },
              { transform: 'translate3d(0, 0, 0)' }
            ];
          }
        },
        'fade-in-top': {
          duration: 500,
          easing: 'ease-in',
          delay: 0,
          keyframes: function (offset) {
            var offsetY = -50;
            return [
              {
                opacity: 0,
                transform: 'translate3d(0, ' + offsetY + 'px, 0)'
              },
              {
                opacity: 1,
                transform: 'translate3d(0, 0, 0)'
              }
            ];
          }
        },
        'fade-in-bottom': {
          duration: 500,
          easing: 'ease-in',
          delay: 0,
          keyframes: function (offset) {
            var offsetY = 50;
            return [
              {
                opacity: 0,
                transform: 'translate3d(0, ' + offsetY + 'px, 0)'
              },
              {
                opacity: 1,
                transform: 'translate3d(0, 0, 0)'
              }
            ];
          }
        },
        'fade-in-left': {
          duration: 500,
          delay: 0,
          easing: 'ease-in',
          keyframes: function (offset) {
            var offsetX = -50;
            return [
              {
                opacity: 0,
                transform: 'translate3d(' + offsetX + 'px, 0, 0)'
              },
              {
                opacity: 1,
                transform: 'translate3d(0, 0, 0)'
              }
            ];
          }
        },
        'fade-in-right': {
          duration: 500,
          delay: 0,
          easing: 'ease-in',
          keyframes: function (offset) {
            var offsetX = 50;
            return [
              {
                opacity: 0,
                transform: 'translate3d(' + offsetX + 'px, 0, 0)'
              },
              {
                opacity: 1,
                transform: 'translate3d(0, 0, 0)'
              }
            ];
          }
        },
        'scale-in': {
          duration: 1000,
          delay: 0,
          easing: 'linear',
          keyframes: function (offset) {
            var offsetX = 50;
            return [
              { transform: 'scale(1)' },
              { transform: 'scale(1.1)' }
            ];
          }
        },
        'twirl-in': {
          duration: 1000,
          delay: 0,
          easing: 'cubic-bezier(.2, .75, .4, 1)',
          keyframes: [
            {
              transform: 'rotate(-540deg) scale(0.1)',
              opacity: 0
            },
            {
              transform: 'none',
              opacity: 1
            }
          ]
        },
        'whoosh-in-left': {
          duration: 500,
          delay: 0,
          easing: 'ease-in',
          keyframes: function (offset) {
            var offsetX = -(offset.left + offset.width);
            return [
              {
                opacity: 0,
                transform: 'translate3d(' + offsetX + 'px, 0, 0) scale(.15)'
              },
              {
                opacity: 1,
                transform: 'translate3d(0, 0, 0) scale(1)'
              }
            ];
          }
        },
        'whoosh-in-right': {
          duration: 500,
          delay: 0,
          easing: 'ease-in',
          keyframes: function (offset) {
            var offsetX = offset.left + offset.width;
            return [
              {
                opacity: 0,
                transform: 'translate3d(' + offsetX + 'px, 0, 0) scale(.15)'
              },
              {
                opacity: 1,
                transform: 'translate3d(0, 0, 0) scale(1)'
              }
            ];
          }
        },
        'rotate-in-left': {
          duration: 700,
          easing: 'ease-in',
          delay: 0,
          keyframes: function (offset) {
            var offsetX = -(offset.left + offset.width);
            return [
              { transform: 'translate3d(' + offsetX + 'px, 0, 0) rotate(-360deg)' },
              { transform: 'translate3d(0, 0, 0) rotate(0)' }
            ];
          }
        },
        'rotate-in-right': {
          duration: 700,
          easing: 'ease-in',
          delay: 0,
          keyframes: function (offset) {
            var offsetX = offset.left + offset.width;
            return [
              { transform: 'translate3d(' + offsetX + 'px, 0, 0) rotate(360deg)' },
              { transform: 'translate3d(0, 0, 0) rotate(0)' }
            ];
          }
        }
      };
      return animatesPresets;
    });

    // ======================
    // mip-story/animation-runner.js
    // ======================


    /**
     * @file 动画管理调度模块
     * @author xiongwenjie@baidu.com
     * @description
     */
    define('mip-story/animation-runner', [
      'require',
      'util'
    ], function (require) {
      'use strict';
      var css = require('util').css;
      function AnimationRunner (el, animationDef) {
        this.el = el;
        this.animationDef = animationDef;
        this.isRunner = 1;
        this.create();
        this.isStart = 0;
      }
      AnimationRunner.prototype.create = function () {
        var animationDef = this.animationDef;
        animationDef.easing.fill = 'forwards';
        this.runner = this.el.animate(animationDef.keyframes, animationDef.easing);
        this.pause();
      };
      AnimationRunner.prototype.play = function () {
        var self = this;
        if (!self.isStart) {
          // delay属性会造成无法渲染第一帧，所以使用setTimeout来代替delay
          if (self.animationDef.delay) {
            self.timer = setTimeout(function () {
              css(self.el, { visibility: '' });
              self.runner.play();
            }, self.animationDef.delay);
          } else {
            css(self.el, { visibility: '' });
            self.runner.play();
          }
          self.isStart = 1;
        }
      };
      AnimationRunner.prototype.pause = function () {
        this.runner.pause();
      };
      AnimationRunner.prototype.cancel = function () {
        var self = this;
        clearTimeout(self.timer);
        this.isStart = 0;
        this.runner.cancel();
      };
      return AnimationRunner;
    });

    // ======================
    // mip-story/animation.js
    // ======================


    /**
     * @file 动画的管理逻辑
     * @author xiongwenjie@baidu.com
     * @description
     */
    define('mip-story/animation', [
      'require',
      './animate-preset',
      './animation-runner',
      'util',
      './animation-util'
    ], function (require) {
      'use strict';
      var animatePreset = require('./animate-preset');
      var AnimationRunner = require('./animation-runner');
      var util = require('util');
      var extend = util.fn.extend;
      var css = util.css;
      var MIP_STORY_ANIMATE_IN_ATTR = 'animate-in';
      var MIP_STORY_ANIMATE_IN_DURATION_ATTR = 'animate-in-duration';
      var MIP_STORY_ANIMATE_IN_DELAY_ATTR = 'animate-in-delay';
      var MIP_STORY_ANIMATE_IN_AFTER_ATTR = 'animate-in-after';
      var MIP_STORY_ANIMATE_IN_SELECROR = '[animate-in]';
      var timeStrFormat = require('./animation-util').timeStrFormat;
      // @class
      function AnimationManager (page) {
        this.page = page;
        // [
        //     {
        //         id: xxx,
        //         runner: runner
        //     }
        // ]
        this.sequence = [];
        this.init();
      }
      AnimationManager.prototype.init = function () {
        var self = this;
        var EventEmitter = util.EventEmitter;
        var currentEle = this.page;
        var $animate = currentEle.querySelectorAll(MIP_STORY_ANIMATE_IN_SELECROR);
        this.emitter = new EventEmitter();
        [].slice.call($animate).forEach(function (el) {
          var runner = buildRuner(el);
          var player = { runner: runner };
          if (el.id) {
            player.id = el.id;
          }
          self.sequence.push(player);
        });
      };
      AnimationManager.prototype.runAllAnimate = function () {
        var self = this;
        var startAfterId;
        this.sequence.forEach(function (player) {
          startAfterId = player.runner.animationDef.startAfterId;
          if (startAfterId && self.getRunnerById(startAfterId)) {
            self.waitAndStart(self.getRunnerById(startAfterId), player);
          } else {
            player.runner.play();
          }
        });
      };
      AnimationManager.prototype.paintFirstFrame = function () {
        this.sequence.forEach(function (player) {
          css(player.runner.el, player.runner.animationDef.keyframes[0]);
        });
      };
      AnimationManager.prototype.getRunnerById = function (id) {
        var runner = null;
        if (id) {
          this.sequence.forEach(function (val) {
            if (val.id === id && val.runner && val.runner.isRunner) {
              runner = val.runner;
            }
          });
        }
        return runner;
      };
      AnimationManager.prototype.cancelAllAnimate = function () {
        this.sequence.forEach(function (player) {
          player.runner.cancel();
        });
      };
      AnimationManager.prototype.waitAndStart = function (prevPlayer, player) {
        var self = this;
        if (prevPlayer.runner && player.runner) {
          self.emitter.on(prevPlayer.el.id, function () {
            player.runner.play();
          });
          prevPlayer.runner.onfinish = function () {
            self.emitter.trigger(prevPlayer.el.id);
          };
        }
      };
      function hasAnimations (element) {
        return !!element.querySelectorAll(MIP_STORY_ANIMATE_IN_SELECROR).length;
      }
      function timeStrFormat (time) {
        var match;
        var num;
        var units;
        if (!time) {
          return 0;
        }
        // 兼容线上传纯数字的情况；
        time = /^[0-9]*$/.test(+time) ? time + 'ms' : time;
        match = time.toLowerCase().match(/^([0-9\.]+)\s*(s|ms)$/);
        if (!match) {
          return 0;
        }
        num = match[1];
        units = match[2];
        if (match && match.length === 3 && (units === 's' || units === 'ms')) {
          return units == 's' ? parseFloat(num) * 1000 : parseInt(num, 10);
        }
      }
      function createAnimationDef (el) {
        var keyframes;
        var easing;
        var offset = el.getBoundingClientRect();
        var animationDef = getPreset(el);
        var duration = timeStrFormat(el.getAttribute(MIP_STORY_ANIMATE_IN_DURATION_ATTR));
        var delay = timeStrFormat(el.getAttribute(MIP_STORY_ANIMATE_IN_DELAY_ATTR));
        var after = el.getAttribute(MIP_STORY_ANIMATE_IN_AFTER_ATTR);
        offset.pageHeight = window.innerHeight;
        offset.pageWidth = window.innerWidth;
        // 处理动画的keyframes
        if (animationDef && animationDef.keyframes) {
          if (typeof animationDef.keyframes === 'function') {
            keyframes = animationDef.keyframes(offset);
          } else {
            keyframes = animationDef.keyframes;
          }
        }
        easing = {
          'duration': +duration || animationDef.duration,
          'easing': animationDef.easing || 'ease'
        };
        if (+delay) {
          animationDef.delay = delay;
        }
        animationDef.easing = easing;
        animationDef.keyframes = keyframes;
        if (after) {
          animationDef.startAfterId = after;
        }
        return animationDef;
      }
      function getPreset (el) {
        var animationDef = {};
        var name = String(el.getAttribute(MIP_STORY_ANIMATE_IN_ATTR)).split(/\s+/)[0];
        extend(animationDef, animatePreset[name]);
        return animationDef;
      }
      function buildRuner (el) {
        var runner;
        var animationDef = createAnimationDef(el);
        runner = new AnimationRunner(el, animationDef);
        return runner;
      }
      return {
        AnimationManager: AnimationManager,
        hasAnimations: hasAnimations
      };
    });

    // ======================
    // mip-story/mip-story-view.js
    // ======================


    /**
     * @file mip-story 组件
     * @author
     */
    define('mip-story/mip-story-view', [
      'require',
      'customElement',
      './audio',
      './animation-util',
      './animation',
      'util'
    ], function (require) {
      'use strict';
      var customElement = require('customElement').create();
      var Audio = require('./audio');
      var BACKGROUND_AUDIO = 'background-audio';
      var timeStrFormat = require('./animation-util').timeStrFormat;
      var AnimationManager = require('./animation').AnimationManager;
      var hasAnimations = require('./animation').hasAnimations;
      var css = require('util').css;
      customElement.prototype.resumeAllMedia = function (load) {
        var self = this;
        self.whenAllMediaElements(function (ele) {
          if (ele.tagName.toLowerCase() === 'audio' && load) {
            !self.muted ? ele.load() : ele.load() && ele.pause();
          } else {
            !self.muted && ele.play();
          }
        });
      };
      customElement.prototype.pauseAllMedia = function () {
        this.whenAllMediaElements(function (ele) {
          ele.pause();
        });
      };
      customElement.prototype.muteAllMedia = function () {
        this.whenAllMediaElements(function (ele) {
          ele.muted = true;
          ele.pause();
        });
      };
      customElement.prototype.toggleAllMedia = function (e, muted) {
        this.muted = muted;
        var ele = e.target || null;
        if (ele && ele.hasAttribute && ele.hasAttribute('muted')) {
          !this.muted && this.resumeAllMedia();
          !this.muted && this.unMuteAllMedia();
        } else {
          this.muteAllMedia();
        }
      };
      customElement.prototype.unMuteAllMedia = function () {
        this.whenAllMediaElements(function (ele) {
          ele.muted = false;
          ele.play();
        });
      };
      customElement.prototype.getAllMedia = function () {
        return this.element.querySelectorAll('audio, video');
      };
      customElement.prototype.whenAllMediaElements = function (cb) {
        var mediaSet = this.getAllMedia();
        Array.prototype.map.call(mediaSet, function (mediaEl) {
          return cb(mediaEl);
        });
      };
      customElement.prototype.setPreActive = function (eventEmiter) {
        this.parentEmiter = eventEmiter;
        this.animationElements = [];
        this.initAnimationFirstFrame();
        // css-获取有动画的节点，并且放到数组中便于修改display
        this.findAnimationNodes(this.element);
        // css-修改每个有动画节点的display
        this.initFirstFrameStyle(false);
      };
      // 监控CSS中是否有动画
      function hasCssAnimation (obj) {
        var ani = null;
        try {
          ani = document.defaultView.getComputedStyle(obj)['animationName'] || document.defaultView.getComputedStyle(obj)['-webkit-animationName'];
        } catch (e) {
        }
        if (ani && ani != 'none') {
          return true;
        }
        return false;
      }
      customElement.prototype.findAnimationNodes = function (parent) {
        if (parent == null)
          return;
        var subNodes = parent.children;
        for (var index = 0; index < subNodes.length; index++) {
          if (hasCssAnimation(subNodes[index])) {
            this.animationElements.push(subNodes[index]);
          }
          if (subNodes[index].children.length > 0) {
            this.findAnimationNodes(subNodes[index]);
          }
        }
      };
      function toggleDisplay (obj, disp) {
        if (disp) {
          obj.setAttribute('style', 'display: ' + obj.getAttribute('originDisplay'));
        } else {
          var originDisplay = document.defaultView.getComputedStyle(obj)['display'];
          obj.setAttribute('originDisplay', originDisplay);
          obj.setAttribute('style', 'display: none');
        }
      }
      customElement.prototype.initFirstFrameStyle = function (disp) {
        if (this.animationElements != null) {
          for (var index = 0; index < this.animationElements.length; index++) {
            toggleDisplay(this.animationElements[index], disp);
          }
        }
      };
      customElement.prototype.setAllMedia = function (status, muted, load, eventEmiter, viewType) {
        this.muted = muted;
        this.parentEmiter = eventEmiter;
        if (status) {
          this.initAnimationFirstFrame();
          this.maybeStartAnimation();
          this.resumeAllMedia(load);
          this.muted ? this.muteAllMedia() : this.unMuteAllMedia();
          this.maybeSetAutoAdvance();
        } else {
          this.maybeClearAutoAdvance();
          this.pauseAllMedia();
          this.maybeClearAnimation();
        }
      };
      customElement.prototype.setCssMedia = function (status, muted, eventEmiter) {
        this.muted = muted;
        this.parentEmiter = eventEmiter;
        if (status) {
          this.initFirstFrameStyle(true);
        } else {
          this.initFirstFrameStyle(false);
        }
      };
      customElement.prototype.clearCssMedia = function (status, muted, eventEmiter) {
        if (this.animationElements != null) {
          for (var index = 0; index < this.animationElements.length; index++) {
            toggleDisplay(this.animationElements[index], true);
            this.animationElements[index].removeAttribute('originDisplay');
          }
        }
      };
      customElement.prototype.initAnimationFirstFrame = function () {
        if (hasAnimations(this.element)) {
          css(this.element, { visibility: 'hidden' });
          if (!this.animationManager) {
            this.animationManager = new AnimationManager(this.element);
          }
          this.animationManager.paintFirstFrame();
          css(this.element, { visibility: '' });
        }
      };
      customElement.prototype.maybeStartAnimation = function () {
        if (hasAnimations(this.element)) {
          css(this.element, { visibility: 'hidden' });
          if (!this.animationManager) {
            this.animationManager = new AnimationManager(this.element);
          }
          this.animationManager.paintFirstFrame();
          css(this.element, { visibility: '' });
          this.animationManager.runAllAnimate();
        }
      };
      customElement.prototype.maybeClearAnimation = function () {
        if (this.animationManager) {
          this.animationManager.cancelAllAnimate();
        }
      };
      customElement.prototype.maybeClearAutoAdvance = function () {
        var self = this;
        self.timer && clearTimeout(self.timer);
      };
      customElement.prototype.maybeSetAutoAdvance = function () {
        var self = this;
        var el = self.element;
        var advancment = el.getAttribute('auto-advancement-after');
        var duration = timeStrFormat(advancment);
        if (duration) {
          self.timer = setTimeout(function () {
            self.parentEmiter.trigger('switchPage', { status: 1 });
          }, duration);
        }
      };
      customElement.prototype.initView = function () {
        this.audio = new Audio();
        var node = this.element.parentNode;
        this.animationElements = [];
        if (!node.hasAttribute(BACKGROUND_AUDIO)) {
          var audioSrc = this.element.getAttribute(BACKGROUND_AUDIO);
          this.audio.build(this.element, audioSrc);
        }
      };
      customElement.prototype.firstInviewCallback = function () {
        this.initView();
        this.pauseAllMedia();
      };
      /* eslint-disable */
      MIP.registerMipElement('mip-story-view', customElement);
      return customElement;
    });

    // ======================
    // mip-story/mip-story-layer.js
    // ======================


    /**
     * @file mip-story 组件
     * @author
     */
    define('mip-story/mip-story-layer', [
      'require',
      'customElement'
    ], function (require) {
      'use strict';
      var customElement = require('customElement').create();
      customElement.prototype.firstInviewCallback = function () {
      };
      /* eslint-disable */
      MIP.registerMipElement('mip-story-layer', customElement);
      return customElement;
    });

    // ======================
    // mip-story/mip-story-share.js
    // ======================


    /**
     * @file mip-story 组件
     * @author
     */
    define('mip-story/mip-story-share', [
      'require',
      'util',
      'viewer'
    ], function (require) {
      'use strict';
      var util = require('util');
      var MIP_STORY_SHARE_SHOW = 'mip-story-share-show';
      var viewer = require('viewer');
      function MIPStoryShare (shareConfig, root) {
        this.shareConfig = shareConfig;
        this.root = root;
      }
      MIPStoryShare.prototype.build = function () {
        var shareCancelStats = encodeURIComponent(JSON.stringify({
          type: 'click',
          data: [
            '_trackEvent',
            '小故事分享取消',
            '点击',
            window.location.href
          ]
        }));
        this.shareData = {
          title: this.shareConfig.title,
          titleDefault: document.title,
          content: this.shareConfig.desc || this.shareConfig.content || document.title,
          contentDefault: '我发现了一个精彩的小故事\uFF0C一起来看吧',
          iconUrl: this.shareConfig.thumbnail,
          iconUrlDefault: ''
        };
        // 微信小故事分享配置
        viewer.sendMessage('wxshare_config', this.shareData);
        this.shareUrl = util.parseCacheUrl(location.href);
        /* eslint-disable max-len */
        var html = '' + '<aside class="mip-story-share">' + '<div class="mip-share-container">' + '<mip-share url="' + this.shareUrl + '" title="' + this.shareData.title + '" content="' + this.shareData.content + '" iconUrl="' + this.shareData.iconUrl + '"></mip-share>' + '</div>' + '<span class="mip-story-share-cancel" data-stats-baidu-obj="' + shareCancelStats + '">取消</span>' + '</aside>';
        /* eslint-enable max-len */
        return html;
      };
      MIPStoryShare.prototype.showShareLayer = function () {
        var scSupport = this.supportCraft();
        // 适配简单搜索，简单没有给出单独调用微信等渠道的api, 所以在这里拦截一下；
        // 如果简搜支持且为百度域的可吊起简搜，由于简搜会对非百度域的分享做特殊处理；
        var hostName = util.parseCacheUrl(location.hostname);
        if (scSupport.support && hostName.indexOf('baidu.com') !== -1) {
          this.callSearchCraftShare(scSupport.os);
          return;
        }
        var ele = this.root.querySelector('.mip-story-share');
        ele.classList.add(MIP_STORY_SHARE_SHOW);
      };
      /**
       * callSearchCraftShare 吊起简单搜索的分享组件；
       * @param {Boolean} osAndroid 是否是安卓端，对安卓有特殊的处理
       */
      MIPStoryShare.prototype.callSearchCraftShare = function (osAndroid) {
        var message = {
          func: 'callNativeShare',
          options: {
            'type': 'url',
            'imgurl': this.shareData.iconUrl,
            'title': this.shareData.title,
            'describe': this.shareData.content,
            'url': this.shareUrl || window.location.href
          }
        };
        if (osAndroid) {
          message = JSON.stringify(message);
        }
        try {
          window.Viaduct.postMessage(message);
        } catch (e) {
        }
      };
      /**
       * supportCraft 检测当前运行环境是否支持简单搜索的分享吊起
       * @return {Object}
       */
      MIPStoryShare.prototype.supportCraft = function () {
        // 简单搜索ua判断 detect无法判断简单搜索故手动检测
        var shareUa = typeof navigator !== 'undefined' ? navigator.userAgent : '';
        var craft = /SearchCraft/i.test(shareUa);
        var shareosAndroid = /Android/i.test(shareUa);
        var shareV = craft && shareUa.match(/SearchCraft\/([\d.]*)/);
        var supportAnd = shareosAndroid && parseFloat(shareV[1]) > 1.5;
        var supportIos = !shareosAndroid && parseFloat(shareV[1]) > 1.11;
        var support = craft && (supportAnd || supportIos);
        return {
          os: shareosAndroid,
          support: support
        };
      };
      MIPStoryShare.prototype.hideShareLayer = function () {
        var ele = this.root.querySelector('.mip-story-share');
        ele.classList.remove(MIP_STORY_SHARE_SHOW);
      };
      return MIPStoryShare;
    });

    // ======================
    // mip-story/mip-story-hint.js
    // ======================


    /**
     * @file mip-story 组件
     * @author
     */
    define('mip-story/mip-story-hint', [
      'require',
      'util'
    ], function (require) {
      'use strict';
      var MIP_STORY_HINT_DAMPING_HIDE = 'mip-story-hint-damping-hide';
      var MIP_STORY_SYSTEM_SHOW = 'mip-story-system-show';
      var HASSHOWMIPSTORYHINT = 'has-show-mip-story-hint';
      var FIRST_PAGE_NAVIGATION_OVERLAY_TIMEOUT = 250;
      var MIP_STORY_HINT_CLASS = '.mip-story-hint';
      var MIP_STORY_PAGE_SWITCH_LEFT_CLASS = 'mip-story-page-switch-lt';
      var MIP_STORY_PAGE_SWITCH_RIGHT_CLASS = 'mip-story-page-switch-rt';
      var util = require('util');
      function MIPStoryHint (root) {
        this.rootEl = root;
      }
      MIPStoryHint.prototype.build = function () {
        var html = '<aside class="mip-story-hint mip-story-hint-damping-hide">' + '<div class="mip-story-hint-shadow"></div>' + '<div class="mip-story-hint-system">' + '<div class="mip-story-hint-left"></div>' + '<div class="mip-story-hint-middle">' + '<span class="mip-story-hint-middle-top"></span>' + '<span class="mip-story-hint-middle-icon">' + '<span class="mip-story-hint-touch-icon"></span>' + '<span>点击屏幕左右区域</span>' + '<span>切换内容</span>' + '</span>' + '<span class="mip-story-hint-middle-bottom"></span>' + '</div>' + '<div class="mip-story-hint-right"></div>' + '</div>' + '<div class="mip-story-hint-rotate">' + '<mip-img src="https://www.mipengine.org/static/img/mip-story/mip-story-rotate.png"></mip-img>' + '<p>为了更好的体验\uFF0C请将手机横过来</p>' + '</div>' + '<div class="mip-story-page-switch">' + '<span class="mip-story-page-switch-left">' + '<span></span>' + '<span></span>' + '</span>' + '<span class="mip-story-page-switch-right">' + '<span></span>' + '<span></span>' + '</span>' + '</div>' + '</aside>';
        return html;
      };
      MIPStoryHint.prototype.showDamping = function () {
        var self = this;
        var ele = this.rootEl.querySelector(MIP_STORY_HINT_CLASS);
        util.css(ele, { display: 'block' });
        ele.classList.remove(MIP_STORY_HINT_DAMPING_HIDE);
        setTimeout(function () {
          self.hideDamping();
        }, FIRST_PAGE_NAVIGATION_OVERLAY_TIMEOUT);
      };
      MIPStoryHint.prototype.hideDamping = function () {
        var ele = this.rootEl.querySelector(MIP_STORY_HINT_CLASS);
        util.css(ele, { display: 'none' });
        ele.classList.add(MIP_STORY_HINT_DAMPING_HIDE);
      };
      MIPStoryHint.prototype.showSystemLater = function () {
        var ele = this.rootEl.querySelector(MIP_STORY_HINT_CLASS);
        util.css(ele, { display: 'block' });
        ele.classList.add(MIP_STORY_SYSTEM_SHOW);
      };
      MIPStoryHint.prototype.hideSystemLater = function () {
        var ele = this.rootEl.querySelector(MIP_STORY_HINT_CLASS);
        util.css(ele, { display: 'none' });
        ele.classList.remove(MIP_STORY_SYSTEM_SHOW);
      };
      MIPStoryHint.prototype.toggleSystemLater = function () {
        var ele = this.rootEl.querySelector(MIP_STORY_HINT_CLASS);
        var display = ele.style.display;
        if (display === 'block') {
          this.hideSystemLater();
        } else {
          this.showSystemLater();
        }
      };
      MIPStoryHint.prototype.showPageSwitchLayer = function () {
        var hint = this.rootEl.querySelector(MIP_STORY_HINT_CLASS);
        hint.classList.add(MIP_STORY_PAGE_SWITCH_RIGHT_CLASS);
        setTimeout(function () {
          hint.classList.remove(MIP_STORY_PAGE_SWITCH_RIGHT_CLASS);
        }, 400);
      };
      MIPStoryHint.prototype.hidePageSwitchLayer = function () {
        var hint = this.rootEl.querySelector(MIP_STORY_HINT_CLASS);
        hint.classList.add(MIP_STORY_PAGE_SWITCH_LEFT_CLASS);
        setTimeout(function () {
          hint.classList.remove(MIP_STORY_PAGE_SWITCH_LEFT_CLASS);
        }, 400);
      };
      return MIPStoryHint;
    });

    // ======================
    // mip-story/mip-story-bookend.js
    // ======================


    /**
     * @file mip-story 组件
     * @author
     */
    define('mip-story/mip-story-bookend', [
      'require',
      'util',
      'viewer'
    ], function (require) {
      'use strict';
      var util = require('util');
      var viewer = require('viewer');
      var platform = util.platform;
      var naboo = util.naboo;
      function MIPStoryBackEnd (storyConfig) {
        this.storyConfig = storyConfig || {};
      }
      MIPStoryBackEnd.prototype.build = function () {
        var data = this.storyConfig;
        var replayStats = encodeURIComponent(JSON.stringify({
          type: 'click',
          data: [
            '_trackEvent',
            '小故事重播',
            '点击',
            window.location.href
          ]
        }));
        var shareStats = encodeURIComponent(JSON.stringify({
          type: 'click',
          data: [
            '_trackEvent',
            '小故事分享',
            '点击',
            window.location.href
          ]
        }));
        var share = data.share;
        var recommend = data.recommend;
        var items = recommend && recommend.items ? recommend.items : [];
        var recTpl = '';
        if (items && items.length) {
          var innerTpl = '';
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            innerTpl += '' + '<div data-item>' + '<a href="' + item.url + '" class="recommend-item" style="background-image:url(' + (item.cover || '') + ');background-size:cover;background-repeat:no-repeat;">' + '<span>' + (item.title || '') + '</span>' + '<span class="item-from" data-src="' + item.fromUrl + '">' + (item.from || '') + '</span>' + '</a>' + '</div>';
          }
          recTpl = '' + '<div class="recommend">' + '<p>更多阅读</p>' + '<mip-scrollbox>' + '<div data-wrapper>' + '<div data-inner>' + '<div data-scroller>' + innerTpl + '</div>' + '</div>' + '</div>' + '</mip-scrollbox>' + '</div>';
        }
        var shareTpl = this.showShareBtn() ? '' + '<span class="mip-backend-share" data-stats-baidu-obj="' + shareStats + '">' + '<span class="mip-backend-preview-share-btn"></span>' + '<span class="mip-backend-share-btn">分享</span>' + '</span>' : '';
        var historyTpl = history.length > 1 ? '<span class="mip-story-close mip-backend-close"></span>' : '';
        var middleClass = recTpl ? '' : 'mip-story-middle';
        var html = '' + '<aside class="mip-backend" style="background-image: url(' + share.background + ')">' + historyTpl + '<div class="mip-backend-outer ' + middleClass + '">' + '<div class="mip-backend-preview" ' + 'style="background-position:center;background-size:cover;background-image:url(' + share.thumbnail + ')" data-stats-baidu-obj="' + replayStats + '">' + '<div class="mip-backend-preview-mask"></div>' + '<div class="mip-backend-preview-thumbnail">' + '<span class="mip-backend-preview-replay-btn"></span>' + '<span>重播</span>' + '</div>' + '</div>' + '<span class="mip-backend-description">' + share.title + '</span>' + '<span class="mip-backend-info">' + '<a href="' + share.fromUrl + '">' + share.from + '</a>' + '</span>' + shareTpl + recTpl + '</div>' + '</aside>';
        return html;
      };
      /**
       *
       * 由于分享在手百下有域名限制，除去百度域的源站不能分享，所以如果是源站并且手百下，隐藏分享
       *
       * @return {boolean} 是否展示分享按钮
       */
      MIPStoryBackEnd.prototype.showShareBtn = function () {
        var hostName = util.parseCacheUrl(location.hostname);
        if (platform.isBaiduApp() && !viewer.isIframed && hostName.indexOf('baidu.com') === -1) {
          return false;
        }
        return true;
      };
      MIPStoryBackEnd.prototype.show = function () {
        var eleAnimation = document.querySelector('.mip-backend').animate([
          {
            transform: 'translate3D(0, 100%, 0)',
            opacity: 0
          },
          {
            transform: 'translate3D(0, 0, 0)',
            opacity: 1
          }
        ], {
            fill: 'forwards',
            easing: 'ease-in',
            duration: 280
          });
        eleAnimation.play();
      };
      MIPStoryBackEnd.prototype.hide = function () {
        var eleAnimation = document.querySelector('.mip-backend').animate([
          {
            transform: 'translate3D(0, 0, 0)',
            opacity: 1
          },
          {
            transform: 'translate3D(0, 100%, 0)',
            opacity: 0
          }
        ], {
            fill: 'forwards',
            easing: 'ease-out',
            duration: 280
          });
        eleAnimation.play();
      };
      return MIPStoryBackEnd;
    });

    // ======================
    // mip-story/mip-progress.js
    // ======================


    /**
     * @file mip-story 组件
     * @author
     */
    define('mip-story/mip-progress', [
      'require',
      'util',
      './animation-util',
      'fetch-jsonp'
    ], function (require) {
      'use strict';
      var ACTIVE = 'mip-story-page-progress-bar-active';
      var VISITED = 'mip-story-page-progress-bar-visited';
      var css = require('util').css;
      var timeStrFormat = require('./animation-util').timeStrFormat;
      var fetchJsonp = require('fetch-jsonp');
      var util = require('util');
      var MSITEAPI = 'https://msite.baidu.com/home/bar?office_id=';
      /**
       * [MIPProgress 头部导航进度条]
       * @param {Element} root    mip-story根节点
       * @param {[type]} elements  mip-story-view 节点数组
       * @param {[type]} audioHide 是否隐藏音频
       * @param {[type]} storyConfig 小故事配置
       */
      function MIPProgress (root, elements, audioHide, storyConfig) {
        this.root = root;
        this.elements = elements;
        this.audioHide = audioHide;
        this.storyConfig = storyConfig;
        this.win = window;
        this.items = {};
        this.oldEle;
      }
      MIPProgress.prototype.build = function () {
        var closeStats = encodeURIComponent(JSON.stringify({
          type: 'click',
          data: [
            '_trackEvent',
            '小故事关闭按钮',
            '点击',
            window.location.href
          ]
        }));
        var content = '<aside class="mip-story-system-layer">';
        content += '<ol class="mip-story-progress-bar">';
        for (var i = 0; i < this.elements.length; i++) {
          content += '<li class="mip-story-page-progress-bar">' + '<div class="mip-story-page-progress-value"></div>' + '</li>';
        }
        content += '</ol><div class="control">';
        if (history.length > 1) {
          content += '<span class="mip-story-close" data-stats-baidu-obj="' + closeStats + '"></span>';
        }
        var muteStats = encodeURIComponent(JSON.stringify({
          type: 'click',
          data: [
            '_trackEvent',
            '音频静音按钮',
            '点击',
            window.location.href
          ]
        }));
        content += this.showAudio() ? '<span class="mip-stoy-audio" data-stats-baidu-obj="' + muteStats + '"></span></div></aside>' : '';
        return content;
      };
      MIPProgress.prototype.showAudio = function () {
        var ele = this.root.querySelectorAll('audio, video');
        return !!ele.length && !this.audioHide;
      };
      MIPProgress.prototype.updateProgress = function (index, status) {
        this.progressBar = this.root.querySelectorAll('.mip-story-progress-bar .mip-story-page-progress-value');
        this.ele = this.progressBar[index];
        // 设置当前元素的状态
        this.setCurrentEleStatus(index, status);
        // 处理其他views的状态
        this.setOtherEleStatus(index, status);
        this.oldEle = this.ele;
      };
      MIPProgress.prototype.setCurrentEleStatus = function (index, status) {
        var autoAdvanceDuration = timeStrFormat(this.elements[index].getAttribute('auto-advancement-after'));
        // 后续会有场景视频播放时，如果遇到缓冲，则需要暂停动画
        // 所以采用 WebAnimation API来进行头部切换动画的控制；
        // 处理其他views的状态
        if (!this.ele.animatePlayer) {
          this.setCurrentEleAnimatePlayer(autoAdvanceDuration);
        } else {
          // 这里对自动播放和非自动播放做了不同处理
          // 如果设置了自动播放或者当前不是被访问过的状态，就重新播放动画；
          if (autoAdvanceDuration || status) {
            // WAAPI的polyfill 在cancelapi上的实现和标准有点不一致，这里手动处理下；
            css(this.ele, { transform: 'scale3d(0, 1, 0)' });
            this.ele.classList.remove(VISITED);
            this.ele.animatePlayer.play();
          }
        }
        ;
      };
      MIPProgress.prototype.setOtherEleStatus = function (index, status) {
        // 处理前一个元素的状态
        if (this.oldEle && this.oldEle !== this.ele) {
          this.resetOldEleStatus(status, index);
        }
        // 往前翻页时需要init后面页面的动画
        if (status) {
          for (var i = index + 1; i < this.progressBar.length; i++) {
            this.cancelEleVistedStatus(this.progressBar[i]);
          }
        }
      };
      MIPProgress.prototype.resetOldEleStatus = function (status, index) {
        // 向后翻
        if (status) {
          this.oldEle.classList.add(VISITED);
          this.oldEle.animatePlayer && this.oldEle.animatePlayer.finish();
        } else {
          // 往前翻时需要清除元素已经播放过的状态
          this.cancelEleVistedStatus(this.oldEle);
        }
      };
      MIPProgress.prototype.cancelEleVistedStatus = function (ele) {
        if (ele) {
          css(ele, { transform: 'scale3d(0, 1, 0)' });
          ele.classList.remove(VISITED);
          ele.animatePlayer && ele.animatePlayer.cancel();
        }
      };
      MIPProgress.prototype.setCurrentEleAnimatePlayer = function (autoAdvanceDuration) {
        this.ele.animatePlayer = this.ele.animate([
          { transform: 'scale3d(0, 1, 1)' },
          { transform: 'scale3d(1, 1, 1)' }
        ], {
            easing: 'linear',
            duration: autoAdvanceDuration || 200,
            fill: 'forwards'
          });
      };
      MIPProgress.prototype.setIcon = function () {
        // var hostName = util.parseCacheUrl(location.hostname);
        var hostName = 'mip.geekpark.net';
        var url = MSITEAPI + this.storyConfig.icon.office_id + '&url=https://' + hostName;
        return fetchJsonp(url, {
          jsonpCallback: 'callback',
          timeout: 2000
        }).then(function (res) {
          return res.json();
        }).then(function (data) {
          var content = '';
          if (data.data.avatar&&data.data.name){
            var content = '<div class="icon-wrap"><div class="icon"><img src="' + data.data.avatar + '" alt=""></div><div class="icon-name">' + data.data.name + '</div><div class="icon-type">熊掌号</div></div>';
          }
          return content;
        }, function (err) {
          console.log(err);
        });
      };
      return MIPProgress;
    });

    // ======================
    // mip-story/mip-story-slider.js
    // ======================


    /**
     * @file mip-story-slider 组件
     * @author
     */
    define('mip-story/mip-story-slider', [
      'require',
      'viewport',
      'util'
    ], function (require) {
      'use strict';
      var storyContain = [];
      var emitter;
      var viewport = require('viewport');
      var CURRENT = 'current';
      var ACTIVE = 'active';
      var STYLE = 'style';
      var screenWidth = viewport.getWidth();
      var screenHeight = viewport.getHeight();
      // 左右翻页的阀值
      var SWITCHPAGE_THRESHOLD = viewport.getWidth() * 0.15;
      // 上下翻页的阀值
      var SWITCHPAGE_THRESHOLD_HEIGHT = viewport.getHeight() * 0.1;
      var SWITCHTYPES = {};
      var switchPageType = '';
      var initViewForSwitchCB;
      var sliderStartCB;
      var resetSlideEndViewCB;
      var showDampingCB;
      var util = require('util');
      var dm = util.dom;
      var SLIDEMOVING = 'slideMoving';
      var storyInstance;
      var storyInstanceEle;
      var sliderTime = 200;
      var reboundTime = 80;
      var recommend;
      var DIRECTIONMAP = {
        back: 'back',
        goto: 'goto'
      };
      var directionMap = {
        back: 'back',
        goto: 'goto'
      };
      function MIPStorySlider (param) {
        // story的实例
        storyInstance = param.storyInstance;
        switchPageType = param.switchPageType;
        SWITCHTYPES = param.SWITCHTYPES;
        initViewForSwitchCB = param.initfirstViewStatus;
        sliderStartCB = param.openAutoplay;
        resetSlideEndViewCB = param.resetSlideEndView;
        showDampingCB = param.showDamping;
        // 小故事实例ele
        storyInstanceEle = storyInstance.element;
        // story中每个页面包括分享页
        storyContain = storyInstance.storyContain;
        // story的自定义事件监控器
        emitter = storyInstance.emitter;
        // 翻页的交互类型
        // 翻页的页面state
        this.currentIndex = this.preIndex = this.nextIndex = 0;
        this.touchstartX = this.touchendX = 0;
        this.moveFlag = false;
      }
      function enableScroll (ele) {
        if (ele && ele.addEventListener) {
          ele.addEventListener('touchstart', function () {
            if (ele.scrollTop == 0) {
              ele.scrollTop = 1;
            }
          });
          ele.addEventListener('touchmove', function (e) {
            if (ele.scrollTop > 0) {
              e.stopPropagation();
            }
          }, false);
        }
      }
      function isPositionChange (index) {
        var currentEle = storyContain[index];
        var transformMatrix = currentEle.style.transform;
        var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
        if (matrix[0] == 0) {
          return false;
        }
        return true;
      }
      function setSliderPosition (ele, isPre, changemove) {
        var width = isPre ? -screenWidth : screenWidth;
        var height = isPre ? -screenHeight : screenHeight;
        if (ele == null) {
          return;
        }
        // 根据手指位移而修改位移
        if (changemove != null) {
          if (switchPageType == SWITCHTYPES.slideX) {
            ele.style.transform = 'translate(' + changemove + 'px, 0)';
            ele.style.webkitTransform = 'translate(' + changemove + 'px, 0)';
          } else {
            ele.style.transform = 'translate(0, ' + changemove + 'px)';
            ele.style.webkitTransform = 'translate(0, ' + changemove + 'px)';
          }
        }    // 设置翻页前的前一页和后一页的位置
        else {
          if (switchPageType == SWITCHTYPES.slideX) {
            ele.style.transform = 'translate(' + width + 'px, 0)';
            ele.style.webkitTransform = 'translate(' + width + 'px, 0)';
          } else {
            ele.style.webkitTransform = 'translate(0, ' + height + 'px)';
          }
        }
      }
      function setTransitionDuration (ele, time) {
        ele.style.transition = 'transform ' + time + 'ms ease';
        ele.style.webkitTransition = 'transform ' + time + 'ms ease';
      }
      MIPStorySlider.prototype.build = function () {
        // 禁止橡皮筋效果
        document.addEventListener('touchmove', function (e) {
          e.preventDefault();
        }, { passive: false });
        // 初始化段落布局
        this.initViewForSlider();
        this.bindEvent();
        recommend = storyInstanceEle.querySelector('.recommend');
      };
      MIPStorySlider.prototype.bindEvent = function () {
        // 开始滑动
        this.sliderStart();
        // 滑动中
        this.sliding();
        // 结束滑动
        this.sliderEnd();
      };
      // 初始化view的最初排布
      MIPStorySlider.prototype.initViewForSlider = function () {
        this.preIndex = this.currentIndex = this.nextIndex = 0;
        var preEle = storyContain[this.preIndex];
        var currentEle = storyContain[this.currentIndex];
        var nextEle = storyContain[this.nextIndex];
        // 添加current状态
        this.setCurrentPage();
        // 清除当前所有view已有的样式
        this.clearStyle();
        if (storyContain.length >= 2) {
          this.nextIndex = this.currentIndex + 1;
          nextEle = storyContain[this.nextIndex];
          this.setViewStatus(true, ACTIVE, nextEle);
          // 初始化下一页的位置
          setSliderPosition(nextEle, false);
        }
        initViewForSwitchCB({
          preIndex: this.preIndex,
          currentIndex: this.currentIndex,
          nextIndex: this.nextIndex
        });
      };
      MIPStorySlider.prototype.sliderStart = function () {
        var self = this;
        var currentEle = storyContain[this.currentIndex];
        // 对story进行手势的监控
        storyInstanceEle.addEventListener('touchstart', function (e) {
          // 如果正处于翻页状态跳出
          if (self.moveFlag) {
            return;
          }
          var touch = e.targetTouches[0];
          self.touchstartX = touch.pageX;
          self.touchstartY = touch.pageY;
          sliderStartCB(e);
        });
      };
      MIPStorySlider.prototype.sliding = function () {
        var self = this;
        // 对story进行手势的监控
        storyInstanceEle.addEventListener('touchmove', function (e) {
          // 特殊处理，分享页更多小故事滚动，禁止翻页滚动
          if (dm.contains(recommend, e.target)) {
            return;
          }
          // 如果正处于翻页状态跳出
          if (self.moveFlag) {
            return;
          }
          self.slideMoving(e);
        });
      };
      MIPStorySlider.prototype.sliderEnd = function () {
        var self = this;
        // 对story进行手势的监控
        storyInstanceEle.addEventListener('touchend', function (e) {
          // 特殊处理，分享页更多小故事滚动，禁止翻页滚动
          if (dm.contains(recommend, e.target)) {
            return;
          }
          // 如果正处于翻页状态跳出
          if (self.moveFlag) {
            return;
          }
          var touch = e.changedTouches[0];
          self.touchendX = touch.pageX;
          self.touchendY = touch.pageY;
          // 只是点击当前页面的内容
          if (self.touchendX == self.touchstartX && self.touchendY == self.touchstartY) {
            self.moveFlag = false;
            return;
          } else {
            // 关闭其他滑动事件
            self.moveFlag = true;
            // 翻页
            self.setMovingEnd(e);
            // 还原state
            self.touchstartX = self.touchendX = 0;
          }
        });
      };
      MIPStorySlider.prototype.setMovingEnd = function (e) {
        var data = this.getMoveData(e);
        var move = data.move;
        var preActiveMove = data.preActiveMove;
        var nextActiveMove = data.nextActiveMove;
        var threshold = data.threshold;
        // 首先判断边界值
        if (this.setConfineEle(e)) {
          if (isPositionChange(this.currentIndex)) {
            this.setRebound();
          }
          return;
        }
        // 判断滑动的距离小于阀值-弹回
        if (Math.abs(move) <= threshold) {
          this.setRebound();
          // 恢复原状的事件处理
          this.resetReboundEndStatus();
        }    // 判断滑动的距离大于阀值-翻页
        else {
          this.switchEnd(e);
        }
      };
      MIPStorySlider.prototype.resetMovingEndStatus = function (direction) {
        var self = this;
        var preEle = storyContain[this.preIndex];
        var currentEle = storyContain[this.currentIndex];
        var nextEle = storyContain[this.nextIndex];
        // 翻页结束后，重设页面状态
        setTimeout(function () {
          self.moveFlag = false;
          self.resetViewForSwitch(direction || DIRECTIONMAP.goto);
        }, +sliderTime);
      };
      MIPStorySlider.prototype.resetViewForSwitch = function (direction) {
        // 往后翻页
        var isPre = false;
        switch (direction) {
          case DIRECTIONMAP.back:
            this.nextIndex = this.currentIndex;
            this.currentIndex = this.preIndex;
            this.preIndex = this.preIndex - 1 < 0 ? this.preIndex : this.preIndex - 1;
            break;
          case DIRECTIONMAP.goto:
            isPre = true;
            this.preIndex = this.currentIndex;
            this.currentIndex = this.currentIndex + 1;
            this.nextIndex = this.currentIndex + 1 >= storyContain.length ? this.currentIndex : this.currentIndex + 1;
            break;
          default:
            break;
        }
        var preEle = storyContain[this.preIndex];
        var currentEle = storyContain[this.currentIndex];
        var nextEle = storyContain[this.nextIndex];
        // 添加current状态
        this.setCurrentPage();
        // 清除当前所有view已有的样式
        this.clearStyle();
        var preChangeIndex;
        if (this.preIndex != this.currentIndex) {
          this.setViewStatus(true, ACTIVE, preEle);
          setSliderPosition(preEle, isPre, null);
        }
        if (this.nextIndex != this.currentIndex) {
          this.setViewStatus(true, ACTIVE, nextEle);
          setSliderPosition(nextEle, !isPre, null);
        }
        this.setViewStatus(true, CURRENT, currentEle);
        setSliderPosition(currentEle, null, 0);
        var index = {
          preIndex: this.preIndex,
          currentIndex: this.currentIndex,
          nextIndex: this.nextIndex,
          direction: this.direction === DIRECTIONMAP.back ? 0 : 1
        };
        resetSlideEndViewCB(index);
      };
      MIPStorySlider.prototype.getSwitchDirection = function (e) {
        this.direction = DIRECTIONMAP.goto;
        if (e) {
          var data = this.getMoveData(e);
          var move = data.move;
          if (move >= 0) {
            this.direction = DIRECTIONMAP.back;
          }
        }    // return direction;
      };
      MIPStorySlider.prototype.switchEnd = function (e) {
        var self = this;
        var preEle = storyContain[this.preIndex];
        var currentEle = storyContain[this.currentIndex];
        var nextEle = storyContain[this.nextIndex];
        var isPre = false;
        this.getSwitchDirection(e);
        switch (self.direction) {
          case DIRECTIONMAP.back:
            setSliderPosition(preEle, null, 0);
            setTransitionDuration(preEle, sliderTime);
            break;
          case DIRECTIONMAP.goto:
            isPre = true;
            setSliderPosition(nextEle, null, 0);
            setTransitionDuration(nextEle, sliderTime);
            break;
          default:
            break;
        }
        setSliderPosition(currentEle, isPre, null);
        setTransitionDuration(currentEle, sliderTime);
        // 重新设置页面状态
        this.resetMovingEndStatus(self.direction);
      };
      MIPStorySlider.prototype.resetReboundEndStatus = function () {
        var self = this;
        var preEle = storyContain[this.preIndex];
        var currentEle = storyContain[this.currentIndex];
        var nextEle = storyContain[this.nextIndex];
        // 未翻页成功，页面回弹后重设页面状态
        setTimeout(function () {
          self.moveFlag = false;
          self.resetViewStyle();
        }, reboundTime);
      };
      MIPStorySlider.prototype.resetViewStyle = function () {
        var preEle = storyContain[this.preIndex];
        var currentEle = storyContain[this.currentIndex];
        var nextEle = storyContain[this.nextIndex];
        if (this.preIndex != this.currentIndex) {
          preEle.removeAttribute('style');
          setSliderPosition(preEle, true);
        }
        if (this.nextIndex != this.currentIndex) {
          nextEle.removeAttribute('style');
          setSliderPosition(nextEle, false);
        }
        currentEle.removeAttribute('style');
        if (this.currentIndex === storyContain.length - 1) {
          enableScroll(storyInstanceEle.querySelector('.mip-backend-outer'));
          enableScroll(storyInstanceEle.getElementsByTagName('mip-scrollbox'));
        }
      };
      MIPStorySlider.prototype.setConfineEle = function (e) {
        var data = this.getMoveData(e);
        var move = data.move;
        var isConfineEle = false;
        // 判断边界值
        // 第一页往前滑动
        if (this.currentIndex <= 0 && move > 0) {
          this.moveFlag = false;
          // 展示蒙层告知不可滑动
          showDampingCB();
          isConfineEle = true;
        }
        // 最后一页往后滑动
        if (this.currentIndex + 1 >= storyContain.length && move <= 0) {
          this.moveFlag = false;
          isConfineEle = true;
        }
        return isConfineEle;
      };
      MIPStorySlider.prototype.slideMoving = function (e) {
        var data = this.getMoveData(e);
        var move = data.move;
        var preActiveMove = data.preActiveMove;
        var nextActiveMove = data.nextActiveMove;
        var preEle = storyContain[this.preIndex];
        var currentEle = storyContain[this.currentIndex];
        var nextEle = storyContain[this.nextIndex];
        // 首先判断边界值
        if (this.setConfineEle(e)) {
          return;
        }
        // 页面的滑动
        if (this.currentIndex != this.preIndex) {
          setSliderPosition(preEle, null, preActiveMove);
        }
        if (this.currentIndex != this.nextIndex) {
          setSliderPosition(nextEle, null, nextActiveMove);
        }
        setSliderPosition(currentEle, null, move);
      };
      MIPStorySlider.prototype.getMoveData = function (e) {
        var touch = e.targetTouches[0] || e.changedTouches[0];
        var moveX = touch.pageX - this.touchstartX;
        var moveY = touch.pageY - this.touchstartY;
        var move = moveX;
        var preActiveMove = -screenWidth + moveX;
        var nextActiveMove = screenWidth + moveX;
        var threshold = SWITCHPAGE_THRESHOLD;
        if (switchPageType === SWITCHTYPES.slideY) {
          move = moveY;
          preActiveMove = -screenHeight + moveY;
          nextActiveMove = screenHeight + moveY;
          threshold = SWITCHPAGE_THRESHOLD_HEIGHT;
        }
        var data = {
          move: move,
          preActiveMove: preActiveMove,
          nextActiveMove: nextActiveMove,
          threshold: threshold
        };
        return data;
      };
      MIPStorySlider.prototype.setRebound = function (e) {
        var preEle = storyContain[this.preIndex];
        var currentEle = storyContain[this.currentIndex];
        var nextEle = storyContain[this.nextIndex];
        if (this.preIndex !== this.currentIndex) {
          setSliderPosition(preEle, true);
          setTransitionDuration(preEle, reboundTime);
        }
        if (this.nextIndex !== this.currentIndex) {
          setSliderPosition(nextEle, false);
          setTransitionDuration(nextEle, reboundTime);
        }
        setSliderPosition(currentEle, null, 0);
        setTransitionDuration(currentEle, reboundTime);
      };
      MIPStorySlider.prototype.setCurrentPage = function (status) {
        for (var i = 0; i < storyContain.length; i++) {
          if (i === this.currentIndex) {
            // 设置当前页面为current状态
            this.setViewStatus(true, CURRENT, storyContain[i]);
          } else {
            // 清除非当前页的current状态，确保只有一个current页
            this.setViewStatus(false, CURRENT, storyContain[i]);
          }
          // 如果当前页面原先为active状态则清除
          if (this.hasStatus(ACTIVE, storyContain[i])) {
            this.setViewStatus(false, ACTIVE, storyContain[i]);
          }
        }
      };
      MIPStorySlider.prototype.clearStyle = function () {
        for (var i = 0; i < storyContain.length; i++) {
          if (this.hasStatus(STYLE, storyContain[i])) {
            this.setViewStatus(false, STYLE, storyContain[i]);
            storyContain[i].removeAttribute(STYLE);
          }
        }
      };
      // 用来判断当前ele是否有要判断的status，例如style/current/active的状态
      MIPStorySlider.prototype.hasStatus = function (viewStatue, viewEle) {
        if (viewStatue && viewEle) {
          return viewEle.hasAttribute(viewStatue);
        }
      };
      MIPStorySlider.prototype.setViewStatus = function (isSetStatus, viewStatue, viewEle) {
        if (viewEle && viewStatue) {
          if (isSetStatus) {
            viewEle.setAttribute(viewStatue, '');
          } else {
            viewEle.removeAttribute(viewStatue);
          }
        }
      };
      return MIPStorySlider;
    });

    // ======================
    // mip-story/mip-story-clickswitch.js
    // ======================


    /**
     * @file mip-story-clickswitch 组件
     * @author
     */
    define('mip-story/mip-story-clickswitch', [
      'require',
      'util'
    ], function (require) {
      'use strict';
      var CURRENT = 'current';
      var storyContain;
      var storyViews;
      var util = require('util');
      var Gesture = util.Gesture;
      var dm = util.dom;
      var storyInstance;
      var storyInstanceEle;
      var showDampingCB;
      var resetClickEndStatusCB;
      var isShowSwitchLayerCB;
      function MIPStoryClickSwitch (param) {
        // story的实例
        storyInstance = param.storyInstance;
        // 小故事实例ele
        // storyInstanceEle = storyInstance.element;
        this.hint = storyInstance.hint;
        // story中每个页面包括分享页
        storyContain = storyInstance.storyContain;
        storyViews = storyInstance.storyViews;
        showDampingCB = param.showDamping;
        resetClickEndStatusCB = param.resetClickEndStatus;
        isShowSwitchLayerCB = param.showSwitchLayer;
        this.preIndex = this.currentIndex = this.nextIndex = 0;
      }
      MIPStoryClickSwitch.prototype.build = function () {
        this.initViewForSwitch();
        this.swipe();
      };
      // 初始化第一页
      MIPStoryClickSwitch.prototype.initViewForSwitch = function () {
        this.switchTo({
          status: 1,
          notIncrease: 1
        });
      };
      // 点击翻页
      MIPStoryClickSwitch.prototype.switchPage = function (e) {
        // 翻页逻辑
        var centerX = (storyInstance.element.offsetLeft + storyInstance.element.offsetWidth) / 2;
        // 向右切换
        if (e.pageX > centerX) {
          this.switchTo({
            e: e,
            status: 1
          });
        }    // 向左切换
        else {
          this.switchTo({
            e: e,
            status: 0
          });
        }
      };
      MIPStoryClickSwitch.prototype.swipe = function () {
        var gesture = new Gesture(storyInstance.element, { preventX: false });
        var self = this;
        // 绑定点击事件
        gesture.on('swipe', function (e, data) {
          if (data.swipeDirection === 'left' || data.swipeDirection === 'right') {
            var backend = document.querySelector('.mip-backend');
            if (dm.contains(backend, e.target)) {
              return;
            }
            self.hint.toggleSystemLater();
          }
        });
      };
      MIPStoryClickSwitch.prototype.switchTo = function (data) {
        this.hint.hideDamping();
        this.hint.hideSystemLater();
        if (data.status === 0 && this.currentIndex <= 0) {
          showDampingCB();
          return;
        } else if (!data.notIncrease && data.status === 1 && this.currentIndex + 1 >= storyViews.length) {
          this.setViewStatue(false, CURRENT, storyViews[this.currentIndex]);
          this.showBookEnd();
          return;
        }
        if (!data.notIncrease) {
          data.status === 1 ? this.currentIndex++ : this.currentIndex--;
        }
        var currentEle = storyViews[this.currentIndex];
        var preEle = storyViews[this.preIndex];
        if (this.currentIndex !== this.preIndex) {
          this.setViewStatue(false, CURRENT, preEle);
        }
        this.setViewStatue(true, CURRENT, currentEle);
        var index = {
          preIndex: this.preIndex,
          currentIndex: this.currentIndex,
          status: data.status
        };
        resetClickEndStatusCB(index);
        this.preIndex = this.currentIndex;
        // 右翻
        if (!data.notIncrease) {
          isShowSwitchLayerCB(data.status);
        }
      };
      MIPStoryClickSwitch.prototype.showBookEnd = function () {
        var ele = storyContain[storyContain.length - 1];
        this.setViewStatue(true, CURRENT, ele);
        var eleAnimation = ele.animate([
          {
            transform: 'translate3D(0, 100%, 0)',
            opacity: 0
          },
          {
            transform: 'translate3D(0, 0, 0)',
            opacity: 1
          }
        ], {
            fill: 'forwards',
            easing: 'ease-in',
            duration: 280
          });
        eleAnimation.play();
      };
      MIPStoryClickSwitch.prototype.goBack = function () {
        this.setViewStatue(true, CURRENT, storyViews[this.currentIndex]);
        this.closeBookEnd();
      };
      MIPStoryClickSwitch.prototype.closeBookEnd = function () {
        var ele = storyContain[storyContain.length - 1];
        this.setViewStatue(true, CURRENT, ele);
        var eleAnimation = ele.animate([
          {
            transform: 'translate3D(0, 0, 0)',
            opacity: 1
          },
          {
            transform: 'translate3D(0, 100%, 0)',
            opacity: 0
          }
        ], {
            fill: 'forwards',
            easing: 'ease-out',
            duration: 280
          });
        eleAnimation.play();
      };
      MIPStoryClickSwitch.prototype.setViewStatue = function (isSetStatus, viewStatue, viewEle) {
        if (viewEle && viewStatue) {
          if (isSetStatus) {
            viewEle.setAttribute(viewStatue, '');
          } else {
            viewEle.removeAttribute(viewStatue);
          }
        }
      };
      MIPStoryClickSwitch.prototype.swip = function (e) {
        if (e.data.swipeDirection === 'left' || e.data.swipeDirection === 'right') {
          var backend = document.querySelector('.mip-backend');
          if (dm.contains(backend, e.target)) {
            return;
          }
          this.hint.toggleSystemLater();
        }
      };
      return MIPStoryClickSwitch;
    });

    // ======================
    // mip-story/mip-story-service.js
    // ======================


    /**
     * @file mip-story-service 组件
     * @author
     */
    define('mip-story/mip-story-service', [
      'require',
      'viewport',
      './mip-story-slider',
      './mip-story-clickswitch',
      'util'
    ], function (require) {
      'use strict';
      var storyContain = [];
      var storyViews = [];
      var emitter;
      var viewport = require('viewport');
      var CURRENT = 'current';
      var ACTIVE = 'active';
      var STYLE = 'style';
      var screenWidth = viewport.getWidth();
      var screenHeight = viewport.getHeight();
      var SWITCHTYPES = {
        click: 'click',
        slideX: 'slideX',
        slideY: 'slideY',
        autoPlay: 'autoPlay'
      };
      var switchPageType = SWITCHTYPES.slideX;
      var Slider = require('./mip-story-slider');
      var slider;
      var ClickSwitch = require('./mip-story-clickswitch');
      var clickSwitch;
      var util = require('util');
      var dm = util.dom;
      var EventEmitter = util.EventEmitter;
      var OPENAUTOPLAY = 'openAutoplay';
      var UNMUTE = 'unmute';
      var MUTE = 'mute';
      var TAPNAVIGATION = 'tapnavigation';
      var REPLAY = 'replay';
      var VISIBILITYCHANGE = 'visibilitychange';
      var CREATESLIDER = 'createSlider';
      var CLICKSWITCH = 'clickSwitch';
      var SWITCHPAGE = 'switchPage';
      var reload;
      function MIPStoryService (storyInstance) {
        // story的实例
        this.storyInstance = storyInstance;
        this.audio = storyInstance.audio;
        this.share = storyInstance.share;
        this.viewMuted = storyInstance.viewMuted;
        this.bookEnd = storyInstance.bookEnd;
        this.progress = storyInstance.progress;
        this.hint = storyInstance.hint;
        // story中每个页面包括分享页
        storyContain = storyInstance.storyContain;
        storyViews = storyInstance.storyViews;
        this.preIndex = this.currentIndex = this.nextIndex = 0;
        this.preEle = storyViews[this.preIndex].customElement;
        this.currentEle = storyViews[this.currentIndex].customElement;
        this.nextEle = storyViews[this.nextIndex].customElement;
      }
      MIPStoryService.prototype.build = function () {
        // 初始化滑动组件
        var self = this;
        reload = this.storyInstance.element.hasAttribute('audio-reload');
        // 进行事件的监听；
        this.bindEvent();
        // 左右或者上下翻页
        if (switchPageType == SWITCHTYPES.slideX || switchPageType == SWITCHTYPES.slideY) {
          self.emitter.trigger(CREATESLIDER);
        }    // 点击翻页
        else if (switchPageType == SWITCHTYPES.click) {
          self.emitter.trigger(CLICKSWITCH);
        }
        // 页面切换到后台
        document.addEventListener(VISIBILITYCHANGE, function (e) {
          self.emitter.trigger(VISIBILITYCHANGE, e);
        });
        this.storyInstance.element.addEventListener('click', function (e) {
          self.emitter.trigger(TAPNAVIGATION, e);
        });
      };
      MIPStoryService.prototype.clickSwitch = function () {
        var self = this;
        var clickSwitchParam = {
          storyInstance: this.storyInstance,
          showDamping: this.showDamping.bind(this),
          resetClickEndStatus: this.resetClickEndStatus.bind(this),
          showSwitchLayer: this.showSwitchLayer.bind(this)
        };
        clickSwitch = new ClickSwitch(clickSwitchParam);
        clickSwitch.build();
      };
      MIPStoryService.prototype.resetClickEndStatus = function (data) {
        this.preIndex = data.preIndex;
        this.currentIndex = data.currentIndex;
        this.resetViewEle();
        if (this.currentIndex !== this.preIndex) {
          this.preEle.setAllMedia(false, this.viewMuted, reload, this.emitter);
        }
        this.currentEle.setAllMedia(true, this.viewMuted, reload, this.emitter);
        this.progress.updateProgress(this.currentIndex, data.status);
      };
      MIPStoryService.prototype.showSwitchLayer = function (data) {
        if (data.status === 1) {
          this.hint.showPageSwitchLayer();
        } else {
          this.hint.hidePageSwitchLayer();
        }
      };
      MIPStoryService.prototype.createSlider = function () {
        var self = this;
        var sliderParam = {
          storyInstance: this.storyInstance,
          switchPageType: switchPageType,
          SWITCHTYPES: SWITCHTYPES,
          initfirstViewStatus: this.initfirstViewStatus.bind(this),
          openAutoplay: this.openAutoplay.bind(this),
          resetSlideEndView: this.resetSlideEndView.bind(this),
          showDamping: this.showDamping.bind(this)
        };
        slider = new Slider(sliderParam);
        slider.build();
      };
      MIPStoryService.prototype.showDamping = function () {
        this.hint.showDamping();
      };
      MIPStoryService.prototype.resetSlideEndView = function (index) {
        this.preIndex = index.preIndex;
        this.currentIndex = index.currentIndex;
        this.nextIndex = index.nextIndex;
        // 重新更新当前活跃的页面
        this.resetViewEle();
        // 在重设view状态时，如果前一页与当前页的不是同一页，需要进行状态修改
        if (this.preIndex != this.currentIndex) {
          this.preEle.setPreActive(this.emitter);
          this.preEle.setAllMedia(false, this.viewMuted, reload, this.emitter);
        }
        // 在重设view状态时，如果下一页与当前页的不是同一页并且下一页不是封底页，需要进行状态修改
        if (this.nextIndex != this.currentIndex && this.nextIndex <= storyViews.length - 1) {
          this.nextEle.setPreActive(this.emitter);
          this.nextEle.setAllMedia(false, this.viewMuted, reload, this.emitter);
        }
        if (this.currentIndex + 1 < storyContain.length) {
          this.currentEle.setAllMedia(true, this.viewMuted, reload, this.emitter);
          this.currentEle.setCssMedia(true, this.viewMuted, this.emitter);
          this.progress.updateProgress(this.currentIndex, index.direction);
        }
        this.clearCssMedia();
      };
      MIPStoryService.prototype.resetViewEle = function () {
        this.preEle = storyViews && storyViews[this.preIndex] && storyViews[this.preIndex].customElement || null;
        this.currentEle = storyViews && storyViews[this.currentIndex] && storyViews[this.currentIndex].customElement || null;
        this.nextEle = storyViews && storyViews[this.nextIndex] && storyViews[this.nextIndex].customElement || null;
      };
      MIPStoryService.prototype.initfirstViewStatus = function (index) {
        this.preIndex = index.preIndex;
        this.currentIndex = index.currentIndex;
        this.nextIndex = index.nextIndex;
        // 重新更新当前活跃的页面
        this.resetViewEle();
        // 激活当前页的的多媒体
        this.currentEle.setAllMedia(true, this.viewMuted, reload, this.emitter);
        this.currentEle.setCssMedia(true, this.viewMuted, this.emitter);
        // 初始化下一页的动画效果
        this.nextEle.setPreActive(this.emitter);
        // 清除其余所有页面的动画
        this.clearCssMedia();
      };
      MIPStoryService.prototype.clearCssMedia = function () {
        for (var i = 0; i < storyViews.length; i++) {
          if (i != this.preIndex && i != this.currentIndex && i != this.nextIndex) {
            // 由于CSS3中动画效果在翻页过程中会丢掉第一帧，此处的动画控制放到view的组件中控制
            storyViews[i].customElement.clearCssMedia();
          }
        }
      };
      MIPStoryService.prototype.bindEvent = function () {
        this.emitter = new EventEmitter();
        this.emitter.on(OPENAUTOPLAY, this.openAutoplay.bind(this));
        this.emitter.on(MUTE, this.mute.bind(this));
        this.emitter.on(UNMUTE, this.unmute.bind(this));
        this.emitter.on(TAPNAVIGATION, this.tapnavigation.bind(this));
        this.emitter.on(REPLAY, this.replay.bind(this));
        this.emitter.on(VISIBILITYCHANGE, this.visibilitychange.bind(this));
        this.emitter.on(CREATESLIDER, this.createSlider.bind(this));
        this.emitter.on(CLICKSWITCH, this.clickSwitch.bind(this));
        this.emitter.on(SWITCHPAGE, this.switchPage.bind(this));
      };
      MIPStoryService.prototype.switchPage = function (param) {
        if (switchPageType == SWITCHTYPES.click && clickSwitch) {
          clickSwitch.switchTo(param);
        }
        if (switchPageType != SWITCHTYPES.click && slider) {
          slider.switchEnd();
        }
      };
      MIPStoryService.prototype.tapnavigation = function (e) {
        e.stopPropagation();
        var storyEle = this.storyInstance.element;
        var backend = storyEle.querySelector('.mip-backend');
        var replay = storyEle.querySelector('.mip-backend-preview');
        var shareBtn = storyEle.querySelector('.mip-backend-share');
        var shareArea = storyEle.querySelector('.mip-story-share');
        var cancelBtn = storyEle.querySelector('.mip-story-share-cancel');
        var back = 'mip-story-close';
        var audio = storyEle.querySelector('.mip-stoy-audio');
        var recommend = storyEle.querySelector('.recommend');
        var shareAreaShow = storyEle.querySelector('.mip-story-share-show');
        if (!dm.contains(shareArea, e.target) && shareAreaShow) {
          this.share.hideShareLayer();
          return;
        }
        // 推荐
        if (dm.contains(recommend, e.target)) {
          var ele = storyEle.querySelector('.item-from');
          var src = e.target.getAttribute('data-src');
          if (e.target.nodeName.toLocaleLowerCase() === 'a' && ele != e.target) {
            var href = e.target.getAttribute('href');
            e.preventDefault();
            window.top.location.href = href;
            return;
          }
          if (ele === e.target && src) {
            e.preventDefault();
            window.top.location.href = src;
          }
          return;
        }
        // 返回上一页
        if (this.hasClass(e, back)) {
          history.back();
          return;
        }
        // 静音控制
        if (e.target === audio) {
          var enabled = audio.hasAttribute('muted');
          enabled ? this.emitter.trigger(UNMUTE, e) : this.emitter.trigger(MUTE, e);
          return;
        }
        // 重头开始播放
        if (dm.contains(replay, e.target)) {
          this.emitter.trigger(REPLAY);
          this.progress.updateProgress(0, 1);
          return;
        }    // 结尾页点击逻辑
        else if (dm.contains(backend, e.target)) {
          // 弹出分享
          if (dm.contains(shareBtn, e.target)) {
            this.share.showShareLayer();
          }    // 关闭结尾页-只有点击交互的时候触发
          else if (switchPageType == SWITCHTYPES.click) {
            clickSwitch.goBack();
          }
          return;
        }    // 分享点击
        else if (dm.contains(shareArea, e.target)) {
          // 关闭分享界面
          if (e.target === cancelBtn) {
            this.share.hideShareLayer();
          }
          return;
        }
        // 如果视频/音频不能 autoplay，则主动触发
        if (!this.hasPlay && !this.muted) {
          this.emitter.trigger(UNMUTE, e);
          this.hasPlay = true;
        }
        // 点击翻页的逻辑处理
        if (switchPageType == SWITCHTYPES.click && clickSwitch) {
          var self = this;
          clickSwitch.switchPage(e);
        }
      };
      MIPStoryService.prototype.hasClass = function (e, clsName) {
        var reg = new RegExp('\\s*' + clsName + '\\s*');
        return !!reg.exec(e.target.className);
      };
      MIPStoryService.prototype.replay = function () {
        var self = this;
        if (switchPageType == SWITCHTYPES.click) {
          clickSwitch = null;
          this.clickSwitch();
          clickSwitch.closeBookEnd();
          this.share.hideShareLayer();
          return;
        }
        slider.initViewForSlider(function (preIndex, currentIndex, nextIndex) {
          self.initfirstViewStatus(preIndex, currentIndex, nextIndex);
        });
        this.replayBookEnd();
      };
      MIPStoryService.prototype.replayBookEnd = function () {
        this.share.hideShareLayer();
      };
      MIPStoryService.prototype.openAutoplay = function (e) {
        // 如果视频/音频不能 autoplay，则主动触发
        if (!this.muted) {
          // 打开全局音频
          this.unMuteGlobalAudio();
          this.playGlobalAudio();
          e.target.removeAttribute('muted');
          // 初始化下一页的音频或者视频
          // 暂停下一页的视频
          this.resetViewEle();
          if (this.nextIndex <= storyViews.length - 1) {
            this.nextEle.muteAllMedia();
          }
          if (this.preIndex != this.currentIndex) {
            this.preEle.muteAllMedia();
          }
        }
      };
      MIPStoryService.prototype.unmute = function (e) {
        this.muted = false;
        this.viewMuted = false;
        this.unMuteGlobalAudio();
        this.playGlobalAudio();
        if (this.currentIndex <= storyViews.length - 1) {
          this.resetViewEle();
          this.currentEle.toggleAllMedia(e, this.viewMuted);
        }
        e.target.removeAttribute('muted');
      };
      MIPStoryService.prototype.mute = function (e) {
        this.muted = true;
        this.viewMuted = true;
        this.muteGlobalAudio();
        if (this.currentIndex <= storyViews.length - 1) {
          this.resetViewEle();
          this.currentEle.toggleAllMedia(e, this.viewMuted);
        }
        e.target.setAttribute('muted', '');
      };
      MIPStoryService.prototype.muteGlobalAudio = function () {
        if (this.audio) {
          this.audio.pause();
          this.audio.muted = true;
        }
      };
      MIPStoryService.prototype.unMuteGlobalAudio = function () {
        if (this.audio) {
          this.audio.play();
          this.audio.muted = false;
        }
      };
      MIPStoryService.prototype.playGlobalAudio = function () {
        if (this.audio && !this.muted) {
          this.audio.play();
        }
      };
      MIPStoryService.prototype.visibilitychange = function (e) {
        var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null;
        if (this.currentIndex <= storyViews.length - 1) {
          this.resetViewEle();
          this.currentEle.toggleAllMedia(e, this.viewMuted);
          if (document[hiddenProperty]) {
            this.pauseGlobalAudio();
            this.currentEle.pauseAllMedia();
          } else {
            this.playGlobalAudio();
            this.currentEle.resumeAllMedia();
          }
        }
      };
      MIPStoryService.prototype.pauseGlobalAudio = function () {
        if (this.audio) {
          this.audio.pause();
        }
      };
      return MIPStoryService;
    });

    // ======================
    // mip-story/web-animation.js
    // ======================


    // Copyright 2014 Google Inc. All rights reserved.
    //
    // Licensed under the Apache License, Version 2.0 (the "License");
    // you may not use this file except in compliance with the License.
    //     You may obtain a copy of the License at
    //
    // http://www.apache.org/licenses/LICENSE-2.0
    //
    // Unless required by applicable law or agreed to in writing, software
    // distributed under the License is distributed on an "AS IS" BASIS,
    // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    //     See the License for the specific language governing permissions and
    // limitations under the License.
    define('mip-story/web-animation', [], function () {
      !function (a, b) {
        var c = {}, d = {};
        !function (a, b) {
          function c (a) {
            if ('number' == typeof a)
              return a;
            var b = {};
            for (var c in a)
              b[c] = a[c];
            return b;
          }
          function d () {
            this._delay = 0, this._endDelay = 0, this._fill = 'none', this._iterationStart = 0, this._iterations = 1, this._duration = 0, this._playbackRate = 1, this._direction = 'normal', this._easing = 'linear', this._easingFunction = x;
          }
          function e () {
            return a.isDeprecated('Invalid timing inputs', '2016-03-02', 'TypeError exceptions will be thrown instead.', !0);
          }
          function f (b, c, e) {
            var f = new d();
            return c && (f.fill = 'both', f.duration = 'auto'), 'number' != typeof b || isNaN(b) ? void 0 !== b && Object.getOwnPropertyNames(b).forEach(function (c) {
              if ('auto' != b[c]) {
                if (('number' == typeof f[c] || 'duration' == c) && ('number' != typeof b[c] || isNaN(b[c])))
                  return;
                if ('fill' == c && -1 == v.indexOf(b[c]))
                  return;
                if ('direction' == c && -1 == w.indexOf(b[c]))
                  return;
                if ('playbackRate' == c && 1 !== b[c] && a.isDeprecated('AnimationEffectTiming.playbackRate', '2014-11-28', 'Use Animation.playbackRate instead.'))
                  return;
                f[c] = b[c];
              }
            }) : f.duration = b, f;
          }
          function g (a) {
            return 'number' == typeof a && (a = isNaN(a) ? { duration: 0 } : { duration: a }), a;
          }
          function h (b, c) {
            return b = a.numericTimingToObject(b), f(b, c);
          }
          function i (a, b, c, d) {
            return a < 0 || a > 1 || c < 0 || c > 1 ? x : function (e) {
              function f (a, b, c) {
                return 3 * a * (1 - c) * (1 - c) * c + 3 * b * (1 - c) * c * c + c * c * c;
              }
              if (e <= 0) {
                var g = 0;
                return a > 0 ? g = b / a : !b && c > 0 && (g = d / c), g * e;
              }
              if (e >= 1) {
                var h = 0;
                return c < 1 ? h = (d - 1) / (c - 1) : 1 == c && a < 1 && (h = (b - 1) / (a - 1)), 1 + h * (e - 1);
              }
              for (var i = 0, j = 1; i < j;) {
                var k = (i + j) / 2, l = f(a, c, k);
                if (Math.abs(e - l) < 0.00001)
                  return f(b, d, k);
                l < e ? i = k : j = k;
              }
              return f(b, d, k);
            };
          }
          function j (a, b) {
            return function (c) {
              if (c >= 1)
                return 1;
              var d = 1 / a;
              return (c += b * d) - c % d;
            };
          }
          function k (a) {
            C || (C = document.createElement('div').style), C.animationTimingFunction = '', C.animationTimingFunction = a;
            var b = C.animationTimingFunction;
            if ('' == b && e())
              throw new TypeError(a + ' is not a valid value for easing');
            return b;
          }
          function l (a) {
            if ('linear' == a)
              return x;
            var b = E.exec(a);
            if (b)
              return i.apply(this, b.slice(1).map(Number));
            var c = F.exec(a);
            return c ? j(Number(c[1]), {
              start: y,
              middle: z,
              end: A
            }[c[2]]) : B[a] || x;
          }
          function m (a) {
            return Math.abs(n(a) / a.playbackRate);
          }
          function n (a) {
            return 0 === a.duration || 0 === a.iterations ? 0 : a.duration * a.iterations;
          }
          function o (a, b, c) {
            if (null == b)
              return G;
            var d = c.delay + a + c.endDelay;
            return b < Math.min(c.delay, d) ? H : b >= Math.min(c.delay + a, d) ? I : J;
          }
          function p (a, b, c, d, e) {
            switch (d) {
              case H:
                return 'backwards' == b || 'both' == b ? 0 : null;
              case J:
                return c - e;
              case I:
                return 'forwards' == b || 'both' == b ? a : null;
              case G:
                return null;
            }
          }
          function q (a, b, c, d, e) {
            var f = e;
            return 0 === a ? b !== H && (f += c) : f += d / a, f;
          }
          function r (a, b, c, d, e, f) {
            var g = a === 1 / 0 ? b % 1 : a % 1;
            return 0 !== g || c !== I || 0 === d || 0 === e && 0 !== f || (g = 1), g;
          }
          function s (a, b, c, d) {
            return a === I && b === 1 / 0 ? 1 / 0 : 1 === c ? Math.floor(d) - 1 : Math.floor(d);
          }
          function t (a, b, c) {
            var d = a;
            if ('normal' !== a && 'reverse' !== a) {
              var e = b;
              'alternate-reverse' === a && (e += 1), d = 'normal', e !== 1 / 0 && e % 2 != 0 && (d = 'reverse');
            }
            return 'normal' === d ? c : 1 - c;
          }
          function u (a, b, c) {
            var d = o(a, b, c), e = p(a, c.fill, b, d, c.delay);
            if (null === e)
              return null;
            var f = q(c.duration, d, c.iterations, e, c.iterationStart), g = r(f, c.iterationStart, d, c.iterations, e, c.duration), h = s(d, c.iterations, g, f), i = t(c.direction, h, g);
            return c._easingFunction(i);
          }
          var v = 'backwards|forwards|both|none'.split('|'), w = 'reverse|alternate|alternate-reverse'.split('|'), x = function (a) {
            return a;
          };
          d.prototype = {
            _setMember: function (b, c) {
              this['_' + b] = c, this._effect && (this._effect._timingInput[b] = c, this._effect._timing = a.normalizeTimingInput(this._effect._timingInput), this._effect.activeDuration = a.calculateActiveDuration(this._effect._timing), this._effect._animation && this._effect._animation._rebuildUnderlyingAnimation());
            },
            get playbackRate () {
              return this._playbackRate;
            },
            set delay (a) {
              this._setMember('delay', a);
            },
            get delay () {
              return this._delay;
            },
            set endDelay (a) {
              this._setMember('endDelay', a);
            },
            get endDelay () {
              return this._endDelay;
            },
            set fill (a) {
              this._setMember('fill', a);
            },
            get fill () {
              return this._fill;
            },
            set iterationStart (a) {
              if ((isNaN(a) || a < 0) && e())
                throw new TypeError('iterationStart must be a non-negative number, received: ' + timing.iterationStart);
              this._setMember('iterationStart', a);
            },
            get iterationStart () {
              return this._iterationStart;
            },
            set duration (a) {
              if ('auto' != a && (isNaN(a) || a < 0) && e())
                throw new TypeError('duration must be non-negative or auto, received: ' + a);
              this._setMember('duration', a);
            },
            get duration () {
              return this._duration;
            },
            set direction (a) {
              this._setMember('direction', a);
            },
            get direction () {
              return this._direction;
            },
            set easing (a) {
              this._easingFunction = l(k(a)), this._setMember('easing', a);
            },
            get easing () {
              return this._easing;
            },
            set iterations (a) {
              if ((isNaN(a) || a < 0) && e())
                throw new TypeError('iterations must be non-negative, received: ' + a);
              this._setMember('iterations', a);
            },
            get iterations () {
              return this._iterations;
            }
          };
          var y = 1, z = 0.5, A = 0, B = {
            ease: i(0.25, 0.1, 0.25, 1),
            'ease-in': i(0.42, 0, 1, 1),
            'ease-out': i(0, 0, 0.58, 1),
            'ease-in-out': i(0.42, 0, 0.58, 1),
            'step-start': j(1, y),
            'step-middle': j(1, z),
            'step-end': j(1, A)
          }, C = null, D = '\\s*(-?\\d+\\.?\\d*|-?\\.\\d+)\\s*', E = new RegExp('cubic-bezier\\(' + D + ',' + D + ',' + D + ',' + D + '\\)'), F = /steps\(\s*(\d+)\s*,\s*(start|middle|end)\s*\)/, G = 0, H = 1, I = 2, J = 3;
          a.cloneTimingInput = c, a.makeTiming = f, a.numericTimingToObject = g, a.normalizeTimingInput = h, a.calculateActiveDuration = m, a.calculateIterationProgress = u, a.calculatePhase = o, a.normalizeEasing = k, a.parseEasingFunction = l;
        }(c), function (a, b) {
          function c (a, b) {
            return a in k ? k[a][b] || b : b;
          }
          function d (a) {
            return 'display' === a || 0 === a.lastIndexOf('animation', 0) || 0 === a.lastIndexOf('transition', 0);
          }
          function e (a, b, e) {
            if (!d(a)) {
              var f = h[a];
              if (f) {
                i.style[a] = b;
                for (var g in f) {
                  var j = f[g], k = i.style[j];
                  e[j] = c(j, k);
                }
              } else
                e[a] = c(a, b);
            }
          }
          function f (a) {
            var b = [];
            for (var c in a)
              if (!(c in [
                'easing',
                'offset',
                'composite'
              ])) {
                var d = a[c];
                Array.isArray(d) || (d = [d]);
                for (var e, f = d.length, g = 0; g < f; g++)
                  e = {}, e.offset = 'offset' in a ? a.offset : 1 == f ? 1 : g / (f - 1), 'easing' in a && (e.easing = a.easing), 'composite' in a && (e.composite = a.composite), e[c] = d[g], b.push(e);
              }
            return b.sort(function (a, b) {
              return a.offset - b.offset;
            }), b;
          }
          function g (b) {
            function c () {
              var a = d.length;
              null == d[a - 1].offset && (d[a - 1].offset = 1), a > 1 && null == d[0].offset && (d[0].offset = 0);
              for (var b = 0, c = d[0].offset, e = 1; e < a; e++) {
                var f = d[e].offset;
                if (null != f) {
                  for (var g = 1; g < e - b; g++)
                    d[b + g].offset = c + (f - c) * g / (e - b);
                  b = e, c = f;
                }
              }
            }
            if (null == b)
              return [];
            window.Symbol && Symbol.iterator && Array.prototype.from && b[Symbol.iterator] && (b = Array.from(b)), Array.isArray(b) || (b = f(b));
            for (var d = b.map(function (b) {
              var c = {};
              for (var d in b) {
                var f = b[d];
                if ('offset' == d) {
                  if (null != f) {
                    if (f = Number(f), !isFinite(f))
                      throw new TypeError('Keyframe offsets must be numbers.');
                    if (f < 0 || f > 1)
                      throw new TypeError('Keyframe offsets must be between 0 and 1.');
                  }
                } else if ('composite' == d) {
                  if ('add' == f || 'accumulate' == f)
                    throw {
                      type: DOMException.NOT_SUPPORTED_ERR,
                      name: 'NotSupportedError',
                      message: 'add compositing is not supported'
                    };
                  if ('replace' != f)
                    throw new TypeError('Invalid composite mode ' + f + '.');
                } else
                  f = 'easing' == d ? a.normalizeEasing(f) : '' + f;
                e(d, f, c);
              }
              return void 0 == c.offset && (c.offset = null), void 0 == c.easing && (c.easing = 'linear'), c;
            }), g = !0, h = -1 / 0, i = 0; i < d.length; i++) {
              var j = d[i].offset;
              if (null != j) {
                if (j < h)
                  throw new TypeError('Keyframes are not loosely sorted by offset. Sort or specify offsets.');
                h = j;
              } else
                g = !1;
            }
            return d = d.filter(function (a) {
              return a.offset >= 0 && a.offset <= 1;
            }), g || c(), d;
          }
          var h = {
            background: [
              'backgroundImage',
              'backgroundPosition',
              'backgroundSize',
              'backgroundRepeat',
              'backgroundAttachment',
              'backgroundOrigin',
              'backgroundClip',
              'backgroundColor'
            ],
            border: [
              'borderTopColor',
              'borderTopStyle',
              'borderTopWidth',
              'borderRightColor',
              'borderRightStyle',
              'borderRightWidth',
              'borderBottomColor',
              'borderBottomStyle',
              'borderBottomWidth',
              'borderLeftColor',
              'borderLeftStyle',
              'borderLeftWidth'
            ],
            borderBottom: [
              'borderBottomWidth',
              'borderBottomStyle',
              'borderBottomColor'
            ],
            borderColor: [
              'borderTopColor',
              'borderRightColor',
              'borderBottomColor',
              'borderLeftColor'
            ],
            borderLeft: [
              'borderLeftWidth',
              'borderLeftStyle',
              'borderLeftColor'
            ],
            borderRadius: [
              'borderTopLeftRadius',
              'borderTopRightRadius',
              'borderBottomRightRadius',
              'borderBottomLeftRadius'
            ],
            borderRight: [
              'borderRightWidth',
              'borderRightStyle',
              'borderRightColor'
            ],
            borderTop: [
              'borderTopWidth',
              'borderTopStyle',
              'borderTopColor'
            ],
            borderWidth: [
              'borderTopWidth',
              'borderRightWidth',
              'borderBottomWidth',
              'borderLeftWidth'
            ],
            flex: [
              'flexGrow',
              'flexShrink',
              'flexBasis'
            ],
            font: [
              'fontFamily',
              'fontSize',
              'fontStyle',
              'fontVariant',
              'fontWeight',
              'lineHeight'
            ],
            margin: [
              'marginTop',
              'marginRight',
              'marginBottom',
              'marginLeft'
            ],
            outline: [
              'outlineColor',
              'outlineStyle',
              'outlineWidth'
            ],
            padding: [
              'paddingTop',
              'paddingRight',
              'paddingBottom',
              'paddingLeft'
            ]
          }, i = document.createElementNS('http://www.w3.org/1999/xhtml', 'div'), j = {
            thin: '1px',
            medium: '3px',
            thick: '5px'
          }, k = {
            borderBottomWidth: j,
            borderLeftWidth: j,
            borderRightWidth: j,
            borderTopWidth: j,
            fontSize: {
              'xx-small': '60%',
              'x-small': '75%',
              small: '89%',
              medium: '100%',
              large: '120%',
              'x-large': '150%',
              'xx-large': '200%'
            },
            fontWeight: {
              normal: '400',
              bold: '700'
            },
            outlineWidth: j,
            textShadow: { none: '0px 0px 0px transparent' },
            boxShadow: { none: '0px 0px 0px 0px transparent' }
          };
          a.convertToArrayForm = f, a.normalizeKeyframes = g;
        }(c), function (a) {
          var b = {};
          a.isDeprecated = function (a, c, d, e) {
            var f = e ? 'are' : 'is', g = new Date(), h = new Date(c);
            return h.setMonth(h.getMonth() + 3), !(g < h && (a in b || console.warn('Web Animations: ' + a + ' ' + f + ' deprecated and will stop working on ' + h.toDateString() + '. ' + d), b[a] = !0, 1));
          }, a.deprecated = function (b, c, d, e) {
            var f = e ? 'are' : 'is';
            if (a.isDeprecated(b, c, d, e))
              throw new Error(b + ' ' + f + ' no longer supported. ' + d);
          };
        }(c), function () {
          if (document.documentElement.animate) {
            var a = document.documentElement.animate([], 0), b = !0;
            if (a && (b = !1, 'play|currentTime|pause|reverse|playbackRate|cancel|finish|startTime|playState'.split('|').forEach(function (c) {
              void 0 === a[c] && (b = !0);
            })), !b)
              return;
          }
          !function (a, b, c) {
            function d (a) {
              for (var b = {}, c = 0; c < a.length; c++)
                for (var d in a[c])
                  if ('offset' != d && 'easing' != d && 'composite' != d) {
                    var e = {
                      offset: a[c].offset,
                      easing: a[c].easing,
                      value: a[c][d]
                    };
                    b[d] = b[d] || [], b[d].push(e);
                  }
              for (var f in b) {
                var g = b[f];
                if (0 != g[0].offset || 1 != g[g.length - 1].offset)
                  throw {
                    type: DOMException.NOT_SUPPORTED_ERR,
                    name: 'NotSupportedError',
                    message: 'Partial keyframes are not supported'
                  };
              }
              return b;
            }
            function e (c) {
              var d = [];
              for (var e in c)
                for (var f = c[e], g = 0; g < f.length - 1; g++) {
                  var h = g, i = g + 1, j = f[h].offset, k = f[i].offset, l = j, m = k;
                  0 == g && (l = -1 / 0, 0 == k && (i = h)), g == f.length - 2 && (m = 1 / 0, 1 == j && (h = i)), d.push({
                    applyFrom: l,
                    applyTo: m,
                    startOffset: f[h].offset,
                    endOffset: f[i].offset,
                    easingFunction: a.parseEasingFunction(f[h].easing),
                    property: e,
                    interpolation: b.propertyInterpolation(e, f[h].value, f[i].value)
                  });
                }
              return d.sort(function (a, b) {
                return a.startOffset - b.startOffset;
              }), d;
            }
            b.convertEffectInput = function (c) {
              var f = a.normalizeKeyframes(c), g = d(f), h = e(g);
              return function (a, c) {
                if (null != c)
                  h.filter(function (a) {
                    return c >= a.applyFrom && c < a.applyTo;
                  }).forEach(function (d) {
                    var e = c - d.startOffset, f = d.endOffset - d.startOffset, g = 0 == f ? 0 : d.easingFunction(e / f);
                    b.apply(a, d.property, d.interpolation(g));
                  });
                else
                  for (var d in g)
                    'offset' != d && 'easing' != d && 'composite' != d && b.clear(a, d);
              };
            };
          }(c, d), function (a, b, c) {
            function d (a) {
              return a.replace(/-(.)/g, function (a, b) {
                return b.toUpperCase();
              });
            }
            function e (a, b, c) {
              h[c] = h[c] || [], h[c].push([
                a,
                b
              ]);
            }
            function f (a, b, c) {
              for (var f = 0; f < c.length; f++) {
                e(a, b, d(c[f]));
              }
            }
            function g (c, e, f) {
              var g = c;
              /-/.test(c) && !a.isDeprecated('Hyphenated property names', '2016-03-22', 'Use camelCase instead.', !0) && (g = d(c)), 'initial' != e && 'initial' != f || ('initial' == e && (e = i[g]), 'initial' == f && (f = i[g]));
              for (var j = e == f ? [] : h[g], k = 0; j && k < j.length; k++) {
                var l = j[k][0](e), m = j[k][0](f);
                if (void 0 !== l && void 0 !== m) {
                  var n = j[k][1](l, m);
                  if (n) {
                    var o = b.Interpolation.apply(null, n);
                    return function (a) {
                      return 0 == a ? e : 1 == a ? f : o(a);
                    };
                  }
                }
              }
              return b.Interpolation(!1, !0, function (a) {
                return a ? f : e;
              });
            }
            var h = {};
            b.addPropertiesHandler = f;
            var i = {
              backgroundColor: 'transparent',
              backgroundPosition: '0% 0%',
              borderBottomColor: 'currentColor',
              borderBottomLeftRadius: '0px',
              borderBottomRightRadius: '0px',
              borderBottomWidth: '3px',
              borderLeftColor: 'currentColor',
              borderLeftWidth: '3px',
              borderRightColor: 'currentColor',
              borderRightWidth: '3px',
              borderSpacing: '2px',
              borderTopColor: 'currentColor',
              borderTopLeftRadius: '0px',
              borderTopRightRadius: '0px',
              borderTopWidth: '3px',
              bottom: 'auto',
              clip: 'rect(0px, 0px, 0px, 0px)',
              color: 'black',
              fontSize: '100%',
              fontWeight: '400',
              height: 'auto',
              left: 'auto',
              letterSpacing: 'normal',
              lineHeight: '120%',
              marginBottom: '0px',
              marginLeft: '0px',
              marginRight: '0px',
              marginTop: '0px',
              maxHeight: 'none',
              maxWidth: 'none',
              minHeight: '0px',
              minWidth: '0px',
              opacity: '1.0',
              outlineColor: 'invert',
              outlineOffset: '0px',
              outlineWidth: '3px',
              paddingBottom: '0px',
              paddingLeft: '0px',
              paddingRight: '0px',
              paddingTop: '0px',
              right: 'auto',
              strokeDasharray: 'none',
              strokeDashoffset: '0px',
              textIndent: '0px',
              textShadow: '0px 0px 0px transparent',
              top: 'auto',
              transform: '',
              verticalAlign: '0px',
              visibility: 'visible',
              width: 'auto',
              wordSpacing: 'normal',
              zIndex: 'auto'
            };
            b.propertyInterpolation = g;
          }(c, d), function (a, b, c) {
            function d (b) {
              var c = a.calculateActiveDuration(b), d = function (d) {
                return a.calculateIterationProgress(c, d, b);
              };
              return d._totalDuration = b.delay + c + b.endDelay, d;
            }
            b.KeyframeEffect = function (c, e, f, g) {
              var h, i = d(a.normalizeTimingInput(f)), j = b.convertEffectInput(e), k = function () {
                j(c, h);
              };
              return k._update = function (a) {
                return null !== (h = i(a));
              }, k._clear = function () {
                j(c, null);
              }, k._hasSameTarget = function (a) {
                return c === a;
              }, k._target = c, k._totalDuration = i._totalDuration, k._id = g, k;
            };
          }(c, d), function (a, b) {
            function c (a, b) {
              return !(!b.namespaceURI || -1 == b.namespaceURI.indexOf('/svg')) && (g in a || (a[g] = /Trident|MSIE|IEMobile|Edge|Android 4/i.test(a.navigator.userAgent)), a[g]);
            }
            function d (a, b, c) {
              c.enumerable = !0, c.configurable = !0, Object.defineProperty(a, b, c);
            }
            function e (a) {
              this._element = a, this._surrogateStyle = document.createElementNS('http://www.w3.org/1999/xhtml', 'div').style, this._style = a.style, this._length = 0, this._isAnimatedProperty = {}, this._updateSvgTransformAttr = c(window, a), this._savedTransformAttr = null;
              for (var b = 0; b < this._style.length; b++) {
                var d = this._style[b];
                this._surrogateStyle[d] = this._style[d];
              }
              this._updateIndices();
            }
            function f (a) {
              if (!a._webAnimationsPatchedStyle) {
                var b = new e(a);
                try {
                  d(a, 'style', {
                    get: function () {
                      return b;
                    }
                  });
                } catch (b) {
                  a.style._set = function (b, c) {
                    a.style[b] = c;
                  }, a.style._clear = function (b) {
                    a.style[b] = '';
                  };
                }
                a._webAnimationsPatchedStyle = a.style;
              }
            }
            var g = '_webAnimationsUpdateSvgTransformAttr', h = {
              cssText: 1,
              length: 1,
              parentRule: 1
            }, i = {
              getPropertyCSSValue: 1,
              getPropertyPriority: 1,
              getPropertyValue: 1,
              item: 1,
              removeProperty: 1,
              setProperty: 1
            }, j = {
              removeProperty: 1,
              setProperty: 1
            };
            e.prototype = {
              get cssText () {
                return this._surrogateStyle.cssText;
              },
              set cssText (a) {
                for (var b = {}, c = 0; c < this._surrogateStyle.length; c++)
                  b[this._surrogateStyle[c]] = !0;
                this._surrogateStyle.cssText = a, this._updateIndices();
                for (var c = 0; c < this._surrogateStyle.length; c++)
                  b[this._surrogateStyle[c]] = !0;
                for (var d in b)
                  this._isAnimatedProperty[d] || this._style.setProperty(d, this._surrogateStyle.getPropertyValue(d));
              },
              get length () {
                return this._surrogateStyle.length;
              },
              get parentRule () {
                return this._style.parentRule;
              },
              _updateIndices: function () {
                for (; this._length < this._surrogateStyle.length;)
                  Object.defineProperty(this, this._length, {
                    configurable: !0,
                    enumerable: !1,
                    get: function (a) {
                      return function () {
                        return this._surrogateStyle[a];
                      };
                    }(this._length)
                  }), this._length++;
                for (; this._length > this._surrogateStyle.length;)
                  this._length-- , Object.defineProperty(this, this._length, {
                    configurable: !0,
                    enumerable: !1,
                    value: void 0
                  });
              },
              _set: function (b, c) {
                this._style[b] = c, this._isAnimatedProperty[b] = !0, this._updateSvgTransformAttr && 'transform' == a.unprefixedPropertyName(b) && (null == this._savedTransformAttr && (this._savedTransformAttr = this._element.getAttribute('transform')), this._element.setAttribute('transform', a.transformToSvgMatrix(c)));
              },
              _clear: function (b) {
                this._style[b] = this._surrogateStyle[b], this._updateSvgTransformAttr && 'transform' == a.unprefixedPropertyName(b) && (this._savedTransformAttr ? this._element.setAttribute('transform', this._savedTransformAttr) : this._element.removeAttribute('transform'), this._savedTransformAttr = null), delete this._isAnimatedProperty[b];
              }
            };
            for (var k in i)
              e.prototype[k] = function (a, b) {
                return function () {
                  var c = this._surrogateStyle[a].apply(this._surrogateStyle, arguments);
                  return b && (this._isAnimatedProperty[arguments[0]] || this._style[a].apply(this._style, arguments), this._updateIndices()), c;
                };
              }(k, k in j);
            for (var l in document.documentElement.style)
              l in h || l in i || function (a) {
                d(e.prototype, a, {
                  get: function () {
                    return this._surrogateStyle[a];
                  },
                  set: function (b) {
                    this._surrogateStyle[a] = b, this._updateIndices(), this._isAnimatedProperty[a] || (this._style[a] = b);
                  }
                });
              }(l);
            a.apply = function (b, c, d) {
              f(b), b.style._set(a.propertyName(c), d);
            }, a.clear = function (b, c) {
              b._webAnimationsPatchedStyle && b.style._clear(a.propertyName(c));
            };
          }(d), function (a) {
            window.Element.prototype.animate = function (b, c) {
              var d = '';
              return c && c.id && (d = c.id), a.timeline._play(a.KeyframeEffect(this, b, c, d));
            };
          }(d), function (a, b) {
            function c (a, b, d) {
              if ('number' == typeof a && 'number' == typeof b)
                return a * (1 - d) + b * d;
              if ('boolean' == typeof a && 'boolean' == typeof b)
                return d < 0.5 ? a : b;
              if (a.length == b.length) {
                for (var e = [], f = 0; f < a.length; f++)
                  e.push(c(a[f], b[f], d));
                return e;
              }
              throw 'Mismatched interpolation arguments ' + a + ':' + b;
            }
            a.Interpolation = function (a, b, d) {
              return function (e) {
                return d(c(a, b, e));
              };
            };
          }(d), function (a, b) {
            function c (a, b, c) {
              return Math.max(Math.min(a, c), b);
            }
            function d (b, d, e) {
              var f = a.dot(b, d);
              f = c(f, -1, 1);
              var g = [];
              if (1 === f)
                g = b;
              else
                for (var h = Math.acos(f), i = 1 * Math.sin(e * h) / Math.sqrt(1 - f * f), j = 0; j < 4; j++)
                  g.push(b[j] * (Math.cos(e * h) - f * i) + d[j] * i);
              return g;
            }
            var e = function () {
              function a (a, b) {
                for (var c = [
                  [
                    0,
                    0,
                    0,
                    0
                  ],
                  [
                    0,
                    0,
                    0,
                    0
                  ],
                  [
                    0,
                    0,
                    0,
                    0
                  ],
                  [
                    0,
                    0,
                    0,
                    0
                  ]
                ], d = 0; d < 4; d++)
                  for (var e = 0; e < 4; e++)
                    for (var f = 0; f < 4; f++)
                      c[d][e] += b[d][f] * a[f][e];
                return c;
              }
              function b (a) {
                return 0 == a[0][2] && 0 == a[0][3] && 0 == a[1][2] && 0 == a[1][3] && 0 == a[2][0] && 0 == a[2][1] && 1 == a[2][2] && 0 == a[2][3] && 0 == a[3][2] && 1 == a[3][3];
              }
              function c (c, d, e, f, g) {
                for (var h = [
                  [
                    1,
                    0,
                    0,
                    0
                  ],
                  [
                    0,
                    1,
                    0,
                    0
                  ],
                  [
                    0,
                    0,
                    1,
                    0
                  ],
                  [
                    0,
                    0,
                    0,
                    1
                  ]
                ], i = 0; i < 4; i++)
                  h[i][3] = g[i];
                for (var i = 0; i < 3; i++)
                  for (var j = 0; j < 3; j++)
                    h[3][i] += c[j] * h[j][i];
                var k = f[0], l = f[1], m = f[2], n = f[3], o = [
                  [
                    1,
                    0,
                    0,
                    0
                  ],
                  [
                    0,
                    1,
                    0,
                    0
                  ],
                  [
                    0,
                    0,
                    1,
                    0
                  ],
                  [
                    0,
                    0,
                    0,
                    1
                  ]
                ];
                o[0][0] = 1 - 2 * (l * l + m * m), o[0][1] = 2 * (k * l - m * n), o[0][2] = 2 * (k * m + l * n), o[1][0] = 2 * (k * l + m * n), o[1][1] = 1 - 2 * (k * k + m * m), o[1][2] = 2 * (l * m - k * n), o[2][0] = 2 * (k * m - l * n), o[2][1] = 2 * (l * m + k * n), o[2][2] = 1 - 2 * (k * k + l * l), h = a(h, o);
                var p = [
                  [
                    1,
                    0,
                    0,
                    0
                  ],
                  [
                    0,
                    1,
                    0,
                    0
                  ],
                  [
                    0,
                    0,
                    1,
                    0
                  ],
                  [
                    0,
                    0,
                    0,
                    1
                  ]
                ];
                e[2] && (p[2][1] = e[2], h = a(h, p)), e[1] && (p[2][1] = 0, p[2][0] = e[0], h = a(h, p)), e[0] && (p[2][0] = 0, p[1][0] = e[0], h = a(h, p));
                for (var i = 0; i < 3; i++)
                  for (var j = 0; j < 3; j++)
                    h[i][j] *= d[i];
                return b(h) ? [
                  h[0][0],
                  h[0][1],
                  h[1][0],
                  h[1][1],
                  h[3][0],
                  h[3][1]
                ] : h[0].concat(h[1], h[2], h[3]);
              }
              return c;
            }();
            a.composeMatrix = e, a.quat = d;
          }(d), function (a, b, c) {
            a.sequenceNumber = 0;
            var d = function (a, b, c) {
              this.target = a, this.currentTime = b, this.timelineTime = c, this.type = 'finish', this.bubbles = !1, this.cancelable = !1, this.currentTarget = a, this.defaultPrevented = !1, this.eventPhase = Event.AT_TARGET, this.timeStamp = Date.now();
            };
            b.Animation = function (b) {
              this.id = '', b && b._id && (this.id = b._id), this._sequenceNumber = a.sequenceNumber++ , this._currentTime = 0, this._startTime = null, this._paused = !1, this._playbackRate = 1, this._inTimeline = !0, this._finishedFlag = !0, this.onfinish = null, this._finishHandlers = [], this._effect = b, this._inEffect = this._effect._update(0), this._idle = !0, this._currentTimePending = !1;
            }, b.Animation.prototype = {
              _ensureAlive: function () {
                this.playbackRate < 0 && 0 === this.currentTime ? this._inEffect = this._effect._update(-1) : this._inEffect = this._effect._update(this.currentTime), this._inTimeline || !this._inEffect && this._finishedFlag || (this._inTimeline = !0, b.timeline._animations.push(this));
              },
              _tickCurrentTime: function (a, b) {
                a != this._currentTime && (this._currentTime = a, this._isFinished && !b && (this._currentTime = this._playbackRate > 0 ? this._totalDuration : 0), this._ensureAlive());
              },
              get currentTime () {
                return this._idle || this._currentTimePending ? null : this._currentTime;
              },
              set currentTime (a) {
                a = +a, isNaN(a) || (b.restart(), this._paused || null == this._startTime || (this._startTime = this._timeline.currentTime - a / this._playbackRate), this._currentTimePending = !1, this._currentTime != a && (this._idle && (this._idle = !1, this._paused = !0), this._tickCurrentTime(a, !0), b.applyDirtiedAnimation(this)));
              },
              get startTime () {
                return this._startTime;
              },
              set startTime (a) {
                a = +a, isNaN(a) || this._paused || this._idle || (this._startTime = a, this._tickCurrentTime((this._timeline.currentTime - this._startTime) * this.playbackRate), b.applyDirtiedAnimation(this));
              },
              get playbackRate () {
                return this._playbackRate;
              },
              set playbackRate (a) {
                if (a != this._playbackRate) {
                  var c = this.currentTime;
                  this._playbackRate = a, this._startTime = null, 'paused' != this.playState && 'idle' != this.playState && (this._finishedFlag = !1, this._idle = !1, this._ensureAlive(), b.applyDirtiedAnimation(this)), null != c && (this.currentTime = c);
                }
              },
              get _isFinished () {
                return !this._idle && (this._playbackRate > 0 && this._currentTime >= this._totalDuration || this._playbackRate < 0 && this._currentTime <= 0);
              },
              get _totalDuration () {
                return this._effect._totalDuration;
              },
              get playState () {
                return this._idle ? 'idle' : null == this._startTime && !this._paused && 0 != this.playbackRate || this._currentTimePending ? 'pending' : this._paused ? 'paused' : this._isFinished ? 'finished' : 'running';
              },
              _rewind: function () {
                if (this._playbackRate >= 0)
                  this._currentTime = 0;
                else {
                  if (!(this._totalDuration < 1 / 0))
                    throw new DOMException('Unable to rewind negative playback rate animation with infinite duration', 'InvalidStateError');
                  this._currentTime = this._totalDuration;
                }
              },
              play: function () {
                this._paused = !1, (this._isFinished || this._idle) && (this._rewind(), this._startTime = null), this._finishedFlag = !1, this._idle = !1, this._ensureAlive(), b.applyDirtiedAnimation(this);
              },
              pause: function () {
                this._isFinished || this._paused || this._idle ? this._idle && (this._rewind(), this._idle = !1) : this._currentTimePending = !0, this._startTime = null, this._paused = !0;
              },
              finish: function () {
                this._idle || (this.currentTime = this._playbackRate > 0 ? this._totalDuration : 0, this._startTime = this._totalDuration - this.currentTime, this._currentTimePending = !1, b.applyDirtiedAnimation(this));
              },
              cancel: function () {
                this._inEffect && (this._inEffect = !1, this._idle = !0, this._paused = !1, this._isFinished = !0, this._finishedFlag = !0, this._currentTime = 0, this._startTime = null, this._effect._update(null), b.applyDirtiedAnimation(this));
              },
              reverse: function () {
                this.playbackRate *= -1, this.play();
              },
              addEventListener: function (a, b) {
                'function' == typeof b && 'finish' == a && this._finishHandlers.push(b);
              },
              removeEventListener: function (a, b) {
                if ('finish' == a) {
                  var c = this._finishHandlers.indexOf(b);
                  c >= 0 && this._finishHandlers.splice(c, 1);
                }
              },
              _fireEvents: function (a) {
                if (this._isFinished) {
                  if (!this._finishedFlag) {
                    var b = new d(this, this._currentTime, a), c = this._finishHandlers.concat(this.onfinish ? [this.onfinish] : []);
                    setTimeout(function () {
                      c.forEach(function (a) {
                        a.call(b.target, b);
                      });
                    }, 0), this._finishedFlag = !0;
                  }
                } else
                  this._finishedFlag = !1;
              },
              _tick: function (a, b) {
                this._idle || this._paused || (null == this._startTime ? b && (this.startTime = a - this._currentTime / this.playbackRate) : this._isFinished || this._tickCurrentTime((a - this._startTime) * this.playbackRate)), b && (this._currentTimePending = !1, this._fireEvents(a));
              },
              get _needsTick () {
                return this.playState in {
                  pending: 1,
                  running: 1
                } || !this._finishedFlag;
              },
              _targetAnimations: function () {
                var a = this._effect._target;
                return a._activeAnimations || (a._activeAnimations = []), a._activeAnimations;
              },
              _markTarget: function () {
                var a = this._targetAnimations();
                -1 === a.indexOf(this) && a.push(this);
              },
              _unmarkTarget: function () {
                var a = this._targetAnimations(), b = a.indexOf(this);
                -1 !== b && a.splice(b, 1);
              }
            };
          }(c, d), function (a, b, c) {
            function d (a) {
              var b = j;
              j = [], a < q.currentTime && (a = q.currentTime), q._animations.sort(e), q._animations = h(a, !0, q._animations)[0], b.forEach(function (b) {
                b[1](a);
              }), g(), l = void 0;
            }
            function e (a, b) {
              return a._sequenceNumber - b._sequenceNumber;
            }
            function f () {
              this._animations = [], this.currentTime = window.performance && performance.now ? performance.now() : 0;
            }
            function g () {
              o.forEach(function (a) {
                a();
              }), o.length = 0;
            }
            function h (a, c, d) {
              p = !0, n = !1, b.timeline.currentTime = a, m = !1;
              var e = [], f = [], g = [], h = [];
              return d.forEach(function (b) {
                b._tick(a, c), b._inEffect ? (f.push(b._effect), b._markTarget()) : (e.push(b._effect), b._unmarkTarget()), b._needsTick && (m = !0);
                var d = b._inEffect || b._needsTick;
                b._inTimeline = d, d ? g.push(b) : h.push(b);
              }), o.push.apply(o, e), o.push.apply(o, f), m && requestAnimationFrame(function () {
              }), p = !1, [
                  g,
                  h
                ];
            }
            var i = window.requestAnimationFrame, j = [], k = 0;
            window.requestAnimationFrame = function (a) {
              var b = k++;
              return 0 == j.length && i(d), j.push([
                b,
                a
              ]), b;
            }, window.cancelAnimationFrame = function (a) {
              j.forEach(function (b) {
                b[0] == a && (b[1] = function () {
                });
              });
            }, f.prototype = {
              _play: function (c) {
                c._timing = a.normalizeTimingInput(c.timing);
                var d = new b.Animation(c);
                return d._idle = !1, d._timeline = this, this._animations.push(d), b.restart(), b.applyDirtiedAnimation(d), d;
              }
            };
            var l = void 0, m = !1, n = !1;
            b.restart = function () {
              return m || (m = !0, requestAnimationFrame(function () {
              }), n = !0), n;
            }, b.applyDirtiedAnimation = function (a) {
              if (!p) {
                a._markTarget();
                var c = a._targetAnimations();
                c.sort(e), h(b.timeline.currentTime, !1, c.slice())[1].forEach(function (a) {
                  var b = q._animations.indexOf(a);
                  -1 !== b && q._animations.splice(b, 1);
                }), g();
              }
            };
            var o = [], p = !1, q = new f();
            b.timeline = q;
          }(c, d), function (a, b) {
            function c (a, b) {
              for (var c = 0, d = 0; d < a.length; d++)
                c += a[d] * b[d];
              return c;
            }
            function d (a, b) {
              return [
                a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3],
                a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3],
                a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3],
                a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3],
                a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7],
                a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7],
                a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7],
                a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7],
                a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11],
                a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11],
                a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11],
                a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11],
                a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15],
                a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15],
                a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15],
                a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]
              ];
            }
            function e (a) {
              var b = a.rad || 0;
              return ((a.deg || 0) / 360 + (a.grad || 0) / 400 + (a.turn || 0)) * (2 * Math.PI) + b;
            }
            function f (a) {
              switch (a.t) {
                case 'rotatex':
                  var b = e(a.d[0]);
                  return [
                    1,
                    0,
                    0,
                    0,
                    0,
                    Math.cos(b),
                    Math.sin(b),
                    0,
                    0,
                    -Math.sin(b),
                    Math.cos(b),
                    0,
                    0,
                    0,
                    0,
                    1
                  ];
                case 'rotatey':
                  var b = e(a.d[0]);
                  return [
                    Math.cos(b),
                    0,
                    -Math.sin(b),
                    0,
                    0,
                    1,
                    0,
                    0,
                    Math.sin(b),
                    0,
                    Math.cos(b),
                    0,
                    0,
                    0,
                    0,
                    1
                  ];
                case 'rotate':
                case 'rotatez':
                  var b = e(a.d[0]);
                  return [
                    Math.cos(b),
                    Math.sin(b),
                    0,
                    0,
                    -Math.sin(b),
                    Math.cos(b),
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                  ];
                case 'rotate3d':
                  var c = a.d[0], d = a.d[1], f = a.d[2], b = e(a.d[3]), g = c * c + d * d + f * f;
                  if (0 === g)
                    c = 1, d = 0, f = 0;
                  else if (1 !== g) {
                    var h = Math.sqrt(g);
                    c /= h, d /= h, f /= h;
                  }
                  var i = Math.sin(b / 2), j = i * Math.cos(b / 2), k = i * i;
                  return [
                    1 - 2 * (d * d + f * f) * k,
                    2 * (c * d * k + f * j),
                    2 * (c * f * k - d * j),
                    0,
                    2 * (c * d * k - f * j),
                    1 - 2 * (c * c + f * f) * k,
                    2 * (d * f * k + c * j),
                    0,
                    2 * (c * f * k + d * j),
                    2 * (d * f * k - c * j),
                    1 - 2 * (c * c + d * d) * k,
                    0,
                    0,
                    0,
                    0,
                    1
                  ];
                case 'scale':
                  return [
                    a.d[0],
                    0,
                    0,
                    0,
                    0,
                    a.d[1],
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                  ];
                case 'scalex':
                  return [
                    a.d[0],
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                  ];
                case 'scaley':
                  return [
                    1,
                    0,
                    0,
                    0,
                    0,
                    a.d[0],
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                  ];
                case 'scalez':
                  return [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    a.d[0],
                    0,
                    0,
                    0,
                    0,
                    1
                  ];
                case 'scale3d':
                  return [
                    a.d[0],
                    0,
                    0,
                    0,
                    0,
                    a.d[1],
                    0,
                    0,
                    0,
                    0,
                    a.d[2],
                    0,
                    0,
                    0,
                    0,
                    1
                  ];
                case 'skew':
                  var l = e(a.d[0]), m = e(a.d[1]);
                  return [
                    1,
                    Math.tan(m),
                    0,
                    0,
                    Math.tan(l),
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                  ];
                case 'skewx':
                  var b = e(a.d[0]);
                  return [
                    1,
                    0,
                    0,
                    0,
                    Math.tan(b),
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                  ];
                case 'skewy':
                  var b = e(a.d[0]);
                  return [
                    1,
                    Math.tan(b),
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1
                  ];
                case 'translate':
                  var c = a.d[0].px || 0, d = a.d[1].px || 0;
                  return [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    c,
                    d,
                    0,
                    1
                  ];
                case 'translatex':
                  var c = a.d[0].px || 0;
                  return [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    c,
                    0,
                    0,
                    1
                  ];
                case 'translatey':
                  var d = a.d[0].px || 0;
                  return [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    d,
                    0,
                    1
                  ];
                case 'translatez':
                  var f = a.d[0].px || 0;
                  return [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    f,
                    1
                  ];
                case 'translate3d':
                  var c = a.d[0].px || 0, d = a.d[1].px || 0, f = a.d[2].px || 0;
                  return [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    c,
                    d,
                    f,
                    1
                  ];
                case 'perspective':
                  return [
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    0,
                    1,
                    a.d[0].px ? -1 / a.d[0].px : 0,
                    0,
                    0,
                    0,
                    1
                  ];
                case 'matrix':
                  return [
                    a.d[0],
                    a.d[1],
                    0,
                    0,
                    a.d[2],
                    a.d[3],
                    0,
                    0,
                    0,
                    0,
                    1,
                    0,
                    a.d[4],
                    a.d[5],
                    0,
                    1
                  ];
                case 'matrix3d':
                  return a.d;
              }
            }
            function g (a) {
              return 0 === a.length ? [
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1
              ] : a.map(f).reduce(d);
            }
            function h (a) {
              return [i(g(a))];
            }
            var i = function () {
              function a (a) {
                return a[0][0] * a[1][1] * a[2][2] + a[1][0] * a[2][1] * a[0][2] + a[2][0] * a[0][1] * a[1][2] - a[0][2] * a[1][1] * a[2][0] - a[1][2] * a[2][1] * a[0][0] - a[2][2] * a[0][1] * a[1][0];
              }
              function b (b) {
                for (var c = 1 / a(b), d = b[0][0], e = b[0][1], f = b[0][2], g = b[1][0], h = b[1][1], i = b[1][2], j = b[2][0], k = b[2][1], l = b[2][2], m = [
                  [
                    (h * l - i * k) * c,
                    (f * k - e * l) * c,
                    (e * i - f * h) * c,
                    0
                  ],
                  [
                    (i * j - g * l) * c,
                    (d * l - f * j) * c,
                    (f * g - d * i) * c,
                    0
                  ],
                  [
                    (g * k - h * j) * c,
                    (j * e - d * k) * c,
                    (d * h - e * g) * c,
                    0
                  ]
                ], n = [], o = 0; o < 3; o++) {
                  for (var p = 0, q = 0; q < 3; q++)
                    p += b[3][q] * m[q][o];
                  n.push(p);
                }
                return n.push(1), m.push(n), m;
              }
              function d (a) {
                return [
                  [
                    a[0][0],
                    a[1][0],
                    a[2][0],
                    a[3][0]
                  ],
                  [
                    a[0][1],
                    a[1][1],
                    a[2][1],
                    a[3][1]
                  ],
                  [
                    a[0][2],
                    a[1][2],
                    a[2][2],
                    a[3][2]
                  ],
                  [
                    a[0][3],
                    a[1][3],
                    a[2][3],
                    a[3][3]
                  ]
                ];
              }
              function e (a, b) {
                for (var c = [], d = 0; d < 4; d++) {
                  for (var e = 0, f = 0; f < 4; f++)
                    e += a[f] * b[f][d];
                  c.push(e);
                }
                return c;
              }
              function f (a) {
                var b = g(a);
                return [
                  a[0] / b,
                  a[1] / b,
                  a[2] / b
                ];
              }
              function g (a) {
                return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
              }
              function h (a, b, c, d) {
                return [
                  c * a[0] + d * b[0],
                  c * a[1] + d * b[1],
                  c * a[2] + d * b[2]
                ];
              }
              function i (a, b) {
                return [
                  a[1] * b[2] - a[2] * b[1],
                  a[2] * b[0] - a[0] * b[2],
                  a[0] * b[1] - a[1] * b[0]
                ];
              }
              function j (j) {
                var k = [
                  j.slice(0, 4),
                  j.slice(4, 8),
                  j.slice(8, 12),
                  j.slice(12, 16)
                ];
                if (1 !== k[3][3])
                  return null;
                for (var l = [], m = 0; m < 4; m++)
                  l.push(k[m].slice());
                for (var m = 0; m < 3; m++)
                  l[m][3] = 0;
                if (0 === a(l))
                  return null;
                var n, o = [];
                k[0][3] || k[1][3] || k[2][3] ? (o.push(k[0][3]), o.push(k[1][3]), o.push(k[2][3]), o.push(k[3][3]), n = e(o, d(b(l)))) : n = [
                  0,
                  0,
                  0,
                  1
                ];
                var p = k[3].slice(0, 3), q = [];
                q.push(k[0].slice(0, 3));
                var r = [];
                r.push(g(q[0])), q[0] = f(q[0]);
                var s = [];
                q.push(k[1].slice(0, 3)), s.push(c(q[0], q[1])), q[1] = h(q[1], q[0], 1, -s[0]), r.push(g(q[1])), q[1] = f(q[1]), s[0] /= r[1], q.push(k[2].slice(0, 3)), s.push(c(q[0], q[2])), q[2] = h(q[2], q[0], 1, -s[1]), s.push(c(q[1], q[2])), q[2] = h(q[2], q[1], 1, -s[2]), r.push(g(q[2])), q[2] = f(q[2]), s[1] /= r[2], s[2] /= r[2];
                var t = i(q[1], q[2]);
                if (c(q[0], t) < 0)
                  for (var m = 0; m < 3; m++)
                    r[m] *= -1, q[m][0] *= -1, q[m][1] *= -1, q[m][2] *= -1;
                var u, v, w = q[0][0] + q[1][1] + q[2][2] + 1;
                return w > 0.0001 ? (u = 0.5 / Math.sqrt(w), v = [
                  (q[2][1] - q[1][2]) * u,
                  (q[0][2] - q[2][0]) * u,
                  (q[1][0] - q[0][1]) * u,
                  0.25 / u
                ]) : q[0][0] > q[1][1] && q[0][0] > q[2][2] ? (u = 2 * Math.sqrt(1 + q[0][0] - q[1][1] - q[2][2]), v = [
                  0.25 * u,
                  (q[0][1] + q[1][0]) / u,
                  (q[0][2] + q[2][0]) / u,
                  (q[2][1] - q[1][2]) / u
                ]) : q[1][1] > q[2][2] ? (u = 2 * Math.sqrt(1 + q[1][1] - q[0][0] - q[2][2]), v = [
                  (q[0][1] + q[1][0]) / u,
                  0.25 * u,
                  (q[1][2] + q[2][1]) / u,
                  (q[0][2] - q[2][0]) / u
                ]) : (u = 2 * Math.sqrt(1 + q[2][2] - q[0][0] - q[1][1]), v = [
                  (q[0][2] + q[2][0]) / u,
                  (q[1][2] + q[2][1]) / u,
                  0.25 * u,
                  (q[1][0] - q[0][1]) / u
                ]), [
                    p,
                    r,
                    s,
                    v,
                    n
                  ];
              }
              return j;
            }();
            a.dot = c, a.makeMatrixDecomposition = h, a.transformListToMatrix = g;
          }(d), function (a) {
            function b (a, b) {
              var c = a.exec(b);
              if (c)
                return c = a.ignoreCase ? c[0].toLowerCase() : c[0], [
                  c,
                  b.substr(c.length)
                ];
            }
            function c (a, b) {
              b = b.replace(/^\s*/, '');
              var c = a(b);
              if (c)
                return [
                  c[0],
                  c[1].replace(/^\s*/, '')
                ];
            }
            function d (a, d, e) {
              a = c.bind(null, a);
              for (var f = []; ;) {
                var g = a(e);
                if (!g)
                  return [
                    f,
                    e
                  ];
                if (f.push(g[0]), e = g[1], !(g = b(d, e)) || '' == g[1])
                  return [
                    f,
                    e
                  ];
                e = g[1];
              }
            }
            function e (a, b) {
              for (var c = 0, d = 0; d < b.length && (!/\s|,/.test(b[d]) || 0 != c); d++)
                if ('(' == b[d])
                  c++;
                else if (')' == b[d] && (c-- , 0 == c && d++ , c <= 0))
                  break;
              var e = a(b.substr(0, d));
              return void 0 == e ? void 0 : [
                e,
                b.substr(d)
              ];
            }
            function f (a, b) {
              for (var c = a, d = b; c && d;)
                c > d ? c %= d : d %= c;
              return c = a * b / (c + d);
            }
            function g (a) {
              return function (b) {
                var c = a(b);
                return c && (c[0] = void 0), c;
              };
            }
            function h (a, b) {
              return function (c) {
                return a(c) || [
                  b,
                  c
                ];
              };
            }
            function i (b, c) {
              for (var d = [], e = 0; e < b.length; e++) {
                var f = a.consumeTrimmed(b[e], c);
                if (!f || '' == f[0])
                  return;
                void 0 !== f[0] && d.push(f[0]), c = f[1];
              }
              if ('' == c)
                return d;
            }
            function j (a, b, c, d, e) {
              for (var g = [], h = [], i = [], j = f(d.length, e.length), k = 0; k < j; k++) {
                var l = b(d[k % d.length], e[k % e.length]);
                if (!l)
                  return;
                g.push(l[0]), h.push(l[1]), i.push(l[2]);
              }
              return [
                g,
                h,
                function (b) {
                  var d = b.map(function (a, b) {
                    return i[b](a);
                  }).join(c);
                  return a ? a(d) : d;
                }
              ];
            }
            function k (a, b, c) {
              for (var d = [], e = [], f = [], g = 0, h = 0; h < c.length; h++)
                if ('function' == typeof c[h]) {
                  var i = c[h](a[g], b[g++]);
                  d.push(i[0]), e.push(i[1]), f.push(i[2]);
                } else
                  !function (a) {
                    d.push(!1), e.push(!1), f.push(function () {
                      return c[a];
                    });
                  }(h);
              return [
                d,
                e,
                function (a) {
                  for (var b = '', c = 0; c < a.length; c++)
                    b += f[c](a[c]);
                  return b;
                }
              ];
            }
            a.consumeToken = b, a.consumeTrimmed = c, a.consumeRepeated = d, a.consumeParenthesised = e, a.ignore = g, a.optional = h, a.consumeList = i, a.mergeNestedRepeated = j.bind(null, null), a.mergeWrappedNestedRepeated = j, a.mergeList = k;
          }(d), function (a) {
            function b (b) {
              function c (b) {
                var c = a.consumeToken(/^inset/i, b);
                if (c)
                  return d.inset = !0, c;
                var c = a.consumeLengthOrPercent(b);
                if (c)
                  return d.lengths.push(c[0]), c;
                var c = a.consumeColor(b);
                return c ? (d.color = c[0], c) : void 0;
              }
              var d = {
                inset: !1,
                lengths: [],
                color: null
              }, e = a.consumeRepeated(c, /^/, b);
              if (e && e[0].length)
                return [
                  d,
                  e[1]
                ];
            }
            function c (c) {
              var d = a.consumeRepeated(b, /^,/, c);
              if (d && '' == d[1])
                return d[0];
            }
            function d (b, c) {
              for (; b.lengths.length < Math.max(b.lengths.length, c.lengths.length);)
                b.lengths.push({ px: 0 });
              for (; c.lengths.length < Math.max(b.lengths.length, c.lengths.length);)
                c.lengths.push({ px: 0 });
              if (b.inset == c.inset && !!b.color == !!c.color) {
                for (var d, e = [], f = [
                  [],
                  0
                ], g = [
                  [],
                  0
                ], h = 0; h < b.lengths.length; h++) {
                  var i = a.mergeDimensions(b.lengths[h], c.lengths[h], 2 == h);
                  f[0].push(i[0]), g[0].push(i[1]), e.push(i[2]);
                }
                if (b.color && c.color) {
                  var j = a.mergeColors(b.color, c.color);
                  f[1] = j[0], g[1] = j[1], d = j[2];
                }
                return [
                  f,
                  g,
                  function (a) {
                    for (var c = b.inset ? 'inset ' : ' ', f = 0; f < e.length; f++)
                      c += e[f](a[0][f]) + ' ';
                    return d && (c += d(a[1])), c;
                  }
                ];
              }
            }
            function e (b, c, d, e) {
              function f (a) {
                return {
                  inset: a,
                  color: [
                    0,
                    0,
                    0,
                    0
                  ],
                  lengths: [
                    { px: 0 },
                    { px: 0 },
                    { px: 0 },
                    { px: 0 }
                  ]
                };
              }
              for (var g = [], h = [], i = 0; i < d.length || i < e.length; i++) {
                var j = d[i] || f(e[i].inset), k = e[i] || f(d[i].inset);
                g.push(j), h.push(k);
              }
              return a.mergeNestedRepeated(b, c, g, h);
            }
            var f = e.bind(null, d, ', ');
            a.addPropertiesHandler(c, f, [
              'box-shadow',
              'text-shadow'
            ]);
          }(d), function (a, b) {
            function c (a) {
              return a.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
            }
            function d (a, b, c) {
              return Math.min(b, Math.max(a, c));
            }
            function e (a) {
              if (/^\s*[-+]?(\d*\.)?\d+\s*$/.test(a))
                return Number(a);
            }
            function f (a, b) {
              return [
                a,
                b,
                c
              ];
            }
            function g (a, b) {
              if (0 != a)
                return i(0, 1 / 0)(a, b);
            }
            function h (a, b) {
              return [
                a,
                b,
                function (a) {
                  return Math.round(d(1, 1 / 0, a));
                }
              ];
            }
            function i (a, b) {
              return function (e, f) {
                return [
                  e,
                  f,
                  function (e) {
                    return c(d(a, b, e));
                  }
                ];
              };
            }
            function j (a) {
              var b = a.trim().split(/\s*[\s,]\s*/);
              if (0 !== b.length) {
                for (var c = [], d = 0; d < b.length; d++) {
                  var f = e(b[d]);
                  if (void 0 === f)
                    return;
                  c.push(f);
                }
                return c;
              }
            }
            function k (a, b) {
              if (a.length == b.length)
                return [
                  a,
                  b,
                  function (a) {
                    return a.map(c).join(' ');
                  }
                ];
            }
            function l (a, b) {
              return [
                a,
                b,
                Math.round
              ];
            }
            a.clamp = d, a.addPropertiesHandler(j, k, ['stroke-dasharray']), a.addPropertiesHandler(e, i(0, 1 / 0), [
              'border-image-width',
              'line-height'
            ]), a.addPropertiesHandler(e, i(0, 1), [
              'opacity',
              'shape-image-threshold'
            ]), a.addPropertiesHandler(e, g, [
              'flex-grow',
              'flex-shrink'
            ]), a.addPropertiesHandler(e, h, [
              'orphans',
              'widows'
            ]), a.addPropertiesHandler(e, l, ['z-index']), a.parseNumber = e, a.parseNumberList = j, a.mergeNumbers = f, a.numberToString = c;
          }(d), function (a, b) {
            function c (a, b) {
              if ('visible' == a || 'visible' == b)
                return [
                  0,
                  1,
                  function (c) {
                    return c <= 0 ? a : c >= 1 ? b : 'visible';
                  }
                ];
            }
            a.addPropertiesHandler(String, c, ['visibility']);
          }(d), function (a, b) {
            function c (a) {
              a = a.trim(), f.fillStyle = '#000', f.fillStyle = a;
              var b = f.fillStyle;
              if (f.fillStyle = '#fff', f.fillStyle = a, b == f.fillStyle) {
                f.fillRect(0, 0, 1, 1);
                var c = f.getImageData(0, 0, 1, 1).data;
                f.clearRect(0, 0, 1, 1);
                var d = c[3] / 255;
                return [
                  c[0] * d,
                  c[1] * d,
                  c[2] * d,
                  d
                ];
              }
            }
            function d (b, c) {
              return [
                b,
                c,
                function (b) {
                  function c (a) {
                    return Math.max(0, Math.min(255, a));
                  }
                  if (b[3])
                    for (var d = 0; d < 3; d++)
                      b[d] = Math.round(c(b[d] / b[3]));
                  return b[3] = a.numberToString(a.clamp(0, 1, b[3])), 'rgba(' + b.join(',') + ')';
                }
              ];
            }
            var e = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
            e.width = e.height = 1;
            var f = e.getContext('2d');
            a.addPropertiesHandler(c, d, [
              'background-color',
              'border-bottom-color',
              'border-left-color',
              'border-right-color',
              'border-top-color',
              'color',
              'fill',
              'flood-color',
              'lighting-color',
              'outline-color',
              'stop-color',
              'stroke',
              'text-decoration-color'
            ]), a.consumeColor = a.consumeParenthesised.bind(null, c), a.mergeColors = d;
          }(d), function (a, b) {
            function c (a) {
              function b () {
                var b = h.exec(a);
                g = b ? b[0] : void 0;
              }
              function c () {
                var a = Number(g);
                return b(), a;
              }
              function d () {
                if ('(' !== g)
                  return c();
                b();
                var a = f();
                return ')' !== g ? NaN : (b(), a);
              }
              function e () {
                for (var a = d(); '*' === g || '/' === g;) {
                  var c = g;
                  b();
                  var e = d();
                  '*' === c ? a *= e : a /= e;
                }
                return a;
              }
              function f () {
                for (var a = e(); '+' === g || '-' === g;) {
                  var c = g;
                  b();
                  var d = e();
                  '+' === c ? a += d : a -= d;
                }
                return a;
              }
              var g, h = /([\+\-\w\.]+|[\(\)\*\/])/g;
              return b(), f();
            }
            function d (a, b) {
              if ('0' == (b = b.trim().toLowerCase()) && 'px'.search(a) >= 0)
                return { px: 0 };
              if (/^[^(]*$|^calc/.test(b)) {
                b = b.replace(/calc\(/g, '(');
                var d = {};
                b = b.replace(a, function (a) {
                  return d[a] = null, 'U' + a;
                });
                for (var e = 'U(' + a.source + ')', f = b.replace(/[-+]?(\d*\.)?\d+([Ee][-+]?\d+)?/g, 'N').replace(new RegExp('N' + e, 'g'), 'D').replace(/\s[+-]\s/g, 'O').replace(/\s/g, ''), g = [
                  /N\*(D)/g,
                  /(N|D)[*\/]N/g,
                  /(N|D)O\1/g,
                  /\((N|D)\)/g
                ], h = 0; h < g.length;)
                  g[h].test(f) ? (f = f.replace(g[h], '$1'), h = 0) : h++;
                if ('D' == f) {
                  for (var i in d) {
                    var j = c(b.replace(new RegExp('U' + i, 'g'), '').replace(new RegExp(e, 'g'), '*0'));
                    if (!isFinite(j))
                      return;
                    d[i] = j;
                  }
                  return d;
                }
              }
            }
            function e (a, b) {
              return f(a, b, !0);
            }
            function f (b, c, d) {
              var e, f = [];
              for (e in b)
                f.push(e);
              for (e in c)
                f.indexOf(e) < 0 && f.push(e);
              return b = f.map(function (a) {
                return b[a] || 0;
              }), c = f.map(function (a) {
                return c[a] || 0;
              }), [
                  b,
                  c,
                  function (b) {
                    var c = b.map(function (c, e) {
                      return 1 == b.length && d && (c = Math.max(c, 0)), a.numberToString(c) + f[e];
                    }).join(' + ');
                    return b.length > 1 ? 'calc(' + c + ')' : c;
                  }
                ];
            }
            var g = 'px|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc', h = d.bind(null, new RegExp(g, 'g')), i = d.bind(null, new RegExp(g + '|%', 'g')), j = d.bind(null, /deg|rad|grad|turn/g);
            a.parseLength = h, a.parseLengthOrPercent = i, a.consumeLengthOrPercent = a.consumeParenthesised.bind(null, i), a.parseAngle = j, a.mergeDimensions = f;
            var k = a.consumeParenthesised.bind(null, h), l = a.consumeRepeated.bind(void 0, k, /^/), m = a.consumeRepeated.bind(void 0, l, /^,/);
            a.consumeSizePairList = m;
            var n = function (a) {
              var b = m(a);
              if (b && '' == b[1])
                return b[0];
            }, o = a.mergeNestedRepeated.bind(void 0, e, ' '), p = a.mergeNestedRepeated.bind(void 0, o, ',');
            a.mergeNonNegativeSizePair = o, a.addPropertiesHandler(n, p, ['background-size']), a.addPropertiesHandler(i, e, [
              'border-bottom-width',
              'border-image-width',
              'border-left-width',
              'border-right-width',
              'border-top-width',
              'flex-basis',
              'font-size',
              'height',
              'line-height',
              'max-height',
              'max-width',
              'outline-width',
              'width'
            ]), a.addPropertiesHandler(i, f, [
              'border-bottom-left-radius',
              'border-bottom-right-radius',
              'border-top-left-radius',
              'border-top-right-radius',
              'bottom',
              'left',
              'letter-spacing',
              'margin-bottom',
              'margin-left',
              'margin-right',
              'margin-top',
              'min-height',
              'min-width',
              'outline-offset',
              'padding-bottom',
              'padding-left',
              'padding-right',
              'padding-top',
              'perspective',
              'right',
              'shape-margin',
              'stroke-dashoffset',
              'text-indent',
              'top',
              'vertical-align',
              'word-spacing'
            ]);
          }(d), function (a, b) {
            function c (b) {
              return a.consumeLengthOrPercent(b) || a.consumeToken(/^auto/, b);
            }
            function d (b) {
              var d = a.consumeList([
                a.ignore(a.consumeToken.bind(null, /^rect/)),
                a.ignore(a.consumeToken.bind(null, /^\(/)),
                a.consumeRepeated.bind(null, c, /^,/),
                a.ignore(a.consumeToken.bind(null, /^\)/))
              ], b);
              if (d && 4 == d[0].length)
                return d[0];
            }
            function e (b, c) {
              return 'auto' == b || 'auto' == c ? [
                !0,
                !1,
                function (d) {
                  var e = d ? b : c;
                  if ('auto' == e)
                    return 'auto';
                  var f = a.mergeDimensions(e, e);
                  return f[2](f[0]);
                }
              ] : a.mergeDimensions(b, c);
            }
            function f (a) {
              return 'rect(' + a + ')';
            }
            var g = a.mergeWrappedNestedRepeated.bind(null, f, e, ', ');
            a.parseBox = d, a.mergeBoxes = g, a.addPropertiesHandler(d, g, ['clip']);
          }(d), function (a, b) {
            function c (a) {
              return function (b) {
                var c = 0;
                return a.map(function (a) {
                  return a === k ? b[c++] : a;
                });
              };
            }
            function d (a) {
              return a;
            }
            function e (b) {
              if ('none' == (b = b.toLowerCase().trim()))
                return [];
              for (var c, d = /\s*(\w+)\(([^)]*)\)/g, e = [], f = 0; c = d.exec(b);) {
                if (c.index != f)
                  return;
                f = c.index + c[0].length;
                var g = c[1], h = n[g];
                if (!h)
                  return;
                var i = c[2].split(','), j = h[0];
                if (j.length < i.length)
                  return;
                for (var k = [], o = 0; o < j.length; o++) {
                  var p, q = i[o], r = j[o];
                  if (void 0 === (p = q ? {
                    A: function (b) {
                      return '0' == b.trim() ? m : a.parseAngle(b);
                    },
                    N: a.parseNumber,
                    T: a.parseLengthOrPercent,
                    L: a.parseLength
                  }[r.toUpperCase()](q) : {
                    a: m,
                    n: k[0],
                    t: l
                  }[r]))
                    return;
                  k.push(p);
                }
                if (e.push({
                  t: g,
                  d: k
                }), d.lastIndex == b.length)
                  return e;
              }
            }
            function f (a) {
              return a.toFixed(6).replace('.000000', '');
            }
            function g (b, c) {
              if (b.decompositionPair !== c) {
                b.decompositionPair = c;
                var d = a.makeMatrixDecomposition(b);
              }
              if (c.decompositionPair !== b) {
                c.decompositionPair = b;
                var e = a.makeMatrixDecomposition(c);
              }
              return null == d[0] || null == e[0] ? [
                [!1],
                [!0],
                function (a) {
                  return a ? c[0].d : b[0].d;
                }
              ] : (d[0].push(0), e[0].push(1), [
                d,
                e,
                function (b) {
                  var c = a.quat(d[0][3], e[0][3], b[5]);
                  return a.composeMatrix(b[0], b[1], b[2], c, b[4]).map(f).join(',');
                }
              ]);
            }
            function h (a) {
              return a.replace(/[xy]/, '');
            }
            function i (a) {
              return a.replace(/(x|y|z|3d)?$/, '3d');
            }
            function j (b, c) {
              var d = a.makeMatrixDecomposition && !0, e = !1;
              if (!b.length || !c.length) {
                b.length || (e = !0, b = c, c = []);
                for (var f = 0; f < b.length; f++) {
                  var j = b[f].t, k = b[f].d, l = 'scale' == j.substr(0, 5) ? 1 : 0;
                  c.push({
                    t: j,
                    d: k.map(function (a) {
                      if ('number' == typeof a)
                        return l;
                      var b = {};
                      for (var c in a)
                        b[c] = l;
                      return b;
                    })
                  });
                }
              }
              var m = function (a, b) {
                return 'perspective' == a && 'perspective' == b || ('matrix' == a || 'matrix3d' == a) && ('matrix' == b || 'matrix3d' == b);
              }, o = [], p = [], q = [];
              if (b.length != c.length) {
                if (!d)
                  return;
                var r = g(b, c);
                o = [r[0]], p = [r[1]], q = [[
                  'matrix',
                  [r[2]]
                ]];
              } else
                for (var f = 0; f < b.length; f++) {
                  var j, s = b[f].t, t = c[f].t, u = b[f].d, v = c[f].d, w = n[s], x = n[t];
                  if (m(s, t)) {
                    if (!d)
                      return;
                    var r = g([b[f]], [c[f]]);
                    o.push(r[0]), p.push(r[1]), q.push([
                      'matrix',
                      [r[2]]
                    ]);
                  } else {
                    if (s == t)
                      j = s;
                    else if (w[2] && x[2] && h(s) == h(t))
                      j = h(s), u = w[2](u), v = x[2](v);
                    else {
                      if (!w[1] || !x[1] || i(s) != i(t)) {
                        if (!d)
                          return;
                        var r = g(b, c);
                        o = [r[0]], p = [r[1]], q = [[
                          'matrix',
                          [r[2]]
                        ]];
                        break;
                      }
                      j = i(s), u = w[1](u), v = x[1](v);
                    }
                    for (var y = [], z = [], A = [], B = 0; B < u.length; B++) {
                      var C = 'number' == typeof u[B] ? a.mergeNumbers : a.mergeDimensions, r = C(u[B], v[B]);
                      y[B] = r[0], z[B] = r[1], A.push(r[2]);
                    }
                    o.push(y), p.push(z), q.push([
                      j,
                      A
                    ]);
                  }
                }
              if (e) {
                var D = o;
                o = p, p = D;
              }
              return [
                o,
                p,
                function (a) {
                  return a.map(function (a, b) {
                    var c = a.map(function (a, c) {
                      return q[b][1][c](a);
                    }).join(',');
                    return 'matrix' == q[b][0] && 16 == c.split(',').length && (q[b][0] = 'matrix3d'), q[b][0] + '(' + c + ')';
                  }).join(' ');
                }
              ];
            }
            var k = null, l = { px: 0 }, m = { deg: 0 }, n = {
              matrix: [
                'NNNNNN',
                [
                  k,
                  k,
                  0,
                  0,
                  k,
                  k,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  k,
                  k,
                  0,
                  1
                ],
                d
              ],
              matrix3d: [
                'NNNNNNNNNNNNNNNN',
                d
              ],
              rotate: ['A'],
              rotatex: ['A'],
              rotatey: ['A'],
              rotatez: ['A'],
              rotate3d: ['NNNA'],
              perspective: ['L'],
              scale: [
                'Nn',
                c([
                  k,
                  k,
                  1
                ]),
                d
              ],
              scalex: [
                'N',
                c([
                  k,
                  1,
                  1
                ]),
                c([
                  k,
                  1
                ])
              ],
              scaley: [
                'N',
                c([
                  1,
                  k,
                  1
                ]),
                c([
                  1,
                  k
                ])
              ],
              scalez: [
                'N',
                c([
                  1,
                  1,
                  k
                ])
              ],
              scale3d: [
                'NNN',
                d
              ],
              skew: [
                'Aa',
                null,
                d
              ],
              skewx: [
                'A',
                null,
                c([
                  k,
                  m
                ])
              ],
              skewy: [
                'A',
                null,
                c([
                  m,
                  k
                ])
              ],
              translate: [
                'Tt',
                c([
                  k,
                  k,
                  l
                ]),
                d
              ],
              translatex: [
                'T',
                c([
                  k,
                  l,
                  l
                ]),
                c([
                  k,
                  l
                ])
              ],
              translatey: [
                'T',
                c([
                  l,
                  k,
                  l
                ]),
                c([
                  l,
                  k
                ])
              ],
              translatez: [
                'L',
                c([
                  l,
                  l,
                  k
                ])
              ],
              translate3d: [
                'TTL',
                d
              ]
            };
            a.addPropertiesHandler(e, j, ['transform']), a.transformToSvgMatrix = function (b) {
              var c = a.transformListToMatrix(e(b));
              return 'matrix(' + f(c[0]) + ' ' + f(c[1]) + ' ' + f(c[4]) + ' ' + f(c[5]) + ' ' + f(c[12]) + ' ' + f(c[13]) + ')';
            };
          }(d), function (a) {
            function b (a) {
              var b = Number(a);
              if (!(isNaN(b) || b < 100 || b > 900 || b % 100 != 0))
                return b;
            }
            function c (b) {
              return b = 100 * Math.round(b / 100), b = a.clamp(100, 900, b), 400 === b ? 'normal' : 700 === b ? 'bold' : String(b);
            }
            function d (a, b) {
              return [
                a,
                b,
                c
              ];
            }
            a.addPropertiesHandler(b, d, ['font-weight']);
          }(d), function (a) {
            function b (a) {
              var b = {};
              for (var c in a)
                b[c] = -a[c];
              return b;
            }
            function c (b) {
              return a.consumeToken(/^(left|center|right|top|bottom)\b/i, b) || a.consumeLengthOrPercent(b);
            }
            function d (b, d) {
              var e = a.consumeRepeated(c, /^/, d);
              if (e && '' == e[1]) {
                var f = e[0];
                if (f[0] = f[0] || 'center', f[1] = f[1] || 'center', 3 == b && (f[2] = f[2] || { px: 0 }), f.length == b) {
                  if (/top|bottom/.test(f[0]) || /left|right/.test(f[1])) {
                    var h = f[0];
                    f[0] = f[1], f[1] = h;
                  }
                  if (/left|right|center|Object/.test(f[0]) && /top|bottom|center|Object/.test(f[1]))
                    return f.map(function (a) {
                      return 'object' == typeof a ? a : g[a];
                    });
                }
              }
            }
            function e (d) {
              var e = a.consumeRepeated(c, /^/, d);
              if (e) {
                for (var f = e[0], h = [
                  { '%': 50 },
                  { '%': 50 }
                ], i = 0, j = !1, k = 0; k < f.length; k++) {
                  var l = f[k];
                  'string' == typeof l ? (j = /bottom|right/.test(l), i = {
                    left: 0,
                    right: 0,
                    center: i,
                    top: 1,
                    bottom: 1
                  }[l], h[i] = g[l], 'center' == l && i++) : (j && (l = b(l), l['%'] = (l['%'] || 0) + 100), h[i] = l, i++ , j = !1);
                }
                return [
                  h,
                  e[1]
                ];
              }
            }
            function f (b) {
              var c = a.consumeRepeated(e, /^,/, b);
              if (c && '' == c[1])
                return c[0];
            }
            var g = {
              left: { '%': 0 },
              center: { '%': 50 },
              right: { '%': 100 },
              top: { '%': 0 },
              bottom: { '%': 100 }
            }, h = a.mergeNestedRepeated.bind(null, a.mergeDimensions, ' ');
            a.addPropertiesHandler(d.bind(null, 3), h, ['transform-origin']), a.addPropertiesHandler(d.bind(null, 2), h, ['perspective-origin']), a.consumePosition = e, a.mergeOffsetList = h;
            var i = a.mergeNestedRepeated.bind(null, h, ', ');
            a.addPropertiesHandler(f, i, [
              'background-position',
              'object-position'
            ]);
          }(d), function (a) {
            function b (b) {
              var c = a.consumeToken(/^circle/, b);
              if (c && c[0])
                return ['circle'].concat(a.consumeList([
                  a.ignore(a.consumeToken.bind(void 0, /^\(/)),
                  d,
                  a.ignore(a.consumeToken.bind(void 0, /^at/)),
                  a.consumePosition,
                  a.ignore(a.consumeToken.bind(void 0, /^\)/))
                ], c[1]));
              var f = a.consumeToken(/^ellipse/, b);
              if (f && f[0])
                return ['ellipse'].concat(a.consumeList([
                  a.ignore(a.consumeToken.bind(void 0, /^\(/)),
                  e,
                  a.ignore(a.consumeToken.bind(void 0, /^at/)),
                  a.consumePosition,
                  a.ignore(a.consumeToken.bind(void 0, /^\)/))
                ], f[1]));
              var g = a.consumeToken(/^polygon/, b);
              return g && g[0] ? ['polygon'].concat(a.consumeList([
                a.ignore(a.consumeToken.bind(void 0, /^\(/)),
                a.optional(a.consumeToken.bind(void 0, /^nonzero\s*,|^evenodd\s*,/), 'nonzero,'),
                a.consumeSizePairList,
                a.ignore(a.consumeToken.bind(void 0, /^\)/))
              ], g[1])) : void 0;
            }
            function c (b, c) {
              if (b[0] === c[0])
                return 'circle' == b[0] ? a.mergeList(b.slice(1), c.slice(1), [
                  'circle(',
                  a.mergeDimensions,
                  ' at ',
                  a.mergeOffsetList,
                  ')'
                ]) : 'ellipse' == b[0] ? a.mergeList(b.slice(1), c.slice(1), [
                  'ellipse(',
                  a.mergeNonNegativeSizePair,
                  ' at ',
                  a.mergeOffsetList,
                  ')'
                ]) : 'polygon' == b[0] && b[1] == c[1] ? a.mergeList(b.slice(2), c.slice(2), [
                  'polygon(',
                  b[1],
                  g,
                  ')'
                ]) : void 0;
            }
            var d = a.consumeParenthesised.bind(null, a.parseLengthOrPercent), e = a.consumeRepeated.bind(void 0, d, /^/), f = a.mergeNestedRepeated.bind(void 0, a.mergeDimensions, ' '), g = a.mergeNestedRepeated.bind(void 0, f, ',');
            a.addPropertiesHandler(b, c, ['shape-outside']);
          }(d), function (a, b) {
            function c (a, b) {
              b.concat([a]).forEach(function (b) {
                b in document.documentElement.style && (d[a] = b), e[b] = a;
              });
            }
            var d = {}, e = {};
            c('transform', [
              'webkitTransform',
              'msTransform'
            ]), c('transformOrigin', ['webkitTransformOrigin']), c('perspective', ['webkitPerspective']), c('perspectiveOrigin', ['webkitPerspectiveOrigin']), a.propertyName = function (a) {
              return d[a] || a;
            }, a.unprefixedPropertyName = function (a) {
              return e[a] || a;
            };
          }(d);
        }(), function () {
          if (void 0 === document.createElement('div').animate([]).oncancel) {
            var a;
            if (window.performance && performance.now)
              var a = function () {
                return performance.now();
              };
            else
              var a = function () {
                return Date.now();
              };
            var b = function (a, b, c) {
              this.target = a, this.currentTime = b, this.timelineTime = c, this.type = 'cancel', this.bubbles = !1, this.cancelable = !1, this.currentTarget = a, this.defaultPrevented = !1, this.eventPhase = Event.AT_TARGET, this.timeStamp = Date.now();
            }, c = window.Element.prototype.animate;
            window.Element.prototype.animate = function (d, e) {
              var f = c.call(this, d, e);
              f._cancelHandlers = [], f.oncancel = null;
              var g = f.cancel;
              f.cancel = function () {
                g.call(this);
                var c = new b(this, null, a()), d = this._cancelHandlers.concat(this.oncancel ? [this.oncancel] : []);
                setTimeout(function () {
                  d.forEach(function (a) {
                    a.call(c.target, c);
                  });
                }, 0);
              };
              var h = f.addEventListener;
              f.addEventListener = function (a, b) {
                'function' == typeof b && 'cancel' == a ? this._cancelHandlers.push(b) : h.call(this, a, b);
              };
              var i = f.removeEventListener;
              return f.removeEventListener = function (a, b) {
                if ('cancel' == a) {
                  var c = this._cancelHandlers.indexOf(b);
                  c >= 0 && this._cancelHandlers.splice(c, 1);
                } else
                  i.call(this, a, b);
              }, f;
            };
          }
        }(), function (a) {
          var b = document.documentElement, c = null, d = !1;
          try {
            var e = getComputedStyle(b).getPropertyValue('opacity'), f = '0' == e ? '1' : '0';
            c = b.animate({
              opacity: [
                f,
                f
              ]
            }, { duration: 1 }), c.currentTime = 0, d = getComputedStyle(b).getPropertyValue('opacity') == f;
          } catch (a) {
          } finally {
            c && c.cancel();
          }
          if (!d) {
            var g = window.Element.prototype.animate;
            window.Element.prototype.animate = function (b, c) {
              return window.Symbol && Symbol.iterator && Array.prototype.from && b[Symbol.iterator] && (b = Array.from(b)), Array.isArray(b) || null === b || (b = a.convertToArrayForm(b)), g.call(this, b, c);
            };
          }
        }(c), b.true = a;
      }({}, function () {
        return this;
      }());
    });    //# sourceMappingURL=web-animations.min.js.map


    // ======================
    // mip-story/mip-story.js
    // ======================


    /**
     * @file mip-story 组件
     * @author
     */
    define('mip-story/mip-story', [
      'require',
      'customElement',
      './mip-story-view',
      './mip-story-layer',
      './audio',
      './mip-story-share',
      './mip-story-hint',
      './mip-story-bookend',
      './animate-preset',
      'util',
      './mip-progress',
      'viewport',
      'viewer',
      'zepto',
      './mip-story-service',
      './web-animation'
    ], function (require) {
      'use strict';
      var MIP_I_STORY_STANDALONE = 'mip-i-story-standalone';
      var customElement = require('customElement').create();
      require('./mip-story-view');
      require('./mip-story-layer');
      var Audio = require('./audio');
      var ShareLayer = require('./mip-story-share');
      var HintLayer = require('./mip-story-hint');
      var BookEnd = require('./mip-story-bookend');
      var animatePreset = require('./animate-preset');
      var util = require('util');
      var dm = util.dom;
      var EventEmitter = util.EventEmitter;
      var Gesture = util.Gesture;
      var Progress = require('./mip-progress');
      var storyViews = [];
      var storyContain = [];
      var viewport = require('viewport');
      var viewer = require('viewer');
      var $ = require('zepto');
      var SWITCHPAGE_THRESHOLD = viewport.getWidth() * 0.15;
      var SWITCHPAGE_THRESHOLD_Height = viewport.getHeight() * 0.4;
      var Service = require('./mip-story-service');
      var service;
      function MIPStory (element) {
        this.element = element;
        this.win = window;
        this.storyViews = [];
        this.storyContain = [];
      }
      MIPStory.prototype.getConfigData = function () {
        var configData = this.element.querySelector('mip-story > script[type="application/json"]');
        try {
          return JSON.parse(configData.innerText);
        } catch (e) {
          console.error(e);
        }
        return {};
      };
      MIPStory.prototype.initAudio = function () {
        var au = this.element.getAttribute('background-audio');
        if (au) {
          this.audio = new Audio().build(this.element, au);
        }
        this.muted = false;
        this.viewMuted = !!(this.muted || this.audio);
      };
      MIPStory.prototype.initBookend = function (storyConfig) {
        this.bookEnd = new BookEnd(storyConfig);
        var html = dm.create(this.bookEnd.build());
        this.element.appendChild(html);
      };
      MIPStory.prototype.initStoryViews = function () {
        this.storyViews = this.element.querySelectorAll('mip-story-view');
      };
      MIPStory.prototype.initStoryContain = function () {
        this.bookEndContainer = document.querySelector('.mip-backend');
        for (var index = 0; index < this.storyViews.length; index++) {
          this.storyContain.push(this.storyViews[index].customElement.element);
        }
        this.storyContain.push(this.bookEndContainer);
      };
      MIPStory.prototype.initHintLayer = function (element) {
        this.hint = new HintLayer(element);
        var html = dm.create(this.hint.build());
        this.element.appendChild(html);
      };
      MIPStory.prototype.initShare = function (storyConfig, element) {
        var shareConfig = storyConfig.share || {};
        this.share = new ShareLayer(shareConfig, element);
        var html = dm.create(this.share.build());
        this.element.appendChild(html);
      };
      MIPStory.prototype.initService = function () {
        service = new Service(this);
        service.build();
      };
      MIPStory.prototype.initProgress = function (storyConfig) {
        if (this.progress) {
          return;
        }
        var audioHide = this.element.hasAttribute('audio-hide');
        this.progress = new Progress(this.element, this.storyViews, audioHide, storyConfig);
        var html = dm.create(this.progress.build());
        this.element.appendChild(html);
        this.progress.updateProgress(0, 1);
        var sys = this.element.querySelector('.mip-story-system-layer');
        // if (!viewer.isIframed || !this.getConfigData().icon.office_id){
        //     return;
        // }
        // 加载icon
        this.progress.setIcon().then(function (data) {
          var icon = dm.create(data);
          sys.appendChild(icon);
        });
      };
      // story组件的初始化
      MIPStory.prototype.init = function () {
        var element = this.element;
        var html = this.win.document.documentElement;
        var mipStoryConfigData = this.getConfigData();
        html.setAttribute('id', MIP_I_STORY_STANDALONE);
        // 初始化音频
        this.initAudio();
        // 初始化结尾页
        this.initBookend(mipStoryConfigData);
        // 保存 story-views到storyViews中便于后期操作
        this.initStoryViews();
        // 保存包括封底页面在内的所有结果页
        this.initStoryContain();
        // 初始化引导页
        this.initHintLayer(element);
        // 初始化分享页面
        this.initShare(mipStoryConfigData, element);
        // 初始化导航
        this.initProgress(mipStoryConfigData);
        // 初始化story的Slider
        this.initService();
      };
      /**
       * 第一次进入可视区回调，只会执行一次
       */
      customElement.prototype.firstInviewCallback = function () {
        var mipStory = new MIPStory(this.element);
        require('./web-animation');
        mipStory.init();
      };
      return customElement;
    }), define('mip-story', ['mip-story/mip-story'], function (main) {
      return main;
    });

    // =============
    // bootstrap
    // =============
    (function () {
      function registerComponent (mip, component) {
        mip.registerMipElement("mip-story", component, "html#mip-i-story-standalone,html#mip-i-story-standalone body{width:100% !important;height:100% !important;margin:0 !important;padding:0 !important;cursor:auto !important}mip-story{position:relative !important;display:block;overflow:auto;-webkit-overflow-scrolling:touch;width:100% !important;height:100% !important;background:#000;overflow-scrolling:touch;-webkit-tap-highlight-color:transparent;tap-highlight-color:transparent}mip-story,mip-story-view,mip-story-layer{overflow:hidden !important}mip-story-view{position:absolute !important;top:0 !important;right:0 !important;bottom:0 !important;left:0 !important;display:none !important;height:auto !important}mip-story-view[active]{display:block !important;will-change:transform}mip-story-view[current]{display:block !important;will-change:transform}mip-story-layer{position:absolute !important;top:0 !important;right:0 !important;bottom:0 !important;left:0 !important;overflow:hidden !important;padding:68px 32px 32px !important}mip-story-layer[template=cover]{box-sizing:border-box}mip-story-layer *{box-sizing:border-box;margin:0}.mip-story-system-layer{position:absolute;z-index:100000;top:0;right:0;left:0;padding:0 0 72px 0;background:-webkit-linear-gradient(top, #000, transparent);background:linear-gradient(top, #000, transparent)}.mip-story-progress{overflow:hidden}.mip-story-system-layer .control{width:50%;height:24px;position:absolute;top:20px;right:17px}.mip-story-system-layer span{width:24px;height:24px;float:right;margin-left:20px;background-repeat:no-repeat;background-position:center center;background-size:24px 24px}.mip-story-close{display:block;opacity:1;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEQyQzc4MzE2N0NFMTFFODk1NUVCQ0Q3REIxMTdDRjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEQyQzc4MzI2N0NFMTFFODk1NUVCQ0Q3REIxMTdDRjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NDAzQjA3ODY3QzExMUU4OTU1RUJDRDdEQjExN0NGMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4RDJDNzgzMDY3Q0UxMUU4OTU1RUJDRDdEQjExN0NGMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqdVduYAAAF5SURBVHja7NxJDoMgFIDh2mu6c8fpPQId4sI0WkDeRPu/hJ1h+GKRsVPO+Uacxx0CgAACCCCAAAIIIOIwXiPpUtqem59p3dIyYDuXXf3nmna/21754LRlvI80EE76qPtqATQE0gGOPNDuFc0jIZ3g5K0tskCFAtNAOKm2720GGgWppo5qQNGRauumChQVqaVO6kDRkFrrYgIUBelKHcyAvJGulm0K5IXUU6Y5kDVSb1kuQFZIEmW4AWkjSeXtCqSFJJmnO5BCg0TBQwAJ9hcab2MMIIHPsUp/FgqoY7Sr2dnHArowmVQdLoQEalirsRhLxQQqAViNxkMDFZCspiqxgRqQklLZ8YEqkDRXAqoSW88SkvzE6KT5zDNQZKrx41MNJqssd7BgxpIri/Zs+8QHYuPQGUeqLA4vRALi+EtQnM5ROkfwXI/gcYiTY8AcJOcqguVVBC6zcB2KC3Xa98X+8krmxL+/fA+2ngECCCCAAAIIIICIw3gIMAC6gmoP9K42PAAAAABJRU5ErkJggg==')}.mip-story-close:active{opacity:.6}.mip-story-shares{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEQyQzc4MzU2N0NFMTFFODk1NUVCQ0Q3REIxMTdDRjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEQyQzc4MzY2N0NFMTFFODk1NUVCQ0Q3REIxMTdDRjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4RDJDNzgzMzY3Q0UxMUU4OTU1RUJDRDdEQjExN0NGMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4RDJDNzgzNDY3Q0UxMUU4OTU1RUJDRDdEQjExN0NGMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhAGK/EAAAS5SURBVHja7JtLbE1BGMePlnpdlWi6IPVIqEelLDxi4bWSYlVVYUEiqUclSCSEhQWxEmyQIISKRARdEIJVPRISRZC4goVHxatNxCNX0F7/L/1u3Ezm9LxmzuN2vuSXdM65Z843/858Z+Y7Z/pks1nLmL0VGQmMQEYgI5ARyAhkBDIC9VLrG8E9i8F0MA9UgQlgDEgxHWAjOBsHgfqENJMmURaAVWARKHX4fQYMBX8KvQdRj2gA28BwD9f1ByU2AtHxqWCwD3/+gifgm+srqAdpoAisB+1Zf7bTpt5S8DgbzDpAldu26OhB1eA4mOnwu/fgFkiDF+AL+AHego821ywEUwL6NwysA5ujGGI0nA6CATbnX4ImcJ5F8WpfFfk5NOwYREH4EFhvc/4e2AWu06gOcJ8bYC9YCQa5iGMDArdMQbwpARdsxnsbqNcU53qiArzqIQ6dCisGFfN8ZYnk3Dmw1tMTQ41VgBYwNg4z6cMScbrAJrA8RuL8iUKgBn4aiI4s40BtxUScy/xUDVWgaokIXdxrLsZMnKXgd5gC0TUnJE8Imlc0F5I4fgWiwDtDEpAPFZo4fgSitdUe4Vgbi1Zw4vgRaA0oE45tidHTSqk4XgWiOdNW4dhdXjYUpDheBVogSVnsLmRxvAq0UijTYvNaQsTpFFdYqgXqy5nAfGtKUM95KJQfq16szpIs+CojXnhe4oWymzootbwDtIB9Hq5zLdA2wbl3CRInEG6H2GShfLMQA3KQGDRRKD/vDeJ4EWi0JHWaVHEGgn6qBUoJ5c+axBmhWZztPOun3PYKlU8x0WZoCopHNQbkcqHedpVBOixLaYw5Y4Rymcoh9tOhIapsH/jEf19UHJBTDm2ynSG7MXqhl/+qt1yTQI84DqU0ZAjKJW1S1oPeCOXxGodZl6b0yXiHNgUS6LnDvCgJ5msu51agtFCem0CB5jq0KZBALUJ5JKhMkDiV7HNPbQokUKskqNUnSKB6SYBuVSkQfXh01SGBFmcTfb3KbVKaUWySBL2aBIhTIwnQrpN9Xr5RpDkTfdyUn5e+A+bEXKDbYHZe+QMYpaMHUYX7hWN047oYi1MniGNxG/7q6EG56fprYR1DLw4nuZ2ZhryuS3P6JGcdvCZz7avXxSpVvFOSvzkSw95zRBDHYt+9/SN9fsHaKklLNEbwJZkdjRL/Wtl3T3X5daAaZAQHOkFtDMSpZV/yLcM+W2EJRDRI/ku/Ihapln0QrcFvnUEdOiZxpjOi4dYo6TlZ9tGKSqBi0GzzJekZkApBmBTfS2bN7GNkAuU+A7YTiV4w1mkUp47vYSdO4Fy2KkeLbYZbzm6BGoXC1HCddnYsaM9RLVCOtZKnW76l+R35OB91j+Nr0z3Un2EflLVJx34x+gL2JJjmIo1La7lnVveLSNrM8p3PDeEcMuVxqni5MNqhvgdgNXiqtDUat0NtCLAdyou1872KdLRF945DWg/RBpctlrcNdW6MVuUHeEmhbR0Y1pZMehee25K52PK3WzD3LusKOG117/zRvmUzLIHEvBJ9Zz2fswATrf+begfybzLcK17z24c055Dve0lVJFWgRJnZN28EMgIZgYxARiAjkBGot9o/AQYASDRwsINjlt4AAAAASUVORK5CYII=')}.icon-wrap{position:absolute;left:17px;top:14px;height:35px}.icon-wrap .icon,.icon-wrap .icon-name,.icon-wrap .icon-type{display:inline-block;vertical-align:middle}.icon-wrap .icon{width:35px;height:35px;border-radius:50%;-webkit-border-radius:50%;overflow:hidden}.icon-wrap .icon-name{font-size:16px;color:#ffffff;margin-left:8px;margin-right:6px}.icon-wrap .icon-type{position:relative;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;vertical-align:middle;text-align:center;height:10px;line-height:11px;font-size:10px;color:#ffffff;border:1px solid rgba(255,255,255,.5);border-radius:2px;-webkit-border-radius:2px;padding:1px 2px;font-family:Arial,Helvetica,sans-serif}.mip-stoy-audio{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzJDNkRCQTI2N0NGMTFFODk1NUVCQ0Q3REIxMTdDRjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzJDNkRCQTM2N0NGMTFFODk1NUVCQ0Q3REIxMTdDRjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMkM2REJBMDY3Q0YxMUU4OTU1RUJDRDdEQjExN0NGMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMkM2REJBMTY3Q0YxMUU4OTU1RUJDRDdEQjExN0NGMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvfuaLwAAAS1SURBVHja7JtpSFRRFMdnzMo2rQyzrKD8IkRku5EY2p5Y2IJlUEErJQkV0Yc2UDCiKIiiD1F9KFok+iJFtBJFRUEpVFC4lAu2WZa22/S/cAceh/Nm3rx5b+bZuwd+H+6b85b5z33n3nvOHa/P5/Mo0zevEkgJpARSAimBlEBKICWQEkgZZzEOepZscAV8BW/BSTBY9SCPpws4CIrE85DPGkAGaHSrQL3BBTAngM9ZUOhGgVJABUgP4vcd9HRbDBoNHjDiNMhYpLUebotB4nU6D/qQ409BLmgC9KG8bhFoPTgMYsnxy6AAtMm2YwTyCIEiQAzY5+PtCOhC/KkZucccUA/egzVWPXskxOkBypkv3QE265xjRqA6cs5e4HW6QEngPvOFv4H8AOeZEaiaOe+QkwVK03noZjAxyLlmBJoFvjPnljlRoKmghXnYZ2C4gfPNCCTIZO77Fywz+13MjGJ9wVqQB1JBHOMTL5cQWrsJFoFPRsaOMEaxCeAaSCCTzcmg0u5RLFeOEqHaSdAthPuY7UF+csBvco0noKudr9g88CdEYUT33mliNAlXIMFG5jq77BIoUSemBLIXYInJL2dEoAXgHaiVAZrzuUSu8xOk2iFQKbmR6Em7wVDQT4dwgrwRgZrI83CTw2TwkVzrtB0CVZGb7LB5/mREoDqDo1UR8ROxaZjVAv0kN0lxgEBiovmDeYXGEb840Ej8Sq0WiFqCAwTyz3tamblWHPErJj7VRgeOzi6Q3pC+jfj0Z3rbKCPP4qSkvVkTE9AScmwL6K5pt0g/WiToVFWNcGwvqNW0k8Bc4nObtMe7SaBf4BA5RgWiy4w0Nwkk7CJpTyTtWtIeZmXK1ccsWFvtTHSaXKy2yoWysC9kwToQNGvaP4wUBP6nHuQhmYL4ICLHuu0V8xci/dbOpGBob3OVQENAoqZdTz4fTtrNbhMol7Qfk/ZI0n7uJoFEfFlHjl0l7RzSrnLTKLYCnCLxJUUTh0Ra+D2JUZngnht6ULycSWvtOAnS+UScFrk3wBWv2BGQrGmL+c8+4rOJmVR2WJm0/0JWwkMcsprfzvgWEZ9sxifD6nxQJbnBTgcIVCCziFq7LvcBaPcEPCI+d+xIuZYwOek9sggYrZz0G+JTL0vdgRJlPplks1yg/kzyO5iJrN1KGwWq0Xz+GaSTz0X1oo1cp8LOuliuibqYf3tLVxsEmg1eg5cgi8lD01erLdSSj5na/CxZiwrV7soSTKQKhyeYaxRHqjYv5hMb5NR+BOjF+PRhVstiK+9C8NDm2vx2UEaO3QLTwV+n7DAbw9StfDJxvsrGHrSWGdkaQuy9EdsfNADc0HnljgaJS2YEms/EyHYwyck7zGLBgQBxaZCFAtUwRcS8zrBHUVAof00f0/0zLBLoFZmnFXaWTZzauFSrE5dWWyDQTFli/gCWW/Xckd4nPQCcA9OYz46BYvCbGW3++33SWsSe6P0B4tIMZkesJ1pE888sS2XeJtgfVUTeZnK0HjKa+SDxN6cpoC6I35mo5nId8Ie6RCnWDJ3ekyXjkmsF8gfhxWANGCuXKeVgK/js9h7k7HKJEkgJpARSAimBlEBKICWQEkgZZ/8EGADUHYH/5J6b0QAAAABJRU5ErkJggg==')}.mip-stoy-audio[muted]{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEQyQzc4Mzk2N0NFMTFFODk1NUVCQ0Q3REIxMTdDRjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEQyQzc4M0E2N0NFMTFFODk1NUVCQ0Q3REIxMTdDRjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4RDJDNzgzNzY3Q0UxMUU4OTU1RUJDRDdEQjExN0NGMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4RDJDNzgzODY3Q0UxMUU4OTU1RUJDRDdEQjExN0NGMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pl6qyekAAAYWSURBVHja7FtrbBVFFL5tsZJSoFgi8jJWQ2LRGiSKPxSlVyOU2hB8BKVGSjBXI+EPCQ0kSkJCgsYHCUn9YVB8JUZ+yKtUBSG0iomxQRRRfIClAvXRYmmRQq29fmMOyeTk7L37mN27N5mTfMmd2Zmzs9/uzJw559yCdDqdsOIshZYCS5AlyBJkCbIEWYIsQZYgK3En6H5gL3AB6AJeByaHcJ9HgTNAJzAva2t11MgxRgCvpmX5FZho8F5PA/9q+s9k65NrckYDH6czy2ZD91oNDDPdsSZoKvBNOrucM3CvDYLeS0BtXAmaCZwWBv0zUC3U+71PAdAk6PsbqHGjIxfkPAD0C4P+HBgPjDVEUBHwtqCrF5jtVk/U5CwHhoRBbwVGUhsTBF0JbBf0/ElfbyJuBBUCrzisMc/TVEgYImgUsFfQoaZ0pdexR0FOCfCBMOB/gJTQPghBZcBBof8JoMLP+MMmZwLwhTDgPmCuQx+/BF0NHBL6fhvElgqTnOn05iTjrypDPz8EXQt8L/T7EigP8hxhkZMEzgoDVm94Upa+XgmaBnQIfVqBMUGfxU+nMrJK1VzvIiI4pJ1qN1DqQr8XgqpoDFxaaO1bTDvXb8D8KAiqpRt6lSaySxIGCZoF9Aht3weK6YzXx+yfKWEStNDhy8gk6mC40uOg3BCUZA+vn9uKNEORG6TbwiLoKuAvj+S0A3U+T/cXmXGnX1c6B4T7bWT2lMIaoV11GAStFQ56jbS1hrHIr6Gvb4is78v1jwGDwkOvy0D2Eda2LQyC2tlNVkV02td3vJQwxYddTOEagdDbTRPEp9eEiM9wqwRfjiJrGV2/k7b6TmCOcKI/7NfH5HaAptwPfrDewZezSGujW9Bdgv3zBOuvTJEr8p0g9eY3Cfe+IDi6vmNtXmDXRwo7mqvFOq5RjSLgDWAFq+8H5gO7Wf1LrJwCSrXyRWAPa3NXvoZ9ioGtQAOr7wGSwAGhzxbgsFYuAxawNm2sfGs+ElQC7AIeZPUqDHQP0O4UnAGahDCSLkdYeZqbAY2IETljgWbh0+8A7gOOZ+n/ISvPYuWTrHxNPn1B44H9AjnHgNkuyFFyGujTylPZ9fOsXJovBE2h9WEmqz9E5JzyoKuXTdfAsyXXBN0AfApUsvrPaEHu9qiv3IEsJeNYuS/uBN1E5FzH6tV2PBc451GfWnRHaeUT7Pr1rHwqzgTdBrQCE1n9NqCOEhi8Sp0wRXW5hZWPxpWgOcA+Nh2UvAk8AgySLbQEqHe5dhSScahLCysnWflrV6ON+KhRS0cFLpuYL2eHdu0tF3qXMH1/kFdRdxNzN0lV3M5ii+iQyWW9cG4aZnH0THpV1OL3LP6hFUIQMVan+WUOvpzGgE579dU1s7bdpEOP6h5lbV42TRA/CXtxfq908OU8ZSCqIaW1LGVtFgsvZnrYHsXnXPZbJzzAILlOg0Y1UkK7XWwtU+vQj6xNcxgu12eFL2At+XydPv2NwgMMuHDkuyWom7X5hYILmV7QsBd3q9eohhQPe9EhL2ez0LafwjWm4mL6wtwj7EozhJ3rvTDjYjXCLtTK2hRT4I6LeoA7DAcOH6KI6U8UROQ6fhBS+SaHHVmdR4mPl2U5S3NpER6uy63NYSg/qMAheSoVVWxexdfrWRrbGPqauHRQckEiQoKknW2HEFSMLLujnNJMuByjtBSe/RUmQY1CXzUFx+Uq/WUSJShx+YrFzpR1vFNLgbk5BIIaBHur1+P0NkpQhUOC1EE6++ht64U03AbDBJ0VwkPJoDPE72m+kpxaFaz+E3KWc2fVgOCc30IoMeQluKT9HqL/ZOwPrNVnErhkE22n9FunLNfXHLJAVHLBjQa+oAVkG6mD6MOmApheO9xN85rLuxmsah1LHVJXztMfTQoMJpJHTlANrR1S9piXLXSGcD7SU+fuFYzM2BNU5+DL2eDzxspuesdlItaBfCCoUxj4agMDeNxhyuryZD4QdJzlHT5jOFFqnwM5bR6SP3NKUDWtGydN7hDs/KT0fkTJWmrdUf9CHJ1LchT+X1yt2H89W4IsQZYgS5AlyBJkCbJiCfIo/wkwAEb1xvYv6O9NAAAAAElFTkSuQmCC')}.mip-story-progress-bar{position:absolute;right:17px;left:17px;display:flex !important;display:-webkit-flex !important;display:-webkit-box;height:14px;-webkit-align-items:center !important;align-items:center !important;-webkit-box-align:center;-moz-box-align:center;-webkit-box-pack:center;-moz-box-pack:center;-webkit-justify-content:center !important;justify-content:center !important}.mip-story-progress-bar>:last-child{margin-right:0 !important}.mip-story-page-progress-bar{overflow:hidden;height:2px;margin:0 6px 0 0;list-style-type:none;border-radius:2px;-webkit-border-radius:2px;background:rgba(255,255,255,0.3);-webkit-box-flex:1;-moz-box-flex:1;-webkit-flex:1 !important;flex:1 !important}.mip-story-page-progress-bar-active{transition:transform 200ms ease !important;-webkit-transform:scale(1, 1) !important;transform:scale(1, 1) !important;-webkit-transform-origin:left;transform-origin:left}.mip-story-page-progress-bar-visited{background:#fff;-webkit-transform:scale(1, 1) !important;transform:scale(1, 1) !important}.mip-story-page-progress-value{width:100%;height:100%;background:#fff;-webkit-transform:scale(0, 1);transform:scale(0, 1);-webkit-transform-origin:left;transform-origin:left}mip-story-layer[template=fill],mip-story-layer[template=cover],mip-story-layer[template=vertical],mip-story-layer[template=horizontal],mip-story-layer[template=thirds]{display:flex !important;display:-webkit-flex !important;display:-webkit-box;height:100%}mip-story-layer[template=fill]>:first-child,mip-story-layer[template=cover]>:first-child{position:absolute;top:0;right:0;bottom:0;left:0;display:block;width:auto;height:auto;object-fit:cover}mip-story-layer[template=fill]>:not(:first-child),mip-story-layer[template=cover]>:not(:first-child){display:none !important}mip-story-layer[template=fill]>mip-anim img,mip-story-layer[template=fill]>mip-img img,mip-story-layer[template=fill]>mip-video video,mip-story-layer[template=cover]>mip-anim img,mip-story-layer[template=cover]>mip-img img,mip-story-layer[template=cover]>mip-video video{object-fit:cover !important}mip-story-layer[template=horizontal]{flex-direction:row;-webkit-align-content:flex-start;align-content:flex-start;-webkit-align-items:stretch;align-items:stretch;-webkit-flex-direction:row}mip-story-layer[template=vertical]{flex-direction:column;margin-bottom:16px;-webkit-align-content:flex-start;align-content:flex-start;-webkit-align-items:stretch;align-items:stretch;-webkit-flex-direction:column}mip-story-layer[template=vertical]>*{width:100%}mip-story-layer[template=thirds]{flex-direction:column !important;-webkit-box-orient:vertical;-webkit-flex-direction:column !important}[flex-area=upper-third],[flex-area=middle-third],[flex-area=lower-third]{height:33%}.mip-backend{position:absolute;z-index:100002;top:0;left:0;display:none !important;display:-webkit-box;width:100%;height:100%;text-align:center;color:#fff;background:rgba(0,0,0,0.9);-webkit-box-align:center;-moz-box-align:center;-webkit-box-pack:center;-moz-box-pack:center}.mip-backend[active]{display:flex !important;display:-webkit-flex !important;-webkit-align-items:center !important;align-items:center !important;-webkit-justify-content:center !important;justify-content:center !important}.mip-backend[current]{display:flex !important;display:-webkit-flex !important;-webkit-align-items:center !important;align-items:center !important;-webkit-justify-content:center !important;justify-content:center !important}.mip-backend-outer{overflow-y:scroll;width:100%;height:100%}.mip-story-middle{display:flex !important;display:-webkit-flex !important;display:-webkit-box;flex-direction:column !important;-webkit-box-orient:vertical;-webkit-box-pack:center;-webkit-flex-direction:column !important;-webkit-justify-content:center !important;justify-content:center !important}.mip-story-middle .mip-backend-preview{margin-top:0}.mip-backend-preview{position:relative;display:flex !important;display:-webkit-flex !important;display:-webkit-box;width:121px;height:121px;margin:0 auto;margin-top:92px;-webkit-align-items:center !important;align-items:center !important;-webkit-box-align:center;-moz-box-align:center;-webkit-box-pack:center;-moz-box-pack:center;-webkit-justify-content:center !important;justify-content:center !important}.mip-backend-preview-mask{position:absolute;top:0;left:0;width:100%;height:100%;opacity:.5;background:#000}.mip-backend-preview-thumbnail{position:relative}.mip-backend-preview-thumbnail:active{opacity:.6}.mip-backend-preview-replay-btn{width:24px;height:24px;background:url(https://www.mipengine.org/static/img/mip-story/mip-story-replay.png);background-size:cover}.mip-backend-preview-share-btn{display:block;width:25px;height:25px;margin:0 auto;background:url(https://www.mipengine.org/static/img/mip-story/mip-story-share.png);background-size:cover}.mip-backend-preview-thumbnail span{display:block;margin-top:8px !important;font-size:13px;line-height:13px;color:#e8eaea}.mip-backend-description{display:block;margin-top:16px;font-size:16px;line-height:16px}.mip-backend-info{display:block;margin-top:10px;font-size:13px;line-height:13px;opacity:.6;color:#bababa}.mip-backend-info a{text-decoration:none;color:#fff}.mip-backend-info>:nth-child(2){margin-left:10px}.mip-backend-share{display:block;width:121px;margin:0 auto;margin-top:66px;overflow:hidden;opacity:1}.mip-backend-share:active{opacity:.6}.mip-backend-share-btn{display:block;margin-top:8px;font-size:13px;color:#fff}.mip-backend-close{position:absolute;z-index:1000;top:12px;left:7px}.mip-story-hint{position:absolute;z-index:100005;top:0;right:0;bottom:0;left:0;display:none}.mip-story-hint-shadow{display:block;width:25%;height:100%;background:-webkit-linear-gradient(left, rgba(0,0,0,0.5), transparent) !important;background:linear-gradient(90deg, rgba(0,0,0,0.5), transparent) !important}.mip-story-hint-damping-hide .mip-story-hint-shadow{display:none}.mip-story-hint-system,.mip-story-hint-rotate{display:none;height:100%}.mip-story-page-switch{display:none;width:100%;height:100%}.mip-story-page-switch-lt,.mip-story-page-switch-rt,.mip-story-page-switch-lt .mip-story-page-switch,.mip-story-page-switch-rt .mip-story-page-switch,.mip-story-page-switch-lt .mip-story-page-switch-left,.mip-story-page-switch-rt .mip-story-page-switch-right{display:block !important}.mip-story-page-switch-lt .mip-story-page-switch-right,.mip-story-page-switch-rt .mip-story-page-switch-left{display:none}.mip-story-hint-system{display:none;opacity:.8;background:#000}.mip-story-system-show .mip-story-hint-system{display:flex !important;display:-webkit-flex !important;display:-webkit-box}.mip-story-hint-left,.mip-story-hint-middle,.mip-story-hint-right{height:100%;-webkit-box-flex:1;-moz-box-flex:1;-webkit-flex:1 !important;flex:1 !important}.mip-story-hint-left{background:url(https://www.mipengine.org/static/img/mip-story/mip-story-arrow.png);background-repeat:no-repeat;background-position:26px;background-size:30px 30px}.mip-story-hint-middle-top{position:absolute;top:0;left:50%;width:1px;height:40%;font-size:13px;background:#ddd}.mip-story-hint-middle-icon{position:absolute;top:40%;right:0;left:0;display:flex !important;display:-webkit-flex !important;display:-webkit-box;flex-direction:column !important;height:20%;color:#fff;-webkit-align-items:center !important;align-items:center !important;-webkit-box-align:center;-moz-box-align:center;-webkit-box-orient:vertical;-webkit-box-pack:center;-moz-box-pack:center;-webkit-flex-direction:column !important;-webkit-justify-content:center !important;justify-content:center !important}.mip-story-hint-middle-icon span{display:block;margin-bottom:10px;text-align:center}.mip-story-hint-middle-bottom{position:absolute;bottom:0;left:50%;width:1px;height:40%;background:#fff}.mip-story-hint-right{background:url(https://www.mipengine.org/static/img/mip-story/mip-story-arrow.png);background-repeat:no-repeat;background-position:26px;background-size:30px 30px;-webkit-transform:rotate(180deg);transform:rotate(180deg)}.mip-story-hint-touch-icon{width:46px;height:50px;margin-top:14px;background:url(https://www.mipengine.org/static/img/mip-story/mip-story-touch.png);background-repeat:no-repeat;background-size:contain}.mip-story-hint-rotate{position:absolute;z-index:100003;top:0;left:0;width:100%;height:100%;text-align:center;color:#fff;background:#000}.mip-story-hint-rotate p{margin-top:10px}.mip-story-hint-rotate mip-img{width:47px;height:45px}@media all and (orientation:portrait){.mip-story-hint-rotate{display:none}}@media all and (orientation:landscape){.mip-story-hint{display:block !important}.mip-story-hint-rotate{display:flex !important;display:-webkit-flex !important;display:-webkit-box;flex-direction:column !important;-webkit-align-items:center !important;align-items:center !important;-webkit-box-align:center;-moz-box-align:center;-webkit-box-orient:vertical;-webkit-box-pack:center;-moz-box-pack:center;-webkit-flex-direction:column !important;-webkit-justify-content:center !important;justify-content:center !important}}.mip-story-share{position:absolute;z-index:1000010;bottom:-500%;width:100%}.mip-story-share-show{bottom:0;-webkit-transition:bottom 200ms ease;transition:bottom 200ms ease}.mip-story-share mip-share{width:100%}.mip-story-share-cancel{display:block;width:100%;height:30px;padding:10px 0;border-top:1px solid #eee;font-size:16px;text-align:center;color:#000;background:#fff}@keyframes spread{0%{transform:scale(1, 1)}100%{transform:scale(1.5, 1.5)}}@-webkit-keyframes spread{0%{transform:scale(1, 1)}100%{transform:scale(1.5, 1.5)}}.mip-story-page-switch-left{position:absolute;top:50%;left:17px;display:block;display:none}.mip-story-page-switch-right{position:absolute;top:50%;right:45px;display:block;display:none}.mip-story-page-switch-left>:first-child,.mip-story-page-switch-right>:first-child{position:absolute;top:50%;width:28px;height:28px;opacity:.1;border-radius:14px;background:#fff;background:linear-gradient(center, rgba(255,255,255,0.3), transparent);background:-webkit-linear-gradient(center, rgba(255,255,255,0.3), transparent);-webkit-animation:100ms;-webkit-animation:spread 1s ease-out;animation:spread 1s ease-out;animation-delay:100ms;-webkit-animation-fill-mode:backwards;animation-fill-mode:backwards}.mip-story-page-switch-left>:nth-child(2),.mip-story-page-switch-right>:nth-child(2){position:absolute;top:50%;display:block;width:28px;height:28px;opacity:.1;border-radius:14px;background:#fff}.recommend{margin:34px 17px 10px 17px;text-align:left}.recommend>:first-child{display:block;padding:20px 0 15px 0;border-top:1px solid rgba(255,255,255,0.3);font-size:16px;line-height:16px;color:#fff}.recommend-item{display:flex !important;display:-webkit-flex !important;display:-webkit-box;flex-direction:column !important;width:186px;height:277px;margin-right:8px;text-align:center;word-wrap:break-word;word-break:break-word;-webkit-box-orient:vertical;-webkit-box-pack:end;-webkit-flex-direction:column !important;-webkit-justify-content:flex-end !important;justify-content:flex-end !important}.recommend-item>span{display:-webkit-box;overflow:hidden;padding:0 2px;text-overflow:ellipsis;color:#fff;-webkit-box-orient:vertical;-webkit-line-clamp:2}.recommend-item>:first-child{font-size:16px}.recommend-item>:nth-child(2){margin-top:13px;margin-bottom:10px;font-size:13px;line-height:13px}");
      }
      if (window.MIP) {
        require(["mip-story"], function (component) {
          registerComponent(window.MIP, component);
        });
      }
      else {
        require(["mip", "mip-story"], registerComponent);
      }
    })();

  }
});