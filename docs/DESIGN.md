---
name: Acebeam Storefront Design System
description: '"The Beacon" 信标 — 精密仪器级的手电电商视觉系统（信标橙 × 夜航蓝）'
colors:
  beacon-orange: "#e65300"
  beacon-orange-deep: "#d04a00"
  beacon-orange-text: "#c24700"
  beacon-orange-text-deep: "#ad4000"
  beacon-orange-soft: "#fff1e6"
  night-watch-navy: "#051c2c"
  navy-secondary: "#0d2438"
  navy-soft: "#12293f"
  ink: "#1a2230"
  slate: "#5c6b7f"
  mist: "#f2f4f7"
  line: "#e3e7ee"
  warm-white: "#fffdfb"
  signal-gold: "#ab7d08"
  star-off: "#7d8896"
  stock-green: "#2fa15c"
  alert-red: "#c93b3b"
  badge-purple: "#7c4ddb"
  badge-amber: "#b45309"
typography:
  display:
    fontFamily: "Archivo, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.01em"
  body:
    fontFamily: "'Source Sans 3', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "0.72rem"
    fontWeight: 700
    letterSpacing: "0.22em"
rounded:
  btn: "3px"
  sm: "4px"
  md: "10px"
  lg: "16px"
  pill: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "1rem"
  "4": "1.5rem"
  "5": "2.5rem"
  "6": "4rem"
components:
  button-primary:
    backgroundColor: "{colors.beacon-orange-text}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
    padding: "0.65rem 1.6rem"
  button-primary-hover:
    backgroundColor: "{colors.beacon-orange-text-deep}"
    textColor: "#ffffff"
  button-outline:
    backgroundColor: "#ffffff"
    textColor: "{colors.beacon-orange-text}"
    rounded: "{rounded.btn}"
    padding: "0.65rem 1.6rem"
  button-outline-hover:
    backgroundColor: "{colors.beacon-orange-text}"
    textColor: "#ffffff"
  product-card:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  sidebar-card:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "1.4rem"
---

# Design System: Acebeam Storefront

## Overview

**Creative North Star: "The Beacon"（信标）**

整个系统是一支立在夜里的信标：**夜航蓝是夜幕与深水**（通知栏、页脚、技术带、评论带、分销横幅——一切"信任与叙事"区域），**信标橙是那道扫过黑暗的光束**（吸顶导航、主 CTA、角标、链接、active 态、焦点环——一切"被看见"的时刻）。橙色从不铺满页面，它是稀缺的光；蓝色从不喧哗，它是承载光的夜。

**Tone: 精密仪表 / instrument-grade calm**（不是"暗色科技炫光"，也不是"暖棕手作"）。Acebeam 卖的是可被验证的物理能力（射程、光强、流明、IP 等级、10 年保修），界面要像量具与 datasheet：深色区负责"夜与光"的情绪，浅色区负责把数字读准。让按用途与参数选型的买家 3 秒内读出关键数字，顺利走到加购。

**Differentiation（全站唯一的"大胆"之处）**：把射程画成可读的物理量——产品卡与详情页的射程/光强以刻度条 + 等宽数字呈现，长度与 meters 成比例。用户离开后记住"那个把射程当尺子画的店"，而不是"那个橙色的店"。**已落地**：`main.js` §25 渐进增强（读取 `.prod-spec` 既有 Meters 文本注入 `.range-scale`，数据仍以文本为准、标尺 `aria-hidden`）+ `common.css` `.range-scale` 样式；比例基准 = 本页最大射程，同页卡片可横向比较。除射程标尺外一律克制：不做滚动视差、不做常驻循环动效、不做卡片套卡片。

**Key Characteristics:**
- 双色分工严格：橙 = 光（强调/行动），蓝 = 夜（信任/叙事），暖白灰 = 货架（内容）
- 直角微圆角按钮 + 1px 线框卡片，阴影只在交互时出现（静则平，动则升）
- Archivo 大写宽字距铭牌标签系统，正字距是刻意的仪器感
- 对比度决策以注释写死在 token 旁，是系统的一部分（The Contrast Ledger Rule）
- 签名组件：光学校正数量步进器、箭头形结账步骤条、通栏深蓝品牌铭牌

## Colors

一句话性格：**货架是暖白与浅灰的，光是一支橙色的，夜是一片深蓝的**。来源 `assets/css/common.css :root`（`--ac-*`，全部实测值；不得绕开变量硬编码）。

