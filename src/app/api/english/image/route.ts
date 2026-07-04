import { NextRequest } from "next/server";

/* ===================================================
   POST /api/english/image — 拍照识别英文内容
   接收 base64 图片，调用 DeepSeek 多模态识别
   =================================================== */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.image) {
      return new Response(JSON.stringify({ error: "缺少图片数据", code: "INVALID_REQUEST" }), { status: 400 });
    }

    const base64Image = body.image;
    const userMode = body.mode || "grammar";

    if (base64Image.length > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "图片太大", code: "INVALID_REQUEST" }), { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey || apiKey === "sk-your-key-here") {
      return new Response(JSON.stringify({ error: "API Key 未配置", code: "NO_API_KEY" }), { status: 500 });
    }

    const baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
    const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

    const modeHint = userMode === "essay"
      ? "这是一篇英语作文，请识别作文内容，并用 ## 翻译、## 语法解析、## 易错提醒等结构组织反馈。"
      : "请识别图片中的英文单词或句子。如果是单词，请给出 ## 发音和释义、## 重点单词详解（含例句和记忆技巧）。如果是句子/题目，请给出 ## 翻译、## 语法解析、## 重点单词、## 易错提醒。";

    const systemPrompt = `你是一位亲切的初中英语老师，擅长用简单易懂的大白话讲解英语知识。
学生上传了英语学习相关的图片，请识别其中的英文内容。
要求：
- 用 ## 标题分模块（如 ## 翻译、## 语法解析、## 重点单词、## 易错提醒）
- 发音用中文近似音标注，比如 "apple 读作 哎跑"
- 语法用大白话解释，避免专业术语
- 每个重点单词给例句
- 用鼓励的语气，像"太棒了！"、"记住哦～"
${modeHint}`;

    const userPrompt = "请识别图片中的英文内容，并用初中生能理解的语言给出详细讲解。";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(streamController) {
        try {
          const messages = [
            { role: "system", content: systemPrompt },
            { role: "user", content: [
              { type: "text", text: userPrompt },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
            ]},
          ];

          const res = await fetch(`${baseUrl}/v1/chat/completions`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ model, messages, temperature: 0.7, max_tokens: 4096, stream: true }),
            signal: controller.signal,
          });

          if (!res.ok) {
            streamController.enqueue(encoder.encode(`data: ${JSON.stringify({ error: `识别失败: ${res.status}` })}\n\n`));
            streamController.close();
            return;
          }

          const reader = res.body?.getReader();
          if (!reader) { streamController.close(); return; }

          const decoder = new TextDecoder();
          let buffer = "";
          let full = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;
              const data = trimmed.slice(6);
              if (data === "[DONE]") continue;
              try {
                const json = JSON.parse(data);
                const delta = json.choices?.[0]?.delta?.content;
                if (delta) { full += delta; streamController.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`)); }
              } catch { /* skip */ }
            }
          }

          streamController.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, full, recognizedText: full.trim() })}\n\n`));
          streamController.close();
        } catch (e) {
          const msg = e instanceof Error && e.name === "AbortError" ? "TIMEOUT" : "AI_ERROR";
          streamController.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
          streamController.close();
        } finally {
          clearTimeout(timeout);
        }
      },
    });

    return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
  } catch {
    return new Response(JSON.stringify({ error: "服务异常", code: "AI_ERROR" }), { status: 500 });
  }
}
