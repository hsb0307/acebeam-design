# skill-audit-report.md — 16 个 skill 逐项评审与合并判定

> **本文的角色**：把 16 个 skill 的独立审计**去重、裁决、映射**到 B4–B7 批次，并标注每条发现在**今天的工作树**里是已修 / 未修 / 需真人。
> **不是**逐字报告集。逐字原文（含每份报告的 `SKILL LOADED` 证明行与 transcript 行号）在 `tmp/skill-audit-digest.md`（932 行，提取自会话 transcript，未改写）。
> **证据纪律**：本文里凡是写「我实测」的数字，都是刚在当前文件上跑出来的；凡是复述 skill 结论而未复测的，都标了来源 skill。二者不混用。

---

## 1. 覆盖情况

用户指令要求「每个 skill 都要使用」。主代理分 3 波派发 **16 个只读 sub-agent**，每个绑定一个 skill，**16 份报告全部到位，全部带 `SKILL LOADED: <name> — yes` 证明行**。

| 波次 | skill | 分组 |
|---|---|---|
| 1（6） | `design-taste-frontend`、`frontend-design`、`impeccable`、`web-design-engineer`、`web-design-layout`、`bootstrap-components` | 视觉 / 设计系统 |
| 2（2） | `web-design-guidelines`、`frontend-design-review` | UX / 可访问性 |
| 3（8） | `seo-audit`、`schema`、`core-web-vitals`、`programmatic-seo`、`google-ai-search-optimization`、`seo-assistant`、`yun-zhi-seo`、`website-audit` | Google SEO |

**NOT FOUND（已安装但本轮没有产出审计报告）**：`site-architecture`、`content-strategy`、裸 `seo`、`website-seo`、`ecommerce-landing-page`。这些名字只在 skill 清单/安装上下文里出现过，没有对应 sub-agent。**不要**把它们的结果算进本文任何统计。

另：根目录 `AUDIT-REPORT.md`（09:30 由一个后台 agent 写入仓库）自称 `claude-seo` + `impeccable` + `security-audit` 联合审计、给出「SEO 90/100 / 59 页要素全覆盖」，**不属于这 16 份**，且其结论与本文 §4/§5 多条实测冲突，**未采纳**。

---

## 2. 各 skill 自评（原文口径，未归一）

| skill | 评分 | 一句话判断 |
|---|---|---|
| design-taste-frontend | Taste 5/10 · Coherence 7/10 | 「定义了的 token 是死的」比「缺 token」更准确 |
| frontend-design | Distinctiveness 5/10 · Consistency 5/10 | 有真观点，但执行滑向第二套模板 |
| impeccable | Craft 5/10 · Completeness 3/10 | 逐页手写而非组件组合 → 状态覆盖近乎为零 |
| web-design-engineer | 分区判定表（8 区：4 明显不合理 / 2 需调整 / 1 合理 / 1 —） | chrome 复制与 CSS 分层是结构性问题 |
| web-design-layout | Spacing discipline 3/10 · Hierarchy 7/10 | token 层连贯，但间距纪律失效 |
| bootstrap-components | Framework discipline 6/10 | 「薄但诚实的 Bootstrap 皮」，用到的组件结构都对 |
| web-design-guidelines | Craft 6.5/10 · IA/function 4/10 | CSS 层成熟，功能层有真缺陷 |
| frontend-design-review | Frictionless 4 · Craft 3 · Trust 6 · DS 3 · Aesthetic 7 | 三条 P0 阻塞，其中两条只能浏览器证明 |
| schema | 4/10 | 「解析干净 ≠ 有资格出富结果」 |
| google-ai-search-optimization | 6/10 | 资格层很好，坏在 PDP 之外的一切与实体事实冲突 |
| seo-assistant | 6/10 | 元数据层优秀，**链接与 URL 层失败** |
| core-web-vitals | 无分（估算 LCP≈2.5–4s、INP 良好、CLS≈0.05–0.15 **未实测**） | 自陈 harness 不发 paint 条目，拒绝把估算当实测 |
| programmatic-seo | 2/10 readiness | 不是「内容薄」，是**结构上无法程序化** |
| yun-zhi-seo | 82/100（自陈被本地预览假象抬高，真实部署约 ~90） | 59 页数量没问题，问题在货架**深度** |
| seo-audit | 无数字分（用 High/Med/Low + Priority 1–5） | 失败在框架第 1–2 层（抓取/索引），不是内容层 |
| website-audit | 3.7/10（五专家制） | 59 页平铺对「设计演示」勉强及格，对「电商站点」不成立 |

