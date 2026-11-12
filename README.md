# acebeam-design

> acebeam 前台商城的**静态设计原型** —— 无构建、无包管理器、无框架、无后端。
> 本目录是 `acebeam-storefront`（Next.js 前端）的**视觉权威**。

## 目录结构

```
acebeam-design/
├── *.html              # 59 个页面原型（首页 / 产品 / 分类 / 购物车 / 结账 / 账户等）
├── assets/
│   ├── css/            # 样式表（common.css 为全站共享，其余按页面/模块划分）
│   │   ├── common.css      # 全站共享样式（设计 token、组件基样式）
│   │   ├── home.css        # 首页专属
│   │   ├── categories.css  # 分类中心 / 商品目录
│   │   ├── product-detail.css  # 商品详情
│   │   ├── cart.css        # 购物车
│   │   ├── account.css     # 账户相关
│   │   └── content.css     # 内容页（关于 / 联系 / FAQ 等）
│   ├── js/
│   │   └── main.js         # 单文件 IIFE，全站交互（Hero 轮播 / Tab / 数量步进等）
│   ├── img/            # 图片素材（logo / 产品图 / 分类图 / 图标等）
│   ├── fonts/          # 字体文件
│   └── vendors/        # 第三方库（Bootstrap / Swiper 等）
├── robots.txt
└── sitemap.xml
```

## 技术栈

| 项 | 说明 |
|---|---|
| 技术 | 原生 HTML / CSS / JavaScript |
| 构建 | **无** —— 改完刷新浏览器即可 |
| 依赖 | 无 npm / 无包管理器 |
| UI 库 | Bootstrap 5.3.8 + Swiper 11（本地 vendors） |
| 字体 | 随仓内置（`assets/fonts/`） |

## 本地预览

```bash
# 起本地服务（端口 8099）
python -m http.server 8099 --bind 127.0.0.1 --directory acebeam-design
```

然后访问 `http://127.0.0.1:8099/`。

## 设计约定

> **视觉与体验的唯一权威约束见 [DESIGN.md](file:///D:/study/doc/css/acebeam-design/DESIGN.md)**（设计方向、token 契约、DO/DON'T 硬规、交付前清单）。以下是工程侧约定。

- **主橙色**：`#e65300`（`--ac-beacon` / `--ac-beacon-dark`）
- **设计 token**：定义在 `common.css` 的 `:root` 中（`--ac-*` 变量）
- **组件基样式**：全站共享组件的基样式**必须**放在 `common.css`，页面专属样式才放对应 CSS
- **语义 class**：关键容器与功能元素必须带语义选择器（如 `product-card`、`add-to-cart-button`）
- **H1 唯一**：每页恰好一个 `<h1>`
- **图片属性**：每个 `<img>` 都要有 `width` / `height` 与 `decoding="async"`

## 页面清单（59 个）

| 分类 | 页面 |
|---|---|
| 首页 | `index.html` |
| 产品 | `all-products.html` / `product-detail.html` / `product-detail-grouped.html` / `categories.html` / `search.html` / `product-tags.html` / `products-by-tag.html` / `brands.html` / `new-products.html` / `recently-viewed.html` |
| 购物车 | `cart.html` / `compare-products.html` / `wishlist.html` / `email-wishlist.html` / `email-a-friend.html` |
| 结账 | `checkout.html` / `checkout-billing-address.html` / `checkout-shipping-address.html` / `checkout-shipping-method.html` / `checkout-payment-method.html` / `checkout-payment-info.html` / `checkout-confirm.html` / `checkout-completed.html` |
| 账户 | `login.html` / `register.html` / `register-result.html` / `account-info.html` / `account-addresses.html` / `account-address-add.html` / `account-address-edit.html` / `account-change-password.html` / `account-activation.html` / `email-revalidation.html` / `password-recovery.html` / `password-reset.html` |
| 订单 | `order-details.html` / `order-history.html` / `return-request.html` / `return-request-find.html` / `return-requests.html` / `shipment-details.html` / `my-product-reviews.html` |
| 内容 | `about-us.html` / `contact-us.html` / `faq.html` / `shipping-delivery.html` / `terms-conditions.html` / `privacy-policy.html` / `user-agreement.html` / `warranty-policy.html` / `support.html` / `reward-points.html` / `back-in-stock.html` |
| 博客 | `blog.html` / `blog-post.html` / `newsletter-activation.html` |
| 其他 | `404.html` / `sitemap-page.html` |

## 编码约定

| 项 | 规定 |
|---|---|
| 行尾 | LF |
| BOM | 无 |
| 语言 | 英文文案 + 中文注释 |
| 文件命名 | 全小写，连字符分隔 |

## 注意事项

1. **无构建步骤**：改完文件刷新浏览器即可，不要引入构建工具
2. **演示数据**：所有价格、库存、评价、优惠券都是演示数据，不接任何接口
3. **图片素材**：商品与分类图片是本地素材，**不要替换为外链**
4. **视觉权威**：本目录是前端电商页面的设计参考，创建或修改前端页面时一律以本目录为参考
5. **详细约定**：见 `../nop50/docs/themes/acebeam/AGENTS.md`（该文件不在本目录内）
