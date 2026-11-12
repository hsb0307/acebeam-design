# AGENTS.md — acebeam-design

纯静态前端原型（59 个 HTML + `assets/`），**无构建、无包管理器、无后端**。本目录是下游实现（`acebeam-storefront` Next.js 前端、nopCommerce 5.0 `acebeam` 主题）的**视觉与数据权威**。

## 开工前必读

1. `PRODUCT.md` — 产品事实：受众、定位、硬约束、品牌承诺、哪些内容是**演示数据不得当真实证据**。
2. `DESIGN.md` — 设计契约：token、字体、间距、圆角、动效、无障碍底线，以及 **Known Deviations（待修项）** 与 Do/Don't。
3. `site-audit-report.md` — 现状诊断与已执行批次；**§8 是 B3 勘误**，改数据前先读它，别重复踩坑。

## 硬约束

- 不引入构建工具、包管理器或外链资源；第三方库一律在 `assets/vendors/`。
- 全站共享组件基样式进 `assets/css/common.css`，页面专属样式进对应 CSS。
- 设计值只用 `common.css :root` 里的 `--ac-*` / `--font-*` / `--sp-*` / `--radius*` / `--shadow-*` token，不硬编码。
- 价格、规格、SKU、图片路径的**唯一来源是 `assets/js/products.js`**；页面里的静态数字必须与它一致。
- 图片：页面**只引用 `assets/img/*.webp`**；同目录保留同名 `.jpg/.png` 原图作为重编码来源，**不参与回退**。替换图片请改原图后用 ffmpeg 重出 WebP（命令见 `site-audit-report.md` §24.2），不要直接改 `.webp`。
- 英文面向用户，中文只用于代码注释；文件名全小写连字符；LF 无 BOM。
- 每页恰好一个 `<h1>`；每个 `<img>` 带 `width`/`height`/`decoding="async"`。

## 改完必须验证

```bash
node tools/check-data-source.js     # 非 0 退出即数据不一致（含 ANSI/PLATO FL1: distance = 2√candela）
node tools/check-jsonld.js          # 非 0 退出即 JSON-LD 不可解析或 hreflang 与 canonical 不自指
node tools/check-seo.js             # 非 0 退出即存在 CRITICAL/HIGH 级 SEO 问题（claude-seo 检查表）
node tools/check-css-layers.js      # 非 0 退出即存在「类只定义在未加载的样式表里」的分层漏洞
node tools/check-links.js           # 非 0 退出即存在断链/断锚点/缺失图片（含 og:image、JSON-LD 图片、CSS url()）
python -m http.server 8099 --bind 127.0.0.1   # 本地预览 http://127.0.0.1:8099/
```

**验证只能用浏览器，不能用 `curl`。** 两个已知陷阱：

- 自定义属性里的 `url()` 以**消费它的样式表**为基准解析，不以 HTML 文档为基准 —— 用 `curl` 测内联 `--slide-bg: url('../img/…')` 会得到假 404（详见 `site-audit-report.md` §8.4）。
- 约 1448 处资源引用**没有版本指纹**，改动 JS/CSS 后须先 `fetch(url,{cache:'reload'})` 再断言效果。

## Git

- 仓库顶层目录是 `D:/study/doc`，不是本目录 —— 在这里 `git diff` 会混入兄弟项目的改动，路径要写全。
- 未经明确要求不得 commit / push，不得做破坏性 git 操作。