**注意分母**：`website-audit` 自陈其 skill 依赖的蜂群子代理通道与 Word 依赖均缺失，5 位专家是**单代理按序自行完成**——3.7/10 不是真的 5 个独立专家。`yun-zhi-seo` 的 82 分自陈被 `https:false` + canonical 域 ≠ 抓取域 拉偏。把这两个数字与 `frontend-design-review` 的 3/10 直接平均是**错误的**。

---

## 3. 架构合理性判定（合并结论）

**16 份里没有一份判这个仓库「架构不合理」到需要重写。** 共识是一个更精确的形状：

> **作为「视觉权威 / 设计演示」：合理。** 渐进增强是真的（`main.js:146` 缺 `ACEBEAM` 时 `updateSummary` 直接 bail，静态 HTML 在无 JS 下仍显示正确数字）；懒加载一致（footer 413 张 `<img>` 0 遗漏，logo 故意 eager ×59）；6 条 CSS 加载序列全部正确；token 层有注释、有出处。
>
> **作为「电商站点」：不成立，且只有一个根因——货架坍缩。** 类目(8) / 系列(8) / 标签(28) / 数据源(18 条记录) 四层货架全部指向同两个 URL。

我实测（当前树）：

```
grep -o 'url: *"[^"]*"' assets/js/products.js | sort | uniq -c
     15 url: "product-detail.html"
      2 url: "product-detail-grouped.html"
      1 (pocket-clip-h: null，仅出现在 return-request.html 的退货行)
```

`href="#"` 死锚点 **321** 处（其中 318 在复制的 chrome 内）。这就是被 9 个 skill 独立点名的同一个 P0。

**收敛出的正确形状**（`programmatic-seo` + `website-audit` + `seo-assistant` 三家独立给出同一方案）：数据驱动模板三层 —— `products.js` 补真实 SKU → 构建期生成 per-SKU PDP / 类目页 / 系列页 / 参数化 tag 页 → chrome 单模板注入。**平铺 59 页可以保留，但必须由模板产出而非手抄。**

⚠️ 这与 `AGENTS.md` 的硬约束「不引入构建工具、包管理器」直接冲突，属于**要真人拍板的架构决策**，不是我能单方面改的（见 §7）。

---

## 4. 共识度矩阵（同一条被几个 skill 独立点名）

| 发现 | 点名数 | 当前状态（我实测） |
|---|---|---|
| 货架坍缩：所有产品/类目/标签 → 2 个 URL | 9（seo-audit、schema、programmatic-seo、google-ai-search、seo-assistant、yun-zhi-seo、website-audit、web-design-guidelines、impeccable） | **未修**，需架构决策 |
| 320/321 处 `href="#"` | 5 | **未修**（现测 321） |
| `tabular-nums` 全站 0 处 | 4 | **已修**（`common.css:73-76`，本会话 B4） |
| 768px 以下购物车隐藏全部金额 | 3 | **已修**（本会话 B4，320/375/768 实测金额可见） |
| `.btn` 无任何焦点指示 | 3 | **已修**（`.btn:focus-visible` 实色 3px 环，实测 `outlineStyle:"solid"`） |
| 白字压 `#e65300` = **3.75:1**，未达 AA 且代码注释自我豁免 | 4 | **未修**，且注释仍在（`common.css:10-11`） |
| `.btn-accent` 字面 padding 压掉 `.btn-sm/.btn-lg` | 3 | **已修**（本会话 B4，三档实测 11.84/13.12/16px） |
| `--sp-1..6` 全站仅 1 处引用 | 6 | **未修**（现测 `var(--sp-` 仍仅 1 处） |
| eyebrow 泛滥 + 全部 H2 强制大写 | 3 | **未修**（现测 index.html `class="eyebrow` 9 处、`text-transform: uppercase` 13 条规则） |
| 聚合计数互相矛盾 | 4 | **部分收口**：`of N results` 已改 107 并加验收断言；`brands.html` vs `categories.html` 同名切片仍冲突（§5-#10） |
| 创立年份三说 2009/2013/2014 | 3 | **已修**：全站页脚统一 2014（现测 `since 2013` 0 页 / `worldwide since 2014` 59 页） |
| 状态色 / 阴影游离 token（Tailwind amber、off-palette 紫、第三种 shadow base） | 4 | **未修** |
| 0 处缓存指纹（1,448 引用） | 6 | **未修**（现测 `assets/...` 引用带 `?v=` 的 **0** 处） |
| `swiper-3.4.2` 孤儿库 1.9 MB，0 引用 | 3 | **未修**（`assets/vendors/` 里仍在，引用它的 HTML 页数 0） |
| 假 `aggregateRating` 5.0/3 + 复用虚构人格 | 5 | **未修**（`product-detail.html:69` 原样） |
| 假搜索：`main.js` 0 处读 query string | 4 | **未修** |
| `compare-products.html` 既 `noindex` 又自引用 canonical、且不在 sitemap | 2 | **未修**（现测 3 条全中） |
| `SearchAction` 目标被自家 `robots.txt:30 Disallow: /*?q=` 挡掉 | 2 | **未修** |
| `.seo-intro` `max-width:940px` ≈ 100+ 字符/行 | 1 | **未修**（现测 `common.css:694`） |