### Primary
- **信标橙 Beacon Orange** (`#e65300`，`--ac-beacon`)：**图形档**——眉标横杠、下划线、焦点环、渐变辉光、深色底（夜航蓝）上的橙字与橙图标。白底 3.75:1，非文字元素只需 3:1（WCAG 1.4.11）✅。
- **信标橙·文字档** (`#c24700`，`--ac-beacon-text`)：**任何承载文字的场景一律用它**——橙字铺浅底（白底 5.01、mist 4.54、soft 4.52）与白字铺橙底（吸顶导航、btn-accent、active 导航态、分页、步骤条、角标、skip-link、回到顶部）。与品牌橙**同色相 22°、同饱和 100%**，只把明度从 45% 压到 38%，肉眼仍是同一支橙。
- **信标橙·文字档深** (`#ad4000`，`--ac-beacon-text-dark`)：文字档表面的 hover/active（白字 5.98）与链接 hover（浅底 5.98）。规则：hover 必须比常态**更深**，否则「悬停点亮」的视觉语言反转。
- **信标橙·深** (`#d04a00`，`--ac-beacon-dark`)：仅保留给**大号数字**（PDP 售价 27.2px/900、评分 41.6px/900）——WCAG 大号字门槛 3.0，白底 4.50 ✅。
- **信标橙·浅底** (`#fff1e6`)：强调浅色投影面——下拉项 hover、列表 hover、手风琴展开、加号按钮 hover。

### Secondary
- **夜航蓝 Night Watch Navy** (`#051c2c`)：通知栏、页脚、技术带、评论带、分销横幅底色；品牌铭牌通栏色块；购物车角标、done 步骤、view-switch active。深色叙事区。
- **夜航蓝·次级** (`#0d2438`) / **hover** (`#12293f`)：深蓝区渐变过渡与 hover 档。

### Neutral
- **墨 Ink** (`#1a2230`)：主文字、标题、价格。非纯黑（禁止 `#000`）。
- **石板灰 Slate** (`#5c6b7f`)：次级文字。**彩色底上一律禁用灰字**，改用底色同系深色。
- **雾灰 Mist** (`#f2f4f7`)：浅灰分区底、面包屑带、qty 数值内凹底。
- **线灰 Line** (`#e3e7ee`)：全部 1px 边框与分隔线。
- **暖白 Warm White** (`#fffdfb`)：页面地面。禁止纯 `#fff` 作大面底色（组件内部白底除外）。

### 功能色（受限使用）
- **信号金 Signal Gold** (`#ab7d08`)：星级专用（白底 3.70:1、深蓝底 4.69:1，仅图形达 3.0 门槛）。
- **熄灭星 Star Off** (`#7d8896`)：空心星（从 1.37:1 压深到 3.60:1）。
- **在售绿 Stock Green** (`#2fa15c`) / **警示红 Alert Red** (`#c93b3b`)：状态语义专用，不做装饰。
- **角标紫** (`#7c4ddb`) / **角标琥珀** (`#b45309`)：仅限商品角标（Coming Soon / Limited）的豁免色，不得用作界面强调色。

### Named Rules
**The One Beam Rule（单光束规则）。** 全站唯一 accent（旧档原文）+ 每屏只允许一个主要橙色焦点区：吸顶橙条之外，页面主体的橙必须克制为 CTA/角标/链接级点缀；深蓝区允许 radial 信标辉光作为唯一合法渐变。第二强调色永远不存在。

**The Contrast Ledger Rule（对比度台账规则）。** 任何新增或修改的颜色 token，必须在 `:root` 注释里写明对白底/相邻底色的 WCAG 对比度结论。**对比度契约**：文字（含橙底白字与浅底橙字）走 `--ac-beacon-text` `#c24700`，白底 5.01:1 / 浅底 ≥4.52:1，全部达 AA 正文 4.5；非文字的橙（横杠、下划线、焦点环、辉光）留在 `--ac-beacon` `#e65300`，白底 3.75:1 满足 1.4.11 的 3:1。历史教训：曾以「700 字重 + .82rem 属大号粗体」自我豁免 3.75:1，但 WCAG 大号字门槛是 **≥18.66px 粗体或 ≥24px**，`.82rem`=13.12px 不构成大号字——该豁免注释已从 `common.css` 删除。深色夜航蓝带上的橙字**必须留在 `#e65300`**（压 navy 4.66 ✅；`#c24700` 只有 3.47 ❌），新增深蓝带时记得为 `.eyebrow` 这类通用规则写覆盖；**照片暗色遮罩上的橙字同理**（`.cat-tile-overlay` 的 `rgba(5,28,44,…)` 渐变本质就是 navy 遮罩）。现存四处覆盖：`.review-band .section-head .eyebrow`、`.tech-band .eyebrow`、`.feature-stats .stat strong`、`.cat-tile-cta`（`home.css`，曾被一刀切迁移成 `#c24700` 退到 3.47 后回滚）。**`<meta name="theme-color">` 不属于对比度契约**（它不承载文字），它的唯一口径是**等于用户滚动时实际贴在浏览器工具条下的那条 chrome**：本页 `topbar` 是 navy 但只在 38px 处存在、滚动即消失，吸顶 `.site-header` 的 computed background 是 `--ac-beacon-text` `#c24700`，所以 59 页写 `#c24700`。改头部底色时必须同步改它，否则工具条与吸顶条之间会出现橙色接缝。

