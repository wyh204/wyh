import { NextRequest } from "next/server";

/* ================================================================
   POST /api/yuwen/fun — 随机获取趣味拓展知识点
   根据 type 返回: story(背景故事) / game(生字) / idiom(成语)
   ================================================================ */

const PROMPTS: Record<string, string> = {
  story: `你是一位亲切的初中语文老师。请随机生成一篇适合初中生阅读的课文背景故事或作者趣事。
要求：
- 选一个初中语文课本中常见的作者或课文（如鲁迅、朱自清、范仲淹、欧阳修、苏轼、诸葛亮、《岳阳楼记》《出师表》《桃花源记》《醉翁亭记》《背影》等）
- 用生动有趣的语言讲述，200-300字
- 包含一个有趣的文学冷知识或历史背景细节
- 用"《标题》"作为开头
- 语气亲切但不过于幼稚，适合初中生阅读`,

  game: `你是一位初中语文老师。请随机生成一个初中语文重点字词的学习卡片。
要求：
- 随机选一个初中阶段需要掌握的重点字词（优先选择文言文常见虚词或实词，如：之、其、而、以、焉、乎、乃、于、则、者、也、何、安、遂、尝、既等）
- 给出：字词、拼音、释义（准确简洁）、3个组词或例句（优先出自课本）、1个有趣的记忆方法
- 记忆方法要结合文言文语境，帮助理解
- 用JSON格式返回：{"char":"字","pinyin":"读音","definition":"释义","words":["词1","词2","词3"],"memoryTip":"记忆方法"}`,

  idiom: `你是一位初中语文老师。请随机生成一个成语学习卡片。
要求：
- 随机选一个初中阶段需要掌握的成语（优先选择出自课本古文或中考常考成语）
- 给出：成语、拼音、释义（准确）、出处（出自哪篇课文或古籍）、一个贴近初中生学习生活的例句
- 释义需准确，可使用适当的书面语
- 例句要贴近初中生的学习和生活
- 用JSON格式返回：{"idiom":"成语","pinyin":"拼音","meaning":"释义","source":"出处","example":"例句"}`,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = body.type as string;
    if (!type || !PROMPTS[type]) {
      return new Response(JSON.stringify({ error: "无效类型" }), { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey || apiKey === "sk-your-key-here") {
      return new Response(JSON.stringify({ error: "API Key 未配置", code: "NO_API_KEY" }), { status: 500 });
    }

    const baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
    const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: PROMPTS[type] },
          { role: "user", content: type === "game" || type === "idiom" ? "请直接返回JSON，不要其他内容。" : "请生成一个课文背景故事或作者趣事。" },
        ],
        temperature: 1.2,
        max_tokens: 600,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "AI 服务异常" }), { status: 500 });
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content || "";

    // 解析返回内容
    if (type === "game") {
      try {
        // 尝试提取JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return new Response(JSON.stringify({ type, data: parsed }));
        }
      } catch { /* fall through */ }
      // 回退：手动解析
      return new Response(JSON.stringify({ type, raw: content }));
    }

    if (type === "idiom") {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return new Response(JSON.stringify({ type, data: parsed }));
        }
      } catch { /* fall through */ }
      return new Response(JSON.stringify({ type, raw: content }));
    }

    // story 直接返回文本
    return new Response(JSON.stringify({ type, data: { title: "", content: content } }));
  } catch (e) {
    const msg = e instanceof Error && e.name === "AbortError" ? "TIMEOUT" : "AI_ERROR";
    return new Response(JSON.stringify({ error: msg }), { status: 500 });
  }
}
