# Cairn — Claude-Code-as-Brain 移动端自动化测试系统

> **Cairn**（垒在小道上的石标）：每次跑用例都在 App 里留下「石标」——轨迹缓存 / 页面签名 / 网状图边，下次沿标快走、**越用越快**；UI 变了就补一个新标（视觉自愈）。

测试同学写一段中文自然语言用例，**Claude Code 会话本身作为测试 Agent 的大脑**驱动 Android / iOS / Web 多端执行、判定通过/失败、失败时从 mitmproxy 抓包做「UI bug / 接口问题 / 用例问题」三选一归因，并把全部证据归档可视化。

> 产品介绍见 [`INTRODUCTION.md`](./INTRODUCTION.md)；设计哲学与铁律见 [`CLAUDE.md`](./CLAUDE.md)。

## 核心理念

```
结构化能命中     → 走快路径（uiautomator2 ~80–400ms，零/少 LLM 往返）
rid/页面匹配失败 → 不 FAIL，降级：截图交给会话做视觉/语义决策 → 执行 → 回写自愈
回写后下次重跑   → 回到快路径；降级次数随使用收敛 = 越用越快
```

**铁律：Claude Code 会话 = 大脑。** 所有思考 / 规划 / 判定 / 归因 / 视觉决策都在会话里发生；`engine/`、`scripts/` 是纯确定性 CLI，**永不调 LLM**。

## 关键设计决策

| 维度 | 朴素做法 | Cairn |
|---|---|---|
| 用例 | 写死 rid 的 case.yaml | 纯自然语言 `.md`，轨迹缓存是底层产物 |
| 页面识别 | 全字段 AND，漂移即 unknown | **评分制 confidence**，漂移仍识别 |
| 匹配失败 | TIMEOUT/FAIL 硬终止 | **降级到视觉决策 + 自愈回写**，不 FAIL |
| 网状图 | 手工维护源码 yaml，不自愈 | 静态种子 + 运行时真实轨迹生长 |
| 可靠性 | 靠 sleep 硬等 | pHash 页面稳定 + 卡死检测 + 双图断言 |
| 平台 | 单端 | Android / iOS 真机 + Web（CDP/Playwright）隔离工作空间（同 App 多端互不混用） |

## 架构分层

```
L1 用例    cases/<platform>/<app>/NN.md       —— 自然语言（唯一对人暴露；platform=android/ios/harmony/web）
L2 skill   preflight / mindmap-pipeline / author-case / run-case / retest /
           grow-graph / triage / tb-bug / publish / teardown   —— 指挥手册
L3 内核    engine/                            —— Driver 抽象 + 20 个 action + 评分制 locator
                                                 + vision_bridge(降级) + stability(护城河)，零 LLM
L4 知识    data/apps/<platform>/<app>/        —— nlgraph 网状图 / kb 踩坑库 / pages 签名 / popups / semantic_dict
           traces/<platform>/<app>/           —— 轨迹缓存
L5 证据    runs/ + runs_published/ + viewer/  —— 执行证据（runs_published = 发布到 OSS 后的入库镜像，clone 后看全量）+ 只读观测台
   ▲ Claude Code 会话 = 大脑，贯穿全程
```

完整目录导航见 [`CLAUDE.md`](./CLAUDE.md)。

## 工作流 skill

| skill | 作用 |
|---|---|
| `preflight` | 开测前置「门」：起抓包 + 校验环境 + 确认设备装的包确实含被测代码 + 起 viewer，会停下来跟用户确认 |
| `mindmap-pipeline` | 一份思维导图（.mm）端到端 → 一套能跑、能逐点上色的用例（编排总入口） |
| `author-case` | 业务需求 / PRD / 技术目标 → 一条自然语言用例 |
| `run-case` | 执行用例：缓存回放 / 首跑探索 / 视觉降级自愈 / 归因 / 出 verdict |
| `retest` | 失败用例复测：开发修完出新包后重测，失败行下挂复测子项（append 不覆盖父失败痕迹） |
| `grow-graph` | 维护、查询页面网状图（nlgraph） |
| `triage` | 失败归因 A/B/C（时间窗 HAR + 截图，可改包反证） |
| `tb-bug` | 失败用例 → Teambition 子 bug 卡（建 / 补 / 去重） |
| `publish` | 发布证据到 OSS + 入库镜像 `runs_published/`，让别人 git clone 后用 viewer 看全量（截图默认压缩、原始抓包脱敏不上传） |
| `teardown` | 收车：一次性关掉抓包 / viewer / iOS 链路（preflight 的反向操作） |

## 环境准备

```bash
# Node 22+ / Android platform-tools(adb) / mitmproxy / uiautomator2
brew install --cask android-platform-tools
brew install mitmproxy
pip3 install --user uiautomator2 pyyaml

# iOS 真机额外需要：Xcode + WebDriverAgent（首次需在 iPhone 信任 WDA 证书）
```

## 执行内核用法

所有命令默认 `--platform android`；接 iOS 时全部加 `--platform ios`，路径自动落到对应平台层（`agent.py` 不改一行）。

