# 扇贝单词量测试小程序（vocabtest_wx_v2）

微信原生小程序（webview 渲染 + glass-easel）。词汇量测试：阅读 / 听力两种题型，
自适应出题；**满 35 题出现「完成测试」按钮可提前出分，100 题自动出分**（对齐 word-next
MIN/MAX_TEST_COUNT），出分 + 历史曲线 + 分享。

核心流程（对齐流程图）：
- 进入首页静默登录（已注册免弹窗）；未登录点入口 → 底部 sheet 微信授权，拒绝回首页。
- 首页两态：未测 = banner + 入口卡；已测 = 分数卡 + 重新测试 + 历史链接。
- 测试页返回 → 「退出词汇量测试？」**不保存进度**返回首页；「完成测试」→ 确认弹窗 → 出分。
- 进度条以 35 题为基准；每题自动播 uk 读音（听力可点喇叭重播）。

打点（对齐 word-next track.ts）：入口点击 `_Click{btn_name:立即开始}`、测试页进入
`_Enter{from,test_type,abtest_*}`、选项 `_Click{btn_name:选项,words_num}`、出分 `_Finish`、
历史 `_History_View{from:profile|result}` / `_History_Click{retake|edit}`。

## 目录结构

```
app.js / app.json / app.wxss      入口（onLaunch 初始化神策）
docs
  *.swagger.json     api接口文档
config/index.js                   环境前缀 + 神策 server_url（按 envVersion 切 staging/prod）
utils/
  request.js   fetch 封装 + cookie 鉴权（X-CSRFToken + Cookie auth_token，解析 Set-Cookie 回写）
  api.js       具名接口方法
  auth.js      登录态 / 微信授权登录 / 账号绑定
  quiz.js      答题逻辑（transformChoices / computeChoiceStatuses / getScore / getHeaderFeedback）
  track.js     神策埋点封装（事件对齐 word-next）
vendor/sensorsdata.js              神策官方小程序 SDK（sa-sdk-miniprogram dist/wechat）
components/navigation-bar          自定义导航栏（WeUI 风格，处理状态栏安全区）
pages/
  index    首页：阅读/听力双入口 + 最近分数 + 微信授权弹窗
  login    微信授权登录兜底页
  bind     扇贝账号密码绑定
  test     测试页：取词/答题/计分/换题/出分；听力播放音频；退出确认弹窗
  result   结果/历史页：分数 + 词汇人群分布 + 历史折线(canvas) + 详细记录 + 分享/保存图片
config/assets.js                  图片资源统一配置（baydn CDN url，注释 Figma layer name）
```

## 接口（base `https://apiv3.shanbay.com`）

- `GET  /vocabtest/words/`                取首题
- `PUT  /vocabtest/words/`                提交本题取下一题 `{score, vocab_id, vocabtestid}`
- `PUT  /vocabtest/uservocabsize/`        出分 `{test_type, vocabtestid}`
- `GET  /vocabtest/uservocabsizelog/current?test_type=N`   最近成绩
- `GET  /vocabtest/uservocabsizelog/?test_type=N&ipp=20&page=N`  历史分页
- `DELETE /vocabtest/uservocabsizelog/`   删除历史 `{ids}`

登录（v3 `/bayuser`，`app_name=vocabtest_miniprogram`）：

- `POST /bayuser/auth/miniprogram/login`     微信静默登录 `{app_name, code}`；已注册返回 User，未注册返回 403
- `POST /bayuser/auth/miniprogram/register`  微信注册 `{app_name, code, data}`（data 为 getUserProfile 授权资料）
- `POST /bayuser/login`                       扇贝账号密码登录 `{account, password}`
- `GET  /bayuser/user`                        当前登录用户（校验登录态）

分享图（imageb 服务端截图，canvas 本地绘制兜底）：

- `GET /imageb/webview/capture?url=&width=375&height=500` → `{url: 成图CDN地址}`
  - url = word-next snapshot 页 + query：`snap_by=imageb&test_type&size&over_rate&comment&user_id`
  - snapshot 页（feat/vocab-quiz-snapshot-query 分支）凭 snap_by=imageb 从 query 取数，
    头像凭 user_id 调 /bayuser/users 匿名接口；截图时机为 puppeteer networkidle0
  - 失败自动降级 `drawShareImage()`（canvas 手绘，同布局）
  - 上线前置：word-next 分支发布；imageb 成图 CDN 域名配入 downloadFile 白名单

> 旧版 v1 `wechat/app/token/` 已下线，统一改用上面的 v3 `/bayuser` 接口。会话由响应
> `Set-Cookie` 落地（auth_token / csrftoken），不再返回独立 token 字段。

分享图（结果页「保存图片」）：

- 首选 **imageb 服务端截图**：`GET /imageb/webview/capture?url&width&height` 截 word-next
  快照页（`SNAPSHOT_URL?snap_by=imageb&test_type&size&over_rate&comment&user_id`，
  数据全量走 query，头像由页面凭 user_id 调 /bayuser/users 匿名接口）→ 返回成图 CDN url
  → downloadFile → 存相册。**依赖 word-next 分支 feat/vocab-quiz-snapshot-query 部署**。
