# words-ai-dev-kit

扇贝单词业务 AI 开发指令集，基于 [ai-dev-kit](https://git.17bdc.com/ai-coding/ai-dev-kit) 扩展。

> 📣 **欢迎单词组内同事贡献 skill**
>
> 不止工程师——产品的 PRD 模板、设计的 Figma 流程、运营的报表脚本、QA 的测试约定，
> 只要是**你将来还会再做一次、别人也可能要做**的事，就值得沉淀进来。
>
> 收录走宽松路线，先有再好。新手请看 **[CONTRIBUTING.md](./CONTRIBUTING.md)**，
> 或在飞书群 `《飞书群名待补》` 划一句你的想法。

## 前置依赖

本插件引用了 ai-dev-kit 中的以下 skills，需要先安装对应 plugin：

| 引用的 Skill | 来源 Plugin | 用途 |
|-------------|-----------|------|
| `/writing-prds` | bay-product-design | PRD 生成（writer/reviewer 循环） |
| `/writing-tech-docs` | bay-development | 技术方案生成 |
| `/developing-python-backend` | bay-development | Python 后端 TDD |
| `/bay-writing-testcases` | bay-development | 测试用例生成（writer/reviewer 循环） |
| `/bay-configuring-lark` | bay-base | 飞书登录态配置 |

```bash
# 安装 ai-dev-kit marketplace（仅首次）
claude plugin marketplace add git@git.17bdc.com:ai-coding/ai-dev-kit.git

# 安装依赖 plugin
claude plugin install bay-base@ai-dev-kit
claude plugin install bay-product-design@ai-dev-kit
claude plugin install bay-development@ai-dev-kit
```

## 组织思路

仓库切成 **9 个独立 plugin**，按 **工作流耦合度** 组织（详见 [CONTRIBUTING.md §4.1](./CONTRIBUTING.md)）：

| Plugin | 类型 | 一句话 | 主要服务角色 |
|---|---|---|---|
| **`words-feature-cycle`** | 🔁 工作流 | 功能开发完整周期：初始化 → PRD → 技术方案 → 测试用例 → 后端 TDD | 全员（产品 / 工程） |
| **`words-growth-aio`** | 🔁 工作流 | AIO 品牌 AI 搜索占位全流程（采集 → 分析 → 报告）| 增长运营 |
| **`words-feishu`** | 📦 功能聚合 | 飞书 / 文档 IO 统一封装 | 全员 |
| **`words-mobile`** | 📦 功能聚合 | Android 端到端打测试包 | 移动端工程 |
| **`words-contributing`** | 📦 元工具 | 把本地写好的 skill 一键发布到本仓库 | 所有贡献者 |
| **`words-copywriting`** | 📦 功能聚合 | 扇贝产品宣传软文的原创与改写（多渠道、多考试场景、SEO/AIO） | 内容运营 |
| **`words-git`** | 📦 功能聚合 | 跨端 Git 流程：按端侧自动定位仓库、切分支、开 MR；非技术用户也能用 | 全员（尤其是产品 / 设计 / 运营） |
| **`words-admin`** | 📦 功能聚合 | 后台管理：admin.shanbay.com 运营操作（补打卡等） | 运营 / 客服 |
| **`words-bitable-scheduler`** | 📦 功能聚合 | 飞书多维表格本地调度器：Colab 脚本迁移、脚本注册、任务触发与跟踪 | 工程 / 运营 |
| **`words-content`** | 📦 功能聚合 | 内容生产：每日一句批量复用、词书封面定制、ABC 词典 TTS 音频生成与用户反馈处理、真题文本识别导入、真题例句批量上传 | 内容组 |

> 当前未覆盖的领域（Figma 设计、神策埋点 / A/B 实验、QA 自动化、iOS TDD 等）按需新建 plugin——参考 [CONTRIBUTING.md §4](./CONTRIBUTING.md) 决策表。

## 安装

### 角色套餐（一行装齐常用组合）

```bash
# 单词组研发同学（产品 / 后端 / 移动端 都适用）
claude plugin install words-feature-cycle words-feishu @words-ai-dev-kit

# Android 工程师加装移动端打包
claude plugin install words-feature-cycle words-feishu words-mobile @words-ai-dev-kit

# 增长运营
claude plugin install words-growth-aio words-feishu @words-ai-dev-kit

# 想贡献 skill 的同事再加一个
claude plugin install words-contributing @words-ai-dev-kit
```

### 单独安装某个 plugin

```bash
# 1. 添加插件市场源（仅首次）
claude plugin marketplace add git@git.17bdc.com:words/ai-dev-kit.git

# 2. 按需挑一个或几个
claude plugin install words-feature-cycle@words-ai-dev-kit
claude plugin install words-feishu@words-ai-dev-kit
claude plugin install words-mobile@words-ai-dev-kit
claude plugin install words-growth-aio@words-ai-dev-kit
claude plugin install words-contributing@words-ai-dev-kit
claude plugin install words-copywriting@words-ai-dev-kit
claude plugin install words-git@words-ai-dev-kit
claude plugin install words-admin@words-ai-dev-kit
```

### 保持插件最新

```bash
claude plugin marketplace update words-ai-dev-kit
# 然后重装目标 plugin 即可（或开 auto-update）
```

### Codex 插件

Codex 版本由 `scripts/convert_claude_plugins_to_codex.py` 生成到 [`codex/`](codex/README.md)。
安装、重装、本地开发和生成校验说明统一见 [`codex/README.md`](codex/README.md)。

### 方式二：npx skills（仅安装 Skill 文件）

> `npx skills` 仅安装 SKILL.md 文件，不含 commands / hooks / agents。建议优先用上面的 plugin 方式。
> Codex 生成产物位于 `codex/dist/`，`npx skills add --full-depth` 会跳过该目录，避免重复发现生成 skill。

```bash
# 安装所有技能
npx skills add git@git.17bdc.com:words/ai-dev-kit.git

# 安装单个技能
npx skills add ./plugins/words-feishu/skills/bay-reading-docs
```

## Plugin 内容

### words-feature-cycle — 功能开发完整周期 🔁

研发同学的日常主战场：从工作空间初始化到 PRD、技术方案、测试用例、后端 TDD，**一个 plugin 装齐**。内部 commands 相互调用，sub-agents 配套使用——典型的工作流耦合 plugin。

**Commands**（按周期阶段排序）：

| Command | 阶段 | 说明 |
|---------|------|------|
| `/words-init-workspace` | 初始化 | 创建本地工作空间 + 飞书需求节点 + `.words-workspace.json` |
| `/words-writing-prd` | 提出 | 调研驱动的 PRD 生成（调 `bay-analyzing-requirements`） |
| `/words-writing-tech-doc` | 开发 | 技术方案生成（调 `bay-exploring-feature-knowledge`） |
| `/words-writing-test-cases` | 验收 | 基于改动范围的精准测试用例（调 `bay-exploring-feature-knowledge`） |
| `/words-developing-backend` | 开发 | 后端 TDD 开发（Python / Go，Go 走 RED-GREEN-REFACTOR 编排） |

**Skills**（被上面的 commands 内部调用）：

| Skill | 描述 |
|---|---|
| [`bay-analyzing-requirements`](plugins/words-feature-cycle/skills/bay-analyzing-requirements/README.md) | 需求现状分析：可行性、冲突检测、破坏性评估等 7 个维度 |
| [`bay-exploring-feature-knowledge`](plugins/words-feature-cycle/skills/bay-exploring-feature-knowledge/README.md) | 功能知识库管理：查询已有知识 / 现场梳理代码 / PRD 定向验证 |
| [`backend-review-guardrails`](plugins/words-feature-cycle/skills/backend-review-guardrails/README.md) | 后端代码 review 的数据库与 Redis 风险检查清单 |
| [`developing-go-backend`](plugins/words-feature-cycle/skills/developing-go-backend/README.md) | GoBay 框架 Go 后端 RED-GREEN-REFACTOR TDD 编排 |

**Agents**（Go TDD 子代理）：`go-backend-test-writer`（RED）、`go-backend-implementer`（GREEN）、`go-backend-refactorer`（REFACTOR）

### words-feishu — 飞书 / 文档 IO 📦

**Skills**：

| Skill | 描述 |
|---|---|
| [`bay-reading-docs`](plugins/words-feishu/skills/bay-reading-docs/README.md) | 统一文档读取（飞书 / 语雀 / 本地），完整保留表格、图片等富文本 |
| [`lark-writing-mindnote`](plugins/words-feishu/skills/lark-writing-mindnote/README.md) | 写入飞书思维笔记（Playwright 浏览器自动化） |
| [`lark-reading-mindnote`](plugins/words-feishu/skills/lark-reading-mindnote/README.md) | 读取飞书思维笔记内容和评论 |
| [`lark-expanding`](plugins/words-feishu/skills/lark-expanding/README.md) | 飞书写入预处理：图片 token、表格 rowspan/colspan、多行 cell |

### words-mobile — 移动端 📦

**Skills**：

| Skill | 描述 |
|---|---|
| [`bay-words-bump-and-build`](plugins/words-mobile/skills/bay-words-bump-and-build/SKILL.md) | shanbay-words-android 端到端打测试包：bump → push → Jenkins build |
| [`mobile-capture`](plugins/words-mobile/skills/mobile-capture/SKILL.md) | 用 mitmproxy 抓 / 查 / 改移动 app HTTP(S) 流量（启停 mitmweb、查 flows、热加载规则改响应） |
| [`evaluating-harmonyos-need`](plugins/words-mobile/skills/evaluating-harmonyos-need/SKILL.md) | 判断产品需求是否需要在鸿蒙端跟随开发：基于实测占比（DAU 4.15% / GMV 4.53%）和 ROI 量化输出五维评估 + 明确决策 |

### words-contributing — 贡献元工具 📦

**Skills**：

| Skill | 描述 |
|---|---|
| [`words-publishing-skill`](plugins/words-contributing/skills/words-publishing-skill/README.md) | 把本地写好的 skill 一键发布到本仓库：合规校验 → 选 plugin → 建分支 → push → 自动创 MR |
| [`reviewing-skill-mr`](plugins/words-contributing/skills/reviewing-skill-mr/SKILL.md) | 审查本仓库 MR 是否适合合并：frontmatter / 触发词撞车（含子 agent 盲测路由）/ 公约合规 / 版本一致性，输出裁决，可选回贴 MR 评论 |

### words-growth-aio — 增长运营 AIO

从飞书多维表格读取配置，Playwright 远程采集 AI 平台回答，关键词匹配计算提及率，多 Agent 流水线生成九章日报。

**Commands**：

| Command | 说明 |
|---------|------|
| `/aio-collect` | 读取配置 → 远程采集 → 结果写入飞书（详情记录 + 附件） |
| `/aio-analyze-and-report` | 关键词匹配 → 提及率回填 → 多 Agent 生成日报 → 写入知识库 |

**Skills**：`aio-config-target` / `aio-config-brand` / `aio-config-platform` / `aio-register`

**Agents**（日报生成流水线）：`aio-report-map`、`aio-report-ch4` 至 `ch9`

### words-copywriting — 内容营销 📦

扇贝产品宣传软文的原创与改写。内置产品资料库（数据唯一来源、防虚构）、8 个渠道规范（百家号 / 头条 / 知乎 / 搜狐 / 网易 / 应用商店 / 百科 / 官网）、4 种写作模式（原创 / 改写洗稿 / 功能点扩写 / 测评对比）、品牌官号体与博主体两套语感系统，以及 SEO/AIO 优化和多重质量自检清单。

**Skills**：

| Skill | 描述 |
|---|---|
| [`copywriting`](plugins/words-copywriting/skills/copywriting/SKILL.md) | 扇贝产品宣传软文的改写与原创：多渠道适配、多考试场景、SEO/AIO 优化、数据虚构零容忍 |

### words-git — 跨端 Git 流程 📦

面向**非技术用户**（产品 / 设计 / 运营）的 git 工作流路由器。自动按端侧（前端 / iOS / Android 主工程 / Android v2 / 后端）从正确 base 分支切 feature 分支，做完后开正确的 MR；支持库名 / 截图 / 产品名等多种入口，本地没 clone 时自动 clone；跨会话续上、状态机式判断当前在哪一段（避免后端三段式 `feature → master → staging → production` 跳步）。本 skill 不写 commit message（委托 `bay-git`），不直接调 glab（委托 `bay-gitlab`），只做"从哪切 / 往哪合"的路由。

**Skills**：

| Skill | 描述 |
|---|---|
| [`bay-platform-branching`](plugins/words-git/skills/bay-platform-branching/SKILL.md) | 按端侧应用 git 分支起点 + 合并目标规则；前端两段式 / 后端三段式 / 移动端单 MR 自动判别 |

### words-admin — 后台管理 📦

**Skills**：

| Skill | 描述 |
|---|---|
| [`bay-admin-checkin`](plugins/words-admin/skills/bay-admin-checkin/README.md) | 在 admin.shanbay.com 后台为指定用户补打卡，支持单日或日期范围批量操作 |

### words-bitable-scheduler — 飞书多维表格本地调度器 📦

基于飞书多维表格 + WebSocket 长连接的通用本地任务调度系统。用户通过表单提交任务，调度器自动下载脚本和输入文件、本地执行、结果回填到表格。支持 Colab notebook 一键迁移。代码仓库：[lark-bitable-scheduler](https://git.17bdc.com/words/lark-bitable-scheduler)。

**Skills**：

| Skill | 描述 |
|---|---|
| [`convert-notebook`](plugins/words-bitable-scheduler/skills/convert-notebook/SKILL.md) | 将 ipynb 转换为调度器兼容的 py 脚本，去除 Colab 特有代码 |
| [`register-script`](plugins/words-bitable-scheduler/skills/register-script/SKILL.md) | 上传脚本到飞书多维表格脚本配置表 |
| [`create-task`](plugins/words-bitable-scheduler/skills/create-task/SKILL.md) | 创建任务记录触发调度器执行 |

**Commands**：

| Command | 描述 |
|---|---|
| [`setup-script`](plugins/words-bitable-scheduler/commands/setup-script.md) | 一站式 notebook 转换 + 交互式注册 |
| [`run-task`](plugins/words-bitable-scheduler/commands/run-task.md) | 触发任务 + 轮询状态 + 失败分析 |

### words-content — 内容生产工具集 📦

**Skills**：

| Skill | 描述 |
|---|---|
| [`bay-daily-quote`](plugins/words-content/skills/bay-daily-quote/README.md) | 每日一句历史内容批量复用：拉取 → 飞书审核表 → 批量发布 |
| [`bay-cover-design`](plugins/words-content/skills/bay-cover-design/README.md) | 最小改动定制词书封面：替换书名 / 主插图，导出 JPG + TinyPNG 压缩 |
| [`abc-tts-audio`](plugins/words-content/skills/abc-tts-audio/README.md) | ABC 词典 TTS 音频合成与上传：Azure TTS → AAC → OSS，返回 audio_name / audio_url |
| [`exam-text-import`](plugins/words-content/skills/exam-text-import/README.md) | 英语试卷真题文本识别与导入：OCR 识别 → 校对 → 飞书文档审核 → 分句写入飞书表格 |
| [`bay-ext-examples-upload`](plugins/words-content/skills/bay-ext-examples-upload/README.md) | 真题例句批量上传 ABC 词典：数据校验 → TTS 音频生成 → OSS 打包 → 后台批量创建 |

**Commands**：

| Command | 描述 |
|---|---|
| [`bay-feedback-revise`](plugins/words-content/commands/bay-feedback-revise.md) | 处理 ABC 词典用户反馈：飞书表格读取 → 后台核查修正 → TTS 音频更新 → 结果回填 |

## 飞书坐标

| 资源 | ID | 用途 |
|------|-----|------|
| Wiki space | `7631065595531316154` | 统一空间 |
| 需求文档池 | `QirFwfHhXiwB5nkaKFAc2JAXnPc` | 需求节点挂载（PRD / 技术方案 / 测试用例的父节点） |
| 知识库根节点 | `VFMAwJXRwiyZoAkEgamc0MsGnDb` | 功能知识存储 |
| 产品节点 | `YK3kwJ2CEi86yokFtv6cMeOQnmh` | 扇贝单词英语版APP |

## 目录结构

```
words-ai-dev-kit/
├── .claude-plugin/marketplace.json     # 市场主配置（列出 9 个 plugin）
├── codex/                              # Codex 插件文档和 dist 产物（由根级 .agents/plugins/marketplace.json 引用）
├── CONTRIBUTING.md                     # 贡献指南
├── docs/
│   ├── developing-go-backend-design.md
│   └── announce-contribute.md          # 贡献广播文案
└── plugins/
    ├── words-feature-cycle/            # 🔁 功能开发完整周期
    │   ├── commands/ (init-workspace, writing-prd, writing-tech-doc, writing-test-cases, developing-backend)
    │   ├── agents/ (3 Go TDD agents)
    │   └── skills/ (bay-analyzing-requirements, bay-exploring-feature-knowledge, backend-review-guardrails, developing-go-backend)
    ├── words-feishu/                   # 📦 飞书 / 文档 IO
    │   └── skills/ (bay-reading-docs, lark-writing-mindnote, lark-reading-mindnote, lark-expanding)
    ├── words-mobile/                   # 📦 移动端
    │   └── skills/ (bay-words-bump-and-build, mobile-capture)
    ├── words-growth-aio/               # 🔁 增长运营 AIO
    │   ├── commands/ (aio-collect, aio-analyze-and-report)
    │   ├── agents/ (aio-report-map + ch4-ch9)
    │   ├── references/aio-process-template.md
    │   └── skills/ (aio-config-target, aio-config-brand, aio-config-platform, aio-register)
    ├── words-contributing/             # 📦 贡献元工具
    │   └── skills/ (words-publishing-skill, reviewing-skill-mr)
    ├── words-copywriting/              # 📦 内容营销
    │   └── skills/copywriting/ (SKILL.md + references: product-brief / channels / modes / ...)
    ├── words-git/                      # 📦 跨端 Git 流程
    │   └── skills/bay-platform-branching/
└── words-admin/                    # 📦 后台管理
        └── skills/bay-admin-checkin/ (SKILL.md + README.md + scripts/checkin.py)
├── words-bitable-scheduler/        # 📦 飞书多维表格本地调度器
│       ├── skills/ (convert-notebook, register-script, create-task)
│       └── commands/ (setup-script, run-task)
└── words-content/                  # 📦 内容生产工具集
        ├── skills/ (bay-daily-quote, bay-cover-design, abc-tts-audio, exam-text-import, bay-ext-examples-upload)
        └── commands/ (bay-feedback-revise)
```

## 贡献指南

完整指南见 **[CONTRIBUTING.md](./CONTRIBUTING.md)**——包含"什么值得做成 skill"、SKILL.md 写法、提交流程、review 关注点。

**贡献前先想好归属**（详细决策树见 [CONTRIBUTING.md §4](./CONTRIBUTING.md)）：

| 你的 skill 主要做什么 | 推荐 plugin |
|---|---|
| 是研发周期某一阶段的工具（PRD / tech-doc / test-cases / 后端 dev / workspace 管理）| `words-feature-cycle` |
| 飞书 / 语雀 / 本地文档读写、思维笔记 | `words-feishu` |
| Android / iOS 移动端 | `words-mobile` |
| 增长运营 AIO 流程 | `words-growth-aio` |
| 贡献本仓库的元工具 | `words-contributing` |
| 内容营销 / 宣传软文 / 渠道文案 | `words-copywriting` |
| 跨端 Git 流程 / 分支策略 / MR 路由 | `words-git` |
| admin.shanbay.com 后台运营操作 | `words-admin` |
| 都不沾边（Figma / 神策 / iOS TDD 等）| 新建 plugin，先开 issue 讨论命名 |

**TL;DR**：复制 [`plugins/words-feishu/skills/bay-reading-docs/`](plugins/words-feishu/skills/bay-reading-docs/) 改名作脚手架 → 改 frontmatter 和正文 → `npx skills add ./plugins/<plugin>/skills/<name>` 本地实测 → 更新对应 plugin 的本 README 段落和 `plugin.json` version → 提 MR。

> 也可以装 `words-contributing` 后用 `words-publishing-skill` 一键发布（合规校验 + 自动创 MR）。

> 市场主配置见 [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json)，各插件配置位于 `plugins/<name>/.claude-plugin/plugin.json`。