```bash
cd <repo 根>
adb devices                                                                        # 确认 Android 真机在线
python3 -m engine.tests.smoke_test                                                 # 无设备冒烟测试（7 个）

# 识别当前页（评分制 confidence）/ 看控件树 / 启动 App
python3 -m engine.agent --device <id> --platform android --app sentence page-id --json
python3 -m engine.agent --device <id> --platform android snap --summary
python3 -m engine.agent --device <id> --platform android launch com.shanbay.sentence

# 回放一条轨迹/case（结构化快路径；定位失败时降级，退出码 75 等会话回填决策续跑）
python3 -m engine.agent --device <id> --platform android --app sentence \
        replay cases/android/sentence/verify_checkin.yaml --report runs/r1/case_run.json

# 网状图查路径提示（首跑提速）/ triage 取时间窗接口
python3 scripts/graph.py hint --app sentence --platform android --from <页> --to <页>
python3 scripts/har_window.py <flows.json> --since-epoch <t> --keywords checkin
```

### iOS 真机（WDA）

```bash
# 终端 A：把设备链路挂起（类比 mitmproxy「起了别停」）
python3 scripts/ios_up.py                       # xcodebuild 拉起 WDA + usbmux 转发 8100→localhost:8100，挂着别关
python3 scripts/ios_up.py --list-devices        # iOS 设备列表

# 终端 B：之后所有 agent 命令加 --platform ios 即可
python3 -m engine.agent --device <udid> --platform ios snap --summary
```

### Web（Playwright / Chromium，CDP）

```bash
pip3 install --break-system-packages playwright && python3 -m playwright install chromium   # 首次
# 终端 A：起常驻 Chromium（CDP 9222）+ 打开 URL，挂着别关（同「起了别停」）
python3 scripts/web_up.py "https://web.shanbay.com/wordsweb/labor-vocab-landing/"

# 终端 B：--device 传 CDP 端点，之后所有命令加 --platform web
python3 -m engine.agent --device http://localhost:9222 --platform web --app wordsweb snap --summary
```

## 发布证据（让别人 clone 后看全量）

`runs/` 体积大、gitignore 不入库。`scripts/oss_publish.py`（或 `/publish` skill）把截图等二进制**压缩后传扇贝 OSS**（内容哈希幂等去重），小 JSON 证据 + **脱敏后的** flows 写进**入库**镜像 `runs_published/`，viewer 本地缺图时 `/api/file` **302 跳 OSS** —— 别人 `git clone` 后起 viewer 即看全量。

```bash
python3 scripts/oss_publish.py --dry-run                                # 干跑：只分类 + 统计字节
SHANBAY_COOKIE="$(cat /tmp/sb_cookie)" python3 scripts/oss_publish.py    # 真发布（图片默认压缩 compress+WebP，省~80%）
```

> ★ 原始 `network_flows.json` 含 auth header/cookie，**绝不入库/上传**——只存脱敏投影。cookie=staff auth_token 走环境变量。

## 当前状态

执行内核（M0–M7）与工作流 skill 均已落地，单测 / CLI / viewer 全验证通过：

- **执行内核**：Driver 抽象（DRIVER_METHODS 契约冻结）+ 20 个 action + 评分制 locator + agent.py，零 LLM。
- **自然语言闭环**：trace_cache（lookup/save/stats）+ 探索/回放分支 + `do/fingerprint/trace-lookup` CLI。
- **降级自愈（核心卖点）**：vision_bridge + decisions 留痕 + 自愈回写 pages/popups/selector，下次重跑回快路径。
- **网状图运行时生长**：graph_runtime（种子 / merge_edge / 高权 BFS find_path / explore_hint）+ `scripts/graph.py`。
- **护城河**：stability（dHash 帧差稳定 + 连点/同滑卡死检测）+ `stabilize` 动作 + stuck 召回。
- **API 层 + triage**：`engine/har.py` 时间窗过滤 + `assert_har`/`assert_api` 请求体断言 + `scripts/mitm_modify.py` 改包 + triage 三选一归因。
- **viewer**：Vue 3 + Vite + 零依赖 Node 后端，6 页只读观测（大盘 / 运行含降级自愈三段式时间线 / 用例 / 页面图 / 知识库 / 设备）；run 源 = `runs/ ∪ runs_published/`，本地缺截图时 `/api/file` 302 跳 OSS（clone 后看全量），详见 [`viewer/README.md`](./viewer/README.md)。
- **多端**：Android（uiautomator2）+ iOS（WebDriverAgent，经 `scripts/ios_up.py` 起链路）+ Web（Playwright/CDP，常驻 Chromium，经 `scripts/web_up.py` 起）隔离工作空间；HarmonyOS（hdc）为 stub 预留。
- **已落地被测 App**：扇贝单词 `sentence`、智能卡片 `wisecards`（Android 为主，iOS 绿地从零生长）、Web 摸鱼背单词 `wordsweb`（扇贝 web 站点 web.shanbay.com）。
- **思维导图编排**：`scripts/mindmap.py`（.mm 解析 / 索引 / verdict 状态汇聚逐点上色）+ `scripts/tb_bug.py`（失败 → Teambition 子 bug，去重）。
- **证据发布**：`scripts/oss_publish.py`（`/publish` skill）把截图压缩传扇贝 OSS（内容哈希幂等去重）+ 小 JSON / 脱敏 flows 入库镜像 `runs_published/`，viewer 自动 302 跳 OSS → 别人 `git clone` 后看全量。
