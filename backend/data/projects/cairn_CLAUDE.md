# Cairn — Claude-Code-as-Brain 移动端自动化测试系统

> 给在本 repo 工作的 Claude Code（你自己）的常驻指令。**这些铁律覆盖默认行为。**
> 项目名 **Cairn**（石标：每跑一次留下轨迹/签名/图边，越用越快）。仓库目录是 `/Users/gaochang/Work/cairn`（早前文档里的 `~/Cairn`/`/Users/gaochang/Cairn` 是旧代号，**已不存在**，命令一律在 repo 根即当前 cwd 下跑）；早期代号 `qa2` 仅见于历史引用（如「旧 qa」指更早的 v1 项目）。

## 你是大脑（铁律 #1）

**Claude Code 会话本身就是测试 Agent 的大脑。** 所有「思考 / 规划 / 判定 / 归因 / 视觉决策」都在你这次会话里发生。

- ❌ 绝不在 `engine/` `scripts/` 里写 `import anthropic`、调任何 LLM API、指定模型名、写 token 预算代码。
- ✅ repo 只含**非智能**部分：执行 CLI（确定性）、数据/知识、skill 手册、viewer。
- 你的介入点只有两个：(a) skill 手册指挥下调 `engine/agent.py`；(b) CLI 结构化失败时写出 `decision_request.json`，你读截图做视觉决策回填。

## 核心理念：快路径 + 视觉自愈（铁律 #2）

旧 qa 项目的病根是「yaml 写死 rid / page 全字段 AND 硬匹配 / 失败即 FAIL」。本项目根治它：

```
结构化能命中 → 走快路径（uiautomator2 ~80-400ms，零/少 LLM round-trip）
rid/page 匹配失败 → 不 FAIL，降级：截图交给你（会话）视觉/语义决策 → 执行 → 回写自愈
回写后下次重跑回到快路径 → 降级次数收敛 = 越用越快
```

`locator.identify_page` 已是评分制（confidence ≥0.7 高置信走结构化，<0.4 才 unknown→降级），不再一刀切。

## 用例形态（铁律 #3）

- 写用例的人**只写自然语言** `cases/<platform>/<app>/NN_name.md`（意图 + 验收点）。
- 你首跑探索 → 生成可复现轨迹缓存 `traces/<platform>/<app>/NN/`；重跑走缓存；失效自动重探索 + 回写。
- yaml/轨迹/签名是**底层产物**，不暴露给写用例的人。

## 分平台工作空间（铁律 #4）

**iOS 和 Android 是隔离的工作空间**：同一 app（如 wisecards）在两端 UI/签名完全不同，各自一套数据，绝不混用。

- 平台是 `cases/`、`data/apps/`、`traces/` 下的**第一层**：`cases/<platform>/<app>/`、`data/apps/<platform>/<app>/`、`traces/<platform>/<app>/`（`<platform>` ∈ android/ios/harmony/web）。
- 所有 `engine.agent` / `scripts/graph.py` / `scripts/mindmap.py` 命令都带 `--platform`（默认 android）+ `--app`，路径自动落到对应平台层。
- `runs/<run_id>/` 仍扁平（gitignore），平台记在 `case_run.json` 的 `platform` 字段；viewer 顶部「平台」开关全局过滤，按 `verdict.case_file` 路径/device 兜底推断旧 run。
- 现有 sentence/wisecards 数据全部在 `android/` 下；iOS / web 是绿地，从零长（web 首个 app=wordsweb，扇贝 web 站点 web.shanbay.com）。

## 目录导航

| 路径 | 是什么 | 谁维护 |
|---|---|---|
| `cases/<platform>/<app>/*.md` | 自然语言用例（L1，唯一对人暴露的；platform=android/ios/harmony/web） | 人 |
| `.claude/skills/` | preflight(开测前置：起抓包+环境校验+确认需求包，跑用例前的门) / mindmap-pipeline(脑图→一套用例端到端编排，总入口) / author-case / run-case(已渐进式披露：SKILL薄+references/) / retest(失败用例复测：失败item下挂复测子项，append不覆盖) / grow-graph / triage / publish(发布证据到 OSS+入库镜像，clone 后看全量) / teardown 手册（L2） | 人+你 |
| `engine/` | 执行内核（L3，零 LLM）：drivers/base.py 抽象、android_u2.py、drivers/ios_wda.py(WDA，已接真机；链路用 scripts/ios_up.py 起)、drivers/web_playwright.py(Playwright/Chromium，CDP 连常驻浏览器；链路用 scripts/web_up.py 起)、actions.py(20 handler)、locator.py(评分制)、vision_bridge.py(降级)、stability.py(护城河)、trace_cache.py、graph_runtime.py、har.py | 人 |
| `scripts/` | start_run/finish_run（证据目录起止）+ graph.py（网状图 CLI）+ har_window.py（triage 时间窗）+ mitm_modify.py（改包反证） | 人 |
| `data/apps/<platform>/<app>/nlgraph.json` | 页面网状图（静态种子 + 运行时生长） | 你回写 |
| `data/apps/<platform>/<app>/kb.json` `…/kb.md` | 跨 case 复用的踩坑库（**per-platform-per-app**；json 机器读 / md 人读，初始空） | 你回写 |
| `data/apps/<platform>/<app>/{pages,popups,semantic_dict}.yaml` | 页面签名 / 弹窗黑名单 / rid→术语 | 你回写 |
| `traces/<platform>/<app>/NN/` | 轨迹缓存（trace.json 分级 v1/v2/v3 + selectors.json） | 你回写 |
| `runs/<run_id>/` | 每次执行证据（verdict/plan/steps/decisions/network_flows + platform 字段），gitignore | 自动 |
| `runs_published/<run_id>/` | **入库**镜像：发布后的小 JSON 证据 + 脱敏 flows_flat.json + oss_manifest.json（rel→OSS url）。截图本体在 OSS，这里只留指针 → clone 后看全量。`scripts/oss_publish.py` 生成 | 你发布 |
| `viewer/` | Vue 3 + Vite 前端 + 零依赖 Node 后端（读 runs/traces/data 渲染；顶部按平台切工作空间；纯只读观测台。run 源 = runs/ ∪ runs_published/，本地缺截图时 /api/file 302 跳 OSS） | 人 |