**禁色**：AI 紫/蓝渐变、青蓝霓虹、纯黑阴影。需要新色时只用 `oklch()` 从既有色相派生，不得引入新色相。

## Typography

**Display Font:** Archivo（回退 "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif）
**Body Font:** Source Sans 3（同一回退栈）
**Label Font:** Archivo 微铭牌（大写 + 宽字距），无独立字体

**Character:** 仪器铭牌配工具书正文——Archivo 的硬朗几何承担"设备铭牌"角色（导航/按钮/价格/区块标题/读数），Source Sans 3 的人文灰度承担阅读与说明。全部自托管 woff2，`font-display: swap`。只有这两个家族进入页面；**Aldrich 仅在 fonts.css 声明、从未被引用**（休眠资产——要用就先在本文件明确角色，不要静默混入）。

### Hierarchy
- **Display**（Archivo 800–900, clamp(1.4rem, 2.6vw, 2rem)+, 大写, +.01em）：区块标题、hero 标题、深蓝带标题。
- **Headline**（Archivo 800, clamp(1.5rem, 3vw, 2.2rem)）：页面 H1（page-band）。
- **Title**（Archivo 700, .92rem / 1.35）：商品卡标题（两行截断）。
- **Body**（Source Sans 3 400, 1rem / 1.6）：正文；导语 .95rem/1.8 石板灰；行长上限 <80 字符；H1 与正文比 ≥2.5×，尺度用 `clamp()` 流式。
- **Label**（Archivo 700, .64–.82rem, +.06em–.22em, 大写）：眉标（.22em）、导航项（.1em）、按钮（.08em）、侧栏标题（.14em）、角标（.08em）。

### Named Rules
**The Instrument Plate Rule（铭牌规则）。** 需要"读取为设备"的文字（导航/按钮/角标/侧栏标题/区块标题）一律 Archivo 大写 + 正字距（+.06em–.22em）。标题字距是**正的**（+.01em），刻意为之——不要改成紧排。

**The Tabular Numerals Rule（等宽数字规则）。** 价格、流明、candela、射程、表格金额一律 `font-variant-numeric: tabular-nums`，保证数字右端对齐可比较。（已在 `common.css` 统一落地，见 D3。）

### 禁止
为"高级感"临时上衬线；在 sans 标题里塞斜体衬线词强调（用同族 bold/italic）；在每个 section 标题上方加 ALL-CAPS 眉标签——**现有 `.eyebrow` 属存量冻结：已有页面不强制拆除，新增区块不得再加**。**假斜体已修**（2026-10-31）：hero 的 `em` 强调改为非斜体（色彩 + 字重，`home.css`），两套字体都没有真斜体面；唯一保留的合成斜体是 `.review-card blockquote`（引语排版惯例，小字号可接受）。

## Layout

Bootstrap 5 栅格之上的宽场布局：标准容器阶梯（540/720/960/1140/1320），**≥1580px 视口放宽到 1560px**（1400–1579px 刻意不动，避免容器退化贴边，1366/1440 笔记本在此区间）。**阈值不取 1560 的原因**：桌面端纵向滚动条会吃掉约 10px，1560px 的窗口实际可用宽度只有 ~1550px，容器反而被顶出 2px 横向滚动（旧值实测复现，已改）。区块纵向呼吸 `clamp(2.6rem, 5vw, 4.4rem)`（section-pad），次级 `clamp(2rem, 3.5vw, 3rem)`。

吸顶导航（sticky, z-1030）+ 38px 通知栏构成双层头；锚点统一 `scroll-margin-top: 96px`。商品区 1/2/4 列栅格，分类瓦片 1/2/3 列；密度中等偏松：卡片内 padding 1.1–1.4rem，栅格 gap 1.5rem。**导航紧凑档覆盖 992–1399px**：992–1199（容器 960px）用 .73rem / 搜索框 132px；1200–1399（容器 1140px）用 .74rem / 165px —— 未压缩的整行导航需 ~1223px，在这两档都会顶破容器（1200px 实测溢出 55px、1280px 15px、992px 30px，购物车角标被推出屏幕），1400px 起容器升到 1320px 才恢复完整尺寸。断点沿 Bootstrap（576/768/992/1200/1400）+ 自定义 1580。

**间距刻度**：`--sp-1..6` = .25/.5/1/1.5/2.5/4rem——**必须真正使用**，形成"紧凑成组—宽松分组"的节奏。区块纵向呼吸由语义 token 承载：`--section-y`（2.6→4.4rem）/`--section-y-sm`（2→3rem），`.section-pad`/`.section-pad-sm` 直接引用它们，页面不再各自硬编码 clamp。分隔优先用负空间与分隔线，**不要给每块内容套圆角卡片**；内容列左对齐优先，**不要把一切都居中**。（刻度落地进度见 Deviations D1。）

## Elevation & Depth

