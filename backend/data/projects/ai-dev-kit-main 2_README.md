# ai-dev-kit

扇贝 AI 编程助手技能集合，兼容 Claude Code Plugin Marketplace、Cursor、GitHub Copilot、Gemini CLI 等主流工具。

## 组织思路

插件按**组织架构**和**岗位**两个维度**扁平切分**为 4 个 plugin，互相正交——一个 skill 只属于一个 plugin，不跨 plugin 复用。按岗位挑选安装即可。

| Plugin               | 维度            | 覆盖人群                  | 一句话定位                                                                                                                                 |
| -------------------- | --------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `bay-base`           | 组织架构 · 全员 | 全扇贝员工                | 所有人都要用的基础设施：飞书、语雀、Git / GitLab、画图                                                                                     |
| `bay-rdc`            | 组织架构 · 部门 | 研发中心全员              | RDC 跨岗位共享：Lab 全流程 + QA 测试指令集                                                                                                 |
| `bay-product-design` | 岗位            | 产品 / 运营 / 设计 / 内容 | PRD、Figma 设计、数据分析、实验复盘、盲评                                                                                                  |
| `bay-development`    | 岗位            | 开发 / QA                 | 端无关 TDD 方法论（plan.html + RED-GREEN-REVIEW）、写测试用例、各端测试引擎（API / Android UI / iOS UI）、技术方案、各端支撑工具与工程运维 |

**建议组合**：所有人都装 `bay-base`；RDC 同事加装 `bay-rdc`；再按岗位装 `bay-product-design` 或 `bay-development`（开发 / QA 的端无关 TDD 全流程都在 `bay-development` 里）。

## Plugin 内容

### bay-base — 全员基础（13 skills）

| Skill                                                                                                  | 描述                                                                      |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| [`ai-dev-kit-guide`](plugins/bay-base/skills/ai-dev-kit-guide/README.md)                               | 回答 ai-dev-kit 安装、技能用法、插件更新等问题                            |
| [`bay-configuring-lark`](plugins/bay-base/skills/bay-configuring-lark/README.md)                       | 一键安装 lark-cli、OAuth 授权、安装飞书 AI Agent Skills                   |
| [`bay-cli`](plugins/bay-base/skills/bay-cli/SKILL.md)                                                  | 安装、配置 bay-cli 并调用扇贝内部 API（spec list / search / call / curl） |
| [`bay-yuque`](plugins/bay-base/skills/bay-yuque/README.md)                                             | 操作语雀文档（创建、读取、搜索、目录管理）                                |
| [`bay-git`](plugins/bay-base/skills/bay-git/README.md)                                                 | 校验 git commit 的 AI 协同标识并规范分支管理                              |
| [`bay-gitlab`](plugins/bay-base/skills/bay-gitlab/SKILL.md)                                            | 访问扇贝 GitLab：搜索项目、列出 / 查看 / 创建 MR，项目管理（建仓、设 ci_config_path）      |
| [`bay-drawing-images`](plugins/bay-base/skills/bay-drawing-images/README.md)                           | AI 文生图、Mermaid 图表、HTML 数据可视化                                  |
| [`bay-sharing-html`](plugins/bay-base/skills/bay-sharing-html/SKILL.md)                                | 把本地 HTML 设计稿（含依赖资源）上传到 CDN，返回公网 URL                  |
| [`bay-embedding-lark-html-figures`](plugins/bay-base/skills/bay-embedding-lark-html-figures/README.md) | 生成填满视口、宽高自适应的 HTML 配图，内嵌进飞书文档（iframe 区块）       |
| [`tinypng`](plugins/bay-base/skills/tinypng/SKILL.md)                                                  | 使用 TinyPNG API 压缩图片（PNG / JPEG / WebP）                            |
| [`bay-operating-securl`](plugins/bay-base/skills/bay-operating-securl/README.md)                       | securl（安全 curl 包装）安装、配置、升级，拦截命令行明文携带凭证的 curl   |
| [`bay-optimizing-llm-solutions`](plugins/bay-base/skills/bay-optimizing-llm-solutions/SKILL.md)        | 调研并优化大模型方案：筛选候选模型、自动调试 Prompt                       |
| [`removing-ai-flavor`](plugins/bay-base/skills/removing-ai-flavor/README.md)                           | 去 AI 味：把"像 AI 写的"文字改成像人写的（跨中英、跨文体通用）            |

