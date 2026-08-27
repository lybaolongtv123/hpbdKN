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
    var CORRECT_PASSWORD = "2708";

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
    var takecareView = $("takecareView");
    var takecareBackBtn = $("takecareBackBtn");
    var takecareFlipCards = $$(".flip-card");

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

    /* ---------- TAKE CARE ---------- */
    function openTakeCareView() {
      if (!takecareView) return;
      if (secretContainer) secretContainer.classList.add("hidden");
      for (var i = 0; i < takecareFlipCards.length; i++) {
        takecareFlipCards[i].classList.remove("is-flipped");
      }
      takecareView.classList.remove("hidden");
    }
    function closeTakeCareView() {
      if (!takecareView) return;
      if (secretContainer) secretContainer.classList.remove("hidden");
      takecareView.classList.add("hidden");
    }
    function toggleFlipCard(card) {
      if (!card) return;
      unlockAudio();
      card.classList.toggle("is-flipped");
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
      closeTakeCareView();
      closeLetterView();
      closeGiftView();
      resetTheLastView();
      thelastView.classList.remove("hidden");
      setTimeout(function () {
        setTheLastHint(
          "💫 Ước gì đó đi beiuu — nhấn vào màn hình để thổi nến nhé!",
        );
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
        setTheLastHint("🍴 Vuốt màn hình để cắt một lát bánh nha babeee");
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
          setTheLastHint("🎉 Cảm ơn em! Đây là món quà cuối cùng 💕");
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

    /* ---------- FIREWORKS ENGINE for THE LAST ---------- */
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
        [255, 120, 170],
        [255, 180, 220],
        [255, 210, 120],
        [180, 220, 255],
        [200, 140, 255],
        [255, 150, 150],
        [140, 255, 210],
        [255, 230, 140],
      ];
      return palette[(Math.random() * palette.length) | 0];
    }
    function launchRocket() {
      if (!thelastFireworks) return;
      var w = thelastFireworks.clientWidth || window.innerWidth;
      var h = thelastFireworks.clientHeight || window.innerHeight;
      fwRockets.push({
        x: fwRand(w * 0.15, w * 0.85),
        y: h,
        vx: fwRand(-0.8, 0.8),
        vy: fwRand(-8.5, -6.2),
        ay: 0.14,
        life: 1,
        color: fwColor(),
        trailY: h,
      });
    }
    function explodeRocket(r) {
      var count = 60 + ((Math.random() * 40) | 0);
      var baseColor = r.color;
      var hueShift = Math.random() < 0.3;
      for (var i = 0; i < count; i++) {
        var ang = (Math.PI * 2 * i) / count + fwRand(-0.05, 0.05);
        var speed = fwRand(2.2, 6.0);
        var col = hueShift ? fwColor() : baseColor;
        fwParticles.push({
          x: r.x,
          y: r.y,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          life: 1,
          decay: fwRand(0.012, 0.022),
          size: fwRand(1.6, 3.2),
          color: col,
          gravity: 0.05,
        });
      }
      var sparkleCount = 20 + ((Math.random() * 15) | 0);
      for (var j = 0; j < sparkleCount; j++) {
        var sang = fwRand(0, Math.PI * 2);
        var sspeed = fwRand(0.6, 2.0);
        fwParticles.push({
          x: r.x,
          y: r.y,
          vx: Math.cos(sang) * sspeed,
          vy: Math.sin(sang) * sspeed,
          life: 1,
          decay: fwRand(0.02, 0.035),
          size: fwRand(0.8, 1.6),
          color: [255, 255, 220],
          gravity: 0.02,
          sparkle: true,
        });
      }
    }
    function fwStep() {
      if (!fwCtx || !thelastFireworks) return;
      var w = thelastFireworks.clientWidth || window.innerWidth;
      var h = thelastFireworks.clientHeight || window.innerHeight;
      fwCtx.globalCompositeOperation = "source-over";
      fwCtx.fillStyle = "rgba(10, 4, 20, 0.18)";
      fwCtx.fillRect(0, 0, w, h);
      fwCtx.globalCompositeOperation = "lighter";
      var i = fwRockets.length;
      while (i--) {
        var r = fwRockets[i];
        r.x += r.vx;
        r.y += r.vy;
        r.vy += r.ay;
        if (r.vy >= -1.2 || r.y <= h * 0.32) {
          explodeRocket(r);
          fwRockets.splice(i, 1);
          continue;
        }
        fwCtx.beginPath();
        fwCtx.strokeStyle =
          "rgba(" + r.color[0] + "," + r.color[1] + "," + r.color[2] + ",0.9)";
        fwCtx.lineWidth = 2.2;
        fwCtx.moveTo(r.x, r.trailY);
        fwCtx.lineTo(r.x, r.y + 6);
        fwCtx.stroke();
        r.trailY = r.y;
        fwCtx.beginPath();
        fwCtx.fillStyle = "rgba(255,240,200," + fwRand(0.6, 1) + ")";
        fwCtx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
        fwCtx.fill();
      }
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
    }
    function fwLoop() {
      fwStep();
      fwRaf = requestAnimationFrame(fwLoop);
    }
    function startFireworksAndFinal() {
      if (!thelastFireworks) return;
      stopFireworks();
      thelastFireworks.classList.remove("hidden");
      resizeFireworksCanvas();
      fwRockets.length = 0;
      fwParticles.length = 0;
      launchRocket();
      launchRocket();
      var count = 0;
      fwStopTimer = setInterval(function () {
        var burst = 1 + ((Math.random() * 2) | 0);
        for (var i = 0; i < burst; i++) launchRocket();
        count++;
        if (count >= 7) {
          clearInterval(fwStopTimer);
          fwStopTimer = null;
        }
      }, 650);
      fwLoop();
      setTimeout(function () {
        if (thelastFinal) thelastFinal.classList.add("show");
      }, 3200);
      setTimeout(function () {
        stopFireworks(true);
      }, 9500);
    }
    function stopFireworks(keepFinal) {
      if (fwRaf) {
        cancelAnimationFrame(fwRaf);
        fwRaf = null;
      }
      if (fwStopTimer) {
        clearInterval(fwStopTimer);
        fwStopTimer = null;
      }
      fwRockets.length = 0;
      fwParticles.length = 0;
      if (thelastFireworks) thelastFireworks.classList.add("hidden");
      if (fwCtx) {
        try {
          var w = thelastFireworks ? thelastFireworks.clientWidth || 0 : 0;
          var h = thelastFireworks ? thelastFireworks.clientHeight || 0 : 0;
          fwCtx.clearRect(0, 0, w, h);
        } catch (e) {}
      }
      if (!keepFinal && thelastFinal) thelastFinal.classList.remove("show");
    }
    window.addEventListener("resize", function () {
      if (thelastFireworks && !thelastFireworks.classList.contains("hidden")) {
        resizeFireworksCanvas();
      }
    });

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
            "⚠ BẠN ĐANG MỞ FILE TRỰC TIẾP (file://) — Gift 3D KHÔNG CHẠY.<br>" +
            "Hãy chạy HTTP server rồi mở <b>http://localhost:8080</b>:<br>" +
            "1) Mở PowerShell vào thư mục project<br>" +
            "2) Gõ lệnh: <code>powershell -File _server.ps1</code><br>" +
            "3) Mở trình duyệt vào <code>http://localhost:8080</code><br>" +
            "(Password & Letter vẫn chạy OK, chỉ Gift cần HTTP thôi)";
        } else {
          hint.innerHTML =
            "⚠ Gift Module chưa load (đã ở localhost rồi!).<br>" +
            "Lý do có thể:<br>" +
            "&nbsp;•&nbsp; Mất mạng: không tải được three.js CDN (unpkg.com)<br>" +
            "&nbsp;•&nbsp; File gift3d.js / gift-loader.js bị thiếu hoặc lỗi syntax<br>" +
            "&nbsp;•&nbsp; Cache cũ — nhấn <b>Ctrl + Shift + R</b> làm mới cứng<br>" +
            "Hãy mở DevTools (F12) → tab Console xem lỗi chi tiết.";
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
      getTakeCareView: function () {
        return takecareView;
      },
      closeTakeCareViewQuiet: closeTakeCareView,
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

    // Global keydown (PRIORITY: gift -> thelast -> takecare -> letter -> password)
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
          if (thelastFinal && thelastFinal.classList.contains("show")) {
            thelastFinal.classList.remove("show");
            stopFireworks(true);
            return;
          }
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
              setTheLastHint("🎉 Cảm ơn em! Đây là món quà cuối cùng 💕");
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
      // TAKE CARE
      if (takecareView && !takecareView.classList.contains("hidden")) {
        if (evt.key === "Escape") {
          evt.preventDefault();
          closeTakeCareView();
          return;
        }
        var active = document.activeElement;
        if (
          active &&
          active.classList &&
          active.classList.contains("flip-card") &&
          (evt.key === "Enter" || evt.key === " ")
        ) {
          evt.preventDefault();
          toggleFlipCard(active);
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
        closeTakeCareView();
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
          else if (page === "takecare") openTakeCareView();
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

    // Take Care back
    if (takecareBackBtn) {
      takecareBackBtn.addEventListener("click", function () {
        unlockAudio();
        closeTakeCareView();
      });
    }

    // Take Care flip cards (click + Enter/Space)
    for (var fc = 0; fc < takecareFlipCards.length; fc++) {
      (function (card) {
        card.addEventListener("click", function () {
          toggleFlipCard(card);
        });
        card.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleFlipCard(card);
          }
        });
      })(takecareFlipCards[fc]);
    }

    // The Last Back button
    if (thelastBackBtn) {
      thelastBackBtn.addEventListener("click", function () {
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

    showOk("✓ Mật khẩu là 4 số của ngày, tháng sinh của em nha babeee 💕");
  }
})();