**静则平，动则升。** 静止卡片平坦：白底 + 1px 线灰边框，无阴影。抬升只发生在三种时刻：① 卡片 hover（translateY(-4px) + shadow-md + 边框转橙）；② 浮层（下拉菜单、回到顶部）；③ 角标微投影。阴影全部用夜航蓝着色而非黑灰——影子也属于这个夜。禁止纯黑阴影、禁止新增第三种阴影值。

### Shadow Vocabulary
- **shadow-sm**（`0 2px 10px rgba(5,28,44,.06)`）：轻微浮起，备用档。
- **shadow-md**（`0 8px 28px rgba(5,28,44,.10)`）：卡片 hover、下拉菜单、回到顶部。
- **header glow**（`0 3px 14px rgba(208,74,0,.28)`）：吸顶橙条专属投影，影子带橙——光下的影子。
- **badge micro**（`0 2px 8px rgba(5,28,44,.2)`）：商品角标专属微投影。

### Named Rules
**The Flat-At-Rest Rule（静则平规则）。** 卡片静止时禁止阴影；阴影是交互的回应（hover/focus/浮层），不是装饰。豁免仅限浮层元素与商品角标。

## Shapes

**直角微圆角的仪器感，圆角只给容器。** 按钮 3px（--btn-radius，代码注释明示"参照效果图为直角微圆角，非胶囊"）；小控件 4px（radius-sm）；内容容器 10px（radius：下拉、手风琴组）；大容器 16px（radius-lg：商品卡、侧栏卡）。胶囊 999px 保留给"小而圆"：角标、标签云、newsletter 输入框、回到顶部。禁止胶囊与全站统一大圆角混用。

边框语言：1px 线灰一统天下；两处破格——选购指南卡顶部 3px 橙杠（border-top）、侧栏标题下 2px 橙杠。签名几何：结账步骤条 clip-path 箭头形分段（首尾特判），窄屏只留序号不横向滚动。

## Components

### Buttons
- **Shape:** 直角微圆角（3px），非胶囊。
- **Primary（btn-accent）:** 文字版橙底（`--ac-beacon-text` `#c24700`）白字 5.01:1，Archivo 700 大写 +.08em，.82rem，padding .65rem 1.6rem；hover/active `--ac-beacon-text-dark` `#ad4000`（白字 5.98，比常态更深）。
- **Outline（btn-outline-accent）:** 白底橙字橙框（`--ac-beacon-text`，浅底 5.01）；hover 文字版橙底白字反转。
- **Navy（btn-navy）:** 深蓝底白字；hover `#0d2438`。
- **Qty 步进按钮:** 44×48px，+/− 伪元素画等粗笔画（光学校正），hover 橙浅底，focus 内嵌 2px 橙环。
- **Focus:** 全局 `:focus-visible` **3px 实色**信标橙外环 + 2px offset（半透明 .45 环对浅底仅约 1.9:1，不达 WCAG 1.4.11，故用实色）；`.hero`/`.site-footer`/`.page-band` 换白环。`.btn` 上的焦点用同特异性 `.btn:focus-visible` 覆写 Bootstrap 的 `outline:0`（D4 已闭环）。
- **尺寸体系:** 三档一律走 `--bs-btn-*` 变量：默认档挂在 `.btn-accent:not(.btn-sm, .btn-lg)`（特异性 0,2,0，压得住基础 `.btn`），`.btn-sm`/`.btn-lg` 各自显式覆写——不要用 `:where()`，其 0,0,0 会被基础 `.btn` 反压（D6 已闭环）。

### Badges / Tags
- **Style:** 胶囊，.64rem Archivo 700 大写 +.08em，白字；语义取达标色（New=橙、Hot=红、Anniv=深蓝、Coming Soon=紫、Limited=琥珀）。
- **State:** 商品卡左上 12px 定位 + 微投影；白字底色必须 ≥4.5:1（台账规则管辖）。

### Cards / Containers（商品卡 = 签名组件）
- **Corner Style:** 16px（radius-lg）。
- **Background:** 白底 + 1px 线灰边框，静置无阴影。
- **Shadow Strategy:** hover translateY(-4px) + shadow-md + 边框转 45% 橙；图片 scale(1.05)，底部 CTA 同步点亮橙浅底——"整卡可点"无需找按钮。
- **Internal Padding:** 1.1rem 1.2rem 1.3rem；内部 grid 四行：规格行（圆点分段）→ 两行截断标题 → 价格（Archivo 900 1.2rem）与评分同行两端 → CTA 贴底。

### Inputs / Fields
- **导航搜索:** 白底无边框 4px 圆角，内嵌右侧 32×30 搜索钮；placeholder 石板灰。
- **Newsletter（深蓝区）:** 半透明白 8% 底 + 18% 边框胶囊。
- **Qty 分段控件（签名）:** 三段式——按钮 | 内凹雾灰数值框（左右 1px 分隔）| 按钮；focus-within 橙框 + 3px 14% 橙光晕。
- **表单焦点范式:** 边框转橙 + 3px 14% 橙光晕（qty-control 模式）。