### bay-rdc — 研发中心共享（8 skills）

**Lab 全流程 skill（按任务名驱动飞书 + 代码 + 设计闭环）**

- [`lab-writing-prd`](plugins/bay-rdc/skills/lab-writing-prd/SKILL.md) — 按任务名生成需求文档 PRD 并回写 Task
- [`lab-designing-ui`](plugins/bay-rdc/skills/lab-designing-ui/SKILL.md) — 按任务名生成 Figma 设计稿
- [`lab-building-design-system`](plugins/bay-rdc/skills/lab-building-design-system/SKILL.md) — 按产品名 + 品牌色搭建 Figma 设计系统 + Wiki 设计指南
- [`lab-writing-tech-doc`](plugins/bay-rdc/skills/lab-writing-tech-doc/SKILL.md) — 按任务名生成技术方案
- [`lab-writing-test-cases`](plugins/bay-rdc/skills/lab-writing-test-cases/SKILL.md) — 按任务名生成测试用例并写入测试用例 base
- [`lab-running-tests`](plugins/bay-rdc/skills/lab-running-tests/SKILL.md) — 按 Lab 任务名读用例、调各端测试引擎执行，报告落飞书并回写「执行记录」

**QA 测试 skill（按 QA Base 驱动用例落库 + 执行）**

- [`qa-writing-test-cases`](plugins/bay-rdc/skills/qa-writing-test-cases/SKILL.md) — QA 测试用例生成并按去重 / 复用 / 新增写入 QA 多维表格 Base
- [`qa-running-tests`](plugins/bay-rdc/skills/qa-running-tests/SKILL.md) — QA 从 Base 读用例、调各端测试引擎执行并回写结果

### bay-product-design — 产品 / 运营 / 设计 / 内容（12 skills）

| Skill                                                                                                                  | 描述                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [`writing-prds`](plugins/bay-product-design/skills/writing-prds/README.md)                                             | 根据口述想法生成 PRD；可 `/writing-prds <产品想法> [--er] [--flow]` 传入，需求详述不分前台/后台、有设计图时按 page·status 组织    |
| [`bay-initializing-product-workspace`](plugins/bay-product-design/skills/bay-initializing-product-workspace/README.md) | 分析本地仓库并初始化三级产品文档结构（基于 sensors-cli 创建神策概览）                                                             |
| [`designing-figma`](plugins/bay-product-design/skills/designing-figma/README.md)                                       | 在 Figma 中设计页面和组件，DESIGN-REVIEW 循环                                                                                     |
| [`figma-building-design-system`](plugins/bay-product-design/skills/figma-building-design-system/README.md)             | 在 Figma 中构建六层结构的设计系统                                                                                                 |
| [`building-html-design-system`](plugins/bay-product-design/skills/building-html-design-system/README.md)               | 为产品从零搭 HTML/CSS 设计系统 + 初始化 design 工作空间 + 生成产品宪法 skill（craft 交 huashu-design，本 skill 管格式/结构/校验） |
| [`designing-from-html-design-system`](plugins/bay-product-design/skills/designing-from-html-design-system/README.md)   | 在已建好的 HTML 设计系统上做一次需求迭代：designs/<date>/ 可点原型 + SPEC，零新原子优先、缺的标待回流                             |
| [`bay-cover-design`](plugins/bay-product-design/skills/bay-cover-design/SKILL.md)                                      | 最小改动定制单词书封面，导出 TinyPNG 压缩 JPG                                                                                     |
| [`bay-configuring-sensors-cli`](plugins/bay-product-design/skills/bay-configuring-sensors-cli/SKILL.md)                | sensors-cli（神策命令行工具）安装初始化向导，安装 + 登录 + 验证                                                                   |
| [`bay-analyzing-sensors`](plugins/bay-product-design/skills/bay-analyzing-sensors/SKILL.md)                            | 用 `sensors-cli` 命令行做神策事件 / 漏斗 / 留存 / LTV 分析（metadata-first，CLI 双重核查）                                        |
| [`bay-blind-eval`](plugins/bay-product-design/skills/bay-blind-eval/SKILL.md)                                          | Argilla 双盲评测全流程                                                                                                            |
| [`bay-reviewing-experiments`](plugins/bay-product-design/skills/bay-reviewing-experiments/README.md)                   | 实验结果复盘（基于 sensors-cli 拉数据 + 卡方检验）                                                                                |
| [`bay-analyzing-agent-kpi`](plugins/bay-product-design/skills/bay-analyzing-agent-kpi/README.md)                       | 分析 Agent KPI，生成 AI 工作流效果周报                                                                                            |

