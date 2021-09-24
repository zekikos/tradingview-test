(window.webpackJsonp = window.webpackJsonp || []).push([
  ["replay"],
  {
    "+xKI": function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 7" width="7" height="7"><path fill="currentColor" d="M3.5 7L7 4H4V0H3V4H0L3.5 7Z"/></svg>';
    },
    A1GO: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><g fill-rule="evenodd" stroke-linecap="square"><path d="M3.429 3.429L14.57 14.57M3.429 14.571L14.57 3.43"/></g></svg>';
    },
    MQEA: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 7" width="9" height="7"><path fill="currentColor" d="M8.5 3.5L5 0v3H0v1h5v3z"/></svg>';
    },
    X51F: function (e, t, s) {
      "use strict";
      s.r(t);
      var i = s("Eyy1"),
        a = s("aIyQ"),
        o = s.n(a),
        r = s("brCa"),
        n = s("fZEr"),
        l = s("oOPW"),
        h = s("hY0g"),
        d = s.n(h),
        u = s("lxNp"),
        p = s("uDHo"),
        c = s("yzIY"),
        _ = s("pP4S"),
        y = s("txPx");
      const g = Object(y.getLogger)("ChartApi.Replay.ReplaySession");
      class b extends c.a {
        constructor(e) {
          super(e, "rs", !0),
            (this._replayPointChangedDelegate = new o.a()),
            (this._resolutionsChangedDelegate = new o.a()),
            (this._endOfDataReachedDelegate = new o.a());
        }
        destroy() {
          this._replayPointChangedDelegate.destroy(),
            this._resolutionsChangedDelegate.destroy(),
            this._endOfDataReachedDelegate.destroy(),
            super.destroy();
        }
        addSeries(e, t, s) {
          return this._getChartApi().replayAddSeries(this.sessionId(), e, t, s);
        }
        removeSeries(e, t, s) {
          return this._getChartApi().replayRemoveSeries(
            this.sessionId(),
            e,
            t,
            s
          );
        }
        startAutoplay(e, t) {
          return this._getChartApi().replayStart(this.sessionId(), e, t);
        }
        stopAutoplay(e) {
          return this._getChartApi().replayStop(this.sessionId(), e);
        }
        doStep(e, t) {
          return this._getChartApi().replayStep(this.sessionId(), e, t);
        }
        resetReplay(e, t) {
          return this._getChartApi().replayReset(this.sessionId(), e, t);
        }
        setReplayResolution(e, t) {
          return this._getChartApi().replaySetResolution(
            this.sessionId(),
            e,
            t
          );
        }
        onReplayPointChanged() {
          return this._replayPointChangedDelegate;
        }
        onReplayResolutionsChanged() {
          return this._resolutionsChangedDelegate;
        }
        onEndOfDataReached() {
          return this._endOfDataReachedDelegate;
        }
        _sendCreateSession() {
          this._getChartApi().replayCreateSession(this.sessionId());
        }
        _sendRemoveSession() {
          this._getChartApi().replayDeleteSession(this.sessionId());
        }
        _onMessage(e) {
          switch (e.method) {
            case _.ResponseMethods.point:
              const t = e.params[0];
              g.logDebug(
                this._generateLogMessage("New replay point received " + t)
              ),
                this._replayPointChangedDelegate.fire(t);
              break;
            case _.ResponseMethods.resolutions:
              const s = e.params[0],
                i = e.params[1];
              g.logNormal(
                this._generateLogMessage(
                  `Replay resolutions changed to: base=${s}, min=${i}`
                )
              ),
                this._resolutionsChangedDelegate.fire(s, i);
              break;
            case _.ResponseMethods.endOfData:
              g.logNormal(this._generateLogMessage("Replay reach end of data")),
                this._endOfDataReachedDelegate.fire();
              break;
            case _.ResponseMethods.instanceId:
              g.logInfo(
                this._generateLogMessage("Replay instance id=" + e.params[0])
              );
              break;
            default:
              g.logWarn(
                this._generateLogMessage(
                  "Unhandled message method: " + e.method
                )
              );
          }
        }
      }
      var v = s("LxhU");
      const R = Object(y.getLogger)("ChartApi.Replay.SubscriberManager"),
        m = Object(y.getLogger)("ChartApi.Replay.Subscriber");
      var C;
      !(function (e) {
        (e[(e.Fail = 0)] = "Fail"), (e[(e.Success = 1)] = "Success");
      })(C || (C = {}));
      class f {
        constructor(e) {
          (this._referencesCount = {}),
            (this._sessionId = ""),
            (this._minResolution = null),
            (this._operations = e);
        }
        destroy() {
          Object(i.assert)(this.isEmpty(), "Destroying with non-empty state"),
            delete this._operations;
        }
        isEmpty() {
          for (const e in this._referencesCount)
            if (0 !== Object.keys(this._referencesCount[e]).length) return !1;
          return !0;
        }
        setSessionId(e) {
          Object(i.assert)(
            this.isEmpty(),
            "Cannot change sessionId while there are subscribers"
          ),
            (this._sessionId = e);
        }
        setMinAvailableResolution(e) {
          this._minResolution = e;
        }
        minAvailableResolution() {
          return this._minResolution;
        }
        createSubscriber() {
          return new S(
            this,
            this._sessionId,
            this._onSubscriberDestroyed.bind(this)
          );
        }
        subscribe(e, t, s) {
          if (
            ((this._referencesCount[e] = this._referencesCount[e] || {}),
            this._referencesCount[e][t])
          )
            return (
              (this._referencesCount[e][t] += 1),
              this._logNormal(
                `Symbol/resolution is in replay session already (${e}, ${t}) = ${this._referencesCount[e][t]}`
              ),
              void s(C.Success)
            );
          (this._referencesCount[e][t] = 1),
            this._operations.addSeries(
              e,
              t,
              this._callbackWrapper.bind(this, s)
            ),
            this._logNormal(
              `Adding new symbol/resolution to replay session (${e}, ${t})`
            );
        }
        unsubscribe(e, t, s) {
          if (
            (Object(i.assert)(
              Boolean(this._referencesCount[e]),
              "No data for symbolId in cache"
            ),
            Object(i.assert)(
              this._referencesCount[e][t] > 0,
              "No data for resolution in cache"
            ),
            (this._referencesCount[e][t] -= 1),
            0 !== this._referencesCount[e][t])
          )
            return (
              this._logNormal(
                `There is symbol/resolution in replay session yet (${e}, ${t}) = ${this._referencesCount[e][t]}`
              ),
              void s(C.Success)
            );
          delete this._referencesCount[e][t],
            this._operations.removeSeries(
              e,
              t,
              this._callbackWrapper.bind(this, s)
            ),
            this._logNormal(
              `Removing symbol/resolution from replay session (${e}, ${t})`
            );
        }
        _onSubscriberDestroyed() {
          this._operations.onSeriesSwitchedToRealtime();
        }
        _callbackWrapper(e, t) {
          t.method === _.ResponseMethods.ok
            ? (this._logNormal(
                "Symbol/resolution is added/removed successfully"
              ),
              e(C.Success))
            : (this._handleError(t), e(C.Fail));
        }
        _handleError(e) {
          switch (p.Helpers.extractErrorReason(e)) {
            case _.ErrorReasons.alreadyInSession:
              this._logError(
                "Something went wrong - sym/res is in session already"
              );
              break;
            case _.ErrorReasons.thereIsNoSuchSeries:
              this._logError(
                "Something went wrong - there is no such sym/res in session"
              );
              break;
            default:
              this._logError("Unknown error: " + JSON.stringify(e));
          }
        }
        _logNormal(e) {
          R.logNormal(`[${this._sessionId}] ${e}`);
        }
        _logError(e) {
          R.logError(`[${this._sessionId}] ${e}`);
        }
      }
      class S {
        constructor(e, t, s) {
          (this._symbolId = null),
            (this._resolution = null),
            (this._sessionId = t),
            (this._manager = e),
            (this._onDestroyed = s);
        }
        destroy() {
          this.modifySeries(null, null),
            this._onDestroyed(),
            delete this._manager,
            delete this._onDestroyed;
        }
        modifySeries(e, t) {
          if (e === this._symbolId && this._resolution === t) return;
          if (
            (m.logNormal(
              `Modifying series. Old: ${this._symbolId}, ${this._resolution}. New: ${e}, ${t}`
            ),
            null !== this._symbolId &&
              null !== this._resolution &&
              this._manager.unsubscribe(
                this._symbolId,
                this._resolution,
                this._handler.bind(this)
              ),
            (this._symbolId = e),
            (this._resolution = t),
            null === this._symbolId || null === this._resolution)
          )
            return;
          const s = this._manager.minAvailableResolution();
          Object(i.assert)(
            null === s || this.canChangeResolution(this._resolution),
            `Replay resolution must be >= than minimal (new=${this._resolution}, min=${s})`
          ),
            this._manager.subscribe(
              this._symbolId,
              this._resolution,
              this._handler.bind(this)
            );
        }
        generateReplaySymbol(e) {
          return { replay: this._sessionId, symbol: e };
        }
        canChangeResolution(e) {
          if (v.Interval.isRange(e)) return !1;
          const t = this._manager.minAvailableResolution();
          if (null === t) return !1;
          const s = v.Interval.parse(e).inMilliseconds();
          return !Number.isNaN(s) && s >= v.Interval.parse(t).inMilliseconds();
        }
        _handler(e) {
          e !== C.Success && m.logWarn("Modifying series finished with error");
        }
      }
      var w = s("Vdly");
      const M = Object(y.getLogger)("ChartApi.Replay.ReplayManager");
      class A {
        constructor(e, t) {
          (this._models = []),
            (this._isReplayStarted = new d.a(!1)),
            (this._isAutoplayEnabled = new d.a(!1)),
            (this._autoplayDelay = new d.a(1e3)),
            (this._replayResolutions = new d.a(null)),
            (this._replayPoint = -1),
            (this._pendingReplayResolution = null),
            (this._isReplayStopping = !1),
            (this._pointTooDeepDelegate = new o.a()),
            (this._blockRestartSession = !1),
            (this._errorHandlers = {
              1: this._handleAutoplayError.bind(this),
              2: this._handleAutoplayError.bind(this),
              0: this._handleResetError.bind(this),
              4: this._handleDecreaseResolutionError.bind(this),
              5: this._handleAddRemoveSeriesError.bind(this),
              6: this._handleAddRemoveSeriesError.bind(this),
            }),
            (this._replaySession = new b(e)),
            (this._isReplayResolutionAvailableForUser = t),
            (this._subscriberManager = new f({
              addSeries: this._addSeriesToReplay.bind(this),
              removeSeries: this._removeSeriesFromReplay.bind(this),
              onSeriesSwitchedToRealtime: this.stopReplay.bind(this),
            }));
          const s = w.getInt("replay.manager.autoplayDelay", 1e3);
          try {
            this.changeAutoplayDelay(s);
          } catch (e) {
            M.logWarn(
              `Error during restore delay from settings: saved=${s}, ex=${e.message}`
            );
          }
          this._replaySession
            .isConnected()
            .subscribe(this._onSessionConnectionStatusChanged.bind(this)),
            this._replaySession
              .onReplayPointChanged()
              .subscribe(this, this._onReplayPointChanged),
            this._replaySession
              .onReplayResolutionsChanged()
              .subscribe(this, this._onReplayResolutionsChanged),
            this._replaySession
              .onEndOfDataReached()
              .subscribe(this, this._onEndOfDataReached),
            this._replaySession
              .onSessionIdChanged()
              .subscribe(this, this._onSessionIdChanged),
            this._replaySession.connect();
        }
        destroy() {
          this._isReplayStarted.value() &&
            Object(i.assert)(
              this._stopReplay(!0),
              "Something went wrong - cannot stop replay"
            ),
            this._pointTooDeepDelegate.destroy(),
            this._isReplayStarted.unsubscribe(),
            this._isAutoplayEnabled.unsubscribe(),
            this._autoplayDelay.unsubscribe(),
            this._replayResolutions.unsubscribe(),
            this._subscriberManager.destroy();
          for (let e = this._models.length - 1; e >= 0; --e)
            this.removeModel(this._models[e]);
          this._logNormal(
            "Replay manager has been destroyed. Destroying session..."
          ),
            this._replaySession.onReplayPointChanged().unsubscribeAll(this),
            this._replaySession
              .onReplayResolutionsChanged()
              .unsubscribeAll(this),
            this._replaySession.onEndOfDataReached().unsubscribeAll(this),
            this._replaySession.onSessionIdChanged().unsubscribeAll(this),
            this._replaySession.destroy();
        }
        addModel(e) {
          Object(i.assert)(
            !this._isReplayStarted.value(),
            "Replay is not stopped"
          ),
            Object(i.assert)(
              !this._models.some((t) => t === e),
              "Model already is in this replay"
            ),
            Object(i.assert)(!e.isInReplay(), "Series is in replay already"),
            this._models.push(e),
            this._logDebug("New model added to replay");
        }
        removeModel(e) {
          const t = this._models.indexOf(e);
          Object(i.assert)(-1 !== t, "There is no such model"),
            this._isReplayStarted.value() &&
              Object(i.assert)(
                this._models.length > 1,
                "Cannot remove last model while is in replay"
              );
          const s = this._models[t];
          this._models.splice(t, 1),
            s.isInReplay() && s.switchToRealtime(),
            this._logDebug("Model was removed from replay");
        }
        isReplayStarted() {
          return this._isReplayStarted;
        }
        startReplay() {
          Object(i.assert)(
            this._replaySession.isConnected().value(),
            "Session must be connected"
          ),
            Object(i.assert)(
              !this._isReplayStarted.value(),
              "Replay is not stopped"
            ),
            Object(i.assert)(
              this._models.length > 0,
              "There is no models to replay"
            ),
            Object(i.assert)(
              this._subscriberManager.isEmpty(),
              "Non-empty state before start"
            );
          for (const e of this._models)
            e.switchToReplay(
              this._subscriberManager.createSubscriber(),
              this._isReplayResolutionAvailableForUser
            );
          this._isReplayStarted.setValue(!0),
            this._logNormal(
              `Replay has been started with ${this._models.length} model(s)`
            );
        }
        stopReplay() {
          const e = !this._blockRestartSession;
          this._stopReplay(e) &&
            e &&
            (this._logNormal(
              "Restore session connection after stopping replay"
            ),
            this._replaySession.connect());
        }
        resetReplay(e) {
          Object(i.assert)(
            this._isReplayStarted.value(),
            "Replay is not started"
          ),
            this._isAutoplayEnabled.value() && this.stopAutoplay(),
            this._replaySession.resetReplay(
              e,
              this._handleMessage.bind(this, 0)
            ),
            this._setReplayResolutions(null),
            this._logNormal("Reset replay point to " + e);
        }
        isAutoplayStarted() {
          return this._isAutoplayEnabled;
        }
        startAutoplay() {
          Object(i.assert)(
            this._isReplayStarted.value(),
            "Replay is not started"
          ),
            Object(i.assert)(
              !this._isAutoplayEnabled.value(),
              "Cannot start autoplay multiple times"
            );
          const e = this._autoplayDelay.value();
          Object(i.assert)(-1 !== e, "Autoplay delay is not set"),
            this._replaySession.startAutoplay(
              e,
              this._handleMessage.bind(this, 1)
            ),
            this._logNormal(`Start autoplay with delay ${e}ms`),
            this._isAutoplayEnabled.setValue(!0);
        }
        stopAutoplay() {
          Object(i.assert)(
            this._isReplayStarted.value(),
            "Replay is not started"
          ),
            Object(i.assert)(
              this._isAutoplayEnabled.value(),
              "Cannot stop not auto-played replay"
            ),
            this._replaySession.stopAutoplay(this._handleMessage.bind(this, 2)),
            this._logNormal("Stop autoplay"),
            this._isAutoplayEnabled.setValue(!1);
        }
        autoplayDelay() {
          return this._autoplayDelay;
        }
        changeAutoplayDelay(e) {
          Object(i.assert)(e >= 100, "Autoplay delay is too small"),
            this._autoplayDelay.value() !== e &&
              (this._logNormal(
                `Change autoplay delay from ${this._autoplayDelay.value()} to ${e}`
              ),
              this._autoplayDelay.setValue(e),
              w.setValue("replay.manager.autoplayDelay", e),
              this._isAutoplayEnabled.value() &&
                (this.stopAutoplay(), this.startAutoplay()));
        }
        doReplayStep(e = 1) {
          Object(i.assert)(e > 0, "Length is not positive"),
            Object(i.assert)(
              this._isReplayStarted.value(),
              "Replay is not started"
            ),
            Object(i.assert)(
              0 !== this._models.length,
              "Not enough series to do replay step"
            ),
            this._replaySession.doStep(e, this._handleMessage.bind(this, 3)),
            this._logNormal("Do replay step with length = " + e);
        }
        replayResolutions() {
          return this._replayResolutions;
        }
        onPointTooDeep() {
          return this._pointTooDeepDelegate;
        }
        isReplayConnected() {
          return this._replaySession.isConnected();
        }
        _stopReplay(e) {
          if (this._isReplayStopping) return !1;
          (this._isReplayStopping = !0),
            Object(i.assert)(
              this._isReplayStarted.value(),
              "Replay is not started"
            ),
            this._isAutoplayEnabled.value() &&
              (this._logNormal(
                "Stopping replay during autoplay - stop autoplay first"
              ),
              this.stopAutoplay());
          for (const e of this._models) e.switchToRealtime();
          return (
            this._isReplayStarted.setValue(!1),
            this._setReplayResolutions(null),
            (this._replayPoint = -1),
            (this._isReplayStopping = !1),
            this._logNormal(
              "Replay has been stopped. Disconnecting session if needed=" + e
            ),
            e && this._replaySession.disconnect(),
            !0
          );
        }
        _addSeriesToReplay(e, t, s) {
            console.log("Burası hata kısmı(e):");
            console.log(e);
            console.log("Burası hata kısmı(t):");
            console.log(t);
            console.log("Burası hata kısmı(s):");
            console.log(s);
          this._isAutoplayEnabled.value() && this.stopAutoplay(),
            this._replaySession.addSeries(e, t, (e) => {
              this._handleMessage(5, e), s(e);
            }),
            this._setReplayResolutions(null);
        }
        _removeSeriesFromReplay(e, t, s) {
          this._isAutoplayEnabled.value() && this.stopAutoplay(),
            this._replaySession.removeSeries(e, t, (e) => {
              this._handleMessage(6, e), s(e);
            }),
            this._setReplayResolutions(null);
        }
        _onEndOfDataReached() {
          this._logNormal(
            "End of data reached. Last replay point: " + this._replayPoint
          ),
            this._isAutoplayEnabled.value() && this.stopAutoplay(),
            this.stopReplay();
        }
        _onSessionIdChanged(e) {
          this._subscriberManager.setSessionId(e);
        }
        _onReplayResolutionsChanged(e, t, s = e) {
          const i = this._replayResolutions.value(),
            a = { base: e, min: t, current: s };
          this._logNormal(
            `Replay resolutions changed from ${JSON.stringify(
              i
            )} to ${JSON.stringify(a)}`
          ),
            this._setReplayResolutions(a);
        }
        _setReplayResolutions(e) {
          this._replayResolutions.setValue(e),
            this._subscriberManager.setMinAvailableResolution(
              null === e ? null : e.min
            );
        }
        _onReplayPointChanged(e) {
          this._replayPoint = e;
        }
        _onSessionConnectionStatusChanged(e) {
          if (e)
            -1 !== this._replayPoint
              ? (this._logNormal(
                  "Restoring replay to point=" + this._replayPoint
                ),
                setTimeout(() => {
                  this.startReplay(), this.resetReplay(this._replayPoint);
                }))
              : this._logNormal(
                  "Restoring replay skipped because of invalid replay point"
                );
          else if (this._isReplayStarted.value()) {
            this._logNormal(
              "Session disconnected. Stopping replay. Replay point=" +
                this._replayPoint
            );
            const e = this._replayPoint;
            (this._blockRestartSession = !0),
              this.stopReplay(),
              (this._blockRestartSession = !1),
              (this._replayPoint = e);
          }
        }
        _handleMessage(e, t) {
          switch (t.method) {
            case _.ResponseMethods.ok:
              if (
                (this._logNormal("Replay OK received for command: " + e),
                4 === e)
              ) {
                const e = Object(i.ensureNotNull)(
                  this._replayResolutions.value()
                );
                this._onReplayResolutionsChanged(
                  e.base,
                  e.min,
                  Object(i.ensureNotNull)(this._pendingReplayResolution)
                ),
                  (this._pendingReplayResolution = null);
              }
              break;
            case _.ResponseMethods.error:
              this._handleError(e, t);
              break;
            default:
              this._logError(
                "Something went wrong - unknown response: " + JSON.stringify(t)
              );
          }
        }
        _handleError(e, t) {
          const s = p.Helpers.extractErrorReason(t),
            i = this._errorHandlers[e];
          i
            ? i(s, t)
            : this._logError(
                `Replay error (cmd: ${e}): ${s} (internal state: auto=${this._isAutoplayEnabled.value()}, started=${this._isReplayStarted.value()}, point=${
                  this._replayPoint
                })`
              );
        }
        _handleAutoplayError(e, t) {
          const s = t.params[2];
          switch (e) {
            case _.ErrorReasons.tooSmallDelay:
              this._logError("Delay for autoplay is too small " + s),
                this._isAutoplayEnabled.setValue(!1);
              break;
            case _.ErrorReasons.alreadyInAutoplay:
              this._logError("Cannot start autoplay - already in autoplay");
              break;
            case _.ErrorReasons.nothingToStop:
              this._logError("Cannot stop autoplay - nothing to stop");
              break;
            default:
              this._logError(`Unknown reason for autoplay error: ${e}, ${s}`);
          }
        }
        _handleResetError(e, t) {
          if (e === _.ErrorReasons.pointTooDeep)
            return (
              this._logNormal("Point is too deep to reset replay"),
              this._pointTooDeepDelegate.fire(),
              void this.stopReplay()
            );
          this._logError(
            `Unknown error reason for reset: ${e}, ${t.params[2]}`
          );
        }
        _handleAddRemoveSeriesError(e, t) {
          switch (e) {
            case _.ErrorReasons.notAllowedInAutoplay:
              this._logError(
                "Something went wrong - autoplay is not stopped while add/remove series"
              );
              break;
            default:
              this._logError(
                `Unknown error reason for add/remove series: ${e}, ${t.params[2]}`
              );
          }
        }
        _handleDecreaseResolutionError(e, t) {
          if (e === _.ErrorReasons.invalidResolution)
            return (
              this._logError(
                `Something went wrong - invalid resolution error (${this._pendingReplayResolution})`
              ),
              void (this._pendingReplayResolution = null)
            );
          this._logError(
            `Unknown error reason for decrease resolution: ${e}, ${t.params[2]}`
          );
        }
        _logNormal(e, t = !1) {
          M.logNormal(this._generateLogMessage(e));
        }
        _logDebug(e) {
          M.logDebug(this._generateLogMessage(e));
        }
        _logError(e) {
          M.logError(this._generateLogMessage(e));
        }
        _generateLogMessage(e) {
          return `[${this._replaySession.sessionId()}] ${e}`;
        }
      }
      var E = s("YFKU"),
        D = s("my99"),
        I = s("+6II"),
        O = s("JWMC"),
        T = s("a7HC"),
        P = s("/DW5"),
        j = (s("oBAC"), s("exIe")),
        W = s("z6nT"),
        k = s("fxQz"),
        N = s("lMgI"),
        x = s("z7BT"),
        B = s("A1GO"),
        L = s("MQEA"),
        $ = s("+xKI");
      function H(e, t, s, i) {
        const a = document.createElement("div");
        return (
          (a.innerHTML = e),
          (a.className = "apply-common-tooltip tv-replay-toolbar__button"),
          a.setAttribute("data-tooltip-hotkey", s),
          a.setAttribute("title", t),
          a.addEventListener("click", i),
          a
        );
      }
      const q = {
          jump: window.t("Jump To..."),
          forward: window.t("Forward"),
          toRealtime: window.t("To Real-time"),
          close: window.t("Exit Chart Replay Mode"),
          play: window.t("Play"),
          pause: window.t("Pause"),
        },
        F = {
          addClass: "tv-replay-toolbar",
          defaultPosition: { left: 50, top: 100 },
          layout: "horizontal",
          positionSettingsKey: "gui.replay.toolbar.position",
          positionStorageType: "server",
        };
      class z {
        constructor(e) {
          (this._toolbar = new D.a(F)),
            (this._jumpButton = H(
              x,
              q.jump,
              "",
              this._onJumpClicked.bind(this)
            )),
            (this._playPauseButton = H(
              "",
              "",
              Object(P.b)({ keys: ["Shift", $], text: "{0} + {1}" }),
              this._onPlayPauseClicked.bind(this)
            )),
            (this._forwardButton = H(
              k,
              q.forward,
              Object(P.b)({ keys: ["Shift", L], text: "{0} + {1}" }),
              this._onForwardClicked.bind(this)
            )),
            (this._goToRealTimeButton = H(
              N,
              q.toRealtime,
              "",
              this._onGoToRealTimeClicked.bind(this)
            )),
            (this._closeButton = H(
              B,
              q.close,
              "",
              this._onCloseClicked.bind(this)
            )),
            (this._frequencySlider = new T.a()),
            (this._uiController = e),
            this._uiController
              .onPropertiesChanged()
              .subscribe(this, this._onControllerPropertyChanged),
            this._initControls(),
            this._onControllerPropertyChanged(),
            this._toolbar.setResponsiveResizeFunc(
              this._resizeResponsive.bind(this)
            );
        }
        destroy() {
          this._uiController.onPropertiesChanged().unsubscribeAll(this),
            this._frequencySlider.destroy(),
            this._toolbar.destroy();
        }
        _initControls() {
          this._closeButton.classList.add("tv-replay-toolbar__button--close"),
            this._jumpButton.classList.add("tv-replay-toolbar__button--jump"),
            this._toolbar.addWidget(this._jumpButton),
            this._toolbar.addWidget(this._playPauseButton),
            this._toolbar.addWidget(this._forwardButton),
            this._toolbar.addWidget(this._frequencySlider.getElement()),
            this._toolbar.addWidget(this._goToRealTimeButton),
            this._toolbar.addWidget(this._closeButton),
            this._frequencySlider.frequency().subscribe((e) => {
              this._uiController.changeAutoplayDelay(1e3 * e),
                Object(O.trackEvent)("Replay", "Change frequency", e + " sec");
            });
        }
        _onJumpClicked() {
          this._uiController.replayAvailability().isAvailable &&
            (this._uiController.toggleJumpToBarMode(),
            Object(O.trackEvent)("Replay", "Toggle jump to bar"));
        }
        _onPlayPauseClicked() {
          this._uiController.isReplayStarted() &&
            this._uiController.replayAvailability().isAvailable &&
            (this._uiController.toggleAutoplay(),
            Object(O.trackEvent)(
              "Replay",
              this._uiController.isAutoplayEnabled()
                ? "Start autoplay"
                : "Pause autoplay"
            ));
        }
        _onForwardClicked() {
            console.log("Zekikos -> onForwardClicked çağırıldı!");
            
          this._uiController.isReplayStarted() &&
            this._uiController.replayAvailability().isAvailable &&
            (this._uiController.doStep(),
            Object(O.trackEvent)("Replay", "Do step"));
        }
        _onGoToRealTimeClicked() {
          this._uiController.isReplayStarted() &&
            this._uiController.replayAvailability().isAvailable &&
            (this._uiController.goToRealtime(),
            Object(O.trackEvent)("Replay", "Go to realtime"));
        }
        _onCloseClicked() {
          this._uiController.requestCloseReplay(),
            Object(O.trackEvent)("Replay", "Close replay from toolbar");
        }
        _onControllerPropertyChanged() {
          if (!this._uiController.isReplayModeEnabled().value())
            return void this._hideToolbarWithTooltip();
          this._uiController.replayAvailability().isAvailable
            ? (this._updateControls(),
              this._toolbar.isVisible() || this._toolbar.show())
            : this._hideToolbarWithTooltip();
        }
        _hideToolbarWithTooltip() {
          this._toolbar.isVisible() && (this._toolbar.hide(), Object(I.hide)());
        }
        _updateControls() {
          const e =
            this._uiController.replayAvailability().isAvailable &&
            this._uiController.isReplayStarted();
          this._playPauseButton.classList.toggle("i-disabled", !e),
            this._forwardButton.classList.toggle("i-disabled", !e),
            this._goToRealTimeButton.classList.toggle("i-disabled", !e),
            this._updateAutoplayState(),
            this._updateJumpButtonState(),
            this._frequencySlider.setFrequency(
              this._uiController.autoplayDelay() / 1e3
            );
        }
        _updateJumpButtonState() {
          const e = this._uiController.replayAvailability().isAvailable,
            t = e && this._uiController.isJumpToBarModeEnabled();
          this._jumpButton.classList.toggle("i-disabled", !e),
            this._jumpButton.classList.toggle("i-active", t);
        }
        _updateAutoplayState() {
          this._uiController.isAutoplayEnabled()
            ? (this._playPauseButton.setAttribute("title", q.pause),
              (this._playPauseButton.innerHTML = W))
            : (this._playPauseButton.setAttribute("title", q.play),
              (this._playPauseButton.innerHTML = j));
        }
        _resizeResponsive(e, t, s) {
          if ("vertical" !== s && (t > 0 || e > 320)) {
            const s =
              this._frequencySlider.width() + (t = Math.max(t, 320 - e));
            this._frequencySlider.setPreferredWidth(s);
          }
        }
      }
      var U = s("Kxc7");
      const V = E.t("Click to select the starting point.");
      function J() {
        Object(w.setValue)("hint.replayJumpToBar", !0);
      }
      var Y = s("NP3r"),
        G = s("bKsZ"),
        K = s("UXvI"),
        Z = s("ZZTB");
      const Q = Object(E.t)("Caution!");
      class X {
        constructor(e) {
          (this._activeHint = null),
            (this._chartsWhereHintDisabled = new Set()),
            (this._activeChartId = ""),
            (this._hintRendererConstructor = null),
            (this._isModuleRequested = !1),
            (this._uiController = e),
            this._uiController
              .onPropertiesChanged()
              .subscribe(this, this._showWarningIfRequired);
        }
        destroy() {
          this._destroyActiveHint(),
            this._chartsWhereHintDisabled.clear(),
            this._uiController
              .onPropertiesChanged()
              .unsubscribe(this, this._showWarningIfRequired);
        }
        _destroyActiveHint() {
          null !== this._activeHint &&
            (this._activeHint.destroy(), (this._activeHint = null)),
            (this._activeChartId = "");
        }
        _loadModule() {
          return (
            (this._isModuleRequested = !0),
            Promise.all([
              s.e("vendors"),
              s.e(14),
              s.e(76),
              s.e(293),
              s.e("chart-warning-hint"),
            ])
              .then(s.bind(null, "s95Q"))
              .then((e) => {
                this._hintRendererConstructor = e.ChartWarningHintRenderer;
              })
          );
        }
        _showWarningIfRequired() {
          if (!this._uiController.isReplayModeEnabled().value())
            return (
              this._chartsWhereHintDisabled.clear(),
              void this._destroyActiveHint()
            );
          const e = this._uiController.activeChartWidget(),
            t = e.id(),
            s = this._uiController.replayAvailability();
          if (this._chartsWhereHintDisabled.has(t) || s.isAvailable)
            this._destroyActiveHint();
          else if (
            (this._activeChartId === t
              ? this._chartsWhereHintDisabled.delete(t)
              : this._destroyActiveHint(),
            (this._activeChartId = t),
            null !== this._hintRendererConstructor)
          )
            null === this._activeHint &&
              (this._activeHint = new this._hintRendererConstructor(e)),
              this._activeHint.show({
                text: s.unavailabilityReason,
                warningHeader: Q,
                warningIcon: Z,
                solutionId: s.solutionId,
                onClose: () => {
                  this._destroyActiveHint(),
                    this._chartsWhereHintDisabled.add(t);
                },
              });
          else {
            if (this._isModuleRequested) return;
            this._loadModule().then(() => {
              this._showWarningIfRequired();
            });
          }
        }
      }
      var ee = s("z6kS");
      s.d(t, "ReplayUIController", function () {
        return oe;
      });
      const te = Object(y.getLogger)("GUI.Chart.Replay.UIController"),
        se = {
          closeConfirmText: window.t(
            "You are in chart replay mode. Do you want to exit this mode?"
          ),
          pointTooDeepMessage: window.t(
            "The specified starting point for the chart replay is too far away. Please select another one."
          ),
          notConnectedReason: window.t("Bar Replay can't be connected."),
          unsupportedChartType: window.t(
            "Bar Replay isn't available for this chart type."
          ),
          unsupportedSymbol: window.t(
            "Bar Replay isn't available for the current symbol."
          ),
          unsupportedCurrency: window.t(
            "Bar Replay isn't available with currency conversion."
          ),
          unsupportedUnit: window.t(
            "Bar Replay isn't available with unit conversion."
          ),
        },
        ie = window.t("Data point unavailable"),
        ae = window.t(
          "We don't have historical data for this resolution this far back in time."
        );
      class oe {
        constructor(e, t) {
          (this._replayManagers = {}),
            (this._isReplayModeEnabled = new d.a(!1)),
            (this._currentChartId = ""),
            (this._propertiesChangedDelegate = new o.a()),
            (this._onLayoutChangedCallback =
              this._onChartWidgetsLayoutChanged.bind(this)),
            (this._onActiveChartChangedCallback =
              this._onActiveChartWidgetChanged.bind(this)),
            (this._chartsSelectModeSpawnValues = []),
            (this._hotkeys = null),
            (this._warningHint = null),
            (this._chartWidgetCollection = e),
            (this._chartApiInstance = t),
            this._init(),
            (this._toolbar = new z(this)),
            this._bindShortcuts(),
            U.enabled("popup_hints") && (this._warningHint = new X(this)),
            (this._showReplayExitedDueUnsupportedIntervalNotification = Object(
              K.default
            )(
              () =>
                (async function (e) {
                  const t = await e;
                  null !== t && t.showSimpleToast({ title: ie, text: ae });
                })(e.getToasts()),
              500,
              { trailing: !1, leading: !0 }
            ));
        }
        destroy() {
          te.logNormal("Destroy"),
            this._unbindShortcuts(),
            null !== this._warningHint && this._warningHint.destroy(),
            this._toolbar.destroy(),
            this._chartWidgetCollection.layout.unsubscribe(
              this._onLayoutChangedCallback
            ),
            this._chartWidgetCollection.activeChartWidget.unsubscribe(
              this._onActiveChartChangedCallback
            ),
            this._setReplayModeEnabled(!1);
        }
        isReplayModeEnabled() {
          return this._isReplayModeEnabled;
        }
        enableReplayMode() {
          window.runOrSignIn(() => this._setReplayModeEnabled(!0), {
            source: "enable replay mode",
          });
        }
        toggleJumpToBarMode() {
          te.logNormal(
            'Request to toggle "jump to bar" mode for current chart widget'
          ),
            this._currentChartWidget().selectPointMode().value()
              ? this._currentChartWidget().cancelRequestSelectPoint()
              : this._currentChartWidget()
                  .requestSelectPoint("time")
                  .then((e) => {
                    this._onPointSelected(
                      this._currentChartWidget(),
                      Object(i.ensureDefined)(e.point.time)
                    );
                  })
                  .catch(() => {}),
            this.isJumpToBarModeEnabled() &&
              (async function (e, t) {
                if (
                  Object(w.getBool)("hint.replayJumpToBar") ||
                  !U.enabled("popup_hints")
                )
                  return;
                let i = null;
                const a = t.spawn();
                try {
                  const t = new Promise((e) => {
                      a.subscribe(
                        (t) => {
                          t || e();
                        },
                        { callWithLast: !0 }
                      );
                    }),
                    o = await Promise.race([
                      t,
                      Promise.all([
                        s.e("vendors"),
                        s.e(3),
                        s.e(421),
                        s.e("chart-event-hint"),
                      ]).then(s.bind(null, "PN5r")),
                    ]);
                  if (!o) return;
                  i = new o.ChartEventHintRenderer(e);
                  const r = new Promise((e) => {
                    i.show(V, e);
                  });
                  (await Promise.race([t.then(() => !1), r.then(() => !0)])) &&
                    J();
                } finally {
                  i && i.destroy(), a.destroy();
                }
              })(
                this._chartWidgetCollection.getContainer(),
                this._currentChartWidget().selectPointMode()
              );
        }
        toggleAutoplay() {
          const e = this._currentReplayManager();
          e.isAutoplayStarted().value() ? e.stopAutoplay() : e.startAutoplay();
        }
        doStep() {
          this._currentReplayManager().doReplayStep();
        }
        goToRealtime() {
          this._currentReplayManager().stopReplay(), this.toggleJumpToBarMode();
        }
        changeAutoplayDelay(e) {
          this._currentReplayManager().changeAutoplayDelay(e);
        }
        requestCloseReplay() {
          te.logNormal("Request close replay. Checking managers...");
          for (const e of Object.keys(this._replayManagers))
            if (
              Object(i.ensureDefined)(this._replayManagers[e])
                .isReplayStarted()
                .value()
            )
              return (
                te.logNormal(
                  `There is at least one active replay manager (widget: ${e}) - ask user`
                ),
                void Object(n.showConfirm)({
                  text: se.closeConfirmText,
                  onConfirm: ({ dialogClose: e }) => {
                    e(), this._setReplayModeEnabled(!1);
                  },
                })
              );
          te.logNormal("All managers has disabled replay - just close it"),
            this._setReplayModeEnabled(!1);
        }
        onPropertiesChanged() {
          return this._propertiesChangedDelegate;
        }
        replayAvailability() {
          return this._replayAvailabilityForManager(
            this._currentReplayManager()
          );
        }
        isJumpToBarModeEnabled() {
          return this._currentChartWidget().selectPointMode().value();
        }
        isReplayStarted() {
          return this._currentReplayManager().isReplayStarted().value();
        }
        autoplayDelay() {
          return this._currentReplayManager().autoplayDelay().value();
        }
        isAutoplayEnabled() {
          return this._currentReplayManager().isAutoplayStarted().value();
        }
        activeChartWidget() {
          return this._getChartWidgetForManager(this._currentReplayManager());
        }
        _bindShortcuts() {
          this._hotkeys ||
            ((this._hotkeys = u.createGroup({ desc: "Replay" })),
            this._hotkeys.add({
              desc: "Replay play/pause",
              hotkey: u.Modifiers.Shift + 40,
              handler: () => this.toggleAutoplay(),
              isDisabled: () => this._isReplayActionDisabled(),
            }),
            this._hotkeys.add({
              desc: "Replay step forward",
              hotkey: u.Modifiers.Shift + 39,
              handler: () => this.doStep(),
              isDisabled: () => this._isReplayActionDisabled(),
            }));
        }
        _unbindShortcuts() {
          this._hotkeys && (this._hotkeys.destroy(), (this._hotkeys = null));
        }
        _isReplayActionDisabled() {
          return (
            void 0 === this._replayManagers[this._currentChartId] ||
            !this.isReplayStarted()
          );
        }
        _setReplayModeEnabled(e) {
          this._isReplayModeEnabled.value() !== e &&
            (te.logNormal(
              `Change replay state from ${this._isReplayModeEnabled.value()} to ${e}`
            ),
            e
              ? (this._updateManagers(),
                !this.isJumpToBarModeEnabled() &&
                  this.replayAvailability().isAvailable &&
                  this.toggleJumpToBarMode())
              : this._forceStopReplay(),
            this._isReplayModeEnabled.setValue(e),
            this._notifyAboutPropertiesChanged());
        }
        _init() {
          this._chartWidgetCollection.layout.subscribe(
            this._onLayoutChangedCallback,
            { callWithLast: !0 }
          ),
            this._chartWidgetCollection.activeChartWidget.subscribe(
              this._onActiveChartChangedCallback,
              { callWithLast: !0 }
            );
        }
        _currentChartWidget() {
          const e = this._chartWidgetCollection.activeChartWidget.value();
          return (
            Object(i.assert)(
              e.id() === this._currentChartId,
              "Mistiming chart widget and internal state"
            ),
            e
          );
        }
        _currentReplayManager() {
          return (
            Object(i.assert)(
              this._currentChartId.length > 0,
              "There is no current chart"
            ),
            Object(i.ensureDefined)(this._replayManagers[this._currentChartId])
          );
        }
        _forceStopReplay() {
          te.logNormal("Force stop replay");
          for (const e of Object.keys(this._replayManagers))
            e !== this._currentChartId && this._removeManagerForWidget(e);
          this._removeManagerForWidget(this._currentChartId);
          for (const e of this._chartsSelectModeSpawnValues) e.destroy();
          this._chartsSelectModeSpawnValues = [];
          for (const e of this._chartWidgetCollection.getAll()) {
            const t = e.model().mainSeries();
            t.onIntervalChanged().unsubscribeAll(this),
              t
                .replayExitedDueUnavailableForUserInterval()
                .unsubscribe(null, ne),
              t
                .replayExitedDueUnsupportedInterval()
                .unsubscribe(
                  null,
                  this._showReplayExitedDueUnsupportedIntervalNotification
                ),
              t.onStyleChanged().unsubscribeAll(this),
              t.dataEvents().symbolResolved().unsubscribeAll(this),
              e.selectPointMode().value() && e.cancelRequestSelectPoint();
          }
        }
        _onChartWidgetsLayoutChanged() {
          this._isReplayModeEnabled.value() && this._updateManagers();
        }
        _onActiveChartWidgetChanged(e) {
          const t = e.id();
          te.logNormal(
            `Active chart widget changed from "${this._currentChartId}" to "${t}"`
          ),
            (this._currentChartId = t),
            this._notifyAboutPropertiesChanged();
        }
        _updateManagers() {
          te.logNormal("Updating managers set for all charts");
          const e = [];
          for (const t of this._chartWidgetCollection.getAll()) {
            const s = t.id();
            if (this._replayManagers[s]) {
              e.push(s);
              continue;
            }
            const i = new A(this._chartApiInstance, re);
            t.withModel(null, () => {
              const e = t.model();
              i.addModel(e);
              const s = t.selectPointMode().spawn();
              this._chartsSelectModeSpawnValues.push(s);
              const a = this._onChartWidgetPropertyChanged.bind(this, t);
              s.subscribe(a);
              const o = e.mainSeries();
              o.onIntervalChanged().subscribe(this, a),
                o
                  .replayExitedDueUnavailableForUserInterval()
                  .subscribe(null, ne),
                o
                  .replayExitedDueUnsupportedInterval()
                  .subscribe(
                    null,
                    this._showReplayExitedDueUnsupportedIntervalNotification
                  ),
                o
                  .onStyleChanged()
                  .subscribe(
                    this,
                    this._updateReplayAvailabilityState.bind(this, i)
                  ),
                o
                  .dataEvents()
                  .symbolResolved()
                  .subscribe(
                    this,
                    this._updateReplayAvailabilityState.bind(this, i)
                  );
            }),
              this._subscribeToManager(i),
              (this._replayManagers[s] = i),
              e.push(s);
          }
          for (const t of Object.keys(this._replayManagers))
            -1 === e.indexOf(t) && this._removeManagerForWidget(t);
        }
        _onPointSelected(e, t) {
          const s = () => {
            te.logNormal(
              `Bar on chart ${e.id()} was selected with time ${t}. Resetting replay...`
            );
            const s = Object(i.ensureDefined)(this._replayManagers[e.id()]);
            s.isReplayStarted().value() || s.startReplay();
            const a = e.model().model().timeScale().rightOffsetForTimePoint(t);
            this._requestScrollToRealtimeFromOffset(
              e,
              Object(i.ensureNotNull)(a)
            ),
              s.resetReplay(t - 1);
          };
          re(e.model().mainSeries().interval()) ? (s(), J()) : ne();
        }
        _requestScrollToRealtimeFromOffset(e, t) {
          const s = e.model().model(),
            i = s.timeScale(),
            a = s.mainSeries();
          e.screen.show(),
            i.setRightOffset(t),
            a.dataEvents().completed().unsubscribeAll(this),
            a
              .dataEvents()
              .completed()
              .subscribe(
                this,
                () => {
                  i.scrollToRealtime(!0);
                },
                !0
              );
        }
        _onChartWidgetPropertyChanged(e) {
          this._currentChartWidget() === e &&
            this._notifyAboutPropertiesChanged();
        }
        _onManagerPropertyChanged(e) {
          this._currentReplayManager() === e &&
            this._notifyAboutPropertiesChanged();
        }
        _replayAvailabilityForManager(e) {
          const t = e.isReplayConnected().value(),
            s = this._getChartWidgetForManager(e).model().mainSeries(),
            i = s.isStyleSupportedForReplay(s.style()),
            a = s.symbolInfo(),
            o = ee.a.BAR_REPLAY_UNAVAILABILITY;
          let r = { isAvailable: !0, unavailabilityReason: "" };
          return (
            t
              ? i
                ? a &&
                  void 0 !== a.original_currency_id &&
                  a.original_currency_id !== a.currency_id
                  ? (r = {
                      isAvailable: !1,
                      unavailabilityReason: se.unsupportedCurrency,
                      solutionId: o,
                    })
                  : a &&
                    void 0 !== a.original_unit_id &&
                    a.original_unit_id !== a.unit_id
                  ? (r = {
                      isAvailable: !1,
                      unavailabilityReason: se.unsupportedUnit,
                      solutionId: o,
                    })
                  : e.isReplayStarted().value() ||
                    !a ||
                    a.is_replayable ||
                    (r = {
                      isAvailable: !1,
                      unavailabilityReason: se.unsupportedSymbol,
                      solutionId: o,
                    })
                : (r = {
                    isAvailable: !1,
                    unavailabilityReason: se.unsupportedChartType,
                    solutionId: o,
                  })
              : (r = {
                  isAvailable: !1,
                  unavailabilityReason: se.notConnectedReason,
                }),
            r
          );
        }
        _updateReplayAvailabilityState(e) {
          this._disableSelectBarIfUnavailable(e),
            this._onManagerPropertyChanged(e);
        }
        _disableSelectBarIfUnavailable(e) {
          if (this._replayAvailabilityForManager(e).isAvailable) return;
          const t = this._getChartWidgetForManager(e);
          t.selectPointMode().value() &&
            (te.logNormal(
              `Disabling jump to bar mode due replay unavailability for chart "${t.id()}"`
            ),
            t.cancelRequestSelectPoint());
        }
        _getChartWidgetForManager(e) {
          return Object(i.ensureDefined)(
            this._chartWidgetCollection
              .getAll()
              .find((t) => this._replayManagers[t.id()] === e)
          );
        }
        _subscribeToManager(e) {
          const t = this._onManagerPropertyChanged.bind(this, e);
          e.isReplayStarted().subscribe(t),
            e.isAutoplayStarted().subscribe(t),
            e.autoplayDelay().subscribe(t),
            e
              .isReplayConnected()
              .subscribe(this._updateReplayAvailabilityState.bind(this, e)),
            e.onPointTooDeep().subscribe(this, this._onPointTooDeepError);
        }
        _removeManagerForWidget(e) {
          te.logNormal("Removing manager for chart widget " + e);
          const t = Object(i.ensureDefined)(this._replayManagers[e]);
          t.onPointTooDeep().unsubscribeAll(this),
            t.destroy(),
            delete this._replayManagers[e];
        }
        _notifyAboutPropertiesChanged() {
          this._propertiesChangedDelegate.fire();
        }
        _onPointTooDeepError() {
          Object(r.showNoticeDialog)({ content: se.pointTooDeepMessage });
        }
      }
      function re(e) {
        return (
          v.Interval.parse(e).isDWM() ||
          Object(Y.enabled)(G.ProductFeatures.BAR_REPLAY_INTRADAY)
        );
      }
      function ne() {
        Object(l.createGoProDialog)({ feature: "barReplayIntraday" });
      }
    },
    ZZTB: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M9 0a9 9 0 1 0 0 18A9 9 0 0 0 9 0zM7.75 5.48a1.27 1.27 0 1 1 2.5 0l-.67 4.03a.59.59 0 0 1-1.16 0l-.67-4.03zM8 13a1 1 0 1 1 2 0 1 1 0 0 1-2 0z"/></svg>';
    },
    a7HC: function (e, t, s) {
      "use strict";
      (function (e) {
        s.d(t, "a", function () {
          return p;
        });
        s("P5fv"), s("QBwY");
        var i = s("YFKU"),
          a = (s("HbRj"), s("hY0g")),
          o = s.n(a),
          r = s("+6II"),
          n = (s("u6PU"), s("cUU8"), s("txPx"));
        const l = Object(n.getLogger)("GUI.Chart.Replay.FrequencyControl"),
          h = [5, 3, 2, 1, 0.5, 0.1];
        function d(e) {
          return Object(i.t)("1 update every {number} sec").format({
            number: h[e].toString(),
          });
        }
        const u = `\n\t<div class="tv-frequency-control">\n\t\t<div class="tv-frequency-control__title js-freq-title">${Object(
          i.t
        )(
          "Speed"
        )}</div>\n\t\t<div class="tv-frequency-control__slider tv-slider js-freq-slider"></div>\n\t</div>\n`;
        class p {
          constructor() {
            (this._element = e(u)),
              (this._frequency = new o.a(h[0])),
              (this._isSliderStartMoving = !1),
              (this._slider = this._element.find(".js-freq-slider")),
              (this._title = this._element.find(".js-freq-title")),
              (this._titleWidth = 0),
              (this._widthExceptTitleAndSlider = 0),
              this._slider.slider({
                start: this._onSliderStartMoving.bind(this),
                slide: this._onSliderMoved.bind(this),
                change: this._onSliderEndMoving.bind(this),
                range: "min",
                min: 0,
                max: h.length - 1,
              }),
              this._frequency.subscribe((e) => {
                const t = h.indexOf(e);
                if (-1 === t)
                  return (
                    l.logWarn(
                      `Unknown frequency: ${e}. Force set to first available value to sync values`
                    ),
                    void setTimeout(
                      this._frequency.setValue.bind(this._frequency, h[0])
                    )
                  );
                this._slider.slider("value", t);
              }),
              this._setupTooltipOnHover();
          }
          destroy() {
            this._frequency.unsubscribe(),
              this._slider.slider("destroy"),
              this._element.remove();
          }
          getElement() {
            return this._element.get(0);
          }
          width() {
            return this._element.width();
          }
          setFrequency(e) {
            this._frequency.setValue(e);
          }
          frequency() {
            return this._frequency;
          }
          setPreferredWidth(e) {
            0 === this._titleWidth &&
              ((this._titleWidth = this._title.outerWidth(!0)),
              (this._widthExceptTitleAndSlider =
                this.width() - this._sliderWidth() - this._titleWidth));
            let t = e - this._widthExceptTitleAndSlider;
            const s = t - this._titleWidth >= 100;
            s && (t -= this._titleWidth), this._setTitleVisible(s);
            let i = Math.max(30, t);
            (i = Math.min(i, 100)), this._setSliderWidth(i);
          }
          _setTitleVisible(e) {
            this._title[0].classList.toggle("js-hidden", !e);
          }
          _sliderWidth() {
            return this._slider.width();
          }
          _setSliderWidth(e) {
            this._slider.width(e);
          }
          _getFrequencyFromControl() {
            return h[this._slider.slider("value")];
          }
          _showSliderTooltip(e) {
            void 0 !== e &&
              setTimeout(this._showTooltipForSlider.bind(this, e));
          }
          _onSliderStartMoving(e, t) {
            (this._isSliderStartMoving = !0), this._showSliderTooltip(t.value);
          }
          _onSliderMoved(e, t) {
            this._showSliderTooltip(t.value);
          }
          _onSliderEndMoving() {
            (this._isSliderStartMoving = !1),
              this._frequency.setValue(this._getFrequencyFromControl()),
              Object(r.hide)();
          }
          _showTooltipForSlider(e) {
            Object(r.showOnElement)(
              this._slider.find(".ui-slider-handle").get(0),
              { tooltipDelay: 100, text: d(e) }
            );
          }
          _setupTooltipOnHover() {
            this._slider.find(".ui-slider-handle").hover(
              () => {
                this._isSliderStartMoving ||
                  this._showTooltipForSlider(this._slider.slider("value"));
              },
              () => {
                this._isSliderStartMoving || Object(r.hide)();
              }
            );
          }
        }
      }.call(this, s("P5fv")));
    },
    cUU8: function (e, t, s) {},
    cZRT: function (e, t, s) {
      "use strict";
      s.d(t, "a", function () {
        return i;
      });
      class i {
        constructor() {
          (this._retries = 5),
            (this._cache = null),
            (this._tryLoad = (e) => {
              this._retries = this._retries - 1;
              this._startLoading().then(
                e,
                0 !== this._retries
                  ? () => setTimeout(() => this._tryLoad(e), 3e3)
                  : void 0
              );
            });
        }
        load() {
          return (
            this._cache || (this._cache = new Promise(this._tryLoad)),
            this._cache
          );
        }
      }
    },
    exIe: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path fill-rule="nonzero" d="M6 14.774L12.498 9 6 3.226v11.548zM5 17V1l9.004 8L5 17z"/></svg>';
    },
    fxQz: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M8 14.774L14.5 9 8 3.226zM7 17V1l9 8zM4 1v16h1V1z"/></svg>';
    },
    lMgI: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M5 14.774L11.5 9 5 3.226zM4 17V1l9 8zm9-16v16h1V1z"/></svg>';
    },
    oBAC: function (e, t, s) {},
    z6nT: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><g fill-rule="evenodd"><path d="M5 1h1v16H5zM12 1h1v16h-1z"/></g></svg>';
    },
    z7BT: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><g fill-rule="evenodd"><path fill-rule="nonzero" d="M2 15h3V6H2v9zM1 5h5v11H1V5z"/><path d="M3 1h1v4H3z"/><path fill-rule="nonzero" d="M9 9v5h3V9H9zM8 8h5v7H8V8z"/><path d="M17 6h3v1h-3zM14 6.5L17 9V4zM10 2h1v6h-1zM3 15h1v4H3zM10 14h1v4h-1z"/></g></svg>';
    },
  },
]);
