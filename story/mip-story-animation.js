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
    // mip-story/jsmpeg/jsmpeg.js
    // ======================


    ;
    /*!src/jsmpeg.js*/
    /*! jsmpeg v1.0 | (c) Dominic Szablewski | MIT license */
    // This sets up the JSMpeg "Namespace". The object is empty apart from the Now()
    // utility function and the automatic CreateVideoElements() after DOMReady.
    define('mip-story/jsmpeg/jsmpeg', ['require'], function (require) {
      var JSMpeg = {
        // The Player sets up the connections between source, demuxer, decoders,
        // renderer and audio output. It ties everything together, is responsible
        // of scheduling decoding and provides some convenience methods for
        // external users.
        Player: null,
        // A Video Element wraps the Player, shows HTML controls to start/pause
        // the video and handles Audio unlocking on iOS. VideoElements can be
        // created directly in HTML using the <div class="jsmpeg"/> tag.
        VideoElement: null,
        // The BitBuffer wraps a Uint8Array and allows reading an arbitrary number
        // of bits at a time. On writing, the BitBuffer either expands its
        // internal buffer (for static files) or deletes old data (for streaming).
        BitBuffer: null,
        // A Source provides raw data from HTTP, a WebSocket connection or any
        // other mean. Sources must support the following API:
        //   .connect(destinationNode)
        //   .write(buffer)
        //   .start() - start reading
        //   .resume(headroom) - continue reading; headroom to play pos in seconds
        //   .established - boolean, true after connection is established
        //   .completed - boolean, true if the source is completely loaded
        //   .progress - float 0-1
        Source: {},
        // A Demuxer may sit between a Source and a Decoder. It separates the
        // incoming raw data into Video, Audio and other Streams. API:
        //   .connect(streamId, destinationNode)
        //   .write(buffer)
        //   .currentTime – float, in seconds
        //   .startTime - float, in seconds
        Demuxer: {},
        // A Decoder accepts an incoming Stream of raw Audio or Video data, buffers
        // it and upon `.decode()` decodes a single frame of data. Video decoders
        // call `destinationNode.render(Y, Cr, CB)` with the decoded pixel data;
        // Audio decoders call `destinationNode.play(left, right)` with the decoded
        // PCM data. API:
        //   .connect(destinationNode)
        //   .write(pts, buffer)
        //   .decode()
        //   .seek(time)
        //   .currentTime - float, in seconds
        //   .startTime - float, in seconds
        Decoder: {},
        // A Renderer accepts raw YCrCb data in 3 separate buffers via the render()
        // method. Renderers typically convert the data into the RGBA color space
        // and draw it on a Canvas, but other output - such as writing PNGs - would
        // be conceivable. API:
        //   .render(y, cr, cb) - pixel data as Uint8Arrays
        //   .enabled - wether the renderer does anything upon receiving data
        Renderer: {},
        // Audio Outputs accept raw Stero PCM data in 2 separate buffers via the
        // play() method. Outputs typically play the audio on the user's device.
        // API:
        //   .play(sampleRate, left, right) - rate in herz; PCM data as Uint8Arrays
        //   .stop()
        //   .enqueuedTime - float, in seconds
        //   .enabled - wether the output does anything upon receiving data
        AudioOutput: {},
        Now: function () {
          return window.performance ? window.performance.now() / 1000 : Date.now() / 1000;
        },
        CreateVideoElements: function () {
          var elements = document.querySelectorAll('.jsmpeg');
          for (var i = 0; i < elements.length; i++) {
            new JSMpeg.VideoElement(elements[i]);
          }
        },
        Fill: function (array, value) {
          if (array.fill) {
            array.fill(value);
          } else {
            for (var i = 0; i < array.length; i++) {
              array[i] = value;
            }
          }
        }
      };
      // Automatically create players for all found <div class="jsmpeg"/> elements.
      ;
      /*!src/video-element.js*/
      ;
      /*!src/player.js*/
      JSMpeg.Player = function () {
        'use strict';
        var Player = function (url, options) {
          this.options = options || {};
          if (options.source) {
            this.source = new options.source(url, options);
            options.streaming = !!this.source.streaming;
          } else if (url.match(/^wss?:\/\//)) {
            this.source = new JSMpeg.Source.WebSocket(url, options);
            options.streaming = true;
          }    // else if (options.progressive !== false) {
          //  this.source = new JSMpeg.Source.AjaxProgressive(url, options);
          //  options.streaming = false;
          // }
          else {
            this.source = new JSMpeg.Source.Ajax(url, options);
            options.streaming = false;
          }
          this.maxAudioLag = options.maxAudioLag || 0.25;
          this.loop = options.loop !== false;
          this.autoplay = !!options.autoplay || options.streaming;
          this.demuxer = new JSMpeg.Demuxer.TS(options);
          this.source.connect(this.demuxer);
          if (options.video !== false) {
            this.video = new JSMpeg.Decoder.MPEG1Video(options);
            this.renderer = !options.disableGl && JSMpeg.Renderer.WebGL.IsSupported() ? new JSMpeg.Renderer.WebGL(options) : new JSMpeg.Renderer.Canvas2D(options);
            this.demuxer.connect(JSMpeg.Demuxer.TS.STREAM.VIDEO_1, this.video);
            this.video.connect(this.renderer);
          }
          if (options.audio !== false && JSMpeg.AudioOutput.WebAudio.IsSupported()) {
            this.audio = new JSMpeg.Decoder.MP2Audio(options);
            this.audioOut = new JSMpeg.AudioOutput.WebAudio(options);
            this.demuxer.connect(JSMpeg.Demuxer.TS.STREAM.AUDIO_1, this.audio);
            this.audio.connect(this.audioOut);
          }
          Object.defineProperty(this, 'currentTime', {
            get: this.getCurrentTime,
            set: this.setCurrentTime
          });
          Object.defineProperty(this, 'volume', {
            get: this.getVolume,
            set: this.setVolume
          });
          this.unpauseOnShow = false;
          if (options.pauseWhenHidden !== false) {
            document.addEventListener('visibilitychange', this.showHide.bind(this));
          }
          this.source.start();
          if (this.autoplay) {
            this.play();
          }
        };
        Player.prototype.showHide = function (ev) {
          if (document.visibilityState === 'hidden') {
            this.unpauseOnShow = this.wantsToPlay;
            this.pause();
          } else if (this.unpauseOnShow) {
            this.play();
          }
        };
        Player.prototype.on = function (eventName, callback) {
          this.options.canvas.addEventListener(eventName, callback, false);
        };
        Player.prototype.off = function (eventName) {
          this.options.canvas.removeEventListener(eventName);
        };
        Player.prototype.trigger = function (eventName) {
          var event = new Event(eventName);
          this.options.canvas.dispatchEvent(event);
        };
        Player.prototype.play = function (ev) {
          this.animationId = requestAnimationFrame(this.update.bind(this));
          this.wantsToPlay = true;
          this.playingSign = false;
          this.trigger('play');
        };
        Player.prototype.pause = function (ev) {
          cancelAnimationFrame(this.animationId);
          this.wantsToPlay = false;
          this.isPlaying = false;
          this.playingSign = false;
          if (this.audio && this.audio.canPlay) {
            // Seek to the currentTime again - audio may already be enqueued a bit
            // further, so we have to rewind it.
            this.audioOut.stop();
            this.seek(this.currentTime);
          }
        };
        Player.prototype.getVolume = function () {
          return this.audioOut ? this.audioOut.volume : 0;
        };
        Player.prototype.setVolume = function (volume) {
          if (this.audioOut) {
            this.audioOut.volume = volume;
          }
        };
        Player.prototype.stop = function (ev) {
          this.pause();
          this.seek(0);
          if (this.video && this.options.decodeFirstFrame !== false) {
            this.video.decode();
          }
        };
        Player.prototype.destroy = function () {
          this.pause();
          this.source.destroy();
          this.renderer.destroy();
          this.audioOut.destroy();
        };
        Player.prototype.seek = function (time) {
          var startOffset = this.audio && this.audio.canPlay ? this.audio.startTime : this.video.startTime;
          if (this.video) {
            this.video.seek(time + startOffset);
          }
          if (this.audio) {
            this.audio.seek(time + startOffset);
          }
          this.startTime = JSMpeg.Now() - time;
        };
        Player.prototype.getCurrentTime = function () {
          return this.audio && this.audio.canPlay ? this.audio.currentTime - this.audio.startTime : this.video.currentTime - this.video.startTime;
        };
        Player.prototype.setCurrentTime = function (time) {
          this.seek(time);
        };
        Player.prototype.update = function () {
          this.animationId = requestAnimationFrame(this.update.bind(this));
          if (!this.source.established) {
            if (this.renderer) {
              this.renderer.renderProgress(this.source.progress);
            }
            return;
          }
          if (!this.isPlaying) {
            this.isPlaying = true;
            this.startTime = JSMpeg.Now() - this.currentTime;
          }
          if (this.options.streaming) {
            this.updateForStreaming();
          } else {
            this.updateForStaticFile();
            if (this.options.playingCallBack) {
              this.options.playingCallBack(this.currentTime);
            }
          }
        };
        Player.prototype.updateForStreaming = function () {
          // When streaming, immediately decode everything we have buffered up until
          // now to minimize playback latency.
          if (this.video) {
            this.video.decode();
          }
          if (this.audio) {
            var decoded = false;
            do {
              // If there's a lot of audio enqueued already, disable output and
              // catch up with the encoding.
              if (this.audioOut.enqueuedTime > this.maxAudioLag) {
                this.audioOut.resetEnqueuedTime();
                this.audioOut.enabled = false;
              }
              decoded = this.audio.decode();
            } while (decoded);
            this.audioOut.enabled = true;
          }
        };
        Player.prototype.updateForStaticFile = function () {
          var notEnoughData = false, headroom = 0;
          if (this.video.currentTime > 0) {
            if (!this.playingSign) {
              this.playingSign = true;
              this.trigger('playing');
            }
          }
          // If we have an audio track, we always try to sync the video to the audio.
          // Gaps and discontinuities are far more percetable in audio than in video.
          if (this.audio && this.audio.canPlay) {
            // Do we have to decode and enqueue some more audio data?
            while (!notEnoughData && this.audio.decodedTime - this.audio.currentTime < 0.25) {
              notEnoughData = !this.audio.decode();
            }
            // Sync video to audio
            if (this.video && this.video.currentTime < this.audio.currentTime) {
              notEnoughData = !this.video.decode();
            }
            headroom = this.demuxer.currentTime - this.audio.currentTime;
          } else if (this.video) {
            // Video only - sync it to player's wallclock
            var targetTime = JSMpeg.Now() - this.startTime + this.video.startTime, lateTime = targetTime - this.video.currentTime, frameTime = 1 / this.video.frameRate;
            if (this.video && lateTime > 0) {
              // If the video is too far behind (>2 frames), simply reset the
              // target time to the next frame instead of trying to catch up.
              if (lateTime > frameTime * 2) {
                this.startTime += lateTime;
              }
              notEnoughData = !this.video.decode();
            }
            headroom = this.demuxer.currentTime - targetTime;
          }
          // Notify the source of the playhead headroom, so it can decide whether to
          // continue loading further data.
          this.source.resume(headroom);
          // If we failed to decode and the source is complete, it means we reached
          // the end of our data. We may want to loop.
          if (notEnoughData && this.source.completed) {
            if (this.loop) {
              this.seek(0);
            } else {
              this.pause();
            }
            //视频播放完成执行 by karlew
            this.trigger('end');
          }
        };
        return Player;
      }();
      ;
      /*!src/buffer.js*/
      JSMpeg.BitBuffer = function () {
        'use strict';
        var BitBuffer = function (bufferOrLength, mode) {
          if (typeof bufferOrLength === 'object') {
            this.bytes = bufferOrLength instanceof Uint8Array ? bufferOrLength : new Uint8Array(bufferOrLength);
            this.byteLength = this.bytes.length;
          } else {
            this.bytes = new Uint8Array(bufferOrLength || 1024 * 1024);
            this.byteLength = 0;
          }
          this.mode = mode || BitBuffer.MODE.EXPAND;
          this.index = 0;
        };
        BitBuffer.prototype.resize = function (size) {
          var newBytes = new Uint8Array(size);
          if (this.byteLength !== 0) {
            this.byteLength = Math.min(this.byteLength, size);
            newBytes.set(this.bytes, 0, this.byteLength);
          }
          this.bytes = newBytes;
          this.index = Math.min(this.index, this.byteLength << 3);
        };
        BitBuffer.prototype.evict = function (sizeNeeded) {
          var bytePos = this.index >> 3, available = this.bytes.length - this.byteLength;
          // If the current index is the write position, we can simply reset both
          // to 0. Also reset (and throw away yet unread data) if we won't be able
          // to fit the new data in even after a normal eviction.
          if (this.index === this.byteLength << 3 || sizeNeeded > available + bytePos    // emergency evac
          ) {
            this.byteLength = 0;
            this.index = 0;
            return;
          } else if (bytePos === 0) {
            // Nothing read yet - we can't evict anything
            return;
          }
          // Some browsers don't support copyWithin() yet - we may have to do 
          // it manually using set and a subarray
          if (this.bytes.copyWithin) {
            this.bytes.copyWithin(0, bytePos, this.byteLength);
          } else {
            this.bytes.set(this.bytes.subarray(bytePos, this.byteLength));
          }
          this.byteLength = this.byteLength - bytePos;
          this.index -= bytePos << 3;
          return;
        };
        BitBuffer.prototype.write = function (buffers) {
          var isArrayOfBuffers = typeof buffers[0] === 'object', totalLength = 0, available = this.bytes.length - this.byteLength;
          // Calculate total byte length
          if (isArrayOfBuffers) {
            var totalLength = 0;
            for (var i = 0; i < buffers.length; i++) {
              totalLength += buffers[i].byteLength;
            }
          } else {
            totalLength = buffers.byteLength;
          }
          // Do we need to resize or evict?
          if (totalLength > available) {
            if (this.mode === BitBuffer.MODE.EXPAND) {
              var newSize = Math.max(this.bytes.length * 2, totalLength - available);
              this.resize(newSize);
            } else {
              this.evict(totalLength);
            }
          }
          if (isArrayOfBuffers) {
            for (var i = 0; i < buffers.length; i++) {
              this.appendSingleBuffer(buffers[i]);
            }
          } else {
            this.appendSingleBuffer(buffers);
          }
        };
        BitBuffer.prototype.appendSingleBuffer = function (buffer) {
          buffer = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
          this.bytes.set(buffer, this.byteLength);
          this.byteLength += buffer.length;
        };
        BitBuffer.prototype.findNextStartCode = function () {
          for (var i = this.index + 7 >> 3; i < this.byteLength; i++) {
            if (this.bytes[i] == 0 && this.bytes[i + 1] == 0 && this.bytes[i + 2] == 1) {
              this.index = i + 4 << 3;
              return this.bytes[i + 3];
            }
          }
          this.index = this.byteLength << 3;
          return -1;
        };
        BitBuffer.prototype.findStartCode = function (code) {
          var current = 0;
          while (true) {
            current = this.findNextStartCode();
            if (current === code || current === -1) {
              return current;
            }
          }
          return -1;
        };
        BitBuffer.prototype.nextBytesAreStartCode = function () {
          var i = this.index + 7 >> 3;
          return i >= this.byteLength || this.bytes[i] == 0 && this.bytes[i + 1] == 0 && this.bytes[i + 2] == 1;
        };
        BitBuffer.prototype.peek = function (count) {
          var offset = this.index;
          var value = 0;
          while (count) {
            var currentByte = this.bytes[offset >> 3], remaining = 8 - (offset & 7),
              // remaining bits in byte
              read = remaining < count ? remaining : count,
              // bits in this run
              shift = remaining - read, mask = 255 >> 8 - read;
            value = value << read | (currentByte & mask << shift) >> shift;
            offset += read;
            count -= read;
          }
          return value;
        };
        BitBuffer.prototype.read = function (count) {
          var value = this.peek(count);
          this.index += count;
          return value;
        };
        BitBuffer.prototype.skip = function (count) {
          return this.index += count;
        };
        BitBuffer.prototype.rewind = function (count) {
          this.index = Math.max(this.index - count, 0);
        };
        BitBuffer.prototype.has = function (count) {
          return (this.byteLength << 3) - this.index >= count;
        };
        BitBuffer.MODE = {
          EVICT: 1,
          EXPAND: 2
        };
        return BitBuffer;
      }();
      ;
      /*!src/ajax.js*/
      JSMpeg.Source.Ajax = function () {
        'use strict';
        var AjaxSource = function (url, options) {
          this.url = url;
          this.destination = null;
          this.request = null;
          this.completed = false;
          this.established = false;
          this.progress = 0;
        };
        AjaxSource.prototype.connect = function (destination) {
          this.destination = destination;
        };
        AjaxSource.prototype.start = function () {
          this.request = new XMLHttpRequest();
          this.request.onreadystatechange = function () {
            if (this.request.readyState === this.request.DONE && this.request.status === 200) {
              this.onLoad(this.request.response);
            }
          }.bind(this);
          this.request.onprogress = this.onProgress.bind(this);
          this.request.open('GET', this.url);
          this.request.responseType = 'arraybuffer';
          this.request.send();
        };
        AjaxSource.prototype.resume = function (secondsHeadroom) {
        };
        AjaxSource.prototype.destroy = function () {
          this.request.abort();
        };
        AjaxSource.prototype.onProgress = function (ev) {
          this.progress = ev.loaded / ev.total;
        };
        AjaxSource.prototype.onLoad = function (data) {
          this.established = true;
          this.completed = true;
          this.progress = 1;
          if (this.destination) {
            this.destination.write(data);
          }
        };
        return AjaxSource;
      }();
      ;
      /*!src/ajax-progressive.js*/
      JSMpeg.Source.AjaxProgressive = function () {
        'use strict';
        var AjaxProgressiveSource = function (url, options) {
          this.url = url;
          this.destination = null;
          this.request = null;
          this.completed = false;
          this.established = false;
          this.progress = 0;
          this.fileSize = 0;
          this.loadedSize = 0;
          this.chunkSize = options.chunkSize || 1024 * 1024;
          this.isLoading = false;
          this.loadStartTime = 0;
          this.throttled = options.throttled !== false;
          this.aborted = false;
        };
        AjaxProgressiveSource.prototype.connect = function (destination) {
          this.destination = destination;
        };
        AjaxProgressiveSource.prototype.start = function () {
          this.request = new XMLHttpRequest();
          this.request.onreadystatechange = function () {
            if (this.request.readyState === this.request.DONE) {
              this.fileSize = parseInt(this.request.getResponseHeader('Content-Length'));
              this.loadNextChunk();
            }
          }.bind(this);
          this.request.onprogress = this.onProgress.bind(this);
          this.request.open('HEAD', this.url);
          this.request.send();
        };
        AjaxProgressiveSource.prototype.resume = function (secondsHeadroom) {
          if (this.isLoading || !this.throttled) {
            return;
          }
          // Guess the worst case loading time with lots of safety margin. This is
          // somewhat arbitrary...
          var worstCaseLoadingTime = this.loadTime * 8 + 2;
          if (worstCaseLoadingTime > secondsHeadroom) {
            this.loadNextChunk();
          }
        };
        AjaxProgressiveSource.prototype.destroy = function () {
          this.request.abort();
          this.aborted = true;
        };
        AjaxProgressiveSource.prototype.loadNextChunk = function () {
          var start = this.loadedSize, end = Math.min(this.loadedSize + this.chunkSize - 1, this.fileSize - 1);
          if (start >= this.fileSize || this.aborted) {
            this.completed = true;
            return;
          }
          this.isLoading = true;
          this.loadStartTime = JSMpeg.Now();
          this.request = new XMLHttpRequest();
          this.request.onreadystatechange = function () {
            if (this.request.readyState === this.request.DONE && this.request.status >= 200 && this.request.status < 300) {
              this.onChunkLoad(this.request.response);
            } else if (this.request.readyState === this.request.DONE) {
              // Retry?
              if (this.loadFails++ < 3) {
                this.loadNextChunk();
              }
            }
          }.bind(this);
          if (start === 0) {
            this.request.onprogress = this.onProgress.bind(this);
          }
          this.request.open('GET', this.url + '?' + start + '-' + end);
          this.request.setRequestHeader('Range', 'bytes=' + start + '-' + end);
          this.request.responseType = 'arraybuffer';
          this.request.send();
        };
        AjaxProgressiveSource.prototype.onProgress = function (ev) {
          this.progress = ev.loaded / ev.total;
        };
        AjaxProgressiveSource.prototype.onChunkLoad = function (data) {
          this.established = true;
          this.progress = 1;
          this.loadedSize += data.byteLength;
          this.loadFails = 0;
          this.isLoading = false;
          if (this.destination) {
            this.destination.write(data);
          }
          this.loadTime = JSMpeg.Now() - this.loadStartTime;
          if (!this.throttled) {
            this.loadNextChunk();
          }
        };
        return AjaxProgressiveSource;
      }();
      ;
      /*!src/websocket.js*/
      JSMpeg.Source.WebSocket = function () {
        'use strict';
        var WSSource = function (url, options) {
          this.url = url;
          this.options = options;
          this.socket = null;
          this.callbacks = {
            connect: [],
            data: []
          };
          this.destination = null;
          this.reconnectInterval = options.reconnectInterval !== undefined ? options.reconnectInterval : 5;
          this.shouldAttemptReconnect = !!this.reconnectInterval;
          this.completed = false;
          this.established = false;
          this.progress = 0;
          this.reconnectTimeoutId = 0;
        };
        WSSource.prototype.connect = function (destination) {
          this.destination = destination;
        };
        WSSource.prototype.destroy = function () {
          clearTimeout(this.reconnectTimeoutId);
          this.shouldAttemptReconnect = false;
          this.socket.close();
        };
        WSSource.prototype.start = function () {
          this.shouldAttemptReconnect = !!this.reconnectInterval;
          this.progress = 0;
          this.established = false;
          this.socket = new WebSocket(this.url, this.options.protocols || null);
          this.socket.binaryType = 'arraybuffer';
          this.socket.onmessage = this.onMessage.bind(this);
          this.socket.onopen = this.onOpen.bind(this);
          this.socket.onerror = this.onClose.bind(this);
          this.socket.onclose = this.onClose.bind(this);
        };
        WSSource.prototype.resume = function (secondsHeadroom) {
        };
        WSSource.prototype.onOpen = function () {
          this.progress = 1;
          this.established = true;
        };
        WSSource.prototype.onClose = function () {
          if (this.shouldAttemptReconnect) {
            clearTimeout(this.reconnectTimeoutId);
            this.reconnectTimeoutId = setTimeout(function () {
              this.start();
            }.bind(this), this.reconnectInterval * 1000);
          }
        };
        WSSource.prototype.onMessage = function (ev) {
          if (this.destination) {
            this.destination.write(ev.data);
          }
        };
        return WSSource;
      }();
      ;
      /*!src/ts.js*/
      JSMpeg.Demuxer.TS = function () {
        'use strict';
        var TS = function (options) {
          this.bits = null;
          this.leftoverBytes = null;
          this.guessVideoFrameEnd = true;
          this.pidsToStreamIds = {};
          this.pesPacketInfo = {};
          this.startTime = 0;
          this.currentTime = 0;
        };
        TS.prototype.connect = function (streamId, destination) {
          this.pesPacketInfo[streamId] = {
            destination: destination,
            currentLength: 0,
            totalLength: 0,
            pts: 0,
            buffers: []
          };
        };
        TS.prototype.write = function (buffer) {
          if (this.leftoverBytes) {
            var totalLength = buffer.byteLength + this.leftoverBytes.byteLength;
            this.bits = new JSMpeg.BitBuffer(totalLength);
            this.bits.write([
              this.leftoverBytes,
              buffer
            ]);
          } else {
            this.bits = new JSMpeg.BitBuffer(buffer);
          }
          while (this.bits.has(188 << 3) && this.parsePacket()) {
          }
          var leftoverCount = this.bits.byteLength - (this.bits.index >> 3);
          this.leftoverBytes = leftoverCount > 0 ? this.bits.bytes.subarray(this.bits.index >> 3) : null;
        };
        TS.prototype.parsePacket = function () {
          // Check if we're in sync with packet boundaries; attempt to resync if not.
          if (this.bits.read(8) !== 71) {
            if (!this.resync()) {
              // Couldn't resync; maybe next time...
              return false;
            }
          }
          var end = (this.bits.index >> 3) + 187;
          var transportError = this.bits.read(1), payloadStart = this.bits.read(1), transportPriority = this.bits.read(1), pid = this.bits.read(13), transportScrambling = this.bits.read(2), adaptationField = this.bits.read(2), continuityCounter = this.bits.read(4);
          // If this is the start of a new payload; signal the end of the previous
          // frame, if we didn't do so already.
          var streamId = this.pidsToStreamIds[pid];
          if (payloadStart && streamId) {
            var pi = this.pesPacketInfo[streamId];
            if (pi && pi.currentLength) {
              this.packetComplete(pi);
            }
          }
          // Extract current payload
          if (adaptationField & 1) {
            if (adaptationField & 2) {
              var adaptationFieldLength = this.bits.read(8);
              this.bits.skip(adaptationFieldLength << 3);
            }
            if (payloadStart && this.bits.nextBytesAreStartCode()) {
              this.bits.skip(24);
              streamId = this.bits.read(8);
              this.pidsToStreamIds[pid] = streamId;
              var packetLength = this.bits.read(16);
              this.bits.skip(8);
              var ptsDtsFlag = this.bits.read(2);
              this.bits.skip(6);
              var headerLength = this.bits.read(8);
              var payloadBeginIndex = this.bits.index + (headerLength << 3);
              var pi = this.pesPacketInfo[streamId];
              if (pi) {
                var pts = 0;
                if (ptsDtsFlag & 2) {
                  // The Presentation Timestamp is encoded as 33(!) bit
                  // integer, but has a "marker bit" inserted at weird places
                  // in between, making the whole thing 5 bytes in size.
                  // You can't make this shit up...
                  this.bits.skip(4);
                  var p32_30 = this.bits.read(3);
                  this.bits.skip(1);
                  var p29_15 = this.bits.read(15);
                  this.bits.skip(1);
                  var p14_0 = this.bits.read(15);
                  this.bits.skip(1);
                  // Can't use bit shifts here; we need 33 bits of precision,
                  // so we're using JavaScript's double number type. Also
                  // divide by the 90khz clock to get the pts in seconds.
                  pts = (p32_30 * 1073741824 + p29_15 * 32768 + p14_0) / 90000;
                  this.currentTime = pts;
                  if (this.startTime === -1) {
                    this.startTime = pts;
                  }
                }
                var payloadLength = packetLength ? packetLength - headerLength - 3 : 0;
                this.packetStart(pi, pts, payloadLength);
              }
              // Skip the rest of the header without parsing it
              this.bits.index = payloadBeginIndex;
            }
            if (streamId) {
              // Attempt to detect if the PES packet is complete. For Audio (and
              // other) packets, we received a total packet length with the PES 
              // header, so we can check the current length.
              // For Video packets, we have to guess the end by detecting if this
              // TS packet was padded - there's no good reason to pad a TS packet 
              // in between, but it might just fit exactly. If this fails, we can
              // only wait for the next PES header for that stream.
              var pi = this.pesPacketInfo[streamId];
              if (pi) {
                var start = this.bits.index >> 3;
                var complete = this.packetAddData(pi, start, end);
                var hasPadding = !payloadStart && adaptationField & 2;
                if (complete || this.guessVideoFrameEnd && hasPadding) {
                  this.packetComplete(pi);
                }
              }
            }
          }
          this.bits.index = end << 3;
          return true;
        };
        TS.prototype.resync = function () {
          // Check if we have enough data to attempt a resync. We need 5 full packets.
          if (!this.bits.has(188 * 6 << 3)) {
            return false;
          }
          var byteIndex = this.bits.index >> 3;
          // Look for the first sync token in the first 187 bytes
          for (var i = 0; i < 187; i++) {
            if (this.bits.bytes[byteIndex + i] === 71) {
              // Look for 4 more sync tokens, each 188 bytes appart
              var foundSync = true;
              for (var j = 1; j < 5; j++) {
                if (this.bits.bytes[byteIndex + i + 188 * j] !== 71) {
                  foundSync = false;
                  break;
                }
              }
              if (foundSync) {
                this.bits.index = byteIndex + i + 1 << 3;
                return true;
              }
            }
          }
          // In theory, we shouldn't arrive here. If we do, we had enough data but
          // still didn't find sync - this can only happen if we were fed garbage
          // data. Check your source!
          console.warn('JSMpeg: Possible garbage data. Skipping.');
          this.bits.skip(187 << 3);
          return false;
        };
        TS.prototype.packetStart = function (pi, pts, payloadLength) {
          pi.totalLength = payloadLength;
          pi.currentLength = 0;
          pi.pts = pts;
        };
        TS.prototype.packetAddData = function (pi, start, end) {
          pi.buffers.push(this.bits.bytes.subarray(start, end));
          pi.currentLength += end - start;
          var complete = pi.totalLength !== 0 && pi.currentLength >= pi.totalLength;
          return complete;
        };
        TS.prototype.packetComplete = function (pi) {
          pi.destination.write(pi.pts, pi.buffers);
          pi.totalLength = 0;
          pi.currentLength = 0;
          pi.buffers = [];
        };
        TS.STREAM = {
          PACK_HEADER: 186,
          SYSTEM_HEADER: 187,
          PROGRAM_MAP: 188,
          PRIVATE_1: 189,
          PADDING: 190,
          PRIVATE_2: 191,
          AUDIO_1: 192,
          VIDEO_1: 224,
          DIRECTORY: 255
        };
        return TS;
      }();
      ;
      /*!src/decoder.js*/
      JSMpeg.Decoder.Base = function () {
        'use strict';
        var BaseDecoder = function (options) {
          this.destination = null;
          this.canPlay = false;
          this.collectTimestamps = !options.streaming;
          this.timestamps = [];
          this.timestampIndex = 0;
          this.startTime = 0;
          this.decodedTime = 0;
          Object.defineProperty(this, 'currentTime', { get: this.getCurrentTime });
        };
        BaseDecoder.prototype.connect = function (destination) {
          this.destination = destination;
        };
        BaseDecoder.prototype.write = function (pts, buffers) {
          if (this.collectTimestamps) {
            if (this.timestamps.length === 0) {
              this.startTime = pts;
              this.decodedTime = pts;
            }
            this.timestamps.push({
              index: this.bits.byteLength << 3,
              time: pts
            });
          }
          this.bits.write(buffers);
          this.canPlay = true;
        };
        BaseDecoder.prototype.seek = function (time) {
          if (!this.collectTimestamps) {
            return;
          }
          this.timestampIndex = 0;
          for (var i = 0; i < this.timestamps.length; i++) {
            if (this.timestamps[i].time > time) {
              break;
            }
            this.timestampIndex = i;
          }
          var ts = this.timestamps[this.timestampIndex];
          if (ts) {
            this.bits.index = ts.index;
            this.decodedTime = ts.time;
          } else {
            this.bits.index = 0;
            this.decodedTime = this.startTime;
          }
        };
        BaseDecoder.prototype.decode = function () {
          this.advanceDecodedTime(0);
        };
        BaseDecoder.prototype.advanceDecodedTime = function (seconds) {
          if (this.collectTimestamps) {
            var newTimestampIndex = -1;
            for (var i = this.timestampIndex; i < this.timestamps.length; i++) {
              if (this.timestamps[i].index > this.bits.index) {
                break;
              }
              newTimestampIndex = i;
            }
            // Did we find a new PTS, different from the last? If so, we don't have
            // to advance the decoded time manually and can instead sync it exactly
            // to the PTS.
            if (newTimestampIndex !== -1 && newTimestampIndex !== this.timestampIndex) {
              this.timestampIndex = newTimestampIndex;
              this.decodedTime = this.timestamps[this.timestampIndex].time;
              return;
            }
          }
          this.decodedTime += seconds;
        };
        BaseDecoder.prototype.getCurrentTime = function () {
          return this.decodedTime;
        };
        return BaseDecoder;
      }();
      ;
      /*!src/mpeg1.js*/
      JSMpeg.Decoder.MPEG1Video = function () {
        'use strict';
        // Inspired by Java MPEG-1 Video Decoder and Player by Zoltan Korandi 
        // https://sourceforge.net/projects/javampeg1video/
        var MPEG1 = function (options) {
          JSMpeg.Decoder.Base.call(this, options);
          var bufferSize = options.videoBufferSize || 512 * 1024;
          var bufferMode = options.streaming ? JSMpeg.BitBuffer.MODE.EVICT : JSMpeg.BitBuffer.MODE.EXPAND;
          this.bits = new JSMpeg.BitBuffer(bufferSize, bufferMode);
          this.customIntraQuantMatrix = new Uint8Array(64);
          this.customNonIntraQuantMatrix = new Uint8Array(64);
          this.blockData = new Int32Array(64);
          this.currentFrame = 0;
          this.decodeFirstFrame = options.decodeFirstFrame !== false;
        };
        MPEG1.prototype = Object.create(JSMpeg.Decoder.Base.prototype);
        MPEG1.prototype.constructor = MPEG1;
        MPEG1.prototype.write = function (pts, buffers) {
          JSMpeg.Decoder.Base.prototype.write.call(this, pts, buffers);
          if (!this.hasSequenceHeader) {
            if (this.bits.findStartCode(MPEG1.START.SEQUENCE) === -1) {
              return false;
            }
            this.decodeSequenceHeader();
            if (this.decodeFirstFrame) {
              this.decode();
            }
          }
        };
        MPEG1.prototype.decode = function () {
          if (!this.hasSequenceHeader) {
            return false;
          }
          if (this.bits.findStartCode(MPEG1.START.PICTURE) === -1) {
            var bufferedBytes = this.bits.byteLength - (this.bits.index >> 3);
            return false;
          }
          this.decodePicture();
          this.advanceDecodedTime(1 / this.frameRate);
          return true;
        };
        MPEG1.prototype.readHuffman = function (codeTable) {
          var state = 0;
          do {
            state = codeTable[state + this.bits.read(1)];
          } while (state >= 0 && codeTable[state] !== 0);
          return codeTable[state + 2];
        };
        // Sequence Layer
        MPEG1.prototype.frameRate = 30;
        MPEG1.prototype.decodeSequenceHeader = function () {
          var newWidth = this.bits.read(12), newHeight = this.bits.read(12);
          // skip pixel aspect ratio
          this.bits.skip(4);
          this.frameRate = MPEG1.PICTURE_RATE[this.bits.read(4)];
          // skip bitRate, marker, bufferSize and constrained bit
          this.bits.skip(18 + 1 + 10 + 1);
          if (newWidth !== this.width || newHeight !== this.height) {
            this.width = newWidth;
            this.height = newHeight;
            this.initBuffers();
            if (this.destination) {
              this.destination.resize(newWidth, newHeight);
            }
          }
          if (this.bits.read(1)) {
            // load custom intra quant matrix?
            for (var i = 0; i < 64; i++) {
              this.customIntraQuantMatrix[MPEG1.ZIG_ZAG[i]] = this.bits.read(8);
            }
            this.intraQuantMatrix = this.customIntraQuantMatrix;
          }
          if (this.bits.read(1)) {
            // load custom non intra quant matrix?
            for (var i = 0; i < 64; i++) {
              var idx = MPEG1.ZIG_ZAG[i];
              this.customNonIntraQuantMatrix[idx] = this.bits.read(8);
            }
            this.nonIntraQuantMatrix = this.customNonIntraQuantMatrix;
          }
          this.hasSequenceHeader = true;
        };
        MPEG1.prototype.initBuffers = function () {
          this.intraQuantMatrix = MPEG1.DEFAULT_INTRA_QUANT_MATRIX;
          this.nonIntraQuantMatrix = MPEG1.DEFAULT_NON_INTRA_QUANT_MATRIX;
          this.mbWidth = this.width + 15 >> 4;
          this.mbHeight = this.height + 15 >> 4;
          this.mbSize = this.mbWidth * this.mbHeight;
          this.codedWidth = this.mbWidth << 4;
          this.codedHeight = this.mbHeight << 4;
          this.codedSize = this.codedWidth * this.codedHeight;
          this.halfWidth = this.mbWidth << 3;
          this.halfHeight = this.mbHeight << 3;
          // Allocated buffers and resize the canvas
          this.currentY = new Uint8ClampedArray(this.codedSize);
          this.currentY32 = new Uint32Array(this.currentY.buffer);
          this.currentCr = new Uint8ClampedArray(this.codedSize >> 2);
          this.currentCr32 = new Uint32Array(this.currentCr.buffer);
          this.currentCb = new Uint8ClampedArray(this.codedSize >> 2);
          this.currentCb32 = new Uint32Array(this.currentCb.buffer);
          this.forwardY = new Uint8ClampedArray(this.codedSize);
          this.forwardY32 = new Uint32Array(this.forwardY.buffer);
          this.forwardCr = new Uint8ClampedArray(this.codedSize >> 2);
          this.forwardCr32 = new Uint32Array(this.forwardCr.buffer);
          this.forwardCb = new Uint8ClampedArray(this.codedSize >> 2);
          this.forwardCb32 = new Uint32Array(this.forwardCb.buffer);
        };
        // Picture Layer
        MPEG1.prototype.currentY = null;
        MPEG1.prototype.currentCr = null;
        MPEG1.prototype.currentCb = null;
        MPEG1.prototype.pictureType = 0;
        // Buffers for motion compensation
        MPEG1.prototype.forwardY = null;
        MPEG1.prototype.forwardCr = null;
        MPEG1.prototype.forwardCb = null;
        MPEG1.prototype.fullPelForward = false;
        MPEG1.prototype.forwardFCode = 0;
        MPEG1.prototype.forwardRSize = 0;
        MPEG1.prototype.forwardF = 0;
        MPEG1.prototype.decodePicture = function (skipOutput) {
          this.currentFrame++;
          this.bits.skip(10);
          // skip temporalReference
          this.pictureType = this.bits.read(3);
          this.bits.skip(16);
          // skip vbv_delay
          // Skip B and D frames or unknown coding type
          if (this.pictureType <= 0 || this.pictureType >= MPEG1.PICTURE_TYPE.B) {
            return;
          }
          // full_pel_forward, forward_f_code
          if (this.pictureType === MPEG1.PICTURE_TYPE.PREDICTIVE) {
            this.fullPelForward = this.bits.read(1);
            this.forwardFCode = this.bits.read(3);
            if (this.forwardFCode === 0) {
              // Ignore picture with zero forward_f_code
              return;
            }
            this.forwardRSize = this.forwardFCode - 1;
            this.forwardF = 1 << this.forwardRSize;
          }
          var code = 0;
          do {
            code = this.bits.findNextStartCode();
          } while (code === MPEG1.START.EXTENSION || code === MPEG1.START.USER_DATA);
          while (code >= MPEG1.START.SLICE_FIRST && code <= MPEG1.START.SLICE_LAST) {
            this.decodeSlice(code & 255);
            code = this.bits.findNextStartCode();
          }
          if (code !== -1) {
            // We found the next start code; rewind 32bits and let the main loop
            // handle it.
            this.bits.rewind(32);
          }
          // Invoke decode callbacks
          if (this.destination) {
            this.destination.render(this.currentY, this.currentCr, this.currentCb);
          }
          // If this is a reference picutre then rotate the prediction pointers
          if (this.pictureType === MPEG1.PICTURE_TYPE.INTRA || this.pictureType === MPEG1.PICTURE_TYPE.PREDICTIVE) {
            var tmpY = this.forwardY, tmpY32 = this.forwardY32, tmpCr = this.forwardCr, tmpCr32 = this.forwardCr32, tmpCb = this.forwardCb, tmpCb32 = this.forwardCb32;
            this.forwardY = this.currentY;
            this.forwardY32 = this.currentY32;
            this.forwardCr = this.currentCr;
            this.forwardCr32 = this.currentCr32;
            this.forwardCb = this.currentCb;
            this.forwardCb32 = this.currentCb32;
            this.currentY = tmpY;
            this.currentY32 = tmpY32;
            this.currentCr = tmpCr;
            this.currentCr32 = tmpCr32;
            this.currentCb = tmpCb;
            this.currentCb32 = tmpCb32;
          }
        };
        // Slice Layer
        MPEG1.prototype.quantizerScale = 0;
        MPEG1.prototype.sliceBegin = false;
        MPEG1.prototype.decodeSlice = function (slice) {
          this.sliceBegin = true;
          this.macroblockAddress = (slice - 1) * this.mbWidth - 1;
          // Reset motion vectors and DC predictors
          this.motionFwH = this.motionFwHPrev = 0;
          this.motionFwV = this.motionFwVPrev = 0;
          this.dcPredictorY = 128;
          this.dcPredictorCr = 128;
          this.dcPredictorCb = 128;
          this.quantizerScale = this.bits.read(5);
          // skip extra bits
          while (this.bits.read(1)) {
            this.bits.skip(8);
          }
          do {
            this.decodeMacroblock();
          } while (!this.bits.nextBytesAreStartCode());
        };
        // Macroblock Layer
        MPEG1.prototype.macroblockAddress = 0;
        MPEG1.prototype.mbRow = 0;
        MPEG1.prototype.mbCol = 0;
        MPEG1.prototype.macroblockType = 0;
        MPEG1.prototype.macroblockIntra = false;
        MPEG1.prototype.macroblockMotFw = false;
        MPEG1.prototype.motionFwH = 0;
        MPEG1.prototype.motionFwV = 0;
        MPEG1.prototype.motionFwHPrev = 0;
        MPEG1.prototype.motionFwVPrev = 0;
        MPEG1.prototype.decodeMacroblock = function () {
          // Decode macroblock_address_increment
          var increment = 0, t = this.readHuffman(MPEG1.MACROBLOCK_ADDRESS_INCREMENT);
          while (t === 34) {
            // macroblock_stuffing
            t = this.readHuffman(MPEG1.MACROBLOCK_ADDRESS_INCREMENT);
          }
          while (t === 35) {
            // macroblock_escape
            increment += 33;
            t = this.readHuffman(MPEG1.MACROBLOCK_ADDRESS_INCREMENT);
          }
          increment += t;
          // Process any skipped macroblocks
          if (this.sliceBegin) {
            // The first macroblock_address_increment of each slice is relative
            // to beginning of the preverious row, not the preverious macroblock
            this.sliceBegin = false;
            this.macroblockAddress += increment;
          } else {
            if (this.macroblockAddress + increment >= this.mbSize) {
              // Illegal (too large) macroblock_address_increment
              return;
            }
            if (increment > 1) {
              // Skipped macroblocks reset DC predictors
              this.dcPredictorY = 128;
              this.dcPredictorCr = 128;
              this.dcPredictorCb = 128;
              // Skipped macroblocks in P-pictures reset motion vectors
              if (this.pictureType === MPEG1.PICTURE_TYPE.PREDICTIVE) {
                this.motionFwH = this.motionFwHPrev = 0;
                this.motionFwV = this.motionFwVPrev = 0;
              }
            }
            // Predict skipped macroblocks
            while (increment > 1) {
              this.macroblockAddress++;
              this.mbRow = this.macroblockAddress / this.mbWidth | 0;
              this.mbCol = this.macroblockAddress % this.mbWidth;
              this.copyMacroblock(this.motionFwH, this.motionFwV, this.forwardY, this.forwardCr, this.forwardCb);
              increment--;
            }
            this.macroblockAddress++;
          }
          this.mbRow = this.macroblockAddress / this.mbWidth | 0;
          this.mbCol = this.macroblockAddress % this.mbWidth;
          // Process the current macroblock
          var mbTable = MPEG1.MACROBLOCK_TYPE[this.pictureType];
          this.macroblockType = this.readHuffman(mbTable);
          this.macroblockIntra = this.macroblockType & 1;
          this.macroblockMotFw = this.macroblockType & 8;
          // Quantizer scale
          if ((this.macroblockType & 16) !== 0) {
            this.quantizerScale = this.bits.read(5);
          }
          if (this.macroblockIntra) {
            // Intra-coded macroblocks reset motion vectors
            this.motionFwH = this.motionFwHPrev = 0;
            this.motionFwV = this.motionFwVPrev = 0;
          } else {
            // Non-intra macroblocks reset DC predictors
            this.dcPredictorY = 128;
            this.dcPredictorCr = 128;
            this.dcPredictorCb = 128;
            this.decodeMotionVectors();
            this.copyMacroblock(this.motionFwH, this.motionFwV, this.forwardY, this.forwardCr, this.forwardCb);
          }
          // Decode blocks
          var cbp = (this.macroblockType & 2) !== 0 ? this.readHuffman(MPEG1.CODE_BLOCK_PATTERN) : this.macroblockIntra ? 63 : 0;
          for (var block = 0, mask = 32; block < 6; block++) {
            if ((cbp & mask) !== 0) {
              this.decodeBlock(block);
            }
            mask >>= 1;
          }
        };
        MPEG1.prototype.decodeMotionVectors = function () {
          var code, d, r = 0;
          // Forward
          if (this.macroblockMotFw) {
            // Horizontal forward
            code = this.readHuffman(MPEG1.MOTION);
            if (code !== 0 && this.forwardF !== 1) {
              r = this.bits.read(this.forwardRSize);
              d = (Math.abs(code) - 1 << this.forwardRSize) + r + 1;
              if (code < 0) {
                d = -d;
              }
            } else {
              d = code;
            }
            this.motionFwHPrev += d;
            if (this.motionFwHPrev > (this.forwardF << 4) - 1) {
              this.motionFwHPrev -= this.forwardF << 5;
            } else if (this.motionFwHPrev < -this.forwardF << 4) {
              this.motionFwHPrev += this.forwardF << 5;
            }
            this.motionFwH = this.motionFwHPrev;
            if (this.fullPelForward) {
              this.motionFwH <<= 1;
            }
            // Vertical forward
            code = this.readHuffman(MPEG1.MOTION);
            if (code !== 0 && this.forwardF !== 1) {
              r = this.bits.read(this.forwardRSize);
              d = (Math.abs(code) - 1 << this.forwardRSize) + r + 1;
              if (code < 0) {
                d = -d;
              }
            } else {
              d = code;
            }
            this.motionFwVPrev += d;
            if (this.motionFwVPrev > (this.forwardF << 4) - 1) {
              this.motionFwVPrev -= this.forwardF << 5;
            } else if (this.motionFwVPrev < -this.forwardF << 4) {
              this.motionFwVPrev += this.forwardF << 5;
            }
            this.motionFwV = this.motionFwVPrev;
            if (this.fullPelForward) {
              this.motionFwV <<= 1;
            }
          } else if (this.pictureType === MPEG1.PICTURE_TYPE.PREDICTIVE) {
            // No motion information in P-picture, reset vectors
            this.motionFwH = this.motionFwHPrev = 0;
            this.motionFwV = this.motionFwVPrev = 0;
          }
        };
        MPEG1.prototype.copyMacroblock = function (motionH, motionV, sY, sCr, sCb) {
          var width, scan, H, V, oddH, oddV, src, dest, last;
          // We use 32bit writes here
          var dY = this.currentY32, dCb = this.currentCb32, dCr = this.currentCr32;
          // Luminance
          width = this.codedWidth;
          scan = width - 16;
          H = motionH >> 1;
          V = motionV >> 1;
          oddH = (motionH & 1) === 1;
          oddV = (motionV & 1) === 1;
          src = ((this.mbRow << 4) + V) * width + (this.mbCol << 4) + H;
          dest = this.mbRow * width + this.mbCol << 2;
          last = dest + (width << 2);
          var x, y1, y2, y;
          if (oddH) {
            if (oddV) {
              while (dest < last) {
                y1 = sY[src] + sY[src + width];
                src++;
                for (x = 0; x < 4; x++) {
                  y2 = sY[src] + sY[src + width];
                  src++;
                  y = y1 + y2 + 2 >> 2 & 255;
                  y1 = sY[src] + sY[src + width];
                  src++;
                  y |= y1 + y2 + 2 << 6 & 65280;
                  y2 = sY[src] + sY[src + width];
                  src++;
                  y |= y1 + y2 + 2 << 14 & 16711680;
                  y1 = sY[src] + sY[src + width];
                  src++;
                  y |= y1 + y2 + 2 << 22 & 4278190080;
                  dY[dest++] = y;
                }
                dest += scan >> 2;
                src += scan - 1;
              }
            } else {
              while (dest < last) {
                y1 = sY[src++];
                for (x = 0; x < 4; x++) {
                  y2 = sY[src++];
                  y = y1 + y2 + 1 >> 1 & 255;
                  y1 = sY[src++];
                  y |= y1 + y2 + 1 << 7 & 65280;
                  y2 = sY[src++];
                  y |= y1 + y2 + 1 << 15 & 16711680;
                  y1 = sY[src++];
                  y |= y1 + y2 + 1 << 23 & 4278190080;
                  dY[dest++] = y;
                }
                dest += scan >> 2;
                src += scan - 1;
              }
            }
          } else {
            if (oddV) {
              while (dest < last) {
                for (x = 0; x < 4; x++) {
                  y = sY[src] + sY[src + width] + 1 >> 1 & 255;
                  src++;
                  y |= sY[src] + sY[src + width] + 1 << 7 & 65280;
                  src++;
                  y |= sY[src] + sY[src + width] + 1 << 15 & 16711680;
                  src++;
                  y |= sY[src] + sY[src + width] + 1 << 23 & 4278190080;
                  src++;
                  dY[dest++] = y;
                }
                dest += scan >> 2;
                src += scan;
              }
            } else {
              while (dest < last) {
                for (x = 0; x < 4; x++) {
                  y = sY[src];
                  src++;
                  y |= sY[src] << 8;
                  src++;
                  y |= sY[src] << 16;
                  src++;
                  y |= sY[src] << 24;
                  src++;
                  dY[dest++] = y;
                }
                dest += scan >> 2;
                src += scan;
              }
            }
          }
          // Chrominance
          width = this.halfWidth;
          scan = width - 8;
          H = motionH / 2 >> 1;
          V = motionV / 2 >> 1;
          oddH = (motionH / 2 & 1) === 1;
          oddV = (motionV / 2 & 1) === 1;
          src = ((this.mbRow << 3) + V) * width + (this.mbCol << 3) + H;
          dest = this.mbRow * width + this.mbCol << 1;
          last = dest + (width << 1);
          var cr1, cr2, cr, cb1, cb2, cb;
          if (oddH) {
            if (oddV) {
              while (dest < last) {
                cr1 = sCr[src] + sCr[src + width];
                cb1 = sCb[src] + sCb[src + width];
                src++;
                for (x = 0; x < 2; x++) {
                  cr2 = sCr[src] + sCr[src + width];
                  cb2 = sCb[src] + sCb[src + width];
                  src++;
                  cr = cr1 + cr2 + 2 >> 2 & 255;
                  cb = cb1 + cb2 + 2 >> 2 & 255;
                  cr1 = sCr[src] + sCr[src + width];
                  cb1 = sCb[src] + sCb[src + width];
                  src++;
                  cr |= cr1 + cr2 + 2 << 6 & 65280;
                  cb |= cb1 + cb2 + 2 << 6 & 65280;
                  cr2 = sCr[src] + sCr[src + width];
                  cb2 = sCb[src] + sCb[src + width];
                  src++;
                  cr |= cr1 + cr2 + 2 << 14 & 16711680;
                  cb |= cb1 + cb2 + 2 << 14 & 16711680;
                  cr1 = sCr[src] + sCr[src + width];
                  cb1 = sCb[src] + sCb[src + width];
                  src++;
                  cr |= cr1 + cr2 + 2 << 22 & 4278190080;
                  cb |= cb1 + cb2 + 2 << 22 & 4278190080;
                  dCr[dest] = cr;
                  dCb[dest] = cb;
                  dest++;
                }
                dest += scan >> 2;
                src += scan - 1;
              }
            } else {
              while (dest < last) {
                cr1 = sCr[src];
                cb1 = sCb[src];
                src++;
                for (x = 0; x < 2; x++) {
                  cr2 = sCr[src];
                  cb2 = sCb[src++];
                  cr = cr1 + cr2 + 1 >> 1 & 255;
                  cb = cb1 + cb2 + 1 >> 1 & 255;
                  cr1 = sCr[src];
                  cb1 = sCb[src++];
                  cr |= cr1 + cr2 + 1 << 7 & 65280;
                  cb |= cb1 + cb2 + 1 << 7 & 65280;
                  cr2 = sCr[src];
                  cb2 = sCb[src++];
                  cr |= cr1 + cr2 + 1 << 15 & 16711680;
                  cb |= cb1 + cb2 + 1 << 15 & 16711680;
                  cr1 = sCr[src];
                  cb1 = sCb[src++];
                  cr |= cr1 + cr2 + 1 << 23 & 4278190080;
                  cb |= cb1 + cb2 + 1 << 23 & 4278190080;
                  dCr[dest] = cr;
                  dCb[dest] = cb;
                  dest++;
                }
                dest += scan >> 2;
                src += scan - 1;
              }
            }
          } else {
            if (oddV) {
              while (dest < last) {
                for (x = 0; x < 2; x++) {
                  cr = sCr[src] + sCr[src + width] + 1 >> 1 & 255;
                  cb = sCb[src] + sCb[src + width] + 1 >> 1 & 255;
                  src++;
                  cr |= sCr[src] + sCr[src + width] + 1 << 7 & 65280;
                  cb |= sCb[src] + sCb[src + width] + 1 << 7 & 65280;
                  src++;
                  cr |= sCr[src] + sCr[src + width] + 1 << 15 & 16711680;
                  cb |= sCb[src] + sCb[src + width] + 1 << 15 & 16711680;
                  src++;
                  cr |= sCr[src] + sCr[src + width] + 1 << 23 & 4278190080;
                  cb |= sCb[src] + sCb[src + width] + 1 << 23 & 4278190080;
                  src++;
                  dCr[dest] = cr;
                  dCb[dest] = cb;
                  dest++;
                }
                dest += scan >> 2;
                src += scan;
              }
            } else {
              while (dest < last) {
                for (x = 0; x < 2; x++) {
                  cr = sCr[src];
                  cb = sCb[src];
                  src++;
                  cr |= sCr[src] << 8;
                  cb |= sCb[src] << 8;
                  src++;
                  cr |= sCr[src] << 16;
                  cb |= sCb[src] << 16;
                  src++;
                  cr |= sCr[src] << 24;
                  cb |= sCb[src] << 24;
                  src++;
                  dCr[dest] = cr;
                  dCb[dest] = cb;
                  dest++;
                }
                dest += scan >> 2;
                src += scan;
              }
            }
          }
        };
        // Block layer
        MPEG1.prototype.dcPredictorY = 0;
        MPEG1.prototype.dcPredictorCr = 0;
        MPEG1.prototype.dcPredictorCb = 0;
        MPEG1.prototype.blockData = null;
        MPEG1.prototype.decodeBlock = function (block) {
          var n = 0, quantMatrix;
          // Decode DC coefficient of intra-coded blocks
          if (this.macroblockIntra) {
            var predictor, dctSize;
            // DC prediction
            if (block < 4) {
              predictor = this.dcPredictorY;
              dctSize = this.readHuffman(MPEG1.DCT_DC_SIZE_LUMINANCE);
            } else {
              predictor = block === 4 ? this.dcPredictorCr : this.dcPredictorCb;
              dctSize = this.readHuffman(MPEG1.DCT_DC_SIZE_CHROMINANCE);
            }
            // Read DC coeff
            if (dctSize > 0) {
              var differential = this.bits.read(dctSize);
              if ((differential & 1 << dctSize - 1) !== 0) {
                this.blockData[0] = predictor + differential;
              } else {
                this.blockData[0] = predictor + (-1 << dctSize | differential + 1);
              }
            } else {
              this.blockData[0] = predictor;
            }
            // Save predictor value
            if (block < 4) {
              this.dcPredictorY = this.blockData[0];
            } else if (block === 4) {
              this.dcPredictorCr = this.blockData[0];
            } else {
              this.dcPredictorCb = this.blockData[0];
            }
            // Dequantize + premultiply
            this.blockData[0] <<= 3 + 5;
            quantMatrix = this.intraQuantMatrix;
            n = 1;
          } else {
            quantMatrix = this.nonIntraQuantMatrix;
          }
          // Decode AC coefficients (+DC for non-intra)
          var level = 0;
          while (true) {
            var run = 0, coeff = this.readHuffman(MPEG1.DCT_COEFF);
            if (coeff === 1 && n > 0 && this.bits.read(1) === 0) {
              // end_of_block
              break;
            }
            if (coeff === 65535) {
              // escape
              run = this.bits.read(6);
              level = this.bits.read(8);
              if (level === 0) {
                level = this.bits.read(8);
              } else if (level === 128) {
                level = this.bits.read(8) - 256;
              } else if (level > 128) {
                level = level - 256;
              }
            } else {
              run = coeff >> 8;
              level = coeff & 255;
              if (this.bits.read(1)) {
                level = -level;
              }
            }
            n += run;
            var dezigZagged = MPEG1.ZIG_ZAG[n];
            n++;
            // Dequantize, oddify, clip
            level <<= 1;
            if (!this.macroblockIntra) {
              level += level < 0 ? -1 : 1;
            }
            level = level * this.quantizerScale * quantMatrix[dezigZagged] >> 4;
            if ((level & 1) === 0) {
              level -= level > 0 ? 1 : -1;
            }
            if (level > 2047) {
              level = 2047;
            } else if (level < -2048) {
              level = -2048;
            }
            // Save premultiplied coefficient
            this.blockData[dezigZagged] = level * MPEG1.PREMULTIPLIER_MATRIX[dezigZagged];
          }
          // Move block to its place
          var destArray, destIndex, scan;
          if (block < 4) {
            destArray = this.currentY;
            scan = this.codedWidth - 8;
            destIndex = this.mbRow * this.codedWidth + this.mbCol << 4;
            if ((block & 1) !== 0) {
              destIndex += 8;
            }
            if ((block & 2) !== 0) {
              destIndex += this.codedWidth << 3;
            }
          } else {
            destArray = block === 4 ? this.currentCb : this.currentCr;
            scan = (this.codedWidth >> 1) - 8;
            destIndex = (this.mbRow * this.codedWidth << 2) + (this.mbCol << 3);
          }
          if (this.macroblockIntra) {
            // Overwrite (no prediction)
            if (n === 1) {
              MPEG1.CopyValueToDestination(this.blockData[0] + 128 >> 8, destArray, destIndex, scan);
              this.blockData[0] = 0;
            } else {
              MPEG1.IDCT(this.blockData);
              MPEG1.CopyBlockToDestination(this.blockData, destArray, destIndex, scan);
              JSMpeg.Fill(this.blockData, 0);
            }
          } else {
            // Add data to the predicted macroblock
            if (n === 1) {
              MPEG1.AddValueToDestination(this.blockData[0] + 128 >> 8, destArray, destIndex, scan);
              this.blockData[0] = 0;
            } else {
              MPEG1.IDCT(this.blockData);
              MPEG1.AddBlockToDestination(this.blockData, destArray, destIndex, scan);
              JSMpeg.Fill(this.blockData, 0);
            }
          }
          n = 0;
        };
        MPEG1.CopyBlockToDestination = function (block, dest, index, scan) {
          for (var n = 0; n < 64; n += 8, index += scan + 8) {
            dest[index + 0] = block[n + 0];
            dest[index + 1] = block[n + 1];
            dest[index + 2] = block[n + 2];
            dest[index + 3] = block[n + 3];
            dest[index + 4] = block[n + 4];
            dest[index + 5] = block[n + 5];
            dest[index + 6] = block[n + 6];
            dest[index + 7] = block[n + 7];
          }
        };
        MPEG1.AddBlockToDestination = function (block, dest, index, scan) {
          for (var n = 0; n < 64; n += 8, index += scan + 8) {
            dest[index + 0] += block[n + 0];
            dest[index + 1] += block[n + 1];
            dest[index + 2] += block[n + 2];
            dest[index + 3] += block[n + 3];
            dest[index + 4] += block[n + 4];
            dest[index + 5] += block[n + 5];
            dest[index + 6] += block[n + 6];
            dest[index + 7] += block[n + 7];
          }
        };
        MPEG1.CopyValueToDestination = function (value, dest, index, scan) {
          for (var n = 0; n < 64; n += 8, index += scan + 8) {
            dest[index + 0] = value;
            dest[index + 1] = value;
            dest[index + 2] = value;
            dest[index + 3] = value;
            dest[index + 4] = value;
            dest[index + 5] = value;
            dest[index + 6] = value;
            dest[index + 7] = value;
          }
        };
        MPEG1.AddValueToDestination = function (value, dest, index, scan) {
          for (var n = 0; n < 64; n += 8, index += scan + 8) {
            dest[index + 0] += value;
            dest[index + 1] += value;
            dest[index + 2] += value;
            dest[index + 3] += value;
            dest[index + 4] += value;
            dest[index + 5] += value;
            dest[index + 6] += value;
            dest[index + 7] += value;
          }
        };
        MPEG1.IDCT = function (block) {
          // See http://vsr.informatik.tu-chemnitz.de/~jan/MPEG/HTML/IDCT.html
          // for more info.
          var b1, b3, b4, b6, b7, tmp1, tmp2, m0, x0, x1, x2, x3, x4, y3, y4, y5, y6, y7;
          // Transform columns
          for (var i = 0; i < 8; ++i) {
            b1 = block[4 * 8 + i];
            b3 = block[2 * 8 + i] + block[6 * 8 + i];
            b4 = block[5 * 8 + i] - block[3 * 8 + i];
            tmp1 = block[1 * 8 + i] + block[7 * 8 + i];
            tmp2 = block[3 * 8 + i] + block[5 * 8 + i];
            b6 = block[1 * 8 + i] - block[7 * 8 + i];
            b7 = tmp1 + tmp2;
            m0 = block[0 * 8 + i];
            x4 = (b6 * 473 - b4 * 196 + 128 >> 8) - b7;
            x0 = x4 - ((tmp1 - tmp2) * 362 + 128 >> 8);
            x1 = m0 - b1;
            x2 = ((block[2 * 8 + i] - block[6 * 8 + i]) * 362 + 128 >> 8) - b3;
            x3 = m0 + b1;
            y3 = x1 + x2;
            y4 = x3 + b3;
            y5 = x1 - x2;
            y6 = x3 - b3;
            y7 = -x0 - (b4 * 473 + b6 * 196 + 128 >> 8);
            block[0 * 8 + i] = b7 + y4;
            block[1 * 8 + i] = x4 + y3;
            block[2 * 8 + i] = y5 - x0;
            block[3 * 8 + i] = y6 - y7;
            block[4 * 8 + i] = y6 + y7;
            block[5 * 8 + i] = x0 + y5;
            block[6 * 8 + i] = y3 - x4;
            block[7 * 8 + i] = y4 - b7;
          }
          // Transform rows
          for (var i = 0; i < 64; i += 8) {
            b1 = block[4 + i];
            b3 = block[2 + i] + block[6 + i];
            b4 = block[5 + i] - block[3 + i];
            tmp1 = block[1 + i] + block[7 + i];
            tmp2 = block[3 + i] + block[5 + i];
            b6 = block[1 + i] - block[7 + i];
            b7 = tmp1 + tmp2;
            m0 = block[0 + i];
            x4 = (b6 * 473 - b4 * 196 + 128 >> 8) - b7;
            x0 = x4 - ((tmp1 - tmp2) * 362 + 128 >> 8);
            x1 = m0 - b1;
            x2 = ((block[2 + i] - block[6 + i]) * 362 + 128 >> 8) - b3;
            x3 = m0 + b1;
            y3 = x1 + x2;
            y4 = x3 + b3;
            y5 = x1 - x2;
            y6 = x3 - b3;
            y7 = -x0 - (b4 * 473 + b6 * 196 + 128 >> 8);
            block[0 + i] = b7 + y4 + 128 >> 8;
            block[1 + i] = x4 + y3 + 128 >> 8;
            block[2 + i] = y5 - x0 + 128 >> 8;
            block[3 + i] = y6 - y7 + 128 >> 8;
            block[4 + i] = y6 + y7 + 128 >> 8;
            block[5 + i] = x0 + y5 + 128 >> 8;
            block[6 + i] = y3 - x4 + 128 >> 8;
            block[7 + i] = y4 - b7 + 128 >> 8;
          }
        };
        // VLC Tables and Constants
        MPEG1.PICTURE_RATE = [
          0,
          23.976,
          24,
          25,
          29.97,
          30,
          50,
          59.94,
          60,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ];
        MPEG1.ZIG_ZAG = new Uint8Array([
          0,
          1,
          8,
          16,
          9,
          2,
          3,
          10,
          17,
          24,
          32,
          25,
          18,
          11,
          4,
          5,
          12,
          19,
          26,
          33,
          40,
          48,
          41,
          34,
          27,
          20,
          13,
          6,
          7,
          14,
          21,
          28,
          35,
          42,
          49,
          56,
          57,
          50,
          43,
          36,
          29,
          22,
          15,
          23,
          30,
          37,
          44,
          51,
          58,
          59,
          52,
          45,
          38,
          31,
          39,
          46,
          53,
          60,
          61,
          54,
          47,
          55,
          62,
          63
        ]);
        MPEG1.DEFAULT_INTRA_QUANT_MATRIX = new Uint8Array([
          8,
          16,
          19,
          22,
          26,
          27,
          29,
          34,
          16,
          16,
          22,
          24,
          27,
          29,
          34,
          37,
          19,
          22,
          26,
          27,
          29,
          34,
          34,
          38,
          22,
          22,
          26,
          27,
          29,
          34,
          37,
          40,
          22,
          26,
          27,
          29,
          32,
          35,
          40,
          48,
          26,
          27,
          29,
          32,
          35,
          40,
          48,
          58,
          26,
          27,
          29,
          34,
          38,
          46,
          56,
          69,
          27,
          29,
          35,
          38,
          46,
          56,
          69,
          83
        ]);
        MPEG1.DEFAULT_NON_INTRA_QUANT_MATRIX = new Uint8Array([
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16,
          16
        ]);
        MPEG1.PREMULTIPLIER_MATRIX = new Uint8Array([
          32,
          44,
          42,
          38,
          32,
          25,
          17,
          9,
          44,
          62,
          58,
          52,
          44,
          35,
          24,
          12,
          42,
          58,
          55,
          49,
          42,
          33,
          23,
          12,
          38,
          52,
          49,
          44,
          38,
          30,
          20,
          10,
          32,
          44,
          42,
          38,
          32,
          25,
          17,
          9,
          25,
          35,
          33,
          30,
          25,
          20,
          14,
          7,
          17,
          24,
          23,
          20,
          17,
          14,
          9,
          5,
          9,
          12,
          12,
          10,
          9,
          7,
          5,
          2
        ]);
        // MPEG-1 VLC
        //  macroblock_stuffing decodes as 34.
        //  macroblock_escape decodes as 35.
        MPEG1.MACROBLOCK_ADDRESS_INCREMENT = new Int16Array([
          1 * 3,
          2 * 3,
          0,
          //   0
          3 * 3,
          4 * 3,
          0,
          //   1  0
          0,
          0,
          1,
          //   2  1.
          5 * 3,
          6 * 3,
          0,
          //   3  00
          7 * 3,
          8 * 3,
          0,
          //   4  01
          9 * 3,
          10 * 3,
          0,
          //   5  000
          11 * 3,
          12 * 3,
          0,
          //   6  001
          0,
          0,
          3,
          //   7  010.
          0,
          0,
          2,
          //   8  011.
          13 * 3,
          14 * 3,
          0,
          //   9  0000
          15 * 3,
          16 * 3,
          0,
          //  10  0001
          0,
          0,
          5,
          //  11  0010.
          0,
          0,
          4,
          //  12  0011.
          17 * 3,
          18 * 3,
          0,
          //  13  0000 0
          19 * 3,
          20 * 3,
          0,
          //  14  0000 1
          0,
          0,
          7,
          //  15  0001 0.
          0,
          0,
          6,
          //  16  0001 1.
          21 * 3,
          22 * 3,
          0,
          //  17  0000 00
          23 * 3,
          24 * 3,
          0,
          //  18  0000 01
          25 * 3,
          26 * 3,
          0,
          //  19  0000 10
          27 * 3,
          28 * 3,
          0,
          //  20  0000 11
          -1,
          29 * 3,
          0,
          //  21  0000 000
          -1,
          30 * 3,
          0,
          //  22  0000 001
          31 * 3,
          32 * 3,
          0,
          //  23  0000 010
          33 * 3,
          34 * 3,
          0,
          //  24  0000 011
          35 * 3,
          36 * 3,
          0,
          //  25  0000 100
          37 * 3,
          38 * 3,
          0,
          //  26  0000 101
          0,
          0,
          9,
          //  27  0000 110.
          0,
          0,
          8,
          //  28  0000 111.
          39 * 3,
          40 * 3,
          0,
          //  29  0000 0001
          41 * 3,
          42 * 3,
          0,
          //  30  0000 0011
          43 * 3,
          44 * 3,
          0,
          //  31  0000 0100
          45 * 3,
          46 * 3,
          0,
          //  32  0000 0101
          0,
          0,
          15,
          //  33  0000 0110.
          0,
          0,
          14,
          //  34  0000 0111.
          0,
          0,
          13,
          //  35  0000 1000.
          0,
          0,
          12,
          //  36  0000 1001.
          0,
          0,
          11,
          //  37  0000 1010.
          0,
          0,
          10,
          //  38  0000 1011.
          47 * 3,
          -1,
          0,
          //  39  0000 0001 0
          -1,
          48 * 3,
          0,
          //  40  0000 0001 1
          49 * 3,
          50 * 3,
          0,
          //  41  0000 0011 0
          51 * 3,
          52 * 3,
          0,
          //  42  0000 0011 1
          53 * 3,
          54 * 3,
          0,
          //  43  0000 0100 0
          55 * 3,
          56 * 3,
          0,
          //  44  0000 0100 1
          57 * 3,
          58 * 3,
          0,
          //  45  0000 0101 0
          59 * 3,
          60 * 3,
          0,
          //  46  0000 0101 1
          61 * 3,
          -1,
          0,
          //  47  0000 0001 00
          -1,
          62 * 3,
          0,
          //  48  0000 0001 11
          63 * 3,
          64 * 3,
          0,
          //  49  0000 0011 00
          65 * 3,
          66 * 3,
          0,
          //  50  0000 0011 01
          67 * 3,
          68 * 3,
          0,
          //  51  0000 0011 10
          69 * 3,
          70 * 3,
          0,
          //  52  0000 0011 11
          71 * 3,
          72 * 3,
          0,
          //  53  0000 0100 00
          73 * 3,
          74 * 3,
          0,
          //  54  0000 0100 01
          0,
          0,
          21,
          //  55  0000 0100 10.
          0,
          0,
          20,
          //  56  0000 0100 11.
          0,
          0,
          19,
          //  57  0000 0101 00.
          0,
          0,
          18,
          //  58  0000 0101 01.
          0,
          0,
          17,
          //  59  0000 0101 10.
          0,
          0,
          16,
          //  60  0000 0101 11.
          0,
          0,
          35,
          //  61  0000 0001 000. -- macroblock_escape
          0,
          0,
          34,
          //  62  0000 0001 111. -- macroblock_stuffing
          0,
          0,
          33,
          //  63  0000 0011 000.
          0,
          0,
          32,
          //  64  0000 0011 001.
          0,
          0,
          31,
          //  65  0000 0011 010.
          0,
          0,
          30,
          //  66  0000 0011 011.
          0,
          0,
          29,
          //  67  0000 0011 100.
          0,
          0,
          28,
          //  68  0000 0011 101.
          0,
          0,
          27,
          //  69  0000 0011 110.
          0,
          0,
          26,
          //  70  0000 0011 111.
          0,
          0,
          25,
          //  71  0000 0100 000.
          0,
          0,
          24,
          //  72  0000 0100 001.
          0,
          0,
          23,
          //  73  0000 0100 010.
          0,
          0,
          22    //  74  0000 0100 011.
        ]);
        //  macroblock_type bitmap:
        //    0x10  macroblock_quant
        //    0x08  macroblock_motion_forward
        //    0x04  macroblock_motion_backward
        //    0x02  macrobkock_pattern
        //    0x01  macroblock_intra
        //
        MPEG1.MACROBLOCK_TYPE_INTRA = new Int8Array([
          1 * 3,
          2 * 3,
          0,
          //   0
          -1,
          3 * 3,
          0,
          //   1  0
          0,
          0,
          1,
          //   2  1.
          0,
          0,
          17    //   3  01.
        ]);
        MPEG1.MACROBLOCK_TYPE_PREDICTIVE = new Int8Array([
          1 * 3,
          2 * 3,
          0,
          //  0
          3 * 3,
          4 * 3,
          0,
          //  1  0
          0,
          0,
          10,
          //  2  1.
          5 * 3,
          6 * 3,
          0,
          //  3  00
          0,
          0,
          2,
          //  4  01.
          7 * 3,
          8 * 3,
          0,
          //  5  000
          0,
          0,
          8,
          //  6  001.
          9 * 3,
          10 * 3,
          0,
          //  7  0000
          11 * 3,
          12 * 3,
          0,
          //  8  0001
          -1,
          13 * 3,
          0,
          //  9  00000
          0,
          0,
          18,
          // 10  00001.
          0,
          0,
          26,
          // 11  00010.
          0,
          0,
          1,
          // 12  00011.
          0,
          0,
          17    // 13  000001.
        ]);
        MPEG1.MACROBLOCK_TYPE_B = new Int8Array([
          1 * 3,
          2 * 3,
          0,
          //  0
          3 * 3,
          5 * 3,
          0,
          //  1  0
          4 * 3,
          6 * 3,
          0,
          //  2  1
          8 * 3,
          7 * 3,
          0,
          //  3  00
          0,
          0,
          12,
          //  4  10.
          9 * 3,
          10 * 3,
          0,
          //  5  01
          0,
          0,
          14,
          //  6  11.
          13 * 3,
          14 * 3,
          0,
          //  7  001
          12 * 3,
          11 * 3,
          0,
          //  8  000
          0,
          0,
          4,
          //  9  010.
          0,
          0,
          6,
          // 10  011.
          18 * 3,
          16 * 3,
          0,
          // 11  0001
          15 * 3,
          17 * 3,
          0,
          // 12  0000
          0,
          0,
          8,
          // 13  0010.
          0,
          0,
          10,
          // 14  0011.
          -1,
          19 * 3,
          0,
          // 15  00000
          0,
          0,
          1,
          // 16  00011.
          20 * 3,
          21 * 3,
          0,
          // 17  00001
          0,
          0,
          30,
          // 18  00010.
          0,
          0,
          17,
          // 19  000001.
          0,
          0,
          22,
          // 20  000010.
          0,
          0,
          26    // 21  000011.
        ]);
        MPEG1.MACROBLOCK_TYPE = [
          null,
          MPEG1.MACROBLOCK_TYPE_INTRA,
          MPEG1.MACROBLOCK_TYPE_PREDICTIVE,
          MPEG1.MACROBLOCK_TYPE_B
        ];
        MPEG1.CODE_BLOCK_PATTERN = new Int16Array([
          2 * 3,
          1 * 3,
          0,
          //   0
          3 * 3,
          6 * 3,
          0,
          //   1  1
          4 * 3,
          5 * 3,
          0,
          //   2  0
          8 * 3,
          11 * 3,
          0,
          //   3  10
          12 * 3,
          13 * 3,
          0,
          //   4  00
          9 * 3,
          7 * 3,
          0,
          //   5  01
          10 * 3,
          14 * 3,
          0,
          //   6  11
          20 * 3,
          19 * 3,
          0,
          //   7  011
          18 * 3,
          16 * 3,
          0,
          //   8  100
          23 * 3,
          17 * 3,
          0,
          //   9  010
          27 * 3,
          25 * 3,
          0,
          //  10  110
          21 * 3,
          28 * 3,
          0,
          //  11  101
          15 * 3,
          22 * 3,
          0,
          //  12  000
          24 * 3,
          26 * 3,
          0,
          //  13  001
          0,
          0,
          60,
          //  14  111.
          35 * 3,
          40 * 3,
          0,
          //  15  0000
          44 * 3,
          48 * 3,
          0,
          //  16  1001
          38 * 3,
          36 * 3,
          0,
          //  17  0101
          42 * 3,
          47 * 3,
          0,
          //  18  1000
          29 * 3,
          31 * 3,
          0,
          //  19  0111
          39 * 3,
          32 * 3,
          0,
          //  20  0110
          0,
          0,
          32,
          //  21  1010.
          45 * 3,
          46 * 3,
          0,
          //  22  0001
          33 * 3,
          41 * 3,
          0,
          //  23  0100
          43 * 3,
          34 * 3,
          0,
          //  24  0010
          0,
          0,
          4,
          //  25  1101.
          30 * 3,
          37 * 3,
          0,
          //  26  0011
          0,
          0,
          8,
          //  27  1100.
          0,
          0,
          16,
          //  28  1011.
          0,
          0,
          44,
          //  29  0111 0.
          50 * 3,
          56 * 3,
          0,
          //  30  0011 0
          0,
          0,
          28,
          //  31  0111 1.
          0,
          0,
          52,
          //  32  0110 1.
          0,
          0,
          62,
          //  33  0100 0.
          61 * 3,
          59 * 3,
          0,
          //  34  0010 1
          52 * 3,
          60 * 3,
          0,
          //  35  0000 0
          0,
          0,
          1,
          //  36  0101 1.
          55 * 3,
          54 * 3,
          0,
          //  37  0011 1
          0,
          0,
          61,
          //  38  0101 0.
          0,
          0,
          56,
          //  39  0110 0.
          57 * 3,
          58 * 3,
          0,
          //  40  0000 1
          0,
          0,
          2,
          //  41  0100 1.
          0,
          0,
          40,
          //  42  1000 0.
          51 * 3,
          62 * 3,
          0,
          //  43  0010 0
          0,
          0,
          48,
          //  44  1001 0.
          64 * 3,
          63 * 3,
          0,
          //  45  0001 0
          49 * 3,
          53 * 3,
          0,
          //  46  0001 1
          0,
          0,
          20,
          //  47  1000 1.
          0,
          0,
          12,
          //  48  1001 1.
          80 * 3,
          83 * 3,
          0,
          //  49  0001 10
          0,
          0,
          63,
          //  50  0011 00.
          77 * 3,
          75 * 3,
          0,
          //  51  0010 00
          65 * 3,
          73 * 3,
          0,
          //  52  0000 00
          84 * 3,
          66 * 3,
          0,
          //  53  0001 11
          0,
          0,
          24,
          //  54  0011 11.
          0,
          0,
          36,
          //  55  0011 10.
          0,
          0,
          3,
          //  56  0011 01.
          69 * 3,
          87 * 3,
          0,
          //  57  0000 10
          81 * 3,
          79 * 3,
          0,
          //  58  0000 11
          68 * 3,
          71 * 3,
          0,
          //  59  0010 11
          70 * 3,
          78 * 3,
          0,
          //  60  0000 01
          67 * 3,
          76 * 3,
          0,
          //  61  0010 10
          72 * 3,
          74 * 3,
          0,
          //  62  0010 01
          86 * 3,
          85 * 3,
          0,
          //  63  0001 01
          88 * 3,
          82 * 3,
          0,
          //  64  0001 00
          -1,
          94 * 3,
          0,
          //  65  0000 000
          95 * 3,
          97 * 3,
          0,
          //  66  0001 111
          0,
          0,
          33,
          //  67  0010 100.
          0,
          0,
          9,
          //  68  0010 110.
          106 * 3,
          110 * 3,
          0,
          //  69  0000 100
          102 * 3,
          116 * 3,
          0,
          //  70  0000 010
          0,
          0,
          5,
          //  71  0010 111.
          0,
          0,
          10,
          //  72  0010 010.
          93 * 3,
          89 * 3,
          0,
          //  73  0000 001
          0,
          0,
          6,
          //  74  0010 011.
          0,
          0,
          18,
          //  75  0010 001.
          0,
          0,
          17,
          //  76  0010 101.
          0,
          0,
          34,
          //  77  0010 000.
          113 * 3,
          119 * 3,
          0,
          //  78  0000 011
          103 * 3,
          104 * 3,
          0,
          //  79  0000 111
          90 * 3,
          92 * 3,
          0,
          //  80  0001 100
          109 * 3,
          107 * 3,
          0,
          //  81  0000 110
          117 * 3,
          118 * 3,
          0,
          //  82  0001 001
          101 * 3,
          99 * 3,
          0,
          //  83  0001 101
          98 * 3,
          96 * 3,
          0,
          //  84  0001 110
          100 * 3,
          91 * 3,
          0,
          //  85  0001 011
          114 * 3,
          115 * 3,
          0,
          //  86  0001 010
          105 * 3,
          108 * 3,
          0,
          //  87  0000 101
          112 * 3,
          111 * 3,
          0,
          //  88  0001 000
          121 * 3,
          125 * 3,
          0,
          //  89  0000 0011
          0,
          0,
          41,
          //  90  0001 1000.
          0,
          0,
          14,
          //  91  0001 0111.
          0,
          0,
          21,
          //  92  0001 1001.
          124 * 3,
          122 * 3,
          0,
          //  93  0000 0010
          120 * 3,
          123 * 3,
          0,
          //  94  0000 0001
          0,
          0,
          11,
          //  95  0001 1110.
          0,
          0,
          19,
          //  96  0001 1101.
          0,
          0,
          7,
          //  97  0001 1111.
          0,
          0,
          35,
          //  98  0001 1100.
          0,
          0,
          13,
          //  99  0001 1011.
          0,
          0,
          50,
          // 100  0001 0110.
          0,
          0,
          49,
          // 101  0001 1010.
          0,
          0,
          58,
          // 102  0000 0100.
          0,
          0,
          37,
          // 103  0000 1110.
          0,
          0,
          25,
          // 104  0000 1111.
          0,
          0,
          45,
          // 105  0000 1010.
          0,
          0,
          57,
          // 106  0000 1000.
          0,
          0,
          26,
          // 107  0000 1101.
          0,
          0,
          29,
          // 108  0000 1011.
          0,
          0,
          38,
          // 109  0000 1100.
          0,
          0,
          53,
          // 110  0000 1001.
          0,
          0,
          23,
          // 111  0001 0001.
          0,
          0,
          43,
          // 112  0001 0000.
          0,
          0,
          46,
          // 113  0000 0110.
          0,
          0,
          42,
          // 114  0001 0100.
          0,
          0,
          22,
          // 115  0001 0101.
          0,
          0,
          54,
          // 116  0000 0101.
          0,
          0,
          51,
          // 117  0001 0010.
          0,
          0,
          15,
          // 118  0001 0011.
          0,
          0,
          30,
          // 119  0000 0111.
          0,
          0,
          39,
          // 120  0000 0001 0.
          0,
          0,
          47,
          // 121  0000 0011 0.
          0,
          0,
          55,
          // 122  0000 0010 1.
          0,
          0,
          27,
          // 123  0000 0001 1.
          0,
          0,
          59,
          // 124  0000 0010 0.
          0,
          0,
          31    // 125  0000 0011 1.
        ]);
        MPEG1.MOTION = new Int16Array([
          1 * 3,
          2 * 3,
          0,
          //   0
          4 * 3,
          3 * 3,
          0,
          //   1  0
          0,
          0,
          0,
          //   2  1.
          6 * 3,
          5 * 3,
          0,
          //   3  01
          8 * 3,
          7 * 3,
          0,
          //   4  00
          0,
          0,
          -1,
          //   5  011.
          0,
          0,
          1,
          //   6  010.
          9 * 3,
          10 * 3,
          0,
          //   7  001
          12 * 3,
          11 * 3,
          0,
          //   8  000
          0,
          0,
          2,
          //   9  0010.
          0,
          0,
          -2,
          //  10  0011.
          14 * 3,
          15 * 3,
          0,
          //  11  0001
          16 * 3,
          13 * 3,
          0,
          //  12  0000
          20 * 3,
          18 * 3,
          0,
          //  13  0000 1
          0,
          0,
          3,
          //  14  0001 0.
          0,
          0,
          -3,
          //  15  0001 1.
          17 * 3,
          19 * 3,
          0,
          //  16  0000 0
          -1,
          23 * 3,
          0,
          //  17  0000 00
          27 * 3,
          25 * 3,
          0,
          //  18  0000 11
          26 * 3,
          21 * 3,
          0,
          //  19  0000 01
          24 * 3,
          22 * 3,
          0,
          //  20  0000 10
          32 * 3,
          28 * 3,
          0,
          //  21  0000 011
          29 * 3,
          31 * 3,
          0,
          //  22  0000 101
          -1,
          33 * 3,
          0,
          //  23  0000 001
          36 * 3,
          35 * 3,
          0,
          //  24  0000 100
          0,
          0,
          -4,
          //  25  0000 111.
          30 * 3,
          34 * 3,
          0,
          //  26  0000 010
          0,
          0,
          4,
          //  27  0000 110.
          0,
          0,
          -7,
          //  28  0000 0111.
          0,
          0,
          5,
          //  29  0000 1010.
          37 * 3,
          41 * 3,
          0,
          //  30  0000 0100
          0,
          0,
          -5,
          //  31  0000 1011.
          0,
          0,
          7,
          //  32  0000 0110.
          38 * 3,
          40 * 3,
          0,
          //  33  0000 0011
          42 * 3,
          39 * 3,
          0,
          //  34  0000 0101
          0,
          0,
          -6,
          //  35  0000 1001.
          0,
          0,
          6,
          //  36  0000 1000.
          51 * 3,
          54 * 3,
          0,
          //  37  0000 0100 0
          50 * 3,
          49 * 3,
          0,
          //  38  0000 0011 0
          45 * 3,
          46 * 3,
          0,
          //  39  0000 0101 1
          52 * 3,
          47 * 3,
          0,
          //  40  0000 0011 1
          43 * 3,
          53 * 3,
          0,
          //  41  0000 0100 1
          44 * 3,
          48 * 3,
          0,
          //  42  0000 0101 0
          0,
          0,
          10,
          //  43  0000 0100 10.
          0,
          0,
          9,
          //  44  0000 0101 00.
          0,
          0,
          8,
          //  45  0000 0101 10.
          0,
          0,
          -8,
          //  46  0000 0101 11.
          57 * 3,
          66 * 3,
          0,
          //  47  0000 0011 11
          0,
          0,
          -9,
          //  48  0000 0101 01.
          60 * 3,
          64 * 3,
          0,
          //  49  0000 0011 01
          56 * 3,
          61 * 3,
          0,
          //  50  0000 0011 00
          55 * 3,
          62 * 3,
          0,
          //  51  0000 0100 00
          58 * 3,
          63 * 3,
          0,
          //  52  0000 0011 10
          0,
          0,
          -10,
          //  53  0000 0100 11.
          59 * 3,
          65 * 3,
          0,
          //  54  0000 0100 01
          0,
          0,
          12,
          //  55  0000 0100 000.
          0,
          0,
          16,
          //  56  0000 0011 000.
          0,
          0,
          13,
          //  57  0000 0011 110.
          0,
          0,
          14,
          //  58  0000 0011 100.
          0,
          0,
          11,
          //  59  0000 0100 010.
          0,
          0,
          15,
          //  60  0000 0011 010.
          0,
          0,
          -16,
          //  61  0000 0011 001.
          0,
          0,
          -12,
          //  62  0000 0100 001.
          0,
          0,
          -14,
          //  63  0000 0011 101.
          0,
          0,
          -15,
          //  64  0000 0011 011.
          0,
          0,
          -11,
          //  65  0000 0100 011.
          0,
          0,
          -13    //  66  0000 0011 111.
        ]);
        MPEG1.DCT_DC_SIZE_LUMINANCE = new Int8Array([
          2 * 3,
          1 * 3,
          0,
          //   0
          6 * 3,
          5 * 3,
          0,
          //   1  1
          3 * 3,
          4 * 3,
          0,
          //   2  0
          0,
          0,
          1,
          //   3  00.
          0,
          0,
          2,
          //   4  01.
          9 * 3,
          8 * 3,
          0,
          //   5  11
          7 * 3,
          10 * 3,
          0,
          //   6  10
          0,
          0,
          0,
          //   7  100.
          12 * 3,
          11 * 3,
          0,
          //   8  111
          0,
          0,
          4,
          //   9  110.
          0,
          0,
          3,
          //  10  101.
          13 * 3,
          14 * 3,
          0,
          //  11  1111
          0,
          0,
          5,
          //  12  1110.
          0,
          0,
          6,
          //  13  1111 0.
          16 * 3,
          15 * 3,
          0,
          //  14  1111 1
          17 * 3,
          -1,
          0,
          //  15  1111 11
          0,
          0,
          7,
          //  16  1111 10.
          0,
          0,
          8    //  17  1111 110.
        ]);
        MPEG1.DCT_DC_SIZE_CHROMINANCE = new Int8Array([
          2 * 3,
          1 * 3,
          0,
          //   0
          4 * 3,
          3 * 3,
          0,
          //   1  1
          6 * 3,
          5 * 3,
          0,
          //   2  0
          8 * 3,
          7 * 3,
          0,
          //   3  11
          0,
          0,
          2,
          //   4  10.
          0,
          0,
          1,
          //   5  01.
          0,
          0,
          0,
          //   6  00.
          10 * 3,
          9 * 3,
          0,
          //   7  111
          0,
          0,
          3,
          //   8  110.
          12 * 3,
          11 * 3,
          0,
          //   9  1111
          0,
          0,
          4,
          //  10  1110.
          14 * 3,
          13 * 3,
          0,
          //  11  1111 1
          0,
          0,
          5,
          //  12  1111 0.
          16 * 3,
          15 * 3,
          0,
          //  13  1111 11
          0,
          0,
          6,
          //  14  1111 10.
          17 * 3,
          -1,
          0,
          //  15  1111 111
          0,
          0,
          7,
          //  16  1111 110.
          0,
          0,
          8    //  17  1111 1110.
        ]);
        //  dct_coeff bitmap:
        //    0xff00  run
        //    0x00ff  level
        //  Decoded values are unsigned. Sign bit follows in the stream.
        //  Interpretation of the value 0x0001
        //    for dc_coeff_first:  run=0, level=1
        //    for dc_coeff_next:   If the next bit is 1: run=0, level=1
        //                         If the next bit is 0: end_of_block
        //  escape decodes as 0xffff.
        MPEG1.DCT_COEFF = new Int32Array([
          1 * 3,
          2 * 3,
          0,
          //   0
          4 * 3,
          3 * 3,
          0,
          //   1  0
          0,
          0,
          1,
          //   2  1.
          7 * 3,
          8 * 3,
          0,
          //   3  01
          6 * 3,
          5 * 3,
          0,
          //   4  00
          13 * 3,
          9 * 3,
          0,
          //   5  001
          11 * 3,
          10 * 3,
          0,
          //   6  000
          14 * 3,
          12 * 3,
          0,
          //   7  010
          0,
          0,
          257,
          //   8  011.
          20 * 3,
          22 * 3,
          0,
          //   9  0011
          18 * 3,
          21 * 3,
          0,
          //  10  0001
          16 * 3,
          19 * 3,
          0,
          //  11  0000
          0,
          0,
          513,
          //  12  0101.
          17 * 3,
          15 * 3,
          0,
          //  13  0010
          0,
          0,
          2,
          //  14  0100.
          0,
          0,
          3,
          //  15  0010 1.
          27 * 3,
          25 * 3,
          0,
          //  16  0000 0
          29 * 3,
          31 * 3,
          0,
          //  17  0010 0
          24 * 3,
          26 * 3,
          0,
          //  18  0001 0
          32 * 3,
          30 * 3,
          0,
          //  19  0000 1
          0,
          0,
          1025,
          //  20  0011 0.
          23 * 3,
          28 * 3,
          0,
          //  21  0001 1
          0,
          0,
          769,
          //  22  0011 1.
          0,
          0,
          258,
          //  23  0001 10.
          0,
          0,
          1793,
          //  24  0001 00.
          0,
          0,
          65535,
          //  25  0000 01. -- escape
          0,
          0,
          1537,
          //  26  0001 01.
          37 * 3,
          36 * 3,
          0,
          //  27  0000 00
          0,
          0,
          1281,
          //  28  0001 11.
          35 * 3,
          34 * 3,
          0,
          //  29  0010 00
          39 * 3,
          38 * 3,
          0,
          //  30  0000 11
          33 * 3,
          42 * 3,
          0,
          //  31  0010 01
          40 * 3,
          41 * 3,
          0,
          //  32  0000 10
          52 * 3,
          50 * 3,
          0,
          //  33  0010 010
          54 * 3,
          53 * 3,
          0,
          //  34  0010 001
          48 * 3,
          49 * 3,
          0,
          //  35  0010 000
          43 * 3,
          45 * 3,
          0,
          //  36  0000 001
          46 * 3,
          44 * 3,
          0,
          //  37  0000 000
          0,
          0,
          2049,
          //  38  0000 111.
          0,
          0,
          4,
          //  39  0000 110.
          0,
          0,
          514,
          //  40  0000 100.
          0,
          0,
          2305,
          //  41  0000 101.
          51 * 3,
          47 * 3,
          0,
          //  42  0010 011
          55 * 3,
          57 * 3,
          0,
          //  43  0000 0010
          60 * 3,
          56 * 3,
          0,
          //  44  0000 0001
          59 * 3,
          58 * 3,
          0,
          //  45  0000 0011
          61 * 3,
          62 * 3,
          0,
          //  46  0000 0000
          0,
          0,
          2561,
          //  47  0010 0111.
          0,
          0,
          3329,
          //  48  0010 0000.
          0,
          0,
          6,
          //  49  0010 0001.
          0,
          0,
          259,
          //  50  0010 0101.
          0,
          0,
          5,
          //  51  0010 0110.
          0,
          0,
          770,
          //  52  0010 0100.
          0,
          0,
          2817,
          //  53  0010 0011.
          0,
          0,
          3073,
          //  54  0010 0010.
          76 * 3,
          75 * 3,
          0,
          //  55  0000 0010 0
          67 * 3,
          70 * 3,
          0,
          //  56  0000 0001 1
          73 * 3,
          71 * 3,
          0,
          //  57  0000 0010 1
          78 * 3,
          74 * 3,
          0,
          //  58  0000 0011 1
          72 * 3,
          77 * 3,
          0,
          //  59  0000 0011 0
          69 * 3,
          64 * 3,
          0,
          //  60  0000 0001 0
          68 * 3,
          63 * 3,
          0,
          //  61  0000 0000 0
          66 * 3,
          65 * 3,
          0,
          //  62  0000 0000 1
          81 * 3,
          87 * 3,
          0,
          //  63  0000 0000 01
          91 * 3,
          80 * 3,
          0,
          //  64  0000 0001 01
          82 * 3,
          79 * 3,
          0,
          //  65  0000 0000 11
          83 * 3,
          86 * 3,
          0,
          //  66  0000 0000 10
          93 * 3,
          92 * 3,
          0,
          //  67  0000 0001 10
          84 * 3,
          85 * 3,
          0,
          //  68  0000 0000 00
          90 * 3,
          94 * 3,
          0,
          //  69  0000 0001 00
          88 * 3,
          89 * 3,
          0,
          //  70  0000 0001 11
          0,
          0,
          515,
          //  71  0000 0010 11.
          0,
          0,
          260,
          //  72  0000 0011 00.
          0,
          0,
          7,
          //  73  0000 0010 10.
          0,
          0,
          1026,
          //  74  0000 0011 11.
          0,
          0,
          1282,
          //  75  0000 0010 01.
          0,
          0,
          4097,
          //  76  0000 0010 00.
          0,
          0,
          3841,
          //  77  0000 0011 01.
          0,
          0,
          3585,
          //  78  0000 0011 10.
          105 * 3,
          107 * 3,
          0,
          //  79  0000 0000 111
          111 * 3,
          114 * 3,
          0,
          //  80  0000 0001 011
          104 * 3,
          97 * 3,
          0,
          //  81  0000 0000 010
          125 * 3,
          119 * 3,
          0,
          //  82  0000 0000 110
          96 * 3,
          98 * 3,
          0,
          //  83  0000 0000 100
          -1,
          123 * 3,
          0,
          //  84  0000 0000 000
          95 * 3,
          101 * 3,
          0,
          //  85  0000 0000 001
          106 * 3,
          121 * 3,
          0,
          //  86  0000 0000 101
          99 * 3,
          102 * 3,
          0,
          //  87  0000 0000 011
          113 * 3,
          103 * 3,
          0,
          //  88  0000 0001 110
          112 * 3,
          116 * 3,
          0,
          //  89  0000 0001 111
          110 * 3,
          100 * 3,
          0,
          //  90  0000 0001 000
          124 * 3,
          115 * 3,
          0,
          //  91  0000 0001 010
          117 * 3,
          122 * 3,
          0,
          //  92  0000 0001 101
          109 * 3,
          118 * 3,
          0,
          //  93  0000 0001 100
          120 * 3,
          108 * 3,
          0,
          //  94  0000 0001 001
          127 * 3,
          136 * 3,
          0,
          //  95  0000 0000 0010
          139 * 3,
          140 * 3,
          0,
          //  96  0000 0000 1000
          130 * 3,
          126 * 3,
          0,
          //  97  0000 0000 0101
          145 * 3,
          146 * 3,
          0,
          //  98  0000 0000 1001
          128 * 3,
          129 * 3,
          0,
          //  99  0000 0000 0110
          0,
          0,
          2050,
          // 100  0000 0001 0001.
          132 * 3,
          134 * 3,
          0,
          // 101  0000 0000 0011
          155 * 3,
          154 * 3,
          0,
          // 102  0000 0000 0111
          0,
          0,
          8,
          // 103  0000 0001 1101.
          137 * 3,
          133 * 3,
          0,
          // 104  0000 0000 0100
          143 * 3,
          144 * 3,
          0,
          // 105  0000 0000 1110
          151 * 3,
          138 * 3,
          0,
          // 106  0000 0000 1010
          142 * 3,
          141 * 3,
          0,
          // 107  0000 0000 1111
          0,
          0,
          10,
          // 108  0000 0001 0011.
          0,
          0,
          9,
          // 109  0000 0001 1000.
          0,
          0,
          11,
          // 110  0000 0001 0000.
          0,
          0,
          5377,
          // 111  0000 0001 0110.
          0,
          0,
          1538,
          // 112  0000 0001 1110.
          0,
          0,
          771,
          // 113  0000 0001 1100.
          0,
          0,
          5121,
          // 114  0000 0001 0111.
          0,
          0,
          1794,
          // 115  0000 0001 0101.
          0,
          0,
          4353,
          // 116  0000 0001 1111.
          0,
          0,
          4609,
          // 117  0000 0001 1010.
          0,
          0,
          4865,
          // 118  0000 0001 1001.
          148 * 3,
          152 * 3,
          0,
          // 119  0000 0000 1101
          0,
          0,
          1027,
          // 120  0000 0001 0010.
          153 * 3,
          150 * 3,
          0,
          // 121  0000 0000 1011
          0,
          0,
          261,
          // 122  0000 0001 1011.
          131 * 3,
          135 * 3,
          0,
          // 123  0000 0000 0001
          0,
          0,
          516,
          // 124  0000 0001 0100.
          149 * 3,
          147 * 3,
          0,
          // 125  0000 0000 1100
          172 * 3,
          173 * 3,
          0,
          // 126  0000 0000 0101 1
          162 * 3,
          158 * 3,
          0,
          // 127  0000 0000 0010 0
          170 * 3,
          161 * 3,
          0,
          // 128  0000 0000 0110 0
          168 * 3,
          166 * 3,
          0,
          // 129  0000 0000 0110 1
          157 * 3,
          179 * 3,
          0,
          // 130  0000 0000 0101 0
          169 * 3,
          167 * 3,
          0,
          // 131  0000 0000 0001 0
          174 * 3,
          171 * 3,
          0,
          // 132  0000 0000 0011 0
          178 * 3,
          177 * 3,
          0,
          // 133  0000 0000 0100 1
          156 * 3,
          159 * 3,
          0,
          // 134  0000 0000 0011 1
          164 * 3,
          165 * 3,
          0,
          // 135  0000 0000 0001 1
          183 * 3,
          182 * 3,
          0,
          // 136  0000 0000 0010 1
          175 * 3,
          176 * 3,
          0,
          // 137  0000 0000 0100 0
          0,
          0,
          263,
          // 138  0000 0000 1010 1.
          0,
          0,
          2562,
          // 139  0000 0000 1000 0.
          0,
          0,
          2306,
          // 140  0000 0000 1000 1.
          0,
          0,
          5633,
          // 141  0000 0000 1111 1.
          0,
          0,
          5889,
          // 142  0000 0000 1111 0.
          0,
          0,
          6401,
          // 143  0000 0000 1110 0.
          0,
          0,
          6145,
          // 144  0000 0000 1110 1.
          0,
          0,
          1283,
          // 145  0000 0000 1001 0.
          0,
          0,
          772,
          // 146  0000 0000 1001 1.
          0,
          0,
          13,
          // 147  0000 0000 1100 1.
          0,
          0,
          12,
          // 148  0000 0000 1101 0.
          0,
          0,
          14,
          // 149  0000 0000 1100 0.
          0,
          0,
          15,
          // 150  0000 0000 1011 1.
          0,
          0,
          517,
          // 151  0000 0000 1010 0.
          0,
          0,
          6657,
          // 152  0000 0000 1101 1.
          0,
          0,
          262,
          // 153  0000 0000 1011 0.
          180 * 3,
          181 * 3,
          0,
          // 154  0000 0000 0111 1
          160 * 3,
          163 * 3,
          0,
          // 155  0000 0000 0111 0
          196 * 3,
          199 * 3,
          0,
          // 156  0000 0000 0011 10
          0,
          0,
          27,
          // 157  0000 0000 0101 00.
          203 * 3,
          185 * 3,
          0,
          // 158  0000 0000 0010 01
          202 * 3,
          201 * 3,
          0,
          // 159  0000 0000 0011 11
          0,
          0,
          19,
          // 160  0000 0000 0111 00.
          0,
          0,
          22,
          // 161  0000 0000 0110 01.
          197 * 3,
          207 * 3,
          0,
          // 162  0000 0000 0010 00
          0,
          0,
          18,
          // 163  0000 0000 0111 01.
          191 * 3,
          192 * 3,
          0,
          // 164  0000 0000 0001 10
          188 * 3,
          190 * 3,
          0,
          // 165  0000 0000 0001 11
          0,
          0,
          20,
          // 166  0000 0000 0110 11.
          184 * 3,
          194 * 3,
          0,
          // 167  0000 0000 0001 01
          0,
          0,
          21,
          // 168  0000 0000 0110 10.
          186 * 3,
          193 * 3,
          0,
          // 169  0000 0000 0001 00
          0,
          0,
          23,
          // 170  0000 0000 0110 00.
          204 * 3,
          198 * 3,
          0,
          // 171  0000 0000 0011 01
          0,
          0,
          25,
          // 172  0000 0000 0101 10.
          0,
          0,
          24,
          // 173  0000 0000 0101 11.
          200 * 3,
          205 * 3,
          0,
          // 174  0000 0000 0011 00
          0,
          0,
          31,
          // 175  0000 0000 0100 00.
          0,
          0,
          30,
          // 176  0000 0000 0100 01.
          0,
          0,
          28,
          // 177  0000 0000 0100 11.
          0,
          0,
          29,
          // 178  0000 0000 0100 10.
          0,
          0,
          26,
          // 179  0000 0000 0101 01.
          0,
          0,
          17,
          // 180  0000 0000 0111 10.
          0,
          0,
          16,
          // 181  0000 0000 0111 11.
          189 * 3,
          206 * 3,
          0,
          // 182  0000 0000 0010 11
          187 * 3,
          195 * 3,
          0,
          // 183  0000 0000 0010 10
          218 * 3,
          211 * 3,
          0,
          // 184  0000 0000 0001 010
          0,
          0,
          37,
          // 185  0000 0000 0010 011.
          215 * 3,
          216 * 3,
          0,
          // 186  0000 0000 0001 000
          0,
          0,
          36,
          // 187  0000 0000 0010 100.
          210 * 3,
          212 * 3,
          0,
          // 188  0000 0000 0001 110
          0,
          0,
          34,
          // 189  0000 0000 0010 110.
          213 * 3,
          209 * 3,
          0,
          // 190  0000 0000 0001 111
          221 * 3,
          222 * 3,
          0,
          // 191  0000 0000 0001 100
          219 * 3,
          208 * 3,
          0,
          // 192  0000 0000 0001 101
          217 * 3,
          214 * 3,
          0,
          // 193  0000 0000 0001 001
          223 * 3,
          220 * 3,
          0,
          // 194  0000 0000 0001 011
          0,
          0,
          35,
          // 195  0000 0000 0010 101.
          0,
          0,
          267,
          // 196  0000 0000 0011 100.
          0,
          0,
          40,
          // 197  0000 0000 0010 000.
          0,
          0,
          268,
          // 198  0000 0000 0011 011.
          0,
          0,
          266,
          // 199  0000 0000 0011 101.
          0,
          0,
          32,
          // 200  0000 0000 0011 000.
          0,
          0,
          264,
          // 201  0000 0000 0011 111.
          0,
          0,
          265,
          // 202  0000 0000 0011 110.
          0,
          0,
          38,
          // 203  0000 0000 0010 010.
          0,
          0,
          269,
          // 204  0000 0000 0011 010.
          0,
          0,
          270,
          // 205  0000 0000 0011 001.
          0,
          0,
          33,
          // 206  0000 0000 0010 111.
          0,
          0,
          39,
          // 207  0000 0000 0010 001.
          0,
          0,
          7937,
          // 208  0000 0000 0001 1011.
          0,
          0,
          6913,
          // 209  0000 0000 0001 1111.
          0,
          0,
          7681,
          // 210  0000 0000 0001 1100.
          0,
          0,
          4098,
          // 211  0000 0000 0001 0101.
          0,
          0,
          7425,
          // 212  0000 0000 0001 1101.
          0,
          0,
          7169,
          // 213  0000 0000 0001 1110.
          0,
          0,
          271,
          // 214  0000 0000 0001 0011.
          0,
          0,
          274,
          // 215  0000 0000 0001 0000.
          0,
          0,
          273,
          // 216  0000 0000 0001 0001.
          0,
          0,
          272,
          // 217  0000 0000 0001 0010.
          0,
          0,
          1539,
          // 218  0000 0000 0001 0100.
          0,
          0,
          2818,
          // 219  0000 0000 0001 1010.
          0,
          0,
          3586,
          // 220  0000 0000 0001 0111.
          0,
          0,
          3330,
          // 221  0000 0000 0001 1000.
          0,
          0,
          3074,
          // 222  0000 0000 0001 1001.
          0,
          0,
          3842    // 223  0000 0000 0001 0110.
        ]);
        MPEG1.PICTURE_TYPE = {
          INTRA: 1,
          PREDICTIVE: 2,
          B: 3
        };
        MPEG1.START = {
          SEQUENCE: 179,
          SLICE_FIRST: 1,
          SLICE_LAST: 175,
          PICTURE: 0,
          EXTENSION: 181,
          USER_DATA: 178
        };
        return MPEG1;
      }();
      ;
      /*!src/mp2.js*/
      JSMpeg.Decoder.MP2Audio = function () {
        'use strict';
        // Based on kjmp2 by Martin J. Fiedler
        // http://keyj.emphy.de/kjmp2/
        var MP2 = function (options) {
          JSMpeg.Decoder.Base.call(this, options);
          var bufferSize = options.audioBufferSize || 128 * 1024;
          var bufferMode = options.streaming ? JSMpeg.BitBuffer.MODE.EVICT : JSMpeg.BitBuffer.MODE.EXPAND;
          this.bits = new JSMpeg.BitBuffer(bufferSize, bufferMode);
          this.left = new Float32Array(1152);
          this.right = new Float32Array(1152);
          this.sampleRate = 44100;
          this.D = new Float32Array(1024);
          this.D.set(MP2.SYNTHESIS_WINDOW, 0);
          this.D.set(MP2.SYNTHESIS_WINDOW, 512);
          this.V = new Float32Array(1024);
          this.U = new Int32Array(32);
          this.VPos = 0;
          this.allocation = [
            new Array(32),
            new Array(32)
          ];
          this.scaleFactorInfo = [
            new Uint8Array(32),
            new Uint8Array(32)
          ];
          this.scaleFactor = [
            new Array(32),
            new Array(32)
          ];
          this.sample = [
            new Array(32),
            new Array(32)
          ];
          for (var j = 0; j < 2; j++) {
            for (var i = 0; i < 32; i++) {
              this.scaleFactor[j][i] = [
                0,
                0,
                0
              ];
              this.sample[j][i] = [
                0,
                0,
                0
              ];
            }
          }
        };
        MP2.prototype = Object.create(JSMpeg.Decoder.Base.prototype);
        MP2.prototype.constructor = MP2;
        MP2.prototype.decode = function () {
          var pos = this.bits.index >> 3;
          if (pos >= this.bits.byteLength) {
            return false;
          }
          var decoded = this.decodeFrame(this.left, this.right);
          this.bits.index = pos + decoded << 3;
          if (!decoded) {
            return false;
          }
          if (this.destination) {
            this.destination.play(this.sampleRate, this.left, this.right);
          }
          this.advanceDecodedTime(this.left.length / this.sampleRate);
          return true;
        };
        MP2.prototype.getCurrentTime = function () {
          var enqueuedTime = this.destination ? this.destination.enqueuedTime : 0;
          return this.decodedTime - enqueuedTime;
        };
        MP2.prototype.decodeFrame = function (left, right) {
          // Check for valid header: syncword OK, MPEG-Audio Layer 2
          var sync = this.bits.read(11), version = this.bits.read(2), layer = this.bits.read(2), hasCRC = !this.bits.read(1);
          if (sync !== MP2.FRAME_SYNC || version !== MP2.VERSION.MPEG_1 || layer !== MP2.LAYER.II) {
            return 0;    // Invalid header or unsupported version
          }
          var bitrateIndex = this.bits.read(4) - 1;
          if (bitrateIndex > 13) {
            return 0;    // Invalid bit rate or 'free format'
          }
          var sampleRateIndex = this.bits.read(2);
          var sampleRate = MP2.SAMPLE_RATE[sampleRateIndex];
          if (sampleRateIndex === 3) {
            return 0;    // Invalid sample rate
          }
          if (version === MP2.VERSION.MPEG_2) {
            sampleRateIndex += 4;
            bitrateIndex += 14;
          }
          var padding = this.bits.read(1), privat = this.bits.read(1), mode = this.bits.read(2);
          // Parse the mode_extension, set up the stereo bound
          var bound = 0;
          if (mode === MP2.MODE.JOINT_STEREO) {
            bound = this.bits.read(2) + 1 << 2;
          } else {
            this.bits.skip(2);
            bound = mode === MP2.MODE.MONO ? 0 : 32;
          }
          // Discard the last 4 bits of the header and the CRC value, if present
          this.bits.skip(4);
          if (hasCRC) {
            this.bits.skip(16);
          }
          // Compute the frame size
          var bitrate = MP2.BIT_RATE[bitrateIndex], sampleRate = MP2.SAMPLE_RATE[sampleRateIndex], frameSize = 144000 * bitrate / sampleRate + padding | 0;
          // Prepare the quantizer table lookups
          var tab3 = 0;
          var sblimit = 0;
          if (version === MP2.VERSION.MPEG_2) {
            // MPEG-2 (LSR)
            tab3 = 2;
            sblimit = 30;
          } else {
            // MPEG-1
            var tab1 = mode === MP2.MODE.MONO ? 0 : 1;
            var tab2 = MP2.QUANT_LUT_STEP_1[tab1][bitrateIndex];
            tab3 = MP2.QUANT_LUT_STEP_2[tab2][sampleRateIndex];
            sblimit = tab3 & 63;
            tab3 >>= 6;
          }
          if (bound > sblimit) {
            bound = sblimit;
          }
          // Read the allocation information
          for (var sb = 0; sb < bound; sb++) {
            this.allocation[0][sb] = this.readAllocation(sb, tab3);
            this.allocation[1][sb] = this.readAllocation(sb, tab3);
          }
          for (var sb = bound; sb < sblimit; sb++) {
            this.allocation[0][sb] = this.allocation[1][sb] = this.readAllocation(sb, tab3);
          }
          // Read scale factor selector information
          var channels = mode === MP2.MODE.MONO ? 1 : 2;
          for (var sb = 0; sb < sblimit; sb++) {
            for (ch = 0; ch < channels; ch++) {
              if (this.allocation[ch][sb]) {
                this.scaleFactorInfo[ch][sb] = this.bits.read(2);
              }
            }
            if (mode === MP2.MODE.MONO) {
              this.scaleFactorInfo[1][sb] = this.scaleFactorInfo[0][sb];
            }
          }
          // Read scale factors
          for (var sb = 0; sb < sblimit; sb++) {
            for (var ch = 0; ch < channels; ch++) {
              if (this.allocation[ch][sb]) {
                var sf = this.scaleFactor[ch][sb];
                switch (this.scaleFactorInfo[ch][sb]) {
                  case 0:
                    sf[0] = this.bits.read(6);
                    sf[1] = this.bits.read(6);
                    sf[2] = this.bits.read(6);
                    break;
                  case 1:
                    sf[0] = sf[1] = this.bits.read(6);
                    sf[2] = this.bits.read(6);
                    break;
                  case 2:
                    sf[0] = sf[1] = sf[2] = this.bits.read(6);
                    break;
                  case 3:
                    sf[0] = this.bits.read(6);
                    sf[1] = sf[2] = this.bits.read(6);
                    break;
                }
              }
            }
            if (mode === MP2.MODE.MONO) {
              this.scaleFactor[1][sb][0] = this.scaleFactor[0][sb][0];
              this.scaleFactor[1][sb][1] = this.scaleFactor[0][sb][1];
              this.scaleFactor[1][sb][2] = this.scaleFactor[0][sb][2];
            }
          }
          // Coefficient input and reconstruction
          var outPos = 0;
          for (var part = 0; part < 3; part++) {
            for (var granule = 0; granule < 4; granule++) {
              // Read the samples
              for (var sb = 0; sb < bound; sb++) {
                this.readSamples(0, sb, part);
                this.readSamples(1, sb, part);
              }
              for (var sb = bound; sb < sblimit; sb++) {
                this.readSamples(0, sb, part);
                this.sample[1][sb][0] = this.sample[0][sb][0];
                this.sample[1][sb][1] = this.sample[0][sb][1];
                this.sample[1][sb][2] = this.sample[0][sb][2];
              }
              for (var sb = sblimit; sb < 32; sb++) {
                this.sample[0][sb][0] = 0;
                this.sample[0][sb][1] = 0;
                this.sample[0][sb][2] = 0;
                this.sample[1][sb][0] = 0;
                this.sample[1][sb][1] = 0;
                this.sample[1][sb][2] = 0;
              }
              // Synthesis loop
              for (var p = 0; p < 3; p++) {
                // Shifting step
                this.VPos = this.VPos - 64 & 1023;
                for (var ch = 0; ch < 2; ch++) {
                  MP2.MatrixTransform(this.sample[ch], p, this.V, this.VPos);
                  // Build U, windowing, calculate output
                  JSMpeg.Fill(this.U, 0);
                  var dIndex = 512 - (this.VPos >> 1);
                  var vIndex = this.VPos % 128 >> 1;
                  while (vIndex < 1024) {
                    for (var i = 0; i < 32; ++i) {
                      this.U[i] += this.D[dIndex++] * this.V[vIndex++];
                    }
                    vIndex += 128 - 32;
                    dIndex += 64 - 32;
                  }
                  vIndex = 128 - 32 + 1024 - vIndex;
                  dIndex -= 512 - 32;
                  while (vIndex < 1024) {
                    for (var i = 0; i < 32; ++i) {
                      this.U[i] += this.D[dIndex++] * this.V[vIndex++];
                    }
                    vIndex += 128 - 32;
                    dIndex += 64 - 32;
                  }
                  // Output samples
                  var outChannel = ch === 0 ? left : right;
                  for (var j = 0; j < 32; j++) {
                    outChannel[outPos + j] = this.U[j] / 2147418112;
                  }
                }
                // End of synthesis channel loop
                outPos += 32;
              }    // End of synthesis sub-block loop
            }    // Decoding of the granule finished
          }
          this.sampleRate = sampleRate;
          return frameSize;
        };
        MP2.prototype.readAllocation = function (sb, tab3) {
          var tab4 = MP2.QUANT_LUT_STEP_3[tab3][sb];
          var qtab = MP2.QUANT_LUT_STEP4[tab4 & 15][this.bits.read(tab4 >> 4)];
          return qtab ? MP2.QUANT_TAB[qtab - 1] : 0;
        };
        MP2.prototype.readSamples = function (ch, sb, part) {
          var q = this.allocation[ch][sb], sf = this.scaleFactor[ch][sb][part], sample = this.sample[ch][sb], val = 0;
          if (!q) {
            // No bits allocated for this subband
            sample[0] = sample[1] = sample[2] = 0;
            return;
          }
          // Resolve scalefactor
          if (sf === 63) {
            sf = 0;
          } else {
            var shift = sf / 3 | 0;
            sf = MP2.SCALEFACTOR_BASE[sf % 3] + (1 << shift >> 1) >> shift;
          }
          // Decode samples
          var adj = q.levels;
          if (q.group) {
            // Decode grouped samples
            val = this.bits.read(q.bits);
            sample[0] = val % adj;
            val = val / adj | 0;
            sample[1] = val % adj;
            sample[2] = val / adj | 0;
          } else {
            // Decode direct samples
            sample[0] = this.bits.read(q.bits);
            sample[1] = this.bits.read(q.bits);
            sample[2] = this.bits.read(q.bits);
          }
          // Postmultiply samples
          var scale = 65536 / (adj + 1) | 0;
          adj = (adj + 1 >> 1) - 1;
          val = (adj - sample[0]) * scale;
          sample[0] = val * (sf >> 12) + (val * (sf & 4095) + 2048 >> 12) >> 12;
          val = (adj - sample[1]) * scale;
          sample[1] = val * (sf >> 12) + (val * (sf & 4095) + 2048 >> 12) >> 12;
          val = (adj - sample[2]) * scale;
          sample[2] = val * (sf >> 12) + (val * (sf & 4095) + 2048 >> 12) >> 12;
        };
        MP2.MatrixTransform = function (s, ss, d, dp) {
          var t01, t02, t03, t04, t05, t06, t07, t08, t09, t10, t11, t12, t13, t14, t15, t16, t17, t18, t19, t20, t21, t22, t23, t24, t25, t26, t27, t28, t29, t30, t31, t32, t33;
          t01 = s[0][ss] + s[31][ss];
          t02 = (s[0][ss] - s[31][ss]) * 0.500602998235;
          t03 = s[1][ss] + s[30][ss];
          t04 = (s[1][ss] - s[30][ss]) * 0.505470959898;
          t05 = s[2][ss] + s[29][ss];
          t06 = (s[2][ss] - s[29][ss]) * 0.515447309923;
          t07 = s[3][ss] + s[28][ss];
          t08 = (s[3][ss] - s[28][ss]) * 0.53104259109;
          t09 = s[4][ss] + s[27][ss];
          t10 = (s[4][ss] - s[27][ss]) * 0.553103896034;
          t11 = s[5][ss] + s[26][ss];
          t12 = (s[5][ss] - s[26][ss]) * 0.582934968206;
          t13 = s[6][ss] + s[25][ss];
          t14 = (s[6][ss] - s[25][ss]) * 0.622504123036;
          t15 = s[7][ss] + s[24][ss];
          t16 = (s[7][ss] - s[24][ss]) * 0.674808341455;
          t17 = s[8][ss] + s[23][ss];
          t18 = (s[8][ss] - s[23][ss]) * 0.744536271002;
          t19 = s[9][ss] + s[22][ss];
          t20 = (s[9][ss] - s[22][ss]) * 0.839349645416;
          t21 = s[10][ss] + s[21][ss];
          t22 = (s[10][ss] - s[21][ss]) * 0.972568237862;
          t23 = s[11][ss] + s[20][ss];
          t24 = (s[11][ss] - s[20][ss]) * 1.16943993343;
          t25 = s[12][ss] + s[19][ss];
          t26 = (s[12][ss] - s[19][ss]) * 1.48416461631;
          t27 = s[13][ss] + s[18][ss];
          t28 = (s[13][ss] - s[18][ss]) * 2.05778100995;
          t29 = s[14][ss] + s[17][ss];
          t30 = (s[14][ss] - s[17][ss]) * 3.40760841847;
          t31 = s[15][ss] + s[16][ss];
          t32 = (s[15][ss] - s[16][ss]) * 10.1900081235;
          t33 = t01 + t31;
          t31 = (t01 - t31) * 0.502419286188;
          t01 = t03 + t29;
          t29 = (t03 - t29) * 0.52249861494;
          t03 = t05 + t27;
          t27 = (t05 - t27) * 0.566944034816;
          t05 = t07 + t25;
          t25 = (t07 - t25) * 0.64682178336;
          t07 = t09 + t23;
          t23 = (t09 - t23) * 0.788154623451;
          t09 = t11 + t21;
          t21 = (t11 - t21) * 1.06067768599;
          t11 = t13 + t19;
          t19 = (t13 - t19) * 1.72244709824;
          t13 = t15 + t17;
          t17 = (t15 - t17) * 5.10114861869;
          t15 = t33 + t13;
          t13 = (t33 - t13) * 0.509795579104;
          t33 = t01 + t11;
          t01 = (t01 - t11) * 0.601344886935;
          t11 = t03 + t09;
          t09 = (t03 - t09) * 0.899976223136;
          t03 = t05 + t07;
          t07 = (t05 - t07) * 2.56291544774;
          t05 = t15 + t03;
          t15 = (t15 - t03) * 0.541196100146;
          t03 = t33 + t11;
          t11 = (t33 - t11) * 1.30656296488;
          t33 = t05 + t03;
          t05 = (t05 - t03) * 0.707106781187;
          t03 = t15 + t11;
          t15 = (t15 - t11) * 0.707106781187;
          t03 += t15;
          t11 = t13 + t07;
          t13 = (t13 - t07) * 0.541196100146;
          t07 = t01 + t09;
          t09 = (t01 - t09) * 1.30656296488;
          t01 = t11 + t07;
          t07 = (t11 - t07) * 0.707106781187;
          t11 = t13 + t09;
          t13 = (t13 - t09) * 0.707106781187;
          t11 += t13;
          t01 += t11;
          t11 += t07;
          t07 += t13;
          t09 = t31 + t17;
          t31 = (t31 - t17) * 0.509795579104;
          t17 = t29 + t19;
          t29 = (t29 - t19) * 0.601344886935;
          t19 = t27 + t21;
          t21 = (t27 - t21) * 0.899976223136;
          t27 = t25 + t23;
          t23 = (t25 - t23) * 2.56291544774;
          t25 = t09 + t27;
          t09 = (t09 - t27) * 0.541196100146;
          t27 = t17 + t19;
          t19 = (t17 - t19) * 1.30656296488;
          t17 = t25 + t27;
          t27 = (t25 - t27) * 0.707106781187;
          t25 = t09 + t19;
          t19 = (t09 - t19) * 0.707106781187;
          t25 += t19;
          t09 = t31 + t23;
          t31 = (t31 - t23) * 0.541196100146;
          t23 = t29 + t21;
          t21 = (t29 - t21) * 1.30656296488;
          t29 = t09 + t23;
          t23 = (t09 - t23) * 0.707106781187;
          t09 = t31 + t21;
          t31 = (t31 - t21) * 0.707106781187;
          t09 += t31;
          t29 += t09;
          t09 += t23;
          t23 += t31;
          t17 += t29;
          t29 += t25;
          t25 += t09;
          t09 += t27;
          t27 += t23;
          t23 += t19;
          t19 += t31;
          t21 = t02 + t32;
          t02 = (t02 - t32) * 0.502419286188;
          t32 = t04 + t30;
          t04 = (t04 - t30) * 0.52249861494;
          t30 = t06 + t28;
          t28 = (t06 - t28) * 0.566944034816;
          t06 = t08 + t26;
          t08 = (t08 - t26) * 0.64682178336;
          t26 = t10 + t24;
          t10 = (t10 - t24) * 0.788154623451;
          t24 = t12 + t22;
          t22 = (t12 - t22) * 1.06067768599;
          t12 = t14 + t20;
          t20 = (t14 - t20) * 1.72244709824;
          t14 = t16 + t18;
          t16 = (t16 - t18) * 5.10114861869;
          t18 = t21 + t14;
          t14 = (t21 - t14) * 0.509795579104;
          t21 = t32 + t12;
          t32 = (t32 - t12) * 0.601344886935;
          t12 = t30 + t24;
          t24 = (t30 - t24) * 0.899976223136;
          t30 = t06 + t26;
          t26 = (t06 - t26) * 2.56291544774;
          t06 = t18 + t30;
          t18 = (t18 - t30) * 0.541196100146;
          t30 = t21 + t12;
          t12 = (t21 - t12) * 1.30656296488;
          t21 = t06 + t30;
          t30 = (t06 - t30) * 0.707106781187;
          t06 = t18 + t12;
          t12 = (t18 - t12) * 0.707106781187;
          t06 += t12;
          t18 = t14 + t26;
          t26 = (t14 - t26) * 0.541196100146;
          t14 = t32 + t24;
          t24 = (t32 - t24) * 1.30656296488;
          t32 = t18 + t14;
          t14 = (t18 - t14) * 0.707106781187;
          t18 = t26 + t24;
          t24 = (t26 - t24) * 0.707106781187;
          t18 += t24;
          t32 += t18;
          t18 += t14;
          t26 = t14 + t24;
          t14 = t02 + t16;
          t02 = (t02 - t16) * 0.509795579104;
          t16 = t04 + t20;
          t04 = (t04 - t20) * 0.601344886935;
          t20 = t28 + t22;
          t22 = (t28 - t22) * 0.899976223136;
          t28 = t08 + t10;
          t10 = (t08 - t10) * 2.56291544774;
          t08 = t14 + t28;
          t14 = (t14 - t28) * 0.541196100146;
          t28 = t16 + t20;
          t20 = (t16 - t20) * 1.30656296488;
          t16 = t08 + t28;
          t28 = (t08 - t28) * 0.707106781187;
          t08 = t14 + t20;
          t20 = (t14 - t20) * 0.707106781187;
          t08 += t20;
          t14 = t02 + t10;
          t02 = (t02 - t10) * 0.541196100146;
          t10 = t04 + t22;
          t22 = (t04 - t22) * 1.30656296488;
          t04 = t14 + t10;
          t10 = (t14 - t10) * 0.707106781187;
          t14 = t02 + t22;
          t02 = (t02 - t22) * 0.707106781187;
          t14 += t02;
          t04 += t14;
          t14 += t10;
          t10 += t02;
          t16 += t04;
          t04 += t08;
          t08 += t14;
          t14 += t28;
          t28 += t10;
          t10 += t20;
          t20 += t02;
          t21 += t16;
          t16 += t32;
          t32 += t04;
          t04 += t06;
          t06 += t08;
          t08 += t18;
          t18 += t14;
          t14 += t30;
          t30 += t28;
          t28 += t26;
          t26 += t10;
          t10 += t12;
          t12 += t20;
          t20 += t24;
          t24 += t02;
          d[dp + 48] = -t33;
          d[dp + 49] = d[dp + 47] = -t21;
          d[dp + 50] = d[dp + 46] = -t17;
          d[dp + 51] = d[dp + 45] = -t16;
          d[dp + 52] = d[dp + 44] = -t01;
          d[dp + 53] = d[dp + 43] = -t32;
          d[dp + 54] = d[dp + 42] = -t29;
          d[dp + 55] = d[dp + 41] = -t04;
          d[dp + 56] = d[dp + 40] = -t03;
          d[dp + 57] = d[dp + 39] = -t06;
          d[dp + 58] = d[dp + 38] = -t25;
          d[dp + 59] = d[dp + 37] = -t08;
          d[dp + 60] = d[dp + 36] = -t11;
          d[dp + 61] = d[dp + 35] = -t18;
          d[dp + 62] = d[dp + 34] = -t09;
          d[dp + 63] = d[dp + 33] = -t14;
          d[dp + 32] = -t05;
          d[dp + 0] = t05;
          d[dp + 31] = -t30;
          d[dp + 1] = t30;
          d[dp + 30] = -t27;
          d[dp + 2] = t27;
          d[dp + 29] = -t28;
          d[dp + 3] = t28;
          d[dp + 28] = -t07;
          d[dp + 4] = t07;
          d[dp + 27] = -t26;
          d[dp + 5] = t26;
          d[dp + 26] = -t23;
          d[dp + 6] = t23;
          d[dp + 25] = -t10;
          d[dp + 7] = t10;
          d[dp + 24] = -t15;
          d[dp + 8] = t15;
          d[dp + 23] = -t12;
          d[dp + 9] = t12;
          d[dp + 22] = -t19;
          d[dp + 10] = t19;
          d[dp + 21] = -t20;
          d[dp + 11] = t20;
          d[dp + 20] = -t13;
          d[dp + 12] = t13;
          d[dp + 19] = -t24;
          d[dp + 13] = t24;
          d[dp + 18] = -t31;
          d[dp + 14] = t31;
          d[dp + 17] = -t02;
          d[dp + 15] = t02;
          d[dp + 16] = 0;
        };
        MP2.FRAME_SYNC = 2047;
        MP2.VERSION = {
          MPEG_2_5: 0,
          MPEG_2: 2,
          MPEG_1: 3
        };
        MP2.LAYER = {
          III: 1,
          II: 2,
          I: 3
        };
        MP2.MODE = {
          STEREO: 0,
          JOINT_STEREO: 1,
          DUAL_CHANNEL: 2,
          MONO: 3
        };
        MP2.SAMPLE_RATE = new Uint16Array([
          44100,
          48000,
          32000,
          0,
          // MPEG-1
          22050,
          24000,
          16000,
          0    // MPEG-2
        ]);
        MP2.BIT_RATE = new Uint16Array([
          32,
          48,
          56,
          64,
          80,
          96,
          112,
          128,
          160,
          192,
          224,
          256,
          320,
          384,
          // MPEG-1
          8,
          16,
          24,
          32,
          40,
          48,
          56,
          64,
          80,
          96,
          112,
          128,
          144,
          160    // MPEG-2
        ]);
        MP2.SCALEFACTOR_BASE = new Uint32Array([
          33554432,
          26632170,
          21137968
        ]);
        MP2.SYNTHESIS_WINDOW = new Float32Array([
          0,
          -0.5,
          -0.5,
          -0.5,
          -0.5,
          -0.5,
          -0.5,
          -1,
          -1,
          -1,
          -1,
          -1.5,
          -1.5,
          -2,
          -2,
          -2.5,
          -2.5,
          -3,
          -3.5,
          -3.5,
          -4,
          -4.5,
          -5,
          -5.5,
          -6.5,
          -7,
          -8,
          -8.5,
          -9.5,
          -10.5,
          -12,
          -13,
          -14.5,
          -15.5,
          -17.5,
          -19,
          -20.5,
          -22.5,
          -24.5,
          -26.5,
          -29,
          -31.5,
          -34,
          -36.5,
          -39.5,
          -42.5,
          -45.5,
          -48.5,
          -52,
          -55.5,
          -58.5,
          -62.5,
          -66,
          -69.5,
          -73.5,
          -77,
          -80.5,
          -84.5,
          -88,
          -91.5,
          -95,
          -98,
          -101,
          -104,
          106.5,
          109,
          111,
          112.5,
          113.5,
          114,
          114,
          113.5,
          112,
          110.5,
          107.5,
          104,
          100,
          94.5,
          88.5,
          81.5,
          73,
          63.5,
          53,
          41.5,
          28.5,
          14.5,
          -1,
          -18,
          -36,
          -55.5,
          -76.5,
          -98.5,
          -122,
          -147,
          -173.5,
          -200.5,
          -229.5,
          -259.5,
          -290.5,
          -322.5,
          -355.5,
          -389.5,
          -424,
          -459.5,
          -495.5,
          -532,
          -568.5,
          -605,
          -641.5,
          -678,
          -714,
          -749,
          -783.5,
          -817,
          -849,
          -879.5,
          -908.5,
          -935,
          -959.5,
          -981,
          -1000.5,
          -1016,
          -1028.5,
          -1037.5,
          -1042.5,
          -1043.5,
          -1040,
          -1031.5,
          1018.5,
          1000,
          976,
          946.5,
          911,
          869.5,
          822,
          767.5,
          707,
          640,
          565.5,
          485,
          397,
          302.5,
          201,
          92.5,
          -22.5,
          -144,
          -272.5,
          -407,
          -547.5,
          -694,
          -846,
          -1003,
          -1165,
          -1331.5,
          -1502,
          -1675.5,
          -1852.5,
          -2031.5,
          -2212.5,
          -2394,
          -2576.5,
          -2758.5,
          -2939.5,
          -3118.5,
          -3294.5,
          -3467.5,
          -3635.5,
          -3798.5,
          -3955,
          -4104.5,
          -4245.5,
          -4377.5,
          -4499,
          -4609.5,
          -4708,
          -4792.5,
          -4863.5,
          -4919,
          -4958,
          -4979.5,
          -4983,
          -4967.5,
          -4931.5,
          -4875,
          -4796,
          -4694.5,
          -4569.5,
          -4420,
          -4246,
          -4046,
          -3820,
          -3567,
          3287,
          2979.5,
          2644,
          2280.5,
          1888,
          1467.5,
          1018.5,
          541,
          35,
          -499,
          -1061,
          -1650,
          -2266.5,
          -2909,
          -3577,
          -4270,
          -4987.5,
          -5727.5,
          -6490,
          -7274,
          -8077.5,
          -8899.5,
          -9739,
          -10594.5,
          -11464.5,
          -12347,
          -13241,
          -14144.5,
          -15056,
          -15973.5,
          -16895.5,
          -17820,
          -18744.5,
          -19668,
          -20588,
          -21503,
          -22410.5,
          -23308.5,
          -24195,
          -25068.5,
          -25926.5,
          -26767,
          -27589,
          -28389,
          -29166.5,
          -29919,
          -30644.5,
          -31342,
          -32009.5,
          -32645,
          -33247,
          -33814.5,
          -34346,
          -34839.5,
          -35295,
          -35710,
          -36084.5,
          -36417.5,
          -36707.5,
          -36954,
          -37156.5,
          -37315,
          -37428,
          -37496,
          37519,
          37496,
          37428,
          37315,
          37156.5,
          36954,
          36707.5,
          36417.5,
          36084.5,
          35710,
          35295,
          34839.5,
          34346,
          33814.5,
          33247,
          32645,
          32009.5,
          31342,
          30644.5,
          29919,
          29166.5,
          28389,
          27589,
          26767,
          25926.5,
          25068.5,
          24195,
          23308.5,
          22410.5,
          21503,
          20588,
          19668,
          18744.5,
          17820,
          16895.5,
          15973.5,
          15056,
          14144.5,
          13241,
          12347,
          11464.5,
          10594.5,
          9739,
          8899.5,
          8077.5,
          7274,
          6490,
          5727.5,
          4987.5,
          4270,
          3577,
          2909,
          2266.5,
          1650,
          1061,
          499,
          -35,
          -541,
          -1018.5,
          -1467.5,
          -1888,
          -2280.5,
          -2644,
          -2979.5,
          3287,
          3567,
          3820,
          4046,
          4246,
          4420,
          4569.5,
          4694.5,
          4796,
          4875,
          4931.5,
          4967.5,
          4983,
          4979.5,
          4958,
          4919,
          4863.5,
          4792.5,
          4708,
          4609.5,
          4499,
          4377.5,
          4245.5,
          4104.5,
          3955,
          3798.5,
          3635.5,
          3467.5,
          3294.5,
          3118.5,
          2939.5,
          2758.5,
          2576.5,
          2394,
          2212.5,
          2031.5,
          1852.5,
          1675.5,
          1502,
          1331.5,
          1165,
          1003,
          846,
          694,
          547.5,
          407,
          272.5,
          144,
          22.5,
          -92.5,
          -201,
          -302.5,
          -397,
          -485,
          -565.5,
          -640,
          -707,
          -767.5,
          -822,
          -869.5,
          -911,
          -946.5,
          -976,
          -1000,
          1018.5,
          1031.5,
          1040,
          1043.5,
          1042.5,
          1037.5,
          1028.5,
          1016,
          1000.5,
          981,
          959.5,
          935,
          908.5,
          879.5,
          849,
          817,
          783.5,
          749,
          714,
          678,
          641.5,
          605,
          568.5,
          532,
          495.5,
          459.5,
          424,
          389.5,
          355.5,
          322.5,
          290.5,
          259.5,
          229.5,
          200.5,
          173.5,
          147,
          122,
          98.5,
          76.5,
          55.5,
          36,
          18,
          1,
          -14.5,
          -28.5,
          -41.5,
          -53,
          -63.5,
          -73,
          -81.5,
          -88.5,
          -94.5,
          -100,
          -104,
          -107.5,
          -110.5,
          -112,
          -113.5,
          -114,
          -114,
          -113.5,
          -112.5,
          -111,
          -109,
          106.5,
          104,
          101,
          98,
          95,
          91.5,
          88,
          84.5,
          80.5,
          77,
          73.5,
          69.5,
          66,
          62.5,
          58.5,
          55.5,
          52,
          48.5,
          45.5,
          42.5,
          39.5,
          36.5,
          34,
          31.5,
          29,
          26.5,
          24.5,
          22.5,
          20.5,
          19,
          17.5,
          15.5,
          14.5,
          13,
          12,
          10.5,
          9.5,
          8.5,
          8,
          7,
          6.5,
          5.5,
          5,
          4.5,
          4,
          3.5,
          3.5,
          3,
          2.5,
          2.5,
          2,
          2,
          1.5,
          1.5,
          1,
          1,
          1,
          1,
          0.5,
          0.5,
          0.5,
          0.5,
          0.5,
          0.5
        ]);
        // Quantizer lookup, step 1: bitrate classes
        MP2.QUANT_LUT_STEP_1 = [
          // 32, 48, 56, 64, 80, 96,112,128,160,192,224,256,320,384 <- bitrate
          [
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2
          ],
          // mono
          // 16, 24, 28, 32, 40, 48, 56, 64, 80, 96,112,128,160,192 <- bitrate / chan
          [
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            2
          ]    // stereo
        ];
        // Quantizer lookup, step 2: bitrate class, sample rate -> B2 table idx, sblimit
        MP2.QUANT_TAB = {
          A: 27 | 64,
          // Table 3-B.2a: high-rate, sblimit = 27
          B: 30 | 64,
          // Table 3-B.2b: high-rate, sblimit = 30
          C: 8,
          // Table 3-B.2c:  low-rate, sblimit =  8
          D: 12    // Table 3-B.2d:  low-rate, sblimit = 12
        };
        MP2.QUANT_LUT_STEP_2 = [
          //   44.1 kHz,        48 kHz,          32 kHz
          [
            MP2.QUANT_TAB.C,
            MP2.QUANT_TAB.C,
            MP2.QUANT_TAB.D
          ],
          // 32 - 48 kbit/sec/ch
          [
            MP2.QUANT_TAB.A,
            MP2.QUANT_TAB.A,
            MP2.QUANT_TAB.A
          ],
          // 56 - 80 kbit/sec/ch
          [
            MP2.QUANT_TAB.B,
            MP2.QUANT_TAB.A,
            MP2.QUANT_TAB.B
          ]    // 96+   kbit/sec/ch
        ];
        // Quantizer lookup, step 3: B2 table, subband -> nbal, row index
        // (upper 4 bits: nbal, lower 4 bits: row index)
        MP2.QUANT_LUT_STEP_3 = [
          // Low-rate table (3-B.2c and 3-B.2d)
          [
            68,
            68,
            52,
            52,
            52,
            52,
            52,
            52,
            52,
            52,
            52,
            52
          ],
          // High-rate table (3-B.2a and 3-B.2b)
          [
            67,
            67,
            67,
            66,
            66,
            66,
            66,
            66,
            66,
            66,
            66,
            49,
            49,
            49,
            49,
            49,
            49,
            49,
            49,
            49,
            49,
            49,
            49,
            32,
            32,
            32,
            32,
            32,
            32,
            32
          ],
          // MPEG-2 LSR table (B.2 in ISO 13818-3)
          [
            69,
            69,
            69,
            69,
            52,
            52,
            52,
            52,
            52,
            52,
            52,
            36,
            36,
            36,
            36,
            36,
            36,
            36,
            36,
            36,
            36,
            36,
            36,
            36,
            36,
            36,
            36,
            36,
            36,
            36
          ]
        ];
        // Quantizer lookup, step 4: table row, allocation[] value -> quant table index
        MP2.QUANT_LUT_STEP4 = [
          [
            0,
            1,
            2,
            17
          ],
          [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            17
          ],
          [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            17
          ],
          [
            0,
            1,
            3,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17
          ],
          [
            0,
            1,
            2,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            17
          ],
          [
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15
          ]
        ];
        MP2.QUANT_TAB = [
          {
            levels: 3,
            group: 1,
            bits: 5
          },
          //  1
          {
            levels: 5,
            group: 1,
            bits: 7
          },
          //  2
          {
            levels: 7,
            group: 0,
            bits: 3
          },
          //  3
          {
            levels: 9,
            group: 1,
            bits: 10
          },
          //  4
          {
            levels: 15,
            group: 0,
            bits: 4
          },
          //  5
          {
            levels: 31,
            group: 0,
            bits: 5
          },
          //  6
          {
            levels: 63,
            group: 0,
            bits: 6
          },
          //  7
          {
            levels: 127,
            group: 0,
            bits: 7
          },
          //  8
          {
            levels: 255,
            group: 0,
            bits: 8
          },
          //  9
          {
            levels: 511,
            group: 0,
            bits: 9
          },
          // 10
          {
            levels: 1023,
            group: 0,
            bits: 10
          },
          // 11
          {
            levels: 2047,
            group: 0,
            bits: 11
          },
          // 12
          {
            levels: 4095,
            group: 0,
            bits: 12
          },
          // 13
          {
            levels: 8191,
            group: 0,
            bits: 13
          },
          // 14
          {
            levels: 16383,
            group: 0,
            bits: 14
          },
          // 15
          {
            levels: 32767,
            group: 0,
            bits: 15
          },
          // 16
          {
            levels: 65535,
            group: 0,
            bits: 16
          }    // 17
        ];
        return MP2;
      }();
      ;
      /*!src/webgl.js*/
      JSMpeg.Renderer.WebGL = function () {
        'use strict';
        var WebGLRenderer = function (options) {
          this.canvas = options.canvas || document.createElement('canvas');
          this.width = this.canvas.width;
          this.height = this.canvas.height;
          this.enabled = true;
          var contextCreateOptions = {
            preserveDrawingBuffer: !!options.preserveDrawingBuffer,
            alpha: false,
            depth: false,
            stencil: false,
            antialias: false
          };
          this.gl = this.canvas.getContext('webgl', contextCreateOptions) || this.canvas.getContext('experimental-webgl', contextCreateOptions);
          if (!this.gl) {
            throw new Error('Failed to get WebGL Context');
          }
          var gl = this.gl;
          var vertexAttr = null;
          // Init buffers
          this.vertexBuffer = gl.createBuffer();
          var vertexCoords = new Float32Array([
            0,
            0,
            0,
            1,
            1,
            0,
            1,
            1
          ]);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, vertexCoords, gl.STATIC_DRAW);
          // Setup the main YCrCbToRGBA shader
          this.program = this.createProgram(WebGLRenderer.SHADER.VERTEX_IDENTITY, WebGLRenderer.SHADER.FRAGMENT_YCRCB_TO_RGBA);
          vertexAttr = gl.getAttribLocation(this.program, 'vertex');
          gl.enableVertexAttribArray(vertexAttr);
          gl.vertexAttribPointer(vertexAttr, 2, gl.FLOAT, false, 0, 0);
          this.textureY = this.createTexture(0, 'textureY');
          this.textureCb = this.createTexture(1, 'textureCb');
          this.textureCr = this.createTexture(2, 'textureCr');
          // Setup the loading animation shader
          this.loadingProgram = this.createProgram(WebGLRenderer.SHADER.VERTEX_IDENTITY, WebGLRenderer.SHADER.FRAGMENT_LOADING);
          vertexAttr = gl.getAttribLocation(this.loadingProgram, 'vertex');
          gl.enableVertexAttribArray(vertexAttr);
          gl.vertexAttribPointer(vertexAttr, 2, gl.FLOAT, false, 0, 0);
          this.shouldCreateUnclampedViews = !this.allowsClampedTextureData();
        };
        WebGLRenderer.prototype.destroy = function () {
          var gl = this.gl;
          gl.deleteTexture(this.textureY);
          gl.deleteTexture(this.textureCb);
          gl.deleteTexture(this.textureCr);
          gl.deleteProgram(this.program);
          gl.deleteProgram(this.loadingProgram);
          gl.deleteBuffer(this.vertexBuffer);
        };
        WebGLRenderer.prototype.resize = function (width, height) {
          this.width = width | 0;
          this.height = height | 0;
          this.canvas.width = this.width;
          this.canvas.height = this.height;
          this.gl.useProgram(this.program);
          this.gl.viewport(0, 0, this.width, this.height);
        };
        WebGLRenderer.prototype.createTexture = function (index, name) {
          var gl = this.gl;
          var texture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.uniform1i(gl.getUniformLocation(this.program, name), index);
          return texture;
        };
        WebGLRenderer.prototype.createProgram = function (vsh, fsh) {
          var gl = this.gl;
          var program = gl.createProgram();
          gl.attachShader(program, this.compileShader(gl.VERTEX_SHADER, vsh));
          gl.attachShader(program, this.compileShader(gl.FRAGMENT_SHADER, fsh));
          gl.linkProgram(program);
          gl.useProgram(program);
          return program;
        };
        WebGLRenderer.prototype.compileShader = function (type, source) {
          var gl = this.gl;
          var shader = gl.createShader(type);
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
          }
          return shader;
        };
        WebGLRenderer.prototype.allowsClampedTextureData = function () {
          var gl = this.gl;
          var texture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, 1, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, new Uint8ClampedArray([0]));
          return gl.getError() === 0;
        };
        WebGLRenderer.prototype.renderProgress = function (progress) {
          var gl = this.gl;
          gl.useProgram(this.loadingProgram);
          var loc = gl.getUniformLocation(this.loadingProgram, 'progress');
          gl.uniform1f(loc, progress);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };
        WebGLRenderer.prototype.render = function (y, cb, cr) {
          if (!this.enabled) {
            return;
          }
          var gl = this.gl;
          var w = this.width + 15 >> 4 << 4, h = this.height, w2 = w >> 1, h2 = h >> 1;
          // In some browsers WebGL doesn't like Uint8ClampedArrays (this is a bug
          // and should be fixed soon-ish), so we have to create a Uint8Array view 
          // for each plane.
          if (this.shouldCreateUnclampedViews) {
            y = new Uint8Array(y.buffer), cb = new Uint8Array(cb.buffer), cr = new Uint8Array(cr.buffer);
          }
          gl.useProgram(this.program);
          this.updateTexture(gl.TEXTURE0, this.textureY, w, h, y);
          this.updateTexture(gl.TEXTURE1, this.textureCb, w2, h2, cb);
          this.updateTexture(gl.TEXTURE2, this.textureCr, w2, h2, cr);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };
        WebGLRenderer.prototype.updateTexture = function (unit, texture, w, h, data) {
          var gl = this.gl;
          gl.activeTexture(unit);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, w, h, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
        };
        WebGLRenderer.IsSupported = function () {
          try {
            if (!window.WebGLRenderingContext) {
              return false;
            }
            var canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
          } catch (err) {
            return false;
          }
        };
        WebGLRenderer.SHADER = {
          FRAGMENT_YCRCB_TO_RGBA: [
            'precision mediump float;',
            'uniform sampler2D textureY;',
            'uniform sampler2D textureCb;',
            'uniform sampler2D textureCr;',
            'varying vec2 texCoord;',
            'mat4 rec601 = mat4(',
            '1.16438,  0.00000,  1.59603, -0.87079,',
            '1.16438, -0.39176, -0.81297,  0.52959,',
            '1.16438,  2.01723,  0.00000, -1.08139,',
            '0, 0, 0, 1',
            ');',
            'void main() {',
            'float y = texture2D(textureY, texCoord).r;',
            'float cb = texture2D(textureCb, texCoord).r;',
            'float cr = texture2D(textureCr, texCoord).r;',
            'gl_FragColor = vec4(y, cr, cb, 1.0) * rec601;',
            '}'
          ].join('\n'),
          FRAGMENT_LOADING: [
            'precision mediump float;',
            'uniform float progress;',
            'varying vec2 texCoord;',
            'void main() {',
            'float c = ceil(progress-(1.0-texCoord.y));',
            'gl_FragColor = vec4(c,c,c,1);',
            '}'
          ].join('\n'),
          VERTEX_IDENTITY: [
            'attribute vec2 vertex;',
            'varying vec2 texCoord;',
            'void main() {',
            'texCoord = vertex;',
            'gl_Position = vec4((vertex * 2.0 - 1.0) * vec2(1, -1), 0.0, 1.0);',
            '}'
          ].join('\n')
        };
        return WebGLRenderer;
      }();
      ;
      /*!src/canvas2d.js*/
      JSMpeg.Renderer.Canvas2D = function () {
        'use strict';
        var CanvasRenderer = function (options) {
          this.canvas = options.canvas || document.createElement('canvas');
          this.width = this.canvas.width;
          this.height = this.canvas.height;
          this.enabled = true;
          this.context = this.canvas.getContext('2d');
        };
        CanvasRenderer.prototype.destroy = function () {
        };
        CanvasRenderer.prototype.resize = function (width, height) {
          this.width = width | 0;
          this.height = height | 0;
          this.canvas.width = this.width;
          this.canvas.height = this.height;
          this.imageData = this.context.getImageData(0, 0, this.width, this.height);
          JSMpeg.Fill(this.imageData.data, 255);
        };
        CanvasRenderer.prototype.renderProgress = function (progress) {
          var w = this.canvas.width, h = this.canvas.height, ctx = this.context;
          ctx.fillStyle = '#222';
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, h - h * progress, w, h * progress);
        };
        CanvasRenderer.prototype.render = function (y, cb, cr) {
          this.YCbCrToRGBA(y, cb, cr, this.imageData.data);
          this.context.putImageData(this.imageData, 0, 0);
        };
        CanvasRenderer.prototype.YCbCrToRGBA = function (y, cb, cr, rgba) {
          if (!this.enabled) {
            return;
          }
          // Chroma values are the same for each block of 4 pixels, so we proccess
          // 2 lines at a time, 2 neighboring pixels each.
          // I wish we could use 32bit writes to the RGBA buffer instead of writing
          // each byte separately, but we need the automatic clamping of the RGBA
          // buffer.
          var w = this.width + 15 >> 4 << 4, w2 = w >> 1;
          var yIndex1 = 0, yIndex2 = w, yNext2Lines = w + (w - this.width);
          var cIndex = 0, cNextLine = w2 - (this.width >> 1);
          var rgbaIndex1 = 0, rgbaIndex2 = this.width * 4, rgbaNext2Lines = this.width * 4;
          var cols = this.width >> 1, rows = this.height >> 1;
          var ccb, ccr, r, g, b;
          for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {
              ccb = cb[cIndex];
              ccr = cr[cIndex];
              cIndex++;
              r = ccb + (ccb * 103 >> 8) - 179;
              g = (ccr * 88 >> 8) - 44 + (ccb * 183 >> 8) - 91;
              b = ccr + (ccr * 198 >> 8) - 227;
              // Line 1
              var y1 = y[yIndex1++];
              var y2 = y[yIndex1++];
              rgba[rgbaIndex1] = y1 + r;
              rgba[rgbaIndex1 + 1] = y1 - g;
              rgba[rgbaIndex1 + 2] = y1 + b;
              rgba[rgbaIndex1 + 4] = y2 + r;
              rgba[rgbaIndex1 + 5] = y2 - g;
              rgba[rgbaIndex1 + 6] = y2 + b;
              rgbaIndex1 += 8;
              // Line 2
              var y3 = y[yIndex2++];
              var y4 = y[yIndex2++];
              rgba[rgbaIndex2] = y3 + r;
              rgba[rgbaIndex2 + 1] = y3 - g;
              rgba[rgbaIndex2 + 2] = y3 + b;
              rgba[rgbaIndex2 + 4] = y4 + r;
              rgba[rgbaIndex2 + 5] = y4 - g;
              rgba[rgbaIndex2 + 6] = y4 + b;
              rgbaIndex2 += 8;
            }
            yIndex1 += yNext2Lines;
            yIndex2 += yNext2Lines;
            rgbaIndex1 += rgbaNext2Lines;
            rgbaIndex2 += rgbaNext2Lines;
            cIndex += cNextLine;
          }
        };
        return CanvasRenderer;
      }();
      ;
      /*!src/webaudio.js*/
      JSMpeg.AudioOutput.WebAudio = function () {
        'use strict';
        var WebAudioOut = function (options) {
          this.context = WebAudioOut.CachedContext = WebAudioOut.CachedContext || new (window.AudioContext || window.webkitAudioContext)();
          this.gain = this.context.createGain();
          this.destination = this.gain;
          // Keep track of the number of connections to this AudioContext, so we
          // can safely close() it when we're the only one connected to it.
          this.gain.connect(this.context.destination);
          this.context._connections = (this.context._connections || 0) + 1;
          this.startTime = 0;
          this.buffer = null;
          this.wallclockStartTime = 0;
          this.volume = 1;
          this.enabled = true;
          this.unlocked = !WebAudioOut.NeedsUnlocking();
          Object.defineProperty(this, 'enqueuedTime', { get: this.getEnqueuedTime });
        };
        WebAudioOut.prototype.destroy = function () {
          this.gain.disconnect();
          this.context._connections--;
          if (this.context._connections === 0) {
            this.context.close();
            WebAudioOut.CachedContext = null;
          }
        };
        WebAudioOut.prototype.play = function (sampleRate, left, right) {
          if (!this.enabled) {
            return;
          }
          // If the context is not unlocked yet, we simply advance the start time
          // to "fake" actually playing audio. This will keep the video in sync.
          if (!this.unlocked) {
            var ts = JSMpeg.Now();
            if (this.wallclockStartTime < ts) {
              this.wallclockStartTime = ts;
            }
            this.wallclockStartTime += left.length / sampleRate;
            return;
          }
          this.gain.gain.value = this.volume;
          var buffer = this.context.createBuffer(2, left.length, sampleRate);
          buffer.getChannelData(0).set(left);
          buffer.getChannelData(1).set(right);
          var source = this.context.createBufferSource();
          source.buffer = buffer;
          source.connect(this.destination);
          var now = this.context.currentTime;
          var duration = buffer.duration;
          if (this.startTime < now) {
            this.startTime = now;
            this.wallclockStartTime = JSMpeg.Now();
          }
          source.start(this.startTime);
          this.startTime += duration;
          this.wallclockStartTime += duration;
        };
        WebAudioOut.prototype.stop = function () {
          // Meh; there seems to be no simple way to get a list of currently
          // active source nodes from the Audio Context, and maintaining this
          // list ourselfs would be a pain, so we just set the gain to 0
          // to cut off all enqueued audio instantly.
          this.gain.gain.value = 0;
        };
        WebAudioOut.prototype.getEnqueuedTime = function () {
          // The AudioContext.currentTime is only updated every so often, so if we
          // want to get exact timing, we need to rely on the system time.
          return Math.max(this.wallclockStartTime - JSMpeg.Now(), 0);
        };
        WebAudioOut.prototype.resetEnqueuedTime = function () {
          this.startTime = this.context.currentTime;
          this.wallclockStartTime = JSMpeg.Now();
        };
        WebAudioOut.prototype.unlock = function (callback) {
          if (this.unlocked) {
            if (callback) {
              callback();
            }
            return;
          }
          this.unlockCallback = callback;
          // Create empty buffer and play it
          var buffer = this.context.createBuffer(1, 1, 22050);
          var source = this.context.createBufferSource();
          source.buffer = buffer;
          source.connect(this.destination);
          source.start(0);
          setTimeout(this.checkIfUnlocked.bind(this, source, 0), 0);
        };
        WebAudioOut.prototype.checkIfUnlocked = function (source, attempt) {
          if (source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE) {
            this.unlocked = true;
            if (this.unlockCallback) {
              this.unlockCallback();
              this.unlockCallback = null;
            }
          } else if (attempt < 10) {
            // Jeez, what a shit show. Thanks iOS!
            setTimeout(this.checkIfUnlocked.bind(this, source, attempt + 1), 100);
          }
        };
        WebAudioOut.NeedsUnlocking = function () {
          return /iPhone|iPad|iPod/i.test(navigator.userAgent);
        };
        WebAudioOut.IsSupported = function () {
          return window.AudioContext || window.webkitAudioContext;
        };
        WebAudioOut.CachedContext = null;
        return WebAudioOut;
      }();
      return JSMpeg;
    });

    // ======================
    // mip-story/video-detector.js
    // ======================


    /**
     * @file detector.js 检测是否使用video原生播放
     * @author venyxiong
     */
    define('mip-story/video-detector', ['require'], function (require) {
      'use strict';
      var UA = navigator.userAgent.toLowerCase();
      var badUaList = ['baiduboxapp'];
      function isIPhone () {
        return UA.indexOf('iphone') > -1;
      }
      function isBadUA () {
        var badUA = 0;
        badUaList.forEach(function (val) {
          if (UA.indexOf(val) > -1) {
            badUA = 1;
          }
        });
        return badUA;
      }
      function isRenderVideoElement () {
        return isIPhone() && isBadUA();
      }
      return { isRenderVideoElement: isRenderVideoElement };
    });

    // ======================
    // mip-story/mip-story-video.js
    // ======================


    /**
     * @file mip-story-jsmpeg 组件
     * @author
     */
    define('mip-story/mip-story-video', [
      'require',
      'customElement',
      './jsmpeg/jsmpeg',
      'util',
      './video-detector'
    ], function (require) {
      'use strict';
      var customElement = require('customElement').create();
      var JSMpeg = require('./jsmpeg/jsmpeg');
      var util = require('util');
      var Detector = require('./video-detector');
      var css = util.css;
      var dm = util.dom;
      customElement.prototype.initStoryVideoElement = function () {
        var sourceList = [];
        this.attributes = getAttributeSet(this.element.attributes);
        this.sourceDoms = this.element.querySelectorAll('source');
        Array.prototype.slice.apply(this.sourceDoms).forEach(function (node) {
          sourceList[node.type] = node.src;
        });
        this.sourceList = sourceList;
        if (Detector.isRenderVideoElement()) {
          this.isVideo = true;
          this.renderVideoElement();
        } else {
          this.isVideo = false;
          this.renderJSMpeg();
        }
      };
      /**
       * [renderVideoElement 渲染video标签用于播放]
       *
       */
      customElement.prototype.renderVideoElement = function () {
        var poster = this.attributes.poster;
        var height = this.attributes.height;
        var width = this.attributes.width;
        var sourceHTML = this.element.innerHTML;
        var loop = '';
        var isLoop = this.attributes.loop;
        if (isLoop !== '' && (!isLoop || isLoop === 'false')) {
          loop = '';
        } else {
          loop = 'loop';
        }
        var html = '<mip-video layout="responsive" ' + loop + ' class="mip-fill-content mip-replaced-content" autoplay height="' + height + '" width="' + width + '" poster="' + poster + '">' + sourceHTML + '</mip-video>';
        var videoElement = dm.create(html);
        this.element.parentNode.insertBefore(videoElement, this.element);
        this.player = videoElement.querySelector('video');
      };
      /**
       * [renderJSMpeg 创建 jsMpege播放器]
       */
      customElement.prototype.renderJSMpeg = function () {
        var self = this;
        var posterEl = document.createElement('div');
        var canvas = document.createElement('canvas');
        canvas.className = 'mip-fill-content mip-replaced-content';
        css(canvas, { opacity: '0' });
        var tsUrl = this.sourceList['video/ts'];
        if (!tsUrl) {
          console.error('ts file is require');
          return;
        }
        // 渲染poster;
        if (this.attributes.poster) {
          posterEl.style.backgroundImage = 'url(' + this.attributes.poster + ')';
          posterEl.style.backgroundSize = '100% 100%';
          posterEl.className = 'mip-fill-content mip-replaced-content';
          this.element.appendChild(posterEl);
        }
        this.attributes.canvas = canvas;
        this.element.appendChild(canvas);
        this.option = this.attributes;
        // // 配置上，只需要对loop做处理
        var isLoop = this.option.loop;
        if (isLoop !== '' && (!isLoop || isLoop === 'false')) {
          this.option.loop = false;
        } else {
          this.option.loop = true;
        }
        this.player = new JSMpeg.Player(tsUrl, this.option);
        this.player.on('playing', function () {
          var event = new Event('playing');
          // 开始播放时展示canvas
          css(canvas, { opacity: '1' });
          self.element.dispatchEvent(event);
        });
        this.player.on('play', function () {
          var event = new Event('play');
          self.element.dispatchEvent(event);
        });
        this.player.on('end', function () {
          var event = new Event('end');
          self.element.dispatchEvent(event);
        });
        this.stop();
      };
      customElement.prototype.play = function () {
        if (!this.isVideo) {
          var self = this;
          setTimeout(function () {
            self.player.play();
            self.unlockAudio();
          }, 0);
        }
      };
      customElement.prototype.unlockAudio = function () {
        this.player.audioOut.unlock();
      };
      customElement.prototype.stop = function () {
        if (!this.isVideo) {
          this.player.stop();
        }
      };
      customElement.prototype.pause = function () {
        if (!this.isVideo) {
          this.this.player.pause();
        }
      };
      customElement.prototype.attributeChangedCallback = function () {
        if (this.element.hasAttribute('preload') && !this.loaded) {
          this.initStoryVideoElement();
          this.loaded = true;
        }
      };
      customElement.prototype.firstInviewCallback = function () {
        this.loaded = false;    // this.initStoryVideoElement();
      };
      function getAttributeSet (attributes) {
        var attrs = {};
        Array.prototype.slice.apply(attributes).forEach(function (attr) {
          attrs[attr.name] = attr.value;
        });
        return attrs;
      }
      /* eslint-disable */
      MIP.registerMipElement('mip-story-video', customElement);
      return customElement;
    });

    // ======================
    // mip-story/mip-story-img.js
    // ======================


    /**
     * @file mip-story-jsmpeg 组件
     * @author
     */
    define('mip-story/mip-story-img', [
      'require',
      'customElement',
      'util'
    ], function (require) {
      'use strict';
      var customElement = require('customElement').create();
      var util = require('util');
      var dm = util.dom;
      function getAttributeSet (attributes) {
        var attrs = {};
        Array.prototype.slice.apply(attributes).forEach(function (attr) {
          attrs[attr.name] = attr.value;
        });
        return attrs;
      }
      function getJsonString (attrs) {
        var attrString = '';
        for (var prop in attrs) {
          attrString += prop + '=' + attrs[prop] + ' ';
        }
        return attrString;
      }
      customElement.prototype.initStoryImg = function () {
        this.attributes = getAttributeSet(this.element.attributes);
        var attrString = getJsonString(this.attributes);
        var imgHtml = '<mip-img ' + attrString + '></mip-img>';
        var storyImg = dm.create(imgHtml);
        this.element.parentNode.insertBefore(storyImg, this.element);
      };
      customElement.prototype.attributeChangedCallback = function () {
        if (this.element.hasAttribute('preload') && !this.loaded) {
          this.initStoryImg();
          this.loaded = true;
        }
      };
      customElement.prototype.firstInviewCallback = function () {
        this.loaded = false;
      };
      /* eslint-disable */
      MIP.registerMipElement('mip-story-img', customElement);
      return customElement;
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
            var offsetX = -(offset.realLeft + offset.width);
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
            var offsetX = offset.pageWidth - offset.realLeft;
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
            var offsetX = -(offset.realLeft + offset.width);
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
            var offsetX = offset.realLeft + offset.width;
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
            var offsetX = -(offset.realLeft + offset.width);
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
            var offsetX = offset.realLeft + offset.width;
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
        this.animationType = animationDef.animationType;
        this.animationName = animationDef.animationName;
        this.duration = animationDef.duration;
        this.delay = animationDef.delay;
        this.el = el;
        this.animationDef = animationDef;
        this.isRunner = 1;
        this.create();
        this.isStart = 0;
      }
      AnimationRunner.prototype.create = function () {
        if (this.animationType === 'CSS_ANIMATION') {
          var self = this;
          this.el.classList.add('mip-story-hidden');
          if (self.delay) {
            css(self.el, { 'animation-delay': self.delay + 'ms' });
          }
          if (self.duration) {
            css(self.el, { 'animation-duration': self.duration + 'ms' });
          }
          this.runner = { el: self.el };
        } else {
          var animationDef = this.animationDef;
          animationDef.easing.fill = 'forwards';
          this.runner = this.el.animate(animationDef.keyframes, animationDef.easing);
          this.pause();
        }
      };
      AnimationRunner.prototype.play = function () {
        var self = this;
        if (this.animationType === 'CSS_ANIMATION') {
          this.el.classList.add('animated', self.animationName);
          this.el.classList.remove('mip-story-hidden');
        } else {
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
        }
      };
      AnimationRunner.prototype.pause = function () {
        if (this.animationType === 'CSS_ANIMATION') {
        } else {
          this.runner.pause();
        }
      };
      AnimationRunner.prototype.cancel = function () {
        if (this.animationType === 'CSS_ANIMATION') {
          this.el.classList.remove('animated');
          this.el.classList.add('mip-story-hidden');
        } else {
          var self = this;
          clearTimeout(self.timer);
          this.isStart = 0;
          this.runner.cancel();
        }
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
        var style = window.getComputedStyle(page);
        var DOMMatrix = DOMMatrix || WebKitCSSMatrix;
        var matrix = new DOMMatrix(style.webkitTransform);
        this.offsetX = matrix.m41;
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
          var runner = buildRuner(el, self.offsetX);
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
          // 动画名词可能不存在或拼写错误
          try {
            css(player.runner.el, player.runner.animationDef.keyframes[0]);
          } catch (error) {
          }
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
      function createAnimationDef (el, offsetX) {
        var keyframes;
        var easing;
        var offset = el.getBoundingClientRect();
        var animationDef = getPreset(el);
        var duration = timeStrFormat(el.getAttribute(MIP_STORY_ANIMATE_IN_DURATION_ATTR));
        var delay = timeStrFormat(el.getAttribute(MIP_STORY_ANIMATE_IN_DELAY_ATTR));
        var after = el.getAttribute(MIP_STORY_ANIMATE_IN_AFTER_ATTR);
        animationDef.delay = delay || 0;
        if (after) {
          animationDef.startAfterId = after;
        }
        // 如果是animate.css的动画
        if (animationDef.animationName) {
          animationDef.duration = duration;
          animationDef.animationType = 'CSS_ANIMATION';
          return animationDef;
        }
        offset.pageHeight = window.innerHeight;
        offset.pageWidth = window.innerWidth;
        offset.realLeft = offset.left - offsetX;
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
        animationDef.easing = easing;
        animationDef.keyframes = keyframes;
        animationDef.animationType = 'JS_ANIMATION';
        animationDef.animationName = 'preSet';
        return animationDef;
      }
      function getPreset (el) {
        var animationDef = {};
        var name = String(el.getAttribute(MIP_STORY_ANIMATE_IN_ATTR)).split(/\s+/)[0];
        if (!animatePreset[name]) {
          return { animationName: name };
        }
        extend(animationDef, animatePreset[name]);
        return animationDef;
      }
      function buildRuner (el, offsetX) {
        var runner;
        var animationDef = createAnimationDef(el, offsetX);
        runner = new AnimationRunner(el, animationDef);
        return runner;
      }
      return {
        AnimationManager: AnimationManager,
        hasAnimations: hasAnimations
      };
    });

    // ======================
    // mip-story/mip-story-util.js
    // ======================


    /**
     *  @file 处理一些主题模板样式的的正则匹配
     */
    define('mip-story/mip-story-util', ['require'], function (require) {
      var regSubjectColor = /^#([a-fA-F\d]{3}|[a-fA-F\d]{6})$/;
      function isCssColor (color) {
        return regSubjectColor.test(color);
      }
      return { isCssColor: isCssColor };
    });

    // ======================
    // mip-story/mip-story-config.js
    // ======================


    /**
     *  @file mip-story-config.js 存储小故事的配置常量
     *  
     */
    define('mip-story/mip-story-config', [
      'require',
      'viewport'
    ], function (require) {
      var viewport = require('viewport');
      // 小故事标识
      var MIP_I_STORY_STANDALONE = 'mip-i-story-standalone';
      // 小故事页面类型
      var PAGE_ROLE = {
        contentPage: 'contentPage',
        sharePage: 'sharePage'
      };
      // 进度条状态class
      var PROGRESS_STATE = {
        active: 'mip-story-page-progress-bar-active',
        visited: 'mip-story-page-progress-bar-visited'
      };
      // 背景音乐配置属性
      var BACKGROUND_AUDIO = 'background-audio';
      // 翻页阈值 
      var SWITCHPAGE_THRESHOLD = {
        horizontal: viewport.getWidth() * 0.15,
        // 水平翻页阈值
        vertical: viewport.getHeight() * 0.1    // 垂直翻页阈值
      };
      // 翻页走向
      var DIRECTIONMAP = {
        back: 'back',
        goto: 'goto'
      };
      // 当前页状态
      var PAGE_STATE = {
        current: 'current',
        active: 'active'
      };
      // 熊掌号api
      var MSITEAPI = 'https://msite.baidu.com/home/bar?office_id=';
      // 预加载页数
      var PRELOAD_PAGES = 2;
      // 浏览状态
      var STORY_PREFIX = 'MIP_STORY_';
      return {
        MIP_I_STORY_STANDALONE: MIP_I_STORY_STANDALONE,
        PAGE_ROLE: PAGE_ROLE,
        PROGRESS_STATE: PROGRESS_STATE,
        BACKGROUND_AUDIO: BACKGROUND_AUDIO,
        SWITCHPAGE_THRESHOLD: SWITCHPAGE_THRESHOLD,
        DIRECTIONMAP: DIRECTIONMAP,
        PAGE_STATE: PAGE_STATE,
        MSITEAPI: MSITEAPI,
        PRELOAD_PAGES: PRELOAD_PAGES,
        STORY_PREFIX: STORY_PREFIX
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
      './mip-story-video',
      './mip-story-img',
      './animation-util',
      './animation',
      'util',
      './mip-story-util',
      './mip-story-config'
    ], function (require) {
      'use strict';
      var customElement = require('customElement').create();
      var Audio = require('./audio');
      require('./mip-story-video');
      require('./mip-story-img');
      var timeStrFormat = require('./animation-util').timeStrFormat;
      var AnimationManager = require('./animation').AnimationManager;
      var hasAnimations = require('./animation').hasAnimations;
      var css = require('util').css;
      var isCssColor = require('./mip-story-util').isCssColor;
      var constConfig = require('./mip-story-config');
      customElement.prototype.resumeAllMedia = function (load) {
        var self = this;
        self.whenAllMediaElements(function (ele) {
          !self.muted ? ele.load() : ele.load() && ele.pause();
        });
      };
      customElement.prototype.pauseAllMedia = function () {
        this.whenAllMediaElements(function (ele) {
          ele.load();
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
        console.log(subNodes);
      };
      function toggleDisplay (obj, disp) {
        if (disp) {
          css(obj, { 'display': obj.getAttribute('originDisplay') });
        } else {
          var originDisplay = document.defaultView.getComputedStyle(obj)['display'];
          obj.setAttribute('originDisplay', originDisplay);
          css(obj, { 'display': 'none' });
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
          this.startStoryViedo();
          this.maybeSetAutoAdvance();
        } else {
          this.maybeClearAutoAdvance();
          this.pauseAllMedia();
          this.maybeClearAnimation();
          this.stopStoryViedo();
        }
      };
      customElement.prototype.startStoryViedo = function () {
        if (this.hasStoryVideo) {
          Array.prototype.slice.apply(this.canvasVideo).forEach(function (val) {
            val.customElement.play();
          });
        }
        ;
      };
      customElement.prototype.stopStoryViedo = function () {
        if (this.hasStoryVideo) {
          Array.prototype.slice.apply(this.canvasVideo).forEach(function (val) {
            val.customElement.stop();
          });
        }
        ;
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
      // 设置view的主题色
      customElement.prototype.setSubjectColor = function () {
        var subjectColor = this.element.getAttribute('background') || '';
        var storyLayer = this.element.getElementsByTagName('mip-story-layer') || '';
        if (storyLayer && storyLayer[0] && subjectColor && isCssColor(subjectColor)) {
          var newLayer = document.createElement('mip-story-layer');
          this.element.insertBefore(newLayer, storyLayer[0]);
          css(this.element.firstElementChild, { backgroundColor: subjectColor });
        }
      };
      // 设置view的类型
      customElement.prototype.setPageRole = function () {
        this.element.setAttribute('page-role', constConfig.PAGE_ROLE.contentPage);
      };
      customElement.prototype.initMedia = function () {
        this.audio = new Audio();
        var node = this.element.parentNode;
        this.animationElements = [];
        // 设置view的主题色
        this.setSubjectColor();
        if (!node.hasAttribute(constConfig.BACKGROUND_AUDIO)) {
          var audioSrc = this.element.getAttribute(constConfig.BACKGROUND_AUDIO);
          this.audio.build(this.element, audioSrc);
        }
      };
      customElement.prototype.initStoryStatic = function () {
        var storyStatic = this.element.querySelectorAll('mip-story-img, mip-story-video');
        for (var i = 0; i < storyStatic.length; i++) {
          storyStatic[i].setAttribute('preload', '');
        }
      };
      // 有preload属性时, 自动为所包含的静态元素添加preload属性
      customElement.prototype.attributeChangedCallback = function () {
        if (this.isPreload) {
          return;
        }
        if (this.element.hasAttribute('preload')) {
          this.isPreload = true;
          this.initStoryStatic();
          this.initMedia();
          this.pauseAllMedia();
        }
      };
      customElement.prototype.firstInviewCallback = function () {
        this.canvasVideo = this.element.querySelectorAll('mip-story-video');
        this.hasStoryVideo = !!this.canvasVideo.length;
        this.isPreload = false;
        this.setPageRole();
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
        if (scSupport.support) {
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
        var hostName = util.parseCacheUrl(location.hostname);
        // 在安卓机型内，如果简搜支持且为百度域的可吊起简搜，由于简搜会对非百度域的分享做特殊处理；
        var supportAnd = shareosAndroid && parseFloat(shareV[1]) > 1.5 && hostName.indexOf('baidu.com') !== -1;
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
      'viewer',
      './mip-story-config'
    ], function (require) {
      'use strict';
      var util = require('util');
      var viewer = require('viewer');
      var constConfig = require('./mip-story-config').PAGE_ROLE;
      var sharePage = constConfig.sharePage;
      var platform = util.platform;
      var naboo = util.naboo;
      function MIPStoryBackEnd (storyConfig) {
        this.storyConfig = storyConfig || {};
      }
      /**
       * 使得数组满足最低个数要求，不满足个数时则用默认数组填充
       *
       * @param {Array} customArr 用户自定义数组
       * @param {Array} defaultArr 默认数组
       * @param {Number} n 最少展示的数组
       * @returns {Array} 符合要求的数组
       */
      function fillArr (customArr, defaultArr, n) {
        var cusLen = customArr.length;
        if (cusLen >= n) {
          return customArr;
        }
        return customArr.concat(defaultArr.slice(0, n - cusLen));
      }
      // 默认的推荐数据 & 最低数量
      var minRecommend = 4;
      var defaultRecommend = [
        {
          'cover': 'https://mipstatic.baidu.com/static/mip-static/mip-story/static/img/rec1.jpg',
          'url': 'https://m.baidu.com/paw/c/m.news18a.com/special/mobile/special_1031.shtml?story=1&word=%E8%BF%88%E5%B7%B4%E8%B5%AB%E6%A6%82%E5%BF%B5%E8%BD%A6&title=%E8%BF%88%E5%B7%B4%E8%B5%AB%E6%A6%82%E5%BF%B5%E8%BD%A6&lid=8305767886715286272&referlid=8305767886715286272&ms=1&frsrcid=37224&frorder=2',
          'title': '未来汽车新概念\uFF1A我真的心动了',
          'from': '网通社汽车',
          'fromUrl': ''
        },
        {
          'cover': 'https://mipstatic.baidu.com/static/mip-static/mip-story/static/img/rec2.jpg',
          'url': 'http://story.soogif.com/story/access/41',
          'title': '梅西丢球\uFF1A盘点世界杯十大罚球时刻',
          'from': 'SOOGIF',
          'fromUrl': ''
        },
        {
          'cover': 'https://mipstatic.baidu.com/static/mip-static/mip-story/static/img/rec3.jpg',
          'url': 'https://mipstatic.baidu.com/static/mip-static/mip-story/story-heritage/heritage.html',
          'title': '你所不知道的中国非物质文化遗产',
          'from': '百度公益',
          'fromUrl': ''
        },
        {
          'cover': 'https://mipstatic.baidu.com/static/mip-static/mip-story/static/img/rec4.jpg',
          'url': 'https://zqmfcdn.huanhuba.com/app_static/baiduStory/index.html',
          'title': '梅西VSC罗\uFF1A原来差距在这里',
          'from': '足球魔方',
          'fromUrl': ''
        }
      ];
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
        var closeStatsInBackEnd = encodeURIComponent(JSON.stringify({
          type: 'click',
          data: [
            '_trackEvent',
            '小故事关闭按钮_分享页',
            '点击',
            window.location.href
          ]
        }));
        var recommendStats = function (url) {
          return encodeURIComponent(JSON.stringify({
            type: 'click',
            data: [
              '_trackEvent',
              '更多推荐',
              '点击',
              url
            ]
          }));
        };
        var infoStats = encodeURIComponent(JSON.stringify({
          type: 'click',
          data: [
            '_trackEvent',
            '来源外链',
            '点击',
            window.location.href
          ]
        }));
        var share = data.share;
        var recommend = data.recommend;
        var items = recommend && recommend.items ? recommend.items : [];
        var recTpl = '';
        items = fillArr(items, defaultRecommend, minRecommend);
        if (items && items.length) {
          var innerTpl = '';
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            innerTpl += '' + '<a ondragstart="return false;" ondrop="return false;" href="' + item.url + '" class="recommend-item" data-stats-baidu-obj="' + recommendStats(item.url) + '">' + '<div class="mip-backend-preview"> <mip-story-img src=' + (item.cover || ' ') + '></mip-story-img></div>' + '<div class="recommend-detail">' + '<p>' + (item.title || '') + '</p>' + '<span class="item-from" data-src="' + item.fromUrl + '">' + (item.from || '') + '</span>' + '</div>' + '</a>';
          }
          recTpl = '' + '<div class="recommend-wrap">' + '<p class="readmore">更多阅读</p>' + '<div class="recommend-container">' + innerTpl + '</div>' + '</div>';
        }
        var shareTpl = this.showShareBtn() ? '' + '<span class="mip-backend-share" data-stats-baidu-obj="' + shareStats + '">' + '<span class="mip-backend-preview-share-btn"></span>' + '</span>' : '';
        var historyTpl = history.length > 1 ? '<span class="mip-story-close mip-backend-close" data-stats-baidu-obj="' + closeStatsInBackEnd + '"></span>' : '';
        var html = '' + '<aside class="mip-backend" page-role="' + sharePage + '">' + '<mip-fixed type="top" class="mip-backend-control">' + historyTpl + shareTpl + '</mip-fixed>' + '<div class="mip-backend-outer "style="">' + '<div class="mip-backend-background" style="background-image: url(' + share.background + ')">' + '</div>' + '<div class="recommend-item recommend-now">' + '<div class="mip-backend-preview"' + 'style="background-position:center;background-size:cover;background-image:url(' + share.thumbnail + ')" data-stats-baidu-obj="' + replayStats + '">' + '<div class="mip-backend-preview-mask"></div>' + '<div class="mip-backend-preview-thumbnail">' + '<span class="mip-backend-preview-replay-btn"></span>' + '</div>' + '</div>' + '<div class="recommend-detail">' + '<p class="mip-backend-description">' + share.title + '</p>' + '<span class="mip-backend-info" data-stats-baidu-obj="' + infoStats + '">' + '<a href="' + share.fromUrl + '">' + share.from + '</a>' + '</span>' + '</div>' + '</div>' + recTpl + '</div>' + '</aside>';
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
      'fetch-jsonp',
      './mip-story-config'
    ], function (require) {
      'use strict';
      var ACTIVE = 'mip-story-page-progress-bar-active';
      var VISITED = 'mip-story-page-progress-bar-visited';
      var css = require('util').css;
      var timeStrFormat = require('./animation-util').timeStrFormat;
      var fetchJsonp = require('fetch-jsonp');
      var util = require('util');
      var constConfig = require('./mip-story-config');
      var MSITEAPI = constConfig.MSITEAPI;
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
      MIPProgress.prototype.setXzhInfo = function () {
        if (!this.storyConfig.xzh_info.appid) {
          return '';
        }
        var hostName = util.getOriginalUrl(location.href).split('?')[0].split('#')[0];
        var url = MSITEAPI + this.storyConfig.xzh_info.appid + '&url=' + encodeURIComponent(hostName);
        return fetchJsonp(url, { jsonpCallback: 'callback' }).then(function (res) {
          return res.json();
        }).then(function (data) {
          var content = '';
          if (!data.data) {
            return content;
          }
          var siteData = data.data;
          if (siteData.avatar && siteData.name && siteData.homepage) {
            var content = '<div class="icon-wrap" data-href="' + siteData.homepage + '"><div class="icon"><img src="' + siteData.avatar + '" alt=""></div><div class="icon-name">' + siteData.name + '</div><div class="icon-type">熊掌号</div></i></div>';
          }
          return content;
        }, function (err) {
          console.log(err);
        });
      };
      return MIPProgress;
    });

    // ======================
    // mip-story/mip-story-storage.js
    // ======================


    /**
     * @file mip-story-storage.js
     * @desc 本地存储
     * @author <wangqizheng01@baidu.com>
     */
    define('mip-story/mip-story-storage', [
      'require',
      './mip-story-config'
    ], function (require) {
      var prefix = require('./mip-story-config').STORY_PREFIX;
      var storage = window.sessionStorage;
      var get = function (key) {
        var prefixKey = prefix + key;
        var localValue = {};
        try {
          localValue = storage.getItem(prefixKey);
          return JSON.parse(localValue);
        } catch (e) {
          return localValue;
        }
      };
      var set = function (key, value) {
        var prefixKey = prefix + key;
        var localValue;
        try {
          localValue = JSON.stringify(value);
          storage.setItem(prefixKey, localValue);
        } catch (e) {
          localValue = value;
        }
      };
      var remove = function (key) {
        var prefixKey = prefix + key;
        storage.removeItem(prefixKey);
      };
      return {
        get: get,
        set: set,
        remove: remove
      };
    });

    // ======================
    // mip-story/mip-story-state.js
    // ======================


    /**
     *  @file 处理一些主题模板样式的的正则匹配
     */
    define('mip-story/mip-story-state', [
      'require',
      'util',
      'hash',
      './mip-story-storage',
      './mip-story-config'
    ], function (require) {
      var util = require('util');
      var hash = require('hash');
      // 记住状态
      var storage = require('./mip-story-storage');
      var constConfig = require('./mip-story-config');
      var prefix = constConfig.STORY_PREFIX;
      var preloadLenght = constConfig.PRELOAD_PAGES;
      var originalUrl = util.getOriginalUrl().split('?')[0].split('#')[0];
      var currentPageIndex = getState() || 0;
      function getState () {
        var hashPageIndex = hash.hashTree[prefix] && hash.hashTree[prefix].value;
        var pageIndex = 0;
        try {
          pageIndex = storage.get(originalUrl) || parseInt(hashPageIndex);
        } catch (e) {
        }
        return pageIndex;
      }
      function setState (index) {
        storage.set(originalUrl, index);    // var hashStr = '#';
        // var tree = hash.hashTree
        // for (var item in tree) {
        //     if (item === prefix){
        //         continue;
        //     }
        //     hashStr += item + tree[item].sep + tree[item].value + '&';
        // }
        // currentHash = hashStr + prefix + '=' + index;
        // window.top.location.replace(currentHash);
      }
      function getPageStateIndex (viewsLength) {
        var maxIndex = viewsLength - 1;
        var curIndex = currentPageIndex > maxIndex ? maxIndex : currentPageIndex;
        currentIndex = curIndex;
        preIndex = curIndex > 0 ? curIndex - 1 : 0;
        nextIndex = curIndex < maxIndex ? curIndex + 1 : maxIndex;
        return [
          preIndex,
          currentIndex,
          nextIndex
        ];
      }
      function getPreloadIndex (viewsLength) {
        var preloadIndex = [];
        var pageState = getPageStateIndex(viewsLength);
        var minIndex = pageState[0] - 1 >= 0 ? pageState[0] - 1 : 0;
        var maxIndex = pageState[2] >= viewsLength - 1 ? pageState[2] : pageState[2] + 1;
        preloadIndex.push(minIndex);
        preloadIndex = preloadIndex.concat(pageState);
        preloadIndex.push(maxIndex);
        return unique(preloadIndex);
      }
      function unique (array) {
        var res = [];
        for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
          for (var j = 0, resLen = res.length; j < resLen; j++) {
            if (array[i] === res[j]) {
              break;
            }
          }
          if (j === resLen) {
            res.push(array[i]);
          }
        }
        return res;
      }
      return {
        currentPageIndex: currentPageIndex,
        setState: setState,
        getPageStateIndex: getPageStateIndex,
        getPreloadIndex: getPreloadIndex
      };
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
      './mip-story-config',
      './mip-story-state',
      'util'
    ], function (require) {
      'use strict';
      var storyContain = [];
      var emitter;
      var viewport = require('viewport');
      var constConfig = require('./mip-story-config');
      var PAGE_ROLE = constConfig.PAGE_ROLE;
      var DIRECTIONMAP = constConfig.DIRECTIONMAP;
      var SWITCHPAGE_THRESHOLD = constConfig.SWITCHPAGE_THRESHOLD;
      var CURRENT = constConfig.PAGE_STATE.current;
      var ACTIVE = constConfig.PAGE_STATE.active;
      var storyState = require('./mip-story-state');
      var STYLE = 'style';
      var screenWidth = viewport.getWidth();
      var screenHeight = viewport.getHeight();
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
      // 翻页埋点 
      var pageViewed = [0];
      var isPageOneViewed = false;
      var pageViewedData = {
        'category': '_trackEvent',
        'action': '翻页进度',
        'optLabel': '滑动',
        'optValue': '翻了1页'
      };
      // 分享页展示次数  这里以后可能会改成推荐小故事的展示量
      var sharePageIndex = 1;
      var isSharePageViewed = false;
      var sharePagedData = {
        'category': '_trackEvent',
        'action': '翻页进度',
        'optLabel': '滑动',
        'optValue': '翻到了分享页'
      };
      // 兼容 touch 、 mouse 事件
      var dragStartBind = null;
      var dragMoveBind = null;
      var dragEndBind = null;
      var hasTouch = 'ontouchstart' in window;
      /**
       * 拖动开始
       *
       * @param {Event} e 事件对象 
       */
      function dragStart (e) {
        // 如果正处于翻页状态跳出
        if (this.moveFlag) {
          return;
        }
        var touch = hasTouch ? e.targetTouches[0] || e.changedTouches[0] : e;
        this.touchstartX = touch.pageX;
        this.touchstartY = touch.pageY;
        sliderStartCB(e);
        // 绑定事件
        storyInstanceEle.addEventListener('mousemove', dragMoveBind);
        storyInstanceEle.addEventListener('mouseup', dragEndBind);
        storyInstanceEle.addEventListener('mouseout', dragEndBind);
      }
      /**
       * 拖动中
       *
       * @param {Event} e 事件对象 
       */
      function dragMove (e) {
        // 特殊处理，分享页更多小故事滚动，禁止翻页滚动
        if (dm.contains(recommend, e.target)) {
          return;
        }
        // 如果正处于翻页状态跳出
        if (self.moveFlag) {
          return;
        }
        this.slideMoving(e);
      }
      /**
       * 拖动结束
       *
       * @param {Event} e 事件对象 
       */
      function dragEnd (e) {
        // 解绑事件
        storyInstanceEle.removeEventListener('mousemove', dragMoveBind);
        storyInstanceEle.removeEventListener('mouseup', dragEndBind);
        storyInstanceEle.removeEventListener('mouseout', dragEndBind);
        // 特殊处理，分享页更多小故事滚动，禁止翻页滚动
        if (dm.contains(recommend, e.target)) {
          return;
        }
        // 如果正处于翻页状态跳出
        if (this.moveFlag) {
          return;
        }
        var touch = hasTouch ? e.targetTouches[0] || e.changedTouches[0] : e;
        this.touchendX = touch.pageX;
        this.touchendY = touch.pageY;
        // 只是点击当前页面的内容
        if (this.touchendX == this.touchstartX && this.touchendY == this.touchstartY) {
          this.moveFlag = false;
          return;
        }
        // 关闭其他滑动事件
        this.moveFlag = true;
        // 翻页
        this.setMovingEnd(e);
        // 还原state
        this.touchstartX = this.touchendX = 0;
      }
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
        sharePageIndex = storyContain.length - 1;
        // story的自定义事件监控器
        emitter = storyInstance.emitter;
        // 翻页的交互类型
        // 翻页的页面state
        this.viewLength = storyContain.length - 1;
        var pageState = storyState.getPageStateIndex(this.viewLength);
        this.hasPreload = storyState.getPreloadIndex(this.viewLength);
        this.preIndex = pageState[0];
        this.currentIndex = pageState[1];
        this.nextIndex = pageState[2];
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
        // 初始化段落布局
        this.initViewForSlider();
        this.bindEvent();
        recommend = storyInstanceEle.querySelector('.recommend');
      };
      MIPStorySlider.prototype.bindEvent = function () {
        // 绑定this对象
        dragStartBind = dragStart.bind(this);
        dragMoveBind = dragMove.bind(this);
        dragEndBind = dragEnd.bind(this);
        // 开始滑动
        this.sliderStart();
        // 滑动中
        this.sliding();
        // 结束滑动
        this.sliderEnd();
      };
      // 初始化view的最初排布
      MIPStorySlider.prototype.initViewForSlider = function (type) {
        var preEle = null;
        var currentEle = null;
        var nextEle = null;
        if (type === 'reset') {
          preEle = currentEle = nextEle = storyContain[0];
          this.preIndex = this.currentIndex = 0;
          this.nextIndex = 1;
          storyState.setState(0);
        } else {
          preEle = storyContain[this.preIndex];
          currentEle = storyContain[this.currentIndex];
          nextEle = storyContain[this.nextIndex];
        }
        // 添加current状态
        this.setCurrentPage();
        // 清除当前所有view已有的样式
        this.clearStyle();
        nextEle = storyContain[this.nextIndex];
        preEle = storyContain[this.preIndex];
        this.setViewStatus(true, ACTIVE, nextEle);
        this.setViewStatus(true, ACTIVE, preEle);
        // 初始化上一页、下一页的位置
        if (this.currentIndex !== this.viewLength - 1) {
          setSliderPosition(nextEle, false);
        }
        if (this.currentIndex !== 0) {
          setSliderPosition(preEle, true);
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
        if (hasTouch) {
          storyInstanceEle.addEventListener('touchstart', dragStartBind);
        } else {
          storyInstanceEle.classList.add('mip-story-pc');
          storyInstanceEle.addEventListener('mousedown', dragStartBind);
        }
      };
      MIPStorySlider.prototype.sliding = function () {
        var self = this;
        // 对story进行手势的监控
        storyInstanceEle.addEventListener('touchmove', dragMoveBind);
      };
      MIPStorySlider.prototype.sliderEnd = function () {
        var self = this;
        // 对story进行手势的监控
        storyInstanceEle.addEventListener('touchend', dragEndBind);
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
        var touch = hasTouch ? e.targetTouches[0] || e.changedTouches[0] : e;
        var moveX = touch.pageX - this.touchstartX;
        var moveY = touch.pageY - this.touchstartY;
        var move = moveX;
        var preActiveMove = -screenWidth + moveX;
        var nextActiveMove = screenWidth + moveX;
        var threshold = SWITCHPAGE_THRESHOLD.horizontal;
        if (switchPageType === SWITCHTYPES.slideY) {
          move = moveY;
          preActiveMove = -screenHeight + moveY;
          nextActiveMove = screenHeight + moveY;
          threshold = SWITCHPAGE_THRESHOLD.vertical;
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
        var storyContainLength = storyContain.length;
        for (var i = 0; i < storyContainLength; i++) {
          var currentPage = storyContain[i];
          if (i === this.currentIndex) {
            // 埋点
            if (window._hmt && pageViewed.indexOf(i) === -1) {
              var pageRole = currentPage.getAttribute('page-role');
              this.triggerStats(i, pageRole);
            }
            this.setPreload(i);
            // 设置当前页面为current状态
            this.setViewStatus(true, CURRENT, currentPage);
          } else {
            // 清除非当前页的current状态，确保只有一个current页
            this.setViewStatus(false, CURRENT, currentPage);
          }
          // 如果当前页面原先为active状态则清除
          if (this.hasStatus(ACTIVE, currentPage)) {
            this.setViewStatus(false, ACTIVE, currentPage);
          }
        }
      };
      // 设置预加载
      MIPStorySlider.prototype.setPreload = function (index) {
        var loaded = this.hasPreload;
        var maxIndex = loaded[loaded.length - 1];
        var minIndex = loaded[0];
        var stateIndex = index >= maxIndex ? maxIndex : index;
        storyState.setState(stateIndex);
        if (maxIndex >= this.viewLength - 2) {
          var storyImgs = storyContain[this.viewLength].querySelectorAll('mip-story-img');
          for (var index = 0; index < storyImgs.length; index++) {
            storyImgs[index].setAttribute('preload', '');
          }
        }
        if (!this.direction) {
          return;
        }
        if (this.direction === 'goto' && maxIndex < this.viewLength - 1) {
          var nextIndex = maxIndex + 1;
          if (loaded.indexOf(nextIndex) !== -1) {
            return;
          }
          storyContain[nextIndex].setAttribute('preload', '');
          this.hasPreload.push(nextIndex);
          return;
        }
        if (minIndex > 0) {
          var preIndex = minIndex - 1;
          storyContain[preIndex].setAttribute('preload', '');
          this.hasPreload.splice(0, 0, preIndex);
          return;
        }
        return;
      };
      /**
       * 处理翻页统计逻辑
       *
       * @param {Number} pageIndex 页数下标
       */
      MIPStorySlider.prototype.triggerStats = function (pageIndex, role) {
        // 分享页单独统计
        if (role === PAGE_ROLE.sharePage && !isSharePageViewed) {
          isSharePageViewed = true;
          return this.trackEvent(sharePagedData);
        }
        // 这里主要是 保证第一页发送的时机
        if (!isPageOneViewed) {
          isPageOneViewed = true;
          this.trackEvent(pageViewedData);
        }
        // 分享页不计入翻页
        if (role === PAGE_ROLE.sharePage) {
          return;
        }
        pageViewed.push(pageIndex);
        var pageViewedInfo = '翻了' + (+pageViewed[pageIndex] + 1) + '页';
        pageViewedData.optValue = pageViewedInfo;
        this.trackEvent(pageViewedData);
      };
      /**
       * 判断当前也是否为分享页
       *
       * @param {Number} pageIndex 页数下标
       * @return {boolean} 是否为分享页 
       */
      MIPStorySlider.prototype.isSharePage = function (pageIndex) {
        return pageIndex === sharePageIndex ? true : false;
      };
      /**
       * 百度统计 自定义事件
       *
       * @param {Object} obj  统计事件对象
       */
      MIPStorySlider.prototype.trackEvent = function (obj) {
        var label = obj.optLabel || '';
        var value = obj.optValue || '';
        window._hmt.push([
          obj.category,
          obj.action,
          label,
          value
        ]);
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
      /**
       * 找到指定为某标签的父元素
       *
       * @param {Dom} el 
       * @param {String} tagName 
       * @returns {Dom}
       */
      function findParent (el, tagName) {
        tagName = tagName.toLowerCase();
        while (el && el.parentNode) {
          el = el.parentNode;
          if (el.tagName && el.tagName.toLowerCase() === tagName) {
            return el;
          }
        }
        return null;
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
        // 在重设view状态时，如果下一页与当前页的不是同一页并且下一页不是封底页，需要进行状态修改
        if (this.nextIndex != this.currentIndex && this.nextIndex <= storyViews.length - 1) {
          // 初始化下一页的动画效果
          this.nextEle.setPreActive(this.emitter);
        }
        if (this.preIndex !== this.currentIndex) {
          this.preEle.setPreActive(this.emitter);
        }
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
        var recommend = storyEle.querySelector('.recommend-wrap');
        var shareAreaShow = storyEle.querySelector('.mip-story-share-show');
        var xzhSite = storyEle.querySelector('.icon-wrap');
        if (!dm.contains(shareArea, e.target) && shareAreaShow) {
          this.share.hideShareLayer();
          return;
        }
        // 跳转站点熊掌号
        if (dm.contains(xzhSite, e.target)) {
          var href = xzhSite.getAttribute('data-href');
          window.top.location.href = href;
          return;
        }
        // 推荐
        if (dm.contains(recommend, e.target)) {
          var target = e.target;
          var eleParent = findParent(target, 'a');
          e.preventDefault();
          // 推荐链接
          if (target.nodeName.toLocaleLowerCase() !== 'span') {
            var href = eleParent.getAttribute('href');
            window.top.location.href = href;
            return;
          }
          // 来源链接
          var src = target.getAttribute('data-src');
          if (!src) {
            return;
          }
          window.top.location.href = src;
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
        slider.initViewForSlider('reset');
        // slider.initViewForSlider(function (preIndex, currentIndex, nextIndex) {
        //     self.initfirstViewStatus(preIndex, currentIndex, nextIndex);
        // });
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
      './mip-story-config',
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
      './mip-story-util',
      './mip-story-state',
      './web-animation'
    ], function (require) {
      'use strict';
      var customElement = require('customElement').create();
      require('./mip-story-view');
      require('./mip-story-layer');
      var constConfig = require('./mip-story-config');
      var MIP_I_STORY_STANDALONE = constConfig.MIP_I_STORY_STANDALONE;
      var Audio = require('./audio');
      var ShareLayer = require('./mip-story-share');
      var HintLayer = require('./mip-story-hint');
      var BookEnd = require('./mip-story-bookend');
      var animatePreset = require('./animate-preset');
      var util = require('util');
      var platform = util.platform;
      var dm = util.dom;
      var EventEmitter = util.EventEmitter;
      var Gesture = util.Gesture;
      var Progress = require('./mip-progress');
      var storyViews = [];
      var storyContain = [];
      var viewport = require('viewport');
      var viewer = require('viewer');
      var $ = require('zepto');
      var Service = require('./mip-story-service');
      var service;
      var isCssColor = require('./mip-story-util').isCssColor;
      function MIPStory (element) {
        this.element = element;
        this.win = window;
        this.storyViews = [];
        this.storyContain = [];
      }
      function loadScript (url) {
        var d = document;
        var s = d.createElement('script');
        s.src = url;
        (d.body || d.documentElement).appendChild(s);
      }
      ;
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
        // 状态保持
        var storyState = require('./mip-story-state');
        var currentPageIndex = storyState.currentPageIndex;
        this.pageStateIndex = storyState.getPageStateIndex(this.storyViews.length);
        this.preloadPages = storyState.getPreloadIndex(this.storyViews.length);
        // 初始化预加载
        this.initPreload();
        for (var p = 0; p <= currentPageIndex; p++) {
          this.progress.updateProgress(p, 1);
        }
        var sys = this.element.querySelector('.mip-story-system-layer');
        if (!viewer.isIframed || !this.getConfigData().xzh_info) {
          return;
        }
        // 加载icon
        this.progress.setXzhInfo().then(function (data) {
          var icon = dm.create(data);
          try {
            sys.appendChild(icon);
          } catch (err) {
          }
        });
      };
      MIPStory.prototype.setSubjectColor = function () {
        var subjectColor = this.element.getAttribute('background') || '';
        if (subjectColor && isCssColor(subjectColor)) {
          this.element.style.backgroundColor = subjectColor;
        }
      };
      MIPStory.prototype.insertScript = function () {
        loadScript('https://c.mipcdn.com/static/v1/mip-fixed/mip-fixed.js');
      };
      // 处理滑动
      MIPStory.prototype.resolveSwipe = function () {
        // 禁止橡皮筋效果
        for (var i = 0; i < this.storyViews.length; i++) {
          this.storyViews[i].addEventListener('touchmove', function (e) {
            e.preventDefault();
          }, { passive: false });
        }
        var isSimpleSearch = navigator.userAgent.toLowerCase().indexOf('searchcraft');
        // 手百下外层容器不能设置阻挡默认事件
        if (!platform.isBaiduApp() && !platform.isQQApp() && !isSimpleSearch) {
          var backOuter = this.element.querySelector('.mip-backend');
          backOuter.addEventListener('touchmove', function (e) {
            e.preventDefault();
          }, { passive: false });
        }
        var recommendWrap = this.element.querySelector('.recommend-wrap');
        recommendWrap.addEventListener('touchmove', function (e) {
          e.stopPropagation();
        }, { passive: true });
      };
      // 预加载相关
      MIPStory.prototype.initPreload = function () {
        var storyViewData = this.storyViews;
        var pages = this.preloadPages;
        for (var i = 0; i < pages.length; i++) {
          var loadIndex = pages[i];
          storyViewData[loadIndex].setAttribute('preload', '');
        }
      };
      // story组件的初始化
      MIPStory.prototype.init = function () {
        var element = this.element;
        var html = this.win.document.documentElement;
        var mipStoryConfigData = this.getConfigData();
        // 引入js
        this.insertScript();
        // 设置小故事的主题色
        this.setSubjectColor();
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
        // 处理滑动问题
        this.resolveSwipe();
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
        mip.registerMipElement("mip-story", component, "@charset \"UTF-8\";/*!\n * animate.css -http://daneden.me/animate\n * Version - 3.5.2\n * Licensed under the MIT license - http://opensource.org/licenses/MIT\n *\n * Copyright (c) 2017 Daniel Eden\n */.animated{animation-duration:1s;animation-fill-mode:both}.animated.infinite{animation-iteration-count:infinite}.animated.hinge{animation-duration:2s}.animated.bounceIn,.animated.bounceOut,.animated.flipOutX,.animated.flipOutY{animation-duration:.75s}@keyframes bounce{0%,20%,53%,80%,to{animation-timing-function:cubic-bezier(.215, .61, .355, 1);transform:translateZ(0)}40%,43%{animation-timing-function:cubic-bezier(.755, .05, .855, .06);transform:translate3d(0, -30px, 0)}70%{animation-timing-function:cubic-bezier(.755, .05, .855, .06);transform:translate3d(0, -15px, 0)}90%{transform:translate3d(0, -4px, 0)}}.bounce{animation-name:bounce;transform-origin:center bottom}@keyframes flash{0%,50%,to{opacity:1}25%,75%{opacity:0}}.flash{animation-name:flash}@keyframes pulse{0%{transform:scaleX(1)}50%{transform:scale3d(1.05, 1.05, 1.05)}to{transform:scaleX(1)}}.pulse{animation-name:pulse}@keyframes rubberBand{0%{transform:scaleX(1)}30%{transform:scale3d(1.25, .75, 1)}40%{transform:scale3d(.75, 1.25, 1)}50%{transform:scale3d(1.15, .85, 1)}65%{transform:scale3d(.95, 1.05, 1)}75%{transform:scale3d(1.05, .95, 1)}to{transform:scaleX(1)}}.rubberBand{animation-name:rubberBand}@keyframes shake{0%,to{transform:translateZ(0)}10%,30%,50%,70%,90%{transform:translate3d(-10px, 0, 0)}20%,40%,60%,80%{transform:translate3d(10px, 0, 0)}}.shake{animation-name:shake}@keyframes headShake{0%{transform:translateX(0)}6.5%{transform:translateX(-6px) rotateY(-9deg)}18.5%{transform:translateX(5px) rotateY(7deg)}31.5%{transform:translateX(-3px) rotateY(-5deg)}43.5%{transform:translateX(2px) rotateY(3deg)}50%{transform:translateX(0)}}.headShake{animation-timing-function:ease-in-out;animation-name:headShake}@keyframes swing{20%{transform:rotate(15deg)}40%{transform:rotate(-10deg)}60%{transform:rotate(5deg)}80%{transform:rotate(-5deg)}to{transform:rotate(0)}}.swing{transform-origin:top center;animation-name:swing}@keyframes tada{0%{transform:scaleX(1)}10%,20%{transform:scale3d(.9, .9, .9) rotate(-3deg)}30%,50%,70%,90%{transform:scale3d(1.1, 1.1, 1.1) rotate(3deg)}40%,60%,80%{transform:scale3d(1.1, 1.1, 1.1) rotate(-3deg)}to{transform:scaleX(1)}}.tada{animation-name:tada}@keyframes wobble{0%{transform:none}15%{transform:translate3d(-25%, 0, 0) rotate(-5deg)}30%{transform:translate3d(20%, 0, 0) rotate(3deg)}45%{transform:translate3d(-15%, 0, 0) rotate(-3deg)}60%{transform:translate3d(10%, 0, 0) rotate(2deg)}75%{transform:translate3d(-5%, 0, 0) rotate(-1deg)}to{transform:none}}.wobble{animation-name:wobble}@keyframes jello{0%,11.1%,to{transform:none}22.2%{transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{transform:skewX(6.25deg) skewY(6.25deg)}44.4%{transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{transform:skewX(-0.78125deg) skewY(-0.78125deg)}77.7%{transform:skewX(.390625deg) skewY(.390625deg)}88.8%{transform:skewX(-0.1953125deg) skewY(-0.1953125deg)}}.jello{animation-name:jello;transform-origin:center}@keyframes bounceIn{0%,20%,40%,60%,80%,to{animation-timing-function:cubic-bezier(.215, .61, .355, 1)}0%{opacity:0;transform:scale3d(.3, .3, .3)}20%{transform:scale3d(1.1, 1.1, 1.1)}40%{transform:scale3d(.9, .9, .9)}60%{opacity:1;transform:scale3d(1.03, 1.03, 1.03)}80%{transform:scale3d(.97, .97, .97)}to{opacity:1;transform:scaleX(1)}}.bounceIn{animation-name:bounceIn}@keyframes bounceInDown{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215, .61, .355, 1)}0%{opacity:0;transform:translate3d(0, -3000px, 0)}60%{opacity:1;transform:translate3d(0, 25px, 0)}75%{transform:translate3d(0, -10px, 0)}90%{transform:translate3d(0, 5px, 0)}to{transform:none}}.bounceInDown{animation-name:bounceInDown}@keyframes bounceInLeft{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215, .61, .355, 1)}0%{opacity:0;transform:translate3d(-3000px, 0, 0)}60%{opacity:1;transform:translate3d(25px, 0, 0)}75%{transform:translate3d(-10px, 0, 0)}90%{transform:translate3d(5px, 0, 0)}to{transform:none}}.bounceInLeft{animation-name:bounceInLeft}@keyframes bounceInRight{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215, .61, .355, 1)}0%{opacity:0;transform:translate3d(3000px, 0, 0)}60%{opacity:1;transform:translate3d(-25px, 0, 0)}75%{transform:translate3d(10px, 0, 0)}90%{transform:translate3d(-5px, 0, 0)}to{transform:none}}.bounceInRight{animation-name:bounceInRight}@keyframes bounceInUp{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215, .61, .355, 1)}0%{opacity:0;transform:translate3d(0, 3000px, 0)}60%{opacity:1;transform:translate3d(0, -20px, 0)}75%{transform:translate3d(0, 10px, 0)}90%{transform:translate3d(0, -5px, 0)}to{transform:translateZ(0)}}.bounceInUp{animation-name:bounceInUp}@keyframes bounceOut{20%{transform:scale3d(.9, .9, .9)}50%,55%{opacity:1;transform:scale3d(1.1, 1.1, 1.1)}to{opacity:0;transform:scale3d(.3, .3, .3)}}.bounceOut{animation-name:bounceOut}@keyframes bounceOutDown{20%{transform:translate3d(0, 10px, 0)}40%,45%{opacity:1;transform:translate3d(0, -20px, 0)}to{opacity:0;transform:translate3d(0, 2000px, 0)}}.bounceOutDown{animation-name:bounceOutDown}@keyframes bounceOutLeft{20%{opacity:1;transform:translate3d(20px, 0, 0)}to{opacity:0;transform:translate3d(-2000px, 0, 0)}}.bounceOutLeft{animation-name:bounceOutLeft}@keyframes bounceOutRight{20%{opacity:1;transform:translate3d(-20px, 0, 0)}to{opacity:0;transform:translate3d(2000px, 0, 0)}}.bounceOutRight{animation-name:bounceOutRight}@keyframes bounceOutUp{20%{transform:translate3d(0, -10px, 0)}40%,45%{opacity:1;transform:translate3d(0, 20px, 0)}to{opacity:0;transform:translate3d(0, -2000px, 0)}}.bounceOutUp{animation-name:bounceOutUp}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}.fadeIn{animation-name:fadeIn}@keyframes fadeInDown{0%{opacity:0;transform:translate3d(0, -100%, 0)}to{opacity:1;transform:none}}.fadeInDown{animation-name:fadeInDown}@keyframes fadeInDownBig{0%{opacity:0;transform:translate3d(0, -2000px, 0)}to{opacity:1;transform:none}}.fadeInDownBig{animation-name:fadeInDownBig}@keyframes fadeInLeft{0%{opacity:0;transform:translate3d(-100%, 0, 0)}to{opacity:1;transform:none}}.fadeInLeft{animation-name:fadeInLeft}@keyframes fadeInLeftBig{0%{opacity:0;transform:translate3d(-2000px, 0, 0)}to{opacity:1;transform:none}}.fadeInLeftBig{animation-name:fadeInLeftBig}@keyframes fadeInRight{0%{opacity:0;transform:translate3d(100%, 0, 0)}to{opacity:1;transform:none}}.fadeInRight{animation-name:fadeInRight}@keyframes fadeInRightBig{0%{opacity:0;transform:translate3d(2000px, 0, 0)}to{opacity:1;transform:none}}.fadeInRightBig{animation-name:fadeInRightBig}@keyframes fadeInUp{0%{opacity:0;transform:translate3d(0, 100%, 0)}to{opacity:1;transform:none}}.fadeInUp{animation-name:fadeInUp}@keyframes fadeInUpBig{0%{opacity:0;transform:translate3d(0, 2000px, 0)}to{opacity:1;transform:none}}.fadeInUpBig{animation-name:fadeInUpBig}@keyframes fadeOut{0%{opacity:1}to{opacity:0}}.fadeOut{animation-name:fadeOut}@keyframes fadeOutDown{0%{opacity:1}to{opacity:0;transform:translate3d(0, 100%, 0)}}.fadeOutDown{animation-name:fadeOutDown}@keyframes fadeOutDownBig{0%{opacity:1}to{opacity:0;transform:translate3d(0, 2000px, 0)}}.fadeOutDownBig{animation-name:fadeOutDownBig}@keyframes fadeOutLeft{0%{opacity:1}to{opacity:0;transform:translate3d(-100%, 0, 0)}}.fadeOutLeft{animation-name:fadeOutLeft}@keyframes fadeOutLeftBig{0%{opacity:1}to{opacity:0;transform:translate3d(-2000px, 0, 0)}}.fadeOutLeftBig{animation-name:fadeOutLeftBig}@keyframes fadeOutRight{0%{opacity:1}to{opacity:0;transform:translate3d(100%, 0, 0)}}.fadeOutRight{animation-name:fadeOutRight}@keyframes fadeOutRightBig{0%{opacity:1}to{opacity:0;transform:translate3d(2000px, 0, 0)}}.fadeOutRightBig{animation-name:fadeOutRightBig}@keyframes fadeOutUp{0%{opacity:1}to{opacity:0;transform:translate3d(0, -100%, 0)}}.fadeOutUp{animation-name:fadeOutUp}@keyframes fadeOutUpBig{0%{opacity:1}to{opacity:0;transform:translate3d(0, -2000px, 0)}}.fadeOutUpBig{animation-name:fadeOutUpBig}@keyframes flip{0%{transform:perspective(400px) rotateY(-1turn);animation-timing-function:ease-out}40%{transform:perspective(400px) translateZ(150px) rotateY(-190deg);animation-timing-function:ease-out}50%{transform:perspective(400px) translateZ(150px) rotateY(-170deg);animation-timing-function:ease-in}80%{transform:perspective(400px) scale3d(.95, .95, .95);animation-timing-function:ease-in}to{transform:perspective(400px);animation-timing-function:ease-in}}.animated.flip{-webkit-backface-visibility:visible;backface-visibility:visible;animation-name:flip}@keyframes flipInX{0%{transform:perspective(400px) rotateX(90deg);animation-timing-function:ease-in;opacity:0}40%{transform:perspective(400px) rotateX(-20deg);animation-timing-function:ease-in}60%{transform:perspective(400px) rotateX(10deg);opacity:1}80%{transform:perspective(400px) rotateX(-5deg)}to{transform:perspective(400px)}}.flipInX{-webkit-backface-visibility:visible !important;backface-visibility:visible !important;animation-name:flipInX}@keyframes flipInY{0%{transform:perspective(400px) rotateY(90deg);animation-timing-function:ease-in;opacity:0}40%{transform:perspective(400px) rotateY(-20deg);animation-timing-function:ease-in}60%{transform:perspective(400px) rotateY(10deg);opacity:1}80%{transform:perspective(400px) rotateY(-5deg)}to{transform:perspective(400px)}}.flipInY{-webkit-backface-visibility:visible !important;backface-visibility:visible !important;animation-name:flipInY}@keyframes flipOutX{0%{transform:perspective(400px)}30%{transform:perspective(400px) rotateX(-20deg);opacity:1}to{transform:perspective(400px) rotateX(90deg);opacity:0}}.flipOutX{animation-name:flipOutX;-webkit-backface-visibility:visible !important;backface-visibility:visible !important}@keyframes flipOutY{0%{transform:perspective(400px)}30%{transform:perspective(400px) rotateY(-15deg);opacity:1}to{transform:perspective(400px) rotateY(90deg);opacity:0}}.flipOutY{-webkit-backface-visibility:visible !important;backface-visibility:visible !important;animation-name:flipOutY}@keyframes lightSpeedIn{0%{transform:translate3d(100%, 0, 0) skewX(-30deg);opacity:0}60%{transform:skewX(20deg);opacity:1}80%{transform:skewX(-5deg);opacity:1}to{transform:none;opacity:1}}.lightSpeedIn{animation-name:lightSpeedIn;animation-timing-function:ease-out}@keyframes lightSpeedOut{0%{opacity:1}to{transform:translate3d(100%, 0, 0) skewX(30deg);opacity:0}}.lightSpeedOut{animation-name:lightSpeedOut;animation-timing-function:ease-in}@keyframes rotateIn{0%{transform-origin:center;transform:rotate(-200deg);opacity:0}to{transform-origin:center;transform:none;opacity:1}}.rotateIn{animation-name:rotateIn}@keyframes rotateInDownLeft{0%{transform-origin:left bottom;transform:rotate(-45deg);opacity:0}to{transform-origin:left bottom;transform:none;opacity:1}}.rotateInDownLeft{animation-name:rotateInDownLeft}@keyframes rotateInDownRight{0%{transform-origin:right bottom;transform:rotate(45deg);opacity:0}to{transform-origin:right bottom;transform:none;opacity:1}}.rotateInDownRight{animation-name:rotateInDownRight}@keyframes rotateInUpLeft{0%{transform-origin:left bottom;transform:rotate(45deg);opacity:0}to{transform-origin:left bottom;transform:none;opacity:1}}.rotateInUpLeft{animation-name:rotateInUpLeft}@keyframes rotateInUpRight{0%{transform-origin:right bottom;transform:rotate(-90deg);opacity:0}to{transform-origin:right bottom;transform:none;opacity:1}}.rotateInUpRight{animation-name:rotateInUpRight}@keyframes rotateOut{0%{transform-origin:center;opacity:1}to{transform-origin:center;transform:rotate(200deg);opacity:0}}.rotateOut{animation-name:rotateOut}@keyframes rotateOutDownLeft{0%{transform-origin:left bottom;opacity:1}to{transform-origin:left bottom;transform:rotate(45deg);opacity:0}}.rotateOutDownLeft{animation-name:rotateOutDownLeft}@keyframes rotateOutDownRight{0%{transform-origin:right bottom;opacity:1}to{transform-origin:right bottom;transform:rotate(-45deg);opacity:0}}.rotateOutDownRight{animation-name:rotateOutDownRight}@keyframes rotateOutUpLeft{0%{transform-origin:left bottom;opacity:1}to{transform-origin:left bottom;transform:rotate(-45deg);opacity:0}}.rotateOutUpLeft{animation-name:rotateOutUpLeft}@keyframes rotateOutUpRight{0%{transform-origin:right bottom;opacity:1}to{transform-origin:right bottom;transform:rotate(90deg);opacity:0}}.rotateOutUpRight{animation-name:rotateOutUpRight}@keyframes hinge{0%{transform-origin:top left;animation-timing-function:ease-in-out}20%,60%{transform:rotate(80deg);transform-origin:top left;animation-timing-function:ease-in-out}40%,80%{transform:rotate(60deg);transform-origin:top left;animation-timing-function:ease-in-out;opacity:1}to{transform:translate3d(0, 700px, 0);opacity:0}}.hinge{animation-name:hinge}@keyframes jackInTheBox{0%{opacity:0;transform:scale(.1) rotate(30deg);transform-origin:center bottom}50%{transform:rotate(-10deg)}70%{transform:rotate(3deg)}to{opacity:1;transform:scale(1)}}.jackInTheBox{animation-name:jackInTheBox}@keyframes rollIn{0%{opacity:0;transform:translate3d(-100%, 0, 0) rotate(-120deg)}to{opacity:1;transform:none}}.rollIn{animation-name:rollIn}@keyframes rollOut{0%{opacity:1}to{opacity:0;transform:translate3d(100%, 0, 0) rotate(120deg)}}.rollOut{animation-name:rollOut}@keyframes zoomIn{0%{opacity:0;transform:scale3d(.3, .3, .3)}50%{opacity:1}}.zoomIn{animation-name:zoomIn}@keyframes zoomInDown{0%{opacity:0;transform:scale3d(.1, .1, .1) translate3d(0, -1000px, 0);animation-timing-function:cubic-bezier(.55, .055, .675, .19)}60%{opacity:1;transform:scale3d(.475, .475, .475) translate3d(0, 60px, 0);animation-timing-function:cubic-bezier(.175, .885, .32, 1)}}.zoomInDown{animation-name:zoomInDown}@keyframes zoomInLeft{0%{opacity:0;transform:scale3d(.1, .1, .1) translate3d(-1000px, 0, 0);animation-timing-function:cubic-bezier(.55, .055, .675, .19)}60%{opacity:1;transform:scale3d(.475, .475, .475) translate3d(10px, 0, 0);animation-timing-function:cubic-bezier(.175, .885, .32, 1)}}.zoomInLeft{animation-name:zoomInLeft}@keyframes zoomInRight{0%{opacity:0;transform:scale3d(.1, .1, .1) translate3d(1000px, 0, 0);animation-timing-function:cubic-bezier(.55, .055, .675, .19)}60%{opacity:1;transform:scale3d(.475, .475, .475) translate3d(-10px, 0, 0);animation-timing-function:cubic-bezier(.175, .885, .32, 1)}}.zoomInRight{animation-name:zoomInRight}@keyframes zoomInUp{0%{opacity:0;transform:scale3d(.1, .1, .1) translate3d(0, 1000px, 0);animation-timing-function:cubic-bezier(.55, .055, .675, .19)}60%{opacity:1;transform:scale3d(.475, .475, .475) translate3d(0, -60px, 0);animation-timing-function:cubic-bezier(.175, .885, .32, 1)}}.zoomInUp{animation-name:zoomInUp}@keyframes zoomOut{0%{opacity:1}50%{opacity:0;transform:scale3d(.3, .3, .3)}to{opacity:0}}.zoomOut{animation-name:zoomOut}@keyframes zoomOutDown{40%{opacity:1;transform:scale3d(.475, .475, .475) translate3d(0, -60px, 0);animation-timing-function:cubic-bezier(.55, .055, .675, .19)}to{opacity:0;transform:scale3d(.1, .1, .1) translate3d(0, 2000px, 0);transform-origin:center bottom;animation-timing-function:cubic-bezier(.175, .885, .32, 1)}}.zoomOutDown{animation-name:zoomOutDown}@keyframes zoomOutLeft{40%{opacity:1;transform:scale3d(.475, .475, .475) translate3d(42px, 0, 0)}to{opacity:0;transform:scale(.1) translate3d(-2000px, 0, 0);transform-origin:left center}}.zoomOutLeft{animation-name:zoomOutLeft}@keyframes zoomOutRight{40%{opacity:1;transform:scale3d(.475, .475, .475) translate3d(-42px, 0, 0)}to{opacity:0;transform:scale(.1) translate3d(2000px, 0, 0);transform-origin:right center}}.zoomOutRight{animation-name:zoomOutRight}@keyframes zoomOutUp{40%{opacity:1;transform:scale3d(.475, .475, .475) translate3d(0, 60px, 0);animation-timing-function:cubic-bezier(.55, .055, .675, .19)}to{opacity:0;transform:scale3d(.1, .1, .1) translate3d(0, -2000px, 0);transform-origin:center bottom;animation-timing-function:cubic-bezier(.175, .885, .32, 1)}}.zoomOutUp{animation-name:zoomOutUp}@keyframes slideInDown{0%{transform:translate3d(0, -100%, 0);visibility:visible}to{transform:translateZ(0)}}.slideInDown{animation-name:slideInDown}@keyframes slideInLeft{0%{transform:translate3d(-100%, 0, 0);visibility:visible}to{transform:translateZ(0)}}.slideInLeft{animation-name:slideInLeft}@keyframes slideInRight{0%{transform:translate3d(100%, 0, 0);visibility:visible}to{transform:translateZ(0)}}.slideInRight{animation-name:slideInRight}@keyframes slideInUp{0%{transform:translate3d(0, 100%, 0);visibility:visible}to{transform:translateZ(0)}}.slideInUp{animation-name:slideInUp}@keyframes slideOutDown{0%{transform:translateZ(0)}to{visibility:hidden;transform:translate3d(0, 100%, 0)}}.slideOutDown{animation-name:slideOutDown}@keyframes slideOutLeft{0%{transform:translateZ(0)}to{visibility:hidden;transform:translate3d(-100%, 0, 0)}}.slideOutLeft{animation-name:slideOutLeft}@keyframes slideOutRight{0%{transform:translateZ(0)}to{visibility:hidden;transform:translate3d(100%, 0, 0)}}.slideOutRight{animation-name:slideOutRight}@keyframes slideOutUp{0%{transform:translateZ(0)}to{visibility:hidden;transform:translate3d(0, -100%, 0)}}.slideOutUp{animation-name:slideOutUp}html#mip-i-story-standalone,html#mip-i-story-standalone body{width:100% !important;height:100% !important;margin:0 !important;padding:0 !important;cursor:auto !important}mip-story{position:relative !important;display:block;overflow:auto;-webkit-overflow-scrolling:touch;width:100% !important;height:100% !important;background:#000;overflow-scrolling:touch;-webkit-tap-highlight-color:transparent;tap-highlight-color:transparent}mip-story.mip-story-pc{user-select:none;-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;cursor:default}mip-story.mip-story-pc mip-story-view::after{content:'';display:block;width:100%;height:100%;position:absolute;left:0;top:0}mip-story.mip-story-pc .mip-story-close{display:none}mip-story,mip-story-view,mip-story-layer{overflow:hidden !important}mip-story-view{position:absolute !important;top:0 !important;right:0 !important;bottom:0 !important;left:0 !important;display:none !important;height:auto !important}mip-story-view[active]{display:block !important;will-change:transform}mip-story-view[current]{display:block !important;will-change:transform}mip-story-layer{position:absolute !important;top:0 !important;right:0 !important;bottom:0 !important;left:0 !important;overflow:hidden !important;padding:68px 32px 32px !important}mip-story-layer[template=cover]{box-sizing:border-box}mip-story-layer *{box-sizing:border-box;margin:0}.mip-story-system-layer{display:block !important;position:absolute;z-index:100000;top:0;right:0;left:0;padding:0 0 72px 0;background:-webkit-linear-gradient(top, #000, transparent);background:linear-gradient(top, #000, transparent)}.mip-story-progress{overflow:hidden}.mip-story-system-layer .control{width:50%;height:24px;position:absolute;top:20px;right:17px}.mip-story-system-layer span{width:24px;height:24px;float:right;margin-left:20px;background-repeat:no-repeat;background-position:center center;background-size:24px 24px}.mip-story-close{display:block;opacity:1;background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEQyQzc4MzE2N0NFMTFFODk1NUVCQ0Q3REIxMTdDRjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEQyQzc4MzI2N0NFMTFFODk1NUVCQ0Q3REIxMTdDRjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NDAzQjA3ODY3QzExMUU4OTU1RUJDRDdEQjExN0NGMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4RDJDNzgzMDY3Q0UxMUU4OTU1RUJDRDdEQjExN0NGMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqdVduYAAAF5SURBVHja7NxJDoMgFIDh2mu6c8fpPQId4sI0WkDeRPu/hJ1h+GKRsVPO+Uacxx0CgAACCCCAAAIIIOIwXiPpUtqem59p3dIyYDuXXf3nmna/21754LRlvI80EE76qPtqATQE0gGOPNDuFc0jIZ3g5K0tskCFAtNAOKm2720GGgWppo5qQNGRauumChQVqaVO6kDRkFrrYgIUBelKHcyAvJGulm0K5IXUU6Y5kDVSb1kuQFZIEmW4AWkjSeXtCqSFJJmnO5BCg0TBQwAJ9hcab2MMIIHPsUp/FgqoY7Sr2dnHArowmVQdLoQEalirsRhLxQQqAViNxkMDFZCspiqxgRqQklLZ8YEqkDRXAqoSW88SkvzE6KT5zDNQZKrx41MNJqssd7BgxpIri/Zs+8QHYuPQGUeqLA4vRALi+EtQnM5ROkfwXI/gcYiTY8AcJOcqguVVBC6zcB2KC3Xa98X+8krmxL+/fA+2ngECCCCAAAIIIICIw3gIMAC6gmoP9K42PAAAAABJRU5ErkJggg==')}.mip-story-close:active{opacity:.6}.mip-story-shares{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEQyQzc4MzU2N0NFMTFFODk1NUVCQ0Q3REIxMTdDRjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEQyQzc4MzY2N0NFMTFFODk1NUVCQ0Q3REIxMTdDRjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4RDJDNzgzMzY3Q0UxMUU4OTU1RUJDRDdEQjExN0NGMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4RDJDNzgzNDY3Q0UxMUU4OTU1RUJDRDdEQjExN0NGMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhAGK/EAAAS5SURBVHja7JtLbE1BGMePlnpdlWi6IPVIqEelLDxi4bWSYlVVYUEiqUclSCSEhQWxEmyQIISKRARdEIJVPRISRZC4goVHxatNxCNX0F7/L/1u3Ezm9LxmzuN2vuSXdM65Z843/858Z+Y7Z/pks1nLmL0VGQmMQEYgI5ARyAhkBDIC9VLrG8E9i8F0MA9UgQlgDEgxHWAjOBsHgfqENJMmURaAVWARKHX4fQYMBX8KvQdRj2gA28BwD9f1ByU2AtHxqWCwD3/+gifgm+srqAdpoAisB+1Zf7bTpt5S8DgbzDpAldu26OhB1eA4mOnwu/fgFkiDF+AL+AHego821ywEUwL6NwysA5ujGGI0nA6CATbnX4ImcJ5F8WpfFfk5NOwYREH4EFhvc/4e2AWu06gOcJ8bYC9YCQa5iGMDArdMQbwpARdsxnsbqNcU53qiArzqIQ6dCisGFfN8ZYnk3Dmw1tMTQ41VgBYwNg4z6cMScbrAJrA8RuL8iUKgBn4aiI4s40BtxUScy/xUDVWgaokIXdxrLsZMnKXgd5gC0TUnJE8Imlc0F5I4fgWiwDtDEpAPFZo4fgSitdUe4Vgbi1Zw4vgRaA0oE45tidHTSqk4XgWiOdNW4dhdXjYUpDheBVogSVnsLmRxvAq0UijTYvNaQsTpFFdYqgXqy5nAfGtKUM95KJQfq16szpIs+CojXnhe4oWymzootbwDtIB9Hq5zLdA2wbl3CRInEG6H2GShfLMQA3KQGDRRKD/vDeJ4EWi0JHWaVHEGgn6qBUoJ5c+axBmhWZztPOun3PYKlU8x0WZoCopHNQbkcqHedpVBOixLaYw5Y4Rymcoh9tOhIapsH/jEf19UHJBTDm2ynSG7MXqhl/+qt1yTQI84DqU0ZAjKJW1S1oPeCOXxGodZl6b0yXiHNgUS6LnDvCgJ5msu51agtFCem0CB5jq0KZBALUJ5JKhMkDiV7HNPbQokUKskqNUnSKB6SYBuVSkQfXh01SGBFmcTfb3KbVKaUWySBL2aBIhTIwnQrpN9Xr5RpDkTfdyUn5e+A+bEXKDbYHZe+QMYpaMHUYX7hWN047oYi1MniGNxG/7q6EG56fprYR1DLw4nuZ2ZhryuS3P6JGcdvCZz7avXxSpVvFOSvzkSw95zRBDHYt+9/SN9fsHaKklLNEbwJZkdjRL/Wtl3T3X5daAaZAQHOkFtDMSpZV/yLcM+W2EJRDRI/ku/Ihapln0QrcFvnUEdOiZxpjOi4dYo6TlZ9tGKSqBi0GzzJekZkApBmBTfS2bN7GNkAuU+A7YTiV4w1mkUp47vYSdO4Fy2KkeLbYZbzm6BGoXC1HCddnYsaM9RLVCOtZKnW76l+R35OB91j+Nr0z3Un2EflLVJx34x+gL2JJjmIo1La7lnVveLSNrM8p3PDeEcMuVxqni5MNqhvgdgNXiqtDUat0NtCLAdyou1872KdLRF945DWg/RBpctlrcNdW6MVuUHeEmhbR0Y1pZMehee25K52PK3WzD3LusKOG117/zRvmUzLIHEvBJ9Zz2fswATrf+begfybzLcK17z24c055Dve0lVJFWgRJnZN28EMgIZgYxARiAjkBGot9o/AQYASDRwsINjlt4AAAAASUVORK5CYII=')}.icon-wrap{position:absolute;left:17px;top:14px;height:35px}.icon-wrap .icon,.icon-wrap .icon-name,.icon-wrap .icon-type{display:inline-block;vertical-align:middle}.icon-wrap .icon{width:35px;height:35px;border-radius:50%;-webkit-border-radius:50%;overflow:hidden}.icon-wrap .icon-name{font-size:16px;color:#ffffff;margin-left:8px;margin-right:6px}.icon-wrap .icon-type{position:relative;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;vertical-align:middle;text-align:center;height:10px;line-height:11px;font-size:10px;color:#ffffff;border:1px solid rgba(255,255,255,0.5);border-radius:2px;-webkit-border-radius:2px;padding:1px 2px;font-family:Arial,Helvetica,sans-serif}.mip-stoy-audio{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzJDNkRCQTI2N0NGMTFFODk1NUVCQ0Q3REIxMTdDRjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzJDNkRCQTM2N0NGMTFFODk1NUVCQ0Q3REIxMTdDRjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMkM2REJBMDY3Q0YxMUU4OTU1RUJDRDdEQjExN0NGMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMkM2REJBMTY3Q0YxMUU4OTU1RUJDRDdEQjExN0NGMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvfuaLwAAAS1SURBVHja7JtpSFRRFMdnzMo2rQyzrKD8IkRku5EY2p5Y2IJlUEErJQkV0Yc2UDCiKIiiD1F9KFok+iJFtBJFRUEpVFC4lAu2WZa22/S/cAceh/Nm3rx5b+bZuwd+H+6b85b5z33n3nvOHa/P5/Mo0zevEkgJpARSAimBlEBKICWQEkgZZzEOepZscAV8BW/BSTBY9SCPpws4CIrE85DPGkAGaHSrQL3BBTAngM9ZUOhGgVJABUgP4vcd9HRbDBoNHjDiNMhYpLUebotB4nU6D/qQ409BLmgC9KG8bhFoPTgMYsnxy6AAtMm2YwTyCIEiQAzY5+PtCOhC/KkZucccUA/egzVWPXskxOkBypkv3QE265xjRqA6cs5e4HW6QEngPvOFv4H8AOeZEaiaOe+QkwVK03noZjAxyLlmBJoFvjPnljlRoKmghXnYZ2C4gfPNCCTIZO77Fywz+13MjGJ9wVqQB1JBHOMTL5cQWrsJFoFPRsaOMEaxCeAaSCCTzcmg0u5RLFeOEqHaSdAthPuY7UF+csBvco0noKudr9g88CdEYUT33mliNAlXIMFG5jq77BIoUSemBLIXYInJL2dEoAXgHaiVAZrzuUSu8xOk2iFQKbmR6Em7wVDQT4dwgrwRgZrI83CTw2TwkVzrtB0CVZGb7LB5/mREoDqDo1UR8ROxaZjVAv0kN0lxgEBiovmDeYXGEb840Ej8Sq0WiFqCAwTyz3tamblWHPErJj7VRgeOzi6Q3pC+jfj0Z3rbKCPP4qSkvVkTE9AScmwL6K5pt0g/WiToVFWNcGwvqNW0k8Bc4nObtMe7SaBf4BA5RgWiy4w0Nwkk7CJpTyTtWtIeZmXK1ccsWFvtTHSaXKy2yoWysC9kwToQNGvaP4wUBP6nHuQhmYL4ICLHuu0V8xci/dbOpGBob3OVQENAoqZdTz4fTtrNbhMol7Qfk/ZI0n7uJoFEfFlHjl0l7RzSrnLTKLYCnCLxJUUTh0Ra+D2JUZngnht6ULycSWvtOAnS+UScFrk3wBWv2BGQrGmL+c8+4rOJmVR2WJm0/0JWwkMcsprfzvgWEZ9sxifD6nxQJbnBTgcIVCCziFq7LvcBaPcEPCI+d+xIuZYwOek9sggYrZz0G+JTL0vdgRJlPplks1yg/kzyO5iJrN1KGwWq0Xz+GaSTz0X1oo1cp8LOuliuibqYf3tLVxsEmg1eg5cgi8lD01erLdSSj5na/CxZiwrV7soSTKQKhyeYaxRHqjYv5hMb5NR+BOjF+PRhVstiK+9C8NDm2vx2UEaO3QLTwV+n7DAbw9StfDJxvsrGHrSWGdkaQuy9EdsfNADc0HnljgaJS2YEms/EyHYwyck7zGLBgQBxaZCFAtUwRcS8zrBHUVAof00f0/0zLBLoFZmnFXaWTZzauFSrE5dWWyDQTFli/gCWW/Xckd4nPQCcA9OYz46BYvCbGW3++33SWsSe6P0B4tIMZkesJ1pE888sS2XeJtgfVUTeZnK0HjKa+SDxN6cpoC6I35mo5nId8Ie6RCnWDJ3ekyXjkmsF8gfhxWANGCuXKeVgK/js9h7k7HKJEkgJpARSAimBlEBKICWQEkgZZ/8EGADUHYH/5J6b0QAAAABJRU5ErkJggg==')}.mip-stoy-audio[muted]{background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEQyQzc4Mzk2N0NFMTFFODk1NUVCQ0Q3REIxMTdDRjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEQyQzc4M0E2N0NFMTFFODk1NUVCQ0Q3REIxMTdDRjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4RDJDNzgzNzY3Q0UxMUU4OTU1RUJDRDdEQjExN0NGMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4RDJDNzgzODY3Q0UxMUU4OTU1RUJDRDdEQjExN0NGMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pl6qyekAAAYWSURBVHja7FtrbBVFFL5tsZJSoFgi8jJWQ2LRGiSKPxSlVyOU2hB8BKVGSjBXI+EPCQ0kSkJCgsYHCUn9YVB8JUZ+yKtUBSG0iomxQRRRfIClAvXRYmmRQq29fmMOyeTk7L37mN27N5mTfMmd2Zmzs9/uzJw559yCdDqdsOIshZYCS5AlyBJkCbIEWYIsQZYgK3En6H5gL3AB6AJeByaHcJ9HgTNAJzAva2t11MgxRgCvpmX5FZho8F5PA/9q+s9k65NrckYDH6czy2ZD91oNDDPdsSZoKvBNOrucM3CvDYLeS0BtXAmaCZwWBv0zUC3U+71PAdAk6PsbqHGjIxfkPAD0C4P+HBgPjDVEUBHwtqCrF5jtVk/U5CwHhoRBbwVGUhsTBF0JbBf0/ElfbyJuBBUCrzisMc/TVEgYImgUsFfQoaZ0pdexR0FOCfCBMOB/gJTQPghBZcBBof8JoMLP+MMmZwLwhTDgPmCuQx+/BF0NHBL6fhvElgqTnOn05iTjrypDPz8EXQt8L/T7EigP8hxhkZMEzgoDVm94Upa+XgmaBnQIfVqBMUGfxU+nMrJK1VzvIiI4pJ1qN1DqQr8XgqpoDFxaaO1bTDvXb8D8KAiqpRt6lSaySxIGCZoF9Aht3weK6YzXx+yfKWEStNDhy8gk6mC40uOg3BCUZA+vn9uKNEORG6TbwiLoKuAvj+S0A3U+T/cXmXGnX1c6B4T7bWT2lMIaoV11GAStFQ56jbS1hrHIr6Gvb4is78v1jwGDwkOvy0D2Eda2LQyC2tlNVkV02td3vJQwxYddTOEagdDbTRPEp9eEiM9wqwRfjiJrGV2/k7b6TmCOcKI/7NfH5HaAptwPfrDewZezSGujW9Bdgv3zBOuvTJEr8p0g9eY3Cfe+IDi6vmNtXmDXRwo7mqvFOq5RjSLgDWAFq+8H5gO7Wf1LrJwCSrXyRWAPa3NXvoZ9ioGtQAOr7wGSwAGhzxbgsFYuAxawNm2sfGs+ElQC7AIeZPUqDHQP0O4UnAGahDCSLkdYeZqbAY2IETljgWbh0+8A7gOOZ+n/ISvPYuWTrHxNPn1B44H9AjnHgNkuyFFyGujTylPZ9fOsXJovBE2h9WEmqz9E5JzyoKuXTdfAsyXXBN0AfApUsvrPaEHu9qiv3IEsJeNYuS/uBN1E5FzH6tV2PBc451GfWnRHaeUT7Pr1rHwqzgTdBrQCE1n9NqCOEhi8Sp0wRXW5hZWPxpWgOcA+Nh2UvAk8AgySLbQEqHe5dhSScahLCysnWflrV6ON+KhRS0cFLpuYL2eHdu0tF3qXMH1/kFdRdxNzN0lV3M5ii+iQyWW9cG4aZnH0THpV1OL3LP6hFUIQMVan+WUOvpzGgE579dU1s7bdpEOP6h5lbV42TRA/CXtxfq908OU8ZSCqIaW1LGVtFgsvZnrYHsXnXPZbJzzAILlOg0Y1UkK7XWwtU+vQj6xNcxgu12eFL2At+XydPv2NwgMMuHDkuyWom7X5hYILmV7QsBd3q9eohhQPe9EhL2ez0LafwjWm4mL6wtwj7EozhJ3rvTDjYjXCLtTK2hRT4I6LeoA7DAcOH6KI6U8UROQ6fhBS+SaHHVmdR4mPl2U5S3NpER6uy63NYSg/qMAheSoVVWxexdfrWRrbGPqauHRQckEiQoKknW2HEFSMLLujnNJMuByjtBSe/RUmQY1CXzUFx+Uq/WUSJShx+YrFzpR1vFNLgbk5BIIaBHur1+P0NkpQhUOC1EE6++ht64U03AbDBJ0VwkPJoDPE72m+kpxaFaz+E3KWc2fVgOCc30IoMeQluKT9HqL/ZOwPrNVnErhkE22n9FunLNfXHLJAVHLBjQa+oAVkG6mD6MOmApheO9xN85rLuxmsah1LHVJXztMfTQoMJpJHTlANrR1S9piXLXSGcD7SU+fuFYzM2BNU5+DL2eDzxspuesdlItaBfCCoUxj4agMDeNxhyuryZD4QdJzlHT5jOFFqnwM5bR6SP3NKUDWtGydN7hDs/KT0fkTJWmrdUf9CHJ1LchT+X1yt2H89W4IsQZYgS5AlyBJkCbJiCfIo/wkwAEb1xvYv6O9NAAAAAElFTkSuQmCC')}.mip-story-progress-bar{position:absolute;right:17px;left:17px;display:flex !important;display:-webkit-flex !important;display:-webkit-box;height:14px;-webkit-align-items:center !important;align-items:center !important;-webkit-box-align:center;-moz-box-align:center;-webkit-box-pack:center;-moz-box-pack:center;-webkit-justify-content:center !important;justify-content:center !important}.mip-story-progress-bar>:last-child{margin-right:0 !important}.mip-story-page-progress-bar{overflow:hidden;height:2px;margin:0 6px 0 0;list-style-type:none;border-radius:2px;-webkit-border-radius:2px;background:rgba(255,255,255,0.3);-webkit-box-flex:1;-moz-box-flex:1;-webkit-flex:1 !important;flex:1 !important}.mip-story-page-progress-bar-active{transition:transform 200ms ease !important;-webkit-transform:scale(1, 1) !important;transform:scale(1, 1) !important;-webkit-transform-origin:left;transform-origin:left}.mip-story-page-progress-bar-visited{background:#fff;-webkit-transform:scale(1, 1) !important;transform:scale(1, 1) !important}.mip-story-page-progress-value{width:100%;height:100%;background:#fff;-webkit-transform:scale(0, 1);transform:scale(0, 1);-webkit-transform-origin:left;transform-origin:left}mip-story-layer[template=fill],mip-story-layer[template=cover],mip-story-layer[template=vertical],mip-story-layer[template=horizontal],mip-story-layer[template=thirds]{display:flex !important;display:-webkit-flex !important;display:-webkit-box;height:100%}mip-story-layer[template=magazine]{padding-right:0 !important;overflow:hidden}[flex-area=magazine-img]{position:relative;overflow:hidden;height:70%;max-height:450px;margin-top:10px}[flex-area=magazine-content]{padding-right:32px !important;height:34%;overflow:hidden;display:flex !important;display:-webkit-flex !important;display:-webkit-box;flex-direction:column;justify-content:center;min-height:100px;text-align:left}mip-story-layer[template=magazine]>h1{font-size:28px}[flex-area=magazine-content]>h1{font-size:28px;text-align:left}[flex-area=magazine-content]>h2{font-size:20px;text-align:left}[flex-area=magazine-content]>p{font-size:100%;line-height:200%;margin-top:11px}mip-story-layer[template=center],mip-story-layer[template=under-center],mip-story-layer[template=under-left],mip-story-layer[template=under-right],mip-story-layer[template=up-left],mip-story-layer[template=up-center],mip-story-layer[template=up-right]{display:flex !important;display:-webkit-flex !important;flex-direction:column;font-size:16px}mip-story-layer[template=center]>h1,mip-story-layer[template=under-center]>h1,mip-story-layer[template=under-left]>h1,mip-story-layer[template=under-right]>h1,mip-story-layer[template=up-left]>h1,mip-story-layer[template=up-center]>h1,mip-story-layer[template=up-right]>h1{font-size:45px}mip-story-layer[template=center]>h2,mip-story-layer[template=under-center]>h2,mip-story-layer[template=under-left]>h2,mip-story-layer[template=under-right]>h2,mip-story-layer[template=up-left]>h2,mip-story-layer[template=up-center]>h2,mip-story-layer[template=up-right]>h2{font-size:40px}mip-story-layer[template=center]>h3,mip-story-layer[template=under-center]>h3,mip-story-layer[template=under-left]>h3,mip-story-layer[template=under-right]>h3,mip-story-layer[template=up-left]>h3,mip-story-layer[template=up-center]>h3,mip-story-layer[template=up-right]>h3{font-size:35px}mip-story-layer[template=center]>h4,mip-story-layer[template=under-center]>h4,mip-story-layer[template=under-left]>h4,mip-story-layer[template=under-right]>h4,mip-story-layer[template=up-left]>h4,mip-story-layer[template=up-center]>h4,mip-story-layer[template=up-right]>h4{font-size:30px}mip-story-layer[template=center]>h5,mip-story-layer[template=under-center]>h5,mip-story-layer[template=under-left]>h5,mip-story-layer[template=under-right]>h5,mip-story-layer[template=up-left]>h5,mip-story-layer[template=up-center]>h5,mip-story-layer[template=up-right]>h5{font-size:25px}mip-story-layer[template=center]>h6,mip-story-layer[template=under-center]>h6,mip-story-layer[template=under-left]>h6,mip-story-layer[template=under-right]>h6,mip-story-layer[template=up-left]>h6,mip-story-layer[template=up-center]>h6,mip-story-layer[template=up-right]>h6{font-size:20px}mip-story-layer[template=center]>p,mip-story-layer[template=under-center]>p,mip-story-layer[template=under-left]>p,mip-story-layer[template=under-right]>p,mip-story-layer[template=up-left]>p,mip-story-layer[template=up-center]>p,mip-story-layer[template=up-right]>p{font-size:16px;line-height:30px}mip-story-layer[template=under-left]>h1,mip-story-layer[template=up-left]>h1{text-align:left}mip-story-layer[template=under-right]>h1,mip-story-layer[template=up-right]>h1{text-align:right}mip-story-layer[template=under-center],mip-story-layer[template=under-left],mip-story-layer[template=under-right]{justify-content:flex-end}mip-story-layer[template=up-center],mip-story-layer[template=up-left],mip-story-layer[template=up-right]{justify-content:flex-start}mip-story-layer[template=center]{justify-content:center;align-items:center}mip-story-layer[template=up-center],mip-story-layer[template=under-center]{align-items:center}mip-story-layer[template=up-left],mip-story-layer[template=under-left]{align-items:flex-start}mip-story-layer[template=up-right],mip-story-layer[template=under-right]{align-items:flex-end}mip-story-layer[template=fill]>:first-child,mip-story-layer[template=cover]>:first-child{position:absolute;top:0;right:0;bottom:0;left:0;display:block;width:auto;height:auto;object-fit:cover}mip-story-layer[template=fill]>:not(:first-child),mip-story-layer[template=cover]>:not(:first-child){display:none !important}mip-story-layer[template=fill]>mip-anim img,mip-story-layer[template=fill]>mip-img img,mip-story-layer[template=fill]>mip-video video,mip-story-layer[template=cover]>mip-anim img,mip-story-layer[template=cover]>mip-img img,mip-story-layer[template=cover]>mip-video video{object-fit:cover !important}mip-story-layer[template=horizontal]{flex-direction:row;-webkit-align-content:flex-start;align-content:flex-start;-webkit-align-items:stretch;align-items:stretch;-webkit-flex-direction:row}mip-story-layer[template=vertical]{flex-direction:column;margin-bottom:16px;-webkit-align-content:flex-start;align-content:flex-start;-webkit-align-items:stretch;align-items:stretch;-webkit-flex-direction:column}mip-story-layer[template=vertical]>*{width:100%}mip-story-layer[template=thirds]{flex-direction:column !important;-webkit-box-orient:vertical;-webkit-flex-direction:column !important}[flex-area=upper-third],[flex-area=middle-third],[flex-area=lower-third]{height:33%}.mip-backend{position:absolute;z-index:100002;top:0;left:0;display:none !important;width:100%;height:100%;text-align:center;color:#fff;background:#000}.mip-backend[active]{display:block !important}.mip-backend[current]{display:block !important}.mip-backend-outer{overflow-y:scroll;width:100%;height:100%;padding-top:86px;-webkit-box-sizing:border-box;box-sizing:border-box;background-size:cover;-webkit-overflow-scrolling:touch;overflow-scrolling:touch}.mip-backend-outer::-webkit-scrollbar{display:none}.mip-backend-outer .mip-backend-background{background-size:cover;position:absolute;left:0;top:0;width:100%;height:100%;-webkit-filter:blur(5px);filter:blur(5px);opacity:.3}.mip-story-middle{display:flex !important;display:-webkit-flex !important;display:-webkit-box;flex-direction:column !important;-webkit-box-orient:vertical;-webkit-box-pack:center;-webkit-flex-direction:column !important;-webkit-justify-content:center !important;justify-content:center !important}.mip-story-middle .mip-backend-preview{margin-top:0}.mip-backend-preview-mask{position:absolute;top:0;left:0;width:100%;height:100%;opacity:.5;background:#000}.mip-backend-preview-thumbnail{position:relative}.mip-backend-preview-thumbnail:active{opacity:.6}.mip-backend-preview-replay-btn{width:24px;height:24px;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAAEi6oPRAAAAAXNSR0IArs4c6QAACPhJREFUeAHtnGeoHUUUx32aaBILUTGIohE1ih0/GCviJwtEBAtKUMgnC4lYPggigoJKhNhQQROQfLNFv9h7oqigIliwBoypiC12jeX5++/d2Xt2dmbLvXvve944cN6cOed/yszOzu7O7n3bbOOV8fHxp6G1nrjTRKEy1yolyNq5RibtGiccoAM8Xb4J4LO8pNjaFlE4SR+Lt/t8WaFdK3FZCajiPMA+YNtOLuA0KSjnZELHIJwljWurVpvyi/4kcuofLcDxyMcSUPLHSQN1LZDsNJiVpRKUpZMxnk/kd0IzMrEPVJtylABjGcow0ppmjJ0yNjb2d0GJ7Ww5oPxSUAYE4PZM0OmfBOIEAXylCNuXZa9DfXzCVJpUAOREpQJWqdax3aESVRdAQl/2mpXsVHKxOiJPmEN0G2A3pfg7u1KPA3CccxqpK1egnEucLIK+TZ09klNWNTA6PDUsq9aV+jGW/8SAYK52OGHgdUJ2B9sqY06s3OGpu45o/CqFBdbhZeOKW2ymY3hiHWOL4ezvrh54/EdeLaAJj+lNib3+UN5qYhzEdvyMTw0qmwjlqAk+hk0GG1+HxgC15WnXimtvbQ8doDJ6EXLToKF5MrP/zoYnzeqDxl4wSG3nJ7Y0FqaCA5s4S23yBwvh16nigTrOgk6cIcrkBExBVzu5q5Fv5xyodnLV3XPFSMHoKJYdgGmcZn8Yk2YsAWZDH0NNywoMyhKrnwiONkSiv4N8HlQYHWQzoEXQd1Co3G0zALBLCgqfFyiPCHg5wzrphcfn0oBf3TtmcyXnF0VyY2mM1uYALTUCcf50MbMQCOY7oepMMUCGMPvbmFlcmHOMYssAcwi6NrE7EzLLDHjuchc0H6xwW5K534QoPu4Y5TDYztNRGmmiR0dpaLHanOYzOSoOmRYwV26eFFm5bFRPREKE3S/N4fckPo0pqSCphpkUAQ8Lxkbor9JnDzoxYr5rkolexz40ILFHt50YPpPtFhPngsoYgNcYA8ceXGkYAeDgSufE1Nf78MKtgw/AeBdk30Hb+bq0/Rv1KuirtD2H+jgodv/zPutdsn+S4vuvSPIG6HfT0xi7DkX14eg/peS2/GSC3QV9ZrLZDP8mdCNUvsfYUhLXmeB12d8AntpG/MwHDp+qG70Cd1nmtBcG56dHAughfAm0T8gv8rnQCihWuruGOAD0QQrsPJlFnL4W8PZYCFsmw8dMaGPA1/nOzuqcLFcDcE97Drs6B+ihgaPdnDNT3yFXpl28lqL0H3taPW3xv8omAJ87UXJ9Rfm4B270cJ1zVtIghuZfsGRmaOd4iCMy5QAYYj3oxUuaWShPuSRTDJAh5o9e3M4cQmjvGqP7jIPILZaQle87iMAxnwReboPrlNsrJ4hZDlBu4i9XQs8ZwYIBxq3lelI+l9XKfFgge1cXvskeViZpHJvQmiHHDoazCf0URAxZaBPaa8ixg+H+P8uCw2KEOmR6rkoKC+Sujp+wmiTshXXlRCRCDnp+U5mXxO/wnb/DToioBxTiI/jSCJcNMyni/mVin+tGaHsjFNv/W70avSLOAhs3Z4JiZVSZQ7bTIJb70MWFPbbg2WnSen0B0KLAi/VJ0DWgnT3gpiCwDyH+/elRfBaz/jEIvQnayWJ65fF9mtfh8mRcIIwO8g1pP+H0TWtsp0Pf+D4b+cF4qu8gbb9DXetCDE6bFckHV6mtqz6OJVNnS+8ejBfGHCB/H/oc+hraAzoGKntyOYktvdfB9Ffo2grXvR7ry/vLIGJNMkdDuTWrJMHl6BqdEJWHLJJXI7E6gcFZ0CmQdmjb+J5qA35egp6BnmQa/Ew9+QuDoa+rNN2SjzCoh11WE/BSaPs2RqvvGUQi2ue/BboUiu31l+Wq+1UtGhshfb2omSCZPpDaEdKKtzek7VX7SEKzVtGidDkz7NUqNH3RVuz50CzoWWzeq7IJ6nGkJTz7FAG+qmhp1wdstZb3YFBPiC/loMuAXiuFLgWIC0WvHILbgsivKKDZOvbCljdxoAvumoAjX/QEgp5fY5VnEdcSU7c1i6DYBzCosnKt9YQ0eMAtJspjrNsjfx89i5QyOpKNrhDRgC0pyEe3XhvT/GLVrQqHsvkAYaSbWf/tqw20iUbrb2NbGp/MDTnqdNQlvqwE33VlTnwGTwtLvK1HN5D3DX4ebbfJ+56SfhVUhfggtFe0soDsCgb+YUEhqZYFdEUf6+nCUVlyoUFrkbP7DdaB3j4O5VE/l9QAG/Rnge1giM/Co9R3MbHBGerGTJbUEBj6fAhkN4JodkuWAqIXuuIcd18GGlGG3mrrLnTn/2fSZZS6dwiVlSM6JsFuMQAXQR9BOpNug2bo+q91J/kBBbUtGtGJ36oOdmV4Qj3bXAzpuccvi3kW+d4XbnVtZsmLdtoYvv8feIzCaDIg35tBcexXo9C3NvqgU2xmwFGzp9iAg1ERxfZXdh6VDvbdD84p+1mmO8V04zRSd829DpRm0CsBY+0MnhmQb30iZkryE2k3dUz91tY3GpEeMyj2Ay8zRuMLIiYjKabj+ondhZA2/bsv02jokzx9exwqg/9EfBIMNx1/KND5NVlqKO2P2yx2C43uaGYWo8PQv6W2w4Z/I9dLFLGHVs2uE3LgEWnQr+fNgFh2NY3ibRDC+Rbl8UtGZFz0kK7fiW72+ueab8PE3xminAOFnvDlQF9eB98t/RcGj9y1pfwwFCu31+oH1nLk/zDAOl1L4z+zcZ/2J/hqJ+3Uz9SH1RocC8JoNrQBihW91Wz15x02fr88uc2CXo0ln8qv6TeOztk6Lw+1sJ3Rd7A+HZDD7tAyqKosBhBfa3rJA4c6IqGfTvnJ6Mr3GJT7h2C9xKyyIcZM6CpIp31V0dp6XpXPVvQE0scDZaefn6wGTe+jlkDzoH2gWkcQnN5lHQvpVkQDX+f9O7Cs3AuX+yFdK4NQ1wnBD4eCr2+zFIfLaDZdAk2p24eh4khsNqTfzvXyf1Iwa1T0w9RHIc3oWjOy7mC06qxOUDowDZzWpSOhOSnpdmF3aDfIlh9o6Mck66G10KeQPmp6lxcKX1APvPwLxaeA9DukJlMAAAAASUVORK5CYII=');background-size:cover}.mip-backend-close{position:absolute;z-index:1000;top:12px;left:7px}.mip-story-hint{position:absolute;z-index:100005;top:0;right:0;bottom:0;left:0;display:none}.mip-story-hint-shadow{display:block;width:25%;height:100%;background:-webkit-linear-gradient(left, rgba(0,0,0,0.5), transparent) !important;background:linear-gradient(90deg, rgba(0,0,0,0.5), transparent) !important}.mip-story-hint-damping-hide .mip-story-hint-shadow{display:none}.mip-story-hint-system,.mip-story-hint-rotate{display:none;height:100%}.mip-story-page-switch{display:none;width:100%;height:100%}.mip-story-page-switch-lt,.mip-story-page-switch-rt,.mip-story-page-switch-lt .mip-story-page-switch,.mip-story-page-switch-rt .mip-story-page-switch,.mip-story-page-switch-lt .mip-story-page-switch-left,.mip-story-page-switch-rt .mip-story-page-switch-right{display:block !important}.mip-story-page-switch-lt .mip-story-page-switch-right,.mip-story-page-switch-rt .mip-story-page-switch-left{display:none}.mip-story-hint-system{display:none;opacity:.8;background:#000}.mip-story-system-show .mip-story-hint-system{display:flex !important;display:-webkit-flex !important;display:-webkit-box}.mip-story-hint-left,.mip-story-hint-middle,.mip-story-hint-right{height:100%;-webkit-box-flex:1;-moz-box-flex:1;-webkit-flex:1 !important;flex:1 !important}.mip-story-hint-left{background:url(https://www.mipengine.org/static/img/mip-story/mip-story-arrow.png);background-repeat:no-repeat;background-position:26px;background-size:30px 30px}.mip-story-hint-middle-top{position:absolute;top:0;left:50%;width:1px;height:40%;font-size:13px;background:#ddd}.mip-story-hint-middle-icon{position:absolute;top:40%;right:0;left:0;display:flex !important;display:-webkit-flex !important;display:-webkit-box;flex-direction:column !important;height:20%;color:#fff;-webkit-align-items:center !important;align-items:center !important;-webkit-box-align:center;-moz-box-align:center;-webkit-box-orient:vertical;-webkit-box-pack:center;-moz-box-pack:center;-webkit-flex-direction:column !important;-webkit-justify-content:center !important;justify-content:center !important}.mip-story-hint-middle-icon span{display:block;margin-bottom:10px;text-align:center}.mip-story-hint-middle-bottom{position:absolute;bottom:0;left:50%;width:1px;height:40%;background:#fff}.mip-story-hint-right{background:url(https://www.mipengine.org/static/img/mip-story/mip-story-arrow.png);background-repeat:no-repeat;background-position:26px;background-size:30px 30px;-webkit-transform:rotate(180deg);transform:rotate(180deg)}.mip-story-hint-touch-icon{width:46px;height:50px;margin-top:14px;background:url(https://www.mipengine.org/static/img/mip-story/mip-story-touch.png);background-repeat:no-repeat;background-size:contain}.mip-story-hint-rotate{position:absolute;z-index:100003;top:0;left:0;width:100%;height:100%;text-align:center;color:#fff;background:#000}.mip-story-hint-rotate p{margin-top:10px}.mip-story-hint-rotate mip-img{width:47px;height:45px}@media all and (orientation:portrait){.mip-story-hint-rotate{display:none}}@media all and (orientation:landscape){.mip-story-hint{display:block !important}.mip-story-hint-rotate{display:flex !important;display:-webkit-flex !important;display:-webkit-box;flex-direction:column !important;-webkit-align-items:center !important;align-items:center !important;-webkit-box-align:center;-moz-box-align:center;-webkit-box-orient:vertical;-webkit-box-pack:center;-moz-box-pack:center;-webkit-flex-direction:column !important;-webkit-justify-content:center !important;justify-content:center !important}}.mip-story-share{position:absolute;z-index:1000010;bottom:-500%;width:100%}.mip-story-share-show{bottom:0;-webkit-transition:bottom 200ms ease;transition:bottom 200ms ease}.mip-story-share mip-share{width:100%}.mip-story-share-cancel{display:block;width:100%;height:30px;padding:10px 0;border-top:1px solid #eee;font-size:16px;text-align:center;color:#000;background:#fff}@keyframes spread{0%{transform:scale(1, 1)}100%{transform:scale(1.5, 1.5)}}@-webkit-keyframes spread{0%{transform:scale(1, 1)}100%{transform:scale(1.5, 1.5)}}.mip-story-page-switch-left{position:absolute;top:50%;left:17px;display:block;display:none}.mip-story-page-switch-right{position:absolute;top:50%;right:45px;display:block;display:none}.mip-story-page-switch-left>:first-child,.mip-story-page-switch-right>:first-child{position:absolute;top:50%;width:28px;height:28px;opacity:.1;border-radius:14px;background:#fff;background:linear-gradient(center, rgba(255,255,255,0.3), transparent);background:-webkit-linear-gradient(center, rgba(255,255,255,0.3), transparent);-webkit-animation:100ms;-webkit-animation:spread 1s ease-out;animation:spread 1s ease-out;animation-delay:100ms;-webkit-animation-fill-mode:backwards;animation-fill-mode:backwards}.mip-story-page-switch-left>:nth-child(2),.mip-story-page-switch-right>:nth-child(2){position:absolute;top:50%;display:block;width:28px;height:28px;opacity:.1;border-radius:14px;background:#fff}.recommend-wrap{text-align:left;border-top:1px solid rgba(255,255,255,0.3);padding-top:2px;margin:30px 17px 0 17px}.recommend-wrap .readmore{font-size:18px;line-height:3;color:#ffffff}.mip-backend-control{width:100%;height:44px;padding:10px 17px 0 17px;-webkit-box-sizing:border-box;box-sizing:border-box;margin-bottom:42px;background:rgba(0,0,0,0.5);z-index:9}.mip-backend-control .mip-story-close{position:relative;width:24px;height:24px;background-repeat:no-repeat;background-position:center center;background-size:24px 24px;float:right;left:0;top:0;margin-left:25px}.mip-backend-control .mip-backend-share{float:right}.mip-backend-control .mip-backend-share:active{opacity:.6}.mip-backend-control .mip-backend-preview-share-btn{display:block;width:24px;height:24px;background-repeat:no-repeat;background-position:center center;background-size:24px 24px;background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAolBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8ELnaCAAAANXRSTlMAgPj8BfLTaC8MA+sQCOeze3gi3ttFNcvHuplgTkEe48Cin1s9GMStp4VyVks6KhSrlG5Qjc71RbUAAAKGSURBVFjDpZbnmqpADIYjIEUFVOwFu2tfy+b+b+08JDtSBlbO8P5jeOabkC+ZAJ/on7ZQhRUiPgxQpo8RwxBU6SDR7IMiNWT0trKAwG+pC5ik0LOVBZw7KWhTVQGAk04SE0NVALYeKYxCVQHY7YWfigJgPBT8dO0DCTDn+n/5aXf8QEdCLN169BiU8HO+9jAGBM5XKT8dy8QUyd747GfDamISLVimYvM+9Od1GG8dTqzrN2TYjYr95BAZ72fQAIkPfookoX64GFDMpsjP1m/4S/uTxb3c/nR4v1ei6Vp5frpc7WMpsL+SlUzEhFa+ynbsnN3uxpmh53UDynKlDWfx2KXMTqA0fY7gnUfKiulCWdqcg0NqgGg2lKTlI3F8fzG1zxNKMghoe30GghnVD5TE0mi/2YU3VAJzKIW7RmLlJkKiG7egd8L0eO+aXIQWZGtoBmkat1dntV/oiJDgxY20GKQOiSw10+dYfh0FCdEjEmO6JtIpTITkTEf5V9puKdyT/0Jw905Sm8+WBbaecC+Dl0zhZoFZgDnpknvMLdGX1zh4ze9cwngyOXfJPcEzWr9Rjn7E7vr97KRG260n3JOJpAM6xEemt3Ezs3ETuycTcFeJEkHPMjLD1XjE7sm0olcdgCs3uF5zstM5HCXck5lH7/pgc5DeVh7vTeFePhZVQcjuLXcgCwj3CjhGZzgmD80GyALCvSLW0cFjvlJz/1TZvWKivRpfcA05QZJ7Mj38xTfy42P3itGQCfJH0vY0gz/5RkYbgBo2Mk9QZI7EGFS58Ad0QZUXCdRAmQ31rwvKTHlIq8K9NIQKnBDxAhVoI+6hCjUKoFIEJlTiiVOoxDkwoBKtAVTiH/QZqL/ije01AAAAAElFTkSuQmCC')}.recommend-item{display:block;height:88px;margin-bottom:20px;color:#fff;position:relative}.recommend-item.recommend-now{padding-left:17px;margin-bottom:0}.recommend-item.recommend-now .mip-backend-preview{left:17px;top:0}.recommend-item .mip-backend-preview{position:absolute;left:0;top:0;width:122px;height:88px;background-size:cover;background-repeat:no-repeat;background-position:0 0;overflow:hidden}.recommend-item .mip-backend-preview .mip-backend-preview-thumbnail{width:122px;height:88px}.recommend-item .mip-backend-preview .mip-backend-preview-thumbnail span{display:block;width:24px;height:24px;position:absolute;left:50%;top:50%;-webkit-transform:translate(-50%, -50%);-ms-transform:translate(-50%, -50%);transform:translate(-50%, -50%)}.recommend-detail{height:100%;padding-left:130px;padding-right:36px;text-align:left;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-pack:center;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center}.recommend-detail span,.recommend-detail p{font-size:18px;line-height:1.5;color:#fff;padding:0}.recommend-detail span:nth-child(2),.recommend-detail p:nth-child(2){font-size:10px;opacity:.6;padding-top:2px}.recommend-detail span a,.recommend-detail p a{color:#fff}.mip-story-hidden{visibility:hidden !important}@media only screen and (min-width:320px){.recommend-detail{padding-right:30px}.recommend-detail p{font-size:14px}}@media only screen and (min-width:375px){.recommend-detail{padding-right:32px}.recommend-detail p{font-size:16px}}@media only screen and (min-width:414px){.recommend-detail{padding-right:34px}.recommend-detail p{font-size:18px}}");
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