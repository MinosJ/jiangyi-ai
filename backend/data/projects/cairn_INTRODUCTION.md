# Cairn 项目介绍

> **Cairn**（垒在小道旁的石标）：每跑一次用例，就在 App 里留下一座「石标」——轨迹缓存 / 页面签名 / 网状图边。下次沿石标快走，**越用越快**；UI 变了就补一座新标（视觉自愈）。

Cairn 是一套**以 Claude Code 会话本身作为「测试 Agent 大脑」**的移动端自动化测试系统。测试同学只写一段中文自然语言用例，Claude Code 驱动 Android / iOS 真机执行、判定通过或失败、失败时结合抓包做归因，并把全部证据归档可视化。

---

## 一、解决什么问题

移动端 UI 自动化测试长期被三个老毛病拖累，这也是上一代项目（`~/qa`）的病根：

| 老毛病 | 后果 |
|---|---|
| **用例写死控件 id（rid）** | App 改一个文案、加一个控件，用例就失效，维护成本极高 |
| **页面识别全字段 AND 硬匹配** | 界面稍有漂移即判 `unknown`，连锁导致等待超时 → 整条用例 FAIL |
| **匹配失败即 FAIL** | 一个小定位问题就让整条用例红掉，无法自我恢复，假阴性泛滥 |

结果是：脚本脆、维护贵、跑一次挂一片，团队对自动化测试逐渐失去信任。

**Cairn 的根治思路**——快路径 + 视觉自愈 + 知识库越用越快：

```
结构化能命中  → 走快路径（uiautomator2 ~80–400ms，零/少 LLM 往返）
rid/页面匹配失败 → 不 FAIL，降级：截图交给 Claude 会话做视觉/语义决策 → 执行 → 回写自愈
回写后下次重跑 → 回到快路径；降级次数随使用收敛 = 越用越快
```

它额外解决两个现实痛点：

- **写用例门槛高**：这里只需写中文意图 + 验收点，控件 id / 轨迹 / 签名都是系统自动生成的底层产物，不暴露给写用例的人。
- **「失败了但不知道为什么」**：失败步自动取时间窗抓包 + 截图，做 **(A) UI bug / (B) 接口问题 / (C) 用例问题** 三选一归因，把「过/不过」升级成「为什么不过」。

---

## 二、目标用户

- **测试 / QA 工程师**（核心用户）：用自然语言写用例、跑回归、看归因结论，不需要懂自动化脚本框架。
- **移动端研发**：把 PRD / 需求卡 / 思维导图节点直接变成可跑用例，定位是 UI 还是接口的锅，失败可一键登记成 Teambition 子 bug 卡。
- **团队负责人 / 观察者**：通过 viewer 观测台看执行健康度、降级自愈轨迹、命中率「越用越快」曲线、知识资产沉淀。

当前已落地被测对象：扇贝单词 `sentence`、智能卡片 `wisecards`（Android 为主，iOS 为绿地从零生长）。

---

## 三、AI 用在哪里（铁律：Claude Code 会话 = 大脑）

这是 Cairn 最关键的架构决定：**所有「思考 / 规划 / 判定 / 归因 / 视觉决策」都发生在 Claude Code 这一次会话里**，而不是写进代码。

- ❌ `engine/`、`scripts/` 里**绝不** `import anthropic`、不调任何 LLM API、不写模型名、不写 token 预算——它们是纯确定性的执行 CLI。
- ✅ 仓库只含**非智能**部分：执行内核、数据 / 知识、skill 手册、viewer 观测台。

AI（会话）的介入点只有两个，干净利落：

1. **在 skill 手册指挥下调度执行内核** —— 解析需求、规划路径、首跑探索、判定验收点、写归因结论，都是会话在做。
2. **结构化定位失败时做视觉决策** —— 执行 CLI 跑到结构化失败时，写出 `decision_request.json` + 当前截图，以退出码 75（DEGRADE）退出；会话读截图、做视觉/语义判断、回填 `decision.json`；CLI 据此续跑并 **回写自愈**（补页面签名 / 修 selector / 加弹窗规则），下次重跑该步即回到快路径。

> 一句话：**代码负责「快而确定」，会话负责「智能而柔性」**，两者用 `runs/<id>/decisions/` 下的 JSON 文件交接，永不耦合。

---

## 四、产品说明

### 4.1 用例形态：只写自然语言

写用例的人只写 `cases/<platform>/<app>/NN_name.md`——一段中文意图 + 一组验收点。例如扇贝打卡用例：

> 打开扇贝单词主页，记下"已打卡天数" N。点"开始学习"走完今天所有新词 / 复习……直到出现"打卡 / 完成"按钮的小结页，点它完成打卡。回到主页重新读"已打卡天数" M。**验收**：M == N + 1。如果没 +1，帮我判断是 UI 没刷新还是后端接口没生效。

