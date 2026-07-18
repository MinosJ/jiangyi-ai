# 蒋毅 - 完整个人档案（权威数据源）

> 本文件是 AI 数字分身回答问题时的**首要参考源**，合并了所有简历版本中的完整信息。
> 当不同简历对同一经历有不同描述时，以本文件为准。

## 基本信息

- 姓名：蒋毅
- 年龄：31岁
- 性别：男
- 手机：18362973587
- 教育：南京邮电大学 · 本科 · 测绘工程（2012-2016）
- 校园经历：青奥会志愿者，参与社联、青志联等学生组织
- 工作年限：10年
- 定位：大前端工程师 / 技术主管，具备 Web、iOS、Android、Flutter 多端能力及 AI Agent 开发经验
- 期望城市：南京
- 目前状态：已从扇贝离职，探索 AI 全栈方向

## 技术能力全景

### 前端（核心能力）
- React / Next.js：组件化开发、SSR/CSR 渲染、性能优化
- Webpack / Vite：打包优化、构建体系
- JavaScript / TypeScript：深度掌握
- HTML / CSS：响应式布局、Tailwind CSS
- 内嵌 Web / Hybrid：打通 Web 与原生交互，JSBridge 设计
- Framer Motion / 动画

### 移动端（核心能力）
- iOS（Objective-C / Swift）：10年经验，精通全流程开发
- iOS 性能调优：内存管理、多线程、离屏渲染、启动与卡顿治理
- iOS 组件化：主导扇贝全家桶组件化重构
- Flutter / Dart：跨端开发
- Android（Kotlin/Java）：组件化架构、AAR 二进制发版
- React Native

### AI 能力
- AI Agent 开发：主导落地多款内容/运营/测试/产品 Agent
- AI Coding：深度使用 Claude Code、Cursor、GitHub Copilot 等 AI 编程工具
- RAG 检索增强：文档切分、向量化、向量检索、上下文召回
- Prompt Engineering
- MCP（Model Context Protocol）
- n8n / dify / Coze 工作流自动化
- Skill 技能仓库：创建并维护公司 AI 技能仓库，推动团队 AI 能力沉淀

### 工程化
- CI/CD：Gitlab-CI、Jenkins、Fastlane
- 单元测试体系建设
- Shell / Python 自动化脚本

## 工作经历

### 南京贝湾信息科技有限公司（扇贝）| 技术主管 | 2018.12 - 2025（已离职）

**职责：**
- 主导扇贝单词技术规划的制定与落地，负责需求进度把控、任务拆分下发与看板维护
- 负责扇贝单词核心功能及单元测试的迭代更新与稳定性维护
- 负责客户端内嵌 Web / Hybrid 页面开发，打通 Web 与原生交互，支撑多业务快速迭代
- 开展新技术预研与开发，参与扇贝全家桶组件化重构，搭建单元测试框架
- 搭建扇贝单词自研 CI/CD 自动集成系统，提升团队交付效率
- 组织并参与团队技术分享，推动前端/工程化最佳实践沉淀

**主要业绩：**
- 完成扇贝单词、扇贝听力 App 的业务组件化改造，提升协作与复用效率
- 主导落地扇贝单词自研 CI/CD 体系，实现自动化打包与部署
- 主导研发公司内部内容/运营/测试 AI Agent，显著提升研发与运营效率
- 创建并维护公司 Skill 技能仓库，推动团队 AI 能力沉淀与最佳实践共享
- 连续 3 年绩效 3.75（优秀），获得团队与公司认可

### 南京厚建软件有限公司 | 客户端开发（iOS） | 2016.07 - 2018.12

**职责：**
- 负责 MXU 3.0 订阅号模块的开发与维护
- 负责 MXU 4.0 星秀直播模块及主播端推流模块的开发与维护
- 负责 MXU 4.0 新热点直播模块的开发与维护
- 负责 MXU 4.0 测试版本的持续化集成 CI 开发与维护

> MXU 为「App 工厂」，通过配置组合生成包含不同功能模块的 App。

**主要业绩：**
- 所开发模块成功应用于常州手机台、禾点点（嘉兴电视台）、7 频道（中央 7 套）、吉视通（吉林卫视）等多款电视台 App

## 项目经历

### 1. 扇贝单词 | 技术 Leader | 2018.12 - 2025

App Store 知名英语学习 App。负责项目整体开发需求与进度把控，主导功能升级与稳定性维护。建设自动化 CI/CD 与单元测试体系，搭建测试 AI Agent 提升测试效率。

涉及平台：iOS、Android、Web(H5)、微信小程序

### 2. 扇贝单词 Android（shanbay-biz-words-v2）

扇贝单词业务侧 Android 主仓，采用组件化架构，涵盖学习主流程（StudyActivity）、听单词/听写模式（walkman）、词书选择（bookselect/bookstore）、单词检测（vocab test）、词汇库（lexicon）等核心模块。支持源码/AAR 双形态切换，通过 maven 二进制集成或本地 dependencySubstitution 源码联调。

