# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

零售 D2C 为主：全球英语市场的手电筒买家——户外/徒步/露营爱好者、EDC 日常携带用户、战术/执法/狩猎用户、潜水等垂直场景用户；任务是按用途与参数（流明 / candela / 射程 / 电池）选型并完成购买，以及售后（保修注册、退换货）。

次要受众：分销商/经销商（Distributor Program 入口）与媒体评测者。

## Product Purpose

Acebeam 官方商城前台的静态设计原型，覆盖完整购物旅程（浏览 → 购物车 → 六步结账 → 账户 → 订单/退换）与内容页、博客。它本身不是在线商店：演示数据、无后端，职责是把视觉与交互定稿，供下游实现复刻。成功 = 品类/参数选型路径清晰、购买流可信、品牌工程实力（SFT-60-W 垂直芯片、LEP 光学、10 年保修）传达充分。

## Positioning

技术领先的手电专家：以垂直芯片 SFT-60-W 与 LEP（激光激发荧光体）光学实现"口袋尺寸 × 极限射程"（如 P20 Mini 1,035 米），辅以 10 年保修、IP68 / HAIII 硬阳极氧化 / 1.5m 抗跌落的耐用性主张与满 $49 免邮——这一组合是同类产品难以同时真实主张的。（竞品对比为推断性表述，站点文案未点名竞品。）

## Operating Context

- 本目录是 **acebeam-storefront（Next.js 前端）与 nop50 `docs/themes/acebeam`（nopCommerce 5.0 主题）的共同视觉权威**——两个下游实现均以本目录为设计基准（用户确认）。
- 本地预览：`python -m http.server 8099 --bind 127.0.0.1 --directory acebeam-design`；无构建、无包管理器，改完刷新浏览器即可。
- 第三方库为本地 vendors：Bootstrap 5.3.8、Swiper 11；字体自托管（`assets/fonts/`）。
- 演示数据契约：所有价格、库存、评价、优惠券均为演示数据，不接任何接口。

## Capabilities and Constraints

- 59 个页面原型：产品（列表/详情/分类/标签/品牌/搜索）、购物车、六步结账、账户/订单/退货、内容页、博客、404、站点地图页。
- 硬约束（README 绑定）：
  - 无构建步骤——不得引入构建工具或包管理器；
  - 商品/分类图片必须是本地素材，不得替换为外链；
  - 全站共享组件基样式必须放 `common.css`，页面专属样式放对应 CSS；
  - 关键容器与功能元素必须带语义 class（如 `product-card`、`add-to-cart-button`）；
  - 每页恰好一个 `<h1>`；每个 `<img>` 必须带 `width`/`height` 与 `decoding="async"`；
  - 编码：LF、无 BOM、英文文案 + 中文注释、文件名全小写连字符。
- 交互为原生 JS（`assets/js/main.js` 单文件 IIFE）：Hero 轮播、tabs、数量步进、购物车/心愿单 localStorage 状态、toast 反馈。
- 未决（记录在案，不臆造）：表单后端契约（newsletter/contact/账户表单当前 `action="#"`）、真实支付/物流对接、搜索与筛选的服务端行为。

## Brand Commitments

- 名称：Acebeam（分销带标题使用 Acebeam®）。
- 品牌色：主橙 `#e65300`（`--ac-beacon`）单色派生全部强调态；深蓝 `#051c2c`（`--ac-navy`）承载通知栏/页脚/技术带/评论带等信任区。设计 token 全部定义在 `common.css :root`（`--ac-*` 变量）。
- 字体：Aldrich（技术感展示）、Archivo（display）、Source Sans 3（正文），均为自托管 woff2。
- 服务承诺（站点既有文案）：10 年保修、满 $49 免邮、IP68 / HAIII / 1.5m 抗跌落。
- 文案语言：英文面向用户，中文仅用于代码注释。

## Evidence on Hand

- 本地图片素材（`assets/img/`：产品图、分类图、hero 轮播图、新闻/博客图、支付徽章图、logo）——真实本地资产，不得外链替换。
- **演示/未经证实内容，不得当作真实证据引用或外传**：SHOT Show 2025 "Best in Show"（GearJunkie）获奖说法、客户评论（Michael T. / Sarah K. / Daniel R.）、"NSSF / PLATO / Stripe Verified" 会员徽章、全部价格与库存与优惠券。
- 联系方式（2026-10-31 归一，全站同源）：`info@acebeam.com`；电话 `+86-755-2303 6551`；地址 `Floor #1, Building #1, YiJiaYang Industrial Park, Dalang, Shenzhen 518100, China`。页脚、`contact-us.html`、`support.html` 与 `Organization` JSON-LD 必须一致，`tools/check-data-source.js` 已加断言。**该号码与地址仍是样例值**，上线前由品牌方确认真实 NAP 后一次性替换（替换后重跑门禁即可）。

## Product Principles

1. **参数即导购**：用真实规格（流明 / candela / 射程 / 电池 / IP 等级）组织选型路径，先用途后型号。
2. **信任前置**：保修、防水、获奖、支付保障出现在决策路径上（服务条/技术带/FAQ），不只留在页脚。
3. **无构建的性能纪律**：本地资源、懒加载、尺寸声明、Core Web Vitals 优先；任何改动不得引入构建工具或外链资源。
4. **深浅对比承载叙事**：深色区（hero/技术带/评论带）渲染"夜与光"的情绪，浅色区保证商品信息的扫描清晰度。

## Accessibility & Inclusion

- WCAG AA 为基线：`common.css` token 注释中的对比度决策（如白字铺 `#e65300` = 3.75:1，仅用于大号/粗体文字）必须保持；新增配色先查注释再定值。
- `prefers-reduced-motion` 已在 CSS（3 处 media query）与 JS（`matchMedia`）双端处理，动效改动不得回退该行为。
- 键盘可达：全局 `:focus-visible` 焦点环、skip-link、下拉/手风琴/tabs 的 ARIA 语义保持。