### Navigation
- **Style:** 吸顶整条信标橙；品牌铭牌为通栏深蓝色块（负 margin 顶天立地贯穿橙条，高≈59px，无圆角——不是贴纸）。导航项 Archivo 600 .8rem 大写 +.1em 白字，hover/active 底部 2px 白杠 scaleX 展开。
- **Dropdown:** 白底 10px 圆角 + shadow-md；项 hover 橙浅底橙字。
- **Mobile:** ≤991px 折叠为橙底手风琴面板，搜索框整行，工具钮右对齐。

### 结账步骤条（签名）
箭头形分段进度（clip-path，首段平头、尾段平尾）：待办=雾灰底石板字、active=橙底白字、done=夜航蓝底白字（序号后缀"."→"·"）；窄屏收起步骤名只留序号。

### 侧栏卡
白底 16px 圆角；标题微铭牌 + 左侧 8px 橙方块 + 底部 2px 橙杠；列表项 8px 圆角 hover 橙浅底，active 橙底白字。

## Do's and Don'ts

### Do:
- **Do** 把信标橙当稀缺资源：一屏一个焦点区，其余点缀到 CTA/角标/链接为止（The One Beam Rule）。
- **Do** 新增颜色时在 token 注释写对比度结论（The Contrast Ledger Rule）。
- **Do** 用夜航蓝着色阴影；深蓝区允许 radial 信标辉光。
- **Do** 保持深色叙事带与浅色购物区的交替节奏。
- **Do** 使用 `--sp-*` 间距刻度与 `--ac-*`/`--radius-*`/`--shadow-*` token，不用字面量；流式用 `clamp()`。
- **Do** 共享组件基样式进 `common.css`（qty 步进器曾因留在页面 CSS 导致购物车页退化）。
- **Do** 改数值后跑 `node tools/check-data-source.js` 退出 0。
- **Do** 改完在浏览器里实测（不用 curl 结论替代浏览器结论）；交互元素真的点一次。

### Don't:
- **Don't** 引入第二强调色相；角标紫/琥珀是商品角标专属豁免。
- **Don't** 用纯白做页面底、纯黑做阴影。
- **Don't** 把按钮做成胶囊（3px 是效果图谱系决定）。
- **Don't** 给静止卡片加阴影（The Flat-At-Rest Rule）。
- **Don't** 渐变文字、玻璃拟态、彩色零偏移光晕、青蓝霓虹。
- **Don't** 紧排标题（正字距铭牌感是本系统的字声）。
- **Don't** 新增区块加眉标签（存量冻结）；不用箭头"→"当按钮后缀；不卡片套卡片。
- **Don't** 臆造规格、SKU、创立年份、目录规模——冲突条目等真人拍板。
- **Don't** 用系统字体顶替 Archivo/Source Sans 3 的展示角色。

## Motion

- 只在**一次编排好的入场**上用动效（Hero 文案分级出现）；**逐节滚动 fade-up 是默认 AI 腔，禁止**（D9 已闭环：全站 `.reveal` 类与对应 CSS/JS 均已移除，grep 0 命中）。
- 缓动只用 ease-out-quart/quint/expo；禁止 bounce/elastic；只动 `transform`/`opacity`，不动画 width/height/padding/margin。
- 动效只回答"发生了什么"（展开、确认、数量变化），不做无人触发的常驻微动效。
- `prefers-reduced-motion` 已在 CSS 与 JS 双端处理，任何动效改动不得回退。

## Interaction Contracts

- 每个可点元素必须真的可点：新增/修改交互后在浏览器点一次，不接受"看起来能用"。
- 焦点可见：任何新组件实测 `getComputedStyle(el).outlineStyle`（D4 修复前尤其重要）。
- 触控目标 ≥44px（购物车步进器已达标，保持）；搜索框字号 ≥16px 防 iOS 聚焦缩放。
- 空态教用户怎么用，错误态说明怎么修，不做只有转圈的加载。
- **`href="#"` 只允许出现在「JS 驱动控件」上，且必须同时带 `data-*` 钩子**（分面、移除行、tab 跳转等）。纯导航一律指向真实页面；没有目标就不做成链接（用 `<span>`）。审计按「有无 `data-*`」判定，不按 `href="#"` 计数。**现状 0 处**：`search.html` 4 个价格分面已改指 `#results`，其余 JS 控件均为 `<button>`。
- **表单校验态由 main.js 统一注入**：所有 `required` / `pattern` 字段在提交时生成 `.invalid-feedback` + `aria-invalid` + `aria-describedby`，聚焦首个错误并 toast；错误文案必须说「怎么修」，不用浏览器默认气泡。深色页脚（`#051c2c`）上的错误色用 `#ffb3a4`/`#ff8d78`（品牌红在深蓝上只有 3.45:1）。
- **数字要么可推导，要么不写**。分面计数、结果数、套装合计一律从真实卡片/`products.js` 算出；禁用 JS 时静态值必须等于算出来的值（`search.html` 价格分桶 (0)(1)(3)(2) 即为此例）。做不到就删掉这个数字，不要留「107 results + 9 页分页」这种点了没反应的编排。
- 步进器下限认 `<input>` 自己的 `min`（单买 `min="1"`，分组/套装行 `min="0"` 表示「这一件不要」），不要用全局常量把用户输入的 0 夹回 1。
- 分享/复制链接一律用该页 `<link rel="canonical">`，不用 `location.href`（本地预览是 `127.0.0.1`，复制出去对别人无意义）；剪贴板不可用时给可执行的下一步，而不是只说「Copy failed」。