首跑时会话探索出可复现的**轨迹缓存**；重跑走缓存；缓存失效则自动重探索并回写。yaml / 轨迹 / 签名都是底层产物，不暴露给人。

### 4.2 分层架构

```
L1 用例    cases/<platform>/<app>/NN.md     —— 自然语言（唯一对人暴露）
L2 skill   preflight / mindmap-pipeline / author-case / run-case /
           grow-graph / triage / tb-bug / teardown  —— 指挥手册
L3 内核    engine/                           —— Driver 抽象 + actions + 评分制 locator
                                                + vision_bridge + stability，零 LLM
L4 知识    data/apps/<platform>/<app>/       —— nlgraph 网状图 / kb 踩坑库 / pages 签名
           traces/<platform>/<app>/          —— 轨迹缓存
L5 证据    runs/ + viewer/                    —— 执行证据 + 可视化观测台
   ▲ Claude Code 会话 = 大脑，贯穿全程
```

**分平台隔离（铁律）**：iOS 和 Android 是隔离的工作空间，同一 App 两端 UI / 签名完全不同，各自一套数据，绝不混用。平台是 `cases/`、`data/apps/`、`traces/` 下的第一层目录。

### 4.3 核心能力

- **结构化快路径**：命中轨迹缓存时用 uiautomator2 直接回放，毫秒级、几乎不耗 token。
- **评分制页面识别**：`identify_page` 用命中比例算 confidence（≥0.7 高置信走结构化，<0.4 才降级），界面漂移也能识别，不再一刀切判 unknown。
- **视觉降级自愈**：结构化失败不 FAIL，降级给会话做视觉决策并回写知识，下次重跑提速——这是本项目最大卖点。
- **页面网状图（nlgraph）**：节点 = 业务语义页面，边 = 真实走过的路径，跑用例自动长边加权；首跑查图给探索提速。
- **护城河（稳定性）**：dHash 帧差判定页面稳定、连点 / 同滑卡死检测，告别 sleep 硬等。
- **失败归因（triage）**：失败步取时间窗 HAR + 截图，判 A/B/C，结论写进 verdict，可用 mitm 改包做反证。
- **越用越快**：轨迹缓存命中率、降级收敛在 viewer 用曲线可视化呈现。

### 4.4 工作流 skill（端到端编排）

| skill | 作用 |
|---|---|
| `preflight` | 开测前置「起飞前检查」：起抓包、按平台校验环境、确认设备装的包确实含被测代码、起 viewer。会停下来跟用户确认的「门」。 |
| `mindmap-pipeline` | 把一份思维导图（.mm）端到端变成一套能跑、能逐点上色的用例（解析 → 归类 → 写 md → 逐案跑 → 回填上色 → 看板）。 |
| `author-case` | 把业务需求 / PRD / 技术目标变成一条自然语言用例。 |
| `run-case` | 执行一条用例：缓存回放 / 首跑探索 / 视觉降级自愈 / 归因 / 出 verdict。 |
| `grow-graph` | 维护、查询页面网状图。 |
| `triage` | 失败归因 A/B/C。 |
| `tb-bug` | 把失败用例统一登记成 Teambition 子 bug 卡（建 / 补 / 去重）。 |
| `teardown` | 收车：一次性关掉抓包 / viewer / iOS 链路（preflight 的反向操作）。 |

### 4.5 viewer 观测台（纯只读）

Vue 3 + Vite 前端 + 零依赖 Node 后端，直接读 `runs/ traces/ data/ cases/` 渲染，无数据库、无额外服务。提供大盘 / 运行（含降级自愈三段式时间线）/ 用例 / 页面图（力导向 nlgraph）/ 知识库 / 设备六个视图。它**纯只读观测，不做执行入口**——因为大脑是会话，前端跑不了用例。

### 4.6 技术栈与环境

- **执行**：Python 3 + uiautomator2（Android）/ WebDriverAgent（iOS 真机）
- **抓包 / 归因**：mitmproxy（HAR 时间窗过滤 + 改包反证）
- **数据**：纯文件（yaml / json / md），无数据库
- **观测**：Vue 3 + Vite + 零依赖 Node

```bash
# Android
python3 -m engine.agent --device <id> --platform android --app sentence page-id --json
python3 -m engine.agent --device <id> --platform android --app sentence replay <case> --report <out>

# iOS 真机（先挂起 WDA 链路，再跑 agent）
python3 scripts/ios_up.py
python3 -m engine.agent --device <udid> --platform ios snap --summary

# 无设备冒烟测试
python3 -m engine.tests.smoke_test
```

---

> 设计哲学与全部铁律见 [`CLAUDE.md`](./CLAUDE.md)；里程碑进度与历史见 [`README.md`](./README.md)。