### bay-development — 开发 / QA（25 skills）

主会话作为 team-lead + 2 个端无关子代理（`tdd-test-writer` 写测试 / `code-reviewer` 审实现），按粗粒度 step 跑 🔴 RED → 🟢 GREEN → 🔍 REVIEW 循环。Reviewer 优先调用 codex MCP 主审，只审代码实现（漏洞 / 契约偏差 / 不够优雅），与 tidy 解耦。端专属命令（构建 / 测试 / lint）由主会话在 prompt 注入，iOS / Android / Web / Python 共用同一套通用 TDD 流程。

**通用 TDD 方法论（端无关）**

- [`planning-development`](plugins/bay-development/skills/planning-development/SKILL.md) — 开发规划：产出单一 `plan.html`（需求上下文 + 物料盘点 + 文件变更清单 + 各 step 接口契约），物料缺失硬阻断，主会话直接执行不 spawn subagent；可 `/bay-development:planning-development <需求描述 | PRD路径>` 直接传入
- [`developing-code`](plugins/bay-development/skills/developing-code/SKILL.md) — TDD / 单 step 执行循环：按 `plan.html` 逐 step，或无 plan 时把口述需求当作单个 step（预估 >500 行提示先用 planning）；默认 `TeamCreate` 3 人团队 🔴 RED 派发 writer → 🟢 GREEN 主会话亲自实现 → 🔍 REVIEW 派发 reviewer（codex MCP 优先）；`skip_test` / `skip_review` 两开关（opt-out）跳过测试或评审，外加 **opt-in 的 `--tidy`（默认关）**——开启后由主会话在 run 首尾各做一次 Tidy First / Tidy After 整理、按结构/行为分离逐段自动 commit（reviewer 不参与 tidy）；三者 `argument-hint` 显示 `--skip-test` / `--skip-review` / `--tidy`，也可自然语言触发
- [`applying-equivalence-class-analysis`](plugins/bay-development/skills/applying-equivalence-class-analysis/SKILL.md) — ECP + BVA 方法论：每个参数划分等价类 + 数值约束覆盖边界值两侧
- [`applying-pairwise-testing`](plugins/bay-development/skills/applying-pairwise-testing/SKILL.md) — pairwise 测试组合生成器：≥ 3 个参数断言时把笛卡尔积压成最小组合（pytest / vitest / table 三种格式）
- [`tidy-first`](plugins/bay-development/skills/tidy-first/SKILL.md) — 基于 Kent Beck《Tidy First?》的代码整理：15 种整理手法 + Tidy First/After/Later/Never 决策框架，结构变更与行为变更独立 commit
- [`quieting-test-output`](plugins/bay-development/skills/quieting-test-output/README.md) — Makefile 测试命令精简输出（pytest / Gradle / xcodebuild）

**交付质量度量（指标采集）**

- [`recording-code-reviews`](plugins/bay-development/skills/recording-code-reviews/SKILL.md) — 把一次 TDD 🔍 REVIEW 的结果（reviewer 各轮 blocking_issues + 主会话采纳/修复决定）经固定脚本幂等写入飞书 Base「代码 Review 记录表 + Review 详情表」（指标 2 · 有效 Review 率采集）；派生计数全由脚本算、按 `review_id` 幂等、非阻塞 best-effort；由 `developing-code` 在 review_pass 收口后自动调用
- [`evaluating-techdoc-diff`](plugins/bay-development/skills/evaluating-techdoc-diff/SKILL.md) — 评估技术文档 V0 → V_final 两版 diff，固定脚本按 `revision_id` 拉历史正文（docx blocks API）+ 算行级 diff 占比 + 章节增删，四档判定（过 / 微调 / 大改 / 重写）后回写 Base「技术文档评估表」（指标 1）；人工触发，默认扫 `状态=待评估`

**测试 / QA（写用例 + 各端测试引擎）**