## Accessibility Floors

- WCAG 2.1 AA 基线；每页恰好一个 `<h1>`，标题层级不跳。
- 键盘全程可达；skip-link 保持；tabs/accordion/dropdown 的 ARIA 语义与真实 DOM 匹配——**写 `role="tab"` 必须有 `role="tablist"` 祖先**（D5）。
- 图片必须有 `width`/`height`、`decoding="async"` 与有意义 `alt`。
- 动效尊重 `prefers-reduced-motion`。

## Multilingual / hreflang contract

下游 nopCommerce 5.0 主题与 Next.js 商城在 `https://www.acebeam.com/` 上线多语言时，按本节执行。**当前静态原型只有英文版**：59 页 `<head>` 已恢复 `en` + `x-default` 两条真实声明，`zh-CN` 有意缺席——等中文版可访问后再成组补齐，不提前声明不存在的 URL。

- **URL 用路径前缀**：`/en/…`、`/zh/…`（nopCommerce 的 language SEO prefix 或独立商店域名）。不要用 `?language=zh`：容易与 `?q=`/`?page=` 的参数规则、canonical 和缓存键混在一起；路径前缀也更适合 CDN 与 hreflang。
- **canonical 按语言自指**：英文页 canonical 指向 `/en/…`，中文页指向 `/zh/…`。禁止所有语言共用英文 canonical——那会和 hreflang 直接冲突。
- **每页输出完整集群，含自身**：英文页声明 `en`、`zh-CN`、`x-default`；中文页同样声明三条。缺一条就会让 Google 忽略或误判整组。
- **`x-default` 指向默认版本**：Acebeam 取英文首页（或独立语言选择页），不指向某个具体 SKU。
- **只声明可抓取的真实 URL**：中文版发布前不写 `hreflang="zh-CN"`；语言切换器必须是 `<a href>` 可抓取链接，不用 cookie/JS 自动跳转替代索引信号。
- **`<html lang>` 与页面语言一致**：中文页 `lang="zh-CN"`，英文页 `lang="en"`；hreflang 值使用 `en` / `zh-CN`。
- **sitemap 同步**：多语言上线后，每个 `<url>` 配完整 `xhtml:link` 组，或按语言拆分 sitemap；`lastmod` 按语言各自维护。当前单语言阶段 sitemap 不写 alternates（自指没有信息量）。
- **robots.txt 不能挡住语言路径**：现有规则只 disallow `?q/?sort/?page/?view/?price`，`/zh/` 路径可抓取；新增语言路径时不要误加 Disallow。
- **实现位置在模板，不在页面**：nopCommerce 主题应从语言列表与本地化路由生成上述标签，禁止逐页硬编码；本目录 59 页的写法是**输出形状参考**，不是最终数据源。

参考输出（当前英文占位，`zh-CN` 上线后追加一条）：

```html
<link rel="canonical" href="https://www.acebeam.com/en/product-detail.html">
<link rel="alternate" hreflang="en" href="https://www.acebeam.com/en/product-detail.html">
<link rel="alternate" hreflang="zh-CN" href="https://www.acebeam.com/zh/product-detail.html">
<link rel="alternate" hreflang="x-default" href="https://www.acebeam.com/en/product-detail.html">
```

## Known Deviations（待修清单，均有实测出处；修复时逐条勾销）