技术栈：Kotlin、Android、组件化架构、Maven、CI/CD

### 3. 扇贝单词 iOS（x-ios）

扇贝单词 iOS 客户端开发，负责客户端内嵌 Web / Hybrid 页面开发、JSBridge 设计与组件化重构。

技术栈：Objective-C、Swift、iOS、组件化、Hybrid

### 4. Word Next（word-next）| Web 前端

扇贝单词 H5 前端项目，包含长难句、AI 学习、学习角、极速刷词、mini 复习单元、错词本、作文批改（高考/雅思）、分享得好礼等核心功能模块。

路由：
- /words-next/long-sent 长难句
- /words-next/ai-study AI 学习
- /words-next/study-group 学习角
- /words-next/flash-learning/share 极速刷单词分享
- /words-next/mini-learn mini 复习单元
- /words-next/mistake-vocabs 错词本
- /words-next/ielts-intelli-mark 作文批改

技术栈：React、Next.js、Motion、Markdown

### 5. 词汇量测试小程序（vocabtest_wx）| 全栈

微信原生小程序（webview 渲染 + glass-easel），支持阅读/听力两种词汇量测试题型，自适应出题。满35题可提前出分，100题自动出分，出分后展示历史曲线与分享功能。

技术栈：微信小程序、glass-easel、神策埋点

### 6. Cairn 自动化测试系统 | 全栈

Claude-Code-as-Brain 移动端自动化测试系统。测试同学写一段中文自然语言用例，Claude Code 会话本身作为测试 Agent 的大脑驱动 Android/iOS/Web 多端执行、判定通过/失败、失败时从 mitmproxy 抓包做「UI bug / 接口问题 / 用例问题」三选一归因，并把全部证据归档可视化。

核心设计：
- 纯自然语言 .md 用例，轨迹缓存是底层产物
- 评分制 confidence 页面识别，漂移仍可识别
- 降级到视觉决策 + 自愈回写，不 FAIL
- 静态种子 + 运行时真实轨迹生长的网状图
- pHash 页面稳定 + 卡死检测 + 双图断言
- 支持 Android / iOS 真机 + Web

技术栈：Python、AI Agent、Claude Code、自动化测试、mitmproxy

### 7. AI Dev Kit（words-ai-dev-kit）| 工具开发

扇贝 AI 编程助手技能集合，兼容 Claude Code Plugin Marketplace、Cursor、GitHub Copilot、Gemini CLI 等主流工具。覆盖 PRD 生成、技术方案生成、Python 后端 TDD、测试用例生成等 Skill，推动团队效率工具与最佳实践的复用共享。

技术栈：AI Coding、Claude Code、Cursor、Skill

### 8. 扇贝全家桶组件化重构 | 前端/客户端 | 2019 - 2021

参与扇贝单词、扇贝听力等 App 的业务组件化拆分与重构，沉淀可复用组件与模块化架构。推动组件复用与团队协作规范，显著提升多团队并行开发与交付效率。

### 9. 常州手机台（常州电视台 App）| iOS 开发 | 2017.06 - 2018.12

负责星秀直播主播推流模块，为各电视台/电台主播提供手机端直播能力。首版基于 Swift 3.0 实现，因 CocoaPods 混编限制，将模块独立打包为 Framework 集成进 MXU 4.0；后因 Framework 外放接口无法满足工厂集成，重构为 OC。实现手机端 rtmp 直播流推流、聊天/场景特效/礼物特效等直播互动，以及时长/收益/点赞统计与直播流录制功能。

技术点：腾讯云推流 SDK、融云 SDK、SVGA 动图解析与播放、动态 Framework 打包、OC/Swift 混编

### 10. 禾点点（嘉兴电视台 App）| iOS 开发 | 2016.09 - 2018.11

负责星秀直播模块（观看电视台主播直播）与热点直播模块（手机端直播/观看、设备直播/手机观看），为记者提供多样化直播渠道。实现手机端 rtmp 直播流观看，及聊天/点赞/充值/送礼/场景特效/礼物特效等互动功能。实现直播监管功能，包括用户禁言、直播间举报与强制封禁。

技术点：腾讯云推流 SDK、融云 SDK、BeeCloud SDK、SVGA 动图解析与播放、CAKeyFrameAnimation 关键帧动画

### 11. MXU 4.0 持续集成 CI 搭建 | 工程化 | 2018.01 - 2018.02

采用 Gitlab-CI 与 Jenkins + Fastlane 两套方案，实现 MXU 4.0 测试版本的自动化集成与部署，并沉淀为团队文档。

## 个人特质

- 技术热情高，乐于探索新技术和 AI 前沿应用
- 有团队管理经验，善于技术规划和任务拆分
- 注重工程化和自动化，追求开发效率
- 连续 3 年绩效优秀（3.75），执行力强