- [`bay-writing-testcases`](plugins/bay-development/skills/bay-writing-testcases/SKILL.md) — 方向无关写测试用例：PRD / 设计稿驱动端到端业务用例，或真实 API doc 做等价类 / 边界值 / pairwise 接口用例设计；只产内容不落库
- [`bay-testing-apis`](plugins/bay-development/skills/bay-testing-apis/README.md) — 扇贝 Coast 服务 API 自动化测试：本地启动 / 已部署 staging 双模式，判断已有脚本 → 缺的从用例或 OpenAPI/Swagger 批量补（含自修复）→ pytest+httpx → Allure 报告，附可复用脚手架
- [`bay-testing-android-ui`](plugins/bay-development/skills/bay-testing-android-ui/README.md) — Android UI 自动化测试（Espresso / UIAutomator）：判断已有脚本 → 补脚本 → 运行 → 抓 UI 截图传扇贝 CDN
- [`bay-testing-ios-ui`](plugins/bay-development/skills/bay-testing-ios-ui/README.md) — iOS UI 自动化测试（XCUITest + Scenario 基建）：判断已有脚本 → 补脚本 → 运行 → 抓 UI 截图传扇贝 CDN

**iOS 支撑**

- [`bay-ios-conventions`](plugins/bay-development/skills/bay-ios-conventions/SKILL.md) — 扇贝 iOS 项目（BayModule\*）编码规范
- [`figma-to-ios`](plugins/bay-development/skills/figma-to-ios/SKILL.md) — 从 Figma 设计稿生成 iOS 代码

**Android 支撑**

- [`bay-android-knowledge`](plugins/bay-development/skills/bay-android-knowledge/README.md) — 扇贝 Android 最佳实践知识库检索

**Python / 迁移**

- [`migrating-to-uv`](plugins/bay-development/skills/migrating-to-uv/README.md) — pip/requirements 迁移到 uv（国内项目）
- [`bay-migrating-to-uv-oversea`](plugins/bay-development/skills/bay-migrating-to-uv-oversea/README.md) — pip/requirements 迁移到 uv（海外项目：AWS ECR / CodeBuild / apply.sh 部署）

**技术方案**

- [`writing-tech-docs`](plugins/bay-development/skills/writing-tech-docs/README.md) — 根据需求文档生成技术方案；可 `/writing-tech-docs <PRD路径/URL>` 直接传入

**工程通用**

- [`bay-jenkins`](plugins/bay-development/skills/bay-jenkins/SKILL.md) — Jenkins 构建（Android / Flutter / iOS 打包）
- [`bay-sentry-dashboard`](plugins/bay-development/skills/bay-sentry-dashboard/SKILL.md) — Sentry Dashboard Widget 管理
- [`bay-dms`](plugins/bay-development/skills/bay-dms/README.md) — 调阿里云 DMS 企业版（Tid 41288）：SELECT 查询、提交 DDL/DML 工单（含 SQL Review）、查工单状态，按 DbType 路由 + StandardGroup 透明化 + 操作风险提示；跨服务数据源（如请求日志→Shentu）走 landmarks 登记表定位。配套 DDL 收权方案
- [`mobile-device-screenshot`](plugins/bay-development/skills/mobile-device-screenshot/SKILL.md) — iOS Simulator / 物理设备截图
- [`cursor-insights`](plugins/bay-development/skills/cursor-insights/README.md) — Cursor 使用模式洞察与 Rules 提取
- [`bay-configuring-trackerignore`](plugins/bay-development/skills/bay-configuring-trackerignore/SKILL.md) — 诊断并修复项目 `.trackerignore`，矫正 ai-commit-tracker 统计偏差

**前端工程**

- [`creating-bay-next`](plugins/bay-development/skills/creating-bay-next/README.md) — 用 `@shanbay/create-bay-next` 从 0 到 1 拉起 bay-next（Next.js）前端项目：选业务组 + 输项目名 → 生成骨架 + 本地 git + GitLab API 建仓设 CI path，再自动向 `gitlab-ci-yml`（CI 接入）与 `envoy-xds`（网关路由）建分支推 MR（停在 MR、人工 merge）；deploy job 内幂等 `kubectl apply` k8s Service；支持 web/admin 模板与自定义 group 存放位置

> 市场主配置见 [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json)，各插件具体配置位于 `plugins/<name>/.claude-plugin/plugin.json`。

## 安装

### 方式一：Claude Code Plugin（强烈推荐）

Claude Code Plugin 支持自动更新、hook 拦截、subagent 调度等完整能力。即便你日常使用 Cursor、Gemini CLI 等工具，也推荐用这个方式安装——安装不需要登录，下载后直接执行命令即可。