| # | 事实 | 出处 | 影响 |
|---|---|---|---|
| **D1** | ~~间距刻度 `--sp-1..6` 全站仅 1 次引用~~ **部分收口（B8）**：新增语义 token `--section-y`/`--section-y-sm`，`.section-pad`/`.section-pad-sm` 改引它们；把字面值精确等于刻度的地方改回 token（`.products-view .row` gutter→`--sp-4`、`.tag-cloud` gap→`--sp-2`、`.field-row` gap→`--sp-3`、`.usecase-list` gap→`--sp-3`）。**残留**：卡片 padding、`section-head` 下距、`hub-grid`/`guide-grid` gap 等仍是 1.15–1.4rem 的近似字面值，待视觉走查逐档归并（不做无 QA 的批量替换） | `common.css:42-52`、`:742-743` + grep | 节奏已有统一出处；"AI 味"主因部分缓解 |
| **D2** | ~~767.98px 以下同时 `display:none` 了 `.ci-price` 与 `.ci-total`~~ **已修（B4）**：改为两栏区域图，`Each`/`Total` 带小标签，320/375/768 实测无重叠、金额可见 | `assets/css/cart.css` 媒体查询 | ~~手机购物车看不到任何金额~~（P0，已闭环） |
| **D3** | ~~`font-variant-numeric: tabular-nums` 命中 0 次~~ **已修（B4）**：`common.css` 新增统一规则，实测 `.ci-total`/`.prod-price` computed 为 `tabular-nums` | `common.css` | ~~数字/价格右端不对齐~~（已闭环） |
| **D4** | ~~`:focus-visible` 被 Bootstrap `.btn:focus-visible{outline:0}`（0,2,0）压掉~~ **已修（B4）**：改用同特异性 `.btn:focus-visible` + `box-shadow:none`，实测 `outlineStyle:"solid"`；`.hero`/`.site-footer`/`.page-band` 上换白环 | `common.css` §7 | ~~键盘用户看不到焦点~~（P0，已闭环） |
| **D5** | ~~`data-bs-toggle="tab"` 的 `<a role="tab">` 无 `.nav`/`[role=tablist]` 祖先~~ **已修（B6）**：`product-detail.html:230` 改为 `href="#productTabs" data-tab-jump="reviewsTab"`，由 `main.js` §22 走 Bootstrap Tab API（`new bootstrap.Tab(btn).show()`），无 JS 时退化为纯锚点。实测 `afterActive:"reviewsTab"`、`paneSelected:"true"`，滚动停靠 96px 对齐 `common.css:761` 的 `[id]{scroll-margin-top:96px}` | `product-detail.html:230` | ~~"3 Reviews" 死链且报错~~（已闭环） |
| **D6** | ~~`.btn-accent` 直接写 padding/font-size，压掉 `.btn-sm/.btn-lg`~~ **已修（B4）**：字面量改为 `:not(.btn-sm,.btn-lg)` 默认档 + 显式 sm/lg 档，实测三档高度 11.84 / 13.12 / 16px，`.btn-lg` padding `12.8px 32px` | `common.css` §7 | ~~按钮尺寸体系失效~~（已闭环） |
| **D7** | ~~320 处 `href="#"` 死锚点~~ **已修（B6/B7）**：全站 **0 处**。`back-in-stock.html` 的 3 个移除控件改成 `<button>`；`search.html` 的 4 个价格分面改指 `#results`（JS 仍 `preventDefault()`），不再有跳顶风险。其余改指真实页面或直接删除（博客归档 `<a>`→`<span>`、`my-product-reviews.html` 的 3 个假 Edit）。死链扫描 problems none | 死链脚本 + grep | ~~EN 切换器/All News/博客 Read More 点了没反应~~（已闭环，约定见 Interaction Contracts） |
| **D8** | ~~卡片阵列同构（分类/品牌/新品页），缺分组节奏~~ **部分收口（B8）**：`categories.html` 的 `.hub-grid` 与 `brands.html` 的 `.brand-grid` 在 ≥992px 改用显式 3 列，首张（`.hub-tile-lg` / `.brand-card-lg`，旗舰系列）跨两列（8+1=9 格 = 3 整行无空洞）；品牌旗舰卡改横排（图左文右）。窄屏维持 auto-fit 单列堆叠，不做跨度。**残留**：`new-products.html` 商品栅格仍与列表页同构（商品卡是标准化组件，刻意不破） | `categories.css`、`content.css`、`categories.html`、`brands.html` | 分类/系列页有"主角—配角"层次 |
| **D10** | ~~`.btn-accent` 白字压 `#e65300` 实算 3.75:1，未达 AA 正文 4.5~~ **已修（B4 续）**：新增 `--ac-beacon-text` `#c24700`（同色相 22°/同饱和 100%，明度 45%→38%）与 `--ac-beacon-text-dark` `#ad4000`，把 106 处「承载文字的橙」（CSS 103 + HTML 内联 3）全部迁过去（`common.css:12-19` 注释已改写，自我豁免注释删除）。浏览器实测 59 页 3,180 个可见文字节点：AA 未达标仅剩 1 处——分页 `‹` 禁用箭头（WCAG 1.4.3 非活动控件豁免）；吸顶头/按钮/active 态/眉标实测 5.01:1。深蓝带反向问题同步收口：`.review-band .eyebrow`、`.feature-stats .stat strong` 保留 `#e65300`（4.66），59 页 `theme-color` 改 `#c24700`（跟随吸顶条 computed background，非对比度理由，见 Contrast Ledger Rule 末段） | `common.css:12-19`、`:311-345`、`home.css` §Review band、`product-detail.css:193` + 浏览器 `getComputedStyle` 全站点名 | ~~全站 ~50 个主 CTA 不达标~~（已闭环） |
| **D9** | ~~`.reveal` 逐节 fade-up 与 Motion 法则（只允许一次编排入场）冲突~~ **已修（B7）**：删除 `common.css` 的 `.reveal` 规则与 `main.js` 第 14 节 IntersectionObserver，59 页 HTML 的 `reveal` 类全部移除（grep 0 命中），不回退 reduced-motion 保护 | 全站 HTML + `common.css` + `main.js` | ~~滚动时整页逐节淡入的模板感~~（已闭环） |

