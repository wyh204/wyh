import { NextRequest } from "next/server";

/* ===================================================
   POST /api/math/image — 图片识别数学题
   =================================================== */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.image) {
      return new Response(
        JSON.stringify({ error: "缺少图片数据", code: "INVALID_REQUEST" }),
        { status: 400 }
      );
    }

    const base64Image = body.image;
    const userHint = body.hint || "";

    if (base64Image.length > 10 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: "图片太大", code: "INVALID_REQUEST" }),
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey || apiKey === "sk-your-key-here") {
      return new Response(
        JSON.stringify({ error: "API Key 未配置", code: "NO_API_KEY" }),
        { status: 500 }
      );
    }

    const baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
    const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

    const systemPrompt = `你是一位初中数学老师，擅长识别图片中的数学题目。
请仔细查看图片，识别并提取其中的数学题目内容。
如果图片中有多道题，请逐一列出（用序号）。
如果图片模糊无法识别，请诚实告知。
只返回识别到的题目原文，不要添加额外解释。`;

    const userPrompt = userHint
      ? `学生上传了一道数学题的图片，并补充说明："${userHint}"。请识别图片中的题目。`
      : "学生上传了一道数学题的图片。请识别图片中的题目内容。";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(streamController) {
        try {
          // 构建带图片的 messages
          const messages = [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: [
                { type: "text", text: userPrompt },
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${base64Image}` },
                },
              ],
            },
          ];

          const res = await fetch(`${baseUrl}/v1/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              messages,
              temperature: 0.7,
              max_tokens: 4096,
              stream: true,
            }),
            signal: controller.signal,
          });

          if (!res.ok) {
            const err = await res.text();
            streamController.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ error: `识别失败: ${res.status}` })}\n\n`
              )
            );
            streamController.close();
            return;
          }

          const reader = res.body?.getReader();
          if (!reader) {
            streamController.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: "无法读取响应" })}\n\n`)
            );
            streamController.close();
            return;
          }

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
                if (delta) {
                  full += delta;
                  streamController.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`)
                  );
                }
              } catch { /* skip */ }
            }
          }

          streamController.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, full, recognizedText: full.trim() })}\n\n`
            )
          );
          streamController.close();
        } catch (e) {
          const msg = e instanceof Error && e.name === "AbortError" ? "TIMEOUT" : "AI_ERROR";
          streamController.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`)
          );
          streamController.close();
        } finally {
          clearTimeout(timeout);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "服务异常", code: "AI_ERROR" }),
      { status: 500 }
    );
  }
}