## 怎么跑执行内核

```bash
cd /Users/gaochang/Work/cairn
# 设备列表（adb）：adb devices
# 所有命令默认 --platform android；接 iOS 时全部加 --platform ios（路径自动落到对应平台层）
python3 -m engine.agent --device <id> --platform android --app sentence page-id --json   # 识别当前页（带 confidence）
python3 -m engine.agent --device <id> --platform android snap --summary          # 看当前控件树摘要
python3 -m engine.agent --device <id> --platform android launch com.shanbay.sentence
python3 -m engine.agent --device <id> --platform android --app sentence replay cases/android/sentence/verify_checkin.yaml --report runs/xxx/case_run.json
python3 scripts/graph.py hint --app sentence --platform android --from <页> --to <页>   # 网状图查路径提示（首跑提速）
python3 scripts/har_window.py <flows.json> --since-epoch <t> --keywords checkin  # triage 取时间窗接口
# 无设备冒烟测试：python3 -m engine.tests.smoke_test （现有 7 个测试：smoke/degrade/trace_cache/stability/har/graph/drivers）

# 发布证据让别人 clone 后看全量：截图等二进制上传 OSS（内容哈希幂等去重），小 JSON + 脱敏 flows 写入入库镜像 runs_published/
python3 scripts/oss_publish.py --dry-run                                # 先干跑：只分类 + 统计字节，不上传不写盘
SHANBAY_COOKIE="$(cat /tmp/sb_cookie)" python3 scripts/oss_publish.py    # 真发布（图片默认压缩=compress+WebP，PNG截图省~80%、全分辨率；--resize 0.5 更省 / --full-res 原图）
#   cookie=staff auth_token 走环境变量，别写进文件/对话。发布完自行 review → git add runs_published && git commit（commit 只在你要求时）。
#   原始 network_flows 含 auth header/cookie，绝不入库/上传——只存脱敏投影。

# iOS 真机（WDA）：先在一个终端把设备链路挂起（类比 mitmproxy「起了别停」），再在另一终端跑 agent
python3 scripts/ios_up.py                                          # xcodebuild 拉起 WDA + usbmux 转发 8100→localhost:8100，挂着别关
#   首次需在 iPhone 设置→通用→VPN与设备管理 信任 com.shanbay.WebDriverAgentRunner，WDA 才起得来
python3 -m engine.agent --device <udid> --platform ios snap --summary   # 之后所有 agent 命令加 --platform ios 即可（agent.py 不改一行）
adb devices  # Android 设备列表；iOS 设备列表：python3 scripts/ios_up.py --list-devices

# Web（Playwright/Chromium）：同样「起了别停」——先在一个终端起常驻浏览器，再在另一终端跑 agent
python3 scripts/web_up.py "https://web.shanbay.com/wordsweb/labor-vocab-landing/"   # 起常驻 Chromium（CDP 9222）+ 打开 URL，挂着别关
#   需先装：pip3 install --break-system-packages playwright && python3 -m playwright install chromium
python3 -m engine.agent --device http://localhost:9222 --platform web --app wordsweb snap --summary     # --device 传 CDP 端点
python3 -m engine.agent --device http://localhost:9222 --platform web --app wordsweb page-id --json      # 之后所有命令加 --platform web（agent.py 不改一行）
#   launch 的「包名」位 = 目标 URL（page.goto）；back() 会退到 about:blank（栈底），回某页优先 launch 重定位
```

## 失败归因 A/B/C（triage）
失败步两次都挂后，取该步时间窗 HAR + 截图，判：
- **(A) UI bug**：接口 200+非空 body 但 UI 没渲染
- **(B) 接口问题**：未调用 / 错误码 / 空返回
- **(C) 用例问题**：步骤或验收点写错
结论写 `runs/<id>/verdict.json` 的 `triage{category,summary,evidence}`。