- imageb 失败自动降级 **canvas 本地绘制**（drawShareImage，复刻同一布局）。
- 上线域名清单：downloadFile 需允许 imageb 成图 CDN 域名。

## 鉴权说明（重要）

`utils/request.js` 复刻 `@shanbay/wx-common` 的 cookie 鉴权：每次请求带
`Cookie: auth_token=…; csrftoken=…` 与 `X-CSRFToken`，并把响应 `Set-Cookie` merge 回本地存储 key `cookie`。
微信小程序自身也维护 cookie jar，二者叠加。若真机出现 403/未鉴权，优先排查
`X-CSRFToken` 是否从响应 `Set-Cookie` 正确回写。

## 神策埋点

`vendor/sensorsdata.js` 为官方 `sa-sdk-miniprogram` 的 wechat 构建。`app.js onLaunch` 调
`track.init()`，按 `envVersion` 选择 server_url（release→production+token，其它→default）。
事件：`wordsapp_VocabTestEnter / _Finish / _Click / _History_View / _History_Click`。

## 本地运行

微信开发者工具打开本目录（appid 见 project.config.json）。
依赖 npm 包（当前仅 dayjs）：`npm install` 后用工具菜单或 CLI 构建：

```bash
/Applications/wechatwebdevtools.app/Contents/MacOS/cli build-npm --project $(pwd)
```

神策 SDK 仍为 vendor（`vendor/sensorsdata.js`）；折线图用原生 canvas 2d 绘制，无 echarts 依赖。

## 自动化测试（截图 / 对比 / 迭代）

基于 [miniprogram-automator](https://developers.weixin.qq.com/miniprogram/dev/devtools/auto/)，脚本在 `automation/`：

```bash
cd automation && npm install        # 首次
node e2e.js                         # 功能验收：17 项断言覆盖流程图关键路径（退出码非0=有失败）
REMOTE=manual node e2e.js           # 真机功能验收（推荐：先在工具里手动点「真机调试」连上手机，脚本复用该会话）
REMOTE=1 node e2e.js                # 真机扫码模式（控制台出二维码；当前工具版本握手不稳定，优先用 manual）
REMOTE=auto node e2e.js             # 真机免扫码自动拉起（需安卓微信 7.0.6+ / iOS 6.6.7+）
node verify.js [场景...]             # UI 校验-修复循环：按 lib/checklist.js 全量截图+自动diff+报告
node capture.js [场景名...]          # 仅截图到 automation/screenshots/（默认全部场景）
node compare.js 截图.png 基准图.png   # 单独像素对比（pixelmatch），输出差异百分比 + diff 图
node debug-chart.js                 # 结果页 canvas/数据结构检查（监听模拟器 console）
```

**QA agent 分工**（`.claude/agents/`，新建会话生效）：
- `qa-test-writer`——写测试代码（e2e 断言/场景 mock/checklist），断言只从需求侧来
  （流程图/Figma 帧/word-next），禁止读实现反推，防自证循环；只改 automation/，不碰业务代码。
- `qa-acceptance`——跑 e2e.js（功能）→ verify.js（UI）→ 对照 Figma 帧判读 MANUAL 项，
  输出结构化验收报告；只验收不改码。
- 修复由主会话（开发）按验收报告执行。三角分离：写断言 / 跑判读 / 修复互不越权。
已知坑（canvas 截图空白、双 cookie jar、silentLogin 自动恢复、mock 竞态）均已写入
两个 agent 的提示词避免误判。

**校验-修复循环**：`lib/checklist.js` 维护「场景 ↔ Figma 帧」映射（11 项，覆盖首页两态/授权、
测试页答题/选对/选错/听力/35题/双弹窗、结果页）。`verify.js` 全量截图后：有
`baselines/<场景>.png`（Figma 导出）则 pixelmatch 自动判 PASS(<5%)/WARN(<15%)/FAIL，并产出
`screenshots/diff/` 差异图；无基准图标记 MANUAL，由 AI Read 截图对照 Figma 帧逐项检查。
发现差异 → 改代码 → 重跑 verify，循环直至全绿。

- 场景定义在 `automation/lib/scenarios.js`：路由 + setData 注入 mock 数据（绕过登录/网络，纯视觉验证），数据对齐设计稿。
- 前置条件：开发者工具已登录且开启 设置→安全设置→服务端口（首次可由 `cli auto --project … --auto-port 9420` 输入 y 自动开启，需先退出工具）。
- 已知限制：`screenshot()` 不包含 canvas 图层内容（DevTools 截图机制），折线图是否绘制需用 getImageData probe 验证（参考 debug-chart.js），canvas 缓冲区像素已确认正常。
- 真机模式（`REMOTE=1`/`REMOTE=auto`）：真机基础库 ≥ 2.7.3；真机为真实会话，动登录态用例（E0/E2/E8）自动 SKIP，答题用例会发真实请求建议用测试账号；`screenshot()` 仅模拟器支持，故 verify.js / capture.js 在 REMOTE 下直接报错退出。

## 设计还原

设计稿 Figma `IR1QNDCRGXRZ` node `1064-586`。样式以 375pt 为基准，rpx = pt × 2。
品牌色 #28BEA0，答对绿框 / 答错橙框 #FF8E4C。
