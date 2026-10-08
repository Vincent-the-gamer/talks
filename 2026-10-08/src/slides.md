---
theme: seriph
colorSchema: dark
layout: cover
class: text-center
glow: bottom
glowOpacity: 0.5
title: 又懒又穷的我，使用 Agent 的过程
author: 诡锋
info: |
  ## 又懒又穷的我，使用 Agent 的过程

  诡锋的第一期杂谈 · 2026-10-08

  用免费的 Agent 方案，把日常的重复劳动交出去。
transition: slide-left
routerMode: history
mdc: true
drawings:
  persist: false
exportFilename: slides
download: true
---

# 又懒又穷的我
# 使用 Agent 的过程

<div class="pt-8 opacity-70">
诡锋 · 第一期杂谈
</div>

<div class="abs-br m-6 text-sm opacity-40">2026-10-08</div>

<!--
【开场】看向镜头，轻松点。

大家好，我是诡锋。欢迎来到我的第一期杂谈。

先说一嘴 —— 这是「杂谈」，不是「教程」。
所以待会儿我哪句说得不对，你就当我在跟你唠嗑，别太当真。

本期主题，我纠结了很久。最后定成了——「又懒又穷的我，使用 Agent 的过程」。
我先声明啊，这不是什么励志故事。我不是那种"自律使我自由"的人。
恰恰相反。我连打开终端，都得先做个心理建设。
-->

---
glow: bottom-left
---

# 目录

<v-clicks>

1. **工作流架构** —— Agent 是大脑，MCP 是接口，Skill 是说明书
2. **免费方案** —— OpenCode 免费模型打底，DeepSeek API 兜底
3. **基础建设** —— 本地服务 · Skill · MCP（附两个实战案例）
4. **造工具 · 修工具** —— 让 Agent 从「用工具」走到「改工具」
5. **结语** —— 懒，是一种生产力

</v-clicks>

<!--
有一种东西，它就是专门为懒人和穷人生长的。它叫 Agent。

所以今天，我不聊原理，不聊论文。就聊一件事——
一个又懒又穷的人，是怎么把 Agent 的价值，一点一点榨出来的。

先看下今天要讲什么……
1. 我的工作流架构图
2. 使用免费的 Agent 方案
3. 基础建设：用现有的 Skill、MCP，去引导 Agent 正确使用 CLI 和客户端
4. 利用 Agent，开发自己的工具，或者修复那些跑不起来的工具
5. 最后是结语，让大家自己发挥创造力

好，我们开始。
-->

---
layout: section
glow: top-right
---

<div class="text-sm tracking-widest opacity-40">PART 01</div>

# 工作流架构

<!--
先上一张我平时的工作流架构图。别看它长得挺唬人，其实一句话就能概括。
-->

---
glow: bottom-right
---

# 工作流架构

<div class="opacity-70">Agent 是大脑，MCP 是接口，Skill 是说明书。</div>

```mermaid {scale: 0.7}
graph TD
    U["我"] --> OC["OpenCode（Agent）"]

    subgraph MCP["MCP · 接入客户端"]
        AB["agent-browser"] --> Browser["浏览器（复用登录态）"]
        BN["Binary Ninja"] --> Binja["Binary Ninja"]
        X["其它 MCP ..."] --> App["其它客户端"]
    end

    subgraph SKL["Skill · 驱动 CLI"]
        SK["对应 Skill"] --> CLI["CLI 工具"]
    end

    OC -->|MCP| AB
    OC -->|MCP| BN
    OC -->|MCP| X
    OC -->|Skill| SK
```

<!--
【点开架构图】
-->

---
glow: full
---

# 拆成三层，就很朴素

| 层 | 定位 | 职责 | 代表 |
| --- | --- | --- | --- |
| **OpenCode** | 大脑 | 理解意图 · 拆解任务 · 调度工具 | Agent 运行时 |
| **MCP** | 接口 | 把 Agent 的手伸进 GUI 客户端 | `agent-browser` · Binary Ninja |
| **Skill** | 说明书 | 教会 Agent 正确调用 CLI 工具 | `writing-for-agents` |

<div v-click class="pt-6 text-lg opacity-80">

