import { NextRequest } from "next/server";
import { callDeepSeekStream } from "@/lib/deepseek";
import { englishPrompt } from "@/lib/prompts";
import type { EnglishRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: EnglishRequest = await req.json();
    if (!body.mode || !body.input) {
      return new Response(JSON.stringify({ error: "缺少必填字段", code: "INVALID_REQUEST" }), { status: 400 });
    }
    if (body.input.length > 500) {
      return new Response(JSON.stringify({ error: "输入过长", code: "INVALID_REQUEST" }), { status: 400 });
    }

    const { system, user } = englishPrompt(body.mode, body.input);

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
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: "服务异常", code: "AI_ERROR" }), { status: 500 });
  }
}