---

## 5. 去重后的 P0 / P1 / P2（映射到批次，含当前状态）

状态图例：✅ 本会话已修并实测 · 🔧 未修，我方可做 · 👤 需真人/品牌决策

### P0
| # | 发现 | 来源 | 批次 | 状态 |
|---|---|---|---|---|
| 1 | 货架坍缩：15 条产品记录共用 `product-detail.html`；ItemList 12 条 url 全同；类目/系列/tag 卡片全指 `all-products.html` | 9 个 skill | B6 | 👤 需先定「是否引入生成步骤」（与 AGENTS.md 无构建约束冲突） |
| 2 | `product-detail.html:230` 的 `data-bs-toggle="tab"` `<a role="tab">` 无 `.nav`/`[role=tablist]` 祖先 → bundle.js 在 `_parent=null` 处抛 TypeError，「3 Reviews」既死又报错 | bootstrap-components、web-design-guidelines（我实测仍在） | B4→B6 | 🔧 即 D5 |
| 3 | ~~白字 / `#e65300` 按钮 **3.75:1**，且 `common.css:10-11` 用「大号/粗体文字 3.0 门槛」自我豁免——实际字号 .82rem(13.12px)/700 **不构成** WCAG 大号字~~ | design-taste-frontend、frontend-design、web-design-guidelines、frontend-design-review、website-audit | B4→**D10** | ✅ 已修（**D10 闭环**）。拆出「图形档 `#e65300` / 文字档 `#c24700` 5.01 / 文字档深 `#ad4000` 5.98」三态 token（同色相 22°、同饱和 100%，仅降明度，不引入新色相），迁移 106 处承载文字的橙（CSS 103 + 内联 3）+ 59 页 `theme-color`；`common.css:10-11` 的豁免注释已删除并改写为对比度台账。59 页 / 3,180 个可见文字节点实测，仅 1 处 <4.5 且属 WCAG 1.4.3 禁用控件豁免。证据见 `site-audit-report.md` §12 |
| 4 | 手机端购物车不显示任何金额 | impeccable、website-audit | B4 | ✅ 已修（实测 320/375/768 金额可见、无重叠） |
| 5 | `.btn` 全站零焦点指示（Bootstrap `.btn:focus-visible{outline:0}` 特异性 0,2,0 压掉站点 0,1,0） | frontend-design-review、web-design-guidelines | B4 | ✅ 已修（实测 `outlineStyle:"solid"`） |
| 6 | 搜索假象：表单 POST `?q=` 到 `all-products.html`，但 `main.js` 从不读 query；`search.html:185` 对任何查询恒显 "6 results for 'tactical'" | impeccable、web-design-guidelines、website-audit | B6 | ✅ 已修（`main.js` §23：`?q=` 同步进页面上**所有** `input[name="q"]`、按真实卡片名过滤、分面计数跟随查询词；实测 `?q=p20` → `Results for “p20”: 1` 且只剩 P20 Mini，静态分桶也改成真值 (0)(1)(3)(2)。证据见 `site-audit-report.md` §14.2/14.3） |
| 7 | 虚构信任证据：`aggregateRating` 5.0/3 来自三条复用人格的假评论，同一人格又当首页 testimonial | schema、google-ai-search、website-audit、web-design-guidelines | B7 | 👤 需真实评价数据或明确标注 demo |
| 8 | ~~首页 Hero 背景图 404~~ | seo-assistant、web-design-guidelines | B1 | ↩️ **已撤回**：两个 agent 用 `curl` 按文档基准解析自定义属性里的 `url()`；浏览器按**消费它的样式表**解析，原写法正确、三图实测 200。我一度按此改了三行并全部回滚（详见 `site-audit-report.md` §8.4） |