- Agent 负责动脑子，我负责提需求
- 现实里的工具就两种：**GUI 用 MCP 接**，**CLI 用 Skill 驯**
- 三层搭好，不管对面是啥工具，Agent 都「够得着」

</div>

<!--
这张图第一眼看过去……是不是有点像某公司年会 PPT 里，硬凑出来的"中台架构"？
但你先别急着划走。我给它拆成三层，你会发现它其实特别朴素。

第一层，Agent，也就是大脑。它跑在 OpenCode 里。
它负责动脑子：理解我到底想要啥、把任务拆开、决定下一步该去戳哪个工具。
说白了，它是那个真正干活的。我啊，我就是那个提需求的甲方。

第二层，MCP，也就是接口。它的活，是把 Agent 的手，伸进各种客户端里。
比如用 agent-browser 这个 MCP，直接操控你已经登录的浏览器。

第三层，Skill，也就是说明书。给那些"没有现成 MCP"的命令行工具准备的。
用一份对应的 Skill，告诉 Agent：这玩意儿该怎么正确调用，哪些坑千万别踩。
-->

---
layout: two-cols
layoutClass: gap-10
glow: bottom
---

# 两类工具，两种接法

**GUI 客户端** —— 有界面、能交互

<div class="pt-4 opacity-80">

用 **MCP** 接入，
把 Agent 的操作映射到界面之上。

</div>

**命令行工具** —— 无界面、纯 CLI

<div class="pt-4 opacity-80">

用 **Skill** 驱动，
把「怎么调用、哪些坑」写成说明书。

</div>

::right::

<div class="flex h-full flex-col justify-center gap-8">

<div class="tool-card">
<div class="text-2xl">🖥️ GUI 客户端</div>
<div class="pt-2 opacity-70">→ MCP</div>
</div>

<div class="tool-card">
<div class="text-2xl">⌨️ 命令行</div>
<div class="pt-2 opacity-70">→ Skill</div>
</div>

</div>