```bash
# 1. 添加插件市场源（仅首次需要）
claude plugin marketplace add git@git.17bdc.com:ai-coding/ai-dev-kit.git

# 2. 安装插件（任选其一，可叠加）
claude plugin install bay-base@ai-dev-kit            # 全员基础（推荐所有人安装）
claude plugin install bay-rdc@ai-dev-kit             # 研发中心共享（RDC 同事安装）
claude plugin install bay-product-design@ai-dev-kit  # 产品 / 运营 / 设计 / 内容
claude plugin install bay-development@ai-dev-kit     # 开发 / QA（含端无关 TDD 全流程）
```

#### 保持插件最新

```bash
# 更新市场索引，然后更新已安装插件
claude plugin marketplace update ai-dev-kit
claude plugin update bay-development@ai-dev-kit
```

也可以在 `claude plugin` 管理界面中为 ai-dev-kit 启用 **auto-update**，启用后每次启动 Claude Code 会自动同步市场索引。

### 方式二：npx skills（仅安装 Skill 文件）

> 只有 Claude Code 具备完整的 commands / hooks / agents 管理能力，`npx skills` 仅能安装 SKILL.md 文件。建议优先用方式一。

```bash
# 安装所有技能
npx skills add git@git.17bdc.com:ai-coding/ai-dev-kit.git

# 安装单个技能（路径指向 plugin 内的 skill 实体目录）
npx skills add ./plugins/bay-base/skills/bay-yuque
```

安装时会提示选择范围：全局（`~/.claude/`）适合通用技能，项目级（`./.claude/`）适合特定项目。`npx skills` 安装的是文件副本，技能更新后需重新运行命令覆盖安装。

---

## 命名规则

- **`bay-` 前缀**：扇贝基础设施相关或扇贝特有逻辑的 skill（如 `bay-yuque`、`bay-gitlab`）
- **无前缀**：全公司通用、不绑定扇贝基础设施的 skill（如 `tidy-first`、`writing-prds`）

---

## 贡献指南

### 开发环境搭建

```bash
git clone git@git.17bdc.com:ai-coding/ai-dev-kit.git
cd ai-dev-kit
./setup.sh   # 启用 git hooks
```

### 目录结构

```
ai-dev-kit/
├── .claude-plugin/           # Claude Code Plugin 主配置（marketplace.json）
├── docs/                     # 文档资源
├── scripts/                  # 本仓库自用脚本（check-skills.sh 等）
└── plugins/                  # 各插件目录（每个对应一个可安装的 Plugin）
    ├── bay-base/
    │   ├── .claude-plugin/plugin.json
    │   ├── skills/           # skill 实体目录（无软链）
    │   │   ├── ai-dev-kit-guide/
    │   │   ├── bay-yuque/
    │   │   └── ...
    │   ├── agents/           # subagent 定义
    │   └── hooks/            # hook 配置和脚本（hooks.json 为 plugin 级入口）
    ├── bay-rdc/
    │   └── skills/
    ├── bay-product-design/
    │   ├── skills/
    │   └── agents/
    └── bay-development/
        ├── skills/
        └── agents/
```

**关键约束**：skill 以**实体目录**形式存放在所属 plugin 下，不使用符号链接，一个 skill 只属于一个 plugin。

### 添加新 Skill

1. 判断归属的 plugin（全员→`bay-base`；RDC 跨岗位→`bay-rdc`；按岗位→`bay-product-design` / `bay-development`）
2. 在 `plugins/<plugin>/skills/<name>/` 下创建目录，添加 `SKILL.md` 和 `README.md`
3. 如需 subagent / hook / command，在同 plugin 的 `agents/` / `hooks/` / `commands/` 下放真实文件
4. 本地调试：`npx skills add ./plugins/<plugin>/skills/<name>`
5. 更新本 README 的 skill 列表
6. 递增对应 `plugins/<plugin>/.claude-plugin/plugin.json` 的 version（参考 `.claude/CLAUDE.md` 的 SemVer 说明）
7. 运行 `bash scripts/check-skills.sh` 校验一致性

### 新建 Plugin

四个 plugin 已覆盖全部场景，默认往已有 plugin 里加 skill。只有出现全新组织维度或岗位时才新建。新建步骤见 `.claude/CLAUDE.md`。
