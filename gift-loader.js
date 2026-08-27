// =========================================================
//  gift-loader.js (type=module — bridge to script.js)
//  Galaxy Gift version — maintains the same public API:
//    window.__openGift / __closeGift / __breakGiftHeart
// =========================================================

import { mountGift3D } from "./gift3d.js";

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const giftView = $("giftView");
  let giftCanvas = $("giftCanvas");
  const giftHint = $("giftHint");
  const giftBackBtn = $("giftBackBtn");
  const galaxyLanding = $("galaxyLanding");
  const galaxyWishModal = $("galaxyWishModal");

  let instance = null;

  function getBridge() {
    return window.__giftApi || null;
  }
  function hideSecretAndLetter() {
    const b = getBridge();
    if (b && typeof b.closeLetterViewQuiet === "function") {
      try { b.closeLetterViewQuiet(); } catch (e) {}
    } else {
      const lv = b && typeof b.getLetterView === "function" && b.getLetterView();
      if (lv) lv.classList.add("hidden");
    }
    const sc = b && typeof b.getSecretContainer === "function" && b.getSecretContainer();
    if (sc) sc.classList.add("hidden");
  }
  function showSecretContainer() {
    const b = getBridge();
    const sc = b && typeof b.getSecretContainer === "function" && b.getSecretContainer();
    if (sc) sc.classList.remove("hidden");
  }
  function resetGalaxyDom() {
    if (galaxyLanding) galaxyLanding.classList.remove("hidden");
    if (galaxyWishModal) galaxyWishModal.classList.remove("active");
    if (giftHint) giftHint.classList.add("hidden");
  }

  // Three.js/WebGL renderer owns the canvas context. After destroy(),
  // create a fresh canvas before the next mount instead of reusing a
  // disposed/lost WebGL context. This makes Gift reliably reopenable.
  function replaceGiftCanvas() {
    if (!giftCanvas || !giftCanvas.parentNode) return giftCanvas;
    const freshCanvas = giftCanvas.cloneNode(false);
    giftCanvas.parentNode.replaceChild(freshCanvas, giftCanvas);
    giftCanvas = freshCanvas;
    return giftCanvas;
  }

  window.__openGift = function () {
    hideSecretAndLetter();
    resetGalaxyDom();
    if (giftView) giftView.classList.remove("hidden");

    if (instance) {
      try { instance.destroy && instance.destroy(); } catch (e) {}
      instance = null;
    }
    if (!giftCanvas) return;

    // Always mount on a fresh canvas after a previous destroy().
    replaceGiftCanvas();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          instance = mountGift3D(giftCanvas);
        } catch (e) {
          console.error("[gift-loader] mountGift3D failed:", e);
          if (giftHint) {
            giftHint.classList.remove("hidden");
            giftHint.textContent = "⚠ Lỗi khởi tạo Gift: " + (e && e.message ? e.message : String(e));
          }
        }
      });
    });
  };

  window.__closeGift = function () {
    if (instance) {
      try { instance.destroy && instance.destroy(); } catch (e) {}
      instance = null;
    }
    if (giftView) giftView.classList.add("hidden");
    resetGalaxyDom();
    showSecretContainer();
  };

  window.__breakGiftHeart = function () {
    if (instance && typeof instance.breakHeart === "function") {
      try { instance.breakHeart(); } catch (e) {}
    }
  };

  if (giftBackBtn) {
    giftBackBtn.addEventListener("click", () => {
      window.__closeGift();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!giftView || giftView.classList.contains("hidden")) return;
    if (galaxyWishModal && galaxyWishModal.classList.contains("active")) {
      if (e.key === "Escape") {
        galaxyWishModal.classList.remove("active");
      }
      return;
    }
    if (e.key === "Escape") {
      // script.js already calls closeGiftView; nothing extra needed
    }
  });
})();