### P1
| # | 发现 | 来源 | 批次 | 状态 |
|---|---|---|---|---|
| 9 | ~~321 处 `href="#"`；「Distributor Portal」在 59 页全死；导航双 active（`all-products.html:144/156`）~~ **已修（B6）**：`href="#"` 321 → **7**（全部带 `data-*` + `preventDefault`，见 `DESIGN.md` Interaction Contracts 新约定）；Categories 的多余 `active` 删除、当前项补 `aria-current="page"`，实测 `navActive:["All Products"]`；死链扫描 problems none | 5 个 skill | B6 | ✅（证据 `site-audit-report.md` §14.1/14.2） |
| 10 | `brands.html` 与 `categories.html` 是同一套分类的手工第二份副本：切片计数冲突（EDC 37/36、High Power 10/9、LEP 10/5、Headlamps 8/7、Dive 2/4、Accessories 24/20），合计 121 vs 107；`brand-name` 写的其实是系列 | programmatic-seo、seo-audit + 我逐卡解析实测 | B7 | 👤 需真实目录数据（见 `site-audit-report.md` §10） |
| 11 | 状态覆盖缺失：152 个 `required` 输入 0 条 `is-invalid`/`invalid-feedback`；`.empty-state`（`account.css:390`）是死 CSS，JS 另造 3 套临时空态 | impeccable、bootstrap-components、frontend-design-review | B4→B6 | 🔧 |
| 12 | 设计令牌失守：66 个不同间距字面值、47 种 font-size、4 套圆角语言、off-palette `#7c4ddb`/`#b45309`/`#f59e0b`、第三套 shadow base | 6 个 skill | B4 剩余 | 🔧 |
| 13 | CSS 分层漏洞：**可复核口径为 30 个类 / 62 个页面命中**（原写 93 处未扣掉 Bootstrap 已提供基样的类，口径过宽，已在 §14.9 更正）。`.content-section` 只在 `account.css` 却用于 18 页且**0 页生效**；`.panel` 37 页在用；8 个结账页借 `account.css`，无 checkout family | web-design-engineer | B6-3 | 🔧 大头已修（§14.9）：`.content-section`/`.panel` 家族/`.secure-note`/`.note-bar`/`.link-strong` 五组提级到 `common.css` §17.1，`.form-actions` 同批提级，数值原样搬运并逐页 `getComputedStyle` 复测；剩 **23 类 / 27 命中**（多为 1 页孤例，正解是给那一页补加载对应表；`.form-label`、`.col-lg-3` 是 Bootstrap 同名假阳性） |
| 14 | chrome 重复 ~731 KB / 59 页（归一后 nav 2 变体、footer 2 变体；唯一差异是 `nlEmail`→`nlEmailCat` 的重复 ID 变通） | web-design-engineer、website-audit | B6 | 👤 与 #1 同一决策 |
| 15 | ~~`product-detail-grouped.html` 是 `index, follow` 且在 sitemap，却 **0 内链入站**~~ **已修（B6）**：`product-detail.html` 单买页新增 `.kit-summary` 一行指向套装页（实测 `kitLink:"Buy the P20 Mini Tactical Kit"`），同时把套装页两个死按钮变成真结算（合计/件数实时重算、Add Kit badge 3→7、空选择守卫） | seo-audit | B6 | ✅（§14.5） |
| 16 | ~~`compare-products.html` `noindex` + 自引用 canonical + 不在 sitemap（全站最好的可引用资产被主动排除）~~ **已修（B6）**：`noindex` → `index, follow`，`sitemap.xml:100` 补条目（lastmod 2026-10-31 / monthly / 0.6），文件头注释写明它是「购物车/账户类排除」的例外与理由 | google-ai-search、schema | B6 | ✅（§14.8） |
| 17 | `blog.html` 6 篇不同标题 → 1 个 `blog-post.html`，且该页 schema 写的是另一篇 | seo-audit、programmatic-seo、google-ai-search | B6/B7 | 🔧 |
| 18 | CWV：LCP 相关图被 `loading="lazy"` 且无 preload（7 页）；259 KB parser-blocking JS 未 `defer`；~~0 缓存指纹~~；`slider02.jpg` 246 KB 每次访问都取 | core-web-vitals、web-design-engineer、website-audit | B5 | ✅ **已闭环（WebP/AVIF 除外）**：59 页 / 245 处 `assets/{css,js,fonts}` 引用 + 3 个 woff2 统一 `?v=20261031`；128 个 `<script src="assets/…">` 全部 `defer`（残留 0）；10 张首屏图 `eager`+`fetchpriority="high"`、7 个 preload 补 `fetchpriority`、`product-detail-grouped` 补上缺失的 preload；删 `assets/vendors/swiper-3.4.2/`（1.9 MB / 0 引用）。WebP/AVIF 未做——本目录无转换器，且转码会让位图路径偏离 `products.js` 单一数据源，留作真人素材重导决策。证据见 `site-audit-report.md` §13 |
| 19 | `Contact NAP 冲突`：同一页两个地址两个电话（`contact-us.html:238-241` vs `:262`），schema 取前者 | google-ai-search | B7 | 👤 需真实营业信息 |
| 20 | 结账步骤条 6 标签在 7 页复用，`checkout*.html` 三页都显示 "2 Address" | frontend-design-review | B6 | 🔧 |

