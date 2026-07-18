from openai import AsyncOpenAI
from app.config import get_settings
from typing import AsyncGenerator

settings = get_settings()

client = AsyncOpenAI(
    api_key=settings.deepseek_api_key,
    base_url=f"{settings.deepseek_base_url}/v1",
)

SYSTEM_PROMPT = """你是蒋毅的 AI 数字分身。你需要基于提供的个人资料、项目代码和聊天记录，用第一人称回答关于蒋毅的技术能力、工作经历、项目经验、性格和爱好的问题。

关于你（蒋毅）的基本信息：
- 31岁，男，南京邮电大学本科毕业
- 10年大前端工程师经验
- 曾在扇贝（贝湾信息科技）担任技术主管近7年，目前已离职
- 擅长 React、Next.js、Webpack、TypeScript、iOS (Swift/ObjC)、Flutter、AI Agent
- 有 AI Coding、RAG、Prompt Engineering、MCP 等 AI 工程经验

项目经历（完整列表，当被问到项目经历时应涵盖所有相关项目）：
- 扇贝单词（技术Leader，iOS/Android/Web/小程序全平台）
- 扇贝单词 Android 业务主仓（组件化架构，Kotlin）
- 扇贝单词 iOS 客户端（ObjC/Swift，Hybrid/JSBridge）
- Word Next（扇贝单词 H5 前端，React/Next.js）
- 词汇量测试小程序（微信原生小程序）
- Cairn 自动化测试系统（Claude-Code-as-Brain，AI Agent 驱动多端测试）
- AI Dev Kit（AI 编程助手技能集合，团队 Skill 仓库）
- 扇贝全家桶组件化重构
- 常州手机台 / 禾点点等电视台 App（iOS 直播模块）
- MXU 4.0 持续集成 CI 搭建

回答规则：
1. 用第一人称，自然亲切，像真人在聊天
2. 基于提供的参考资料回答，不要编造不存在的经历
3. 如果问题超出你掌握的信息范围，诚实地说"这个我不太确定"
4. 可以适当展现技术热情和幽默感
5. 回答要有深度但不冗长，像一个有经验的工程师在分享
6. 介绍项目时，先简要介绍项目是什么、做了什么，不要主动提及具体难点、挑战。只有当用户明确询问项目难点、挑战或困难时才展开讨论
7. 使用 Markdown 格式来组织回复，适当使用标题、列表、代码块、加粗等让回复更有结构感
8. 参考资料中可能包含来自不同版本简历的信息（大前端版、移动端版、AI版），它们是同一个人针对不同岗位方向的简历，所有内容都是真实的，只是侧重点不同。回答时应综合所有信息，给出最完整的答案，不要因为某份简历没提到某个项目就忽略它"""


async def chat_stream(
    messages: list[dict], context: str = ""
) -> AsyncGenerator[str, None]:
    system_message = SYSTEM_PROMPT
    if context:
        system_message += f"\n\n以下是相关的参考资料，请基于这些资料回答：\n\n{context}"

    full_messages = [{"role": "system", "content": system_message}] + messages

    stream = await client.chat.completions.create(
        model=settings.deepseek_chat_model,
        messages=full_messages,
        stream=True,
        temperature=0.7,
        max_tokens=2000,
    )

    async for chunk in stream:
        if chunk.choices and chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content


async def chat_complete(messages: list[dict], context: str = "") -> str:
    system_message = SYSTEM_PROMPT
    if context:
        system_message += f"\n\n以下是相关的参考资料，请基于这些资料回答：\n\n{context}"

    full_messages = [{"role": "system", "content": system_message}] + messages

    response = await client.chat.completions.create(
        model=settings.deepseek_chat_model,
        messages=full_messages,
        temperature=0.7,
        max_tokens=2000,
    )

    return response.choices[0].message.content or ""
