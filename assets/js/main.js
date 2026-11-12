/* ============================================================
   ACEBEAM — Main Script
   公共交互：数量控制 / 画廊切换 / 视图切换 / 回到顶部 /
   加入购物车反馈 / 购物车小计与汇总 / 结账模拟
   ============================================================ */
(function () {
  "use strict";

  var money = function (n) {
    return "$" + n.toFixed(2);
  };

  /* ---------- 0. 首页 Hero Swiper（Swiper 11.1.14） ---------- */
  var heroSwiperEl = document.getElementById("heroSwiper");
  if (heroSwiperEl && typeof Swiper !== "undefined") {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* Swiper 11：fade/crossFade、autoplay 改为对象式（含 pauseOnMouseEnter 内建悬停暂停）；
       pagination/navigation 改为对象式；移除手写 mouseenter/leave 与 onTouchStart/End。 */
    var heroSwiper = new Swiper(heroSwiperEl, {
      loop: true,
      speed: 700,
      effect: "fade",
      fadeEffect: { crossFade: true },
      autoplay: reduceMotion ? false : { delay: 33500, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      keyboard: { enabled: true }
    });

    /* Swiper 11 会给分页容器加 aria-hidden="true"，却又把每个灯泡设成
       tabindex="0" + role="button" + aria-label="Go to slide N"：键盘能聚焦、
       屏幕阅读器却读不到，属可聚焦内容被 aria-hidden 屏蔽（WCAG 4.1.2 / 1.3.1）。
       实测 Swiper 在切换与重排后都不会再把该属性加回，所以初始化后移除即可，
       并给容器补一个组标签，让三颗灯泡有一个可读的分组上下文。 */
    var heroPag = heroSwiperEl.querySelector(".swiper-pagination");
    if (heroPag) {
      heroPag.removeAttribute("aria-hidden");
      heroPag.setAttribute("role", "group");
      heroPag.setAttribute("aria-label", "Hero slides");
    }

    /* WCAG 2.2.2（暂停/停止/隐藏）：可见的暂停/播放钮 + 焦点进入英雄区即暂停，
       让键盘用户读文案时轮播不会自己切走。reduced-motion 下 autoplay 本就关闭，
       按钮保持 hidden；无 JS 时 Swiper 不初始化，同样没有自动播放。 */
    var autoplayToggle = document.querySelector(".hero-autoplay-toggle");
    var heroSection = heroSwiperEl.closest(".hero-slider");
    if (autoplayToggle && heroSection && !reduceMotion && heroSwiper.autoplay) {
      var userPaused = false, focusHeld = false;
      var syncAutoplay = function () {
        if (userPaused || focusHeld) heroSwiper.autoplay.stop();
        else heroSwiper.autoplay.start();
      };
      autoplayToggle.hidden = false;
      autoplayToggle.addEventListener("click", function () {
        userPaused = !userPaused;
        autoplayToggle.setAttribute("aria-pressed", userPaused ? "true" : "false");
        autoplayToggle.setAttribute("aria-label", userPaused ? "Play slide autoplay" : "Pause slide autoplay");
        syncAutoplay();
      });
      heroSection.addEventListener("focusin", function (e) {
        /* 焦点在暂停钮本身时不算「读内容」：否则点播放后焦点留在钮上，autoplay 起不来 */
        focusHeld = e.target !== autoplayToggle;
        syncAutoplay();
      });
      heroSection.addEventListener("focusout", function (e) {
        if (!heroSection.contains(e.relatedTarget)) { focusHeld = false; syncAutoplay(); }
      });
    }
  }

  /* ---------- 1. 数量控制（详情页 & 购物车页通用） ---------- */
  var QTY_MIN = 1, QTY_MAX = 99;
  var qtyControls = document.querySelectorAll("[data-qty]");
  qtyControls.forEach(function (ctl) {
    var minus = ctl.querySelector("[data-qty-minus]");
    var plus = ctl.querySelector("[data-qty-plus]");
    var input = ctl.querySelector(".qty-input");
    var item = ctl.closest(".cart-item");
    /* 下限认 input 自己的 min：套装行可以是 0（这一件不要），单买行仍是 1 */
    var floor = parseInt(input && input.getAttribute("min"), 10);
    if (Number.isNaN(floor)) floor = QTY_MIN;
    function val() {
      var v = parseInt(input.value, 10);
      return Number.isNaN(v) ? floor : v;
    }

    /* 到达上下限时禁用对应按钮，让步进器如实反馈"不能再减 / 再加" */
    function syncStepper() {
      if (!input) return;
      var v = val();
      if (minus) minus.disabled = v <= floor;
      if (plus) plus.disabled = v >= QTY_MAX;
    }

    function refresh() {
      syncStepper();
      if (!item) return;
      var qty = val();
      var unit = parseFloat(item.getAttribute("data-line-price")) || 0;
      var totalEl = item.querySelector(".ci-total");
      if (totalEl) totalEl.textContent = money(qty * unit);
      updateSummary();
    }

    if (minus && input) {
      minus.addEventListener("click", function () {
        var v = val();
        if (v > floor) { input.value = v - 1; refresh(); }
      });
    }
    if (plus && input) {
      plus.addEventListener("click", function () {
        var v = val();
        if (v < QTY_MAX) { input.value = v + 1; refresh(); }
      });
    }
    if (input) {
      input.addEventListener("change", function () {
        input.value = Math.max(floor, Math.min(QTY_MAX, val()));
        refresh();
      });
      /* 边输入边同步按钮态；不触发金额重算，避免打字中途数字跳动 */
      input.addEventListener("input", syncStepper);
    }

    syncStepper();
  });

  /* ---------- 2. 结账账本：Sub-Total / 折扣 / 运费 / Total ----------
     价格与运费口径只认 assets/js/products.js。静态 HTML 里的数字是同一张表的
     快照：禁用 JS 时页面照样正确，启用 JS 时随数量、运费方式与优惠券实时重算。 */
  var ACE = window.ACEBEAM || null;
  /* 演示态存储键：只在需要写入的这几处用到，集中在这里定义 */
  var KEYS = {
    cartCount: "acebeam_cart_count",
    coupon: "acebeam_coupon",
    ship: "acebeam_ship",
    view: "acebeam_view",
    wishlist: "acebeam_wishlist"
  };
  var SHIP = (ACE && ACE.shipping) || {
    standard: { label: "Standard Tracked", eta: "3–6 working days", fee: 0, freeOver: 49 },
    express: { label: "Express", eta: "2–3 working days", fee: 18, freeOver: null }
  };
  var COUPONS = { ACEBEAM10: 0.9 };

  function storeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function storeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  var coupon = { code: null, rate: 1 };
  var savedCoupon = (storeGet(KEYS.coupon) || "").toUpperCase();
  if (COUPONS[savedCoupon]) coupon = { code: savedCoupon, rate: COUPONS[savedCoupon] };

  function chosenShipping() {
    /* 购物车页没有运费选择器，汇总只按标准运费估算；
       结账各步才采纳用户选择（含上一步用 localStorage 带过来的方式）。 */
    if (document.querySelector(".cart-item[data-line-price]")) return "standard";
    var radio = document.querySelector('input[name="coShip"]:checked');
    if (radio) return radio.value === "express" ? "express" : "standard";
    return storeGet(KEYS.ship) === "express" ? "express" : "standard";
  }

  function cartLines() {
    var lines = [];
    document.querySelectorAll(".cart-item[data-line-price]").forEach(function (item) {
      var input = item.querySelector(".qty-input");
      lines.push({
        unit: parseFloat(item.getAttribute("data-line-price")) || 0,
        qty: input ? (parseInt(input.value, 10) || 1) : 1
      });
    });
    document.querySelectorAll("[data-cart-line]").forEach(function (li) {
      var p = ACE ? ACE.bySlug(li.getAttribute("data-cart-line")) : null;
      if (!p || p.price == null) return;
      lines.push({
        amountEl: li.querySelector("[data-line-amount]"),
        unit: p.price,
        qty: parseInt(li.getAttribute("data-qty"), 10) || 1
      });
    });
    return lines;
  }

  function updateSummary() {
    var cells = document.querySelectorAll("[data-total]");
    if (!cells.length) return;
    /* products.js 没加载成功时保留静态数字，不要把汇总清零 */
    if (!ACE && document.querySelector("[data-cart-line]")) return;
    var sub = 0;
    cartLines().forEach(function (line) {
      var amount = line.unit * line.qty;
      if (line.amountEl) line.amountEl.textContent = money(amount);
      sub += amount;
    });
    var discount = sub * (1 - coupon.rate);
    var net = sub - discount;
    var method = SHIP[chosenShipping()] || SHIP.standard;
    var shipping = method.fee || (net >= method.freeOver ? 0 : null);
    var shippingText = shipping == null ? "Calculated at checkout" : (shipping ? money(shipping) : "Free");

    var etaEl = document.querySelector(".ship-eta");
    if (etaEl) etaEl.textContent = method.label;
    var recapLabel = document.querySelector("[data-ship-label]");
    var recapNote = document.querySelector("[data-ship-note]");
    if (recapLabel) recapLabel.textContent = method.label;
    if (recapNote) recapNote.textContent = method.eta + " · " + shippingText;

    cells.forEach(function (cell) {
      var kind = cell.getAttribute("data-total");
      var row = cell.closest("[data-total-row]");
      if (kind === "sub") {
        cell.textContent = money(sub);
      } else if (kind === "discount") {
        cell.textContent = "−" + money(discount);
        if (row) row.hidden = discount <= 0;
        var codeEl = row ? row.querySelector(".coupon-code") : null;
        if (codeEl) codeEl.textContent = coupon.code ? "(" + coupon.code + ")" : "";
      } else if (kind === "shipping") {
        cell.textContent = shipping == null ? "Calculated at checkout" : money(shipping);
        cell.classList.toggle("text-success", shipping === 0);
      } else if (kind === "tax") {
        cell.textContent = money(0);
      } else if (kind === "total") {
        cell.textContent = money(net + (shipping == null ? 0 : shipping));
      }
    });
  }

  /* ---------- 3. 购物车角标 ---------- */
  function syncCartCount() {
    var badge = document.getElementById("cartCount");
    if (!badge) return;
    var count = document.querySelectorAll(".cart-item").length;
    var stored = parseInt(storeGet(KEYS.cartCount), 10);
    if (!isNaN(stored) && document.querySelectorAll(".cart-item").length === 0) {
      badge.textContent = stored;
    } else if (count > 0) {
      badge.textContent = count;
    }
  }

  /* ---------- 4. 详情页：画廊缩略图切换 ---------- */
  var thumbs = document.querySelectorAll(".gallery-thumbs .thumb");
  var mainImg = document.getElementById("mainImage");
  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      thumbs.forEach(function (t) { t.classList.remove("active"); });
      thumb.classList.add("active");
      if (mainImg) {
        var src = thumb.getAttribute("data-img");
        if (src) {
          mainImg.style.opacity = "0";
          setTimeout(function () {
            mainImg.src = src;
            mainImg.alt = "Acebeam P20 Mini — " + (thumb.getAttribute("aria-label") || "product view");
            mainImg.style.opacity = "1";
          }, 140);
        }
      }
    });
  });

  /* ---------- 5. 详情页：选项 pill ---------- */
  document.querySelectorAll(".option-pill").forEach(function (pill) {
    pill.addEventListener("click", function () {
      var group = pill.closest(".option-list");
      group.querySelectorAll(".option-pill").forEach(function (p) { p.classList.remove("active"); });
      pill.classList.add("active");
    });
  });

  /* ---------- 6. 详情页：数量变化时的库存提示（演示） ---------- */
  var stockHint = document.getElementById("stockHint");
  if (stockHint) {
    var stock = 38;
    var qtyBox = document.querySelector("[data-qty]");
    if (qtyBox) {
      var onQty = function () {
        var v = parseInt(qtyBox.querySelector(".qty-input").value, 10) || 1;
        stockHint.textContent = stock >= v ? (stock - v + 1) + " left in stock" : "Only " + stock + " in stock";
      };
      qtyBox.querySelectorAll(".qty-btn").forEach(function (b) { b.addEventListener("click", onQty); });
      qtyBox.querySelector(".qty-input").addEventListener("change", onQty);
    }
  }

  /* ---------- 7. 详情页：加购 / 立即购买（toast 反馈） ---------- */
  function makeToast(title, message) {
    var wrap = document.querySelector(".toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "toast-wrap position-fixed bottom-0 end-0 p-3";
      wrap.style.zIndex = "1080";
      document.body.appendChild(wrap);
    }
    var id = "toast-" + Date.now();
    var el = document.createElement("div");
    el.className = "toast align-items-center border-0 shadow show";
    el.id = id;
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-atomic", "true");
    el.innerHTML =
      '<div class="d-flex"><div class="toast-body">' +
      "<strong>" + title + "</strong><br><small>" + message + "</small>" +
      '</div><button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>';
    wrap.appendChild(el);
    setTimeout(function () {
      el.classList.remove("show");
      setTimeout(function () { el.remove(); }, 300);
    }, 3200);
    var close = el.querySelector(".btn-close");
    if (close) {
      close.addEventListener("click", function () {
        el.classList.remove("show");
        setTimeout(function () { el.remove(); }, 300);
      });
    }
  }

  var addBtn = document.getElementById("addToCartBtn");
  if (addBtn) {
    addBtn.addEventListener("click", function () {
      bumpCartBadge(1);
      makeToast("Added to cart", "P20 Mini Long Distance Tactical Flashlight");
    });
  }
  var buyBtn = document.getElementById("buyNowBtn");
  if (buyBtn) {
    buyBtn.addEventListener("click", function () {
      bumpCartBadge(1);
      window.location.href = "checkout.html";
    });
  }

  /* ---------- 8. 购物车：移除条目 ---------- */
  document.querySelectorAll(".ci-remove").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".cart-item");
      if (item) {
        item.style.transition = "opacity .25s ease, transform .25s ease";
        item.style.opacity = "0";
        item.style.transform = "translateX(24px)";
        setTimeout(function () {
          item.remove();
          updateSummary();
          var badge = document.getElementById("cartCount");
          if (badge) {
            var n = parseInt(badge.textContent, 10) || 0;
            badge.textContent = Math.max(0, n - 1);
          }
          makeToast("Removed", "Item removed from your cart");
        }, 250);
      }
    });
  });

  /* ---------- 9. 购物车：优惠券（演示，跨步骤保留） ---------- */
  var couponForm = document.querySelector(".coupon-form");
  if (couponForm) {
    var couponInput = document.getElementById("couponInput");
    if (couponInput && coupon.code) couponInput.value = coupon.code;
    couponForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var code = couponInput ? couponInput.value.trim().toUpperCase() : "";
      if (COUPONS[code]) {
        coupon = { code: code, rate: COUPONS[code] };
        storeSet(KEYS.coupon, code);
        updateSummary();
        makeToast("Coupon applied", code + " — " + Math.round((1 - COUPONS[code]) * 100) + "% off your order");
      } else {
        coupon = { code: null, rate: 1 };
        storeSet(KEYS.coupon, "");
        updateSummary();
        makeToast(code ? "Invalid coupon" : "Coupon cleared",
          code ? "Please check the code and try again" : "Order summary updated");
      }
    });
  }

  /* ---------- 10. 购物车：结账（校验条款后进入结账页） ---------- */
  var checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      var terms = document.getElementById("termsBox");
      if (terms && !terms.checked) {
        makeToast("Please confirm", "Accept the Terms & Conditions to continue");
        terms.closest(".terms-check").style.color = "var(--ac-red)";
        terms.focus();
        return;
      }
      makeToast("Redirecting…", "Taking you to checkout");
      setTimeout(function () { window.location.href = "checkout.html"; }, 450);
    });
  }

  /* ---------- 11. 分类/商品页：视图切换（记忆到 localStorage） ---------- */
  var viewBtns = document.querySelectorAll(".view-switch .btn");
  var productsView = document.getElementById("productsGrid") || document.querySelector(".products-view");

  function applyView(view) {
    if (!productsView) return;
    productsView.classList.toggle("list-view", view === "list");
    viewBtns.forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-view") === view);
    });
  }

  viewBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var view = btn.getAttribute("data-view") === "list" ? "list" : "grid";
      applyView(view);
      storeSet(KEYS.view, view);
    });
  });

  if (viewBtns.length) {
    var savedView = "grid";
    savedView = storeGet(KEYS.view) || "grid";
    applyView(savedView);
  }

  /* ---------- 12. 回到顶部 ---------- */
  var topBtn = document.querySelector(".back-to-top");
  if (topBtn) {
    var onScroll = function () {
      if (window.scrollY > 480) {
        topBtn.classList.add("show");
      } else {
        topBtn.classList.remove("show");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    topBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- 13. 页脚新闻订阅（演示） ---------- */
  document.querySelectorAll(".newsletter-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.querySelector('input[type="email"]');
      if (email && email.value) {
        makeToast("Subscribed!", "Thanks — watch your inbox for offers");
        email.value = "";
      }
    });
  });

  /* ---------- 14. 滚动进场动画已移除 ----------
     DESIGN.md Motion 只允许一次编排好的 Hero 入场；逐节 fade-up 属默认 AI 腔，
     且会让内容在 JS 失败时不可见。内容现在默认可见，不再依赖 observer。 */

  /* ---------- 15. 购物车角标（跨页累计） ---------- */
  function bumpCartBadge(n) {
    var badge = document.getElementById("cartCount");
    var cur = badge ? (parseInt(badge.textContent, 10) || 0) : 0;
    try {
      var stored = parseInt(storeGet(KEYS.cartCount), 10);
      cur = isNaN(stored) ? cur : stored;
    } catch (e) {}
    var next = Math.max(0, cur + n);
    if (badge) badge.textContent = next;
    storeSet(KEYS.cartCount, next);
  }

  /* ---------- 16. 详情页：收藏与分享 ---------- */
  var WL_KEY = KEYS.wishlist;
  function readWishlist() {
    try { return JSON.parse(localStorage.getItem(WL_KEY)) || []; } catch (e) { return []; }
  }
  function writeWishlist(list) {
    try { localStorage.setItem(WL_KEY, JSON.stringify(list)); } catch (e) {}
  }

  var wlBtn = document.getElementById("wishlistBtn");
  if (wlBtn) {
    var ogMeta = document.querySelector('meta[property="og:title"]');
    var wlName = (ogMeta && ogMeta.content ? ogMeta.content : document.title).trim();
    var wlLabel = wlBtn.querySelector(".wl-label");
    function paintWishBtn(saved) {
      wlBtn.setAttribute("aria-pressed", saved ? "true" : "false");
      if (wlLabel) wlLabel.textContent = saved ? "Saved in Wishlist" : "Add to Wishlist";
    }
    paintWishBtn(readWishlist().indexOf(wlName) > -1);
    wlBtn.addEventListener("click", function () {
      var list = readWishlist(), i = list.indexOf(wlName);
      if (i > -1) {
        list.splice(i, 1);
        writeWishlist(list);
        paintWishBtn(false);
        makeToast("Removed from wishlist", wlName);
      } else {
        list.push(wlName);
        writeWishlist(list);
        paintWishBtn(true);
        makeToast("Saved to wishlist", wlName);
      }
    });
  }

  document.querySelectorAll("#shareBtn, [data-share]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      /* 分享出去的必须是每页 <link rel="canonical"> 声明的正式地址；
         本地预览时 location.href 是 127.0.0.1，复制出去对别人没有意义。 */
      var canonical = document.querySelector('link[rel="canonical"]');
      var url = (canonical && canonical.href) || window.location.href;
      var title = document.title;
      if (navigator.share) {
        navigator.share({ title: title, url: url }).catch(function () {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(
          function () { makeToast("Link copied", url); },
          function () { makeToast("Clipboard unavailable", "Select the address bar link and copy it manually — " + url); }
        );
      } else {
        makeToast("Share this link", url);
      }
    });
  });

  /* ---------- 17. 心愿清单页：加购 / 移除 / 清空 ---------- */
  var wishRows = document.querySelectorAll(".wish-row");
  if (wishRows.length) {
    var wishDesc = document.querySelector(".panel-desc");
    var wishPanel = document.querySelector(".panel");

    function wishRowName(row) {
      var a = row.querySelector(".wish-name a");
      return a ? a.textContent.trim() : "This item";
    }
    function syncWishlistCount() {
      var n = document.querySelectorAll(".wish-row").length;
      if (wishDesc) {
        wishDesc.textContent = n + (n === 1 ? " light saved" : " lights saved") +
          " · prices update automatically";
      }
      if (!n && wishPanel && !wishPanel.querySelector(".wish-empty")) {
        var empty = document.createElement("p");
        empty.className = "wish-empty panel-desc mb-0";
        empty.innerHTML = 'Your wishlist is empty — <a class="link-strong" href="all-products.html">browse the catalogue</a>.';
        wishPanel.appendChild(empty);
      }
    }
    function fadeOutRow(row, after) {
      row.style.transition = "opacity .25s ease, transform .25s ease";
      row.style.opacity = "0";
      row.style.transform = "translateX(24px)";
      setTimeout(function () { row.remove(); if (after) after(); }, 250);
    }

    document.querySelectorAll("[data-wl-add]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        bumpCartBadge(1);
        makeToast("Added to cart", wishRowName(btn.closest(".wish-row")));
      });
    });
    document.querySelectorAll("[data-wl-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var name = wishRowName(btn.closest(".wish-row"));
        fadeOutRow(btn.closest(".wish-row"), syncWishlistCount);
        makeToast("Removed", name + " removed from your wishlist");
      });
    });
    var wlAddAll = document.querySelector("[data-wl-add-all]");
    if (wlAddAll) {
      wlAddAll.addEventListener("click", function () {
        var n = document.querySelectorAll(".wish-row").length;
        if (!n) { makeToast("Nothing to add", "Your wishlist is empty"); return; }
        bumpCartBadge(n);
        makeToast("Added to cart", n + (n === 1 ? " saved light" : " saved lights") + " are now in your cart");
      });
    }
    var wlClear = document.querySelector("[data-wl-clear]");
    if (wlClear) {
      wlClear.addEventListener("click", function () {
        var n = document.querySelectorAll(".wish-row").length;
        document.querySelectorAll(".wish-row").forEach(function (row) { row.remove(); });
        syncWishlistCount();
        makeToast("Wishlist cleared", n + " items removed");
      });
    }
  }

  /* ---------- 18. 对比页 / 到货提醒页：清空与移除 ---------- */
  function tableEmptyState(tbody) {
    if (!tbody || tbody.querySelector("tr")) return;
    var table = tbody.closest("table");
    var cols = table ? table.querySelectorAll("thead th").length : 0;
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.setAttribute("colspan", cols || 1);
    td.innerHTML = 'Nothing here right now — <a class="link-strong" href="all-products.html">browse the catalogue</a>.';
    tr.appendChild(td);
    tbody.appendChild(tr);
  }

  var compareClear = document.querySelector("[data-compare-clear]");
  if (compareClear) {
    compareClear.addEventListener("click", function () {
      var wrap = document.querySelector(".data-table-wrap");
      if (wrap) wrap.style.display = "none";
      var desc = document.querySelector(".panel-desc");
      if (desc) desc.textContent = "0 lights currently in your compare list.";
      if (!compareClear.closest(".panel").querySelector(".compare-empty")) {
        var empty = document.createElement("p");
        empty.className = "compare-empty panel-desc mb-0";
        empty.innerHTML = 'Your compare list is empty — <a class="link-strong" href="all-products.html">pick two lights to compare</a>.';
        compareClear.closest(".panel").appendChild(empty);
      }
      makeToast("Compare list cleared", "Add products again from any product page");
    });
  }

  document.querySelectorAll("[data-bis-remove]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var row = link.closest("tr");
      var nameEl = row ? row.querySelector(".link-strong") : null;
      var name = nameEl ? nameEl.textContent.trim() : "This alert";
      if (row) {
        var tbody = row.parentNode;
        row.style.transition = "opacity .2s ease";
        row.style.opacity = "0";
        setTimeout(function () { row.remove(); tableEmptyState(tbody); }, 200);
      }
      makeToast("Alert removed", "You will no longer be notified about " + name);
    });
  });

  /* ---------- 19. 结账：提交时不把表单值写进 URL ----------
     静态演示没有后端，原生 method="get" 会把地址与卡号拼进查询串，故拦截提交后
     再按各步自己的 action 前进；浏览器原生的 required 校验仍先生效。 */
  var checkoutForm = document.querySelector("form.checkout-layout");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var next = checkoutForm.getAttribute("action") || "checkout-completed.html";
      var last = next.indexOf("completed") > -1;
      makeToast(last ? "Order placed" : "Saved",
        last ? "Taking you to the confirmation" : "Continuing to the next step");
      setTimeout(function () { window.location.href = next; }, 450);
    });
  }

  /* ---------- 19b. 结账：账单地址从地址簿选，新增地址落回列表并选中 ----------
     静态演示没有后端：新增走页内 Modal，保存后插到列表末尾、勾选并同步隐藏字段，
     这样无 JS 时仍能提交（首条地址已写进 hidden input 的 value）。 */
  (function billingAddress() {
    var list = document.querySelector("[data-addr-list]");
    if (!list) return;

    var map = {
      coFirst: "first", coLast: "last", coEmail: "email", coCountry: "country",
      coCity: "city", coZip: "zip", coAddr: "street", coPhone: "phone"
    };
    var form = document.querySelector("[data-addr-form]");
    var tpl = document.getElementById("addrChoiceTpl");
    var modalEl = document.getElementById("addrModal");
    var modal = modalEl && window.bootstrap ? new bootstrap.Modal(modalEl) : null;
    var pendingChoice = null;

    function sync(choice) {
      if (!choice) return;
      Object.keys(map).forEach(function (id) {
        var field = document.getElementById(id);
        if (field) field.value = choice.getAttribute("data-" + map[id]) || "";
      });
    }

    var selected = list.querySelector('input[name="coAddress"]:checked');
    if (!selected) {
      selected = list.querySelector('input[name="coAddress"]');
      if (selected) selected.checked = true;
    }
    if (selected) sync(selected.closest(".addr-choice"));

    list.addEventListener("change", function (e) {
      if (e.target.name === "coAddress") sync(e.target.closest(".addr-choice"));
    });

    /* 方形 Add 按钮高度对齐地址卡：量首条卡片（= 网格首行高度）写进 CSS 变量，
       这样地址多于一行时按钮不会跟着拉成整列。 */
    var picker = list.closest(".addr-picker");
    function sizeAddButton() {
      var first = list.querySelector(".addr-choice");
      if (picker && first) picker.style.setProperty("--addr-card-h", first.offsetHeight + "px");
    }
    sizeAddButton();
    var firstCard = list.querySelector(".addr-choice");
    if (window.ResizeObserver && firstCard) {
      new ResizeObserver(sizeAddButton).observe(firstCard);
    }

    if (!form || !tpl || !modal) return;

    modalEl.addEventListener("shown.bs.modal", function () {
      var first = form.querySelector("input, select");
      if (first) first.focus();
    });

    modalEl.addEventListener("hidden.bs.modal", function () {
      if (!pendingChoice) return;
      pendingChoice.scrollIntoView({ block: "nearest", behavior: "instant" });
      pendingChoice = null;
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var read = function (name) {
        return form.elements[name] ? form.elements[name].value.trim() : "";
      };
      var data = {
        first: read("addrFirst"),
        last: read("addrLast"),
        email: read("addrEmail"),
        country: read("addrCountry"),
        city: read("addrCity"),
        zip: read("addrZip"),
        street: read("addrStreet"),
        phone: read("addrPhone")
      };

      var choice = tpl.content.firstElementChild.cloneNode(true);
      var radio = choice.querySelector('input[name="coAddress"]');
      Object.keys(data).forEach(function (key) {
        choice.setAttribute("data-" + key, data[key]);
      });
      radio.value = "addr-" + Date.now();
      choice.querySelector("[data-addr-name]").textContent = data.first + " " + data.last;
      choice.querySelector("[data-addr-line]").textContent =
        data.street + ", " + data.city + " " + data.zip + ", " + data.country;
      choice.querySelector("[data-addr-phone]").textContent = data.phone;

      list.appendChild(choice);
      sizeAddButton();
      radio.checked = true;
      sync(choice);
      form.reset();
      pendingChoice = choice;
      /* 焦点先移出弹窗：Bootstrap 在 hide 瞬间给容器挂 aria-hidden，
         焦点留在里面会让 Chrome 拦下 aria-hidden 并告警。 */
      if (document.activeElement && modalEl.contains(document.activeElement)) {
        document.activeElement.blur();
      }
      modal.hide();
      makeToast("Address saved", data.first + " " + data.last + " is now selected for this order.");
    });
  })();

  /* ---------- 20. 对比页：规格行由 products.js 单点渲染 ----------
     <td> 里已写好同一组数值（禁用 JS 也能读），这里只把表格拉回数据源口径：
     数据源没有声明的字段显示 "—"，而不是留着别处复制来的错数字。 */
  function compareValue(p, attr) {
    if (attr === "price") return p.price == null ? "—" : money(p.price);
    if (attr === "lumens") return p.lumens == null ? "—" : ACE.num(p.lumens) + " lumens";
    if (attr === "meters") return p.meters == null ? "—" : ACE.num(p.meters) + " m";
    if (attr === "candela") return p.candela == null ? "—" : ACE.num(p.candela) + " cd";
    return p[attr] || "—";
  }

  document.querySelectorAll("[data-compare]").forEach(function (table) {
    if (!ACE) return;
    var slugs = table.getAttribute("data-compare").split(",");
    table.querySelectorAll("tbody tr[data-attr]").forEach(function (row) {
      var attr = row.getAttribute("data-attr");
      row.querySelectorAll("td").forEach(function (td, i) {
        var p = ACE.bySlug((slugs[i] || "").trim());
        if (!p) return;
        (td.querySelector("strong") || td).textContent = compareValue(p, attr);
      });
    });
  });

  /* ---------- 21. 结账：运费方式一改即重算，并带到后续步骤 ---------- */
  document.querySelectorAll('input[name="coShip"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      storeSet(KEYS.ship, radio.value);
      updateSummary();
    });
  });
  if (storeGet(KEYS.ship) === "express") {
    var preselectedExpress = document.querySelector('input[name="coShip"][value="express"]');
    if (preselectedExpress) preselectedExpress.checked = true;
  }

  /* ---------- 22. 详情页：详情区块改为常显后，无需再驱动 tab ----------
     原先这里是 data-tab-jump → bootstrap.Tab 的跳转桥接：当时「3 Reviews」要激活
     #reviewsPane 这个 tab-pane。现在 5 个区块已改成常显堆叠（见 product-detail.html
     顶部注释），「3 Reviews」是普通锚点 #reviewsPane，浏览器原生滚动即可，
     该桥接已无消费者，故移除（保留会变成死代码）。 */

  /* ---------- 23. 货架页：计数 / 价格分面 / 排序 / ?q= 全部以真实卡片算出 ----------
     原先侧栏价格分面与「6 results」「1–12 of 107」都是写死的装饰，点了没反应。
     事实来源是 DOM 里的 .product-card（价格口径已由 B3 对齐 products.js），
     所以这里只读不造，零构建依赖。无 JS 时整页照常可读，只是分面不可点。 */
  (function shelf() {
    var grid = document.querySelector("[data-shelf]");
    if (!grid) return;
    var items = Array.prototype.slice.call(grid.children);
    var countEl = document.querySelector("[data-shelf-count]");
    var facets = document.querySelector("[data-price-facets]");
    var termEl = document.querySelector("[data-search-term]");
    var total = items.length;

    function priceOf(col) {
      var el = col.querySelector(".prod-price");
      return el ? parseFloat(el.textContent.replace(/[^0-9.]/g, "")) || 0 : 0;
    }
    function nameOf(col) {
      var el = col.querySelector(".prod-name");
      return el ? el.textContent.trim().toLowerCase() : "";
    }

    var q = (new URLSearchParams(window.location.search).get("q") || "").trim().toLowerCase();
    if (q) {
      /* 页面上可能有多个搜索框（导航内 + 主搜索区），全部同步，避免看起来没接住查询词 */
      document.querySelectorAll('input[name="q"]').forEach(function (box) { box.value = q; });
    }

    function matchesQuery(col) { return !q || nameOf(col).indexOf(q) > -1; }
    var activeFacet = null;

    /* 活动筛选条：插在工具栏之后，随查询词 / 价格档位出现 */
    var filterBar = document.createElement("div");
    filterBar.className = "active-filters";
    filterBar.hidden = true;
    filterBar.setAttribute("aria-label", "Active filters");
    var toolbar = document.querySelector(".list-toolbar");
    if (toolbar && toolbar.parentNode) toolbar.parentNode.insertBefore(filterBar, toolbar.nextSibling);

    function removeFacet() {
      if (facets) {
        Array.prototype.forEach.call(facets.querySelectorAll(".active"), function (a) {
          a.classList.remove("active");
          a.removeAttribute("aria-current");
        });
      }
      activeFacet = null;
      paint();
    }
    function removeQuery() {
      q = "";
      document.querySelectorAll('input[name="q"]').forEach(function (box) { box.value = ""; });
      if (window.history && history.replaceState) {
        var url = new URL(window.location.href);
        url.searchParams.delete("q");
        history.replaceState(null, "", url.pathname + url.search + url.hash);
      }
      paint();
    }
    function chip(label, onClear) {
      var wrap = document.createElement("span");
      wrap.className = "filter-chip";
      var text = document.createElement("span");
      text.textContent = label;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "Clear filter: " + label);
      btn.textContent = "×";
      btn.addEventListener("click", onClear);
      wrap.appendChild(text);
      wrap.appendChild(btn);
      return wrap;
    }
    function renderFilterChips() {
      filterBar.innerHTML = "";
      var any = false;
      if (q) {
        filterBar.appendChild(chip("Search: “" + q + "”", removeQuery));
        any = true;
      }
      if (activeFacet && activeFacet.link) {
        var label = activeFacet.link.textContent.replace(/\(\d+\)/g, "").trim();
        filterBar.appendChild(chip("Price: " + label, removeFacet));
        any = true;
      }
      filterBar.hidden = !any;
      if (any) {
        var tag = document.createElement("span");
        tag.className = "af-label";
        tag.textContent = "Filtered by";
        filterBar.insertBefore(tag, filterBar.firstChild);
      }
    }
    function matches(col) {
      if (!matchesQuery(col)) return false;
      if (!activeFacet) return true;
      var p = priceOf(col), min = activeFacet.min, max = activeFacet.max;
      return (min == null || p >= min) && (max == null || p < max);
    }
    function paint() {
      var shown = 0;
      items.forEach(function (col) {
        var ok = matches(col);
        col.classList.toggle("d-none", !ok);
        if (ok) shown++;
      });
      if (countEl) {
        if (termEl) {
          /* 搜索页的整句由真实查询词与真实命中数重写，避免「Results for X」留着
             上一个查询词。静态无 JS 时页面写的是「Showing all 6 demo results」。 */
          countEl.textContent = q ? "Results for “" + q + "”: " : "Showing all ";
          var hit = document.createElement("b");
          hit.textContent = shown;
          countEl.appendChild(hit);
          if (!q) countEl.appendChild(document.createTextNode(" demo results"));
        } else {
          /* 货架页把数字放在 <b> 里：只换数字，不动句子（107 是另一口径） */
          var numEl = countEl.querySelector("b") || countEl.querySelector("strong");
          if (numEl) numEl.textContent = shown;
          else countEl.textContent = "Showing " + shown + " of " + total + " lights";
        }
      }
      var empty = grid.querySelector(".shelf-empty");
      if (!shown && !empty) {
        empty = document.createElement("p");
        empty.className = "shelf-empty";
        empty.textContent = "No light in this band — click the highlighted price band again to clear the filter.";
        grid.appendChild(empty);
      } else if (shown && empty) {
        empty.remove();
      }
      renderFilterChips();
    }

    if (facets) {
      Array.prototype.forEach.call(facets.querySelectorAll("[data-price-min],[data-price-max]"), function (link) {
        var cnt = link.querySelector(".cnt");
        var min = link.hasAttribute("data-price-min") ? parseFloat(link.getAttribute("data-price-min")) : null;
        var max = link.hasAttribute("data-price-max") ? parseFloat(link.getAttribute("data-price-max")) : null;
        /* 分面计数跟随查询词，但不跟随自己（否则点一个档位会把别的档位全变成 0/1） */
        var n = items.filter(function (col) {
          var p = priceOf(col);
          return matchesQuery(col) && (min == null || p >= min) && (max == null || p < max);
        }).length;
        if (cnt) cnt.textContent = "(" + n + ")";
        /* 零计数档位：不是可点的筛选，别让它看起来像（空态即真话） */
        var off = n === 0 && !activeFacet;
        link.classList.toggle("facet-off", off);
        if (off) link.setAttribute("aria-disabled", "true");
        else link.removeAttribute("aria-disabled");
        link.addEventListener("click", function (e) {
          e.preventDefault();
          if (link.getAttribute("aria-disabled") === "true") return;
          var same = activeFacet && activeFacet.link === link;
          activeFacet = same ? null : { link: link, min: min, max: max };
          Array.prototype.forEach.call(facets.querySelectorAll(".active"), function (a) {
            a.classList.remove("active");
            a.removeAttribute("aria-current");
          });
          if (activeFacet) {
            link.classList.add("active");
            link.setAttribute("aria-current", "true");
          }
          paint();
        });
      });
    }

    /* 排序：写死的 select 变成真的重排 DOM */
    [["#sortSelect", "Created on"], ["#sortSel", "Position"]].forEach(function (pair) {
      var sel = document.querySelector(pair[0]);
      if (!sel) return;
      sel.addEventListener("change", function () {
        var mode = sel.value || sel.options[sel.selectedIndex].text;
        var sorted = items.slice();
        if (/Low to High/i.test(mode)) sorted.sort(function (a, b) { return priceOf(a) - priceOf(b); });
        else if (/High to Low/i.test(mode)) sorted.sort(function (a, b) { return priceOf(b) - priceOf(a); });
        else if (/A to Z/i.test(mode)) sorted.sort(function (a, b) { return nameOf(a).localeCompare(nameOf(b)); });
        else if (/Z to A/i.test(mode)) sorted.sort(function (a, b) { return nameOf(b).localeCompare(nameOf(a)); });
        if (mode !== pair[1]) sorted.forEach(function (col) { grid.appendChild(col); });
        else items.forEach(function (col) { grid.appendChild(col); });
        paint();
      });
    });

    paint();
  })();

  /* ---------- 24. 发货页：复制运单号（演示数据没有真实承运商查询页） ---------- */
  /* 剪贴板 API 只在安全上下文 + 真实用户手势下可用；file:// 或局域网 http:// 预览时
     会走下面两个分支，所以提示必须给出可执行的下一步，而不是只说“失败了”。 */
  var COPY_FALLBACK = "Select the tracking number on the page and press Ctrl+C (Cmd+C on macOS).";
  document.querySelectorAll("[data-copy-track]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.getAttribute("data-copy-track");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(
          function () { makeToast("Tracking number copied", value); },
          function () { makeToast("Clipboard unavailable", COPY_FALLBACK); }
        );
      } else {
        makeToast("Tracking number " + value, COPY_FALLBACK);
      }
    });
  });

  /* ---------- 25. 套装页：合计随数量重算，两个按钮真的按当前选择结算 ---------- */
  var kitControls = document.querySelectorAll(".qty-control[data-price]");
  if (kitControls.length) {
    var kitTotal = document.querySelector("[data-kit-total]");
    var kitLines = document.querySelector("[data-kit-lines]");
    function kitUnits() {
      var sum = 0, units = 0;
      kitControls.forEach(function (ctl) {
        var price = parseFloat(ctl.getAttribute("data-price")) || 0;
        var input = ctl.querySelector(".qty-input");
        var n = input ? Math.max(0, parseInt(input.value, 10) || 0) : 0;
        sum += price * n; units += n;
      });
      return { sum: sum, units: units };
    }
    function paintKit() {
      var r = kitUnits();
      if (kitTotal) kitTotal.textContent = money(r.sum);
      if (kitLines) kitLines.textContent = String(r.units);
    }
    kitControls.forEach(function (ctl) {
      var input = ctl.querySelector(".qty-input");
      if (input) input.addEventListener("change", paintKit);
      /* 这里的监听器晚于第 2 节步进器注册，所以点完已经拿到新 value，无需延时 */
      Array.prototype.forEach.call(ctl.querySelectorAll(".qty-btn"), function (btn) {
        btn.addEventListener("click", paintKit);
      });
    });
    var kitAdd = document.querySelector("[data-kit-add]");
    if (kitAdd) {
      kitAdd.addEventListener("click", function () {
        var r = kitUnits();
        if (!r.units) { makeToast("Nothing selected", "Set a quantity above zero to add the kit"); return; }
        bumpCartBadge(r.units);
        makeToast("Added to cart", r.units + (r.units === 1 ? " item" : " items") +
          " from the P20 Mini Tactical Kit · " + money(r.sum));
      });
    }
    var kitWish = document.querySelector("[data-kit-wishlist]");
    if (kitWish) {
      kitWish.addEventListener("click", function () { makeToast("Added to wishlist", "P20 Mini Tactical Kit"); });
    }
    paintKit();
  }

  /* ---------- 25. 射程标尺：把 meters 画成物理量（DESIGN.md 差异化方向落地） ----------
     渐进增强：读取每处 .prod-spec 里已有的 Meters 数值（数据仍以文本为准，
     标尺是纯视觉层 aria-hidden，不复制数据、不改 check-data-source 的对账口径）。
     比例基准 = 当前文档内出现的最大射程，同页卡片可横向比较。 */
  (function () {
    var meterRe = /meters/i;
    var rows = [];
    document.querySelectorAll(".prod-spec").forEach(function (spec) {
      var segs = spec.querySelectorAll(".spec-seg");
      Array.prototype.forEach.call(segs, function (seg) {
        var label = seg.textContent || "";
        var b = seg.querySelector("b");
        if (!b || !meterRe.test(label)) return;
        var m = parseFloat(b.textContent.replace(/[^0-9.]/g, ""));
        if (m > 0) rows.push({ spec: spec, m: m });
      });
    });
    if (!rows.length) return;
    var max = 0;
    rows.forEach(function (r) { if (r.m > max) max = r.m; });
    rows.forEach(function (r) {
      var bar = document.createElement("span");
      bar.className = "range-scale";
      bar.setAttribute("aria-hidden", "true");
      var fill = document.createElement("span");
      fill.className = "range-scale-fill";
      fill.style.width = Math.max(4, Math.round((r.m / max) * 100)) + "%";
      bar.appendChild(fill);
      r.spec.appendChild(bar);
    });
  })();

  /* ---------- 26. 全站表单：品牌化校验态 ----------
     151 个 required 原先只有浏览器气泡，页面 0 个 .invalid-feedback。
     这里统一：novalidate + 自绘错误文案（品牌红、AA 对比度）、aria-invalid /
     aria-describedby、首个错误聚焦；提交成功的行为仍交给各页原有 handler。 */
  (function formValidation() {
    var forms = document.querySelectorAll("form");
    if (!forms.length) return;

    function labelFor(field) {
      var label = null;
      if (field.id) label = document.querySelector('label[for="' + field.id + '"]');
      if (!label) label = field.closest("label");
      var text = label ? label.textContent : (field.getAttribute("aria-label") || field.getAttribute("placeholder") || "");
      return text.replace(/\*/g, "").replace(/\s+/g, " ").trim() || "this field";
    }

    function messageFor(field) {
      var v = field.validity, name = labelFor(field).toLowerCase();
      if (v.valueMissing) {
        if (field.type === "checkbox" || field.type === "radio") return "Please tick " + name + " to continue.";
        if (field.tagName === "SELECT") return "Please choose " + name + ".";
        return "Please enter " + name + ".";
      }
      if (v.typeMismatch) {
        if (field.type === "email") return "Enter a valid email address, e.g. name@example.com.";
        if (field.type === "url") return "Enter a full URL starting with https://.";
        return "Check the format of " + name + ".";
      }
      if (v.patternMismatch) return field.getAttribute("data-error") || "Check the format of " + name + ".";
      if (v.tooShort) return "Use at least " + field.minLength + " characters.";
      if (v.tooLong) return "Use no more than " + field.maxLength + " characters.";
      if (v.rangeUnderflow) return "The value must be at least " + field.min + ".";
      if (v.rangeOverflow) return "The value must be at most " + field.max + ".";
      if (v.stepMismatch) return "Check the value of " + name + ".";
      return "Please check " + name + ".";
    }

    function feedbackFor(field) {
      if (field._acFeedback && field._acFeedback.isConnected) return field._acFeedback;
      var fb = document.createElement("div");
      fb.className = "invalid-feedback";
      fb.id = (field.id || field.name || "field") + "-error";
      fb.setAttribute("aria-live", "polite");
      /* input-group / 包裹式 checkbox 不能把消息塞进 flex 或 label 内部 */
      var host = field.closest(".input-group") || field.closest("label") || field;
      host.insertAdjacentElement("afterend", fb);
      field._acFeedback = fb;
      return fb;
    }

    function setInvalid(field, on) {
      if (!field || field.type === "hidden" || field.type === "submit") return;
      field.classList.toggle("is-invalid", on);
      var fb = feedbackFor(field);
      if (on) {
        field.setAttribute("aria-invalid", "true");
        fb.textContent = messageFor(field);
        fb.classList.add("is-shown");
        var ids = (field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
        if (ids.indexOf(fb.id) === -1) ids.push(fb.id);
        field.setAttribute("aria-describedby", ids.join(" "));
      } else {
        field.removeAttribute("aria-invalid");
        fb.textContent = "";
        fb.classList.remove("is-shown");
        var rest = (field.getAttribute("aria-describedby") || "").split(/\s+/).filter(function (id) {
          return id && id !== fb.id;
        });
        if (rest.length) field.setAttribute("aria-describedby", rest.join(" "));
        else field.removeAttribute("aria-describedby");
      }
    }

    function fieldsOf(form) {
      return Array.prototype.slice.call(form.querySelectorAll("input, select, textarea")).filter(function (f) {
        return f.type !== "hidden" && f.type !== "submit" && f.type !== "button" && !f.disabled;
      });
    }

    forms.forEach(function (form) {
      var fields = fieldsOf(form).filter(function (f) { return f.willValidate; });
      if (!fields.length) return;
      var constrained = fields.some(function (f) {
        return f.required || f.type === "email" || f.type === "url" ||
          f.minLength > 0 || f.maxLength > 0 || f.pattern;
      });
      if (!constrained) return;

      form.setAttribute("novalidate", "novalidate");
      var attempted = false;

      /* capture 阶段先于各页 submit handler，校验不过就不放行（结账不会跳步） */
      form.addEventListener("submit", function (e) {
        var firstBad = null;
        fields.forEach(function (f) {
          if (f.validity.valid) {
            if (attempted) setInvalid(f, false);
            return;
          }
          setInvalid(f, true);
          if (!firstBad) firstBad = f;
        });
        attempted = true;
        if (!firstBad) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        firstBad.focus();
        makeToast("Please check the form", "Fix the highlighted field — " + labelFor(firstBad));
      }, true);

      fields.forEach(function (f) {
        function revalidate() {
          if (!attempted) return;
          /* 已提交过一次就实时跟随：修好即清除，仍错则刷新错误文案 */
          if (f.validity.valid) setInvalid(f, false);
          else setInvalid(f, true);
        }
        f.addEventListener("input", revalidate);
        f.addEventListener("change", revalidate);
        f.addEventListener("blur", function () {
          if (attempted && !f.validity.valid) setInvalid(f, true);
        });
      });
    });

    /* 静态演示没有后端：action="#" 的表单提交后给诚实的反馈，而不是整页刷新 */
    document.querySelectorAll('form[action="#"]').forEach(function (form) {
      if (form.classList.contains("newsletter-form") || form.classList.contains("coupon-form")) return;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        makeToast("Saved", form.getAttribute("data-demo-success") || "Demo mode — nothing was sent to a server.");
      });
    });
  })();

  /* ---------- 27. 商品卡快捷加购 ----------
     货架卡原先只有 More Info，要加购必须进 PDP。这里给每张卡补一个 44px
     的加购键，复用同一套角标与 toast；无 JS 时 More Info 仍是完整退路。 */
  (function quickAdd() {
    var icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2.4l2.4 12.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21 7H6"/></svg>';
    document.querySelectorAll(".product-card").forEach(function (card) {
      var foot = card.querySelector(".card-foot");
      if (!foot || foot.querySelector("[data-quick-add]")) return;
      var nameEl = card.querySelector(".prod-name");
      var name = nameEl ? nameEl.textContent.trim() : "This light";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quick-add";
      btn.setAttribute("data-quick-add", "");
      btn.setAttribute("aria-label", "Add " + name + " to cart");
      btn.title = "Add to cart";
      btn.innerHTML = icon;
      btn.addEventListener("click", function () {
        bumpCartBadge(1);
        makeToast("Added to cart", name);
        btn.classList.add("is-added");
        setTimeout(function () { btn.classList.remove("is-added"); }, 900);
      });
      foot.appendChild(btn);
    });
  })();

  /* ---------- 28. 详情页移动端粘性购买条 ----------
     原购买区滚出视口后出现，按钮直接触发页内真实按钮，不复制业务逻辑。 */
  (function stickyBuyBar() {
    var addBtn = document.getElementById("addToCartBtn");
    var buyBtn = document.getElementById("buyNowBtn");
    if (!addBtn || !buyBtn) return;
    var row = addBtn.parentElement;
    if (!row) return;

    var priceEl = document.querySelector(".product-price");
    var price = "";
    if (priceEl) {
      var clone = priceEl.cloneNode(true);
      var was = clone.querySelector(".was");
      if (was) was.remove();
      price = clone.textContent.trim();
    }

    var bar = document.createElement("div");
    bar.className = "pdp-buybar";
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Purchase options");
    var label = document.createElement("span");
    label.className = "pb-price";
    label.textContent = price;
    var quick = document.createElement("button");
    quick.type = "button";
    quick.className = "btn btn-outline-accent btn-sm";
    quick.textContent = "Add to Cart";
    var buy = document.createElement("button");
    buy.type = "button";
    buy.className = "btn btn-accent btn-sm";
    buy.textContent = "Buy Now";
    bar.appendChild(label);
    bar.appendChild(quick);
    bar.appendChild(buy);
    document.body.appendChild(bar);

    quick.addEventListener("click", function () { addBtn.click(); });
    buy.addEventListener("click", function () { buyBtn.click(); });

    var seen = false;
    function update() {
      var past = row.getBoundingClientRect().bottom < 0;
      var on = seen && past;
      bar.classList.toggle("show", on);
      document.body.classList.toggle("pdp-buybar-on", on);
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          /* 刷新后浏览器恢复滚动位置时，购买区已在视口上方，首次回调是
             isIntersecting=false —— 也要算「见过」，否则购买条永远不出现。 */
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) seen = true;
          update();
        });
      }, { threshold: 0 }).observe(row);
    } else {
      seen = true;
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  })();

  /* 初始化 */
  syncCartCount();
  updateSummary();
})();
