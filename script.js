/* =========================================================
   script.js — TINH GỌN, KHÔNG CÓ MODULE, KHÔNG CÓ dynamic import()
   Mục tiêu: chạy được 100% ngay cả khi mở file trực tiếp (file://)
   Chỉ đảm bảo: Password + Letter hoạt động.
   (Gift 3D được quản lý riêng trong gift-loader.js)
   ========================================================= */

(function () {
  "use strict";

  // --- Debug banner ---
  var debugBanner = document.getElementById("debugBanner");
  function showError(msg) {
    if (!debugBanner) return;
    debugBanner.style.display = "block";
    debugBanner.style.background = "#3a0015";
    debugBanner.style.color = "#ffd6e8";
    debugBanner.textContent = "⚠ LỖI:\n" + msg;
  }
  function showOk(msg) {
    if (!debugBanner) return;
    debugBanner.style.display = "block";
    debugBanner.style.background = "#0f3a1f";
    debugBanner.style.color = "#d6ffe5";
    debugBanner.textContent = msg;
    setTimeout(function () {
      debugBanner.style.transition = "opacity .6s";
      debugBanner.style.opacity = "0";
      setTimeout(function () {
        debugBanner.style.display = "none";
      }, 700);
    }, 3000);
  }

  try {
    run();
  } catch (err) {
    console.error(err);
    showError(err && err.message ? err.message : String(err));
  }

  // =========================================================
  //   RUN (toàn bộ app logic nằm trong này)
  // =========================================================
  function run() {
    /* ---------- CONFIG ---------- */
    var CORRECT_PASSWORD = "0911";

    /* ---------- HELPERS ---------- */
    function $(id) {
      return document.getElementById(id);
    }
    function $$(sel) {
      var list = document.querySelectorAll(sel);
      var arr = [];
      for (var i = 0; i < list.length; i++) arr.push(list[i]);
      return arr;
    }
    function wait(ms) {
      return new Promise(function (res) {
        setTimeout(res, ms);
      });
    }

    /* ---------- DOM ---------- */
    var countdownScreen = $("countdownScreen");
    var countdownNumber = $("countdownNumber");
    var tickSound = $("tickSound");
    var backgroundMusic = $("backgroundMusic");
    var passwordScreen = $("passwordScreen");
    var secretScreen = $("secretScreen");
    var secretContainer = document.querySelector(".secret-container");
    var passwordDots = $$(".password-dots span");
    var keys = $$(".key[data-number]");
    var deleteButton = $("deleteButton");
    var errorMessage = $("errorMessage");
    var card = document.querySelector(".card");
    var floatingLayer = $("floatingLayer");
    var backButton = $("backButton");
    var secretItems = $$(".secret-item[data-page]");

    var letterView = $("letterView");
    var envelope = $("envelope");
    var envelopeStage = $("envelopeStage");
    var letterStage = $("letterStage");
    var letterPages = $$(".letter-page");
    var letterProgressDots = $$("#letterProgress .dot");
    var letterBackBtn = $("letterBackBtn");

    var thelastView = $("thelastView");
    var thelastBackBtn = $("thelastBackBtn");
    var thelastHint = $("thelastHint");
    var thelastStage = $("thelastStage");
    var thelastCakeWrap = $("cakeWrap");
    var thelastCake = $("cake");
    var thelastCandleFlame = $("candleFlame");
    var thelastCandleSmoke = $("candleSmoke");
    var thelastKnife = $("cakeKnife");
    var thelastCutGuide = $("cutGuide");
    var thelastCakeSlice = $("cakeSlice");
    var thelastModal = $("thelastModal");
    var thelastClose = $("thelastClose");
    var thelastFireworks = $("fireworksCanvas");
    var thelastCelebrateBackBtn = $("thelastCelebrateBackBtn");
    var thelastFinal = $("thelastFinal");

    /* ---------- STATE ---------- */
    var password = "";
    var thelastPhase = "candle"; // candle -> knife -> done
    var cutStartX = null;
    var cutStartY = null;
    var cutCurrentX = null;
    var cutCurrentY = null;
    var cutActive = false;
    var fwRaf = null;
    var fwParticles = [];
    var fwRockets = [];
    var fwCtx = null;
    var fwStopTimer = null;
    var fwAmbientTimer = null;
    var glowTextures = null;
    var textParticles = [];
    var ambientStardust = [];
    var textStartTime = 0;
    var pointerPos = { x: -9999, y: -9999, active: false };
    var floatingEnabled = false;
    var floatingTimer = null;
    var audioUnlocked = false;
    var musicStarted = false;
    var letterCurrentPage = 0;
    var LETTER_TOTAL = letterPages.length;
    var envelopeOpened = false;

    /* ---------- AUDIO ---------- */
    // Kiểm tra <audio> element có load được src không (file có tồn tại không).
    function isAudioReady(audioElem) {
      if (!audioElem) return false;
      // Nếu đã từng error hoặc src trống / lỗi net → skip
      if (audioElem.error) return false;
      if (!audioElem.src) return false;
      return true;
    }

    function unlockAudio(force) {
      if (audioUnlocked && !force) return;
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        try {
          var ctx = new AudioCtx();
          if (ctx.state === "suspended") ctx.resume()["catch"](function () {});
        } catch (e) {}
      }
      try {
        if (
          tickSound &&
          isAudioReady(tickSound) &&
          typeof tickSound.load === "function"
        ) {
          try {
            tickSound.load();
          } catch (e) {}
        }
        if (
          backgroundMusic &&
          isAudioReady(backgroundMusic) &&
          typeof backgroundMusic.load === "function"
        ) {
          try {
            backgroundMusic.load();
          } catch (e) {}
        }
        if (tickSound && isAudioReady(tickSound)) {
          var p1 = tickSound.play();
          if (p1 && typeof p1.then === "function") {
            p1.then(function () {
              try {
                tickSound.pause();
              } catch (e) {}
              tickSound.currentTime = 0;
            })["catch"](function () {});
          } else {
            try {
              if (tickSound.pause) tickSound.pause();
            } catch (e) {}
            tickSound.currentTime = 0;
          }
        }
        if (backgroundMusic && isAudioReady(backgroundMusic)) {
          var p2 = backgroundMusic.play();
          if (p2 && typeof p2.then === "function") {
            p2.then(function () {
              try {
                backgroundMusic.pause();
              } catch (e) {}
              backgroundMusic.currentTime = 0;
            })["catch"](function () {});
          } else {
            try {
              if (backgroundMusic.pause) backgroundMusic.pause();
            } catch (e) {}
            backgroundMusic.currentTime = 0;
          }
        }
      } catch (e) {}
      audioUnlocked = true;
    }

    function playTickNow() {
      if (!tickSound || !isAudioReady(tickSound)) return;
      try {
        var clone = tickSound.cloneNode(true);
        clone.volume = 0.7;
        clone.currentTime = 0;
        var p = clone.play();
        if (p && typeof p.then === "function") p["catch"](function () {});
      } catch (e) {}
    }

    function startBackgroundMusic() {
      if (musicStarted || !backgroundMusic || !isAudioReady(backgroundMusic))
        return;
      try {
        backgroundMusic.volume = 0.5;
        if (backgroundMusic.currentTime >= (backgroundMusic.duration || 0)) {
          backgroundMusic.currentTime = 0;
        }
        var p = backgroundMusic.play();
        if (p && typeof p.then === "function") {
          p.then(function () {
            musicStarted = true;
          })["catch"](function () {
            musicStarted = false;
          });
        } else {
          musicStarted = true;
        }
      } catch (e) {
        musicStarted = false;
      }
    }

    /* ---------- AUDIO AUTOPLAY ----------
       Không đăng ký listener toàn trang ở đây.
       Trên iPhone/iOS, một lần chạm bất kỳ vào màn hình có thể được
       xem là user gesture; listener cũ đã gọi play() ngay lần chạm đầu
       và khiến nhạc phát ngoài ý muốn.
       Âm thanh chỉ được kích hoạt tại các điểm tương tác/chuyển màn hình
       mà website thực sự cần phát.
       ----------------------------------------------------------- */

    /* ---------- PASSWORD ---------- */
    function updatePasswordDots() {
      for (var i = 0; i < passwordDots.length; i++) {
        passwordDots[i].classList.toggle("active", i < password.length);
      }
    }
    function addNumber(number) {
      unlockAudio();
      if (password.length >= 4) return;
      password += number;
      updatePasswordDots();
      if (password.length === 4) setTimeout(checkPassword, 200);
    }
    function deleteNumber() {
      unlockAudio();
      password = password.slice(0, -1);
      updatePasswordDots();
      if (errorMessage) errorMessage.classList.remove("show");
    }
    function checkPassword() {
      if (password === CORRECT_PASSWORD) unlock();
      else wrongPassword();
    }
    function unlock() {
      passwordScreen.style.display = "none";
      startCountdown();
    }
    function wrongPassword() {
      if (!card) return;
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("shake");
      if (errorMessage) {
        errorMessage.textContent = "Mật khẩu không đúng 💔";
        errorMessage.classList.add("show");
      }
      password = "";
      updatePasswordDots();
    }

    /* ---------- COUNTDOWN ---------- */
    async function startCountdown() {
      if (!countdownScreen || !countdownNumber) return;
      countdownScreen.classList.remove("hidden", "fade-out");
      var nums = [3, 2, 1];
      for (var idx = 0; idx < nums.length; idx++) {
        var n = nums[idx];
        countdownNumber.textContent = n;
        countdownNumber.style.animation = "none";
        void countdownNumber.offsetWidth;
        countdownNumber.style.animation = "numberPop 0.8s ease";
        playTickNow();
        await wait(1000);
      }
      countdownNumber.textContent = "♥";
      countdownNumber.style.animation = "none";
      void countdownNumber.offsetWidth;
      countdownNumber.style.animation = "numberPop 0.8s ease";
      playTickNow();
      await wait(500);
      countdownScreen.classList.add("fade-out");
      await wait(800);
      countdownScreen.classList.add("hidden");
      if (secretScreen) secretScreen.classList.remove("hidden");
      startFloating();
      startBackgroundMusic();
      if (!musicStarted && secretScreen) {
        var startOnClick = function () {
          startBackgroundMusic();
          secretScreen.removeEventListener("click", startOnClick);
        };
        secretScreen.addEventListener("click", startOnClick, { once: true });
      }
    }

    /* ---------- FLOATING ---------- */
    function isSmallScreen() {
      return window.innerWidth <= 700;
    }
    function startFloating() {
      if (!floatingLayer || floatingTimer) return;
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      floatingEnabled = true;
      floatingTimer = setInterval(createFloater, isSmallScreen() ? 2900 : 1350);
      createInitialFloaters();
    }
    function stopFloating() {
      floatingEnabled = false;
      clearInterval(floatingTimer);
      floatingTimer = null;
      if (floatingLayer) floatingLayer.replaceChildren();
    }
    function createFloater() {
      if (!floatingEnabled || !floatingLayer) return;
      var f = document.createElement("div");
      f.className = "floater";
      var objs = ["♥", "♡", "💗", "💕", "🌸", "✦", "✨"];
      f.textContent = objs[Math.floor(Math.random() * objs.length)];
      f.style.left = Math.random() * 100 + "%";
      var size = Math.random() * 20 + 15;
      f.style.fontSize = size + "px";
      var dur = Math.random() * 5 + 5;
      f.style.animationDuration = dur + "s";
      f.style.opacity = Math.random() * 0.5 + 0.4;
      floatingLayer.appendChild(f);
      setTimeout(function () {
        f.remove();
      }, dur * 1000);
    }
    function createInitialFloaters() {
      for (var i = 0; i < 8; i++) setTimeout(createFloater, i * 300);
    }

    /* ---------- LETTER ---------- */
    function openLetterView() {
      if (!letterView) return;
      if (secretContainer) secretContainer.classList.add("hidden");
      letterCurrentPage = 0;
      envelopeOpened = false;
      if (envelope) envelope.classList.remove("opened");
      if (envelopeStage) envelopeStage.classList.remove("hidden");
      if (letterStage) letterStage.classList.add("hidden");
      for (var i = 0; i < letterPages.length; i++) {
        var p = letterPages[i];
        p.classList.remove(
          "active",
          "leaving",
          "leave-forward",
          "leave-backward",
          "enter-forward",
          "enter-backward",
        );
        if (i === 0) p.classList.add("active");
      }
      for (var j = 0; j < letterProgressDots.length; j++) {
        letterProgressDots[j].classList.toggle("active", j === 0);
      }
      letterView.classList.remove("hidden");
    }

    function closeLetterView() {
      if (!letterView) return;
      if (secretContainer) secretContainer.classList.remove("hidden");
      letterView.classList.add("hidden");
      letterCurrentPage = 0;
      envelopeOpened = false;
      if (envelope) envelope.classList.remove("opened");
      if (envelopeStage) envelopeStage.classList.remove("hidden");
      if (letterStage) letterStage.classList.add("hidden");
      for (var i = 0; i < letterPages.length; i++) {
        letterPages[i].classList.remove(
          "active",
          "leave-forward",
          "leave-backward",
          "enter-forward",
          "enter-backward",
        );
      }
    }

    function showLetterPage(nextIndex, direction) {
      if (nextIndex < 0 || nextIndex >= LETTER_TOTAL) return;
      var prev = letterPages[letterCurrentPage];
      var next = letterPages[nextIndex];
      if (!prev || !next || prev === next) return;
      var goForward = direction
        ? direction === "forward"
        : nextIndex > letterCurrentPage;
      var leaveClass = goForward ? "leave-forward" : "leave-backward";
      var enterClass = goForward ? "enter-forward" : "enter-backward";
      next.classList.remove("active");
      next.classList.add(enterClass);
      void next.offsetWidth;
      prev.classList.remove("active");
      prev.classList.add(leaveClass);
      next.classList.remove(enterClass);
      next.classList.add("active");
      clearTimeout(prev._flipCleanup);
      prev._flipCleanup = setTimeout(function () {
        prev.classList.remove(leaveClass);
      }, 950);
      for (var i = 0; i < letterProgressDots.length; i++) {
        letterProgressDots[i].classList.toggle("active", i === nextIndex);
      }
      letterCurrentPage = nextIndex;
    }

    /* ---------- THE LAST (Cake) ---------- */
    function setTheLastHint(text) {
      if (!thelastHint) return;
      if (!text) {
        thelastHint.classList.add("hidden");
        thelastHint.textContent = "";
        return;
      }
      thelastHint.textContent = text;
      thelastHint.classList.remove("hidden");
    }
    function resetTheLastView() {
      thelastPhase = "candle";
      cutStartX = null;
      cutStartY = null;
      cutCurrentX = null;
      cutCurrentY = null;
      cutActive = false;
      if (thelastView) thelastView.classList.remove("celebrating");
      if (thelastCelebrateBackBtn)
        thelastCelebrateBackBtn.classList.add("hidden");
      if (thelastCandleFlame) thelastCandleFlame.classList.remove("off");
      if (thelastCandleSmoke) thelastCandleSmoke.classList.remove("on");
      if (thelastKnife) {
        thelastKnife.classList.remove("show", "cutting");
        thelastKnife.style.transform = "";
      }
      if (thelastCutGuide) thelastCutGuide.classList.add("hidden");
      if (thelastCakeWrap) {
        thelastCakeWrap.classList.remove("slice-done");
        thelastCakeWrap.style.setProperty("--cut-angle", "-20deg");
        thelastCakeWrap.style.setProperty("--cut-offset", "38%");
      }
      if (thelastCakeSlice) {
        thelastCakeSlice.style.setProperty("--slice-left", "56%");
        thelastCakeSlice.style.setProperty("--slice-top", "38%");
        thelastCakeSlice.style.setProperty("--slice-width", "40%");
        thelastCakeSlice.style.setProperty("--slice-height", "48%");
        thelastCakeSlice.style.setProperty("--slice-rot", "10deg");
        thelastCakeSlice.style.setProperty("--slice-tx", "38px");
        thelastCakeSlice.style.setProperty("--slice-ty", "22px");
      }
      if (thelastModal) thelastModal.classList.remove("show");
      stopFireworks();
      if (thelastFinal) thelastFinal.classList.remove("show");
    }
    function openTheLastView() {
      if (!thelastView) return;
      if (secretContainer) secretContainer.classList.add("hidden");
      closeLetterView();
      closeGiftView();
      resetTheLastView();
      thelastView.classList.remove("hidden");
      setTimeout(function () {
        setTheLastHint("💫 Ước gì đó đi — nhấn vào màn hình để thổi nến nhé!");
      }, 900);
    }
    function closeTheLastView() {
      if (!thelastView) return;
      setTheLastHint("");
      resetTheLastView();
      thelastView.classList.add("hidden");
      if (secretContainer) secretContainer.classList.remove("hidden");
    }
    function blowTheLastCandle() {
      if (thelastPhase !== "candle") return;
      unlockAudio();
      if (thelastCandleFlame) thelastCandleFlame.classList.add("off");
      if (thelastCandleSmoke) thelastCandleSmoke.classList.add("on");
      setTheLastHint("✨ Chuẩn bị cắt bánh kem nè...");
      thelastPhase = "transitioning";
      setTimeout(function () {
        thelastPhase = "knife";
        if (thelastCutGuide) thelastCutGuide.classList.remove("hidden");
        if (thelastKnife) thelastKnife.classList.add("show");
        setTheLastHint("🍴 Vuốt màn hình để cắt bánh");
      }, 1800);
    }
    function getCutPos(evt) {
      if (!thelastStage) return { x: 0, y: 0, clientX: 0, clientY: 0 };
      var stageRect = thelastStage.getBoundingClientRect();
      var wrapRect = thelastCakeWrap
        ? thelastCakeWrap.getBoundingClientRect()
        : stageRect;
      var x = evt.clientX,
        y = evt.clientY;
      if (
        typeof evt.touches !== "undefined" &&
        evt.touches &&
        evt.touches.length
      ) {
        x = evt.touches[0].clientX;
        y = evt.touches[0].clientY;
      } else if (
        typeof evt.changedTouches !== "undefined" &&
        evt.changedTouches &&
        evt.changedTouches.length
      ) {
        x = evt.changedTouches[0].clientX;
        y = evt.changedTouches[0].clientY;
      }
      return {
        x: ((x - stageRect.left) / stageRect.width) * 100,
        y: ((y - stageRect.top) / stageRect.height) * 100,
        wx: ((x - wrapRect.left) / wrapRect.width) * 100,
        wy: ((y - wrapRect.top) / wrapRect.height) * 100,
        clientX: x,
        clientY: y,
      };
    }
    function startCut(evt) {
      if (thelastPhase !== "knife") {
        if (thelastPhase === "candle") blowTheLastCandle();
        return;
      }
      cutActive = true;
      var pos = getCutPos(evt);
      cutStartX = pos.x;
      cutStartY = pos.y;
      cutCurrentX = pos.x;
      cutCurrentY = pos.y;
      if (thelastKnife) {
        thelastKnife.classList.add("cutting");
        var tx = -88 + pos.x * 0.8;
        var ty = pos.y - 50;
        thelastKnife.style.transform =
          "translate(" + tx + "%, " + ty + "%) rotate(-10deg)";
      }
    }
    function moveCut(evt) {
      if (!cutActive || thelastPhase !== "knife") return;
      var pos = getCutPos(evt);
      cutCurrentX = pos.x;
      cutCurrentY = pos.y;
      if (thelastKnife) {
        var tx = -88 + pos.x * 0.8;
        var ty = pos.y - 50;
        thelastKnife.style.transform =
          "translate(" + tx + "%, " + ty + "%) rotate(-6deg)";
      }
    }
    function applySliceAtPosition(wrapX, wrapY, swipeDx, swipeDy) {
      if (!thelastCakeSlice || !thelastCakeWrap) return;
      var clamp = function (v, min, max) {
        return Math.max(min, Math.min(max, v));
      };
      wrapX = Number(wrapX);
      wrapY = Number(wrapY);
      if (
        !isFinite(wrapX) ||
        !isFinite(wrapY) ||
        Math.abs(wrapX) < 0.001 ||
        wrapX < -15 ||
        wrapX > 120
      ) {
        wrapX = 55;
      }
      if (
        !isFinite(wrapY) ||
        Math.abs(wrapY) < 0.001 ||
        wrapY < -10 ||
        wrapY > 115
      ) {
        wrapY = 46;
      }
      var sliceW = 42;
      var sliceH = 50;
      var anchorX = 0.5;
      var anchorY = 0.42;
      var leftPct = clamp(wrapX - sliceW * anchorX, 4, 80);
      var topPct = clamp(wrapY - sliceH * anchorY, 10, 66);
      var angleDeg = Math.atan2(swipeDy, swipeDx) * (180 / Math.PI);
      if (!isFinite(angleDeg)) angleDeg = 0;
      var absDx = Math.abs(swipeDx) || 0;
      var absDy = Math.abs(swipeDy) || 0;
      var horiz = absDx >= absDy;
      var cutAngleDeg = horiz
        ? -22 + (swipeDy >= 0 ? -7 : 5)
        : -28 + angleDeg * 0.2;
      cutAngleDeg = clamp(cutAngleDeg, -50, 12);
      var offsetPct = horiz
        ? clamp(wrapX - sliceW * 0.2, 20, 60)
        : clamp(wrapY - sliceH * 0.08 + 14, 24, 58);
      thelastCakeSlice.style.setProperty(
        "--slice-left",
        leftPct.toFixed(1) + "%",
      );
      thelastCakeSlice.style.setProperty(
        "--slice-top",
        topPct.toFixed(1) + "%",
      );
      thelastCakeSlice.style.setProperty("--slice-width", sliceW + "%");
      thelastCakeSlice.style.setProperty("--slice-height", sliceH + "%");
      var rot = horiz
        ? clamp(angleDeg * 0.15 + 9, -8, 22)
        : clamp(angleDeg * 0.35 + 6, -14, 24);
      thelastCakeSlice.style.setProperty("--slice-rot", rot.toFixed(1) + "deg");
      var tx = horiz
        ? (swipeDx >= 0 ? 1 : -1) * (20 + absDx * 0.25)
        : (swipeDx >= 0 ? 1 : -1) * (10 + absDx * 0.18);
      if (!isFinite(tx)) tx = 22;
      var ty = 18 + (horiz ? swipeDy * 0.12 : swipeDy * 0.25);
      if (!isFinite(ty)) ty = 20;
      thelastCakeSlice.style.setProperty("--slice-tx", tx.toFixed(1) + "px");
      thelastCakeSlice.style.setProperty("--slice-ty", ty.toFixed(1) + "px");
      thelastCakeWrap.style.setProperty(
        "--cut-angle",
        cutAngleDeg.toFixed(1) + "deg",
      );
      thelastCakeWrap.style.setProperty(
        "--cut-offset",
        offsetPct.toFixed(1) + "%",
      );
    }
    function endCut(evt) {
      if (!cutActive) return;
      cutActive = false;
      var pos = getCutPos(evt);
      var sx = cutStartX !== null ? cutStartX : pos.x;
      var sy = cutStartY !== null ? cutStartY : pos.y;
      var dxStage = pos.x - sx;
      var dyStage = pos.y - sy;
      var dist = Math.sqrt(dxStage * dxStage + dyStage * dyStage);
      if (dist >= 28) {
        if (thelastKnife) {
          thelastKnife.style.transform = "translate(10%, 3%) rotate(6deg)";
        }
        thelastPhase = "done";
        var wrapRect2 = thelastCakeWrap
          ? thelastCakeWrap.getBoundingClientRect()
          : null;
        var wx, wy;
        if (
          pos.clientX !== 0 &&
          wrapRect2 &&
          wrapRect2.width > 5 &&
          wrapRect2.height > 5
        ) {
          wx = ((pos.clientX - wrapRect2.left) / wrapRect2.width) * 100;
          wy = ((pos.clientY - wrapRect2.top) / wrapRect2.height) * 100;
        } else {
          wx = pos.wx;
          wy = pos.wy;
        }
        var wrapStart = convertStageToWrap(sx, sy, wrapRect2);
        var wdx = wx - wrapStart.x;
        var wdy = wy - wrapStart.y;
        if (Math.abs(wdx) < 1 && Math.abs(wdy) < 1) {
          wdx = dxStage;
          wdy = dyStage;
        }
        applySliceAtPosition(wx, wy, wdx, wdy);
        setTimeout(function () {
          if (thelastCakeWrap) thelastCakeWrap.classList.add("slice-done");
          if (thelastCutGuide) thelastCutGuide.classList.add("hidden");
          setTheLastHint("🎉 Đây là món quà cuối cùng ");
          setTimeout(function () {
            setTheLastHint("");
            startFireworksAndFinal();
          }, 1000);
        }, 260);
      } else {
        if (thelastKnife) {
          thelastKnife.style.transform = "";
          thelastKnife.classList.remove("cutting");
        }
      }
    }
    function convertStageToWrap(sx, sy, wrapRectIn) {
      if (!thelastStage || !thelastCakeWrap) return { x: 55, y: 48 };
      var stageRect = thelastStage.getBoundingClientRect();
      var wrapRect = wrapRectIn || thelastCakeWrap.getBoundingClientRect();
      var fallbackX = 55;
      var fallbackY = 48;
      if (
        stageRect.width > 0 &&
        stageRect.height > 0 &&
        wrapRect.width > 0 &&
        wrapRect.height > 0
      ) {
        var absX = stageRect.left + (sx / 100) * stageRect.width;
        var absY = stageRect.top + (sy / 100) * stageRect.height;
        var wx2 = ((absX - wrapRect.left) / wrapRect.width) * 100;
        var wy2 = ((absY - wrapRect.top) / wrapRect.height) * 100;
        if (isFinite(wx2) && isFinite(wy2)) {
          return { x: wx2, y: wy2 };
        }
        return { x: fallbackX, y: fallbackY };
      }
      return { x: fallbackX, y: fallbackY };
    }

    /* ---------- FIREWORKS & GLOWING PINK PARTICLE TEXT ENGINE ---------- */
    function initGlowTextures() {
      if (glowTextures) return glowTextures;
      function makeTex(cCore, cMid, cOuter) {
        var c = document.createElement("canvas");
        c.width = 48;
        c.height = 48;
        var ctx = c.getContext("2d");
        var g = ctx.createRadialGradient(24, 24, 0, 24, 24, 24);
        g.addColorStop(0, cCore);
        g.addColorStop(0.35, cMid);
        g.addColorStop(0.8, cOuter);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 48, 48);
        return c;
      }
      glowTextures = {
        pink: makeTex(
          "rgba(255, 210, 235, 0.95)", // Hồng phấn êm dịu, không gắt chói
          "rgba(255, 105, 175, 0.75)",
          "rgba(220, 70, 155, 0.16)",
        ),
        rose: makeTex(
          "rgba(255, 230, 242, 0.95)",
          "rgba(255, 140, 195, 0.7)",
          "rgba(240, 90, 160, 0.14)",
        ),
        gold: makeTex(
          "rgba(255, 242, 215, 0.92)",
          "rgba(255, 195, 120, 0.7)",
          "rgba(240, 150, 60, 0.14)",
        ),
      };
      return glowTextures;
    }

    function resizeFireworksCanvas() {
      if (!thelastFireworks) return;
      var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      var w = thelastFireworks.clientWidth || window.innerWidth;
      var h = thelastFireworks.clientHeight || window.innerHeight;
      thelastFireworks.width = Math.floor(w * dpr);
      thelastFireworks.height = Math.floor(h * dpr);
      fwCtx = thelastFireworks.getContext("2d");
      if (fwCtx) {
        fwCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    }

    function fwRand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function fwColor() {
      var palette = [
        [255, 60, 160], // neon pink
        [255, 120, 205], // soft pink
        [255, 180, 235], // pastel pink
        [225, 75, 255], // cosmic purple
        [255, 215, 110], // golden star
        [255, 90, 145], // warm rose
        [185, 220, 255], // soft blue-violet
        [255, 240, 190], // champagne gold
      ];
      return palette[(Math.random() * palette.length) | 0];
    }

    function launchRocket(customX, customY, targetY) {
      if (!thelastFireworks) return;
      var w = thelastFireworks.clientWidth || window.innerWidth;
      var h = thelastFireworks.clientHeight || window.innerHeight;
      var startX = customX !== undefined ? customX : fwRand(w * 0.12, w * 0.88);
      var endY = targetY !== undefined ? targetY : fwRand(h * 0.14, h * 0.38);
      var speedY = fwRand(-10.5, -8.2);
      fwRockets.push({
        x: startX,
        y: customY !== undefined ? customY : h,
        targetY: endY,
        vx: fwRand(-0.6, 0.6),
        vy: speedY,
        ay: 0.13,
        life: 1,
        color: fwColor(),
        trailY: customY !== undefined ? customY : h,
      });
    }

    function explodeRocket(r) {
      var count = 65 + ((Math.random() * 45) | 0);
      var baseColor = r.color;
      var hueShift = Math.random() < 0.35;
      for (var i = 0; i < count; i++) {
        var ang = (Math.PI * 2 * i) / count + fwRand(-0.06, 0.06);
        var speed = fwRand(2.0, 6.2);
        var col = hueShift ? fwColor() : baseColor;
        fwParticles.push({
          x: r.x,
          y: r.y,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          life: 1,
          decay: fwRand(0.012, 0.022),
          size: fwRand(1.8, 3.4),
          color: col,
          gravity: 0.045,
        });
      }
      var sparkleCount = 22 + ((Math.random() * 16) | 0);
      for (var j = 0; j < sparkleCount; j++) {
        var sang = fwRand(0, Math.PI * 2);
        var sspeed = fwRand(0.6, 2.2);
        fwParticles.push({
          x: r.x,
          y: r.y,
          vx: Math.cos(sang) * sspeed,
          vy: Math.sin(sang) * sspeed,
          life: 1,
          decay: fwRand(0.018, 0.032),
          size: fwRand(0.9, 1.8),
          color: [255, 255, 230],
          gravity: 0.02,
          sparkle: true,
        });
      }
    }

    /* Tạo vị trí các hạt tạo thành chữ "HAPPY BIRTHDAY" màu hồng */
    function createTextParticles(w, h) {
      textParticles = [];
      var textures = initGlowTextures();
      var offCanvas = document.createElement("canvas");
      offCanvas.width = w;
      offCanvas.height = h;
      var offCtx = offCanvas.getContext("2d");
      if (!offCtx) return;

      var isMobile = w < 680;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#ffffff";

      var centerY = h * 0.44;

      if (!isMobile) {
        var fsMain = Math.min(74, Math.max(50, Math.floor(w * 0.058)));
        var fsSub = Math.min(36, Math.max(24, Math.floor(w * 0.028)));

        // Dùng font 900 đậm nét giúp chữ đặc hạt, rõ mồn một từng nét chữ
        offCtx.font =
          "900 " +
          fsMain +
          "px 'Montserrat', 'Arial Black', -apple-system, sans-serif";
        offCtx.fillText("HAPPY BIRTHDAY", w * 0.5, centerY - fsMain * 0.4);

        offCtx.font =
          "bold " +
          fsSub +
          "px 'Montserrat', 'Dancing Script', -apple-system, sans-serif";
        offCtx.fillText("✨  Kim Ngân  ✨", w * 0.5, centerY + fsMain * 0.72);
      } else {
        var fsWord = Math.min(56, Math.max(40, Math.floor(w * 0.125)));
        var fsSubMob = Math.min(28, Math.max(20, Math.floor(w * 0.062)));

        offCtx.font =
          "900 " +
          fsWord +
          "px 'Montserrat', 'Arial Black', -apple-system, sans-serif";
        offCtx.fillText("HAPPY", w * 0.5, centerY - fsWord * 1.15);
        offCtx.fillText("BIRTHDAY", w * 0.5, centerY + fsWord * 0.02);

        offCtx.font =
          "bold " +
          fsSubMob +
          "px 'Montserrat', 'Dancing Script', -apple-system, sans-serif";
        offCtx.fillText("✨  Kim Ngân ✨", w * 0.5, centerY + fsWord * 1.18);
      }

      var imgData = offCtx.getImageData(0, 0, w, h).data;
      var step = isMobile ? 4.5 : 5.2;
      var maxParticles = isMobile ? 420 : 580;

      for (var y = 0; y < h; y += step) {
        if (textParticles.length >= maxParticles) break;
        for (var x = 0; x < w; x += step) {
          if (textParticles.length >= maxParticles) break;
          var px = Math.floor(x);
          var py = Math.floor(y);
          var idx = (py * w + px) * 4;
          if (imgData[idx + 3] > 60) {
            var rVal = Math.random();
            var tex = textures.pink;
            if (rVal < 0.35) tex = textures.rose;
            else if (rVal < 0.48) tex = textures.gold;

            var angle = Math.random() * Math.PI * 2;
            var dist = Math.random() * Math.max(w, h) * 0.48 + 100;
            var originX = w * 0.5 + Math.cos(angle) * dist;
            var originY = h * 0.4 + Math.sin(angle) * dist;

            textParticles.push({
              x: originX,
              y: originY,
              originX: originX,
              originY: originY,
              targetX: px,
              targetY: py,
              size: (Math.random() * 1.4 + 2.0) * (isMobile ? 0.9 : 1.05),
              tex: tex,
              delay: Math.random() * 0.9,
              duration: 1.3 + Math.random() * 0.4,
              phase: Math.random() * Math.PI * 2,
              floatSpeed: 0.5 + Math.random() * 0.5,
              twinkleSpeed: 1.0 + Math.random() * 1.4,
              floatAmpX: 0.3 + Math.random() * 0.5,
              floatAmpY: 0.4 + Math.random() * 0.6,
              sparkleInterval: 3.5 + Math.random() * 5,
              lastSparkle: Math.random() * 3,
            });
          }
        }
      }
    }

    function createAmbientStardust(w, h) {
      ambientStardust = [];
      var textures = initGlowTextures();
      var count = Math.min(48, Math.floor(w * 0.05));
      for (var i = 0; i < count; i++) {
        ambientStardust.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 2.8 + 1.2,
          speedY: -(Math.random() * 0.32 + 0.12),
          speedX: (Math.random() - 0.5) * 0.18,
          phase: Math.random() * Math.PI * 2,
          tex: Math.random() < 0.7 ? textures.pink : textures.gold,
        });
      }
    }

    function drawStarSparkle(ctx, x, y, size, opacity) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#ff7bc8";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(x, y, size * 2.4, size * 0.45, 0, 0, Math.PI * 2);
      ctx.ellipse(x, y, size * 0.45, size * 2.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function fwStep() {
      if (!fwCtx || !thelastFireworks) return;
      var w = thelastFireworks.clientWidth || window.innerWidth;
      var h = thelastFireworks.clientHeight || window.innerHeight;
      var now = performance.now() * 0.001;
      var elapsedSinceText = textStartTime > 0 ? now - textStartTime : 0;

      // Xóa mờ nhẹ tạo vệt đuôi pháo hoa và quầng sáng ngân hà
      fwCtx.globalCompositeOperation = "source-over";
      fwCtx.fillStyle = "rgba(7, 1, 14, 0.22)";
      fwCtx.fillRect(0, 0, w, h);

      fwCtx.globalCompositeOperation = "lighter";

      // 1. Vẽ bụi sao trôi nổi (Ambient Stardust)
      for (var s = 0; s < ambientStardust.length; s++) {
        var sd = ambientStardust[s];
        sd.y += sd.speedY;
        sd.x += sd.speedX + Math.sin(now * 0.8 + sd.phase) * 0.15;
        if (sd.y < -10) {
          sd.y = h + 10;
          sd.x = Math.random() * w;
        }
        var sAlpha = 0.45 + Math.sin(now * 1.4 + sd.phase) * 0.3;
        fwCtx.globalAlpha = Math.max(0.1, Math.min(1, sAlpha));
        fwCtx.drawImage(
          sd.tex,
          sd.x - sd.size,
          sd.y - sd.size,
          sd.size * 2,
          sd.size * 2,
        );
      }

      // 2. Vẽ pháo hoa Rockets
      var i = fwRockets.length;
      while (i--) {
        var r = fwRockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.vy += r.ay;
        if (r.vy >= -1.2 || r.y <= (r.targetY || h * 0.32)) {
          explodeRocket(r);
          fwRockets.splice(i, 1);
          continue;
        }
        fwCtx.beginPath();
        fwCtx.strokeStyle =
          "rgba(" + r.color[0] + "," + r.color[1] + "," + r.color[2] + ",0.92)";
        fwCtx.lineWidth = 2.4;
        fwCtx.moveTo(r.x, r.trailY);
        fwCtx.lineTo(r.x, r.y + 6);
        fwCtx.stroke();
        r.trailY = r.y;

        fwCtx.beginPath();
        fwCtx.fillStyle = "rgba(255,245,210," + fwRand(0.7, 1) + ")";
        fwCtx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
        fwCtx.fill();
      }

      // 3. Vẽ pháo hoa Particles
      var j = fwParticles.length;
      while (j--) {
        var p = fwParticles[j];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.vy += p.gravity;
        p.life -= p.decay;
        if (p.life <= 0) {
          fwParticles.splice(j, 1);
          continue;
        }
        var a = Math.max(0, Math.min(1, p.life));
        if (p.sparkle && Math.random() < 0.35) a *= 0.25;
        fwCtx.beginPath();
        fwCtx.fillStyle =
          "rgba(" +
          p.color[0] +
          "," +
          p.color[1] +
          "," +
          p.color[2] +
          "," +
          a +
          ")";
        fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        fwCtx.fill();
      }

      // 4. Vẽ chữ hạt sáng "HAPPY BIRTHDAY"
      var isMobileScreen = w < 680;
      var textCenterY = h * 0.44;

      // Nền chữ hồng mờ dịu mắt (không dùng shadowBlur để đảm bảo 60 FPS mượt mà)
      if (elapsedSinceText > 1.4) {
        var glowFade = Math.min(1, (elapsedSinceText - 1.4) / 0.8);
        fwCtx.save();
        fwCtx.globalAlpha = 0.18 * glowFade;
        fwCtx.textAlign = "center";
        fwCtx.textBaseline = "middle";
        fwCtx.fillStyle = "#ff75b5";

        if (!isMobileScreen) {
          var fsM = Math.min(72, Math.max(48, Math.floor(w * 0.056)));
          var fsS = Math.min(34, Math.max(22, Math.floor(w * 0.026)));
          fwCtx.font =
            "900 " +
            fsM +
            "px 'Montserrat', 'Arial Black', -apple-system, sans-serif";
          fwCtx.fillText("HAPPY BIRTHDAY", w * 0.5, textCenterY - fsM * 0.4);
          fwCtx.font =
            "bold " +
            fsS +
            "px 'Montserrat', 'Dancing Script', -apple-system, sans-serif";
          fwCtx.fillText("✨  Kim Ngân  ✨", w * 0.5, textCenterY + fsM * 0.72);
        } else {
          var fsW = Math.min(54, Math.max(38, Math.floor(w * 0.12)));
          var fsSM = Math.min(26, Math.max(18, Math.floor(w * 0.058)));
          fwCtx.font =
            "900 " +
            fsW +
            "px 'Montserrat', 'Arial Black', -apple-system, sans-serif";
          fwCtx.fillText("HAPPY", w * 0.5, textCenterY - fsW * 1.15);
          fwCtx.fillText("BIRTHDAY", w * 0.5, textCenterY + fsW * 0.02);
          fwCtx.font =
            "bold " +
            fsSM +
            "px 'Montserrat', 'Dancing Script', -apple-system, sans-serif";
          fwCtx.fillText("✨  Kim Ngân  ✨", w * 0.5, textCenterY + fsW * 1.18);
        }
        fwCtx.restore();
      }

      var pLen = textParticles.length;
      for (var k = 0; k < pLen; k++) {
        var tp = textParticles[k];
        var pTime = elapsedSinceText - tp.delay;
        if (pTime < 0) continue;

        var currX, currY;
        if (pTime < tp.duration) {
          var progress = pTime / tp.duration;
          var tProg = 1 - Math.pow(1 - progress, 3);
          var wave = Math.sin(progress * Math.PI) * 20;
          currX =
            tp.originX +
            (tp.targetX - tp.originX) * tProg +
            Math.cos(tp.phase) * wave;
          currY =
            tp.originY +
            (tp.targetY - tp.originY) * tProg +
            Math.sin(tp.phase) * wave;
        } else {
          var floatX = Math.sin(now * tp.floatSpeed + tp.phase) * tp.floatAmpX;
          var floatY =
            Math.cos(now * tp.floatSpeed * 0.85 + tp.phase) * tp.floatAmpY;
          currX = tp.targetX + floatX;
          currY = tp.targetY + floatY;

          if (pointerPos.active) {
            var dx = currX - pointerPos.x;
            var dy = currY - pointerPos.y;
            var distSq = dx * dx + dy * dy;
            var minDist = 65;
            if (distSq < minDist * minDist && distSq > 0) {
              var dist = Math.sqrt(distSq);
              var push = (1 - dist / minDist) * 35;
              currX += (dx / dist) * push;
              currY += (dy / dist) * push;
            }
          }
        }

        var tAlpha = 0.58 + Math.sin(now * tp.twinkleSpeed + tp.phase) * 0.16;
        fwCtx.globalAlpha = Math.max(0.35, Math.min(0.82, tAlpha));

        var drawSize = tp.size * (0.95 + Math.sin(now * 1.6 + tp.phase) * 0.08);
        fwCtx.drawImage(
          tp.tex,
          currX - drawSize * 1.1,
          currY - drawSize * 1.1,
          drawSize * 2.2,
          drawSize * 2.2,
        );

        if (pTime >= tp.duration && now - tp.lastSparkle > tp.sparkleInterval) {
          var sparkAge = now - tp.lastSparkle - tp.sparkleInterval;
          if (sparkAge < 0.5) {
            var sparkAlpha = Math.sin((sparkAge / 0.5) * Math.PI) * 0.6;
            drawStarSparkle(fwCtx, currX, currY, drawSize * 1.1, sparkAlpha);
          } else if (sparkAge > 0.7) {
            tp.lastSparkle = now;
            tp.sparkleInterval = 4.0 + Math.random() * 6;
          }
        }
      }

      fwCtx.globalAlpha = 1;
    }

    function fwLoop() {
      fwStep();
      fwRaf = requestAnimationFrame(fwLoop);
    }

    function startFireworksAndFinal() {
      if (!thelastFireworks) return;
      stopFireworks();
      thelastFireworks.classList.remove("hidden");
      if (thelastView) thelastView.classList.add("celebrating");
      resizeFireworksCanvas();

      var w = thelastFireworks.clientWidth || window.innerWidth;
      var h = thelastFireworks.clientHeight || window.innerHeight;

      textStartTime = performance.now() * 0.001;
      createTextParticles(w, h);
      createAmbientStardust(w, h);

      fwRockets.length = 0;
      fwParticles.length = 0;
      launchRocket(w * 0.25, h, h * 0.26);
      launchRocket(w * 0.75, h, h * 0.26);

      var introCount = 0;
      var introTimer = setInterval(function () {
        var sideX =
          introCount % 2 === 0
            ? fwRand(w * 0.12, w * 0.35)
            : fwRand(w * 0.65, w * 0.88);
        launchRocket(sideX, h, fwRand(h * 0.16, h * 0.36));
        introCount++;
        if (introCount >= 5) {
          clearInterval(introTimer);
        }
      }, 700);

      fwLoop();

      // Duy trì pháo hoa ở chế độ nền liên tục
      fwAmbientTimer = setInterval(function () {
        if (!thelastFireworks || thelastFireworks.classList.contains("hidden"))
          return;
        var rX =
          Math.random() < 0.5
            ? fwRand(w * 0.08, w * 0.32)
            : fwRand(w * 0.68, w * 0.92);
        launchRocket(rX, h, fwRand(h * 0.14, h * 0.38));
      }, 1900);

      // Hiển thị nút Quay lại nhẹ nhàng sau khi chữ hạt sáng tụ hội
      setTimeout(function () {
        if (
          thelastCelebrateBackBtn &&
          thelastView &&
          thelastView.classList.contains("celebrating")
        ) {
          thelastCelebrateBackBtn.classList.remove("hidden");
        }
      }, 2200);
    }

    function stopFireworks() {
      if (fwRaf) {
        cancelAnimationFrame(fwRaf);
        fwRaf = null;
      }
      if (fwStopTimer) {
        clearInterval(fwStopTimer);
        fwStopTimer = null;
      }
      if (fwAmbientTimer) {
        clearInterval(fwAmbientTimer);
        fwAmbientTimer = null;
      }
      fwRockets.length = 0;
      fwParticles.length = 0;
      textParticles.length = 0;
      ambientStardust.length = 0;
      textStartTime = 0;
      pointerPos.active = false;
      if (thelastFireworks) thelastFireworks.classList.add("hidden");
      if (thelastView) thelastView.classList.remove("celebrating");
      if (thelastCelebrateBackBtn)
        thelastCelebrateBackBtn.classList.add("hidden");
      if (fwCtx) {
        try {
          var w = thelastFireworks ? thelastFireworks.clientWidth || 0 : 0;
          var h = thelastFireworks ? thelastFireworks.clientHeight || 0 : 0;
          fwCtx.clearRect(0, 0, w, h);
        } catch (e) {}
      }
      if (thelastFinal) thelastFinal.classList.remove("show");
    }

    window.addEventListener("resize", function () {
      if (thelastFireworks && !thelastFireworks.classList.contains("hidden")) {
        resizeFireworksCanvas();
        var w = thelastFireworks.clientWidth || window.innerWidth;
        var h = thelastFireworks.clientHeight || window.innerHeight;
        createTextParticles(w, h);
        createAmbientStardust(w, h);
      }
    });

    if (thelastFireworks) {
      thelastFireworks.addEventListener("pointerdown", function (e) {
        var rect = thelastFireworks.getBoundingClientRect();
        var cx = e.clientX - rect.left;
        var cy = e.clientY - rect.top;
        pointerPos.x = cx;
        pointerPos.y = cy;
        pointerPos.active = true;
        launchRocket(
          cx,
          thelastFireworks.clientHeight || window.innerHeight,
          cy,
        );
      });
      thelastFireworks.addEventListener("pointermove", function (e) {
        var rect = thelastFireworks.getBoundingClientRect();
        pointerPos.x = e.clientX - rect.left;
        pointerPos.y = e.clientY - rect.top;
        pointerPos.active = true;
      });
      thelastFireworks.addEventListener("pointerup", function () {
        pointerPos.active = false;
        pointerPos.x = -9999;
        pointerPos.y = -9999;
      });
      thelastFireworks.addEventListener("pointercancel", function () {
        pointerPos.active = false;
        pointerPos.x = -9999;
        pointerPos.y = -9999;
      });
    }

    /* ---------- GIFT (bridge — gift-loader.js sẽ gán vào window.__openGift) ---------- */
    function isHttp() {
      return (
        window.location.protocol === "http:" ||
        window.location.protocol === "https:"
      );
    }
    function openGiftView() {
      if (typeof window.__openGift === "function") {
        window.__openGift();
        return;
      }
      var hint = $("giftHint");
      var gv = $("giftView");
      var backBtn = $("giftBackBtn");
      if (secretContainer) secretContainer.classList.add("hidden");
      if (gv) gv.classList.remove("hidden");
      if (backBtn) backBtn.classList.remove("hidden");
      if (hint) {
        hint.classList.remove("hidden");
        if (!isHttp()) {
          hint.innerHTML =
            "⚠ Bạn đang mở file trực tiếp (file://) — Gift 3D không chạy được.<br>" +
            "Trình duyệt chặn module và chặn đọc ảnh local.<br>" +
            "👉 Hãy nháy đúp file <code>Chay-Website.bat</code> rồi mở " +
            "<b>http://localhost:8080</b><br>" +
            "(Password & Letter vẫn chạy OK, chỉ Gift cần HTTP thôi)";
        } else {
          hint.innerHTML =
            "⚠ Gift module chưa load (đã chạy qua HTTP rồi!).<br>" +
            "Thử theo thứ tự:<br>" +
            "&nbsp;•&nbsp; Nhấn <b>Ctrl + Shift + R</b> để làm mới cứng<br>" +
            "&nbsp;•&nbsp; Kiểm tra vendor/three.module.js và vendor/OrbitControls.js còn đủ<br>" +
            "&nbsp;•&nbsp; Mở DevTools (F12) → Console xem lỗi chi tiết<br>";
        }
        hint.style.fontSize = "12px";
        hint.style.lineHeight = "1.6";
        hint.style.whiteSpace = "normal";
      }
    }
    function closeGiftView() {
      if (typeof window.__closeGift === "function") {
        window.__closeGift();
      } else {
        var gv = $("giftView");
        if (gv) gv.classList.add("hidden");
        if (secretContainer) secretContainer.classList.remove("hidden");
      }
    }
    // Expose cho gift-loader.js gán lại
    window.__giftApi = {
      getSecretContainer: function () {
        return secretContainer;
      },
      getLetterView: function () {
        return letterView;
      },
      closeLetterViewQuiet: closeLetterView,
      getTheLastView: function () {
        return thelastView;
      },
      closeTheLastViewQuiet: closeTheLastView,
    };

    /* ---------- EVENT LISTENERS ---------- */
    // Keypad
    for (var k = 0; k < keys.length; k++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          addNumber(btn.getAttribute("data-number"));
        });
      })(keys[k]);
    }
    if (deleteButton) {
      deleteButton.addEventListener("click", deleteNumber);
    }

    // Global keydown (PRIORITY: gift -> thelast -> letter -> password)
    document.addEventListener("keydown", function (evt) {
      var giftView = $("giftView");
      // GIFT (nếu có module gift-loader.js)
      if (giftView && !giftView.classList.contains("hidden")) {
        if (evt.key === "Escape") {
          evt.preventDefault();
          closeGiftView();
        }
        if (evt.key === "Enter" || evt.key === " ") {
          if (typeof window.__breakGiftHeart === "function") {
            try {
              window.__breakGiftHeart();
            } catch (e) {}
          }
        }
        return;
      }
      // THE LAST
      if (thelastView && !thelastView.classList.contains("hidden")) {
        if (evt.key === "Escape") {
          evt.preventDefault();
          closeTheLastView();
          return;
        }
        if (evt.key === "Enter" || evt.key === " ") {
          evt.preventDefault();
          if (thelastPhase === "candle") {
            blowTheLastCandle();
          } else if (thelastPhase === "knife") {
            thelastPhase = "done";
            cutActive = false;
            applySliceAtPosition(55, 42, 30, -5);
            if (thelastKnife) {
              thelastKnife.classList.add("cutting");
              thelastKnife.style.transform = "translate(10%, 3%) rotate(6deg)";
            }
            setTimeout(function () {
              if (thelastCakeWrap) thelastCakeWrap.classList.add("slice-done");
              if (thelastCutGuide) thelastCutGuide.classList.add("hidden");
              setTheLastHint("🎉 Đây là món quà cuối cùng 💕");
              setTimeout(function () {
                setTheLastHint("");
                startFireworksAndFinal();
              }, 1000);
            }, 260);
          } else if (thelastModal && thelastModal.classList.contains("show")) {
            if (thelastModal) thelastModal.classList.remove("show");
          } else if (thelastFinal && thelastFinal.classList.contains("show")) {
            thelastFinal.classList.remove("show");
            stopFireworks(true);
          }
          return;
        }
        return;
      }
      // LETTER
      if (letterView && !letterView.classList.contains("hidden")) {
        if (letterStage && !letterStage.classList.contains("hidden")) {
          if (
            evt.key === "ArrowRight" ||
            evt.key === "Enter" ||
            evt.key === " "
          ) {
            evt.preventDefault();
            if (letterCurrentPage < LETTER_TOTAL - 1) {
              showLetterPage(letterCurrentPage + 1, "forward");
            }
          }
          if (evt.key === "ArrowLeft") {
            evt.preventDefault();
            if (letterCurrentPage > 0) {
              showLetterPage(letterCurrentPage - 1, "backward");
            }
          }
        }
        if (evt.key === "Escape") {
          evt.preventDefault();
          closeLetterView();
        }
        return;
      }
      // PASSWORD
      if (evt.key >= "0" && evt.key <= "9") addNumber(evt.key);
      if (evt.key === "Backspace") deleteNumber();
    });

    // Lock button
    if (backButton) {
      backButton.addEventListener("click", function () {
        unlockAudio();
        stopFloating();
        try {
          if (backgroundMusic && backgroundMusic.pause) backgroundMusic.pause();
          if (backgroundMusic) backgroundMusic.currentTime = 0;
        } catch (e) {}
        musicStarted = false;
        closeLetterView();
        closeTheLastView();
        closeGiftView();
        if (secretScreen) secretScreen.classList.add("hidden");
        if (passwordScreen) passwordScreen.style.display = "block";
        password = "";
        updatePasswordDots();
      });
    }

    // Secret menu router
    for (var m = 0; m < secretItems.length; m++) {
      (function (it) {
        it.addEventListener("click", function () {
          unlockAudio();
          var page = it.getAttribute("data-page");
          if (page === "letter") openLetterView();
          else if (page === "thelast") openTheLastView();
          else if (page === "gift") openGiftView();
        });
      })(secretItems[m]);
    }

    // Letter back
    if (letterBackBtn) {
      letterBackBtn.addEventListener("click", function () {
        unlockAudio();
        closeLetterView();
      });
    }

    // The Last Back button
    if (thelastBackBtn) {
      thelastBackBtn.addEventListener("click", function () {
        unlockAudio();
        closeTheLastView();
      });
    }
    if (thelastCelebrateBackBtn) {
      thelastCelebrateBackBtn.addEventListener("click", function () {
        unlockAudio();
        closeTheLastView();
      });
    }
    // The Last Close Modal button
    if (thelastClose) {
      thelastClose.addEventListener("click", function () {
        unlockAudio();
        if (thelastModal) thelastModal.classList.remove("show");
      });
    }
    // The Last Final click to dismiss
    if (thelastFinal) {
      thelastFinal.addEventListener("click", function () {
        unlockAudio();
        thelastFinal.classList.remove("show");
        stopFireworks(true);
      });
    }
    // The Last Stage pointer events (blow candle + swipe cut)
    if (thelastStage) {
      thelastStage.addEventListener("pointerdown", function (e) {
        try {
          thelastStage.setPointerCapture(e.pointerId);
        } catch (err) {}
        startCut(e);
      });
      thelastStage.addEventListener("pointermove", moveCut);
      thelastStage.addEventListener("pointerup", function (e) {
        try {
          thelastStage.releasePointerCapture(e.pointerId);
        } catch (err) {}
        endCut(e);
      });
      thelastStage.addEventListener("pointercancel", function (e) {
        cutActive = false;
        if (thelastKnife) {
          thelastKnife.style.transform = "";
          thelastKnife.classList.remove("cutting");
        }
      });
    }

    // Envelope click
    if (envelope) {
      envelope.addEventListener("click", function () {
        if (envelopeOpened) return;
        envelopeOpened = true;
        envelope.classList.add("opened");
        setTimeout(function () {
          if (envelopeStage) envelopeStage.classList.add("hidden");
          if (letterStage) letterStage.classList.remove("hidden");
          for (var i = 0; i < letterPages.length; i++) {
            var p = letterPages[i];
            p.classList.remove(
              "leave-forward",
              "leave-backward",
              "enter-forward",
              "enter-backward",
            );
            p.classList.toggle("active", i === 0);
          }
          letterCurrentPage = 0;
        }, 900);
      });
    }

    // Letter stage click -> next page
    if (letterStage) {
      letterStage.addEventListener("click", function () {
        if (letterCurrentPage < LETTER_TOTAL - 1) {
          showLetterPage(letterCurrentPage + 1, "forward");
        }
      });
    }

    // Đăng ký global "bất kỳ tương tác nào cũng start nhạc nếu đang bị autoplay chặn"
    // (Fix âm thanh không chạy trên VS Code Live Server / localhost port lạ)

    showOk("✓ Mật khẩu là 4 số của ngày, tháng sinh của nha ");
  }
})();
