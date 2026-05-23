import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";
import { yuwenPrompt } from "@/lib/prompts";
import type { YuwenRequest } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: YuwenRequest = await req.json();
    if (!body.mode || !body.input) {
      return NextResponse.json(
        { error: "缺少必填字段 mode 或 input", code: "INVALID_REQUEST" },
        { status: 400 },
      );
    }
    if (body.input.length > 500) {
      return NextResponse.json(
        { error: "输入内容过长，请控制在500字以内", code: "INVALID_REQUEST" },
        { status: 400 },
      );
    }

    const { system, user } = yuwenPrompt(body.mode, body.input);
    const responseText = await callDeepSeek(system, user);

    if (body.mode === "essay") {
      try {
        const parsed = JSON.parse(responseText);
        return NextResponse.json({ data: { hooks: Array.isArray(parsed) ? parsed : parsed.hooks || [] } });
      } catch {
        return NextResponse.json({ data: { hooks: [], raw: responseText } });
      }
    }

    return NextResponse.json({ data: { raw: responseText } });
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "NO_API_KEY") {
        return NextResponse.json({ error: "API Key 未配置", code: "NO_API_KEY" }, { status: 503 });
      }
      if (e.message === "TIMEOUT") {
        return NextResponse.json({ error: "AI 响应超时，请重试", code: "TIMEOUT" }, { status: 504 });
      }
    }
    return NextResponse.json({ error: "AI 服务异常，请稍后重试", code: "AI_ERROR" }, { status: 500 });
  }
}
