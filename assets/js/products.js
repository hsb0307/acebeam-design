/* ============================================================
   ACEBEAM — Product data source (single source of truth)
   价格、规格、SKU、图片只在这里定义一次。
   静态 HTML 里的卡片保留同一组数值（禁用 JS 时仍然正确），
   对比表与结账汇总由 main.js 从这张表渲染，避免跨页口径漂移。
   规则：站点里没有任何页面声明过的字段一律留 null，不要臆造。
   ============================================================ */
(function (global) {
  "use strict";

  var SITE = "https://www.acebeam.com/";

  /* lumens / meters / candela 为 ANSI/PLATO FL1 标称值 */
  var PRODUCTS = {
    "p20-mini": {
      name: "P20 Mini Long Distance Tactical Flashlight",
      short: "P20 Mini Tactical Flashlight",
      sku: "ACEBEAM-P20MINI",
      altSkus: ["ACEBEAM-KIT-01"],   /* product-detail-grouped.html 套装行项里的编号 */
      price: 119.9, was: 139.9,
      lumens: 1800, meters: 1035, candela: 267806,
      emitter: "1 × Luminus SFT-60-W",
      battery: "1 × 21700",
      charging: "USB-C", ip: "IP68", warranty: "10 years",
      img: "assets/img/catprod-p20mini.webp",
      url: "product-detail.html"
    },
    "x35": {
      name: "X35 Multi-Light Powerful Searching Flashlight",
      short: "X35 Searching Flashlight",
      sku: "ACEBEAM-X35",
      price: 229.9, was: null,
      lumens: 2600, meters: 170, candela: 7225,
      emitter: "4 × LED multi-light",
      battery: "3 × 21700",
      charging: "USB-C", ip: "IP68", warranty: "10 years",
      img: "assets/img/catprod-x35.webp",
      url: "product-detail.html"
    },
    "terminator-m1": {
      name: "Terminator M1 LEP & LED Dual-Source Flashlight",
      short: "Terminator M1 Dual-Source",
      sku: "ACEBEAM-M1",
      altSkus: ["ACB-TM1-BLK"],   /* shipment-details.html 发货行的颜色码 */
      price: 279.9, was: null,
      lumens: 2300, meters: 1500, candela: 562500,
      emitter: "LEP + LED dual source",
      battery: "1 × 21700",
      charging: "USB-C", ip: "IP68", warranty: "10 years",
      img: "assets/img/catprod-terminator-m1.webp",
      url: "product-detail.html"
    },
    "t29": {
      name: "T29 Ultra Long Range Hunting Flashlight",
      short: "T29 Hunting Flashlight",
      sku: "ACEBEAM-T29",
      price: 109.9, was: null,
      lumens: null, meters: 3200, candela: 2560000,
      emitter: null, battery: null,
      charging: "USB-C", ip: "IP68", warranty: "10 years",
      img: "assets/img/catprod-t29.webp",
      url: "product-detail.html"
    },
    "e75": {
      name: "E75 High CRI Nichia 519A EDC Flashlight",
      short: "E75 High CRI Flashlight",
      sku: null,
      price: 89.9, was: null,
      lumens: 4500, meters: null, candela: 20100,
      emitter: "Nichia 519A",
      battery: null,
      charging: "USB-C", ip: null, warranty: "10 years",
      img: "assets/img/catprod-e75.webp",
      url: "product-detail.html"
    },
    "w20": {
      name: "W20 Long Range LEP Flashlight",
      short: "W20 LEP Flashlight",
      sku: null,
      price: 149.9, was: null,
      lumens: null, meters: 1000, candela: 250000,
      emitter: "LEP", battery: null,
      charging: "USB-C", ip: null, warranty: "10 years",
      img: "assets/img/catprod-w20.webp",
      url: "product-detail.html"
    },
    "x30": {
      name: "X30 Dual-Source Searching Flashlight",
      short: "X30 Dual-Source Flashlight",
      sku: null,
      price: 199.9, was: null,
      lumens: 2200, meters: null, candela: 6800,
      emitter: null,
      /* blog 与 new-products 都写明 X30 配 2 × 21700 5000mAh Full-Tab */
      battery: "2 × 21700 5000mAh",
      charging: "USB-C", ip: null, warranty: "10 years",
      img: "assets/img/catprod-x30.webp",
      url: "product-detail.html"
    },
    "uc3a": {
      name: "UC3A USB-C Rechargeable Flashlight",
      short: "UC3A USB-C Flashlight",
      sku: null,
      price: 39.9, was: null,
      lumens: 1100, meters: null, candela: 4200,
      emitter: null, battery: null,
      charging: "USB-C", ip: null, warranty: "10 years",
      img: "assets/img/catprod-uc3a.webp",
      url: "product-detail.html"
    },
    "h18": {
      name: "H18 Dual-Source Right Angle Headlamp",
      short: "H18 Headlamp",
      sku: "ACEBEAM-H18",
      price: 109.9, was: null,
      lumens: 1200, meters: null, candela: 9800,
      emitter: null, battery: null,
      charging: "USB-C", ip: null, warranty: "10 years",
      img: "assets/img/catprod-cap.webp",
      url: "product-detail.html"
    },
    "h35": {
      name: "H35 Multi-Colour LED Headlamp",
      short: "H35 Headlamp",
      sku: "ACB-H35-BLK",
      price: 109.9, was: null,
      lumens: 3000, meters: null, candela: 9300,
      emitter: null, battery: null,
      charging: null, ip: null, warranty: "10 years",
      img: "assets/img/cat-led-headlamps.webp",
      url: "product-detail.html"
    },
    "p18": {
      name: "P18 Tactical Compact Flashlight",
      short: "P18 Compact Flashlight",
      sku: null,
      price: 99.9, was: null,
      lumens: null, meters: 850, candela: 180625,
      emitter: null, battery: null,
      charging: null, ip: null, warranty: "10 years",
      img: "assets/img/catprod-x30.webp",
      url: "product-detail.html"
    },
    "battery-5000": {
      name: "Acebeam 21700 5000mAh Full-Tab Battery",
      short: "21700 5000mAh Battery",
      sku: "ACB-21700-5000",
      altSkus: ["ACEBEAM-KIT-02"],   /* product-detail-grouped.html 套装行项里的编号 */
      price: 19.9, was: null,
      lumens: null, meters: null, candela: null,
      emitter: null, battery: "21700 5000mAh",
      charging: "USB-C", ip: null, warranty: null,
      img: "assets/img/catprod-battery5000.webp",
      url: "product-detail.html"
    },
    "battery-5600": {
      name: "Acebeam 21700 5600mAh Battery",
      short: "21700 5600mAh Battery",
      sku: null,
      price: 24.9, was: null,
      lumens: null, meters: null, candela: null,
      emitter: null, battery: "21700 5600mAh",
      charging: "USB-C", ip: null, warranty: null,
      img: "assets/img/catprod-battery5600.webp",
      url: "product-detail.html"
    },
    "tail-cap-kit": {
      name: "Spare Tail Cap & Accessory Kit",
      short: "Spare Tail Cap Kit",
      sku: null,
      price: 9.9, was: null,
      lumens: null, meters: null, candela: null,
      emitter: null, battery: null,
      charging: null, ip: null, warranty: null,
      img: "assets/img/catprod-cap.webp",
      url: "product-detail.html"
    },
    "coin-kit": {
      name: "Coin Battery Replacement Kit",
      short: "Coin Battery Kit",
      sku: null,
      price: 12.9, was: null,
      lumens: null, meters: null, candela: null,
      emitter: null, battery: null,
      charging: null, ip: null, warranty: null,
      img: "assets/img/catprod-coin.webp",
      url: "product-detail.html"
    },
    /* ------- 套装与零配件：只在 bundle / 退货 / 物流页被声明过 -------
       规则同上：页面没写过的字段一律 null。射程/光强/保修这类主张此处没有出处，
       所以留空；套装本身也不设单一价格（页面写的是「按加购的行项付款」）。       */
    "p20-mini-kit": {
      name: "P20 Mini Tactical Kit",
      short: "P20 Mini Tactical Kit",
      sku: "ACEBEAM-KIT-P20MINI",
      price: null, was: null,
      lumens: null, meters: null, candela: null,
      emitter: null, battery: null,
      charging: null, ip: null, warranty: null,
      img: null,
      url: "product-detail-grouped.html"
    },
    "tactical-holster": {
      name: "Acebeam Tactical Holster",
      short: "Tactical Holster",
      sku: "ACEBEAM-KIT-03",
      price: 14.9, was: null,
      lumens: null, meters: null, candela: null,
      emitter: null, battery: null,
      charging: null, ip: null, warranty: null,
      img: null,
      url: "product-detail-grouped.html"
    },
    "pocket-clip-h": {
      name: "Pocket Clip for H Series",
      short: "Pocket Clip",
      sku: "ACB-CLIP-H",
      price: 9.9, was: null,
      lumens: null, meters: null, candela: null,
      emitter: null, battery: null,
      charging: null, ip: null, warranty: null,
      img: null,
      url: null   /* 仅出现在 return-request.html 的退货行，全站没有对应详情页 */
    }
  };

  /* 运费口径全站唯一：standard 满 $49 免运费（与 topbar / shipping-delivery 相同） */
  var SHIPPING = {
    standard: { id: "standard", label: "Standard Tracked", eta: "3–6 working days (US)", fee: 0, freeOver: 49 },
    express: { id: "express", label: "Express", eta: "2–3 working days", fee: 18, freeOver: null }
  };

  function bySlug(slug) {
    return PRODUCTS[slug] || null;
  }

  /* 静态 HTML 只有文字没有 slug 时用这个反查（大小写、&amp; 都能对上） */
  function byName(name) {
    var key = String(name || "").toLowerCase().replace(/&amp;/g, "&").trim();
    for (var slug in PRODUCTS) {
      if (!Object.prototype.hasOwnProperty.call(PRODUCTS, slug)) continue;
      var p = PRODUCTS[slug];
      if (p.name.toLowerCase() === key || p.short.toLowerCase() === key) return slug;
    }
    return null;
  }

  function money(n) {
    var v = typeof n === "number" ? n : parseFloat(n) || 0;
    return "$" + v.toFixed(2);
  }

  /* ANSI 数值统一千分位，杜绝 2000000 / 2,000,000 两种写法混用 */
  function num(n) {
    return (typeof n === "number" ? n : parseFloat(n) || 0).toLocaleString("en-US");
  }

  global.ACEBEAM = {
    site: SITE,
    products: PRODUCTS,
    shipping: SHIPPING,
    bySlug: bySlug,
    byName: byName,
    money: money,
    num: num
  };
})(window);