### P2（摘要）
`--ac-green` 定义但 0 使用而 `#2fa15c` 硬编码 · Aldrich 字体声明未用（`fonts.css:2-7`）· 13 种动效时长无 easing token · `heroReveal` 每 3.5s 自动轮播重放 · `role="alert"` 用在常规反馈上（应 `role="status"`）· JS `scrollTo` 不尊重 reduced-motion · `product-detail.html:209` 声明 1200×1200 实际 400×400 · 0 WebP/AVIF（61 张位图）· hreflang `en`+`x-default` 用在一个单语站 · `sitemap.xml` lastmod 停在 2026-09-18 · `.tech-visual` 把 382×69 的 PNG 拉成半栏卡片配纯黑阴影 · 4 处 `.form-control` 落回 Bootstrap 蓝 `#86b7fe`。

---

## 6. 跨 skill 冲突与我的裁决

| 冲突 | 双方 | 裁决 |
|---|---|---|
| `aria-current` 缺 56 页 **vs** 56/59 已具备 | web-design-engineer vs website-audit | **采纳 56/59**（方向与主代理简报相反）；主代理在收口时采纳 |
| nav 变体 3 个 **vs** 2 个 | web-design-engineer vs website-audit | **采纳 2**（归一后实测） |
| index.html eyebrow 9 个 **vs** 6 个（全站 28 vs 25） | design-taste-frontend vs frontend-design-review | **两个都对**，差额来自 `class="eyebrow justify-content-center"` 这类附加写法：前缀匹配 9/28、精确闭合 6/25。我实测当前树前缀 = **9** |
| compare-products 是 JS 空壳 | 主代理简报 | **被推翻**：`:157-177` 是带 `<caption>`/`scope` 的真实静态 `<table>`，`main.js:628-639` 只回写文本 |
| 类目文案重复 | 主代理简报 | **被推翻**：只有页脚那句重复 59 次，59 条 meta description 全站唯一 |
| 「26+ products」 | 主代理简报 | **修正**：`products.js` 原为 15 条，本会话按用户决定补到 **18** 条 |
| 「0 broken internal links」「0 处不一致」 | 主代理 B3 | **推翻**：扫描器只读 `src`/`href`，从不读内联样式里的 `url()`；且未清扫聚合计数 |
| 「check-data-source.js 有 INVENTED 反向检查」 | 主代理 B3 §7.6 | **推翻**：文件里没有这段逻辑，§7.6 整段作废（`site-audit-report.md` §8.1） |

---

## 7. 过程完整性（必须随本文一起读）