<style>
.tool-card {
  padding: 1rem 1.2rem;
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
</style>

<!--
那为什么要分这三层？因为现实里的工具，就两种。
一种是带界面的，GUI 客户端。另一种，是黑乎乎的命令行。
前者，用 MCP 能接上。后者，用 Skill 能驯服。
这么一搭，你看——不管对面是啥工具，Agent 都能"够得着"。那我呢？我就不用亲自伸手了。
-->

---
layout: section
glow: top-left
---

<div class="text-sm tracking-widest opacity-40">PART 02</div>

# 免费方案

<!--
架构聊完，接下来是最灵魂的问题：又穷、又懒，还想用 Agent，方案是啥？
-->

---
glow: center
---

# 方案：免费打底，付费兜底

| | 主方案 | 兜底方案 |
| --- | --- | --- |
| **工具** | OpenCode 免费模型 | DeepSeek API |
| **成本** | 免费 | 按量付费 |
| **门槛** | 免登录即用 | 需 API Key |
| **适用** | 轻度 ~ 中度日常 | 高强度 · 长任务 |

<div v-click class="pt-8 text-xl opacity-85">

结论：日常先白嫖，把「给钱」这一步往后放。

</div>

<!--
答案特别朴素——用 OpenCode，白嫖它的免费模型。
OpenCode 官方本身就带一些免费模型。不用登录，直接就能用。
也不需要什么 OpenCode Zen。当然，你要想登录、想绑定，那也行，没人拦着你。

当然，成年人得有 Plan B。我的兜底方案，是 DeepSeek 的 API。
至少就目前来说，它的价格我还能接受。属于那种……肉疼，但还没到割肉的程度。
-->

---
glow: bottom-right
---

# 实测：日常负载，未触达上限

<div class="grid grid-cols-3 gap-5 pt-6">
<div class="step-card">

### 🕷️ 网页抓取

长文档 · 多章节
批量提取到 Markdown

</div>
<div class="step-card">

### 🧩 DLL 逆向

Binary Ninja MCP
多轮分析交互

</div>
<div class="step-card">

### 🔧 插件调试

Chrome 扩展
端到端排障

</div>
</div>

<div v-click class="case-card mt-8 text-lg">

连续对话轮次与思考深度充足，**未一次触发限流** —— 轻度到中度使用绰绰有余。

</div>

<!--
那问题来了：这些免费的额度，到底够不够用？我不是拍脑袋下结论的人。这点我是真测过的。
爬网页、逆向 DLL、修 Chrome 插件的 bug……这些场景，我一个个跑了一遍。
要说连续对话的次数，要说它思考的深度——说实话，都挺夸张的。
但就是没一次，让我撞到上限。

所以我敢大胆假设、合理推断一句：
这套免费方案，应付日常轻度到中度的使用，绰绰有余。
-->

---
layout: section
glow: top-right
---

<div class="text-sm tracking-widest opacity-40">PART 03</div>

# 基础建设

<!--
好，方案定了。接下来，就是搭架子：装软件，然后配三样东西。
按需来，不是让你照单全收。
-->

---
glow: full
---

# 三步搞定环境

<div class="grid grid-cols-3 gap-5 pt-8">
<div v-click class="step-card">

<div class="text-sm opacity-50">STEP 1</div>

### 🧩 安装 OpenCode

TUI / Desktop / CLI
官网：<https://opencode.ai>

</div>
<div v-click class="step-card">

<div class="text-sm opacity-50">STEP 2</div>

### 📖 接入 Skill

让 Agent 直接装
教会它用命令行

</div>
<div v-click class="step-card">

<div class="text-sm opacity-50">STEP 3</div>

### 🔌 配置 MCP

让 Agent 接入
你现有的客户端

</div>
</div>

<div v-click class="pt-8 text-center text-lg opacity-70">

三个配置都交给自己 & Agent 完成 —— 不用手写、不用背命令。

</div>

<!--
第一步，装软件。官网我放这儿了——OpenCode 官网。
随你喜好。装 TUI 也行，装 Desktop 也行。你要是就想要一个纯命令行的 CLI，我也不拦着。

装好之后，主要配三样东西：
第一样，本地的服务配置，通过 API 调用 Agent。
第二样，是 Skill。
第三样，是 MCP。
还是那句话啊——按需来。不是让你照单全收。
-->

---
glow: bottom-right
---

# ① 本地服务：让 Agent 可被远程调用

<div class="opacity-70"><code>~/.config/opencode/service.json</code></div>

```json
{
  "host": "0.0.0.0",
  "password": "xxx",
  "port": 4096
}
```

<div v-click class="pt-4 opacity-85">

把 `host` 改成 `0.0.0.0`，服务就暴露到**局域网** ——
Agent 不再是本机孤岛，而是一个能被远程调用的服务。

</div>

<div v-click class="pt-3 opacity-85">

搭配 OpenCode SDK，用代码驱动 Agent。我把它接进了 **QQ**：
「坐在电脑前才能用」→「躺在被窝里也能用」。

</div>

<!--
第一样，是本地的服务配置。~/.config/opencode/service.json。
这里头，最关键的是 host。你把它改成 0.0.0.0——这就等于，把你的服务暴露到了局域网。
从此，你的 Agent 就不再是你电脑上的一个孤岛了。它变成了一个能被远程调用的服务。
建议搭配 OpenCode 的 SDK 一起用，调用起来更顺手。你能直接拿代码去驱动 Agent，而不是靠手敲命令。

我自己就拿它干了件挺好玩的事——我把 OpenCode，直接接进了 QQ。
这么一搞，这个 Agent 就从"坐在我电脑前才能用"，变成了"躺在被窝里也能用"。
-->

---
glow: bottom-left
---

<div class="pb-3">
<span class="case-tag">案例 01 · 环境搭建</span>
</div>

# 一句话装好 Rust 环境

<div class="chat pt-4">
  <div class="msg right">帮我装一下 Rust 环境</div>
  <div class="msg left"><span class="who">Agent</span>检测系统环境，通过 rustup 安装工具链并配置 PATH。</div>
  <div class="msg left"><span class="who">Agent</span>验证通过：<code>rustc --version</code> / <code>cargo --version</code>。</div>
</div>

<div class="case-card mt-6 text-lg">

💡 **要点**：环境搭建是「一次性脏活」。你只下达目标 + 验收结果，
中间的下载、配置、排错全部外包。

</div>

<!--
第一样配置聊完，先插一个特别接地气的案例。

我懒得自己一步步配环境，就直接跟 Agent 说：帮我装一下 Rust 环境。
它自己检测系统、跑 rustup、配 PATH，最后还验证了 rustc 和 cargo 的版本。

环境搭建这种"一次性脏活"，交给它之后，我只要下达目标、验收结果就行。
中间的下载、配置、排错，全都不归我管了。
-->

---
glow: full
---

# ② Skill：让 Agent 自己装

```text
帮我安装下这个 Skill: <链接>
```

<div class="pt-4 opacity-80">按需装即可。私心只推荐一个 ——</div>

<div class="case-card mt-4">

### 📖 Matt Pocock · `writing-for-agents`

帮你**写文档** —— 比如 skill、`AGENTS.md` 这类东西。

</div>

<div v-click class="pt-5 opacity-85">

写文档也算基础建设？算，而且是大头 ——
说明书一含糊，Agent 就开始自由发挥，发挥着发挥着就跑到隔壁去了。

</div>

<!--
第二样，是 Skill。装 Skill 这事，你都不用自己动手，直接让 Agent 来就行。
你就打这么一行：帮我安装下这个 Skill: <链接>。
按需装就好。不过我私心，只推荐一个——Matt Pocock 的 writing-for-agents。
这玩意儿是干嘛的？帮你写文档。写什么呢？比如 skill、AGENTS.md 这类东西。
你可能想问：写个文档，也算基础建设？算。而且是大头。
因为文档写清楚了，Agent 后面干活才不容易跑偏。说明书要是含糊，它就开始自由发挥。
-->

---
glow: bottom-right
---

# ③ MCP：让 Agent 接入客户端

```text
帮我接入下这个 MCP 服务: <链接>
```

<div v-click class="case-card mt-6 text-lg">

⚠️ **注意**：MCP 通常是和**某个具体客户端**进行交互的桥梁，由MCP提供Tool，Agent通过Tool调用客户端功能。

</div>

<div v-click class="pt-6 opacity-85">

推荐 `agent-browser` —— 直接控制你手边的浏览器。
先在 `~/.agent-browser/config.json` 写入：

</div>

<div v-click class="pt-3">

```json
{ "autoConnect": "true" }
```

</div>

<div v-click class="pt-3 opacity-75">

这样它才接上**已经开着**的浏览器，复用现成的登录态 ——
否则每件事都得先登一遍账号。

</div>

<!--
第三样，是 MCP。安装也一样，让 Agent 自己来。
但这里有个坑，你注意一下——MCP 通常是依托某个具体客户端的。别指望它是个万能插头。
还是那句话：帮我接入下这个 MCP 服务: <链接>。

MCP 我只推荐一个——agent-browser。用来直接控制你手边的浏览器。
用法上有个小机关。先在你的 ~/.agent-browser 目录里，创建一个 config.json。
内容写上一句：{ "autoConnect": "true" }。
这样它才会接上你已经开着的浏览器，而不是另起一个新窗口。
为什么要这么麻烦？因为只有接上你原来那个窗口，才能蹭到你现成的登录态。
-->

---
glow: bottom
---

<div class="pb-3">
<span class="case-tag">案例 02 · 网页抓取 → 知识库</span>
</div>

# 采集攻略，自动生成 Markdown 知识库

<div class="chat pt-3" style="font-size: 0.95em;">
  <div class="msg right">采集一下空轨 2nd 的攻略，形成知识库：<code>trails-game.com/walkthrough/sora-2nd-walkthrough/</code></div>
  <div class="msg left"><span class="who">Agent</span>抓取页面，HTML 已保存（<b>10720 行</b>），先摸清章节结构。</div>
  <div class="msg left"><span class="who">Agent</span>结构清晰：存档继承 + 序章 + 七章。并行派出子代理提取各章内容。</div>
  <div class="msg left"><span class="who">Agent</span>七章全部提取完毕，写入知识库文件（原攻略缺失处已注明）。</div>
</div>

<div class="case-card mt-5">

🎯 **链路**：复用登录态抓取 → 解析结构 → **并行子代理**提取 → 落盘为 Markdown 知识库

</div>

<!--
再说一个我自己特别满意的案例。

我跟它说：采集一下空轨 2nd 的攻略，形成知识库，链接丢给它。
它自己把页面抓下来，HTML 保存了 10720 行；先摸清章节结构，发现是"存档继承 + 序章 + 七章"；
然后并行派出子代理去提取各章内容；最后七章全部提取完，写进知识库文件。
原攻略里第七章当时还没更新完整，它还主动注明了。

整个链路：复用登录态抓取 → 解析结构 → 并行子代理提取 → 落盘 Markdown。
我就只说了一句话。
-->

---
layout: section
glow: top-right
---

<div class="text-sm tracking-widest opacity-40">PART 04</div>

# 造工具 · 修工具

<!--
前面讲的这些，说白了，都还是在"用好别人家的工具"。
这一节，我们往前走一步。也是我全程最爽的部分——让 Agent 帮你造工具、修工具。
-->

---
layout: two-cols-header
layoutClass: gap-8
glow: bottom
---

# 从「我想做」到「能用的东西」

::left::

<div class="pt-2 text-xl opacity-50">以前</div>

<div class="mt-4 leading-relaxed">

设计 → 编码 → 调试 → 测试 → 文档

<div class="pt-4 opacity-80">

一道完整开发流程，
对懒人来说约等于**一堵墙** ——
想法基本都夭折在脑子里。

</div>
</div>

::right::

<div class="pt-2 text-xl">现在</div>

<div class="mt-4 leading-relaxed">

这堵墙的高度，肉眼可见地，**矮了一大截**。

<div v-click class="pt-4 opacity-80">

于是那些原本夭折的想法，终于有机会落地。

</div>
</div>

<!--
先说造工具。
以前啊，一个想法从"我想做"，到"我真有个能用的东西"……中间隔着的是完整的一套开发流程。
设计、编码、调试、测试、文档。对懒人来说，这个门槛，基本等于一堵墙。
所以大部分想法，都夭折在脑子里了。
现在呢？这堵墙的高度，肉眼可见地，矮了一大截。
-->

---
glow: full
---

# 造工具：三步工作流

<v-clicks>

1. **讲清需求 + 验收标准**，让 Agent 出方案，把功能点拆开、逐模块测试
   - ⚠️「验收标准」最关键 —— 不然验收出来的压根不是你要的东西
2. **跑测试 → 修 bug → 再测**，反复迭代
3. **补文档**（`writing-for-agents`），记好开发与测试，下次维护不「失忆」

</v-clicks>

<div v-click class="case-card mt-6 opacity-85">

小脚本、小工具、把烦人的重复流程自动化 —— 这类脏活累活，基本都可以丢给它。

</div>

<!--
我的做法，大概是这样三步。
第一步，先把需求和验收标准讲清楚。
注意啊，"验收标准"这一步，特别关键。不然你验收出来的，压根不是你要的东西。
然后让 Agent 出个方案。这一步，也可以让 Matt Pocock 那个 Skill 帮忙。让它把功能点拆开，再对每个独立模块，分别测试。

第二步，测试一跑，bug 该冒的都会冒出来。那就修。修完再测。反复迭代。

第三步，最后，用前面提过的 writing-for-agents，把开发和测试的文档补好。
这样下次你要维护的时候，Agent 才不至于"失忆"，一上来就开始跑偏。
-->

---
layout: statement
glow: center
---

# 我用 Agent
# 写了个 Agent

<div class="mt-8 text-2xl">它叫 <b>Ruri</b></div>

<div class="mt-6 opacity-50">（有一阵子没维护了……主要是我太忙了。真的。）</div>

<div class="mt-2 text-sm opacity-40">不是懒，是忙 —— 这句话请帮我记下来。</div>

<!--
PS，说起来还有点骄傲。我用 Agent，帮我写了个 Agent。它叫 Ruri。
虽然目前……有一阵子没维护了。主要是我太忙了。真的。
（不是懒，是忙，这句话请帮我记下来。）
-->

---
glow: bottom
---

# 修工具：一条核心原则

<div class="mt-12 text-3xl leading-relaxed">

一定要让你的 Agent，
能 **「碰到」你正在用的工具**

</div>

<div class="mt-8 text-lg opacity-70">

插件本身、承载它的宿主软件、相关的系统日志 —— 都得让它够得着。

</div>

<!--
好，造工具讲完了。接下来说修工具。
另一个特别常见的场景：某个工具年久失修，或者，在你自己的环境里，它就是死活跑不起来。
比如我做测试时遇到的那个 Chrome 插件 bug，就属于这一类。
解决办法其实很简单。核心就一句话——
一定要让你的 Agent，能"碰到"你正在用的工具。
插件本身，还有承载插件的那个宿主软件，都得让它够得着。
-->

---
glow: top-right
---

<div class="pb-3">
<span class="case-tag">案例 03 · 排障</span>
</div>

# 修复 Chrome 插件：`deepseek-pp-more` 的过程

<div class="chat pt-3" style="font-size: 0.95em;">
  <div class="msg right">服务好像还是起不来？</div>
  <div class="msg left"><span class="who">Agent</span>本地无进程、无端口监听、日志未生成 → 启动脚本没执行到 <code>Start-Process</code>。</div>
  <div class="msg left"><span class="who">Agent</span>打开扩展侧边栏 → 配置页：<code>0.0.0.0:12345</code>，Native Host 已连接、密钥已启用。</div>
  <div class="msg left"><span class="who">Agent</span>点「启动中转服务」→ 卡在「重连中…」，系统侧仍无进程 / 日志。</div>
  <div class="msg left"><span class="who">Agent</span>手动复现扩展要执行的 PowerShell 脚本，定位真实报错。</div>
</div>

<div class="case-card mt-4">

🎯 Agent 同时「够得着」**扩展界面 + Native Host + 系统日志**，才能端到端定位根因。

</div>

<!--
举个我自己的例子。
我在接入 Binary Ninja 的 MCP 插件时，它直接报错了。
换作以前……我大概会对着报错信息，发一会儿呆。然后默默关掉，假装无事发生。
但现在不一样了。因为 Agent 能碰到这套东西，它会自己顺着报错去找方案，把 bug 修掉。
那我干嘛呢？我就负责在一旁当监工。偶尔……端茶倒水。

（这个案例里，Agent 自己看了系统状态、翻了浏览器扩展界面、点了配置页、复现了 PowerShell 启动脚本，
一步步把报错定位出来——因为它同时能碰到界面、Native Host 和系统日志。）
-->

---
layout: section
glow: bottom
---

<div class="text-sm tracking-widest opacity-40">PART 05</div>

# 结语

<!--
最后，总结一下。
其实"又懒又穷"，压根不算什么问题。真正的问题是——你有没有把 Agent 用好。
-->

---
glow: full
---

# 三个关键词

<div class="grid grid-cols-3 gap-6 pt-8">
<div v-click class="step-card">
<h3>打底</h3>
<p>用免费的 OpenCode 方案撑住日常，<br>兜底用 DeepSeek 的 API。</p>
</div>
<div v-click class="step-card">
<h3>接通</h3>
<p>用 MCP 把 Agent 接进客户端，<br>用 Skill 教会它用命令行。</p>
</div>
<div v-click class="step-card">
<h3>进化</h3>
<p>让 Agent 帮你造工具、修工具，<br>把重复劳动统统交出去。</p>
</div>
</div>

<!--
三个关键词，送给大家。
打底。用免费的 OpenCode 方案撑住日常，兜底用 DeepSeek 的 API。
接通。用 MCP，把 Agent 接进各种客户端；用 Skill，教会它用命令行。
进化。让 Agent 帮你造工具、修工具，把重复劳动，统统交出去。
-->

---
layout: statement
glow: center
---

# 你越是懒
# 就越有动力，去把这套东西搭起来

<p class="opacity-50">懒，不是躺平 —— 是一种对「重复劳动」的极度不耐烦。</p>

<!--
聊到这儿，你会发现一个挺有趣的悖论——
你越是懒，就越有动力，去把这套东西搭起来。

为什么呢？因为懒，它不是躺平。
懒，是一种对"重复劳动"的极度不耐烦。
而搭好之后，它能替你干掉的，恰好就是那些又烦又累、却又不得不做的事。
-->

---
layout: end
glow: bottom
---

# 谢谢大家

<div class="pt-4 text-xl opacity-60">

剩下的，就交给大家，自行发挥创造力了。

</div>

<div v-click class="pt-10 opacity-40">

我们下期再见 —— 如果我勤快的话。😄

</div>

<!--
【停顿，收】
剩下的，就交给大家，自行发挥创造力了。
谢谢大家。我们下期再见——如果我勤快的话。
-->