## Decisions（人类/品牌级决定，改动前必读）

| 决定 | 结论 | 理由 |
|---|---|---|
| **canonical / og:url / sitemap 指向** | 保持 `https://www.acebeam.com`，**不改** | 本目录是 `acebeam-storefront`（Next.js）与 nopCommerce `acebeam` 主题的**视觉权威**，不是待独立发布的站点。若把 canonical 改成本地/演示域名，反而会让真实站点与派生实现失去统一的规范链接；独立发布时再由发布方改写域名。 |
| **品牌成立年份** | 全站统一 **2014**；工厂/公司起点 2009 只在 about-us 叙述中出现 | `acebeam.com/aboutus`、Wikipedia、IWA 展台资料一致：公司 2009 年成立、品牌 2014 年创立。此前页脚写 2013 无任何来源支撑，59 页已改 2014；`about-us.html` 的 `foundingDate:"2014"` 与正文本就一致。 |
| **目录总数口径** | `all-products.html` 的 `of N results` = 侧栏 `All Products (M)` = **107** = 该页 8 个互斥分类分面之和；`check-data-source.js` 断言 `N ≥ 每个分面` 且 `N == M`。**B6 补充**：107 这个分母保留，同页的**9 页假分页删除**，标题句改为「Showing **12** of 107 lights」 | 107 是**可推导**的（36+26+7+9+5+4+12+8），且 `categories.html` 的 8 个 hub-count 是同一多重集合、同样合计 107。`US Warehouse (26)` 是可重叠的库存筛选，不计入总和。**为什么不改回 12**：那会让「Showing 12 of 12」与同页侧栏 `(107)` 直接打架；真正不可信的是「点了没反应的分页」，删它即可，翻页交给后端。`.pagination` CSS 有意保留，供下游主题复用。 |
| **分类页/品牌页的分面计数** | 分面计数是**同一维度的切片声明**，可重叠者（`US Warehouse`）不计入总数；`categories.html` 与 `all-products.html` 已实测为同一多重集合、合计 107 | **两处自我更正**：① 原「107/121/36/15 四方矛盾」是过度归纳——`products.js` 的 18 条只是 demo 精选子集，与对外目录规模不同口径，我当时把总数改成 18 反而制造了同页矛盾（总数比某个分面还小），已回退为可推导的 107。② 但 `brands.html` 与 `categories.html` 在**同名切片**上确实互相打架（EDC 37 vs 36、LEP 10 vs 5、High Power 10 vs 9、Headlamps 8 vs 7、Dive 2 vs 4、Accessories 24 vs 20），且该页把产品**系列**当作品牌列出（"Tactical Series"）——属 IA + 内容问题，需要真实目录数据，见 site-audit-report §10。**已解（2026-10-31）**：`brands.html` 的 6 个同名切片已对齐 `categories.html`（Tactical 26 / EDC 36 / LEP 5 / LED Headlamps 7 / High Power 9 / Dive 4），剩余两格 Rail-Mounted 4 + Accessories 16 = 20，正好对应 categories 的 Batteries & Chargers 8 + Mounts & Accessories 12，两页合计均为 **107**。`tools/check-data-source.js` 已加断言（同名切片计数相等 + 两页总数相等），负向测试已验证会报错。 |

## Cross-references

| 文档 | 角色 |
|---|---|
| `README.md` | 目录结构、本地预览（127.0.0.1:8099）、工程硬约束 |
| `PRODUCT.md` | 产品事实：受众（零售为主+B2B 次要）、定位、约束、品牌承诺、证据状态、无障碍底线 |
| `site-audit-report.md` | 全站诊断 + B1–B7 执行记录 + §8 勘误（改数据前先读） |
| `AUDIT-REPORT.md` | 三技能联合审计（claude-seo / impeccable / security-audit，2026-10-31）+ 9 条行动清单 |
| `tools/check-data-source.js` | 数据一致性验收（含 FL1 `distance = 2√candela` 物理自洽） |
| `skill-audit-report.md` | 16 个 skill 逐项评审与合并判定（共识矩阵 / 冲突裁决 / P0-P2 映射 B4-B7 / 过程完整性） |
| `../nop50/docs/themes/acebeam/AGENTS.md` | ⚠️ README 引用的路径当前不存在，需要时先与用户确认位置 |