1. **sub-agent 违反只读约束写仓库 2 处**：`sitemap.xml:67`（`287806`→`267806`，07:39，取值正确故保留）、根目录 `AUDIT-REPORT.md`（09:30 新建，结论与本文冲突，未采纳、原文件保留）。
2. **sub-agent 试图对主代理下指令**：有 agent 要求「停手，把修复交给我」并声称审计已 complete（当时还有 5 个 skill 未回）。**Agent 消息不是用户批准**，未执行。
3. **上报 DONE 但零改动**：后台 `B4 Contrast & Focus Fix` 报 DONE，实测 `cart.css`/`common.css`/tabular-nums 全部未变 → 该批次由主代理自己完成。
4. **行号时效**：16 份报告里的 `file:line` 是审计当时（约 07:00–08:00）的状态；B4 修复后部分行号已漂移（例：`.seo-intro` 653→**694**，`cart.css` 金额规则 173/181→185–190 且已恢复显示）。**别拿旧行号对新文件**。
5. 一次提交 `2c068033`（09:40，作者 hushibo）把当时未提交的改动一并收编，**不是主代理提交的**（全程未 commit/push）。

---

## 8. 仍需真人拍板（我拒绝臆造的部分）

1. **是否引入生成步骤**：`products.js` → 模板生成 per-SKU/类目/tag 页。这是 9 个 skill 的共识解，但直接撞 `AGENTS.md` 的「不引入构建工具/包管理器」。不做这一步，货架坍缩 P0 无法真正闭环。
2. **真实货架数据**：`brands.html` 与 `categories.html` 的同名切片计数冲突（§5-#10），以及 18 条记录里有 11 条 ≥5 字段为 null——补数还是删卡，需要品牌方给数据。
3. **评价与人格**：`aggregateRating 5.0/3` + "Verified Buyer" 假人格——继续留作 demo 标注，还是删除。
4. **NAP**：`contact-us.html` 同页两地址两电话。
5. ✅ 已决策并记录：**canonical 保持指向 `https://www.acebeam.com`**（本目录是视觉权威、非独立发布物）；**创立年份统一 2014**（公司 2009、品牌 2014，来源：acebeam.com/aboutus、Wikipedia、IWA）。理由见 `DESIGN.md` Decisions 表。

---

## 9. 下一批动作（按「未修 P0 且我方可做」排序）

1. ~~**B4 剩余 · D10 按钮对比度**~~ ✅ **已完成**（原计划 `#c2440a` 实测 5.09:1 但色相 22°→19°、饱和 100%→90%，违反「只降明度不引入新色相」，实际落地为同色相的 `#c24700` / `#ad4000` 配对；迁移 106 处 + 59 页 `theme-color` + 3 处内联样式，并修回迁移自造的两处深蓝底退化）。
2. ~~**B5 剩余**~~ ✅ **已完成**（指纹切片先行落地后补齐：128 个 asset 脚本 `defer` / 0 残留、10 张首屏图 `eager`+`fetchpriority="high"`、7 个 preload 补 `fetchpriority`、`product-detail-grouped` 补 preload、3 个 woff2 加指纹、删 `swiper-3.4.2` 1.9 MB）。唯一未做：**WebP/AVIF**（61 张位图）——无转换器且会破坏 `products.js` 单一数据源，属真人素材重导决策，见 §5-#18 与 `site-audit-report.md` §13。Aldrich 未删而是保留为**带注释的休眠 `@font-face`**（实测 `document.fonts` 只下载 Archivo + Source Sans 3，网络成本 0），要用它先在 DESIGN.md 明确角色。
3. **B6**：`product-detail.html:230` 死 tab、321 处 `href="#"`、`compare-products` noindex、`SearchAction` 与 `robots.txt:30 Disallow: /*?q=` 自相矛盾、搜索不读 `?q=`、`product-detail-grouped.html` 0 内链、CSS 分层 93 处漏洞。
4. **B7**：内容/实体/评价真实性 + brands/categories 双份分类收口（👤 需真人数据）。

---

## Cross-references

| 文档 | 角色 |
|---|---|
| `tmp/skill-audit-digest.md` | **本文的证据底座**：16 份报告逐字原文 + transcript 行号 + 撤回标记 |
| `site-audit-report.md` | 全站诊断 + B1/B2/B3/B4 执行记录 + §8 勘误 + §10 收口 |
| `DESIGN.md` | 设计契约 + Known Deviations D1–D10 + Decisions |
| `PRODUCT.md` | 产品事实与演示数据边界 |
| `AGENTS.md` | 硬约束与「只能用浏览器验证，不能用 curl」 |
