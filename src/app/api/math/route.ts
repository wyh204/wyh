import { NextRequest } from "next/server";
import { callDeepSeekStream } from "@/lib/deepseek";
import { mathPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.question) {
      return new Response(JSON.stringify({ error: "缺少必填字段 question", code: "INVALID_REQUEST" }), { status: 400 });
    }
    if (body.question.length > 500) {
      return new Response(JSON.stringify({ error: "输入过长", code: "INVALID_REQUEST" }), { status: 400 });
    }

    const { system, user } = mathPrompt(body.question);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let full = "";
          for await (const chunk of callDeepSeekStream(system, user)) {
            full += chunk;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: chunk })}\n\n`));
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, full })}\n\n`));
          controller.close();
        } catch (e) {
          const msg = e instanceof Error ? e.message : "AI_ERROR";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "服务异常", code: "AI_ERROR" }), { status: 500 });
  }
}
